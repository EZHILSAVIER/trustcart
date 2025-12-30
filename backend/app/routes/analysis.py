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

    from app.services.scraper_engine import scraper_engine
    
    # Scrape URL if provided
    if url:
        scraped_data = scraper_engine.scrape_url(url)
        if not scraped_data or "error" in scraped_data:
            error_msg = scraped_data.get("error", "Failed to scrape product data from URL")
            raise HTTPException(status_code=400, detail=error_msg)
        
        product_name = scraped_data["title"]
        product_description = scraped_data["description"]
        product_price = scraped_data["price"]
        product_mrp = scraped_data.get("mrp", "0")
        product_category = scraped_data["category"]
        product_image_url = scraped_data["image_url"]
    
    # Use Manual Data if provided (Fallback or Override)
    if manual_data:
        product_name = manual_data.get("title", product_name)
        product_description = manual_data.get("description", product_description)
        product_price = manual_data.get("price", product_price)
        product_mrp = manual_data.get("mrp", product_mrp)
        product_category = manual_data.get("category", product_category)
        product_image_url = manual_data.get("image_url", product_image_url)

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

    # Price Intelligence
    try:
        from app.services.price_intelligence import price_intelligence
        deals = price_intelligence.find_deals(product_name, product_price)
    except Exception as e:
        logging.error(f"Price Intelligence Error: {e}")
        deals = []

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
        violations=analysis_result["violations"],
        deals=deals
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
