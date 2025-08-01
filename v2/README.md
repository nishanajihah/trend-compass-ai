# Trend Compass Frontend

A modern, responsive frontend for the Trend Compass AI-powered trend forecasting application built with Vite + TypeScript.

## ✨ Features

- **Modern Stack**: Vite + TypeScript for fast development and type safety
- **Responsive Design**: Mobile-first approach with premium UI/UX
- **Real-time API Integration**: Connects to FastAPI backend for trend analysis
- **Rate Limiting Aware**: Handles 15 requests/day limit gracefully
- **Error Handling**: User-friendly error messages and retry mechanisms
- **Loading States**: Smooth animations and progress indicators
- **Export/Save Functions**: Ready for future implementation

## 🚀 Quick Start

### Development

```bash
# Install dependencies
npm install

# Start development server with hot reload
npm run dev

# Visit http://localhost:5173
```

### Production Build

```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

## 🏗️ Project Structure

```
src/
├── css/
│   └── enhanced-theme.css    # Main styles with CSS custom properties
├── main.ts                   # Main application entry point
└── vite-env.d.ts            # Vite type definitions

public/                       # Static assets
index.html                   # Main HTML template
vite.config.ts              # Vite configuration with proxy
vercel.json                 # Vercel deployment config
```

## 🔧 Configuration

### Environment Detection

The app automatically detects the environment and configures the API URL:

- **Development**: `http://localhost:8000` (with Vite proxy)
- **Production**: Update `API_BASE_URL` in `main.ts` with your deployed backend URL

### Backend Integration

This frontend is designed to work with the Trend Compass FastAPI backend. Make sure to:

1. Deploy your backend to Railway, Render, or similar platform
2. Update the `API_BASE_URL` in `src/main.ts` with your backend URL
3. Ensure CORS is configured properly in your backend

## 📱 Responsive Design

- **Desktop**: Full-featured layout with sidebar actions
- **Tablet**: Optimized grid layout
- **Mobile**: Stacked layout with touch-friendly interactions

## 🎨 Theming

The app uses CSS custom properties for consistent theming:

- Dark theme with gradient accents
- Glassmorphism effects with backdrop-blur
- Smooth animations and transitions
- High contrast and reduced motion support

## 🚀 Deployment

### Vercel (Recommended)

1. Connect your GitHub repository to Vercel
2. Set build command: `npm run build`
3. Set output directory: `dist`
4. Deploy!

The `vercel.json` configuration is already included for optimal deployment.

### Other Platforms

The built `dist/` folder can be deployed to any static hosting service:
- Netlify
- GitHub Pages
- Firebase Hosting
- AWS S3

## 🔌 API Endpoints

The frontend expects these backend endpoints:

- `GET /health` - API health check
- `POST /api/trends/analyze` - Trend analysis (requires `{ "topic": "string" }`)

## 🛠️ Development

### Adding New Features

1. Add TypeScript types in `main.ts`
2. Create functions following the existing pattern
3. Update CSS in `enhanced-theme.css`
4. Test responsive behavior

### Styling Guidelines

- Use CSS custom properties from `:root`
- Follow mobile-first responsive design
- Maintain accessibility standards
- Use semantic HTML elements

## 📊 Performance

- **Vite**: Lightning-fast development and optimized builds
- **TypeScript**: Type safety and better developer experience
- **CSS**: Optimized with custom properties and minimal dependencies
- **Bundle Size**: Minimal external dependencies for fast loading

## 🤝 Contributing

1. Follow TypeScript best practices
2. Maintain responsive design patterns
3. Test across different screen sizes
4. Ensure accessibility compliance

## 📄 License

MIT License - see LICENSE file for details

---

Built with ❤️ using Vite + TypeScript
