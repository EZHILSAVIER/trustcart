from fastapi import APIRouter, Query, HTTPException
from typing import List, Optional
from app.core.database import database
from app.models.product import ProductSchema
from bson import ObjectId

router = APIRouter()

def product_helper(product) -> dict:
    return {
        "id": str(product["_id"]),
        "name": product["name"],
        "description": product.get("description", ""),
        "price": product.get("price", 0),
        "compliance_score": product.get("compliance_score", 0),
        "risk_level": product.get("risk_level", "Unknown"),
        "violations_count": len(product.get("violations", [])),
        "created_at": product.get("created_at"), # Assuming this exists or we add it
        # Safely get first image or placeholder
        "image_url": product.get("images", [""])[0] if product.get("images") else None
    }

@router.get("/", response_description="List all analyzed products")
async def get_products(
    skip: int = 0,
    limit: int = 20,
    risk_level: Optional[str] = None,
    category: Optional[str] = None,
    search: Optional[str] = None
):
    collection = database.get_collection("products")
    
    # Build Query
    query = {}
    if risk_level and risk_level != "All":
        query["risk_level"] = risk_level
    
    if search:
        query["name"] = {"$regex": search, "$options": "i"}

    try:
        # Execute
        total_count = await collection.count_documents(query)
        cursor = collection.find(query).skip(skip).limit(limit).sort("_id", -1) # Sort by newest
        products = await cursor.to_list(length=limit)
        
        return {
            "total": total_count,
            "page": (skip // limit) + 1,
            "data": [product_helper(p) for p in products]
        }
    except Exception as e:
        print(f"DB Error: {e}")
        return {"total": 0, "page": 1, "data": []}

@router.get("/{id}", response_description="Get a single product report")
async def get_product(id: str):
    collection = database.get_collection("products")
    if not ObjectId.is_valid(id):
        raise HTTPException(status_code=400, detail="Invalid ID format")
    
    product = await collection.find_one({"_id": ObjectId(id)})
    if product:
        # Return full details including full violations list
        p = product_helper(product)
        p["violations"] = product.get("violations", [])
        return p
        
    raise HTTPException(status_code=404, detail="Product not found")
