import numpy as np
from typing import Dict, Any, List
try:
    from sklearn.ensemble import IsolationForest
    SKLEARN_AVAILABLE = True
except ImportError:
    SKLEARN_AVAILABLE = False

class PricingEngine:
    def __init__(self):
        # Mock Category Data (Mean Price, Std Dev) for Z-score
        self.category_stats = {
            "electronics": {"mean": 500, "std": 200},
            "clothing": {"mean": 50, "std": 20},
            "food": {"mean": 10, "std": 5},
            "luxury": {"mean": 2000, "std": 1000},
            "general": {"mean": 100, "std": 50}
        }
        
        # Train a mock Isolation Forest for "electronics" (Concept)
        if SKLEARN_AVAILABLE:
            self.iso_forest = IsolationForest(contamination=0.1, random_state=42)
            # Mock pricing data points
            X = np.array([[100], [200], [500], [550], [480], [600], [3000], [50], [520], [490]])
            self.iso_forest.fit(X)

    def calculate_discount(self, price: float, mrp: float) -> float:
        if mrp <= 0: return 0.0
        return ((mrp - price) / mrp) * 100

    def z_score_analysis(self, price: float, category: str) -> Dict[str, Any]:
        stats = self.category_stats.get(category.lower(), self.category_stats["general"])
        mean = stats["mean"]
        std = stats["std"]
        
        z_score = (price - mean) / std
        
        # Z-Score > 3 or < -3 is typically an anomaly
        is_anomaly = abs(z_score) > 2.5
        
        return {
            "z_score": round(z_score, 2),
            "is_anomaly": is_anomaly,
            "mean_price": mean
        }

    def isolation_forest_analysis(self, price: float) -> Dict[str, Any]:
        if not SKLEARN_AVAILABLE:
            return {"score": 0.0, "is_anomaly": False, "method": "Unavailable"}
            
        # Predict: -1 for outlier, 1 for inlier
        # Score_samples: lower is more anomalous
        prediction = self.iso_forest.predict([[price]])[0]
        score = self.iso_forest.decision_function([[price]])[0]
        
        # Normalize score rough approx to 0-1 risk
        anomaly_score = 1.0 if prediction == -1 else 0.0
        if prediction == -1:
            anomaly_score = min(1.0, abs(score) * 2) # boost confidence

        return {
            "score": round(anomaly_score, 2),
            "is_anomaly": prediction == -1,
            "method": "IsolationForest"
        }

    def analyze_price(self, price: float, category: str = "general") -> List[Dict[str, Any]]:
        anomalies = []
        
        # 1. Z-Score Check
        z_stats = self.z_score_analysis(price, category)
        if z_stats["is_anomaly"]:
            severity = "high" if abs(z_stats["z_score"]) > 3 else "medium"
            anomalies.append({
                "confidence": severity,
                "details": f"Price is a statistical outlier (Z-Score: {z_stats['z_score']}) for {category}.",
                "method": "Z-Score"
            })

        # 2. Isolation Forest Check (Demo for electronics or fallback)
        if SKLEARN_AVAILABLE and category.lower() == "electronics":
            iso_stats = self.isolation_forest_analysis(price)
            if iso_stats["is_anomaly"]:
                 anomalies.append({
                    "confidence": "high",
                    "details": f"Isolation Forest detected anomaly (Score: {iso_stats['score']}).",
                    "method": "IsolationForest"
                })
        
        return anomalies

pricing_engine = PricingEngine()
