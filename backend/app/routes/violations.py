from fastapi import APIRouter, HTTPException, Query
from app.core.database import database
from typing import List, Optional
from bson import ObjectId

router = APIRouter()

@router.get("/stats")
async def get_violation_stats():
    """
    Get aggregated statistics for the violations dashboard.
    """
    pipeline = [
        {"$unwind": "$violations"},
        {"$group": {
            "_id": None,
            "total_violations": {"$sum": 1},
            "avg_confidence": {"$avg": "$violations.confidence"},
            "avg_impact": {"$avg": "$violations.impact_score"},
            "critical_count": {
                "$sum": {"$cond": [{"$eq": ["$violations.severity", "critical"]}, 1, 0]}
            },
            "high_count": {
                "$sum": {"$cond": [{"$eq": ["$violations.severity", "high"]}, 1, 0]}
            },
            "medium_count": {
                "$sum": {"$cond": [{"$eq": ["$violations.severity", "medium"]}, 1, 0]}
            },
            "low_count": {
                "$sum": {"$cond": [{"$eq": ["$violations.severity", "low"]}, 1, 0]}
            }
        }}
    ]

    try:
        stats = await database.get_collection("products").aggregate(pipeline).to_list(1)
        if not stats:
            return {
                "total_violations": 0,
                "avg_confidence": 0,
                "avg_impact": 0,
                "critical_count": 0,
                "high_count": 0,
                "medium_count": 0,
                "low_count": 0
            }
        
        result = stats[0]
        result.pop("_id", None)
        return result
    except Exception as e:
        print(f"Error fetching stats: {e}")
        raise HTTPException(status_code=500, detail="Internal Server Error")

@router.get("/")
async def get_violations(
    skip: int = 0,
    limit: int = 20,
    sort_by: str = "impact_score",
    severity: Optional[str] = None,
    status: Optional[str] = None
):
    """
    Get a flattened list of violations with pagination, sorting, and filtering.
    """
    pipeline = [
        {"$unwind": {"path": "$violations", "includeArrayIndex": "violation_index"}},
        {"$project": {
            "_id": {"$toString": "$_id"},
            "product_name": "$name",
            "product_image": {"$arrayElemAt": ["$images", 0]},
            "violation": "$violations",
            "violation_index": "$violation_index",
            "timeline": "$timeline",
            "detected_at": "$created_at"
        }}
    ]

    # Filters
    match_stage = {}
    if severity:
        match_stage["violation.severity"] = severity
    if status:
        match_stage["violation.status"] = status
    
    if match_stage:
        pipeline.append({"$match": match_stage})

    # Sorting
    sort_dir = -1  # Descending by default
    pipeline.append({"$sort": {f"violation.{sort_by}": sort_dir}})

    # Pagination
    pipeline.append({"$skip": skip})
    pipeline.append({"$limit": limit})

    try:
        results = await database.get_collection("products").aggregate(pipeline).to_list(limit)
        return results
    except Exception as e:
        print(f"Error fetching violations: {e}")
        raise HTTPException(status_code=500, detail="Internal Server Error")
