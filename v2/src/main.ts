/**
 * Trend Compass - Main Application
 * Production version with TypeScript and modern build setup
 */

// Import CSS
import './css/enhanced-theme.css'

// API Configuration - Auto-detect environment
const API_BASE_URL = (() => {
    // Check if running locally (Vite dev server)
    if (window.location.hostname === 'localhost' || 
        window.location.hostname === '127.0.0.1' ||
        window.location.port === '5173') { // Vite default port
        return 'http://localhost:8000';
    }
    // For production deployment - update this with your deployed backend URL
    if (window.location.href.includes('vercel.app') || window.location.hostname.includes('.com')) {
        // TODO: Replace with your actual backend URL once deployed
        // Example: 'https://your-app-name.railway.app' or 'https://your-app.onrender.com'
        return 'https://your-backend-url-here.railway.app'; // Update this!
    }
    // Fallback to local development
    return 'http://localhost:8000';
})();

// Types
interface AnalysisRequest {
    topic: string;
}

interface AnalysisResponse {
    trend_analysis: string;
    audience_insights: string;
}

interface ApiStatus {
    status: string;
    message?: string;
}

// DOM Elements
let elements: { [key: string]: HTMLElement | null } = {};

/**
 * Initialize the application
 */
function initializeApp(): void {
    console.log('🚀 Initializing Trend Compass App...');
    
    // Get DOM elements
    elements = {
        trendForm: document.getElementById('trendForm'),
        trendInput: document.getElementById('trendInput'),
        analyzeBtn: document.getElementById('analyzeBtn'),
        loadingState: document.getElementById('loadingState'),
        resultsContainer: document.getElementById('resultsContainer'),
        trendContent: document.getElementById('trendContent'),
        audienceContent: document.getElementById('audienceContent'),
        errorDisplay: document.getElementById('errorDisplay'),
        errorMessage: document.getElementById('errorMessage'),
        apiStatus: document.getElementById('apiStatus'),
        serverStatusBanner: document.getElementById('serverStatusBanner')
    };

    // Setup event listeners
    setupEventListeners();
    
    // Check API status on load
    setTimeout(() => {
        checkAPIStatus();
    }, 1000);
    
    console.log('✅ App initialized successfully!');
}

/**
 * Setup event listeners
 */
function setupEventListeners(): void {
    // Form submission
    elements.trendForm?.addEventListener('submit', handleFormSubmit);
    
    // Enter key in input
    elements.trendInput?.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleFormSubmit(e);
        }
    });
}

/**
 * Handle form submission
 */
async function handleFormSubmit(e: Event): Promise<void> {
    e.preventDefault();
    
    const input = elements.trendInput as HTMLInputElement;
    const topic = input?.value?.trim();
    
    if (!topic) {
        showError('Please enter a trend or topic to analyze.');
        return;
    }
    
    await analyzeTrend(topic);
}

/**
 * Analyze trend - main analysis function
 */
async function analyzeTrend(topic: string): Promise<void> {
    console.log(`🔍 Analyzing trend: ${topic}`);
    
    showLoading();
    hideError();
    hideResults();
    
    try {
        const response = await fetch(`${API_BASE_URL}/api/trends/analyze`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ topic })
        });
        
        if (!response.ok) {
            if (response.status === 429) {
                throw new Error('Rate limit exceeded. You have reached the daily limit of 15 requests. Please try again tomorrow.');
            } else if (response.status === 500) {
                throw new Error('Server error. Please try again later.');
            } else {
                throw new Error(`Analysis failed: ${response.statusText}`);
            }
        }
        
        const data: AnalysisResponse = await response.json();
        
        // Display results
        displayResults(data);
        
    } catch (error) {
        console.error('❌ Analysis error:', error);
        showError(error instanceof Error ? error.message : 'Failed to analyze trend. Please try again.');
    } finally {
        hideLoading();
    }
}

/**
 * Display analysis results
 */
function displayResults(data: AnalysisResponse): void {
    const { trend_analysis, audience_insights } = data;
    
    // Update content
    if (elements.trendContent) {
        elements.trendContent.innerHTML = formatAnalysisText(trend_analysis);
    }
    
    if (elements.audienceContent) {
        elements.audienceContent.innerHTML = formatAnalysisText(audience_insights);
    }
    
    // Show results with animation
    showResults();
    
    // Scroll to results
    elements.resultsContainer?.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'start' 
    });
}

/**
 * Format analysis text for better display
 */
function formatAnalysisText(text: string): string {
    return text
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.*?)\*/g, '<em>$1</em>')
        .replace(/

/g, '</p><p>')
        .replace(/
/g, '<br>')
        .replace(/^/, '<p>')
        .replace(/$/, '</p>');
}

/**
 * Quick analysis function for preset topics
 */
async function quickAnalysis(topic: string): Promise<void> {
    const input = elements.trendInput as HTMLInputElement;
    if (input) {
        input.value = topic;
    }
    await analyzeTrend(topic);
}

/**
 * Check API status
 */
async function checkAPIStatus(): Promise<void> {
    try {
        const response = await fetch(`${API_BASE_URL}/health`, {
            method: 'GET',
            headers: { 'Accept': 'application/json' }
        });
        
        if (response.ok) {
            updateAPIStatus('healthy', '🟢 API Connected');
            hideServerBanner();
        } else {
            throw new Error('API health check failed');
        }
        
    } catch (error) {
        console.warn('⚠️ API connection issue:', error);
        updateAPIStatus('error', '🔴 API Disconnected');
        showServerBanner();
    }
}

/**
 * Update API status indicator
 */
function updateAPIStatus(status: 'healthy' | 'warning' | 'error', message: string): void {
    const statusElement = elements.apiStatus;
    if (!statusElement) return;
    
    const indicator = statusElement.querySelector('.status-indicator');
    const text = statusElement.querySelector('span:last-child');
    
    if (indicator) {
        indicator.className = `status-indicator status-${status}`;
    }
    
    if (text) {
        text.textContent = message;
    }
}

/**
 * Show/hide functions
 */
function showLoading(): void {
    elements.loadingState?.classList.remove('d-none');
    const btn = elements.analyzeBtn as HTMLButtonElement;
    if (btn) {
        btn.disabled = true;
        btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Analyzing...';
    }
}

function hideLoading(): void {
    elements.loadingState?.classList.add('d-none');
    const btn = elements.analyzeBtn as HTMLButtonElement;
    if (btn) {
        btn.disabled = false;
        btn.innerHTML = '<i class="fas fa-search"></i> Analyze Trend';
    }
}

function showResults(): void {
    elements.resultsContainer?.classList.remove('d-none');
    elements.resultsContainer?.classList.add('fade-in');
}

function hideResults(): void {
    elements.resultsContainer?.classList.add('d-none');
}

function showError(message: string): void {
    if (elements.errorMessage) {
        elements.errorMessage.textContent = message;
    }
    elements.errorDisplay?.classList.remove('d-none');
}

function hideError(): void {
    elements.errorDisplay?.classList.add('d-none');
}

function showServerBanner(): void {
    elements.serverStatusBanner?.classList.remove('d-none');
}

function hideServerBanner(): void {
    elements.serverStatusBanner?.classList.add('d-none');
}

/**
 * Retry analysis
 */
function retryAnalysis(): void {
    const input = elements.trendInput as HTMLInputElement;
    const topic = input?.value?.trim();
    
    if (topic) {
        analyzeTrend(topic);
    } else {
        hideError();
    }
}

/**
 * Export results (placeholder)
 */
function exportResults(type: 'trend' | 'audience'): void {
    console.log(`📄 Exporting ${type} results...`);
    alert(`Export feature coming soon! (${type} analysis)`);
}

/**
 * Save results (placeholder)
 */
function saveResults(type: 'trend' | 'audience'): void {
    console.log(`💾 Saving ${type} results...`);
    alert(`Save feature coming soon! (${type} analysis)`);
}

/**
 * Show about modal (placeholder)
 */
function showAbout(): void {
    alert('Trend Compass - AI-Powered Trend Forecasting

Combining Qloo's cultural affinity data with Gemini LLM for rich, strategic insights.');
}

/**
 * Show privacy modal (placeholder)
 */
function showPrivacy(): void {
    alert('Privacy Policy

Your data is processed securely and not stored permanently. Analysis requests are sent to our API for processing only.');
}

// Make functions available globally for HTML onclick handlers
declare global {
    interface Window {
        quickAnalysis: (topic: string) => Promise<void>;
        retryAnalysis: () => void;
        exportResults: (type: 'trend' | 'audience') => void;
        saveResults: (type: 'trend' | 'audience') => void;
        checkApiStatus: () => Promise<void>;
        showAbout: () => void;
        showPrivacy: () => void;
    }
}

window.quickAnalysis = quickAnalysis;
window.retryAnalysis = retryAnalysis;
window.exportResults = exportResults;
window.saveResults = saveResults;
window.checkApiStatus = checkAPIStatus;
window.showAbout = showAbout;
window.showPrivacy = showPrivacy;

// Initialize app when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeApp);
} else {
    initializeApp();
}

export {};
