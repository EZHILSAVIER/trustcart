from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime

class ViolationSchema(BaseModel):
    type: str = Field(..., example="Trademark Infringement")
    severity: str = Field(..., example="high")
    description: str = Field(..., example="Logo resembles protected trademark")
    evidence: str = Field(..., example="92% match with Gucci logo")

class ProductSchema(BaseModel):
    name: str = Field(..., example="Luxury Handbag")
    description: Optional[str] = Field(None, example="High quality leather bag")
    price: str = Field(..., example="₹12,000")
    url: Optional[str] = Field(None, example="https://amazon.in/product/123")
    seller: Optional[str] = Field(None, example="Unknown Seller")
    images: List[str] = Field(default=[], example=["http://img.com/1.jpg"])
    mrp: Optional[str] = Field(None, example="₹15,000")
    category: Optional[str] = Field(None, example="electronics")
    
    compliance_score: int = Field(..., ge=0, le=100)
    risk_level: str = Field(..., example="High Risk")
    violations: List[ViolationSchema] = []
    created_at: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        json_schema_extra = {
            "example": {
                "name": "Luxury Handbag",
                "price": "₹12,000",
                "compliance_score": 65,
                "risk_level": "High Risk",
                "violations": [{
                    "type": "Trademark Infringement",
                    "severity": "high",
                    "description": "Logo matches Gucci",
                    "evidence": "Pattern match > 90%"
                }]
            }
        }
