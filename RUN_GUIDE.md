# How to Run TrustCart

You need to run the **Backend** and **Frontend** in two separate terminals.

### 1. Start the Backend (API)
Open a terminal and run:
```powershell
cd backend
# Make sure virtual env is active if you use one
uvicorn main:app --reload --port 8000
```
*App will run at: http://localhost:8000*

### 2. Start the Frontend (UI)
Open a **new** terminal and run:
```powershell
cd frontend
npm run dev
```
*App will run at: http://localhost:5173*

---
**Note:** Ensure MongoDB is running if you want to save analysis history, but the app works without it too (in "Best Effort" mode).
