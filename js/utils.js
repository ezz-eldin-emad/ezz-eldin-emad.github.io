/**
 * Utility Functions — Validation, Sanitization, DOM Helpers
 * Shared between main.js and contact.js
 */

/* ============================================
   Email Validation
   ============================================ */

/**
 * Check if an email address has valid format
 * @param {string} email
 * @returns {boolean}
 */
function isValidEmail(email) {
    if (!email || typeof email !== 'string') return false;
    // RFC 5322 simplified — covers 99.9% of real email addresses
    var emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
    return emailRegex.test(email.trim());
}

/**
 * Validate email with detailed error
 * @param {string} email
 * @returns {{ valid: boolean, error: string|null }}
 */
function validateEmail(email) {
    if (!email || email.trim() === '') {
        return { valid: false, error: 'Email is required' };
    }
    if (!isValidEmail(email)) {
        return { valid: false, error: 'Please enter a valid email address' };
    }
    return { valid: true, error: null };
}

/* ============================================
   Input Sanitization
   ============================================ */

/**
 * Collapse multiple whitespace characters into single spaces and trim
 * @param {string} input
 * @returns {string}
 */
function normalizeWhitespace(input) {
    if (!input || typeof input !== 'string') return '';
    return input.trim().replace(/\s+/g, ' ');
}

/* ============================================
   Field Validation Helpers
   ============================================ */

/**
 * Check that a field is not empty
 * @param {string} value
 * @param {string} fieldName — human-readable name for error messages
 * @returns {{ valid: boolean, error: string|null }}
 */
function validateRequired(value, fieldName) {
    if (!value || (typeof value === 'string' && value.trim() === '')) {
        return { valid: false, error: fieldName + ' is required' };
    }
    return { valid: true, error: null };
}

/**
 * Check minimum length
 * @param {string} value
 * @param {number} min
 * @param {string} fieldName
 * @returns {{ valid: boolean, error: string|null }}
 */
function validateMinLength(value, min, fieldName) {
    if (!value || typeof value !== 'string') {
        return { valid: false, error: fieldName + ' is required' };
    }
    if (value.trim().length < min) {
        return { valid: false, error: fieldName + ' must be at least ' + min + ' characters' };
    }
    return { valid: true, error: null };
}

/**
 * Check maximum length
 * @param {string} value
 * @param {number} max
 * @param {string} fieldName
 * @returns {{ valid: boolean, error: string|null }}
 */
function validateMaxLength(value, max, fieldName) {
    if (value && typeof value === 'string' && value.length > max) {
        return { valid: false, error: fieldName + ' must be less than ' + max + ' characters' };
    }
    return { valid: true, error: null };
}

/**
 * Validate the entire contact form at once
 * @param {{ name: string, email: string, subject: string, message: string }} formData
 * @returns {{ valid: boolean, errors: Object }}
 */
function validateContactForm(formData) {
    var errors = {};

    var nameReq = validateRequired(formData.name, 'Name');
    if (!nameReq.valid) errors.name = nameReq.error;
    var nameMax = validateMaxLength(formData.name, 100, 'Name');
    if (!nameMax.valid) errors.name = nameMax.error;

    var emailRes = validateEmail(formData.email);
    if (!emailRes.valid) errors.email = emailRes.error;

    var subReq = validateRequired(formData.subject, 'Subject');
    if (!subReq.valid) errors.subject = subReq.error;
    var subMax = validateMaxLength(formData.subject, 200, 'Subject');
    if (!subMax.valid) errors.subject = subMax.error;

    var msgMin = validateMinLength(formData.message, 10, 'Message');
    if (!msgMin.valid) errors.message = msgMin.error;
    var msgMax = validateMaxLength(formData.message, 5000, 'Message');
    if (!msgMax.valid) errors.message = msgMax.error;

    return {
        valid: Object.keys(errors).length === 0,
        errors: errors
    };
}

/* ============================================
   Date Formatting
   ============================================ */

/**
 * Format a date string like "2023-06" → "Jun 2023", or "2023" → "2023"
 * @param {string} dateString — YYYY-MM or YYYY format
 * @returns {string}
 */
function formatDateString(dateString) {
    if (!dateString) return '';
    var monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
        'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    // YYYY-MM
    if (/^\d{4}-\d{2}$/.test(dateString)) {
        var parts = dateString.split('-');
        return monthNames[parseInt(parts[1], 10) - 1] + ' ' + parts[0];
    }
    return dateString;
}

/* ============================================
   DOM Helpers
   ============================================ */

/**
 * Show a validation error below a form field
 * @param {HTMLElement} field
 * @param {string} message
 */
function showFieldError(field, message) {
    if (!field) return;
    field.classList.add('error');
    var errorEl = field.parentElement.querySelector('.field-error');
    if (!errorEl) {
        errorEl = document.createElement('span');
        errorEl.className = 'field-error';
        errorEl.setAttribute('role', 'alert');
        field.parentElement.appendChild(errorEl);
    }
    errorEl.textContent = message;
}

/**
 * Clear the validation error on a form field
 * @param {HTMLElement} field
 */
function clearFieldError(field) {
    if (!field) return;
    field.classList.remove('error');
    var errorEl = field.parentElement.querySelector('.field-error');
    if (errorEl) errorEl.remove();
}

/**
 * Clear all field errors in a form
 * @param {HTMLFormElement} form
 */
function clearFormErrors(form) {
    if (!form) return;
    var fields = form.querySelectorAll('input, textarea');
    for (var i = 0; i < fields.length; i++) {
        clearFieldError(fields[i]);
    }
}

/**
 * Debounce — limit how often a function fires
 * @param {Function} func
 * @param {number} wait — milliseconds
 * @returns {Function}
 */
function debounce(func, wait) {
    var timeout;
    return function () {
        var context = this;
        var args = arguments;
        clearTimeout(timeout);
        timeout = setTimeout(function () {
            func.apply(context, args);
        }, wait);
    };
}
