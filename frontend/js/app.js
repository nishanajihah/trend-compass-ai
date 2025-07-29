/**
 * Trend Compass - Enhanced Glassmorphism UI Application
 * Modern, accessible, and highly interactive frontend
 */

// Configuration
const API_BASE_URL = 'http://localhost:8000/api';

// UI State Management
const UIState = {
    activeTab: 'trend-tab',
    isLoading: false,
    notifications: []
};

// DOM Elements Cache
const elements = {};

/**
 * Initialize the application when DOM is fully loaded
 */
document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 Trend Compass Enhanced UI initializing...');
    
    // Initialize application
    initializeElements();
    initializeEventListeners();
    initializeEnhancements();
    
    console.log('✨ Application ready with glassmorphism UI!');
});

/**
 * Initialize all DOM elements with enhanced error checking
 */
function initializeElements() {
    const elementMap = {
        // Navigation elements
        tabButtons: '.tab-button',
        tabContents: '.tab-content',
        
        // Forms
        trendForm: '#trendForm',
        audienceForm: '#audienceForm',
        
        // Input fields
        trendQuery: '#trendQuery',
        audienceDescription: '#audienceDescription',
        
        // Results containers
        trendResults: '#trendResults',
        audienceResults: '#audienceResults',
        trendResultsContent: '#trendResultsContent',
        audienceResultsContent: '#audienceResultsContent',
        
        // Loading states
        trendLoading: '#trendLoading',
        audienceLoading: '#audienceLoading',
        
        // UI enhancements
        fab: '.fab',
        messageContainer: '#messageContainer'
    };
    
    // Cache elements
    Object.entries(elementMap).forEach(([key, selector]) => {
        if (selector.startsWith('.tab-button') || selector.startsWith('.tab-content')) {
            elements[key] = document.querySelectorAll(selector);
        } else {
            elements[key] = document.querySelector(selector);
        }
        
        if (!elements[key] || (NodeList.prototype.isPrototypeOf(elements[key]) && elements[key].length === 0)) {
            console.warn(`⚠️ Element not found: ${selector}`);
        }
    });
    
    console.log('✅ DOM elements cached successfully');
}

/**
 * Initialize all event listeners
 */
function initializeEventListeners() {
    // Tab navigation
    initTabSystem();
    
    // Form handling
    initFormHandlers();
    
    // Enhanced UI interactions
    initUIEnhancements();
    
    // Keyboard shortcuts
    initKeyboardShortcuts();
    
    console.log('✅ Event listeners initialized');
}

/**
 * Initialize tab switching system with animations
 */
function initTabSystem() {
    if (!elements.tabButtons || elements.tabButtons.length === 0) {
        console.error('❌ Tab buttons not found!');
        return;
    }
    
    elements.tabButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            const targetTab = button.getAttribute('data-tab');
            switchTab(targetTab);
        });
    });
    
    console.log('✅ Tab system initialized');
}

/**
 * Switch between tabs with smooth animations
 */
function switchTab(targetTabId) {
    // Update UI state
    UIState.activeTab = targetTabId;
    
    // Update tab buttons
    elements.tabButtons.forEach(btn => {
        btn.classList.remove('active');
        if (btn.getAttribute('data-tab') === targetTabId) {
            btn.classList.add('active');
        }
    });
    
    // Update tab contents with fade animation
    elements.tabContents.forEach(content => {
        if (content.id === targetTabId) {
            content.classList.remove('d-none');
            setTimeout(() => content.classList.add('active'), 10);
        } else {
            content.classList.remove('active');
            setTimeout(() => content.classList.add('d-none'), 300);
        }
    });
    
    // Analytics/tracking (for future implementation)
    console.log(`📊 Tab switched to: ${targetTabId}`);
}

/**
 * Initialize form handlers with enhanced validation
 */
function initFormHandlers() {
    // Trend analysis form
    if (elements.trendForm) {
        elements.trendForm.addEventListener('submit', handleTrendSubmission);
    }
    
    // Audience insights form
    if (elements.audienceForm) {
        elements.audienceForm.addEventListener('submit', handleAudienceSubmission);
    }
    
    // Input enhancements
    initInputEnhancements();
    
    console.log('✅ Form handlers initialized');
}

/**
 * Enhanced input field interactions
 */
function initInputEnhancements() {
    const inputs = document.querySelectorAll('.input-field');
    
    inputs.forEach(input => {
        // Focus effects
        input.addEventListener('focus', (e) => {
            e.target.parentElement.classList.add('input-focused');
        });
        
        input.addEventListener('blur', (e) => {
            e.target.parentElement.classList.remove('input-focused');
        });
        
        // Real-time validation feedback
        input.addEventListener('input', (e) => {
            validateInput(e.target);
        });
    });
}

/**
 * Real-time input validation
 */
function validateInput(input) {
    const isValid = input.value.trim().length > 0;
    
    if (isValid) {
        input.classList.remove('input-invalid');
        input.classList.add('input-valid');
    } else {
        input.classList.remove('input-valid');
        input.classList.add('input-invalid');
    }
    
    return isValid;
}

/**
 * Handle trend analysis form submission
 */
async function handleTrendSubmission(e) {
    e.preventDefault();
    
    const query = elements.trendQuery?.value.trim();
    if (!query) {
        showNotification('Please enter a trend to analyze', 'warning');
        return;
    }
    
    try {
        setLoadingState('trend', true);
        hideResults('trend');
        
        const response = await fetch(`${API_BASE_URL}/trends/analyze`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ query })
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        displayTrendResults(data);
        showNotification('Trend analysis completed!', 'success');
        
    } catch (error) {
        console.error('❌ Trend analysis error:', error);
        showNotification('Failed to analyze trend. Please try again.', 'error');
    } finally {
        setLoadingState('trend', false);
    }
}

/**
 * Handle audience insights form submission
 */
async function handleAudienceSubmission(e) {
    e.preventDefault();
    
    const description = elements.audienceDescription?.value.trim();
    if (!description) {
        showNotification('Please describe your target audience', 'warning');
        return;
    }
    
    try {
        setLoadingState('audience', true);
        hideResults('audience');
        
        const response = await fetch(`${API_BASE_URL}/audience/analyze`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ target_audience: description })
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        displayAudienceResults(data);
        showNotification('Audience analysis completed!', 'success');
        
    } catch (error) {
        console.error('❌ Audience analysis error:', error);
        showNotification('Failed to analyze audience. Please try again.', 'error');
    } finally {
        setLoadingState('audience', false);
    }
}

/**
 * Set loading state with visual feedback
 */
function setLoadingState(type, isLoading) {
    UIState.isLoading = isLoading;
    
    const loadingElement = elements[`${type}Loading`];
    const submitButton = document.querySelector(`#${type}Form .submit-button`);
    
    if (loadingElement) {
        if (isLoading) {
            loadingElement.classList.remove('d-none');
        } else {
            loadingElement.classList.add('d-none');
        }
    }
    
    if (submitButton) {
        submitButton.disabled = isLoading;
        
        if (isLoading) {
            submitButton.classList.add('loading');
            const originalText = submitButton.innerHTML;
            submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> <span>Analyzing...</span>';
            submitButton.dataset.originalText = originalText;
        } else {
            submitButton.classList.remove('loading');
            if (submitButton.dataset.originalText) {
                submitButton.innerHTML = submitButton.dataset.originalText;
            }
        }
    }
}

/**
 * Display trend analysis results with enhanced formatting
 */
function displayTrendResults(data) {
    if (!elements.trendResultsContent) return;
    
    const formattedContent = formatAnalysisContent(data.analysis || data.result || 'No analysis available');
    elements.trendResultsContent.innerHTML = formattedContent;
    
    showResults('trend');
    scrollToResults('trend');
}

/**
 * Display audience insights results with enhanced formatting
 */
function displayAudienceResults(data) {
    if (!elements.audienceResultsContent) return;
    
    const formattedContent = formatAnalysisContent(data.insights || data.result || 'No insights available');
    elements.audienceResultsContent.innerHTML = formattedContent;
    
    showResults('audience');
    scrollToResults('audience');
}

/**
 * Format analysis content with improved typography and structure
 */
function formatAnalysisContent(content) {
    // Convert markdown-like formatting to HTML
    let formatted = content
        .replace(/## (.*$)/gim, '<h4 class="text-accent mt-lg mb-md">$1</h4>')
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.*?)\*/g, '<em>$1</em>')
        .replace(/\n\n/g, '</p><p class="mb-md">')
        .replace(/\n/g, '<br>');
    
    // Wrap in paragraph tags
    formatted = `<p class="mb-md">${formatted}</p>`;
    
    // Clean up any empty paragraphs
    formatted = formatted.replace(/<p class="mb-md"><\/p>/g, '');
    
    return formatted;
}

/**
 * Show results with smooth animation
 */
function showResults(type) {
    const resultsElement = elements[`${type}Results`];
    if (resultsElement) {
        resultsElement.classList.remove('d-none');
        setTimeout(() => {
            resultsElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
    }
}

/**
 * Hide results
 */
function hideResults(type) {
    const resultsElement = elements[`${type}Results`];
    if (resultsElement) {
        resultsElement.classList.add('d-none');
    }
}

/**
 * Smooth scroll to results
 */
function scrollToResults(type) {
    const resultsElement = elements[`${type}Results`];
    if (resultsElement) {
        setTimeout(() => {
            resultsElement.scrollIntoView({ 
                behavior: 'smooth', 
                block: 'start',
                inline: 'nearest'
            });
        }, 300);
    }
}

/**
 * Enhanced notification system
 */
function showNotification(message, type = 'info', duration = 5000) {
    const notification = createNotificationElement(message, type);
    
    if (elements.messageContainer) {
        elements.messageContainer.appendChild(notification);
        elements.messageContainer.classList.remove('d-none');
        
        // Animate in
        setTimeout(() => notification.classList.add('notification-show'), 10);
        
        // Auto remove
        setTimeout(() => {
            removeNotification(notification);
        }, duration);
    }
}

/**
 * Create notification element
 */
function createNotificationElement(message, type) {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type} glass-primary neomorphic-effect mb-sm`;
    
    const icons = {
        success: 'fas fa-check-circle',
        error: 'fas fa-exclamation-circle',
        warning: 'fas fa-exclamation-triangle',
        info: 'fas fa-info-circle'
    };
    
    notification.innerHTML = `
        <div class="d-flex items-center">
            <i class="${icons[type] || icons.info} mr-md"></i>
            <span class="flex-1">${message}</span>
            <button class="notification-close btn-sm" onclick="this.parentElement.parentElement.remove()">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `;
    
    return notification;
}

/**
 * Remove notification with animation
 */
function removeNotification(notification) {
    notification.classList.add('notification-hide');
    setTimeout(() => {
        if (notification.parentElement) {
            notification.remove();
            
            // Hide container if no notifications left
            if (elements.messageContainer && elements.messageContainer.children.length === 0) {
                elements.messageContainer.classList.add('d-none');
            }
        }
    }, 300);
}

/**
 * Initialize UI enhancements
 */
function initUIEnhancements() {
    // Floating Action Button
    if (elements.fab) {
        elements.fab.addEventListener('click', () => {
            showNotification('Feature coming soon!', 'info');
        });
    }
    
    // Intersection Observer for animations
    initScrollAnimations();
    
    // Parallax effects
    initParallaxEffects();
    
    console.log('✅ UI enhancements initialized');
}

/**
 * Initialize scroll-based animations
 */
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);
    
    // Observe cards for animation
    document.querySelectorAll('.card, .results-container').forEach(el => {
        observer.observe(el);
    });
}

/**
 * Initialize subtle parallax effects
 */
function initParallaxEffects() {
    let ticking = false;
    
    function updateParallax() {
        const scrolled = window.pageYOffset;
        const rate = scrolled * -0.5;
        
        // Apply subtle parallax to background elements
        document.body.style.backgroundPosition = `50% ${rate}px`;
        
        ticking = false;
    }
    
    function requestTick() {
        if (!ticking) {
            requestAnimationFrame(updateParallax);
            ticking = true;
        }
    }
    
    window.addEventListener('scroll', requestTick);
}

/**
 * Initialize keyboard shortcuts
 */
function initKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
        // Ctrl/Cmd + 1 = Trend Analysis tab
        if ((e.ctrlKey || e.metaKey) && e.key === '1') {
            e.preventDefault();
            switchTab('trend-tab');
        }
        
        // Ctrl/Cmd + 2 = Audience Insights tab
        if ((e.ctrlKey || e.metaKey) && e.key === '2') {
            e.preventDefault();
            switchTab('audience-tab');
        }
        
        // Escape = Focus current tab's input
        if (e.key === 'Escape') {
            if (UIState.activeTab === 'trend-tab' && elements.trendQuery) {
                elements.trendQuery.focus();
            } else if (UIState.activeTab === 'audience-tab' && elements.audienceDescription) {
                elements.audienceDescription.focus();
            }
        }
    });
    
    console.log('✅ Keyboard shortcuts initialized');
}

/**
 * Initialize additional enhancements
 */
function initializeEnhancements() {
    // Add CSS classes for enhanced animations
    const style = document.createElement('style');
    style.textContent = `
        .notification {
            transform: translateX(100%);
            transition: all 0.3s var(--ease-out-cubic);
            opacity: 0;
            padding: 1rem;
            border-radius: var(--radius-md);
            margin-bottom: 0.5rem;
            max-width: 350px;
        }
        
        .notification-show {
            transform: translateX(0);
            opacity: 1;
        }
        
        .notification-hide {
            transform: translateX(100%);
            opacity: 0;
        }
        
        .notification-success {
            background: linear-gradient(135deg, rgba(34, 197, 94, 0.1) 0%, rgba(22, 163, 74, 0.1) 100%);
            border: 1px solid rgba(34, 197, 94, 0.3);
            color: #16a34a;
        }
        
        .notification-error {
            background: linear-gradient(135deg, rgba(239, 68, 68, 0.1) 0%, rgba(220, 38, 38, 0.1) 100%);
            border: 1px solid rgba(239, 68, 68, 0.3);
            color: #dc2626;
        }
        
        .notification-warning {
            background: linear-gradient(135deg, rgba(245, 158, 11, 0.1) 0%, rgba(217, 119, 6, 0.1) 100%);
            border: 1px solid rgba(245, 158, 11, 0.3);
            color: #d97706;
        }
        
        .notification-info {
            background: linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(37, 99, 235, 0.1) 100%);
            border: 1px solid rgba(59, 130, 246, 0.3);
            color: #2563eb;
        }
        
        .notification-close {
            background: none;
            border: none;
            color: inherit;
            cursor: pointer;
            padding: 0.25rem;
            border-radius: var(--radius-sm);
            opacity: 0.7;
            transition: opacity 0.3s ease;
        }
        
        .notification-close:hover {
            opacity: 1;
        }
        
        .input-focused {
            transform: scale(1.02);
        }
        
        .input-valid {
            border-color: #16a34a !important;
        }
        
        .input-invalid {
            border-color: #dc2626 !important;
        }
        
        .animate-in {
            animation: slideInUp 0.6s var(--ease-out-cubic);
        }
        
        @keyframes slideInUp {
            from {
                opacity: 0;
                transform: translateY(30px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
    `;
    document.head.appendChild(style);
    
    console.log('✅ Additional enhancements applied');
}

/**
 * Initialize all event listeners
 */
function initializeEventListeners() {
    // Tab navigation
    initTabSystem();
    
    // Form handling
    initFormHandlers();
    
    // Enhanced UI interactions
    initUIEnhancements();
    
    // Keyboard shortcuts
    initKeyboardShortcuts();
    
    console.log('✅ Event listeners initialized');
}

/**
 * Initialize tab switching system with animations
 */
function initTabSystem() {
    if (!elements.tabButtons || elements.tabButtons.length === 0) {
        console.error('❌ Tab buttons not found!');
        return;
    }
    
    elements.tabButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            const targetTab = button.getAttribute('data-tab');
            switchTab(targetTab);
        });
    });
    
    console.log('✅ Tab system initialized');
}

/**
 * Switch between tabs with smooth animations
 */
function switchTab(targetTabId) {
    // Update UI state
    UIState.activeTab = targetTabId;
    
    // Update tab buttons
    elements.tabButtons.forEach(btn => {
        btn.classList.remove('active');
        if (btn.getAttribute('data-tab') === targetTabId) {
            btn.classList.add('active');
        }
    });
    
    // Update tab contents with fade animation
    elements.tabContents.forEach(content => {
        if (content.id === targetTabId) {
            content.classList.remove('d-none');
            setTimeout(() => content.classList.add('active'), 10);
        } else {
            content.classList.remove('active');
            setTimeout(() => content.classList.add('d-none'), 300);
        }
    });
    
    // Analytics/tracking (for future implementation)
    console.log(`📊 Tab switched to: ${targetTabId}`);
}

/**
 * Initialize form handlers with enhanced validation
 */
function initFormHandlers() {
    // Trend analysis form
    if (elements.trendForm) {
        elements.trendForm.addEventListener('submit', handleTrendSubmission);
    }
    
    // Audience insights form
    if (elements.audienceForm) {
        elements.audienceForm.addEventListener('submit', handleAudienceSubmission);
    }
    
    // Input enhancements
    initInputEnhancements();
    
    console.log('✅ Form handlers initialized');
}

/**
 * Enhanced input field interactions
 */
function initInputEnhancements() {
    const inputs = document.querySelectorAll('.input-field');
    
    inputs.forEach(input => {
        // Focus effects
        input.addEventListener('focus', (e) => {
            e.target.parentElement.classList.add('input-focused');
        });
        
        input.addEventListener('blur', (e) => {
            e.target.parentElement.classList.remove('input-focused');
        });
        
        // Real-time validation feedback
        input.addEventListener('input', (e) => {
            validateInput(e.target);
        });
    });
}

/**
 * Real-time input validation
 */
function validateInput(input) {
    const isValid = input.value.trim().length > 0;
    
    if (isValid) {
        input.classList.remove('input-invalid');
        input.classList.add('input-valid');
    } else {
        input.classList.remove('input-valid');
        input.classList.add('input-invalid');
    }
    
    return isValid;
}

/**
 * Handle trend analysis form submission
 */
async function handleTrendSubmission(e) {
    e.preventDefault();
    
    const query = elements.trendQuery?.value.trim();
    if (!query) {
        showNotification('Please enter a trend to analyze', 'warning');
        return;
    }
    
    try {
        setLoadingState('trend', true);
        hideResults('trend');
        
        const response = await fetch(`${API_BASE_URL}/trends/analyze`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ query })
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        displayTrendResults(data);
        showNotification('Trend analysis completed!', 'success');
        
    } catch (error) {
        console.error('❌ Trend analysis error:', error);
        showNotification('Failed to analyze trend. Please try again.', 'error');
    } finally {
        setLoadingState('trend', false);
    }
}

/**
 * Handle audience insights form submission
 */
async function handleAudienceSubmission(e) {
    e.preventDefault();
    
    const description = elements.audienceDescription?.value.trim();
    if (!description) {
        showNotification('Please describe your target audience', 'warning');
        return;
    }
    
    try {
        setLoadingState('audience', true);
        hideResults('audience');
        
        const response = await fetch(`${API_BASE_URL}/audience/analyze`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ target_audience: description })
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        displayAudienceResults(data);
        showNotification('Audience analysis completed!', 'success');
        
    } catch (error) {
        console.error('❌ Audience analysis error:', error);
        showNotification('Failed to analyze audience. Please try again.', 'error');
    } finally {
        setLoadingState('audience', false);
    }
}

/**
 * Set loading state with visual feedback
 */
function setLoadingState(type, isLoading) {
    UIState.isLoading = isLoading;
    
    const loadingElement = elements[`${type}Loading`];
    const submitButton = document.querySelector(`#${type}Form .submit-button`);
    
    if (loadingElement) {
        if (isLoading) {
            loadingElement.classList.remove('d-none');
        } else {
            loadingElement.classList.add('d-none');
        }
    }
    
    if (submitButton) {
        submitButton.disabled = isLoading;
        
        if (isLoading) {
            submitButton.classList.add('loading');
            const originalText = submitButton.innerHTML;
            submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> <span>Analyzing...</span>';
            submitButton.dataset.originalText = originalText;
        } else {
            submitButton.classList.remove('loading');
            if (submitButton.dataset.originalText) {
                submitButton.innerHTML = submitButton.dataset.originalText;
            }
        }
    }
}

/**
 * Display trend analysis results with enhanced formatting
 */
function displayTrendResults(data) {
    if (!elements.trendResultsContent) return;
    
    const formattedContent = formatAnalysisContent(data.analysis || data.result || 'No analysis available');
    elements.trendResultsContent.innerHTML = formattedContent;
    
    showResults('trend');
    scrollToResults('trend');
}

/**
 * Display audience insights results with enhanced formatting
 */
function displayAudienceResults(data) {
    if (!elements.audienceResultsContent) return;
    
    const formattedContent = formatAnalysisContent(data.insights || data.result || 'No insights available');
    elements.audienceResultsContent.innerHTML = formattedContent;
    
    showResults('audience');
    scrollToResults('audience');
}

/**
 * Format analysis content with improved typography and structure
 */
function formatAnalysisContent(content) {
    // Convert markdown-like formatting to HTML
    let formatted = content
        .replace(/## (.*$)/gim, '<h4 class="text-accent mt-lg mb-md">$1</h4>')
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.*?)\*/g, '<em>$1</em>')
        .replace(/\n\n/g, '</p><p class="mb-md">')
        .replace(/\n/g, '<br>');
    
    // Wrap in paragraph tags
    formatted = `<p class="mb-md">${formatted}</p>`;
    
    // Clean up any empty paragraphs
    formatted = formatted.replace(/<p class="mb-md"><\/p>/g, '');
    
    return formatted;
}

/**
 * Show results with smooth animation
 */
function showResults(type) {
    const resultsElement = elements[`${type}Results`];
    if (resultsElement) {
        resultsElement.classList.remove('d-none');
        setTimeout(() => {
            resultsElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
    }
}

/**
 * Hide results
 */
function hideResults(type) {
    const resultsElement = elements[`${type}Results`];
    if (resultsElement) {
        resultsElement.classList.add('d-none');
    }
}

/**
 * Smooth scroll to results
 */
function scrollToResults(type) {
    const resultsElement = elements[`${type}Results`];
    if (resultsElement) {
        setTimeout(() => {
            resultsElement.scrollIntoView({ 
                behavior: 'smooth', 
                block: 'start',
                inline: 'nearest'
            });
        }, 300);
    }
}

/**
 * Enhanced notification system
 */
function showNotification(message, type = 'info', duration = 5000) {
    const notification = createNotificationElement(message, type);
    
    if (elements.messageContainer) {
        elements.messageContainer.appendChild(notification);
        elements.messageContainer.classList.remove('d-none');
        
        // Animate in
        setTimeout(() => notification.classList.add('notification-show'), 10);
        
        // Auto remove
        setTimeout(() => {
            removeNotification(notification);
        }, duration);
    }
}

/**
 * Create notification element
 */
function createNotificationElement(message, type) {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type} glass-primary neomorphic-effect mb-sm`;
    
    const icons = {
        success: 'fas fa-check-circle',
        error: 'fas fa-exclamation-circle',
        warning: 'fas fa-exclamation-triangle',
        info: 'fas fa-info-circle'
    };
    
    notification.innerHTML = `
        <div class="d-flex items-center">
            <i class="${icons[type] || icons.info} mr-md"></i>
            <span class="flex-1">${message}</span>
            <button class="notification-close btn-sm" onclick="this.parentElement.parentElement.remove()">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `;
    
    return notification;
}

/**
 * Remove notification with animation
 */
function removeNotification(notification) {
    notification.classList.add('notification-hide');
    setTimeout(() => {
        if (notification.parentElement) {
            notification.remove();
            
            // Hide container if no notifications left
            if (elements.messageContainer && elements.messageContainer.children.length === 0) {
                elements.messageContainer.classList.add('d-none');
            }
        }
    }, 300);
}

/**
 * Initialize UI enhancements
 */
function initUIEnhancements() {
    // Floating Action Button
    if (elements.fab) {
        elements.fab.addEventListener('click', () => {
            showNotification('Feature coming soon!', 'info');
        });
    }
    
    // Intersection Observer for animations
    initScrollAnimations();
    
    // Parallax effects
    initParallaxEffects();
    
    console.log('✅ UI enhancements initialized');
}

/**
 * Initialize scroll-based animations
 */
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);
    
    // Observe cards for animation
    document.querySelectorAll('.card, .results-container').forEach(el => {
        observer.observe(el);
    });
}

/**
 * Initialize subtle parallax effects
 */
function initParallaxEffects() {
    let ticking = false;
    
    function updateParallax() {
        const scrolled = window.pageYOffset;
        const rate = scrolled * -0.5;
        
        // Apply subtle parallax to background elements
        document.body.style.backgroundPosition = `50% ${rate}px`;
        
        ticking = false;
    }
    
    function requestTick() {
        if (!ticking) {
            requestAnimationFrame(updateParallax);
            ticking = true;
        }
    }
    
    window.addEventListener('scroll', requestTick);
}

/**
 * Initialize keyboard shortcuts
 */
function initKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
        // Ctrl/Cmd + 1 = Trend Analysis tab
        if ((e.ctrlKey || e.metaKey) && e.key === '1') {
            e.preventDefault();
            switchTab('trend-tab');
        }
        
        // Ctrl/Cmd + 2 = Audience Insights tab
        if ((e.ctrlKey || e.metaKey) && e.key === '2') {
            e.preventDefault();
            switchTab('audience-tab');
        }
        
        // Escape = Clear forms
        if (e.key === 'Escape') {
            if (UIState.activeTab === 'trend-tab' && elements.trendQuery) {
                elements.trendQuery.focus();
            } else if (UIState.activeTab === 'audience-tab' && elements.audienceDescription) {
                elements.audienceDescription.focus();
            }
        }
    });
    
    console.log('✅ Keyboard shortcuts initialized');
}

/**
 * Initialize additional enhancements
 */
function initializeEnhancements() {
    // Add CSS classes for enhanced animations
    const style = document.createElement('style');
    style.textContent = `
        .notification {
            transform: translateX(100%);
            transition: all 0.3s var(--ease-out-cubic);
            opacity: 0;
        }
        
        .notification-show {
            transform: translateX(0);
            opacity: 1;
        }
        
        .notification-hide {
            transform: translateX(100%);
            opacity: 0;
        }
        
        .input-focused {
            transform: scale(1.02);
        }
        
        .input-valid {
            border-color: var(--success-gradient) !important;
        }
        
        .input-invalid {
            border-color: var(--warning-gradient) !important;
        }
        
        .animate-in {
            animation: slideInUp 0.6s var(--ease-out-cubic);
        }
        
        @keyframes slideInUp {
            from {
                opacity: 0;
                transform: translateY(30px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
    `;
    document.head.appendChild(style);
    
    console.log('✅ Additional enhancements applied');
}
    
    tabButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            
            const tabId = button.getAttribute('data-tab');
            if (!tabId) return;
            
            console.log(`🔄 Switching to tab: ${tabId}`);
            
            // Remove active classes
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));
            
            // Add active class to clicked button
            button.classList.add('active');
            
            // Show target content
            const targetContent = document.getElementById(tabId);
            if (targetContent) {
                targetContent.classList.add('active');
            }
        });
    });
    
    console.log('✅ Tab navigation initialized');
}

/**
 * Initialize form submissions
 */
function initForms() {
    if (trendForm) {
        trendForm.addEventListener('submit', handleTrendFormSubmit);
        console.log('✅ Trend form initialized');
    }
    
    if (audienceForm) {
        audienceForm.addEventListener('submit', handleAudienceFormSubmit);
        console.log('✅ Audience form initialized');
    }
}

/**
 * Handle trend analysis form submission
 */
async function handleTrendFormSubmit(e) {
    e.preventDefault();
    
    console.log('📊 Processing trend analysis...');
    
    const formData = new FormData(trendForm);
    const data = {
        category: formData.get('category'),
        timeframe: formData.get('timeframe'),
        region: formData.get('region') || 'Global'
    };
    
    // Validate required fields
    if (!data.category) {
        showError('Please enter a trend or category to analyze.');
        return;
    }
    
    try {
        showLoading(true);
        clearResults(trendResults);
        
        const response = await fetch(`${API_BASE_URL}/trends/analyze`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const result = await response.json();
        console.log('✅ Trend analysis complete:', result);
        
        displayTrendResults(result);
        
    } catch (error) {
        console.error('❌ Trend analysis failed:', error);
        showError(`Analysis failed: ${error.message}`);
    } finally {
        showLoading(false);
    }
}

/**
 * Handle audience insights form submission
 */
async function handleAudienceFormSubmit(e) {
    e.preventDefault();
    
    console.log('👥 Processing audience insights...');
    
    const audienceFormData = new FormData(audienceForm);
    const audienceData = {
        persona: audienceFormData.get('persona'),
        interests: audienceFormData.get('interests') || '',
        demographics: audienceFormData.get('demographics') || ''
    };
    
    // Validate required fields
    if (!audienceData.persona) {
        showError('Please describe your target audience persona.');
        return;
    }
    
    try {
        showLoading(true);
        clearResults(audienceResults);
        
        const response = await fetch(`${API_BASE_URL}/audience/analyze`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(audienceData)
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const result = await response.json();
        console.log('✅ Audience analysis complete:', result);
        
        displayAudienceResults(result);
        
    } catch (error) {
        console.error('❌ Audience analysis failed:', error);
        showError(`Analysis failed: ${error.message}`);
    } finally {
        showLoading(false);
    }
}

/**
 * Display trend analysis results
 */
function displayTrendResults(data) {
    if (!trendResults) return;
    
    trendResults.classList.remove('hidden');
    trendResults.classList.add('has-results');
    
    const html = `
        <div class="result-card">
            <div class="result-header">
                <h3><i class="fas fa-chart-line"></i> Trend Analysis Results</h3>
                <span class="timestamp">${new Date().toLocaleString()}</span>
            </div>
            
            <div class="summary">
                ${data.summary || 'Comprehensive trend analysis completed with actionable insights.'}
            </div>
            
            <div class="insights-grid">
                ${data.insights ? data.insights.map(insight => `
                    <div class="insight-item">
                        <div class="insight-header">
                            <h4 class="insight-title">${insight.title || 'Trend Insight'}</h4>
                            <span class="confidence-badge">${insight.confidence || 'High'}</span>
                        </div>
                        <p class="insight-description">${insight.description || insight}</p>
                        <span class="source-tag">AI Analysis</span>
                    </div>
                `).join('') : '<div class="insight-item"><p>No specific insights available</p></div>'}
            </div>
            
            ${data.recommendations ? `
                <div class="recommendations">
                    <h4><i class="fas fa-lightbulb"></i> Recommendations</h4>
                    <ul>
                        ${data.recommendations.map(rec => `<li>${rec}</li>`).join('')}
                    </ul>
                </div>
            ` : ''}
        </div>
    `;
    
    trendResults.innerHTML = html;
    trendResults.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

/**
 * Display audience insights results
 */
function displayAudienceResults(data) {
    if (!audienceResults) return;
    
    audienceResults.classList.remove('hidden');
    audienceResults.classList.add('has-results');
    
    const html = `
        <div class="result-card">
            <div class="result-header">
                <h3><i class="fas fa-users"></i> Audience Insights Results</h3>
                <span class="timestamp">${new Date().toLocaleString()}</span>
            </div>
            
            <div class="summary">
                ${data.summary || 'Deep cultural affinity analysis completed with demographic insights.'}
            </div>
            
            <div class="insights-grid">
                ${data.cultural_affinities ? data.cultural_affinities.map(affinity => `
                    <div class="affinity-item">
                        <div class="insight-header">
                            <h4 class="insight-title">${affinity.category || 'Cultural Affinity'}</h4>
                            <span class="confidence-badge">${affinity.score || 'High'}</span>
                        </div>
                        <p class="insight-description">${affinity.description || affinity}</p>
                        <span class="source-tag">Qloo Data</span>
                    </div>
                `).join('') : '<div class="affinity-item"><p>No cultural affinities data available</p></div>'}
                
                ${data.insights ? data.insights.map(insight => `
                    <div class="insight-item">
                        <div class="insight-header">
                            <h4 class="insight-title">${insight.title || 'Behavioral Insight'}</h4>
                            <span class="confidence-badge">AI Generated</span>
                        </div>
                        <p class="insight-description">${insight.description || insight}</p>
                        <span class="source-tag">LLM Analysis</span>
                    </div>
                `).join('') : ''}
            </div>
            
            ${data.recommendations ? `
                <div class="recommendations">
                    <h4><i class="fas fa-target"></i> Recommendations</h4>
                    <ul>
                        ${data.recommendations.map(rec => `<li>${rec}</li>`).join('')}
                    </ul>
                </div>
            ` : ''}
        </div>
    `;
    
    audienceResults.innerHTML = html;
    audienceResults.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

/**
 * Show/hide loading state
 */
function showLoading(show) {
    if (!loadingOverlay) return;
    
    if (show) {
        loadingOverlay.classList.remove('hidden');
        // Update loading text based on current tab
        const loadingText = loadingOverlay.querySelector('.loading-text');
        const loadingSubtitle = loadingOverlay.querySelector('.loading-subtitle');
        
        if (loadingText && loadingSubtitle) {
            const activeTab = document.querySelector('.tab-button.active');
            if (activeTab && activeTab.getAttribute('data-tab') === 'audience-tab') {
                loadingText.textContent = 'Analyzing Audience...';
                loadingSubtitle.textContent = 'Gathering cultural affinity data and behavioral insights';
            } else {
                loadingText.textContent = 'Analyzing Trends...';
                loadingSubtitle.textContent = 'Our AI is processing your request with cultural insights';
            }
        }
    } else {
        loadingOverlay.classList.add('hidden');
    }
}

/**
 * Clear results from a container
 */
function clearResults(container) {
    if (container) {
        container.innerHTML = '';
        container.classList.add('hidden');
        container.classList.remove('has-results');
    }
}

/**
 * Show error message
 */
function showError(message) {
    console.error('❌ Error:', message);
    
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-notification';
    errorDiv.innerHTML = `
        <div class="error-content">
            <i class="fas fa-exclamation-triangle"></i>
            <span>${message}</span>
        </div>
    `;
    
    document.body.appendChild(errorDiv);
    
    setTimeout(() => {
        if (errorDiv.parentNode) {
            errorDiv.parentNode.removeChild(errorDiv);
        }
    }, 5000);
}

console.log('📱 Trend Compass JavaScript loaded successfully!');

// Helper Functions for User Experience

/**
 * Fill trend input with suggestion
 */
function fillTrend(trend) {
    const input = document.getElementById('trend-category');
    if (input) {
        input.value = trend;
        input.focus();
        console.log(`✨ Filled trend: ${trend}`);
    }
}

/**
 * Fill persona input with suggestion
 */
function fillPersona(persona) {
    const input = document.getElementById('audience-persona');
    if (input) {
        input.value = persona;
        input.focus();
        console.log(`✨ Filled persona: ${persona}`);
    }
}

/**
 * Get random trend suggestion
 */
function getRandomTrend() {
    const trends = [
        'Sustainable Fashion',
        'AI Technology',
        'Remote Work Culture',
        'Electric Vehicles',
        'Mental Health Awareness',
        'Plant-Based Diet',
        'Cryptocurrency',
        'Social Media Trends',
        'Virtual Reality',
        'Smart Home Technology',
        'Minimalist Lifestyle',
        'Digital Nomad Culture',
        'Renewable Energy',
        'Personalized Medicine',
        'Space Tourism'
    ];
    
    const randomTrend = trends[Math.floor(Math.random() * trends.length)];
    fillTrend(randomTrend);
    
    // Add visual feedback
    const button = document.querySelector('.random-btn');
    if (button) {
        button.style.transform = 'scale(0.95)';
        setTimeout(() => {
            button.style.transform = '';
        }, 150);
    }
}

/**
 * Get random persona suggestion
 */
function getRandomPersona() {
    const personas = [
        'Gen Z music lovers who are tech-savvy and environmentally conscious',
        'Tech-savvy millennials interested in productivity and wellness',
        'Eco-conscious parents focused on sustainable living',
        'Fashion-forward young professionals in urban areas',
        'Health-conscious fitness enthusiasts aged 25-35',
        'Gaming enthusiasts and esports fans',
        'Creative professionals in design and media',
        'Outdoor adventure seekers and nature lovers',
        'Food enthusiasts interested in culinary experiences',
        'Digital entrepreneurs and startup founders',
        'Art collectors and cultural enthusiasts',
        'Pet owners who prioritize animal wellness',
        'Travel enthusiasts seeking authentic experiences',
        'Home improvement and DIY enthusiasts',
        'Wellness-focused individuals practicing mindfulness'
    ];
    
    const randomPersona = personas[Math.floor(Math.random() * personas.length)];
    fillPersona(randomPersona);
    
    // Add visual feedback
    const button = document.querySelector('.random-btn');
    if (button) {
        button.style.transform = 'scale(0.95)';
        setTimeout(() => {
            button.style.transform = '';
        }, 150);
    }
}
