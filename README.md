# Trend Compass

An AI-powered trend forecasting and audience insights tool built for the hackathon to showcase the combined power of Qloo's cultural affinity data and Gemini LLM.

![Trend Compass Screenshot](https://via.placeholder.com/800x400?text=Trend+Compass+Screenshot)

## 🚀 Live Demo

[Check out the live demo here](#) (Add your demo URL when deployed)

## ✨ Features

- **Trend Analysis**: Get forecasts and insights about emerging trends across industries
- **Audience Insights**: Understand cultural affinities and preferences of different audience segments
- **AI-Powered Recommendations**: Receive actionable recommendations for marketing and content creation
- **Intuitive UI**: Clean, responsive interface for easy navigation and analysis

## 🛠️ Tech Stack

- **Frontend**: HTML, CSS, JavaScript
- **Backend**: Python with FastAPI
- **AI**: Google's Gemini API (LLM)
- **Data**: Qloo Cultural Affinity API

## 📋 Project Structure

```
trend-compass/
├── backend/               # FastAPI backend
│   ├── main.py           # Application entry point
│   ├── requirements.txt  # Python dependencies
│   ├── models/           # Data models
│   │   └── schemas.py
│   ├── services/         # Business logic
│   │   ├── llm_service.py
│   │   └── qloo_service.py
│   └── routers/          # API endpoints
│       └── trends.py
├── frontend/             # Simple HTML/CSS/JS frontend
│   ├── index.html       # Main page
│   ├── css/
│   │   └── styles.css
│   └── js/
│       └── app.js
├── .env.example         # Example environment variables
└── README.md            # Project documentation
```

## 🔧 Setup & Installation

### Prerequisites

- Python 3.9+
- Gemini API key
- Qloo API key

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/trend-compass.git
   cd trend-compass
   ```

2. Set up the backend:
   ```bash
   cd backend
   pip install -r requirements.txt
   ```

3. Create a `.env` file in the root directory:
   ```
   GEMINI_API_KEY=your_gemini_api_key_here
   QLOO_API_KEY=your_qloo_api_key_here
   ```

4. Start the backend server:
   ```bash
   cd backend
   uvicorn main:app --reload
   ```

5. Open the frontend:
   - Open `frontend/index.html` in your browser, or
   - Use a simple HTTP server: `python -m http.server -d frontend`

## 💡 Usage

1. **Analyze a Trend**:
   - Enter a trend or topic in the "Trend Analysis" tab
   - Optionally specify industry and timeframe
   - Click "Analyze Trend" to get insights

2. **Get Audience Insights**:
   - Describe your target audience in the "Audience Insights" tab
   - Optionally specify product category and region
   - Click "Get Insights" to receive analysis

## 🧪 API Documentation

When running the backend, you can access the FastAPI interactive documentation at `http://localhost:8000/docs`. This provides a convenient way to test all API endpoints directly.

## 🤝 Contributing

This is a hackathon project, but contributions and suggestions are welcome! Please open an issue or submit a pull request.

## 📄 License

[MIT License](LICENSE)

## 📬 Contact

Your Name - [your.email@example.com](mailto:your.email@example.com)

Project Link: [https://github.com/yourusername/trend-compass](https://github.com/yourusername/trend-compass)
