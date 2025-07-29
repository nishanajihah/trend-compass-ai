/**
 * Trend Compass - Clean Application JavaScript
 * Fixed version without duplicates and with working API endpoints
 */

// API Configuration
const API_BASE_URL = 'http://localhost:8000';

// DOM Elements - Clean mapping
const elements = {
    // Trend Analysis
    trendForm: document.getElementById('trendForm'),
    trendQuery: document.getElementById('trendQuery'),
    trendIndustry: document.getElementById('trendIndustry'),
    trendTimeframe: document.getElementById('trendTimeframe'),
    trendCharCount: document.getElementById('trendCharCount'),
    trendValidation: document.getElementById('trendValidation'),
    trendLoading: document.getElementById('trendLoading'),
    trendResults: document.getElementById('trendResults'),
    
    // Audience Analysis
    audienceForm: document.getElementById('audienceForm'),
    audienceDescription: document.getElementById('audienceDescription'),
    audienceCategory: document.getElementById('audienceCategory'),
    audienceRegion: document.getElementById('audienceRegion'),
    audienceCharCount: document.getElementById('audienceCharCount'),
    audienceValidation: document.getElementById('audienceValidation'),
    audienceLoading: document.getElementById('audienceLoading'),
    audienceResults: document.getElementById('audienceResults')
};

/**
 * Initialize the application
 */
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Initializing Trend Compass App...');
    
    // Initialize all features
    initTabSwitching();
    initializeEventListeners();
    initializeCharacterCounters();
    initializeValidation();
    
    // Auto-check API status on load
    setTimeout(() => {
        checkApiStatus();
    }, 500);
    
    console.log('✅ Trend Compass App initialized successfully!');
});

/**
 * Initialize all event listeners
 */
function initializeEventListeners() {
    // Trend form submission
    if (elements.trendForm) {
        elements.trendForm.addEventListener('submit', handleTrendSubmission);
        console.log('✅ Trend form listener added');
    }
    
    // Audience form submission
    if (elements.audienceForm) {
        elements.audienceForm.addEventListener('submit', handleAudienceSubmission);
        console.log('✅ Audience form listener added');
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
    console.log('🔍 Processing trend analysis request...');
    
    // Hide advanced options after submission
    const advancedInputs = document.querySelector('#trendForm .advanced-inputs');
    if (advancedInputs && advancedInputs.style.display === 'block') {
        toggleAdvancedInputs('trend');
    }
    
    // Validate input
    if (!validateTrendInput()) {
        console.log('❌ Trend validation failed');
        return;
    }
    
    const formData = {
        trend_query: elements.trendQuery.value.trim(),
        industry: elements.trendIndustry?.value || '',
        timeframe: elements.trendTimeframe?.value || ''
    };
    
    console.log('📊 Trend data:', formData);
    
    // Show loading state
    showLoading(elements.trendLoading);
    hideResults(elements.trendResults);
    
    try {
        const response = await fetch(`${API_BASE_URL}/api/trends/analyze`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData)
        });
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        const result = await response.json();
        console.log('✅ Trend analysis completed:', result);
        
        // Display results
        displayTrendResults(result);
        
    } catch (error) {
        console.error('❌ Trend analysis failed:', error);
        showErrorMessage('Failed to analyze trend. Please check if the backend server is running and try again.');
    } finally {
        hideLoading(elements.trendLoading);
    }
}

/**
 * Handle audience form submission
 */
async function handleAudienceSubmission(e) {
    e.preventDefault();
    console.log('👥 Processing audience analysis request...');
    
    // Hide advanced options after submission
    const advancedInputs = document.querySelector('#audienceForm .advanced-inputs');
    if (advancedInputs && advancedInputs.style.display === 'block') {
        toggleAdvancedInputs('audience');
    }
    
    // Validate input
    if (!validateAudienceInput()) {
        console.log('❌ Audience validation failed');
        return;
    }
    
    const formData = {
        audience_description: elements.audienceDescription.value.trim(),
        product_category: elements.audienceCategory?.value || '',
        region: elements.audienceRegion?.value || ''
    };
    
    console.log('👥 Audience data:', formData);
    
    // Show loading state
    showLoading(elements.audienceLoading);
    hideResults(elements.audienceResults);
    
    try {
        const response = await fetch(`${API_BASE_URL}/api/audience/analyze`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData)
        });
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        const result = await response.json();
        console.log('✅ Audience analysis completed:', result);
        
        // Display results
        displayAudienceResults(result);
        
    } catch (error) {
        console.error('❌ Audience analysis failed:', error);
        showErrorMessage('Failed to analyze audience. Please check if the backend server is running and try again.');
    } finally {
        hideLoading(elements.audienceLoading);
    }
}

/**
 * Display trend analysis results
 */
function displayTrendResults(data) {
    if (!elements.trendResults) return;
    
    const resultsHTML = `
        <div class="results-header">
            <div class="results-title">
                <h3>🎯 Trend Analysis Results</h3>
                <div class="results-meta">
                    <span class="analysis-date">Generated: ${new Date().toLocaleDateString()}</span>
                    <div class="export-options">
                        <button onclick="exportResults('trend', 'json')" class="btn-export" title="Export as JSON">
                            <i class="fas fa-download"></i> JSON
                        </button>
                        <button onclick="exportResults('trend', 'csv')" class="btn-export" title="Export as CSV">
                            <i class="fas fa-file-csv"></i> CSV
                        </button>
                    </div>
                </div>
            </div>
        </div>
        
        <div class="results-content">
            <div class="insight-section">
                <h4><i class="fas fa-lightbulb"></i> Key Insights</h4>
                <div class="insight-content">${data.analysis || 'Analysis data not available'}</div>
            </div>
            
            ${data.forecast ? `
                <div class="insight-section">
                    <h4><i class="fas fa-chart-line"></i> Forecast</h4>
                    <div class="insight-content">${data.forecast}</div>
                </div>
            ` : ''}
            
            ${data.cultural_context ? `
                <div class="insight-section">
                    <h4><i class="fas fa-globe"></i> Cultural Context</h4>
                    <div class="insight-content">${data.cultural_context}</div>
                </div>
            ` : ''}
            
            ${data.recommendations ? `
                <div class="insight-section">
                    <h4><i class="fas fa-star"></i> Recommendations</h4>
                    <div class="insight-content">${data.recommendations}</div>
                </div>
            ` : ''}
        </div>
    `;
    
    elements.trendResults.innerHTML = resultsHTML;
    showResults(elements.trendResults);
    
    // Scroll to results
    elements.trendResults.scrollIntoView({ behavior: 'smooth' });
}

/**
 * Display audience analysis results
 */
function displayAudienceResults(data) {
    if (!elements.audienceResults) return;
    
    const resultsHTML = `
        <div class="results-header">
            <div class="results-title">
                <h3>👥 Audience Analysis Results</h3>
                <div class="results-meta">
                    <span class="analysis-date">Generated: ${new Date().toLocaleDateString()}</span>
                    <div class="export-options">
                        <button onclick="exportResults('audience', 'json')" class="btn-export" title="Export as JSON">
                            <i class="fas fa-download"></i> JSON
                        </button>
                        <button onclick="exportResults('audience', 'csv')" class="btn-export" title="Export as CSV">
                            <i class="fas fa-file-csv"></i> CSV
                        </button>
                    </div>
                </div>
            </div>
        </div>
        
        <div class="results-content">
            <div class="insight-section">
                <h4><i class="fas fa-users"></i> Audience Insights</h4>
                <div class="insight-content">${data.analysis || 'Analysis data not available'}</div>
            </div>
            
            ${data.demographics ? `
                <div class="insight-section">
                    <h4><i class="fas fa-chart-pie"></i> Demographics</h4>
                    <div class="insight-content">${data.demographics}</div>
                </div>
            ` : ''}
            
            ${data.cultural_affinities ? `
                <div class="insight-section">
                    <h4><i class="fas fa-heart"></i> Cultural Affinities</h4>
                    <div class="insight-content">${data.cultural_affinities}</div>
                </div>
            ` : ''}
            
            ${data.recommendations ? `
                <div class="insight-section">
                    <h4><i class="fas fa-bullseye"></i> Targeting Recommendations</h4>
                    <div class="insight-content">${data.recommendations}</div>
                </div>
            ` : ''}
        </div>
    `;
    
    elements.audienceResults.innerHTML = resultsHTML;
    showResults(elements.audienceResults);
    
    // Scroll to results
    elements.audienceResults.scrollIntoView({ behavior: 'smooth' });
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
        
        // Auto-hide after 5 seconds
        setTimeout(() => {
            errorContainer.classList.add('d-none');
        }, 5000);
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
    console.log(`📤 Exporting ${type} results as ${format}`);
    
    const resultsElement = type === 'trend' ? elements.trendResults : elements.audienceResults;
    if (!resultsElement) return;
    
    // Extract text content from results
    const sections = resultsElement.querySelectorAll('.insight-section');
    const data = {};
    
    sections.forEach(section => {
        const title = section.querySelector('h4')?.textContent?.replace(/^[^\w]*/, '') || 'Unknown';
        const content = section.querySelector('.insight-content')?.textContent || '';
        data[title] = content;
    });
    
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
    const csv = Object.entries(data)
        .map(([key, value]) => `"${key}","${value.replace(/"/g, '""')}"`)
        .join('\n');
    const csvString = 'Section,Content\n' + csv;
    downloadFile(csvString, filename, 'text/csv');
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
    
    console.log(`✅ Downloaded: ${filename}`);
}

/**
 * TAB SWITCHING AND HELPER TOOLS
 * Merged from tabs-fix.js for simplicity
 */

/**
 * Initialize tab switching
 */
function initTabSwitching() {
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabContents = document.querySelectorAll('.tab-content');
    
    if (tabButtons.length === 0 || tabContents.length === 0) {
        console.error('❌ Tab elements not found');
        return;
    }
    
    // Initialize tab switching
    tabButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetTabId = this.getAttribute('data-tab');
            if (!targetTabId) return;
            
            console.log(`🔄 Switching to tab: ${targetTabId}`);
            
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
            
            console.log(`✅ Tab switched to: ${targetTabId}`);
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
    
    console.log('✅ Tab switching initialized!');
}

/**
 * Toggle advanced input options
 */
function toggleAdvancedInputs(type) {
    console.log(`🔧 Toggling advanced inputs for: ${type}`);
    
    const container = document.querySelector(`#${type}Form .advanced-inputs`);
    if (!container) {
        console.error(`❌ Advanced inputs container not found for: ${type}`);
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
        console.log('✅ Advanced options shown');
    } else {
        container.classList.remove('show');
        setTimeout(() => {
            container.style.display = 'none';
        }, 300);
        icon.className = 'fas fa-cog';
        button.innerHTML = '<i class="fas fa-cog"></i> Advanced Options';
        console.log('✅ Advanced options hidden');
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
        console.log(`✨ Filled random trend: ${randomTrend}`);
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
        console.log(`✨ Filled random audience: ${randomAudience}`);
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
    
    console.log('🧹 All inputs cleared');
    document.querySelector('.helper-menu')?.remove();
}

function openDeveloperDocs() {
    // Open the FastAPI docs in a new tab
    window.open('http://localhost:8000/docs', '_blank');
    console.log('📖 Opening developer documentation');
    document.querySelector('.helper-menu')?.remove();
}

/**
 * Check API status and update the indicator
 */
async function checkApiStatus() {
    console.log('🔍 Checking API status...');
    const statusElement = document.getElementById('apiStatus');
    
    if (!statusElement) {
        console.error('❌ API status element not found');
        return;
    }
    
    const indicator = statusElement.querySelector('.status-indicator');
    const text = statusElement.querySelector('span:last-child');
    
    try {
        // Update to checking state
        indicator.className = 'status-indicator status-warning';
        text.textContent = 'Checking API status...';
        
        const response = await fetch('http://localhost:8000/api/status');
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }
        
        const data = await response.json();
        
        // Update based on response
        if (data.status === 'healthy') {
            indicator.className = 'status-indicator status-healthy';
            text.textContent = `✅ APIs Ready - Qloo: ${data.services.qloo_api.status}, Gemini: ${data.services.gemini_llm.status}`;
        } else {
            indicator.className = 'status-indicator status-warning';
            text.textContent = '⚠️ Some services in demo mode';
        }
        
        console.log('✅ API status check completed:', data);
        
    } catch (error) {
        console.error('❌ API status check failed:', error);
        indicator.className = 'status-indicator status-error';
        text.textContent = '❌ Backend server not running';
    }
    
    // Close helper menu
    document.querySelector('.helper-menu')?.remove();
}
