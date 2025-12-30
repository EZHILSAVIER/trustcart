
# TrustCart - Technology Stack & Techniques

## 1. Programming Languages
*   **Python (3.x)**: The core language for the backend API, AI interaction, web scraping, and computer vision logic.
*   **JavaScript (ES6+) / JSX**: The language for the frontend user interface, component logic, and API integration.
*   **CSS (PostCSS)**: Used for styling the application, implementing the design system, and handling theming (Light/Dark mode).

## 2. Libraries & Frameworks

### Backend (Python)
*   **FastAPI**: A high-performance web framework for building APIs with Python.
*   **Uvicorn**: An ASGI web server implementation for Python.
*   **Motor**: Asynchronous Python driver for MongoDB.
*   **Google Generative AI (`google-generativeai`)**: SDK to interact with Gemini 2.5 Flash for AI-powered extraction.
*   **OpenCV (`opencv-python`)**: Computer vision library used for analyzing product images (watermark detection).
*   **CloudScraper**: A Python module to bypass Cloudflare's anti-bot page.
*   **BeautifulSoup4**: A library for pulling data out of HTML and XML files.
*   **Pillow (PIL)**: Python Imaging Library for image processing capabilities.
*   **Pydantic**: Data validation and settings management using Python type annotations.
*   **Python-Dotenv**: Reads key-value pairs from a `.env` file and adds them to environment variables.
*   **NumPy**: Fundamental package for scientific computing with Python (used by OpenCV).

### Frontend (JavaScript/React)
*   **React 19**: A JavaScript library for building user interfaces.
*   **Vite**: A build tool that aims to provide a faster and leaner development experience for modern web projects.
*   **Tailwind CSS**: A utility-first CSS framework for rapid UI development.
*   **Framer Motion**: A production-ready motion library for React.
*   **Recharts**: A composable charting library built on React components.
*   **Lucide React**: A collection of consistent icon assets.
*   **Axios**: Promise-based HTTP client for the browser and node.js.
*   **Clsx**: A tiny utility for constructing `className` strings conditionally.

## 3. Key Techniques

### Hybrid Data Extraction
*   **AI-Powered Parsing**: Utilizing **Gemini 2.5 Flash** to intelligently parse unstructured HTML and extract specific product details like Price, MRP, and Description.
*   **Robust Scraping**: Using `cloudscraper` to handle complex website protections and mimicking real browser headers to avoid detection.
*   **Regex & Heuristic Fallbacks**: Implementing a multi-layered fallback system. If AI fails (e.g., quota limits), the system automatically switches to regex pattern matching on both rendered text and raw HTML to find critical data like MRP.

### Computer Vision Compliance
*   **Image Analysis**: Using **OpenCV** to algorithmically detect potential violations in product images, such as unauthorized watermarks or text overlays that violate platform policies.

### Modern Frontend Architecture
*   **Semantic Design System**: Implementation of a robust theming system using CSS variables mapped to functional names (e.g., `--color-brand`, `--color-danger`) rather than hardcoded hex values. Includes full **Dark Mode** support.
*   **Real-time UI**: Reactive components that update instantly based on analysis results.
*   **Risk Visualization**: Visual communication of compliance risk through color-coded indicators (Green/Amber/Red) to aid quick decision-making.
