/**
 * Main Application — Loads data, renders sections, handles navigation
 * and scroll animations. Uses IntersectionObserver with scroll fallback.
 */

(function () {
    'use strict';

    /* ============================================
       SVG Icon Paths (reused across sections)
       ============================================ */
    var ICONS = {
        github: 'M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z',
        linkedin: 'M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z',
        email: 'M12 12.713l-11.985-9.713h23.97l-11.985 9.713zm0 2.574l-12-9.725v15.438h24v-15.438l-12 9.725z',
        location: 'M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z M15 11a3 3 0 11-6 0 3 3 0 016 0z',
        calendar: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z',
        badge: 'M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z',
        external: 'M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14',
        code: 'M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4',
        clock: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z'
    };

    /**
     * Create an inline SVG element from a path string
     * @param {string} pathData — SVG path d="" value
     * @param {string} [className] — optional CSS class
     * @returns {SVGElement}
     */
    function svgIcon(pathData, className) {
        var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('viewBox', '0 0 24 24');
        svg.setAttribute('fill', 'none');
        svg.setAttribute('stroke', 'currentColor');
        svg.setAttribute('stroke-width', '2');
        svg.setAttribute('stroke-linecap', 'round');
        svg.setAttribute('stroke-linejoin', 'round');
        svg.setAttribute('aria-hidden', 'true');
        if (className) svg.setAttribute('class', className);
        // Support multiple path segments (separated by ' M')
        var paths = pathData.split(/\s+(?=M)/);
        paths.forEach(function (d) {
            var path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
            path.setAttribute('d', d.trim());
            svg.appendChild(path);
        });
        return svg;
    }

    /**
     * Create a filled SVG icon (for social links)
     */
    function svgIconFilled(pathData, className) {
        var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('viewBox', '0 0 24 24');
        svg.setAttribute('fill', 'currentColor');
        svg.setAttribute('aria-hidden', 'true');
        if (className) svg.setAttribute('class', className);
        var path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        path.setAttribute('d', pathData);
        svg.appendChild(path);
        return svg;
    }

    /* ============================================
       Initialize Application
       ============================================ */
    /* ============================================
       Initialize Application
       ============================================ */
    async function init() {
        // Set footer year
        var yearEl = document.getElementById('current-year');
        if (yearEl) yearEl.textContent = new Date().getFullYear();

        // 1. Load config and render structure (Dynamic Ordering)
        await initSections();

        // 2. Setup navigation (after elements exist)
        initMobileMenu();
        initSmoothScroll();
        initNavHighlight();
        initNavbarScroll();

        // 3. Load and render portfolio data (into new structure)
        loadPortfolioData();
    }

    /* ============================================
       Dynamic Section Rendering
       ============================================ */
    async function initSections() {
        try {
            // Fetch user configuration
            var response = await fetch('data/sections-config.json');
            if (!response.ok) throw new Error('Config load failed');
            var config = await response.json();

            // Filter enabled and sort by order
            var sections = config.sections
                .filter(function (s) { return s.enabled; })
                .sort(function (a, b) { return a.order - b.order; });

            // Render templates
            var dynamicContainer = document.getElementById('dynamic-sections');
            if (dynamicContainer) {
                dynamicContainer.innerHTML = '';
                sections.forEach(function (section) {
                    var tmpl = document.getElementById(section.id + '-template');
                    if (tmpl) {
                        dynamicContainer.appendChild(tmpl.content.cloneNode(true));
                    }
                });
            }

            // Build Navigation
            buildNavigation(sections.filter(function (s) { return s.showInNav; }));

        } catch (error) {
            console.error('Error loading sections config:', error);
            // Fallback? The templates are hidden, so site will be empty if this fails.
            // But config is local, should not fail.
        }
    }

    function buildNavigation(sections) {
        var navContainer = document.getElementById('nav-links');
        var mobileContainer = document.getElementById('mobile-menu');
        if (!navContainer || !mobileContainer) return;

        sections.forEach(function (section) {
            // Desktop
            var li = document.createElement('li');
            var a = document.createElement('a');
            a.href = '#' + section.id;
            a.className = 'nav-link';
            if (section.id === 'contact') a.className += ' nav-link--accent';
            a.textContent = section.title;
            li.appendChild(a);
            navContainer.appendChild(li);

            // Mobile
            var ma = document.createElement('a');
            ma.href = '#' + section.id;
            ma.className = 'mobile-menu-link';
            ma.setAttribute('role', 'menuitem');
            ma.textContent = section.title;
            mobileContainer.appendChild(ma);
        });
    }

    /* ============================================
       Load Portfolio Data via fetch()
       ============================================ */
    function loadPortfolioData() {
        fetch('data/portfolio.json')
            .then(function (response) {
                if (!response.ok) throw new Error('HTTP ' + response.status);
                return response.json();
            })
            .then(function (data) {
                renderPortfolio(data);
                // Initialize scroll animations after content is rendered
                setTimeout(initScrollAnimations, 100);
            })
            .catch(function (err) {
                console.error('Failed to load portfolio data:', err);
                showError('Failed to load portfolio data. Please refresh the page.');
            });
    }

    /**
     * Render all portfolio sections from JSON data
     */
    function renderPortfolio(data) {
        renderHero(data.about);
        renderAbout(data.about);
        renderSkills(data.skills);
        renderProjects(data.projects);
        renderExperience(data.experience);
        renderEducation(data.education);
        renderCertifications(data.certifications);
    }

    /* ============================================
       Hero Section
       ============================================ */
    function renderHero(about) {
        setText('hero-name', about.name);
        setText('hero-title', about.title);
        setText('hero-bio', about.bio);

        // Profile image
        var imgEl = document.getElementById('hero-profile-img');
        if (imgEl && about.profileImage) {
            imgEl.src = about.profileImage;
            imgEl.alt = about.name;
        }

        // Social links
        var socialEl = document.getElementById('hero-social');
        if (!socialEl) return;
        socialEl.innerHTML = '';

        var links = [
            { name: 'GitHub', url: about.github, icon: ICONS.github },
            { name: 'LinkedIn', url: about.linkedin, icon: ICONS.linkedin },
            { name: 'Email', url: about.email ? 'mailto:' + about.email : null, icon: ICONS.email }
        ];

        links.forEach(function (link) {
            if (!link.url) return;
            var a = document.createElement('a');
            a.href = link.url;
            if (!link.url.startsWith('mailto:')) {
                a.target = '_blank';
                a.rel = 'noopener noreferrer';
            }
            a.setAttribute('aria-label', link.name);
            a.appendChild(svgIconFilled(link.icon));
            socialEl.appendChild(a);
        });
    }

    /* ============================================
       About Section
       ============================================ */
    function renderAbout(about) {
        setText('about-bio', about.bio);

        var container = document.getElementById('about-details');
        if (!container) return;
        container.innerHTML = '';

        var details = [
            { label: 'Location', value: about.location },
            { label: 'Email', value: about.email, type: 'email' },
            { label: 'GitHub', value: about.github, type: 'link' },
            { label: 'LinkedIn', value: about.linkedin, type: 'link' }
        ];

        details.forEach(function (d) {
            if (!d.value) return;

            var item = document.createElement('div');
            item.className = 'about-detail-item';

            var label = document.createElement('span');
            label.className = 'about-detail-label';
            label.textContent = d.label;

            var value;
            if (d.type === 'link') {
                value = document.createElement('a');
                value.href = d.value;
                value.target = '_blank';
                value.rel = 'noopener noreferrer';
                value.className = 'about-detail-value';
                value.textContent = d.value;
            } else if (d.type === 'email') {
                value = document.createElement('a');
                value.href = 'mailto:' + d.value;
                value.className = 'about-detail-value';
                value.textContent = d.value;
            } else {
                value = document.createElement('span');
                value.className = 'about-detail-value';
                value.textContent = d.value;
            }

            item.appendChild(label);
            item.appendChild(value);
            container.appendChild(item);
        });
    }

    /* ============================================
       Skills Section — Modern Badge Layout
       ============================================ */
    function renderSkills(skills) {
        var container = document.getElementById('skills-container');
        if (!container) return;
        container.innerHTML = '';

        var categories = Object.keys(skills);
        categories.forEach(function (category) {
            // Skip JSON comment fields
            if (category.charAt(0) === '_') return;

            var items = skills[category];
            if (!Array.isArray(items) || items.length === 0) return;

            var section = document.createElement('div');
            section.className = 'skills-category animate-on-scroll';

            var title = document.createElement('h3');
            title.className = 'skills-category-title';
            title.textContent = category;
            section.appendChild(title);

            var badgesWrap = document.createElement('div');
            badgesWrap.className = 'skills-badges';

            items.forEach(function (skill) {
                var badge = document.createElement('span');
                badge.className = 'skill-badge';
                badge.setAttribute('aria-label', skill.name);

                // Icon (from devicons CDN or fallback)
                if (skill.icon) {
                    var icon = document.createElement('img');
                    icon.src = skill.icon;
                    icon.alt = '';
                    icon.className = 'skill-badge-icon';
                    icon.loading = 'lazy';
                    icon.onerror = function () { this.style.display = 'none'; };
                    badge.appendChild(icon);
                }

                var nameSpan = document.createElement('span');
                nameSpan.className = 'skill-badge-name';
                nameSpan.textContent = skill.name;
                badge.appendChild(nameSpan);

                badgesWrap.appendChild(badge);
            });

            section.appendChild(badgesWrap);
            container.appendChild(section);
        });
    }

    /* ============================================
       Projects Section
       ============================================ */
    function renderProjects(projects) {
        var container = document.getElementById('projects-container');
        if (!container) return;
        container.innerHTML = '';

        if (!projects || projects.length === 0) {
            container.innerHTML = '<p style="color:var(--text-muted);text-align:center">No projects available.</p>';
            container.setAttribute('data-count', 0);
            return;
        }

        // Set count attribute for CSS grid logic
        container.setAttribute('data-count', projects.length);

        projects.forEach(function (project) {
            var card = document.createElement('article');
            card.className = 'project-card animate-on-scroll';

            // Project image
            if (project.image) {
                var img = document.createElement('img');
                img.src = project.image;
                img.alt = project.title + ' screenshot';
                img.className = 'project-card-image';
                img.loading = 'lazy';
                img.onerror = function () { this.style.display = 'none'; };
                card.appendChild(img);
            }

            var body = document.createElement('div');
            body.className = 'project-card-body';

            var title = document.createElement('h3');
            title.className = 'project-card-title';
            title.textContent = project.title;
            body.appendChild(title);

            var desc = document.createElement('p');
            desc.className = 'project-card-desc';
            desc.textContent = project.description;
            body.appendChild(desc);

            // Technologies
            if (project.technologies && project.technologies.length > 0) {
                var techWrap = document.createElement('div');
                techWrap.className = 'project-tech';
                project.technologies.forEach(function (tech) {
                    var badge = document.createElement('span');
                    badge.className = 'tech-badge';
                    badge.textContent = tech;
                    techWrap.appendChild(badge);
                });
                body.appendChild(techWrap);
            }

            // Links
            var linksWrap = document.createElement('div');
            linksWrap.className = 'project-links';
            var hasLinks = false;

            if (project.github_url) {
                hasLinks = true;
                var ghLink = document.createElement('a');
                ghLink.href = project.github_url;
                ghLink.target = '_blank';
                ghLink.rel = 'noopener noreferrer';
                ghLink.className = 'project-link';
                ghLink.appendChild(svgIconFilled(ICONS.github));
                ghLink.appendChild(document.createTextNode(' Source'));
                linksWrap.appendChild(ghLink);
            }

            if (project.demo_url) {
                hasLinks = true;
                var demoLink = document.createElement('a');
                demoLink.href = project.demo_url;
                demoLink.target = '_blank';
                demoLink.rel = 'noopener noreferrer';
                demoLink.className = 'project-link project-link--demo';
                demoLink.appendChild(svgIcon(ICONS.external));
                demoLink.appendChild(document.createTextNode(' Live View'));
                linksWrap.appendChild(demoLink);
            }

            if (hasLinks) body.appendChild(linksWrap);
            card.appendChild(body);
            container.appendChild(card);
        });
    }

    /* ============================================
       Experience Section
       ============================================ */
    function renderExperience(experience) {
        var container = document.getElementById('experience-container');
        if (!container) return;
        container.innerHTML = '';

        if (!experience || experience.length === 0) {
            container.innerHTML = '<p style="color:var(--text-muted);text-align:center">No experience entries yet.</p>';
            return;
        }

        experience.forEach(function (exp) {
            var item = document.createElement('article');
            item.className = 'timeline-item animate-on-scroll';

            // Header
            var header = document.createElement('div');
            header.className = 'timeline-header';

            var title = document.createElement('h3');
            title.className = 'timeline-title';
            title.textContent = exp.title;
            header.appendChild(title);

            var subtitle = document.createElement('p');
            subtitle.className = 'timeline-subtitle';
            subtitle.textContent = exp.company;
            header.appendChild(subtitle);

            // Meta (location, date)
            var meta = document.createElement('div');
            meta.className = 'timeline-meta';

            if (exp.location) {
                var loc = document.createElement('span');
                loc.className = 'timeline-meta-item';
                loc.appendChild(svgIcon(ICONS.location));
                loc.appendChild(document.createTextNode(' ' + exp.location));
                meta.appendChild(loc);
            }

            var dateEl = document.createElement('span');
            dateEl.className = 'timeline-meta-item timeline-meta-item--date';
            dateEl.appendChild(svgIcon(ICONS.calendar));
            var start = formatDateString(exp.start_date);
            var end = exp.end_date ? formatDateString(exp.end_date) : 'Present';
            dateEl.appendChild(document.createTextNode(' ' + start + ' — ' + end));
            meta.appendChild(dateEl);

            header.appendChild(meta);
            item.appendChild(header);

            // Description bullets
            if (exp.description && exp.description.length > 0) {
                var descList = document.createElement('div');
                descList.className = 'timeline-desc-list';
                exp.description.forEach(function (text) {
                    var di = document.createElement('div');
                    di.className = 'timeline-desc-item';
                    var span = document.createElement('span');
                    span.textContent = text;
                    di.appendChild(span);
                    descList.appendChild(di);
                });
                item.appendChild(descList);
            }

            // Technologies
            if (exp.technologies && exp.technologies.length > 0) {
                var techWrap = document.createElement('div');
                techWrap.className = 'timeline-tech';
                exp.technologies.forEach(function (tech) {
                    var badge = document.createElement('span');
                    badge.className = 'tech-badge';
                    badge.textContent = tech;
                    techWrap.appendChild(badge);
                });
                item.appendChild(techWrap);
            }

            container.appendChild(item);
        });
    }

    /* ============================================
       Education Section
       ============================================ */
    function renderEducation(education) {
        var container = document.getElementById('education-container');
        if (!container) return;
        container.innerHTML = '';

        if (!education || education.length === 0) {
            container.innerHTML = '<p style="color:var(--text-muted);text-align:center">No education entries yet.</p>';
            return;
        }

        education.forEach(function (edu) {
            var item = document.createElement('article');
            item.className = 'timeline-item animate-on-scroll';

            var header = document.createElement('div');
            header.className = 'timeline-header';

            var degree = document.createElement('h3');
            degree.className = 'timeline-title';
            degree.textContent = edu.degree;
            header.appendChild(degree);

            var institution = document.createElement('p');
            institution.className = 'timeline-subtitle';
            institution.textContent = edu.institution;
            header.appendChild(institution);

            var meta = document.createElement('div');
            meta.className = 'timeline-meta';

            if (edu.location) {
                var loc = document.createElement('span');
                loc.className = 'timeline-meta-item';
                loc.appendChild(svgIcon(ICONS.location));
                loc.appendChild(document.createTextNode(' ' + edu.location));
                meta.appendChild(loc);
            }

            var dateEl = document.createElement('span');
            dateEl.className = 'timeline-meta-item timeline-meta-item--date';
            dateEl.appendChild(svgIcon(ICONS.calendar));
            var end = edu.end_date || 'Present';
            dateEl.appendChild(document.createTextNode(' ' + edu.start_date + ' — ' + end));
            meta.appendChild(dateEl);

            if (edu.gpa) {
                var gpa = document.createElement('span');
                gpa.className = 'timeline-meta-item timeline-meta-item--gpa';
                gpa.appendChild(svgIcon(ICONS.badge));
                gpa.appendChild(document.createTextNode(' GPA: ' + edu.gpa));
                meta.appendChild(gpa);
            }

            header.appendChild(meta);
            item.appendChild(header);

            if (edu.description) {
                var desc = document.createElement('p');
                desc.className = 'timeline-description';
                desc.textContent = edu.description;
                item.appendChild(desc);
            }

            container.appendChild(item);
        });
    }

    /* ============================================
       Certifications Section
       ============================================ */
    function renderCertifications(certs) {
        var container = document.getElementById('certifications-container');
        if (!container) return;
        container.innerHTML = '';

        if (!certs || certs.length === 0) {
            container.innerHTML = '<p style="color:var(--text-muted);text-align:center">No certifications yet.</p>';
            return;
        }

        certs.forEach(function (cert) {
            var card = document.createElement('article');
            card.className = 'cert-card animate-on-scroll';

            var name = document.createElement('h3');
            name.className = 'cert-name';
            name.textContent = cert.name;
            card.appendChild(name);

            var issuer = document.createElement('p');
            issuer.className = 'cert-issuer';
            issuer.textContent = cert.issuer;
            card.appendChild(issuer);

            // Meta
            var metaDiv = document.createElement('div');
            metaDiv.className = 'cert-meta';

            var dateItem = document.createElement('span');
            dateItem.className = 'cert-meta-item';
            dateItem.appendChild(svgIcon(ICONS.calendar));
            dateItem.appendChild(document.createTextNode(' Issued: ' + cert.issue_date));
            metaDiv.appendChild(dateItem);

            if (cert.expiry_date) {
                var expiry = document.createElement('span');
                expiry.className = 'cert-meta-item';
                expiry.appendChild(svgIcon(ICONS.clock));
                expiry.appendChild(document.createTextNode(' Expires: ' + cert.expiry_date));
                metaDiv.appendChild(expiry);
            }

            if (cert.credential_id) {
                var cred = document.createElement('span');
                cred.className = 'cert-meta-item';
                cred.appendChild(svgIcon(ICONS.code));
                cred.appendChild(document.createTextNode(' ID: ' + cert.credential_id));
                metaDiv.appendChild(cred);
            }

            card.appendChild(metaDiv);

            if (cert.credential_url) {
                var link = document.createElement('a');
                link.href = cert.credential_url;
                link.target = '_blank';
                link.rel = 'noopener noreferrer';
                link.className = 'cert-link';
                link.textContent = 'View Record ';
                link.appendChild(svgIcon(ICONS.external));
                card.appendChild(link);
            }

            container.appendChild(card);
        });
    }

    /* ============================================
       Navigation — Mobile Menu
       ============================================ */
    function initMobileMenu() {
        var btn = document.getElementById('mobile-menu-btn');
        var menu = document.getElementById('mobile-menu');
        if (!btn || !menu) return;

        btn.addEventListener('click', function () {
            var isOpen = menu.classList.toggle('open');
            btn.classList.toggle('open');
            btn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
            menu.setAttribute('aria-hidden', isOpen ? 'false' : 'true');
        });

        // Close on link click
        var links = menu.querySelectorAll('a');
        for (var i = 0; i < links.length; i++) {
            links[i].addEventListener('click', function () {
                menu.classList.remove('open');
                btn.classList.remove('open');
                btn.setAttribute('aria-expanded', 'false');
                menu.setAttribute('aria-hidden', 'true');
            });
        }
    }

    /* ============================================
       Navigation — Smooth Scroll
       ============================================ */
    function initSmoothScroll() {
        document.addEventListener('click', function (e) {
            var link = e.target.closest('a[href^="#"]');
            if (!link) return;

            var targetId = link.getAttribute('href');
            if (!targetId || targetId === '#') return;

            var target = document.querySelector(targetId);
            if (!target) return;

            e.preventDefault();
            var offset = 80; // nav height + padding
            var top = target.getBoundingClientRect().top + window.pageYOffset - offset;

            window.scrollTo({ top: top, behavior: 'smooth' });
            // Update URL without triggering scroll
            history.pushState(null, null, targetId);
        });
    }

    /* ============================================
       Navigation — Active Link Highlighting
       ============================================ */
    function initNavHighlight() {
        var navLinks = document.querySelectorAll('.nav-link');
        var sectionIds = ['about', 'skills', 'projects', 'experience', 'education', 'certifications', 'contact'];

        var onScroll = debounce(function () {
            var scrollPos = window.scrollY + 120;

            sectionIds.forEach(function (id) {
                var section = document.getElementById(id);
                if (!section) return;
                var top = section.offsetTop;
                var bottom = top + section.offsetHeight;

                navLinks.forEach(function (link) {
                    if (link.getAttribute('href') === '#' + id) {
                        if (scrollPos >= top && scrollPos < bottom) {
                            link.classList.add('active');
                        } else {
                            link.classList.remove('active');
                        }
                    }
                });
            });
        }, 50);

        window.addEventListener('scroll', onScroll, { passive: true });
    }

    /* ============================================
       Navigation — Navbar Background on Scroll
       ============================================ */
    function initNavbarScroll() {
        var navbar = document.getElementById('navbar');
        if (!navbar) return;

        window.addEventListener('scroll', function () {
            if (window.scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        }, { passive: true });
    }

    /* ============================================
       Scroll Animations — IntersectionObserver
       with scroll event fallback
       ============================================ */
    function initScrollAnimations() {
        var elements = document.querySelectorAll('.animate-on-scroll');
        if (elements.length === 0) return;

        // IntersectionObserver supported (all modern browsers)
        if ('IntersectionObserver' in window) {
            var observer = new IntersectionObserver(function (entries) {
                entries.forEach(function (entry) {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('visible');
                        observer.unobserve(entry.target);
                    }
                });
            }, {
                rootMargin: '0px 0px -40px 0px',
                threshold: 0.1
            });

            elements.forEach(function (el) { observer.observe(el); });
        } else {
            // Fallback: scroll event handler for older browsers
            var checkVisibility = debounce(function () {
                var windowHeight = window.innerHeight;
                elements.forEach(function (el) {
                    if (el.classList.contains('visible')) return;
                    var rect = el.getBoundingClientRect();
                    if (rect.top < windowHeight - 40) {
                        el.classList.add('visible');
                    }
                });
            }, 80);

            window.addEventListener('scroll', checkVisibility, { passive: true });
            checkVisibility(); // initial check
        }
    }


    /* ============================================
       Helpers
       ============================================ */
    function setText(id, text) {
        var el = document.getElementById(id);
        if (el && text) el.textContent = text;
    }

    function showError(message) {
        var errorDiv = document.createElement('div');
        errorDiv.style.cssText = 'position:fixed;top:5rem;left:50%;transform:translateX(-50%);' +
            'background:#dc2626;color:#fff;padding:0.75rem 1.5rem;border-radius:0.75rem;' +
            'z-index:200;font-size:0.875rem;font-weight:500;box-shadow:0 4px 20px rgba(0,0,0,0.3)';
        errorDiv.textContent = message;
        document.body.appendChild(errorDiv);
        setTimeout(function () { errorDiv.remove(); }, 6000);
    }

    /* ============================================
       Boot
       ============================================ */
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
