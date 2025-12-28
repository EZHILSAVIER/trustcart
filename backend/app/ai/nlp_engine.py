import re
from typing import Dict, List, Any

# NOTE: Spacy removed due to installation issues on host environment.
# Switched to Regex-based extraction.

class NLPEngine:
    def __init__(self):
        self.misleading_terms = [
            "100% original", "guaranteed", "lowest price", "best quality",
            "miracle", "cure", "instant results", "magic"
        ]
        
        # Regex Patterns
        self.patterns = {
            "mrp": r"(?i)(?:mrp|price|rs\.?|inr|₹)\s?\.?\s?([\d,]+)",
            "quantity": r"(?i)(\d+\s?(?:g|gm|kg|ml|l|pc|pcs|unit))",
            "expiry": r"(?i)(?:exp|expiry|use before)\W+(\d{2}[/-]\d{2}[/-]\d{2,4})"
        }
        
        # Basic Entity Keywords (Heuristic fallback for NER)
        self.known_brands = ["Nike", "Adidas", "Puma", "Samsung", "Apple", "Sony", "LG", "Dell", "HP", "Lenovo"]


    def extract_entities(self, text: str) -> Dict[str, Any]:
        """
        Extract Brand, Manufacturer using Heuristics (No Spacy)
        """
        entities = {
            "brands": [], 
            "orgs": []
        }
        
        text_lower = text.lower()
        for brand in self.known_brands:
            if brand.lower() in text_lower:
                entities["brands"].append(brand)
                entities["orgs"].append(brand)
                
        return {k: list(set(v)) for k, v in entities.items()}

    def extract_regex_fields(self, text: str) -> Dict[str, Any]:
        """
        Extract structured data like MRP, Quantity
        """
        results = {}
        for key, pattern in self.patterns.items():
            matches = re.findall(pattern, text)
            results[key] = matches if matches else None
        return results

    def detect_misleading_claims(self, text: str) -> List[str]:
        """
        Find specific misleading keywords
        """
        text_lower = text.lower()
        found = [term for term in self.misleading_terms if term in text_lower]
        return found

    def analyze(self, text: str) -> Dict[str, Any]:
        """
        Main analysis function
        """
        if not text:
            return {"missing_fields": [], "misleading_terms": []}
            
        # 1. Extraction
        regex_data = self.extract_regex_fields(text)
        entities = self.extract_entities(text)
        
        # 2. Risk Detection
        misleading = self.detect_misleading_claims(text)
        
        # 3. Missing Fields Logic
        missing_fields = []
        if not regex_data.get("mrp"):
            missing_fields.append("mrp")
        if not regex_data.get("quantity"):
            missing_fields.append("quantity")
        if not entities.get("orgs"):
             missing_fields.append("manufacturer/brand")

        return {
            "extracted_data": {**regex_data, **entities},
            "missing_fields": missing_fields,
            "misleading_terms": misleading
        }

nlp_engine = NLPEngine()
