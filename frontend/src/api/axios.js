import axios from "axios";

// Create Axios Instance
const api = axios.create({
    baseURL: "http://localhost:8000/api/v1",
    headers: {
        "Content-Type": "application/json",
    },
});

export const analyzeProduct = async (data) => {
    try {
        const response = await api.post("/analysis/", data);
        return response.data;
    } catch (error) {
        if (error.response) {
            throw new Error(error.response.data.detail || "Analysis failed");
        }
        throw new Error("Network error. Ensure backend is running.");
    }
};

export const fetchDashboardStats = async (filters) => {
    try {
        const response = await api.get("/analytics/dashboard", { params: filters });
        return response.data;
    } catch (error) {
        console.error("Dashboard Stats Error:", error);
        return null;
    }
};

export const fetchReports = async (params) => {
    try {
        const response = await api.get("/products", { params });
        return response.data;
    } catch (error) {
        console.error("Fetch Reports Error:", error);
        return { data: [], total: 0 };
    }
};

export default api;
