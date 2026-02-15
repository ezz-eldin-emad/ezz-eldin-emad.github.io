/**
 * Contact Form — Formspree integration with client-side validation
 * Replace YOUR_FORM_ID below with your Formspree form ID.
 *
 * To get a Formspree form ID:
 * 1. Sign up free at https://formspree.io
 * 2. Create a new form
 * 3. Copy the form endpoint (e.g. https://formspree.io/f/xyzabcde)
 * 4. Paste the ID part (xyzabcde) below
 */

(function () {
    'use strict';

    // ========== CONFIGURE THIS ==========
    var FORMSPREE_ID = 'YOUR_FORM_ID'; // Replace with your Formspree form ID
    var FORMSPREE_URL = 'https://formspree.io/f/' + FORMSPREE_ID;
    // =====================================

    function initContactForm() {
        var form = document.getElementById('contact-form');
        if (!form) return;

        var nameField = document.getElementById('name');
        var emailField = document.getElementById('email');
        var subjectField = document.getElementById('subject');
        var messageField = document.getElementById('message');

        // Real-time validation on blur
        if (nameField) {
            nameField.addEventListener('blur', function () {
                var result = validateRequired(nameField.value, 'Name');
                if (!result.valid) showFieldError(nameField, result.error);
                else clearFieldError(nameField);
            });
        }

        if (emailField) {
            emailField.addEventListener('blur', function () {
                var result = validateEmail(emailField.value);
                if (!result.valid) showFieldError(emailField, result.error);
                else clearFieldError(emailField);
            });
        }

        if (subjectField) {
            subjectField.addEventListener('blur', function () {
                var result = validateRequired(subjectField.value, 'Subject');
                if (!result.valid) showFieldError(subjectField, result.error);
                else clearFieldError(subjectField);
            });
        }

        if (messageField) {
            messageField.addEventListener('blur', function () {
                var result = validateMinLength(messageField.value, 10, 'Message');
                if (!result.valid) showFieldError(messageField, result.error);
                else clearFieldError(messageField);
            });
        }

        // Form submission
        form.addEventListener('submit', function (e) {
            e.preventDefault();

            var submitBtn = document.getElementById('submit-btn');
            var submitText = document.getElementById('submit-text');
            var submitLoading = document.getElementById('submit-loading');
            var formMessage = document.getElementById('form-message');

            // Honeypot check (spam protection)
            var honeypot = form.querySelector('[name="_gotcha"]');
            if (honeypot && honeypot.value) return; // bot detected

            // Gather and normalize form data
            var formData = {
                name: normalizeWhitespace(nameField.value),
                email: emailField.value.trim(),
                subject: normalizeWhitespace(subjectField.value),
                message: normalizeWhitespace(messageField.value)
            };

            // Clear previous errors
            clearFormErrors(form);

            // Validate
            var validation = validateContactForm(formData);
            if (!validation.valid) {
                var firstError = null;
                if (validation.errors.name) {
                    showFieldError(nameField, validation.errors.name);
                    if (!firstError) firstError = validation.errors.name;
                }
                if (validation.errors.email) {
                    showFieldError(emailField, validation.errors.email);
                    if (!firstError) firstError = validation.errors.email;
                }
                if (validation.errors.subject) {
                    showFieldError(subjectField, validation.errors.subject);
                    if (!firstError) firstError = validation.errors.subject;
                }
                if (validation.errors.message) {
                    showFieldError(messageField, validation.errors.message);
                    if (!firstError) firstError = validation.errors.message;
                }
                showFormStatus(firstError, 'error');
                return;
            }

            // Check if Formspree is configured
            if (FORMSPREE_ID === 'YOUR_FORM_ID') {
                showFormStatus('Contact form is not configured yet. Please set up Formspree — see README for instructions.', 'error');
                return;
            }

            // Disable button, show loading
            submitBtn.disabled = true;
            submitText.classList.add('hidden');
            submitLoading.classList.remove('hidden');
            formMessage.classList.add('hidden');

            // Submit via Formspree
            fetch(FORMSPREE_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({
                    name: formData.name,
                    email: formData.email,
                    _subject: formData.subject,
                    message: formData.message,
                    _gotcha: '' // Formspree honeypot
                })
            })
                .then(function (response) {
                    if (response.ok) {
                        showFormStatus('Message sent successfully! I\'ll get back to you soon.', 'success');
                        form.reset();
                        clearFormErrors(form);
                    } else {
                        return response.json().then(function (data) {
                            throw new Error(data.error || 'Failed to send message');
                        });
                    }
                })
                .catch(function (err) {
                    console.error('Contact form error:', err);
                    showFormStatus('Failed to send message. Please try again or email me directly.', 'error');
                })
                .finally(function () {
                    submitBtn.disabled = false;
                    submitText.classList.remove('hidden');
                    submitLoading.classList.add('hidden');
                });
        });
    }

    /**
     * Display success or error message below the form
     */
    function showFormStatus(message, type) {
        var el = document.getElementById('form-message');
        if (!el) return;
        el.textContent = message;
        el.className = 'form-message form-message--' + type;
        el.classList.remove('hidden');
        el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initContactForm);
    } else {
        initContactForm();
    }

})();
