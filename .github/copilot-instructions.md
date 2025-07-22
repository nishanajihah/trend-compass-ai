<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

# Trend Compass - Copilot Instructions

## Project Overview

Trend Compass is an AI-powered trend forecasting and audience insights tool that combines Qloo's cultural affinity data with Gemini LLM for rich, strategic insights.

## Tech Stack

- **Backend**: Python 3.9+ with FastAPI
- **Frontend**: Simple HTML, CSS, and JavaScript
- **AI**: Google's Gemini API (via google-generativeai package)
- **External API**: Qloo API (cultural affinity data)

## Code Standards

When generating code for this project, please follow these guidelines:

### Python (Backend)

- Follow PEP 8 style guide
- Use async/await for API calls and database operations
- Include docstrings for all functions and classes
- Implement proper error handling with try/except blocks
- Use type hints for function parameters and return values

### JavaScript (Frontend)

- Use ES6+ features where appropriate
- Follow a clean, functional programming style
- Include comments for complex logic
- Implement proper error handling for API calls
- Format code with consistent indentation (2 spaces)

### HTML/CSS

- Use semantic HTML5 elements
- Maintain responsive design principles
- Follow BEM naming convention for CSS classes
- Keep CSS organized by component/section

## Important Project Contexts

- The application has two main features: trend analysis and audience insights
- The backend connects to both Gemini API and Qloo API
- The frontend is intentionally simple for hackathon purposes
- We're using FastAPI's automatic Swagger UI at /docs as a developer tool

## Example Prompts

When you need to extend or modify this project, consider these example prompts:

- "Add input validation to the frontend forms"
- "Improve error handling in the API calls"
- "Add caching to reduce repeated API calls"
- "Implement a dark mode theme for the UI"
- "Add visualization for trend data using Chart.js"
