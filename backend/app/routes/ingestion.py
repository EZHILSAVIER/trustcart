from fastapi import APIRouter, HTTPException, BackgroundTasks
from pydantic import BaseModel
from typing import Optional
from datetime import datetime
from app.core.database import database
from app.ai.nlp_engine import nlp_engine
from app.models.product import TimelineEvent

router = APIRouter()

class TextIngestRequest(BaseModel):
    text: str
    source: str = "Unknown" # e.g., "Email", "Invoice"

class UrlIngestRequest(BaseModel):
    url: str

async def analyze_and_update(product_id: str, text: str):
    """
    Background task to run full analysis after ingestion
    """
    # 1. Analyze
    analysis_result = nlp_engine.analyze(text)
    
    # 2. Compute Risk Score
    score = nlp_engine.compute_risk_score(analysis_result)
    
    # 3. Create Timeline Event
    analyzed_event = TimelineEvent(
        event="Compliance Analysis",
        details=f"Risk Score: {score['impact_score']}, Confidence: {score['confidence']}"
    ).dict()
    
    # 4. Update DB
    collection = database.get_collection("products")
    await collection.update_one(
        {"_id": product_id},
        {
            "$set": {
                "compliance_score": 100 - score["impact_score"],
                "risk_level": "High" if score["impact_score"] > 50 else "Low", 
                # Note: In a real app we'd map violations properly here
            },
            "$push": {
                "timeline": analyzed_event
            }
        }
    )

@router.post("/text")
async def ingest_text(request: TextIngestRequest, background_tasks: BackgroundTasks):
    collection = database.get_collection("products")
    
    # Create initial product entry
    product_doc = {
        "name": "Ingested Product " + datetime.utcnow().strftime("%Y-%m-%d %H:%M"),
        "description": request.text[:200] + "...",
        "price": "Unknown", # Would need regex to extract
        "compliance_score": 100, # Start perfect, then degrade
        "risk_level": "Processing",
        "violations": [],
        "timeline": [
            TimelineEvent(
                event="Data Ingested",
                details=f"Source: {request.source}"
            ).dict()
        ],
        "created_at": datetime.utcnow()
    }
    
    result = await collection.insert_one(product_doc)
    
    # Trigger background analysis
    background_tasks.add_task(analyze_and_update, result.inserted_id, request.text)
    
    return {"id": str(result.inserted_id), "status": "Ingested, analysis queued"}

@router.post("/url")
async def ingest_url(request: UrlIngestRequest, background_tasks: BackgroundTasks):
    # In a real scenario, we'd fetch the URL content here.
    # For now, we'll simulate it.
    
    collection = database.get_collection("products")
    
    product_doc = {
        "name": "Product from URL",
        "url": request.url,
        "price": "Pending",
        "compliance_score": 100,
        "risk_level": "Processing",
        "violations": [],
        "timeline": [
            TimelineEvent(
                event="Data Ingested",
                details=f"Source: URL ({request.url})"
            ).dict()
        ],
        "created_at": datetime.utcnow()
    }
    
    result = await collection.insert_one(product_doc)
    
    # Simulate text extraction
    mock_text = f"Product content from {request.url}. This is a placeholder for scraped content."
    background_tasks.add_task(analyze_and_update, result.inserted_id, mock_text)
    
    return {"id": str(result.inserted_id), "status": "URL queued for scraping and analysis"}
