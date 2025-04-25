# Fact Check Technical Assignment

A production-ready FastAPI application with React frontend for fact-checking claims against scientific research papers.

## Features

- **Research-Based Fact Checking**: Evaluates claims using academic papers and scientific evidence
- **LLM Integration**: Uses Google's Gemini AI to analyze findings
- **Academic Paper Search**: Searches for relevant papers via SERP API
- **Structured API Response**: Provides detailed analysis with citations
- **Human-Friendly Output**: Generates markdown-formatted reports
- **Interactive Dashboard**: Monitor and manage fact-check requests
- **User Authentication**: Secure access to fact-check history and results

## Installation

### Prerequisites

- Python 3.8+
- Node.js 16+
- API keys for:
  - Google Gemini API
  - SERP API (for academic paper search)

### Backend Setup

1. Clone the repository:

```bash
git clone https://github.com/Gowtham2005-2005/fact-check-api.git
cd fact-check-api
```

2. Create a virtual environment:

```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. Install backend dependencies:

```bash
pip install -r requirements.txt
```

4. Set up environment variables:

```bash
cp .env.example .env
```

Edit the `.env` file to add your API keys.

### Frontend Setup

1. Navigate to the frontend directory:

```bash
cd frontend
```

2. Install frontend dependencies:

```bash
npm install
```

## Usage

### Running the Application

Start the backend server:

```bash
# From the project root directory
uvicorn app.main:app --reload
# Alternatively
python -m app.main
```

The API will be available at http://localhost:8000

Start the frontend development server:

```bash
# From the frontend directory
npm run dev
```

The frontend will be available at http://localhost:3000

### API Endpoints

- **Health Check**: `GET /api/v1/health`
- **Fact Check**: `POST /api/v1/fact-check`
- **User Authentication**: `POST /api/v1/auth/login`
- **Get Results**: `GET /api/v1/results/{result_id}`

### Example API Request

```bash
curl -X POST http://localhost:8000/api/v1/fact-check \
  -H "Content-Type: application/json" \
  -d '{"claim": "Coffee consumption reduces the risk of heart disease"}'
```

## Frontend Application

### Dashboard Features

- **Recent Checks**: View your recently submitted fact-check requests
- **Status Tracking**: Monitor the progress of your fact-check requests
- **Results Browser**: Review detailed fact-check reports with citations
- **New Request Form**: Submit new claims for verification

### User Workflow

1. Navigate to the dashboard to view past requests or submit new ones
2. Enter a claim in the fact-check form and submit
3. View the detailed report once processing is complete

## Development

### Running Tests

Backend tests:

```bash
# From project root
pytest
```

### API Documentation

When running the API, access the interactive documentation at:

- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc
