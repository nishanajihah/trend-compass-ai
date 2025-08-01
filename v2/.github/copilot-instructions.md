<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

# Trend Compass Frontend - Development Guidelines

This is a modern Vite + TypeScript frontend for the Trend Compass AI-powered trend forecasting application.

## Architecture
- **Frontend**: Vite + TypeScript + Vanilla JS
- **Backend**: FastAPI (separate deployment)
- **Styling**: Custom CSS with CSS variables and modern design patterns
- **Deployment**: Vercel (frontend), Railway/Render (backend)

## Key Patterns
- Use TypeScript for type safety
- Modern ES6+ features and async/await
- CSS custom properties for theming
- Responsive design with mobile-first approach
- Error handling with user-friendly messages
- Loading states and animations for better UX

## API Integration
- The backend API is deployed separately (Railway/Render)
- API_BASE_URL is auto-detected based on environment
- Rate limiting: 15 requests per day
- Endpoints: `/api/trends/analyze`, `/health`

## Development
- Use `npm run dev` for development server with hot reload
- Backend proxy configured in vite.config.ts for local development
- Build with `npm run build` for production

## Coding Standards
- Use semantic HTML and accessible markup
- Follow TypeScript best practices
- Keep functions pure and testable
- Use CSS custom properties for consistency
- Handle errors gracefully with user feedback
