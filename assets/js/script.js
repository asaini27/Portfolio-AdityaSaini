(function () {
    'use strict';
    var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

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

    // Dynamic hero role typing
    var dynamicRole = document.getElementById('dynamic-role');
    if (dynamicRole) {
        var roles = [
            'Software Engineer',
            'AI Agent Engineer',
            'Forward-Deployed Engineer',
            'Full-Stack Developer',
            'Research-Driven Problem Solver'
        ];
        var roleIndex = 0;
        var charIndex = 0;
        var deleting = false;
        var pause = 900;

        function tickRole() {
            var word = roles[roleIndex];
            dynamicRole.textContent = deleting ? word.slice(0, charIndex--) : word.slice(0, charIndex++);

            var doneTyping = !deleting && charIndex === word.length + 1;
            var doneDeleting = deleting && charIndex < 0;

            if (doneTyping) {
                deleting = true;
                setTimeout(tickRole, pause);
                return;
            }
            if (doneDeleting) {
                deleting = false;
                roleIndex = (roleIndex + 1) % roles.length;
                charIndex = 0;
            }
            setTimeout(tickRole, deleting ? 40 : 65);
        }

        if (reduceMotion) dynamicRole.textContent = roles[0];
        else tickRole();
    }

    // Dynamic skills showcase in About section
    var skillsByGroup = [
        ['Python', 'C++', 'Java', 'TypeScript', 'Go', 'JavaScript', 'HTML', 'CSS', 'Solidity'],
        ['LangGraph', 'LangChain', 'MCP', 'vLLM', 'RAG', 'LLM Evaluation'],
        ['React', 'Next.js', 'Node.js', 'FastAPI', 'Django', 'Express', 'Angular', '.NET', 'RESTful API'],
        ['AWS', 'Azure', 'Docker', 'GitHub Actions', 'Git', 'Jira', 'Railway'],
        ['Pandas', 'PyTorch', 'TensorFlow', 'HuggingFace', 'scikit-learn'],
        ['PostgreSQL', 'MongoDB', 'MySQL', 'DuckDB', 'Milvus', 'Azure AI Search', 'SQL']
    ];
    var allSkills = skillsByGroup.flat();
    var trackA = document.getElementById('skills-track-a');
    var trackB = document.getElementById('skills-track-b');

    function createSkillPill(label, className) {
        var chip = document.createElement('span');
        chip.className = className;
        chip.textContent = label;
        return chip;
    }

    if (trackA && trackB) {
        var streamA = allSkills.concat(allSkills);
        var streamB = allSkills.slice().reverse().concat(allSkills.slice().reverse());
        streamA.forEach(function (skill) { trackA.appendChild(createSkillPill(skill, 'skill-pill')); });
        streamB.forEach(function (skill) { trackB.appendChild(createSkillPill(skill, 'skill-pill')); });
    }

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

    // Scroll reveal
    var revealTargets = document.querySelectorAll('.section-title, .about-card, .timeline-item, .project-card, .card, .publications-list li, .contact-section .container');
    revealTargets.forEach(function (el) { el.classList.add('reveal'); });
    if (reduceMotion) {
        revealTargets.forEach(function (el) { el.classList.add('is-visible'); });
    } else if (revealTargets.length) {
        var revealObserver = new IntersectionObserver(function (entries, observer) {
            entries.forEach(function (entry) {
                if (!entry.isIntersecting) return;
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            });
        }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
        revealTargets.forEach(function (el) { revealObserver.observe(el); });
    }

    // Active nav link by section in viewport
    var navLinks = document.querySelectorAll('.main-nav a[href^="#"]');
    var sectionIds = Array.prototype.map.call(navLinks, function (link) { return link.getAttribute('href'); });
    var sections = sectionIds.map(function (id) { return document.querySelector(id); }).filter(Boolean);

    function setActiveNav() {
        var midpoint = window.scrollY + window.innerHeight * 0.33;
        var activeId = '#home';
        sections.forEach(function (sec) {
            if (sec.offsetTop <= midpoint) activeId = '#' + sec.id;
        });
        navLinks.forEach(function (link) {
            link.classList.toggle('is-active', link.getAttribute('href') === activeId);
        });
    }
    setActiveNav();
    window.addEventListener('scroll', setActiveNav, { passive: true });

    // Subtle project card tilt on pointer move
    if (!reduceMotion) {
        document.querySelectorAll('.hero-links a').forEach(function (link) {
            link.addEventListener('mousemove', function (e) {
                var rect = link.getBoundingClientRect();
                var dx = (e.clientX - rect.left - rect.width / 2) / rect.width;
                var dy = (e.clientY - rect.top - rect.height / 2) / rect.height;
                link.style.transform = 'translate(' + (dx * 6).toFixed(2) + 'px,' + (dy * 6).toFixed(2) + 'px) scale(1.06)';
            });
            link.addEventListener('mouseleave', function () {
                link.style.transform = '';
            });
        });

        document.querySelectorAll('.project-card').forEach(function (card) {
            card.addEventListener('mousemove', function (e) {
                var rect = card.getBoundingClientRect();
                var x = (e.clientX - rect.left) / rect.width;
                var y = (e.clientY - rect.top) / rect.height;
                var rotateX = (0.5 - y) * 5;
                var rotateY = (x - 0.5) * 7;
                card.style.transform = 'perspective(900px) rotateX(' + rotateX.toFixed(2) + 'deg) rotateY(' + rotateY.toFixed(2) + 'deg) translateY(-2px)';
            });
            card.addEventListener('mouseleave', function () {
                card.style.transform = '';
            });
        });

        document.querySelectorAll('.extra-card').forEach(function (card) {
            card.addEventListener('mousemove', function (e) {
                var rect = card.getBoundingClientRect();
                var x = (e.clientX - rect.left) / rect.width;
                var y = (e.clientY - rect.top) / rect.height;
                var rotateX = (0.5 - y) * 4;
                var rotateY = (x - 0.5) * 5;
                card.style.transform = 'perspective(900px) rotateX(' + rotateX.toFixed(2) + 'deg) rotateY(' + rotateY.toFixed(2) + 'deg) translateY(-1px)';
            });
            card.addEventListener('mouseleave', function () {
                card.style.transform = '';
            });
        });
    }

    // Copy citation buttons
    document.querySelectorAll('.pub-copy').forEach(function (btn) {
        btn.addEventListener('click', async function () {
            var citation = btn.getAttribute('data-cite') || '';
            if (!citation) return;
            try {
                await navigator.clipboard.writeText(citation);
                var old = btn.textContent;
                btn.textContent = 'Copied';
                btn.classList.add('is-copied');
                setTimeout(function () {
                    btn.textContent = old;
                    btn.classList.remove('is-copied');
                }, 1300);
            } catch (e) {
                btn.textContent = 'Copy failed';
                setTimeout(function () { btn.textContent = 'Copy citation'; }, 1200);
            }
        });
    });

    // Publication filters
    var pubFilters = document.querySelectorAll('.pub-filter');
    var pubItems = document.querySelectorAll('.pub-item');
    function filterPublications(type) {
        pubItems.forEach(function (item) {
            var itemType = item.getAttribute('data-type');
            var show = type === 'all' || type === itemType;
            item.classList.toggle('is-hidden', !show);
        });
    }
    if (pubFilters.length && pubItems.length) {
        pubFilters.forEach(function (btn) {
            btn.addEventListener('click', function () {
                var type = btn.getAttribute('data-filter') || 'all';
                pubFilters.forEach(function (b) {
                    var active = b === btn;
                    b.classList.toggle('is-active', active);
                    b.setAttribute('aria-selected', active ? 'true' : 'false');
                });
                filterPublications(type);
            });
        });
    }
})();
