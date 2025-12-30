from typing import Dict, List, Any
from app.models.product import ViolationSchema
from app.services.pricing import pricing_engine
from app.services.image_engine import image_engine
from app.ai.nlp_engine import nlp_engine

# Rule Catalog
RULES_CATALOG = {
    "MRP_REQUIRED": {
        "severity": "high", 
        "weight": 15, 
        "description": "MRP is mandatory but missing",
        "regulation": {"act": "Legal Metrology Act, 2009", "section": "Rule 6(1)"},
        "fix": "Ensure the 'mrp' field is present and greater than 0."
    },
    "FAKE_DISCOUNT": {
        "severity": "high", 
        "weight": 20, 
        "description": "Discount exceeds 80% or is suspicious",
        "regulation": {"act": "Consumer Protection (E-Commerce) Rules, 2020", "section": "Rule 4(2)"},
        "fix": "Reduce the discount percentage to under 80% or justify the pricing."
    },
    "PRICE_HIGHER_THAN_MRP": {
        "severity": "high", 
        "weight": 25, 
        "description": "Selling Price > MRP",
        "regulation": {"act": "Legal Metrology Act, 2009", "section": "Section 18"},
        "fix": "Selling price cannot exceed the Maximum Retail Price (MRP)."
    },
    "RESTRICTED_KEYWORD": {
        "severity": "high", 
        "weight": 30, 
        "description": "Product contains restricted/prohibited terms",
        "regulation": {"act": "Consumer Protection Act, 2019", "section": "Section 2(9)"},
        "fix": "Remove the prohibited term from the title or description."
    },
    "BRAND_INFRINGEMENT": {
        "severity": "high", 
        "weight": 40, 
        "description": "Potential counterfeit of protected brand",
        "regulation": {"act": "Trade Marks Act, 1999", "section": "Section 29"},
        "fix": "Ensure you have authorization to use this brand name or remove it."
    },
    "MISSING_IMAGE": {
        "severity": "medium", 
        "weight": 10, 
        "description": "Product image is missing",
        "regulation": {"act": "E-Commerce Guidelines", "section": "Visuals"},
        "fix": "Upload at least one clear image of the product."
    },
    "WATERMARK_DETECTED": {
        "severity": "low", 
        "weight": 5, 
        "description": "Image contains watermark/text overlay",
        "regulation": {"act": "Platform Policy", "section": "Image Guidelines"},
        "fix": "Use a clean product image without text overlays or watermarks."
    },
    "MANDATORY_FIELD_MISSING": {
        "severity": "medium", 
        "weight": 10, 
        "description": "Category-specific mandatory field missing",
        "regulation": {"act": "Consumer Protection (E-Commerce) Rules, 2020", "section": "Rule 5"},
        "fix": "Fill in the missing mandatory attributes for this category."
    },
    "TITLE_TOO_SHORT": {
        "severity": "low", 
        "weight": 5, 
        "description": "Title is too short (< 10 words)",
        "regulation": {"act": "Platform Policy", "section": "Quality"},
        "fix": "Expand the title to be more descriptive (min 3 words)."
    },
    "TITLE_ALL_CAPS": {
        "severity": "low", 
        "weight": 5, 
        "description": "Title is in ALL CAPS",
        "regulation": {"act": "Platform Policy", "section": "Quality"},
        "fix": "Use Title Case instead of ALL CAPS."
    },
    "INAPPROPRIATE_CONTENT": {
        "severity": "high", 
        "weight": 50, 
        "description": "Inappropriate/NSFW content detected in image",
        "regulation": {"act": "IT Act, 2000", "section": "Section 67"},
        "fix": "Remove the inappropriate content immediately."
    },
    "IMAGE_MISMATCH": {
        "severity": "high", 
        "weight": 40, 
        "description": "Product image does not match product title/description",
        "regulation": {"act": "Consumer Protection (E-Commerce) Rules, 2020", "section": "Rule 4(2)"},
        "fix": "Upload an image that accurately represents the product."
    },
}

class ComplianceEngine:
    def __init__(self):
        # 1. Keyword Blacklists
        self.blacklisted_keywords = {
            "restricted": ["ivory", "rhino", "leopard skin", "drug", "cocaine", "heroin"],
            "safety": ["expired", "banned", "hazardous", "cyanide"],
            "fake": ["first copy", "replica", "clone", "1:1 copy", "fake"]
        }
        
        # 2. Brand Trademarks
        self.protected_brands = ["Gucci", "Rolex", "Nike", "Adidas", "Apple", "Samsung"]

        # 3. Mandatory Fields per Category
        self.mandatory_fields = {
            "food": ["expiry_date", "fssai_license", "ingredients", "mrp"],
            "electronics": ["warranty", "model_number", "mrp"],
            "clothing": ["material", "size_chart", "mrp"]
        }

    def _create_violation(self, rule_key: str, specific_desc: str = None, evidence: str = None, confidence: float = 1.0) -> ViolationSchema:
        rule_def = RULES_CATALOG.get(rule_key, {"severity": "low", "weight": 0, "description": "Unknown Violation", "regulation": None, "fix": None})
        
        # Calculate Impact Score (Weight * Confidence * Multiplier)
        # Scale: Weight (0-50) * Confidence (0-1) -> Impact (0-100)
        # We'll normalize max weight (50) to 100 roughly.
        impact = int(rule_def["weight"] * confidence * 2) 

        return ViolationSchema(
            type=rule_key,
            severity=rule_def["severity"],
            description=specific_desc or rule_def["description"],
            evidence=evidence or "Rule check failed",
            confidence=confidence,
            impact_score=impact,
            status="Open",
            regulation_mapping=rule_def.get("regulation"),
            suggested_fix=rule_def.get("fix")
        )

    def check_pricing_compliance(self, product_data: Dict[str, Any]) -> List[ViolationSchema]:
        violations = []
        # Clean currency symbols ($, ₹, Rs, Rs.) and commas
        price_str = str(product_data.get("price", "0")).replace("₹", "").replace("Rs.", "").replace("Rs", "").replace("$", "").replace(",", "").strip()
        mrp_str = str(product_data.get("mrp", "0")).replace("₹", "").replace("Rs.", "").replace("Rs", "").replace("$", "").replace(",", "").strip()
        
        try:
            price = float(price_str) if price_str else 0
            mrp = float(mrp_str) if mrp_str else 0
        except ValueError:
            price = 0
            mrp = 0

        # Rule 1: Missing MRP (if price > 0 but MRP is 0/missing)
        if price > 0 and mrp == 0:
             violations.append(self._create_violation("MRP_REQUIRED", evidence="Price exists but MRP is 0/missing"))

        # Rule 2: Fake Discount (Discount > 80%)
        if mrp > 0 and price > 0:
            if price > mrp:
                 violations.append(self._create_violation(
                     "PRICE_HIGHER_THAN_MRP", 
                     evidence=f"MRP: {mrp} vs Price: {price}"
                 ))
            else:
                discount = ((mrp - price) / mrp) * 100
                if discount > 80:
                    violations.append(self._create_violation(
                        "FAKE_DISCOUNT", 
                        specific_desc=f"Unrealistic discount of {discount:.1f}%",
                        evidence=f"Discount > 80% threshold"
                    ))
        
        return violations

    def check_image_compliance(self, product_data: Dict[str, Any]) -> List[ViolationSchema]:
        violations = []
        image_url = product_data.get("image_url")
        images = product_data.get("images", [])
        
        # Handle new list format or legacy string
        has_image = bool(image_url) or (len(images) > 0 and bool(images[0]))

        if not has_image:
            violations.append(self._create_violation("MISSING_IMAGE"))
        else:
             # Basic check using image_engine (mock/real)
             # Use first image for analysis
             target_url = image_url if image_url else images[0]
             img_analysis = image_engine.analyze_image(
                 target_url, 
                 product_title=product_data.get("title", ""), 
                 expected_category=product_data.get("category", "general")
             )
             
             if img_analysis["has_watermark"]:
                  violations.append(self._create_violation(
                      "WATERMARK_DETECTED", 
                      evidence=img_analysis["details"]
                  ))
             
             if img_analysis.get("inappropriate_detected"):
                  violations.append(self._create_violation(
                      "INAPPROPRIATE_CONTENT",
                      evidence=img_analysis["details"]
                  ))

             if img_analysis.get("cv_match") is False:
                  violations.append(self._create_violation(
                      "IMAGE_MISMATCH",
                      evidence=img_analysis["details"]
                  ))

        return violations

    def check_mandatory_fields(self, product_data: Dict[str, Any]) -> List[ViolationSchema]:
        violations = []
        category = product_data.get("category", "").lower()
        if category in self.mandatory_fields:
            missing = [field for field in self.mandatory_fields[category] if not product_data.get(field)]
            # Note: 'mrp' is checked in pricing, but listing it here as strict field check too
            if missing:
                violations.append(self._create_violation(
                    "MANDATORY_FIELD_MISSING",
                    specific_desc=f"Missing fields for {category}: {', '.join(missing)}",
                    evidence=f"Missing: {missing}"
                ))
        return violations

    def check_keywords_and_brands(self, text: str) -> List[ViolationSchema]:
        violations = []
        text_lower = text.lower()

        # Check Blacklists
        for cat, keywords in self.blacklisted_keywords.items():
            for keyword in keywords:
                if keyword in text_lower:
                    violations.append(self._create_violation(
                        "RESTRICTED_KEYWORD",
                        specific_desc=f"Restricted term '{keyword}' found (Category: {cat})",
                        evidence=f"Found '{keyword}' in text"
                    ))

        # Check Counterfeits
        for brand in self.protected_brands:
            if brand.lower() in text_lower:
                if any(x in text_lower for x in ["copy", "replica", "clone", "duplicate", "first copy"]):
                     violations.append(self._create_violation(
                        "BRAND_INFRINGEMENT",
                        specific_desc=f"Counterfeit '{brand}' listing detected",
                        evidence=f"Brand '{brand}' + replica keyword"
                    ))

        return violations

    def check_formatting_rules(self, product_data: Dict[str, Any]) -> List[ViolationSchema]:
        violations = []
        title = product_data.get("title", "")
        
        if len(title.split()) < 3: # Too short
             violations.append(self._create_violation(
                 "TITLE_TOO_SHORT", 
                 evidence=f"Title word count: {len(title.split())} (Min: 3)"
             ))
        
        if title.isupper() and len(title) > 10:
             violations.append(self._create_violation(
                 "TITLE_ALL_CAPS",
                 evidence="Title is 100% uppercase characters"
             ))
             
        return violations

    def evaluate_product(self, product_data: Dict[str, Any]) -> Dict[str, Any]:
        violations = []
        
        # Combine text for analysis
        full_text = f"{product_data.get('title', '')} {product_data.get('description', '')}"

        # Run Checks
        violations.extend(self.check_mandatory_fields(product_data))
        violations.extend(self.check_keywords_and_brands(full_text))
        violations.extend(self.check_pricing_compliance(product_data))
        violations.extend(self.check_image_compliance(product_data))
        violations.extend(self.check_formatting_rules(product_data))

        # 2. AI Analysis Integration (Gemini AI)
        nlp_results = nlp_engine.analyze(full_text)
        
        # AI: Misleading Claims
        for term in nlp_results.get("misleading_terms", []):
             violations.append(self._create_violation(
                 "RESTRICTED_KEYWORD",
                 specific_desc=f"AI detected misleading claim: '{term}'",
                 evidence=f"AI Reasoning: {nlp_results.get('reasoning', 'Term found in text')}",
                 confidence=0.95
             ))

        # AI: Prohibited Content
        if nlp_results.get("prohibited_content"):
             violations.append(self._create_violation(
                 "INAPPROPRIATE_CONTENT",
                 specific_desc="AI detected prohibited/unsafe content",
                 evidence=f"AI Reasoning: {nlp_results.get('reasoning', '')}",
                 confidence=0.98
             ))

        # AI: Suspicious Pricing
        if nlp_results.get("suspicious_pricing"):
             violations.append(self._create_violation(
                 "FAKE_DISCOUNT",
                 specific_desc="AI flagged pricing as suspicious/fake",
                 evidence=f"AI Reasoning: {nlp_results.get('reasoning', '')}",
                 confidence=0.90
             ))
        
        # 3. Calculate Score
        score = 100
        for v in violations:
            # Lookup weight. If violation comes from AI with custom type, default to 10
            rule_def = RULES_CATALOG.get(v.type, {"weight": 10}) 
            score -= rule_def["weight"]
        
        score = max(0, score) # No negative scores

        # 4. Risk Classification
        risk_level = "Safe"
        if score < 60:
             risk_level = "High Risk"
        elif score < 85:
             risk_level = "Medium Risk"
        # 85-100 is Safe

        return {
            "compliance_score": score,
            "risk_level": risk_level,
            "violations": violations
        }

compliance_engine = ComplianceEngine()
