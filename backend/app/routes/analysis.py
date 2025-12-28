from fastapi import APIRouter, HTTPException, Body
from app.models.product import ProductSchema, ViolationSchema
from app.services.compliance_engine import compliance_engine
from app.core.database import database
from typing import Dict, Any

router = APIRouter()

import logging
logging.basicConfig(filename='debug.log', level=logging.INFO, format='%(asctime)s %(message)s')

@router.post("/", response_model=ProductSchema)
async def analyze_product(payload: Dict[str, Any] = Body(...)):
    """
    Analyze a product listing for compliance violations.
    Input: {"url": "..."} OR {"manual_data": {...}}
    """
    # Mock Analysis Logic (Replace with AI Integration later)
    url = payload.get("url")
    manual_data = payload.get("manual_data")
    
    if not url and not manual_data:
        raise HTTPException(status_code=400, detail="Please provide product URL or manual details")

    # TODO: Helper function to scrape URL or parse manual data
    product_name = "Sample Product"
    product_description = ""
    product_price = "₹0"
    product_mrp = "₹0"
    product_category = "general"
    product_image_url = ""

    if manual_data:
        product_name = manual_data.get("title", "Unknown Product")
        product_description = manual_data.get("description", "")
        product_price = manual_data.get("price", "0")
        product_mrp = manual_data.get("mrp", "0")
        product_category = manual_data.get("category", "general")
        product_image_url = manual_data.get("image_url", "")

    # Run Compliance Engine
    analysis_input = {
        "title": product_name,
        "description": product_description,
        "price": product_price,
        "mrp": product_mrp,
        "category": product_category,
        "image_url": product_image_url
    }
    
    logging.info("DEBUG: Starting Compliance Engine...")
    analysis_result = compliance_engine.evaluate_product(analysis_input)
    logging.info("DEBUG: Compliance Engine Finished.")

    result = ProductSchema(
        name=product_name,
        description=product_description,
        price=product_price,
        mrp=product_mrp,
        category=product_category,
        url=url,
        images=[product_image_url] if product_image_url else [],
        compliance_score=analysis_result["compliance_score"],
        risk_level=analysis_result["risk_level"],
        violations=analysis_result["violations"]
    )



    # Save to MongoDB (Best Effort)
    product_dict = result.dict()
    logging.info("DEBUG: Connecting to MongoDB...")
    try:
        await database.get_collection("products").insert_one(product_dict)
        logging.info("DEBUG: MongoDB Insert Complete.")
    except Exception as e:
        logging.error(f"DEBUG: MongoDB Insert Failed: {e}")
        # Continue without saving to prevent UI hang
    
    return result

@router.get("/report/{report_id}")
async def get_report(report_id: str):
    return {"message": "Report fetching not implemented yet"}
