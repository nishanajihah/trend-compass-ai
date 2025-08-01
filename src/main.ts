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
        window.location.port === '5173' ||
        window.location.port === '5174') { // Vite ports
        return 'http://localhost:8000';
    }
    // For production deployment on Render or other platforms
    // When deployed on Render, use same domain (backend serves API and frontend)
    return window.location.origin;
})();

// DOM Elements
let elements: { [key: string]: HTMLElement | null } = {};

/**
 * Initialize the application
 */
function initializeApp(): void {
    console.log('🚀 Initializing Trend Compass App...');
    
    // Get DOM elements
    elements = {
        // Trend Analysis
        trendForm: document.getElementById('trendForm'),
        trendQuery: document.getElementById('trendQuery'),
        trendIndustry: document.getElementById('trendIndustry'),
        trendTimeframe: document.getElementById('trendTimeframe'),
        trendCharCount: document.getElementById('trendCharCount'),
        trendValidation: document.getElementById('trendValidation'),
        trendLoading: document.getElementById('trendLoading'),
        trendResults: document.getElementById('trendResults'),
        trendResultsContent: document.getElementById('trendResultsContent'),
        
        // Audience Analysis
        audienceForm: document.getElementById('audienceForm'),
        audienceDescription: document.getElementById('audienceDescription'),
        audienceCategory: document.getElementById('audienceCategory'),
        audienceRegion: document.getElementById('audienceRegion'),
        audienceCharCount: document.getElementById('audienceCharCount'),
        audienceValidation: document.getElementById('audienceValidation'),
        audienceLoading: document.getElementById('audienceLoading'),
        audienceResults: document.getElementById('audienceResults'),
        audienceResultsContent: document.getElementById('audienceResultsContent'),
        
        // Global elements
        errorDisplay: document.getElementById('errorDisplay'),
        errorMessage: document.getElementById('errorMessage'),
        apiStatus: document.getElementById('apiStatus'),
        serverStatusBanner: document.getElementById('serverStatusBanner'),
        rateLimitDisplay: document.getElementById('rateLimitDisplay'),
        rateLimitText: document.getElementById('rateLimitText')
    };

    // Setup event listeners
    setupEventListeners();
    
    // Initialize all features
    initTabSwitching();
    initializeCharacterCounters();
    initializeValidation();
    
    // Auto-check API status on load (but only once per session to avoid rate limits)
    const hasCheckedThisSession = sessionStorage.getItem('apiChecked');
    if (!hasCheckedThisSession) {
        setTimeout(() => {
            checkAPIStatus();
            sessionStorage.setItem('apiChecked', 'true');
        }, 500);
    } else {
        // Just show cached status without making API call
        const statusElement = elements.apiStatus;
        if (statusElement) {
            const indicator = statusElement.querySelector('.status-indicator');
            const text = statusElement.querySelector('span:last-child');
            if (indicator) indicator.className = 'status-indicator status-warning';
            if (text) text.textContent = '⚠️ Status check skipped - conserving API requests';
        }
    }
    
    // Initialize rate limit display
    setTimeout(() => {
        initializeRateLimitDisplay();
    }, 1000);
    
    // Show test controls if in development environment  
    const isDeveloper = (
        // URL parameter for developer mode (works on any domain)
        new URLSearchParams(window.location.search).has('dev') ||
        new URLSearchParams(window.location.search).get('dev') === 'true' ||
        // Local development fallback
        window.location.hostname === 'localhost' || 
        window.location.hostname === '127.0.0.1' ||
        window.location.port === '8080' ||
        window.location.href.includes('localhost') ||
        window.location.href.includes('127.0.0.1')
    );
    
    if (isDeveloper) {
        const testControls = document.getElementById('testControls');
        if (testControls) {
            testControls.style.display = 'block';
        }
    }
    
    console.log('✅ App initialized successfully!');
}

/**
 * Setup event listeners
 */
function setupEventListeners(): void {
    // Trend form submission
    elements.trendForm?.addEventListener('submit', handleTrendSubmission);
    
    // Audience form submission
    elements.audienceForm?.addEventListener('submit', handleAudienceSubmission);
    
    // Enter key in inputs
    elements.trendQuery?.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleTrendSubmission(e);
        }
    });
}

/**
 * Handle trend form submission
 */
async function handleTrendSubmission(e: Event): Promise<void> {
    e.preventDefault();
    
    // Prevent double submission
    const submitButton = (e.target as HTMLFormElement).querySelector('button[type="submit"]') as HTMLButtonElement;
    if (submitButton?.disabled) {
        return;
    }
    
    // Validate input
    if (!validateTrendInput()) {
        return;
    }
    
    const formData = {
        query: (elements.trendQuery as HTMLInputElement)?.value?.trim() || '',
        industry: (elements.trendIndustry as HTMLSelectElement)?.value?.trim() || null,
        timeframe: (elements.trendTimeframe as HTMLSelectElement)?.value?.trim() || null
    };
    
    // Disable submit button and show loading state
    if (submitButton) {
        submitButton.disabled = true;
        submitButton.textContent = 'Analyzing...';
    }
    showTrendLoading();
    hideTrendResults();
    
    console.log('🌐 API URL:', `${API_BASE_URL}/api/trends/analyze`); // Debug logging
    console.log('📦 Form Data:', formData); // Debug logging

    try {
        // Add 30 second timeout for AI processing
        const controller = new AbortController();
        const timeoutId = setTimeout(() => {
            controller.abort();
        }, 30000);
        
        const response = await fetch(`${API_BASE_URL}/api/trends/analyze`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
            signal: controller.signal
        });
        
        clearTimeout(timeoutId);
        
        if (!response.ok) {
            const errorData = await response.json().catch(() => null);
            
            // Handle rate limiting
            if (response.status === 429) {
                const resetTime = errorData?.reset_time || 'several hours';
                throw new Error(`⚠️ DAILY LIMIT REACHED (15 requests per day)\n\nYou have used all your daily requests. Please wait ${resetTime} hours until tomorrow to try again.\n\nThis limit helps us control AI API costs during the hackathon.`);
            }
            
            throw new Error(`Server error: ${response.status} ${response.statusText}`);
        }
        
        const result = await response.json();
        
        console.log('🎯 API Response:', result); // Debug logging
        
        // Update rate limit display from response headers
        const rateLimit = response.headers.get('X-RateLimit-Limit');
        const rateLimitRemaining = response.headers.get('X-RateLimit-Remaining');
        
        if (rateLimit && rateLimitRemaining) {
            updateRateLimitDisplay(rateLimitRemaining, rateLimit);
        }
        
        // Hide loading before displaying results
        hideTrendLoading();
        
        // Display results - the backend returns data directly, not nested
        displayTrendResults(result);
        
    } catch (error) {
        console.error('Trend analysis failed:', error);
        
        // Make sure loading is hidden on error
        hideTrendLoading();
        
        let errorMessage = 'Failed to analyze trend. ';
        if (error instanceof Error) {
            if (error.name === 'AbortError') {
                errorMessage = 'Request timed out. AI analysis takes time - please try again.';
            } else if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError') || error.message.includes('fetch')) {
                errorMessage = '🔌 Server is currently down or unreachable. Please try again later or contact support.';
            } else if (error.message.includes('500')) {
                errorMessage = '⚠️ Server error occurred. Our team has been notified. Please try again in a few minutes.';
            } else {
                errorMessage += error.message;
            }
        }
        
        showValidationMessage('trendValidation', errorMessage, 'error');
    } finally {
        // Re-enable submit button
        if (submitButton) {
            submitButton.disabled = false;
            submitButton.innerHTML = '<i class="fas fa-search"></i> Analyze Trend';
        }
    }
}

/**
 * Handle audience form submission
 */
async function handleAudienceSubmission(e: Event): Promise<void> {
    e.preventDefault();
    
    // Prevent double submission
    const submitButton = (e.target as HTMLFormElement).querySelector('button[type="submit"]') as HTMLButtonElement;
    if (submitButton?.disabled) {
        return;
    }
    
    // Validate input
    if (!validateAudienceInput()) {
        return;
    }
    
    const formData = {
        target_audience: (elements.audienceDescription as HTMLTextAreaElement)?.value?.trim() || '',
        product_category: (elements.audienceCategory as HTMLSelectElement)?.value?.trim() || null,
        region: (elements.audienceRegion as HTMLSelectElement)?.value?.trim() || null
    };
    
    // Disable submit button and show loading state
    if (submitButton) {
        submitButton.disabled = true;
        submitButton.textContent = 'Analyzing...';
    }
    showAudienceLoading();
    hideAudienceResults();
    
    console.log('🌐 API URL:', `${API_BASE_URL}/api/audience/analyze`); // Debug logging
    console.log('📦 Form Data:', formData); // Debug logging

    try {
        // Add 30 second timeout for AI processing
        const controller = new AbortController();
        const timeoutId = setTimeout(() => {
            controller.abort();
        }, 30000);
        
        const response = await fetch(`${API_BASE_URL}/api/audience/analyze`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
            signal: controller.signal
        });
        
        clearTimeout(timeoutId);
        
        if (!response.ok) {
            const errorData = await response.json().catch(() => null);
            
            // Handle rate limiting
            if (response.status === 429) {
                const resetTime = errorData?.reset_time || 'several hours';
                throw new Error(`⚠️ DAILY LIMIT REACHED (15 requests per day)\n\nYou have used all your daily requests. Please wait ${resetTime} hours until tomorrow to try again.\n\nThis limit helps us control AI API costs during the hackathon.`);
            }
            
            throw new Error(`Server error: ${response.status} ${response.statusText}`);
        }
        
        const result = await response.json();
        
        // Update rate limit display from response headers
        const rateLimit = response.headers.get('X-RateLimit-Limit');
        const rateLimitRemaining = response.headers.get('X-RateLimit-Remaining');
        
        if (rateLimit && rateLimitRemaining) {
            updateRateLimitDisplay(rateLimitRemaining, rateLimit);
        }
        
        // Hide loading before displaying results
        hideAudienceLoading();
        
        // Display results
        displayAudienceResults(result);
        
    } catch (error) {
        console.error('Audience analysis failed:', error);
        
        // Make sure loading is hidden on error
        hideAudienceLoading();
        
        let errorMessage = 'Failed to analyze audience. ';
        if (error instanceof Error) {
            if (error.name === 'AbortError') {
                errorMessage = 'Request timed out. AI analysis takes time - please try again.';
            } else if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError') || error.message.includes('fetch')) {
                errorMessage = '🔌 Server is currently down or unreachable. Please try again later or contact support.';
            } else if (error.message.includes('500')) {
                errorMessage = '⚠️ Server error occurred. Our team has been notified. Please try again in a few minutes.';
            } else {
                errorMessage += error.message;
            }
        }
        
        showValidationMessage('audienceValidation', errorMessage, 'error');
    } finally {
        // Re-enable submit button
        if (submitButton) {
            submitButton.disabled = false;
            submitButton.innerHTML = '<i class="fas fa-users"></i> Analyze Audience';
        }
    }
}

/**
 * Analyze trend - main analysis function
 */
async function analyzeTrend(topic: string): Promise<void> {
    console.log(`🔍 Analyzing trend: ${topic}`);
    
    showTrendLoading();
    hideTrendError();
    hideTrendResults();
    
    try {
        // Get advanced options
        const industry = (elements.trendIndustry as HTMLSelectElement)?.value || '';
        const timeframe = (elements.trendTimeframe as HTMLSelectElement)?.value || '1year';
        
        const response = await fetch(`${API_BASE_URL}/api/trends/analyze`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ 
                topic,
                industry: industry || undefined,
                timeframe 
            })
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
        
        const result = await response.json();
        
        // Update rate limit display from response headers
        const rateLimit = response.headers.get('X-RateLimit-Limit');
        const rateLimitRemaining = response.headers.get('X-RateLimit-Remaining');
        
        if (rateLimit && rateLimitRemaining) {
            updateRateLimitDisplay(rateLimitRemaining, rateLimit);
        }
        
        // Hide loading before displaying results
        hideTrendLoading();
        
        // Display results
        displayTrendResults(result.trend_analysis || result.analysis);
        
    } catch (error) {
        console.error('Trend analysis failed:', error);
        
        // Make sure loading is hidden on error
        hideTrendLoading();
        
        let errorMessage = 'Failed to analyze trend. ';
        if (error instanceof Error) {
            if (error.name === 'AbortError') {
                errorMessage = 'Request timed out. AI analysis takes time - please try again.';
            } else if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError') || error.message.includes('fetch')) {
                errorMessage = '🔌 Server is currently down or unreachable. Please try again later or contact support.';
            } else if (error.message.includes('500')) {
                errorMessage = '⚠️ Server error occurred. Our team has been notified. Please try again in a few minutes.';
            } else {
                errorMessage += error.message;
            }
        }
        
        showValidationMessage('trendValidation', errorMessage, 'error');
    } finally {
        // Re-enable submit button
        const btn = document.getElementById('trendAnalyzeBtn') as HTMLButtonElement;
        if (btn) {
            btn.disabled = false;
            btn.innerHTML = '<i class="fas fa-search"></i> Analyze Trend';
        }
    }
}

/**
 * Analyze audience
 */
async function analyzeAudience(description: string): Promise<void> {
    console.log(`👥 Analyzing audience: ${description}`);
    
    showAudienceLoading();
    hideAudienceError();
    hideAudienceResults();
    
    try {
        // Get advanced options
        const category = (elements.audienceCategory as HTMLSelectElement)?.value || '';
        const region = (elements.audienceRegion as HTMLSelectElement)?.value || '';
        
        const response = await fetch(`${API_BASE_URL}/api/trends/audience`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ 
                description,
                category: category || undefined,
                region: region || undefined
            })
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
        
        const data = await response.json();
        
        // Display results
        displayAudienceResults(data.audience_insights || data.analysis);
        
    } catch (error) {
        console.error('Audience analysis error:', error);
        
        // Make sure loading is hidden on error
        hideAudienceLoading();
        
        let errorMessage = 'Failed to analyze audience. ';
        if (error instanceof Error) {
            if (error.name === 'AbortError') {
                errorMessage = 'Request timed out. AI analysis takes time - please try again.';
            } else if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError') || error.message.includes('fetch')) {
                errorMessage = '🔌 Server is currently down or unreachable. Please try again later or contact support.';
            } else if (error.message.includes('500')) {
                errorMessage = '⚠️ Server error occurred. Our team has been notified. Please try again in a few minutes.';
            } else {
                errorMessage += error.message;
            }
        }
        
        showValidationMessage('audienceValidation', errorMessage, 'error');
    } finally {
        // Re-enable submit button
        const btn = document.getElementById('audienceAnalyzeBtn') as HTMLButtonElement;
        if (btn) {
            btn.disabled = false;
            btn.innerHTML = '<i class="fas fa-users"></i> Analyze Audience';
        }
    }
}

/**
 * Display trend analysis results
 */
function displayTrendResults(analysis: any): void {
    console.log('📊 Displaying trend results:', analysis); // Debug logging
    
    if (elements.trendResultsContent) {
        if (!analysis) {
            // Show mock data for testing
            const mockAnalysis = `
            <h4>🚀 Trend Analysis Results</h4>
            <p><strong>Analysis Status:</strong> ✅ Completed Successfully</p>
            <p><strong>Test Mode:</strong> This is mock data to verify the display is working.</p>
            
            <h5>Key Insights:</h5>
            <ul>
                <li>Trend growth potential: High</li>
                <li>Market adoption: Rising</li>
                <li>Cultural impact: Significant</li>
            </ul>
            
            <h5>Forecast:</h5>
            <p>This trend is expected to gain momentum over the next 12 months.</p>
            `;
            elements.trendResultsContent.innerHTML = mockAnalysis;
        } else if (typeof analysis === 'string') {
            // Handle string response
            elements.trendResultsContent.innerHTML = formatAnalysisText(analysis);
        } else {
            // Handle object response from API
            const resultsHTML = `
                <div class="insight-section">
                    <h4><i class="fas fa-chart-line"></i> Trend Analysis Results</h4>
                    <p><strong>Query:</strong> ${analysis.query || 'N/A'}</p>
                    <p><strong>Analysis Date:</strong> ${analysis.timestamp ? new Date(analysis.timestamp).toLocaleString() : 'N/A'}</p>
                </div>
                
                ${analysis.summary ? `
                    <div class="insight-section">
                        <h4><i class="fas fa-lightbulb"></i> Summary</h4>
                        <div class="insight-content">${formatAnalysisText(analysis.summary)}</div>
                    </div>
                ` : ''}
                
                ${analysis.insights && analysis.insights.length > 0 ? `
                    <div class="insight-section">
                        <h4><i class="fas fa-trending-up"></i> Key Insights</h4>
                        <div class="insight-content">
                            ${analysis.insights.map((insight: any) => `
                                <div class="insight-item">
                                    <strong>${insight.title || insight.category || 'Insight'}</strong>
                                    <p>${insight.description || insight.content || insight}</p>
                                    ${insight.confidence ? `<small>Confidence: ${Math.round(insight.confidence * 100)}%</small>` : ''}
                                </div>
                            `).join('')}
                        </div>
                    </div>
                ` : ''}
                
                ${analysis.recommendations && analysis.recommendations.length > 0 ? `
                    <div class="insight-section">
                        <h4><i class="fas fa-star"></i> Recommendations</h4>
                        <div class="insight-content">
                            <ul>
                                ${analysis.recommendations.map((rec: string) => `<li>${rec}</li>`).join('')}
                            </ul>
                        </div>
                    </div>
                ` : ''}
            `;
            elements.trendResultsContent.innerHTML = resultsHTML;
        }
    }
    
    // Show results with animation
    showTrendResults();
    
    // Scroll to results
    elements.trendResults?.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'start' 
    });
}

/**
 * Display audience analysis results
 */
function displayAudienceResults(data: any): void {
    console.log('👥 Displaying audience results:', data); // Debug logging
    
    if (!elements.audienceResultsContent) return;
    
    // Handle both simple text response and structured data
    if (typeof data === 'string') {
        if (!data || data.trim() === '') {
            // Show mock data for testing
            const mockAnalysis = `
            <h4>👥 Audience Analysis Results</h4>
            <p><strong>Analysis Status:</strong> ✅ Completed Successfully</p>
            <p><strong>Test Mode:</strong> This is mock data to verify the display is working.</p>
            
            <h5>Audience Profile:</h5>
            <ul>
                <li>Primary Demographics: Young professionals (25-35)</li>
                <li>Interests: Technology, sustainability, wellness</li>
                <li>Behavior: Early adopters, social media active</li>
            </ul>
            
            <h5>Recommendations:</h5>
            <p>Target this audience through digital channels with authenticity-focused messaging.</p>
            `;
            elements.audienceResultsContent.innerHTML = mockAnalysis;
        } else {
            elements.audienceResultsContent.innerHTML = formatAnalysisText(data);
        }
    } else {
        // Structured data from original app.js format
        const resultsHTML = `
            <div class="insight-section">
                <h4><i class="fas fa-users"></i> Summary</h4>
                <div class="insight-content">${data.summary || data.audience_insights || data.analysis || 'Analysis data not available'}</div>
            </div>
            
            ${data.cultural_affinities && data.cultural_affinities.length > 0 ? `
                <div class="insight-section">
                    <h4><i class="fas fa-heart"></i> Cultural Affinities</h4>
                    <div class="insight-content">
                        ${data.cultural_affinities.map((affinity: any) => `
                            <div class="insight-item">
                                <strong>${affinity.title}</strong>
                                <p>${affinity.description}</p>
                                <small>Confidence: ${Math.round(affinity.confidence * 100)}%</small>
                            </div>
                        `).join('')}
                    </div>
                </div>
            ` : ''}
            
            ${data.insights && data.insights.length > 0 ? `
                <div class="insight-section">
                    <h4><i class="fas fa-lightbulb"></i> Key Insights</h4>
                    <div class="insight-content">
                        ${data.insights.map((insight: any) => `
                            <div class="insight-item">
                                <strong>${insight.title}</strong>
                                <p>${insight.description}</p>
                                <small>Confidence: ${Math.round(insight.confidence * 100)}%</small>
                            </div>
                        `).join('')}
                    </div>
                </div>
            ` : ''}
            
            ${data.recommendations && data.recommendations.length > 0 ? `
                <div class="insight-section">
                    <h4><i class="fas fa-star"></i> Recommendations</h4>
                    <div class="insight-content">
                        <ul>
                            ${data.recommendations.map((rec: string) => `<li>${rec}</li>`).join('')}
                        </ul>
                    </div>
                </div>
            ` : ''}
        `;
        
        elements.audienceResultsContent.innerHTML = resultsHTML;
    }
    
    // Show results with animation
    showAudienceResults();
    
    // Scroll to results
    elements.audienceResults?.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'start' 
    });
}

/**
 * Update rate limit display
 */
function updateRateLimitDisplay(remaining: string, total: string): void {
    if (elements.rateLimitText) {
        const used = parseInt(total) - parseInt(remaining);
        elements.rateLimitText.textContent = `API Usage: ${used}/${total} requests used today`;
    }
    
    // Make it visible 
    elements.rateLimitDisplay?.classList.remove('d-none');
    
    // Update form rate limits if needed
    const remainingNum = parseInt(remaining);
    
    if (remainingNum <= 0) {
        // Disable forms if no requests remaining
        const trendBtn = document.getElementById('trendAnalyzeBtn') as HTMLButtonElement;
        const audienceBtn = document.getElementById('audienceAnalyzeBtn') as HTMLButtonElement;
        
        if (trendBtn) {
            trendBtn.disabled = true;
            trendBtn.innerHTML = '<i class="fas fa-ban"></i> Daily Limit Reached';
        }
        if (audienceBtn) {
            audienceBtn.disabled = true;
            audienceBtn.innerHTML = '<i class="fas fa-ban"></i> Daily Limit Reached';
        }
    }
}

/**
 * Format analysis text for better display
 */
function formatAnalysisText(text: string): string {
    return text
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.*?)\*/g, '<em>$1</em>')
        .replace(/\n\n/g, '</p><p>')
        .replace(/\n/g, '<br>')
        .replace(/^/, '<p>')
        .replace(/$/, '</p>');
}

/**
 * Tab switching functionality
 */
function initTabSwitching(): void {
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabContents = document.querySelectorAll('.tab-content');
    
    if (tabButtons.length === 0 || tabContents.length === 0) {
        console.error('Tab elements not found');
        return;
    }
    
    // Initialize tab switching
    tabButtons.forEach(button => {
        button.addEventListener('click', function(this: HTMLElement, e: Event) {
            e.preventDefault();
            
            const targetTabId = this.getAttribute('data-tab');
            if (!targetTabId) return;
            
            switchToTab(targetTabId);
        });
    });
    
    // Ensure first tab is active on load
    const firstButton = tabButtons[0];
    const firstTabId = firstButton?.getAttribute('data-tab');
    if (firstTabId) {
        switchToTab(firstTabId);
    }
}

function switchToTab(targetTabId: string): void {
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabContents = document.querySelectorAll('.tab-content');
    
    // Remove active from all buttons
    tabButtons.forEach(btn => btn.classList.remove('active'));
    
    // Hide all content
    tabContents.forEach(content => {
        content.classList.remove('active');
        (content as HTMLElement).style.display = 'none';
    });
    
    // Activate target button
    const targetButton = document.querySelector(`[data-tab="${targetTabId}"]`);
    targetButton?.classList.add('active');
    
    // Show target content
    const targetContent = document.getElementById(targetTabId);
    if (targetContent) {
        targetContent.style.display = 'block';
        setTimeout(() => {
            targetContent.classList.add('active');
        }, 50);
    }
}

/**
 * Character counter functionality
 */
function initializeCharacterCounters(): void {
    // Trend query counter
    if (elements.trendQuery && elements.trendCharCount) {
        elements.trendQuery.addEventListener('input', function() {
            const count = (this as HTMLInputElement).value.length;
            if (elements.trendCharCount) {
                elements.trendCharCount.textContent = count.toString();
                
                // Color coding for character count (matching original app.js)
                if (count > 180) {
                    elements.trendCharCount.style.color = '#ef4444'; // Red
                } else if (count > 160) {
                    elements.trendCharCount.style.color = '#f59e0b'; // Orange
                } else {
                    elements.trendCharCount.style.color = '#6b7280'; // Gray
                }
            }
        });
    }
    
    // Audience description counter
    if (elements.audienceDescription && elements.audienceCharCount) {
        elements.audienceDescription.addEventListener('input', function() {
            const count = (this as HTMLTextAreaElement).value.length;
            if (elements.audienceCharCount) {
                elements.audienceCharCount.textContent = count.toString();
                
                // Color coding for character count (matching original app.js)
                if (count > 450) {
                    elements.audienceCharCount.style.color = '#ef4444'; // Red
                } else if (count > 400) {
                    elements.audienceCharCount.style.color = '#f59e0b'; // Orange
                } else {
                    elements.audienceCharCount.style.color = '#6b7280'; // Gray
                }
            }
        });
    }
}

/**
 * Validation functionality
 */
function initializeValidation(): void {
    // Trend query validation
    if (elements.trendQuery && elements.trendValidation) {
        elements.trendQuery.addEventListener('blur', function() {
            validateTrendInput();
        });
        
        elements.trendQuery.addEventListener('input', function() {
            // Clear validation message on input
            if (elements.trendValidation) {
                elements.trendValidation.textContent = '';
                elements.trendValidation.className = 'validation-message';
            }
        });
    }
    
    // Audience description validation
    if (elements.audienceDescription && elements.audienceValidation) {
        elements.audienceDescription.addEventListener('blur', function() {
            validateAudienceInput();
        });
        
        elements.audienceDescription.addEventListener('input', function() {
            // Clear validation message on input
            if (elements.audienceValidation) {
                elements.audienceValidation.textContent = '';
                elements.audienceValidation.className = 'validation-message';
            }
        });
    }
}

/**
 * Validate trend input
 */
function validateTrendInput(): boolean {
    const value = (elements.trendQuery as HTMLInputElement)?.value?.trim() || '';
    
    if (value.length < 3) {
        showValidationMessage('trendValidation', 'Please enter at least 3 characters', 'error');
        return false;
    }
    
    if (value.length > 200) {
        showValidationMessage('trendValidation', 'Please keep your query under 200 characters', 'error');
        return false;
    }
    
    showValidationMessage('trendValidation', 'Looking good! 👍', 'success');
    return true;
}

/**
 * Validate audience input
 */
function validateAudienceInput(): boolean {
    const value = (elements.audienceDescription as HTMLTextAreaElement)?.value?.trim() || '';
    
    if (value.length < 10) {
        showValidationMessage('audienceValidation', 'Please enter at least 10 characters', 'error');
        return false;
    }
    
    if (value.length > 500) {
        showValidationMessage('audienceValidation', 'Please keep your description under 500 characters', 'error');
        return false;
    }
    
    showValidationMessage('audienceValidation', 'Looking good! 👍', 'success');
    return true;
}

/**
 * Show validation message
 */
function showValidationMessage(elementId: string, message: string, type: 'success' | 'warning' | 'error'): void {
    const element = document.getElementById(elementId);
    if (element) {
        element.textContent = message;
        element.className = `validation-message ${type}`;
    }
}

function hideValidation(elementId: string): void {
    const element = document.getElementById(elementId);
    if (element) {
        element.style.display = 'none';
        element.classList.remove('show');
    }
}

/**
 * Rate limit display
 */
function initializeRateLimitDisplay(): void {
    // Show rate limit immediately 
    if (elements.rateLimitText) {
        elements.rateLimitText.textContent = 'API Usage: 15/15 requests available today';
    }
    
    // Make it visible
    elements.rateLimitDisplay?.classList.remove('d-none');
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
 * Show/hide functions for trend analysis
 */
function showTrendLoading(): void {
    elements.trendLoading?.classList.remove('d-none');
    const btn = document.getElementById('analyzeBtn') as HTMLButtonElement;
    if (btn) {
        btn.disabled = true;
        btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Analyzing...';
    }
}

function hideTrendLoading(): void {
    elements.trendLoading?.classList.add('d-none');
    const btn = document.getElementById('analyzeBtn') as HTMLButtonElement;
    if (btn) {
        btn.disabled = false;
        btn.innerHTML = '<i class="fas fa-search"></i> Analyze Trend';
    }
}

function showTrendResults(): void {
    elements.trendResults?.classList.remove('d-none');
    elements.trendResults?.classList.add('fade-in');
}

function hideTrendResults(): void {
    elements.trendResults?.classList.add('d-none');
}

function hideTrendError(): void {
    hideValidation('trendValidation');
}

/**
 * Show/hide functions for audience analysis
 */
function showAudienceLoading(): void {
    elements.audienceLoading?.classList.remove('d-none');
    const btn = document.getElementById('audienceAnalyzeBtn') as HTMLButtonElement;
    if (btn) {
        btn.disabled = true;
        btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Analyzing...';
    }
}

function hideAudienceLoading(): void {
    elements.audienceLoading?.classList.add('d-none');
    const btn = document.getElementById('audienceAnalyzeBtn') as HTMLButtonElement;
    if (btn) {
        btn.disabled = false;
        btn.innerHTML = '<i class="fas fa-users"></i> Analyze Audience';
    }
}

function showAudienceResults(): void {
    elements.audienceResults?.classList.remove('d-none');
    elements.audienceResults?.classList.add('fade-in');
}

function hideAudienceResults(): void {
    elements.audienceResults?.classList.add('d-none');
}

function hideAudienceError(): void {
    hideValidation('audienceValidation');
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
    // Check which tab is active and retry accordingly
    const activeTab = document.querySelector('.tab-content.active');
    if (activeTab?.id === 'trendAnalysisTab') {
        const input = elements.trendQuery as HTMLInputElement;
        const topic = input?.value?.trim();
        if (topic) {
            analyzeTrend(topic);
        } else {
            hideValidation('trendValidation');
        }
    } else if (activeTab?.id === 'audienceAnalysisTab') {
        const input = elements.audienceDescription as HTMLTextAreaElement;
        const description = input?.value?.trim();
        if (description) {
            analyzeAudience(description);
        } else {
            hideValidation('audienceValidation');
        }
    }
}

/**
 * Advanced options toggle
 */
function toggleAdvancedOptions(type: 'trend' | 'audience'): void {
    const elementId = type === 'trend' ? 'trendAdvanced' : 'audienceAdvanced';
    const element = document.getElementById(elementId);
    
    if (element) {
        if (element.style.display === 'none' || !element.style.display) {
            element.style.display = 'block';
            element.classList.add('show');
        } else {
            element.style.display = 'none';
            element.classList.remove('show');
        }
    }
}

/**
 * Helper functions
 */
function showSampleInputs(): void {
    const activeTab = document.querySelector('.tab-content.active');
    
    if (activeTab?.id === 'trendAnalysisTab') {
        fillRandomTrend();
    } else if (activeTab?.id === 'audienceAnalysisTab') {
        fillRandomAudience();
    }
}

function fillRandomTrend(): void {
    const samples = [
        "sustainable fashion trends",
        "AI-generated art movement",
        "plant-based meat alternatives",
        "remote work culture shift",
        "digital minimalism lifestyle",
        "wellness technology adoption",
        "circular economy practices",
        "virtual reality fitness",
        "social commerce growth",
        "micro-mobility transport"
    ];
    
    const randomSample = samples[Math.floor(Math.random() * samples.length)];
    const input = elements.trendQuery as HTMLInputElement;
    if (input) {
        input.value = randomSample;
        // Trigger character count update
        const event = new Event('input');
        input.dispatchEvent(event);
        input.focus();
    }
}

function fillRandomAudience(): void {
    const samples = [
        "Gen Z eco-conscious consumers aged 18-25 who prioritize sustainability and ethical brands in their purchasing decisions",
        "Tech-savvy millennials working remotely with high disposable income, interested in productivity tools and work-life balance",
        "Luxury fashion enthusiasts aged 25-40 in urban areas who value craftsmanship and exclusive designer pieces",
        "Health-conscious baby boomers interested in wellness technology, fitness tracking, and preventive healthcare solutions",
        "Creative professionals and artists who embrace digital tools, value authenticity, and seek platforms for self-expression",
        "Young parents seeking convenient, family-friendly products and services that save time while ensuring safety",
        "College students passionate about social justice, environmental causes, and affordable lifestyle brands",
        "High-income professionals in finance who value premium, time-saving solutions and status symbol products"
    ];
    
    const randomSample = samples[Math.floor(Math.random() * samples.length)];
    const input = elements.audienceDescription as HTMLTextAreaElement;
    if (input) {
        input.value = randomSample;
        // Trigger character count update
        const event = new Event('input');
        input.dispatchEvent(event);
        input.focus();
    }
}

function clearAllInputs(): void {
    // Clear trend inputs
    const trendQuery = elements.trendQuery as HTMLInputElement;
    const trendIndustry = elements.trendIndustry as HTMLSelectElement;
    const trendTimeframe = elements.trendTimeframe as HTMLSelectElement;
    
    if (trendQuery) {
        trendQuery.value = '';
        trendQuery.dispatchEvent(new Event('input'));
    }
    if (trendIndustry) trendIndustry.selectedIndex = 0;
    if (trendTimeframe) trendTimeframe.selectedIndex = 1; // Default to "1year"
    
    // Clear audience inputs
    const audienceDesc = elements.audienceDescription as HTMLTextAreaElement;
    const audienceCategory = elements.audienceCategory as HTMLSelectElement;
    const audienceRegion = elements.audienceRegion as HTMLSelectElement;
    
    if (audienceDesc) {
        audienceDesc.value = '';
        audienceDesc.dispatchEvent(new Event('input'));
    }
    if (audienceCategory) audienceCategory.selectedIndex = 0;
    if (audienceRegion) audienceRegion.selectedIndex = 0;
    
    // Clear validation messages
    const trendValidation = elements.trendValidation;
    const audienceValidation = elements.audienceValidation;
    
    if (trendValidation) {
        trendValidation.textContent = '';
        trendValidation.className = 'validation-message';
    }
    if (audienceValidation) {
        audienceValidation.textContent = '';
        audienceValidation.className = 'validation-message';
    }
}

function testConnection(): void {
    checkAPIStatus();
}

function clearCache(): void {
    sessionStorage.clear();
    localStorage.clear();
    location.reload();
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
    alert('Trend Compass - AI-Powered Trend Forecasting\n\nCombining Qloo\'s cultural affinity data with Gemini LLM for rich, strategic insights.');
}

/**
 * Show privacy modal (placeholder)
 */
function showPrivacy(): void {
    alert('Privacy Policy\n\nYour data is processed securely and not stored permanently. Analysis requests are sent to our API for processing only.');
}

// Make functions available globally for HTML onclick handlers
declare global {
    interface Window {
        retryAnalysis: () => void;
        exportResults: (type: 'trend' | 'audience') => void;
        saveResults: (type: 'trend' | 'audience') => void;
        checkAPIStatus: () => Promise<void>;
        showAbout: () => void;
        showPrivacy: () => void;
        toggleAdvancedOptions: (type: 'trend' | 'audience') => void;
        showSampleInputs: () => void;
        fillRandomTrend: () => void;
        fillRandomAudience: () => void;
        clearAllInputs: () => void;
        testConnection: () => void;
        clearCache: () => void;
    }
}

window.retryAnalysis = retryAnalysis;
window.exportResults = exportResults;
window.saveResults = saveResults;
window.checkAPIStatus = checkAPIStatus;
window.showAbout = showAbout;
window.showPrivacy = showPrivacy;
window.toggleAdvancedOptions = toggleAdvancedOptions;
window.showSampleInputs = showSampleInputs;
window.fillRandomTrend = fillRandomTrend;
window.fillRandomAudience = fillRandomAudience;
window.clearAllInputs = clearAllInputs;
window.testConnection = testConnection;
window.clearCache = clearCache;

// Initialize app when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeApp);
} else {
    initializeApp();
}

export {};
