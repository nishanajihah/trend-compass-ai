/**
 * Trend Compass - Clean Application JavaSc    // Auto-check API status on load
    setTimeout(() => {
        checkAPIStatus();
    }, 1000);
    
    // Show test controls if in development
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        const testControls = document.getElementById('testControls');
        if (testControls) {
            testControls.style.display = 'block';
        }
    }
    
    console.log('✅ App initialized successfully!'); * Production version with minimal logging and proper error handling
 */

// API Configuration
const API_BASE_URL = 'http://localhost:8000';

// DOM Elements - Will be initialized after DOM loads
let elements = {};

/**
 * Initialize the application
 */
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Initializing Trend Compass App...');
    
    // Initialize DOM elements after DOM is ready
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
        audienceResultsContent: document.getElementById('audienceResultsContent')
    };
    
    // Initialize all features
    initTabSwitching();
    initializeEventListeners();
    initializeCharacterCounters();
    initializeValidation();
    
    // Auto-check API status on load (but only once per session to avoid rate limits)
    const hasCheckedThisSession = sessionStorage.getItem('apiChecked');
    if (!hasCheckedThisSession) {
        setTimeout(() => {
            checkApiStatus();
            sessionStorage.setItem('apiChecked', 'true');
        }, 500);
    } else {
        // Just show cached status without making API call
        const statusElement = document.getElementById('apiStatus');
        if (statusElement) {
            const indicator = statusElement.querySelector('.status-indicator');
            const text = statusElement.querySelector('span:last-child');
            indicator.className = 'status-indicator status-warning';
            text.textContent = '⚠️ Status check skipped - conserving API requests';
        }
    }
    
    // Initialize rate limit display
    setTimeout(() => {
        initializeRateLimitDisplay();
    }, 1000);
    
    console.log('✅ App initialized successfully!');
});

/**
 * Initialize all event listeners
 */
function initializeEventListeners() {
    // Trend form submission
    if (elements.trendForm) {
        elements.trendForm.addEventListener('submit', handleTrendSubmission);
    }
    
    // Audience form submission
    if (elements.audienceForm) {
        elements.audienceForm.addEventListener('submit', handleAudienceSubmission);
    }
}

/**
 * Initialize character counters
 */
function initializeCharacterCounters() {
    // Trend query counter
    if (elements.trendQuery && elements.trendCharCount) {
        elements.trendQuery.addEventListener('input', function() {
            const count = this.value.length;
            elements.trendCharCount.textContent = count;
            
            // Color coding for character count
            if (count > 180) {
                elements.trendCharCount.style.color = '#ef4444'; // Red
            } else if (count > 160) {
                elements.trendCharCount.style.color = '#f59e0b'; // Orange
            } else {
                elements.trendCharCount.style.color = '#6b7280'; // Gray
            }
        });
    }
    
    // Audience description counter
    if (elements.audienceDescription && elements.audienceCharCount) {
        elements.audienceDescription.addEventListener('input', function() {
            const count = this.value.length;
            elements.audienceCharCount.textContent = count;
            
            // Color coding for character count
            if (count > 450) {
                elements.audienceCharCount.style.color = '#ef4444'; // Red
            } else if (count > 400) {
                elements.audienceCharCount.style.color = '#f59e0b'; // Orange
            } else {
                elements.audienceCharCount.style.color = '#6b7280'; // Gray
            }
        });
    }
}

/**
 * Initialize form validation
 */
function initializeValidation() {
    // Trend query validation
    if (elements.trendQuery && elements.trendValidation) {
        elements.trendQuery.addEventListener('blur', function() {
            validateTrendInput();
        });
        
        elements.trendQuery.addEventListener('input', function() {
            // Clear validation message on input
            elements.trendValidation.textContent = '';
            elements.trendValidation.className = 'validation-message';
        });
    }
    
    // Audience description validation
    if (elements.audienceDescription && elements.audienceValidation) {
        elements.audienceDescription.addEventListener('blur', function() {
            validateAudienceInput();
        });
        
        elements.audienceDescription.addEventListener('input', function() {
            // Clear validation message on input
            elements.audienceValidation.textContent = '';
            elements.audienceValidation.className = 'validation-message';
        });
    }
}

/**
 * Validate trend input
 */
function validateTrendInput() {
    const value = elements.trendQuery.value.trim();
    
    if (value.length < 3) {
        showValidationMessage(elements.trendValidation, 'Please enter at least 3 characters', 'error');
        return false;
    }
    
    if (value.length > 200) {
        showValidationMessage(elements.trendValidation, 'Please keep your query under 200 characters', 'error');
        return false;
    }
    
    showValidationMessage(elements.trendValidation, 'Looking good! 👍', 'success');
    return true;
}

/**
 * Validate audience input
 */
function validateAudienceInput() {
    const value = elements.audienceDescription.value.trim();
    
    if (value.length < 10) {
        showValidationMessage(elements.audienceValidation, 'Please enter at least 10 characters', 'error');
        return false;
    }
    
    if (value.length > 500) {
        showValidationMessage(elements.audienceValidation, 'Please keep your description under 500 characters', 'error');
        return false;
    }
    
    showValidationMessage(elements.audienceValidation, 'Looking good! 👍', 'success');
    return true;
}

/**
 * Show validation message
 */
function showValidationMessage(element, message, type) {
    element.textContent = message;
    element.className = `validation-message ${type}`;
}

/**
 * Handle trend form submission
 */
async function handleTrendSubmission(e) {
    e.preventDefault();
    
    // Validate input
    if (!validateTrendInput()) {
        return;
    }
    
    const formData = {
        query: elements.trendQuery.value.trim(),
        industry: elements.trendIndustry?.value?.trim() || null,
        timeframe: elements.trendTimeframe?.value?.trim() || null
    };
    
    // Show loading state
    showLoading(elements.trendLoading);
    hideResults(elements.trendResults);
    
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
        
        // Update rate limit display from response headers
        const rateLimit = response.headers.get('X-RateLimit-Limit');
        const rateLimitRemaining = response.headers.get('X-RateLimit-Remaining');
        
        if (rateLimit && rateLimitRemaining) {
            const rateLimitElement = document.getElementById('rateLimitStatus');
            const rateLimitText = document.getElementById('rateLimitText');
            
            if (rateLimitText) {
                rateLimitText.textContent = `Requests remaining today: ${rateLimitRemaining}/${rateLimit}`;
            }
            
            updateFormRateLimits(rateLimitRemaining, rateLimit);
        }
        
        // Hide loading before displaying results
        hideLoading(elements.trendLoading);
        
        // Display results
        displayTrendResults(result);
        
    } catch (error) {
        console.error('Trend analysis failed:', error);
        
        // Make sure loading is hidden on error
        hideLoading(elements.trendLoading);
        
        let errorMessage = 'Failed to analyze trend. ';
        if (error.name === 'AbortError') {
            errorMessage = 'Request timed out. AI analysis takes time - please try again.';
        } else if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError') || error.message.includes('fetch')) {
            errorMessage = '🔌 Server is currently down or unreachable. Please try again later or contact support.';
        } else if (error.message.includes('500')) {
            errorMessage = '⚠️ Server error occurred. Our team has been notified. Please try again in a few minutes.';
        } else {
            errorMessage += error.message;
        }
        
        showErrorMessage(errorMessage);
    }
}

/**
 * Handle audience form submission
 */
async function handleAudienceSubmission(e) {
    e.preventDefault();
    
    // Validate input
    if (!validateAudienceInput()) {
        return;
    }
    
    const formData = {
        target_audience: elements.audienceDescription.value.trim(),
        product_category: elements.audienceCategory?.value?.trim() || null,
        region: elements.audienceRegion?.value?.trim() || null
    };
    
    // Show loading state
    showLoading(elements.audienceLoading);
    hideResults(elements.audienceResults);
    
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
            const rateLimitElement = document.getElementById('rateLimitStatus');
            const rateLimitText = document.getElementById('rateLimitText');
            
            if (rateLimitText) {
                rateLimitText.textContent = `Requests remaining today: ${rateLimitRemaining}/${rateLimit}`;
            }
            
            updateFormRateLimits(rateLimitRemaining, rateLimit);
        }
        
        // Hide loading before displaying results
        hideLoading(elements.audienceLoading);
        
        // Display results
        displayAudienceResults(result);
        
    } catch (error) {
        console.error('Audience analysis failed:', error);
        
        // Make sure loading is hidden on error
        hideLoading(elements.audienceLoading);
        
        let errorMessage = 'Failed to analyze audience. ';
        if (error.name === 'AbortError') {
            errorMessage = 'Request timed out. AI analysis takes time - please try again.';
        } else if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError') || error.message.includes('fetch')) {
            errorMessage = '🔌 Server is currently down or unreachable. Please try again later or contact support.';
        } else if (error.message.includes('500')) {
            errorMessage = '⚠️ Server error occurred. Our team has been notified. Please try again in a few minutes.';
        } else {
            errorMessage += error.message;
        }
        
        showErrorMessage(errorMessage);
    }
}

/**
 * Display trend analysis results
 */
function displayTrendResults(data) {
    if (!elements.trendResultsContent || !elements.trendResults) {
        console.error('Results elements not found');
        return;
    }
    
    // Ensure results are hidden first
    elements.trendResults.style.display = 'none';
    
    const resultsHTML = `
        <div class="insight-section">
            <h4><i class="fas fa-lightbulb"></i> Summary</h4>
            <div class="insight-content">${data.summary || 'Analysis data not available'}</div>
        </div>
        
        ${data.insights && data.insights.length > 0 ? `
            <div class="insight-section">
                <h4><i class="fas fa-chart-line"></i> Key Insights</h4>
                <div class="insight-content">
                    ${data.insights.map(insight => `
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
                        ${data.recommendations.map(rec => `<li>${rec}</li>`).join('')}
                    </ul>
                </div>
            </div>
        ` : ''}
    `;
    
    elements.trendResultsContent.innerHTML = resultsHTML;
    
    // Show results with smooth transition
    elements.trendResults.classList.remove('d-none');
    elements.trendResults.style.display = 'block';
    
    // Store data for export
    window.lastTrendData = data;
    
    // Scroll to results
    setTimeout(() => {
        elements.trendResults.scrollIntoView({ behavior: 'smooth' });
    }, 100);
}

/**
 * Display audience analysis results
 */
function displayAudienceResults(data) {
    if (!elements.audienceResultsContent || !elements.audienceResults) {
        console.error('Results elements not found');
        return;
    }
    
    const resultsHTML = `
        <div class="insight-section">
            <h4><i class="fas fa-users"></i> Summary</h4>
            <div class="insight-content">${data.summary || 'Analysis data not available'}</div>
        </div>
        
        ${data.cultural_affinities && data.cultural_affinities.length > 0 ? `
            <div class="insight-section">
                <h4><i class="fas fa-heart"></i> Cultural Affinities</h4>
                <div class="insight-content">
                    ${data.cultural_affinities.map(affinity => `
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
                    ${data.insights.map(insight => `
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
                        ${data.recommendations.map(rec => `<li>${rec}</li>`).join('')}
                    </ul>
                </div>
            </div>
        ` : ''}
    `;
    
    elements.audienceResultsContent.innerHTML = resultsHTML;
    
    // Show results
    elements.audienceResults.classList.remove('d-none');
    elements.audienceResults.style.display = 'block';
    
    // Store data for export
    window.lastAudienceData = data;
    
    // Scroll to results
    setTimeout(() => {
        elements.audienceResults.scrollIntoView({ behavior: 'smooth' });
    }, 100);
}

/**
 * Utility functions
 */
function showLoading(element) {
    if (element) {
        element.classList.remove('d-none');
    }
}

function hideLoading(element) {
    if (element) {
        element.classList.add('d-none');
    }
}

function showResults(element) {
    if (element) {
        element.classList.remove('d-none');
    }
}

function hideResults(element) {
    if (element) {
        element.classList.add('d-none');
    }
}

function showErrorMessage(message) {
    // Create or update error message
    const errorContainer = document.getElementById('messageContainer');
    if (errorContainer) {
        errorContainer.innerHTML = `
            <div class="alert alert-error">
                <i class="fas fa-exclamation-triangle"></i>
                <span>${message}</span>
                <button class="alert-close" onclick="this.parentElement.parentElement.classList.add('d-none')">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;
        errorContainer.classList.remove('d-none');
        
        // Auto-hide after 8 seconds
        setTimeout(() => {
            errorContainer.classList.add('d-none');
        }, 8000);
    } else {
        // Fallback to console and alert
        console.error(message);
        alert(message);
    }
}

/**
 * Export functionality
 */
function exportResults(type, format) {
    // Get stored data
    const data = type === 'trend' ? window.lastTrendData : window.lastAudienceData;
    if (!data) {
        showErrorMessage('No data available for export. Please run an analysis first.');
        return;
    }
    
    if (format === 'json') {
        exportAsJSON(data, `${type}-analysis-${Date.now()}.json`);
    } else if (format === 'csv') {
        exportAsCSV(data, `${type}-analysis-${Date.now()}.csv`);
    }
}

function exportAsJSON(data, filename) {
    const jsonString = JSON.stringify(data, null, 2);
    downloadFile(jsonString, filename, 'application/json');
}

function exportAsCSV(data, filename) {
    // Convert complex data to CSV format
    let csvContent = 'Type,Content\n';
    
    // Add summary
    if (data.summary) {
        csvContent += `"Summary","${data.summary.replace(/"/g, '""')}"\n`;
    }
    
    // Add insights
    if (data.insights && data.insights.length > 0) {
        data.insights.forEach(insight => {
            csvContent += `"Insight: ${insight.title}","${insight.description.replace(/"/g, '""')} (Confidence: ${Math.round(insight.confidence * 100)}%)"\n`;
        });
    }
    
    // Add cultural affinities (for audience data)
    if (data.cultural_affinities && data.cultural_affinities.length > 0) {
        data.cultural_affinities.forEach(affinity => {
            csvContent += `"Cultural Affinity: ${affinity.title}","${affinity.description.replace(/"/g, '""')} (Confidence: ${Math.round(affinity.confidence * 100)}%)"\n`;
        });
    }
    
    // Add recommendations
    if (data.recommendations && data.recommendations.length > 0) {
        data.recommendations.forEach(rec => {
            csvContent += `"Recommendation","${rec.replace(/"/g, '""')}"\n`;
        });
    }
    
    downloadFile(csvContent, filename, 'text/csv');
}

function downloadFile(content, filename, contentType) {
    const blob = new Blob([content], { type: contentType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}

/**
 * TAB SWITCHING AND HELPER TOOLS
 */

/**
 * Initialize tab switching
 */
function initTabSwitching() {
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabContents = document.querySelectorAll('.tab-content');
    
    if (tabButtons.length === 0 || tabContents.length === 0) {
        console.error('Tab elements not found');
        return;
    }
    
    // Initialize tab switching
    tabButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetTabId = this.getAttribute('data-tab');
            if (!targetTabId) return;
            
            // Remove active from all buttons
            tabButtons.forEach(btn => btn.classList.remove('active'));
            
            // Hide all content
            tabContents.forEach(content => {
                content.classList.remove('active');
                content.style.display = 'none';
            });
            
            // Activate clicked button
            this.classList.add('active');
            
            // Show target content
            const targetContent = document.getElementById(targetTabId);
            if (targetContent) {
                targetContent.style.display = 'block';
                setTimeout(() => {
                    targetContent.classList.add('active');
                }, 50);
            }
        });
    });
    
    // Ensure first tab is active on load
    const firstButton = tabButtons[0];
    const firstTabId = firstButton?.getAttribute('data-tab');
    if (firstTabId) {
        const firstContent = document.getElementById(firstTabId);
        if (firstContent) {
            firstButton.classList.add('active');
            firstContent.style.display = 'block';
            firstContent.classList.add('active');
            
            // Hide other contents
            tabContents.forEach(content => {
                if (content.id !== firstTabId) {
                    content.style.display = 'none';
                    content.classList.remove('active');
                }
            });
        }
    }
}

/**
 * Toggle advanced input options
 */
function toggleAdvancedInputs(type) {
    const container = document.querySelector(`#${type}Form .advanced-inputs`);
    if (!container) {
        return;
    }
    
    const button = event.target.closest('button');
    const icon = button.querySelector('i');
    const isHidden = container.style.display === 'none' || !container.style.display;
    
    if (isHidden) {
        container.style.display = 'block';
        container.classList.add('show');
        icon.className = 'fas fa-chevron-up';
        button.innerHTML = '<i class="fas fa-chevron-up"></i> Hide Advanced Options';
    } else {
        container.classList.remove('show');
        setTimeout(() => {
            container.style.display = 'none';
        }, 300);
        icon.className = 'fas fa-cog';
        button.innerHTML = '<i class="fas fa-cog"></i> Advanced Options';
    }
}

/**
 * Show helper tools menu
 */
function showHelperMenu(button) {
    // Remove existing menu if any
    const existingMenu = document.querySelector('.helper-menu');
    if (existingMenu) {
        existingMenu.remove();
        return;
    }
    
    const menu = document.createElement('div');
    menu.className = 'helper-menu';
    menu.innerHTML = `
        <div class="helper-item" onclick="fillRandomTrend()">
            <i class="fas fa-chart-line"></i>
            <span>Sample Trend</span>
        </div>
        <div class="helper-item" onclick="fillRandomAudience()">
            <i class="fas fa-users"></i>
            <span>Sample Audience</span>
        </div>
        <div class="helper-item" onclick="clearAllInputs()">
            <i class="fas fa-eraser"></i>
            <span>Clear All Fields</span>
        </div>
        <div class="helper-item" onclick="checkApiStatus()">
            <i class="fas fa-heartbeat"></i>
            <span>Check API Status</span>
        </div>
        <div class="helper-item" onclick="resetRateLimits()">
            <i class="fas fa-refresh"></i>
            <span>Reset Rate Limits (Dev)</span>
        </div>
        <div class="helper-item" onclick="openDeveloperDocs()">
            <i class="fas fa-code"></i>
            <span>Developer Docs</span>
        </div>
    `;
    
    // Add styles
    const style = document.createElement('style');
    style.textContent = `
        .helper-menu {
            position: absolute;
            top: 100%;
            left: 50%;
            transform: translateX(-50%);
            background: white;
            border-radius: 12px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.2);
            padding: 8px;
            z-index: 1000;
            min-width: 220px;
            animation: dropDown 0.3s ease;
            margin-top: 8px;
        }
        
        .helper-item {
            display: flex;
            align-items: center;
            padding: 12px 16px;
            cursor: pointer;
            border-radius: 8px;
            transition: background-color 0.2s;
        }
        
        .helper-item:hover {
            background-color: #f5f5f5;
        }
        
        .helper-item i {
            margin-right: 12px;
            width: 16px;
            color: var(--primary-500);
        }
        
        @keyframes dropDown {
            from { opacity: 0; transform: translateX(-50%) translateY(-10px); }
            to { opacity: 1; transform: translateX(-50%) translateY(0); }
        }
    `;
    
    if (!document.querySelector('#helper-styles')) {
        style.id = 'helper-styles';
        document.head.appendChild(style);
    }
    
    // Position relative to the button
    button.parentElement.style.position = 'relative';
    button.parentElement.appendChild(menu);
    
    // Close menu when clicking outside
    setTimeout(() => {
        document.addEventListener('click', function closeMenu(e) {
            if (!menu.contains(e.target) && !button.contains(e.target)) {
                menu.remove();
                document.removeEventListener('click', closeMenu);
            }
        });
    }, 100);
}

/**
 * Helper functions for quick actions
 */
function fillRandomTrend() {
    const trends = [
        'Sustainable Fashion',
        'AI-Powered Productivity Tools',
        'Plant-Based Meat Alternatives',
        'Remote Work Culture',
        'Electric Vehicle Adoption',
        'Mental Health Awareness',
        'Cryptocurrency Integration',
        'Virtual Reality Entertainment',
        'Smart Home Technology',
        'Minimalist Lifestyle'
    ];
    
    const randomTrend = trends[Math.floor(Math.random() * trends.length)];
    const input = document.getElementById('trendQuery');
    if (input) {
        input.value = randomTrend;
        input.focus();
    }
    document.querySelector('.helper-menu')?.remove();
}

function fillRandomAudience() {
    const audiences = [
        'Tech-savvy millennials interested in sustainable living and productivity apps',
        'Gen Z fashion enthusiasts who value authenticity and social causes',
        'Health-conscious professionals aged 25-35 seeking work-life balance',
        'Gaming enthusiasts and esports fans who embrace new technology',
        'Creative professionals in design and media looking for inspiration',
        'Eco-conscious parents focused on sustainable products for their families',
        'Digital nomads seeking portable and efficient lifestyle solutions',
        'Fitness enthusiasts interested in wearable technology and wellness apps'
    ];
    
    const randomAudience = audiences[Math.floor(Math.random() * audiences.length)];
    const input = document.getElementById('audienceDescription');
    if (input) {
        input.value = randomAudience;
        input.focus();
    }
    document.querySelector('.helper-menu')?.remove();
}

function clearAllInputs() {
    const inputs = document.querySelectorAll('input[type="text"], textarea, select');
    inputs.forEach(input => {
        input.value = '';
    });
    
    // Also clear results
    const results = document.querySelectorAll('.results-section');
    results.forEach(result => {
        result.classList.add('d-none');
    });
    
    document.querySelector('.helper-menu')?.remove();
}

function openDeveloperDocs() {
    // Open the FastAPI docs in a new tab
    window.open('http://localhost:8000/docs', '_blank');
    document.querySelector('.helper-menu')?.remove();
}

/**
 * Reset rate limits (development only)
 */
async function resetRateLimits() {
    try {
        const response = await fetch(`${API_BASE_URL}/api/reset-rate-limits`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            }
        });
        
        if (response.ok) {
            showSuccessMessage('Rate limits reset successfully! You now have 15 fresh requests.');
            // Refresh rate limit displays
            setTimeout(() => {
                initializeRateLimitDisplay();
                checkApiStatus();
            }, 500);
        } else {
            showErrorMessage('Failed to reset rate limits. Make sure the backend server is running.');
        }
    } catch (error) {
        showErrorMessage('Could not connect to server to reset rate limits.');
    }
    
    document.querySelector('.helper-menu')?.remove();
}

/**
 * Check API status and update the indicator
 */
async function checkApiStatus() {
    const statusElement = document.getElementById('apiStatus');
    const rateLimitElement = document.getElementById('rateLimitStatus');
    const rateLimitText = document.getElementById('rateLimitText');
    
    if (!statusElement) {
        return;
    }
    
    const indicator = statusElement.querySelector('.status-indicator');
    const text = statusElement.querySelector('span:last-child');
    
    try {
        // Update to checking state
        indicator.className = 'status-indicator status-warning';
        text.textContent = 'Checking API status...';
        
        const response = await fetch('http://localhost:8000/api/status', {
            method: 'GET',
            signal: AbortSignal.timeout(5000) // 5 second timeout
        });
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }
        
        const data = await response.json();
        
        // Update rate limit info from headers
        const rateLimit = response.headers.get('X-RateLimit-Limit');
        const rateLimitRemaining = response.headers.get('X-RateLimit-Remaining');
        
        if (rateLimit && rateLimitRemaining && rateLimitElement && rateLimitText) {
            rateLimitText.textContent = `Requests remaining today: ${rateLimitRemaining}/${rateLimit}`;
            rateLimitElement.style.display = 'flex';
            
            // Update form rate limit displays
            updateFormRateLimits(rateLimitRemaining, rateLimit);
        }
        
        // Update based on response
        if (data.status === 'healthy') {
            indicator.className = 'status-indicator status-healthy';
            text.textContent = `✨ APIs Ready - Qloo: ${data.services.qloo_api.status}, Gemini: ${data.services.gemini_llm.status}`;
            
            // Hide server status banner if it's showing
            const serverBanner = document.getElementById('serverStatusBanner');
            if (serverBanner) {
                serverBanner.classList.add('d-none');
            }
        } else {
            indicator.className = 'status-indicator status-warning';
            text.textContent = '⚠️ Some services in demo mode';
            
            // Hide server status banner since server is responding
            const serverBanner = document.getElementById('serverStatusBanner');
            if (serverBanner) {
                serverBanner.classList.add('d-none');
            }
        }
        
    } catch (error) {
        console.error('API status check failed:', error);
        indicator.className = 'status-indicator status-error';
        
        // Show server status banner
        const serverBanner = document.getElementById('serverStatusBanner');
        if (serverBanner) {
            serverBanner.classList.remove('d-none');
        }
        
        if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError') || error.name === 'TypeError') {
            text.textContent = '🔌 Server is down - Please start the backend server';
        } else if (error.message.includes('429') || error.message.includes('Too Many Requests')) {
            text.textContent = '⚠️ API rate limit exceeded - Try again later';
        } else {
            text.textContent = '⚠️ Server connection error - Check your network';
        }
    }
    
    // Close helper menu
    document.querySelector('.helper-menu')?.remove();
}

function saveInsight(type) {
    console.log(`Saving ${type} insight...`);
    
    // Get stored data
    const data = type === 'trend' ? window.lastTrendData : window.lastAudienceData;
    if (!data) {
        showErrorMessage('No data available to save. Please run an analysis first.');
        return;
    }
    
    // Create a comprehensive save object
    const saveData = {
        type: type,
        timestamp: new Date().toISOString(),
        data: data,
        summary: data.summary || 'No summary available',
        insights: data.insights || [],
        recommendations: data.recommendations || []
    };
    
    // Add type-specific data
    if (type === 'audience' && data.cultural_affinities) {
        saveData.cultural_affinities = data.cultural_affinities;
    }
    
    // Save to localStorage for persistence
    const savedInsights = JSON.parse(localStorage.getItem('savedInsights') || '[]');
    savedInsights.push(saveData);
    localStorage.setItem('savedInsights', JSON.stringify(savedInsights));
    
    // Also download as JSON file
    const filename = `saved-${type}-insight-${Date.now()}.json`;
    const jsonString = JSON.stringify(saveData, null, 2);
    downloadFile(jsonString, filename, 'application/json');
    
    // Show success message
    showSuccessMessage(`${type.charAt(0).toUpperCase() + type.slice(1)} insight saved successfully!`);
}

// Helper function to show success messages
function showSuccessMessage(message) {
    const messageDiv = document.createElement('div');
    messageDiv.className = 'alert alert-success';
    messageDiv.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        background: linear-gradient(135deg, #10b981 0%, #059669 100%);
        color: white;
        border-radius: 8px;
        box-shadow: 0 4px 15px rgba(16, 185, 129, 0.3);
        z-index: 10000;
        animation: slideIn 0.3s ease-out;
    `;
    messageDiv.textContent = message;
    
    document.body.appendChild(messageDiv);
    
    setTimeout(() => {
        messageDiv.style.animation = 'slideOut 0.3s ease-in';
        setTimeout(() => document.body.removeChild(messageDiv), 300);
    }, 3000);
}

/**
 * Test function for export/save functionality
 */
function setupTestDataAndShow() {
    // Mock trend data
    window.lastTrendData = {
        summary: "AI and sustainability are trending topics in 2024. These topics show high engagement across social platforms.",
        insights: [
            {
                title: "AI Adoption Surge",
                description: "Artificial Intelligence adoption has increased by 300% this year",
                confidence: 0.85
            },
            {
                title: "Green Technology Focus",
                description: "Sustainable tech solutions are gaining mainstream attention",
                confidence: 0.78
            }
        ],
        recommendations: [
            "Invest in AI-powered tools for business automation",
            "Develop eco-friendly product lines",
            "Create content around sustainability themes"
        ]
    };

    // Mock audience data
    window.lastAudienceData = {
        summary: "Tech-savvy millennials aged 25-35 interested in eco-friendly solutions and digital innovation.",
        insights: [
            {
                title: "Digital Native Behavior",
                description: "Audience prefers mobile-first experiences and social commerce",
                confidence: 0.92
            }
        ],
        cultural_affinities: [
            {
                title: "Tech Enthusiasm",
                description: "High interest in emerging technologies and gadgets",
                confidence: 0.90
            },
            {
                title: "Environmental Consciousness",
                description: "Strong preference for sustainable and eco-friendly products",
                confidence: 0.82
            }
        ],
        recommendations: [
            "Use Instagram and TikTok for marketing campaigns",
            "Highlight product sustainability in messaging",
            "Offer mobile-optimized shopping experiences",
            "Partner with eco-conscious influencers"
        ]
    };
    
    // Show trend results section with test data
    const trendResults = document.getElementById('trendResults');
    const audienceResults = document.getElementById('audienceResults');
    
    if (trendResults) {
        trendResults.classList.remove('d-none');
        document.getElementById('trendResultsContent').innerHTML = `
            <div style="background: #f0f9ff; padding: 20px; border-radius: 12px; margin: 15px 0; border-left: 4px solid #3b82f6;">
                <h4 style="color: #1e40af; margin-bottom: 10px;">🧪 Test Data Loaded</h4>
                <p><strong>Summary:</strong> ${window.lastTrendData.summary}</p>
                <p><strong>Insights:</strong> ${window.lastTrendData.insights.length} insights loaded</p>
                <p><strong>Recommendations:</strong> ${window.lastTrendData.recommendations.length} recommendations loaded</p>
                <p style="margin-top: 15px; color: #f59e0b; font-weight: bold;">⚠️ Remember: 15 requests per day for hackathon demo!</p>
                <p style="margin-top: 10px; color: #059669; font-weight: bold;">✅ Try the export and save buttons above!</p>
            </div>
        `;
    }
    
    if (audienceResults) {
        audienceResults.classList.remove('d-none');
        document.getElementById('audienceResultsContent').innerHTML = `
            <div style="background: #f0fdf4; padding: 20px; border-radius: 12px; margin: 15px 0; border-left: 4px solid #10b981;">
                <h4 style="color: #065f46; margin-bottom: 10px;">🧪 Audience Test Data Loaded</h4>
                <p><strong>Summary:</strong> ${window.lastAudienceData.summary}</p>
                <p><strong>Cultural Affinities:</strong> ${window.lastAudienceData.cultural_affinities.length} affinities loaded</p>
                <p><strong>Recommendations:</strong> ${window.lastAudienceData.recommendations.length} recommendations loaded</p>
                <p style="margin-top: 15px; color: #f59e0b; font-weight: bold;">⚠️ Remember: 15 requests per day for hackathon demo!</p>
                <p style="margin-top: 10px; color: #7c3aed; font-weight: bold;">✅ Try the export and save buttons above!</p>
            </div>
        `;
    }
    
    showSuccessMessage('Test data loaded! Export/Save buttons are now functional.');
    console.log('🧪 Test data loaded successfully. You can now test all export/save functions.');
}

/**
 * Initialize rate limit display on page load
 */
function initializeRateLimitDisplay() {
    const trendRateLimit = document.getElementById('trendRateLimit');
    const audienceRateLimit = document.getElementById('audienceRateLimit');
    
    // Set initial message
    const initialMessage = "Usage limits: 15 requests available today!";
    
    [trendRateLimit, audienceRateLimit].forEach(element => {
        if (element) {
            const span = element.querySelector('span');
            if (span) {
                span.textContent = initialMessage;
            }
        }
    });
}

/**
 * Update form rate limit displays
 */
function updateFormRateLimits(remaining, total) {
    const trendRateLimit = document.getElementById('trendRateLimit');
    const audienceRateLimit = document.getElementById('audienceRateLimit');
    
    const remainingNum = parseInt(remaining);
    const totalNum = parseInt(total);
    
    let message, isWarning;
    
    if (remainingNum === 0) {
        message = `⛔ No requests remaining today (${remainingNum}/${totalNum})`;
        isWarning = true;
    } else if (remainingNum <= 3) {
        message = `⚠️ Only ${remainingNum} requests left today (${remainingNum}/${totalNum})`;
        isWarning = true;
    } else {
        message = `✅ ${remainingNum} requests remaining today (${remainingNum}/${totalNum})`;
        isWarning = false;
    }
    
    [trendRateLimit, audienceRateLimit].forEach(element => {
        if (element) {
            const span = element.querySelector('span');
            if (span) {
                span.textContent = message;
            }
            
            if (isWarning) {
                element.classList.add('warning');
            } else {
                element.classList.remove('warning');
            }
        }
    });
}
