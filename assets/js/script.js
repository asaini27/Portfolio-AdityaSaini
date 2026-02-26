(function () {
    'use strict';

    // Theme: init from localStorage or system preference
    var STORAGE_KEY = 'portfolio-theme';
    var root = document.documentElement;
    function getStoredTheme() { return localStorage.getItem(STORAGE_KEY); }
    function setStoredTheme(theme) { if (theme) localStorage.setItem(STORAGE_KEY, theme); else localStorage.removeItem(STORAGE_KEY); }
    function applyTheme(theme, persist) {
        if (theme !== 'light' && theme !== 'dark') return;
        root.setAttribute('data-theme', theme);
        if (persist) setStoredTheme(theme);
        var btn = document.querySelector('.theme-toggle');
        if (btn) {
            btn.setAttribute('aria-label', theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme');
            btn.setAttribute('title', theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme');
        }
    }
    function initTheme() {
        var stored = getStoredTheme();
        if (stored === 'light' || stored === 'dark') {
            applyTheme(stored, false);
            return;
        }
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches)
            applyTheme('light', false);
        else
            applyTheme('dark', false);
    }
    initTheme();
    if (window.matchMedia) window.matchMedia('(prefers-color-scheme: light)').addEventListener('change', function () { if (!getStoredTheme()) initTheme(); });

    // Theme toggle button
    var themeToggle = document.querySelector('.theme-toggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', function () {
            var current = root.getAttribute('data-theme');
            applyTheme(current === 'light' ? 'dark' : 'light', true);
        });
    }

    // Footer year
    var yearEl = document.getElementById('year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();

    // Mobile nav toggle
    var navToggle = document.querySelector('.nav-toggle');
    var mainNav = document.querySelector('.main-nav');
    if (navToggle && mainNav) {
        navToggle.addEventListener('click', function () {
            var expanded = navToggle.getAttribute('aria-expanded') === 'true';
            navToggle.setAttribute('aria-expanded', !expanded);
            mainNav.classList.toggle('is-open', !expanded);
        });

        // Close nav when a link is clicked (for in-page anchors)
        mainNav.querySelectorAll('a[href^="#"]').forEach(function (link) {
            link.addEventListener('click', function () {
                navToggle.setAttribute('aria-expanded', 'false');
                mainNav.classList.remove('is-open');
            });
        });
    }

    // Smooth scroll for anchor links (backup for older browsers)
    document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
        anchor.addEventListener('click', function (e) {
            var targetId = this.getAttribute('href');
            if (targetId === '#') return;
            var target = document.querySelector(targetId);
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });
})();
