import asyncio
import sys
import os

# Create a dummy "app" module to allow imports if running from backend dir
sys.path.append(os.getcwd())

from unittest.mock import MagicMock, AsyncMock

# Mock modules before importing routes
import app.core.database as db_module
import app.ai.nlp_engine as nlp_module

db_module.database = MagicMock()
mock_collection = AsyncMock()
db_module.database.get_collection = MagicMock(return_value=mock_collection)

nlp_module.nlp_engine = MagicMock()
nlp_module.nlp_engine.analyze = MagicMock(return_value={"risk_score": 88, "misleading_terms": ["magic"]})
nlp_module.nlp_engine.compute_risk_score = MagicMock(return_value={"confidence": 0.9, "impact_score": 88})

from app.routes.ingestion import analyze_and_update

async def test_flow():
    print("Starting verification of ingestion logic...")
    
    # Run
    await analyze_and_update("dummy_id", "detected magic text")
    
    # Check calls
    print("Verifying DB update logic...")
    if mock_collection.update_one.called:
        call_args = mock_collection.update_one.call_args
        query = call_args[0][0]
        update = call_args[0][1]
        
        print(f"Query used: {query}")
        print(f"Update operation: {update}")
        
        # Assertions
        assert query == {"_id": "dummy_id"}, "Query ID mismatch"
        assert update["$set"]["risk_level"] == "High", "Risk level should be High"
        assert update["$set"]["compliance_score"] == 12, "Compliance score should be 100 - 88 = 12"
        
        timeline_event = update["$push"]["timeline"]
        print(f"Timeline event generated: {timeline_event}")
        assert timeline_event["event"] == "Compliance Analysis", "Event name mismatch"
        assert "Risk Score: 88" in timeline_event["details"], "Details missing risk score"
        
        print("SUCCESS: Ingestion logic verified!")
    else:
        print("FAILURE: database.update_one was not called.")

if __name__ == "__main__":
    asyncio.run(test_flow())
