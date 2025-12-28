from fastapi import FastAPI
from app.routes import analysis, analytics, products
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="E-Compliance Monitor API")

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:5174"], # Frontend URLs
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {"message": "E-Compliance Monitor API is running"}

app.include_router(analysis.router, prefix="/api/v1/analysis", tags=["Analysis"])
app.include_router(analytics.router, prefix="/api/v1/analytics", tags=["Analytics"])
app.include_router(products.router, prefix="/api/v1/products", tags=["Products"])

