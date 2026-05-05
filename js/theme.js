/**
 * Theme Toggle — Light/Dark mode with localStorage persistence
 * and system preference detection.
 * Loads BEFORE other scripts to prevent flash of wrong theme.
 */

(function () {
    'use strict';

    /**
     * Apply a theme immediately (no transition on initial load)
     */
    function initTheme() {
        var saved = localStorage.getItem('theme');
        var theme;

        if (saved === 'light' || saved === 'dark') {
            theme = saved;
        } else {
            // Respect system preference on first visit
            theme = window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches
                ? 'light'
                : 'dark';
        }

        document.documentElement.setAttribute('data-theme', theme);
        // Delay enabling transitions until after first paint
        requestAnimationFrame(function () {
            requestAnimationFrame(function () {
                document.documentElement.classList.add('theme-transitions');
            });
        });

        // Listen for system theme changes (only if user hasn't manually set)
        if (window.matchMedia) {
            window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function (e) {
                if (!localStorage.getItem('theme')) {
                    setTheme(e.matches ? 'dark' : 'light');
                }
            });
        }
    }

    /**
     * Set theme and persist to localStorage
     */
    function setTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
        updateToggleIcon(theme);
    }

    /**
     * Toggle between light and dark
     */
    function toggleTheme() {
        var current = document.documentElement.getAttribute('data-theme') || 'dark';
        setTheme(current === 'dark' ? 'light' : 'dark');
    }

    /**
     * Update the toggle button icon and aria-label
     */
    function updateToggleIcon(theme) {
        var btn = document.getElementById('theme-toggle');
        if (!btn) return;

        // Sun icon for dark mode (click to go light), Moon for light mode (click to go dark)
        if (theme === 'dark') {
            btn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>';
            btn.setAttribute('aria-label', 'Switch to light mode');
        } else {
            btn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/></svg>';
            btn.setAttribute('aria-label', 'Switch to dark mode');
        }
    }

    // Initialize icon when DOM is ready
    function onReady() {
        var theme = document.documentElement.getAttribute('data-theme') || 'dark';
        updateToggleIcon(theme);

        var btn = document.getElementById('theme-toggle');
        if (btn) {
            btn.addEventListener('click', toggleTheme);
        }
    }

    // Run immediately (before paint)
    initTheme();

    // Setup button when DOM is available
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', onReady);
    } else {
        onReady();
    }

    // Expose for inline usage if needed
    window.toggleTheme = toggleTheme;
})();
