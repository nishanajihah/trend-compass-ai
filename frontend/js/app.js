/**
 * Trend Compass - Main Application JavaScript
 * 
 * This file contains all the frontend logic for the Trend Compass application,
 * including tab switching, form handling, API communication, and result rendering.
 */

// Configuration
const API_BASE_URL = 'http://localhost:8000/api'; // Update this to your actual API URL in production

// DOM Elements
const tabButtons = document.querySelectorAll('.tab-button');
const tabContents = document.querySelectorAll('.tab-content');
const trendForm = document.getElementById('trend-form');
const audienceForm = document.getElementById('audience-form');
const trendResults = document.getElementById('trend-results');
const audienceResults = document.getElementById('audience-results');
const loadingOverlay = document.getElementById('loading-overlay');

/**
 * Initialize the application when DOM is fully loaded
 */
document.addEventListener('DOMContentLoaded', () => {
    // Set up tab switching
    initTabs();
    
    // Set up form submissions
    trendForm.addEventListener('submit', handleTrendFormSubmit);
    audienceForm.addEventListener('submit', handleAudienceFormSubmit);
});

/**
 * Initialize tab switching functionality
 */
function initTabs() {
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all tabs
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));
            
            // Add active class to clicked tab
            button.classList.add('active');
            const tabId = button.getAttribute('data-tab');
            document.getElementById(tabId).classList.add('active');
        });
    });
}

/**
 * Handle trend analysis form submission
 * @param {Event} e - Form submission event
 */
async function handleTrendFormSubmit(e) {
    e.preventDefault();
    
    // Get form values
    const query = document.getElementById('trend-query').value;
    const industry = document.getElementById('trend-industry').value;
    const timeframe = document.getElementById('trend-timeframe').value;
    
    // Show loading overlay
    showLoading();
    
    try {
        // Call the API
        const result = await analyzeTrend(query, industry, timeframe);
        
        // Display results
        displayTrendResults(result);
    } catch (error) {
        console.error('Error analyzing trend:', error);
        alert('An error occurred while analyzing the trend. Please try again.');
    } finally {
        // Hide loading overlay
        hideLoading();
    }
}

/**
 * Handle audience insight form submission
 * @param {Event} e - Form submission event
 */
async function handleAudienceFormSubmit(e) {
    e.preventDefault();
    
    // Get form values
    const targetAudience = document.getElementById('audience-description').value;
    const productCategory = document.getElementById('audience-product').value;
    const region = document.getElementById('audience-region').value;
    
    // Show loading overlay
    showLoading();
    
    try {
        // Call the API
        const result = await analyzeAudience(targetAudience, productCategory, region);
        
        // Display results
        displayAudienceResults(result);
    } catch (error) {
        console.error('Error analyzing audience:', error);
        alert('An error occurred while analyzing the audience. Please try again.');
    } finally {
        // Hide loading overlay
        hideLoading();
    }
}

/**
 * Call the API to analyze a trend
 * @param {string} query - The trend to analyze
 * @param {string} industry - Optional industry context
 * @param {string} timeframe - Optional timeframe for prediction
 * @returns {Promise<Object>} - API response
 */
async function analyzeTrend(query, industry, timeframe) {
    const response = await fetch(`${API_BASE_URL}/analyze/trend`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            query,
            industry: industry || undefined,
            timeframe: timeframe || undefined,
        }),
    });
    
    if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
    }
    
    return response.json();
}

/**
 * Call the API to analyze an audience
 * @param {string} targetAudience - The audience to analyze
 * @param {string} productCategory - Optional product category
 * @param {string} region - Optional geographic region
 * @returns {Promise<Object>} - API response
 */
async function analyzeAudience(targetAudience, productCategory, region) {
    const response = await fetch(`${API_BASE_URL}/analyze/audience`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            target_audience: targetAudience,
            product_category: productCategory || undefined,
            region: region || undefined,
        }),
    });
    
    if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
    }
    
    return response.json();
}

/**
 * Display trend analysis results in the UI
 * @param {Object} result - The API response data
 */
function displayTrendResults(result) {
    // Format date for display
    const timestamp = new Date(result.timestamp).toLocaleString();
    
    // Create results HTML
    const resultsHTML = `
        <div class="results-header">
            <h3>Trend Analysis: ${escapeHtml(result.query)}</h3>
            <p>${escapeHtml(result.summary)}</p>
            <div class="timestamp">Analysis generated on ${escapeHtml(timestamp)}</div>
        </div>
        
        <div class="results-content">
            <div class="insights-section">
                <h4><i class="fas fa-lightbulb"></i> Key Insights</h4>
                <div class="insights-list">
                    ${result.insights.map(insight => `
                        <div class="insight-card">
                            <h5>
                                ${escapeHtml(insight.title)}
                                <span class="confidence">${Math.round(insight.confidence * 100)}% confidence</span>
                            </h5>
                            <p>${escapeHtml(insight.description)}</p>
                            <div class="source">
                                <i class="fas fa-info-circle"></i>
                                Source: ${getSourceLabel(insight.source)}
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
            
            <div class="recommendations-section">
                <h4><i class="fas fa-clipboard-list"></i> Recommendations</h4>
                <div class="recommendations-list">
                    <ul>
                        ${result.recommendations.map(rec => `
                            <li>${escapeHtml(rec)}</li>
                        `).join('')}
                    </ul>
                </div>
            </div>
        </div>
    `;
    
    // Display results
    trendResults.innerHTML = resultsHTML;
    trendResults.style.display = 'block';
    
    // Scroll to results
    trendResults.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

/**
 * Display audience insight results in the UI
 * @param {Object} result - The API response data
 */
function displayAudienceResults(result) {
    // Format date for display
    const timestamp = new Date(result.timestamp).toLocaleString();
    
    // Create results HTML
    const resultsHTML = `
        <div class="results-header">
            <h3>Audience Insights: ${escapeHtml(result.target_audience)}</h3>
            <p>${escapeHtml(result.summary)}</p>
            <div class="timestamp">Analysis generated on ${escapeHtml(timestamp)}</div>
        </div>
        
        <div class="results-content">
            <div class="insights-section">
                <h4><i class="fas fa-users"></i> Cultural Affinities</h4>
                <div class="insights-list">
                    ${result.cultural_affinities.map(affinity => `
                        <div class="insight-card">
                            <h5>
                                ${escapeHtml(affinity.title)}
                                <span class="confidence">${Math.round(affinity.confidence * 100)}% confidence</span>
                            </h5>
                            <p>${escapeHtml(affinity.description)}</p>
                            <div class="source">
                                <i class="fas fa-info-circle"></i>
                                Source: ${getSourceLabel(affinity.source)}
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
            
            <div class="recommendations-section">
                <h4><i class="fas fa-bullseye"></i> Marketing Recommendations</h4>
                <div class="recommendations-list">
                    <ul>
                        ${result.recommendations.map(rec => `
                            <li>${escapeHtml(rec)}</li>
                        `).join('')}
                    </ul>
                </div>
            </div>
        </div>
    `;
    
    // Display results
    audienceResults.innerHTML = resultsHTML;
    audienceResults.style.display = 'block';
    
    // Scroll to results
    audienceResults.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

/**
 * Show loading overlay
 */
function showLoading() {
    loadingOverlay.style.display = 'flex';
}

/**
 * Hide loading overlay
 */
function hideLoading() {
    loadingOverlay.style.display = 'none';
}

/**
 * Get a human-readable label for data source
 * @param {string} source - The source identifier
 * @returns {string} - Human-readable source label
 */
function getSourceLabel(source) {
    switch (source) {
        case 'qloo':
            return 'Qloo Cultural Data';
        case 'llm':
            return 'Gemini AI Analysis';
        case 'combined':
        default:
            return 'Combined Analysis';
    }
}

/**
 * Escape HTML special characters to prevent XSS
 * @param {string} unsafe - Potentially unsafe string
 * @returns {string} - Escaped safe string
 */
function escapeHtml(unsafe) {
    if (unsafe === undefined || unsafe === null) return '';
    
    return unsafe
        .toString()
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}
