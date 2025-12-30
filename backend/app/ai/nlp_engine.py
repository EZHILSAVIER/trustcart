import os
import google.generativeai as genai
import json
from dotenv import load_dotenv
from typing import Dict, Any, List

load_dotenv()

class NLPEngine:
    def __init__(self):
        api_key = os.getenv("GEMINI_API_KEY")
        if not api_key:
            print("WARNING: GEMINI_API_KEY not found. AI Analysis will be disabled.")
            self.model = None
        else:
            genai.configure(api_key=api_key)
            self.model = genai.GenerativeModel('gemini-2.5-flash')

    def analyze(self, text: str) -> Dict[str, Any]:
        """
        Analyzes product text using Gemini AI to find violations.
        """
        if not self.model:
            return {"error": "AI Engine not configured"}

        if not text:
            return {"missing_fields": [], "misleading_terms": []}

        prompt = f"""
        Analyze the following e-commerce product text for compliance violations.
        
        Product Text: "{text}"

        Identify:
        1. Misleading Claims (e.g., "100% cure", "magic", "guaranteed results").
        2. Prohibited Content (e.g., drugs, weapons, counterfeits).
        3. Missing mandatory disclosures (if applicable).
        4. Suspicious pricing or fake discounts (e.g. "Price: 100, MRP: 10000").

        Return JSON format ONLY:
        {{
            "misleading_terms": ["term1", "term2"],
            "suspicious_pricing": boolean,
            "prohibited_content": boolean,
            "risk_score": integer (0-100),
            "reasoning": "Brief explanation of findings"
        }}
        """

        try:
            response = self.model.generate_content(prompt)
            # Cleanup JSON string
            content = response.text.replace("```json", "").replace("```", "").strip()
            return json.loads(content)
        except Exception as e:
            print(f"AI Analysis Failed: {e}")
            return {
                "misleading_terms": [],
                "error": str(e)
            }

    def extract_product_details(self, text: str) -> Dict[str, Any]:
        """
        Extracts structured product data (Price, MRP, Title) from raw text.
        """
        if not self.model or not text:
            return {}

        product_text = text[:50000] # Increase limit to capture body content
        prompt = f"""
        Extract product details from this e-commerce page text.
        
        Text Snippet: "{product_text}"... (truncated)

        Extract:
        1. Actual Selling Price (number only).
        2. MRP / Original Price (number only).
        3. Currency Symbol (e.g., ₹, $, €).
        4. Clean Product Title.
        5. Short Description (summary).

        Return JSON ONLY:
        {{
            "price": float,
            "mrp": floatOrNull,
            "currency": "string",
            "title": "string",
            "description": "string"
        }}
        """

        try:
            response = self.model.generate_content(prompt)
            content = response.text.replace("```json", "").replace("```", "").strip()
            return json.loads(content)
        except Exception as e:
            print(f"AI Extraction Failed: {e}")
            return {}


    def compute_risk_score(self, signals: Dict[str, Any]) -> Dict[str, Any]:
        """
        Aggregates multiple signals to compute confidence and impact score.
        """
        confidence = 0.0
        impact_score = 0
        
        # Simple heuristic scoring (can be replaced with model-based scoring)
        if signals.get("misleading_terms"):
            confidence += 0.4
            impact_score += 30
        
        if signals.get("prohibited_content"):
            confidence += 0.5
            impact_score += 50
            
        if signals.get("suspicious_pricing"):
            confidence += 0.3
            impact_score += 20
            
        # Text analysis score
        risk_score = signals.get("risk_score", 0)
        impact_score += int(risk_score * 0.5)
        
        # Normalize
        confidence = min(confidence, 0.99)
        impact_score = min(impact_score, 100)
        
        return {
            "confidence": round(confidence, 2),
            "impact_score": impact_score
        }

    def explain_decision(self, violation: Dict[str, Any]) -> str:
        """
        Returns a human-readable explanation for the violation.
        """
        reasons = []
        if violation.get("misleading_terms"):
            reasons.append(f"Found misleading terms: {', '.join(violation['misleading_terms'])}")
        
        if violation.get("prohibited_content"):
            reasons.append("Detected prohibited content category")
            
        if violation.get("suspicious_pricing"):
            reasons.append("Pricing structure appears irregular compared to market standards")
            
        if not reasons:
            return "Violation detected based on general pattern matching."
            
        return " | ".join(reasons)

nlp_engine = NLPEngine()

