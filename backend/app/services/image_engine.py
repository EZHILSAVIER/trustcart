import cv2
import numpy as np
import requests
from typing import Dict, Any, Optional
import google.generativeai as genai
import os
import json
from PIL import Image
from io import BytesIO
import logging

class ImageEngine:
    def __init__(self):
        api_key = os.getenv("GEMINI_API_KEY")
        if api_key:
            genai.configure(api_key=api_key)
            self.model = genai.GenerativeModel('gemini-2.5-flash')
        else:
            logging.warning("GEMINI_API_KEY not set. CV features disabled.")
            self.model = None

    def download_image(self, url: str) -> Optional[np.ndarray]:
        try:
            resp = requests.get(url, timeout=5)
            if resp.status_code == 200:
                # Convert bytes to numpy array
                image_arr = np.asarray(bytearray(resp.content), dtype=np.uint8)
                image = cv2.imdecode(image_arr, cv2.IMREAD_COLOR)
                return image
            return None
        except Exception as e:
            print(f"Image download error: {e}")
            return None

    def detect_watermark(self, image: np.ndarray) -> Dict[str, Any]:
        """
        Basic Watermark/Text Detection using Edge Density.
        Watermarks often create high-frequency edges in text regions.
        """
        gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
        
        # 1. Edge Detection
        edges = cv2.Canny(gray, 100, 200)
        
        # 2. Check localized edge density
        # A simple global variance check
        edge_density = np.sum(edges) / (image.shape[0] * image.shape[1])
        
        # Heuristic: Watermarked/Text-heavy images often have density > 0.05 (5% pixels are edges)
        # Cleaner product photos usually have lower density (solid background)
        
        has_watermark = edge_density > 0.08 # Adjusted threshold
        
        return {
            "has_watermark": bool(has_watermark),
            "edge_density": float(edge_density),
            "details": f"High edge density ({edge_density:.2f}) detected, potential text overlay/watermark." if has_watermark else "Clean image"
        }

    def check_inappropriate_content(self, image: np.ndarray) -> Dict[str, Any]:
        """
        Simple heuristic for skin tone detection (HSV).
        High percentage of skin pixels *might* indicate inappropriate content.
        This is a basic proxy for a NSFW classifier.
        """
        try:
            hsv = cv2.cvtColor(image, cv2.COLOR_BGR2HSV)
            # Define skin color range in HSV
            # Lower: (0, 48, 80), Upper: (20, 255, 255) maps roughly to skin tones
            lower = np.array([0, 48, 80], dtype="uint8")
            upper = np.array([20, 255, 255], dtype="uint8")
            
            skin_mask = cv2.inRange(hsv, lower, upper)
            skin_pixels = cv2.countNonZero(skin_mask)
            total_pixels = image.shape[0] * image.shape[1]
            
            ratio = skin_pixels / total_pixels
            
            # If > 40% is skin-colored, flag it
            is_risky = ratio > 0.40
            
            return {
                "inappropriate": is_risky,
                "confidence": round(ratio, 2),
                "details": f"High skin-tone ratio ({ratio:.2f}) detected." if is_risky else ""
            }
        except Exception:
            return {"inappropriate": False, "confidence": 0.0}

    def verify_category(self, image: np.ndarray, expected_category: str) -> Dict[str, Any]:
        """
        Placeholder for DL-based Classification.
        """
        # TODO: Load MobileNet or similar here
        # For now, return a PASS to avoid blocking valid flows
        return {
            "match": True,
            "confidence": 0.0,
            "predicted": "unknown"
        }

    def verify_product_match_ai(self, image: np.ndarray, product_title: str) -> Dict[str, Any]:
        """
        Uses Gemini Vision to verify if the image semantically matches the product title.
        """
        if not self.model or not product_title:
            return {"match": True, "confidence": 0.0, "reason": "AI not available or no title"}

        try:
            # Convert OpenCV (BGR) to PIL (RGB)
            pixel_rgb = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
            pil_image = Image.fromarray(pixel_rgb)

            prompt = f"""
            Analyze this product image.
            Product Title: "{product_title}"

            Does the image appear to be a valid representation of the product described in the title?
            Check for:
            1. Mismatch (e.g., Title says "iPhone", Image is a "Shoe")
            2. Generic placeholder or "Image not found" icon.
            3. Obvious wrong category.

            Return JSON ONLY:
            {{
                "is_match": boolean,
                "confidence": float (0.0 to 1.0),
                "reason": "Short explanation"
            }}
            """
            
            response = self.model.generate_content([prompt, pil_image])
            # Clean response
            text = response.text.replace("```json", "").replace("```", "").strip()
            data = json.loads(text)
            
            return {
                "match": data.get("is_match", True),
                "confidence": data.get("confidence", 0.0),
                "reason": data.get("reason", "AI Verification")
            }

        except Exception as e:
            logging.error(f"CV Analysis Error: {e}")
            return {"match": True, "confidence": 0.0, "reason": "CV Error"}

    def analyze_image(self, url: str, product_title: str = "", expected_category: str = "general") -> Dict[str, Any]:
        result = {
            "url_valid": False,
            "has_watermark": False,
            "inappropriate_detected": False,
            "category_match": True,
            "cv_match": True,
            "details": ""
        }
        
        image = self.download_image(url)
        if image is None:
            result["details"] = "Failed to download image"
            return result

        result["url_valid"] = True
        
        # 1. Watermark
        wm_res = self.detect_watermark(image)
        if wm_res["has_watermark"]:
            result["has_watermark"] = True
            result["details"] += f" {wm_res['details']}"
            
        # 2. Inappropriate Content
        nsfw_res = self.check_inappropriate_content(image)
        if nsfw_res["inappropriate"]:
            result["inappropriate_detected"] = True
            result["details"] += f" {nsfw_res['details']}"

        # 3. AI Product Match Verification
        if product_title and self.model:
            cv_res = self.verify_product_match_ai(image, product_title)
            if not cv_res["match"]:
                result["cv_match"] = False
                result["details"] += f" [CV Mismatch: {cv_res['reason']}]"

        # 3. Category (Stub)
        cat_res = self.verify_category(image, expected_category)
        if not cat_res["match"]:
            result["category_match"] = False
            result["details"] += " Image category mismatch."
            
        return result

image_engine = ImageEngine()
