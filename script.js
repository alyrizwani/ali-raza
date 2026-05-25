/* ==========================================================================
   ALI RAZA PORTFOLIO - HERO INTERACTIVE SCRIPT
   ========================================================================== */

document.addEventListener("DOMContentLoaded", () => {
    // 0. Interactive Particle Background
    const canvas = document.getElementById('bg-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let particles = [];
        const particleCount = window.innerWidth < 768 ? 40 : 100;
        const connectionDistance = 150;
        const mouseRadius = 200;

        let mouse = { x: null, y: null };

        window.addEventListener('mousemove', (e) => {
            mouse.x = e.clientX;
            mouse.y = e.clientY;
        });

        class Particle {
            constructor() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.size = Math.random() * 2 + 1;
                this.speedX = Math.random() * 1 - 0.5;
                this.speedY = Math.random() * 1 - 0.5;
            }

            update() {
                this.x += this.speedX;
                this.y += this.speedY;

                if (this.x > canvas.width) this.x = 0;
                else if (this.x < 0) this.x = canvas.width;
                if (this.y > canvas.height) this.y = 0;
                else if (this.y < 0) this.y = canvas.height;

                // Mouse interaction - move particles away slightly or just attraction
                if (mouse.x != null) {
                    let dx = mouse.x - this.x;
                    let dy = mouse.y - this.y;
                    let distance = Math.sqrt(dx * dx + dy * dy);
                    if (distance < mouseRadius) {
                        this.x -= dx * 0.01;
                        this.y -= dy * 0.01;
                    }
                }
            }

            draw() {
                const isLight = document.documentElement.getAttribute('data-theme') === 'light';
                ctx.fillStyle = isLight ? 'rgba(15, 23, 42, 0.3)' : 'rgba(245, 158, 11, 0.4)';
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fill();
            }
        }

        function initBackground() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            particles = [];
            for (let i = 0; i < particleCount; i++) {
                particles.push(new Particle());
            }
        }

        function handleConnections() {
            const isLight = document.documentElement.getAttribute('data-theme') === 'light';
            const color = isLight ? '15, 23, 42' : '245, 158, 11';
            
            for (let i = 0; i < particles.length; i++) {
                for (let j = i; j < particles.length; j++) {
                    let dx = particles[i].x - particles[j].x;
                    let dy = particles[i].y - particles[j].y;
                    let distance = Math.sqrt(dx * dx + dy * dy);

                    if (distance < connectionDistance) {
                        let opacity = 1 - (distance / connectionDistance);
                        ctx.strokeStyle = `rgba(${color}, ${opacity * 0.15})`;
                        ctx.lineWidth = 1;
                        ctx.beginPath();
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.stroke();
                    }
                }
            }
        }

        function animate() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            particles.forEach(p => {
                p.update();
                p.draw();
            });
            handleConnections();
            requestAnimationFrame(animate);
        }

        window.addEventListener('resize', initBackground);
        initBackground();
        animate();
    }

    // 1. Initialize Lucide Icons (hero, skills, footer)
    const initLucideIcons = () => {
        if (typeof lucide !== "undefined") {
            lucide.createIcons();
        }
    };
    initLucideIcons();

    // 2. Interactive Cursor Backlight Ambient Glow
    const mouseGlow = document.getElementById("interactive-glow");
    let mouseX = 0, mouseY = 0; // Target mouse positions
    let glowX = 0, glowY = 0;   // Current glow positions (for lerp interpolation)
    
    if (mouseGlow && window.innerWidth > 1024) {
        document.addEventListener("mousemove", (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
        });

        // Smooth transition / easing for cursor glow (linear interpolation)
        function animateGlow() {
            const easing = 0.08;
            glowX += (mouseX - glowX) * easing;
            glowY += (mouseY - glowY) * easing;
            
            if (mouseGlow) {
                mouseGlow.style.left = `${glowX}px`;
                mouseGlow.style.top = `${glowY}px`;
            }
            
            requestAnimationFrame(animateGlow);
        }
        animateGlow();
    } else if (mouseGlow) {
        mouseGlow.style.display = "none";
    }

    // 3. 3D Mouse Parallax Depth Effect
    const heroSection = document.getElementById("hero");
    const parallaxText = document.getElementById("parallax-bg-text");
    const portraitImg = document.getElementById("hero-portrait");
    
    if (heroSection && parallaxText && portraitImg && window.innerWidth > 1024) {
        const heroCenter = document.querySelector(".hero-center");
        let isHovered = false;
        let offsetX = 0;
        let offsetY = 0;

        // Base scale = dominant chest-to-head zoom; hover nudges further
        const SCALE_BASE  = 1.75;
        const SCALE_HOVER = 1.82;

        function updateTransforms() {
            const textTranslateX = offsetX * 25;
            const textTranslateY = offsetY * 15;

            const portraitTranslateX = -offsetX * 12;
            const portraitTranslateY = -offsetY * 8 + (isHovered ? -6 : 0);
            const currentScale = isHovered ? SCALE_HOVER : SCALE_BASE;

            parallaxText.style.transform = `translate(${textTranslateX}px, ${textTranslateY}px)`;
            portraitImg.style.transform = `scale(${currentScale}) translate(${portraitTranslateX}px, ${portraitTranslateY}px)`;
        }

        // Apply immediately on load — no CSS fallback flash
        updateTransforms();

        document.addEventListener("mousemove", (e) => {
            const centerX = window.innerWidth / 2;
            const centerY = window.innerHeight / 2;
            
            offsetX = (e.clientX - centerX) / centerX;
            offsetY = (e.clientY - centerY) / centerY;
            
            requestAnimationFrame(updateTransforms);
        });
        
        if (heroCenter) {
            heroCenter.addEventListener("mouseenter", () => {
                isHovered = true;
                requestAnimationFrame(updateTransforms);
            });
            
            heroCenter.addEventListener("mouseleave", () => {
                isHovered = false;
                requestAnimationFrame(updateTransforms);
            });
        }
        
        document.addEventListener("mouseleave", () => {
            offsetX = 0;
            offsetY = 0;
            isHovered = false;
            requestAnimationFrame(updateTransforms);
        });
    }

    // 4. Magnetic Attraction Force for primary CTA button
    const ctaBtn = document.getElementById("cta-email-btn");
    if (ctaBtn && window.innerWidth > 1024) {
        ctaBtn.addEventListener("mousemove", (e) => {
            const rect = ctaBtn.getBoundingClientRect();
            // Calculate cursor coordinates relative to button center
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            
            // Attraction pull factor (ranges from 0 to 1, dividing by 3 pulls it up to ~30%)
            requestAnimationFrame(() => {
                ctaBtn.style.transform = `translate(${x * 0.28}px, ${y * 0.28}px)`;
            });
        });
        
        ctaBtn.addEventListener("mouseleave", () => {
            requestAnimationFrame(() => {
                ctaBtn.style.transform = "translate(0px, 0px)";
            });
        });
    }

    // 5. Theme Toggle Logic
    const themeToggle = document.getElementById("theme-toggle");
    const currentTheme = localStorage.getItem("theme");

    if (currentTheme) {
        document.documentElement.setAttribute("data-theme", currentTheme);
    }

    if (themeToggle) {
        themeToggle.addEventListener("click", () => {
            let theme = document.documentElement.getAttribute("data-theme");
            if (theme === "light") {
                document.documentElement.removeAttribute("data-theme");
                localStorage.setItem("theme", "dark");
            } else {
                document.documentElement.setAttribute("data-theme", "light");
                localStorage.setItem("theme", "light");
            }
        });
    }

    // 6. Mobile Menu Toggle Overlay
    const menuToggle = document.getElementById("menu-toggle-btn");
    const mobileMenu = document.getElementById("mobile-menu-overlay");
    const menuLinks = document.querySelectorAll(".menu-link");
    
    if (menuToggle && mobileMenu) {
        const toggleMenu = () => {
            const isOpen = mobileMenu.classList.toggle("open");
            menuToggle.classList.toggle("active");
            
            // Prevent body scroll when menu is full screen
            document.body.style.overflow = isOpen ? "hidden" : "";
        };

        menuToggle.addEventListener("click", toggleMenu);

        // Close menu automatically when a navigation link is clicked
        menuLinks.forEach((link) => {
            link.addEventListener("click", () => {
                mobileMenu.classList.remove("open");
                menuToggle.classList.remove("active");
                document.body.style.overflow = "";
            });
        });
    }

    // 6. Scroll-triggered Fade-Up Animations
    const fadeEls = document.querySelectorAll(".fade-up");
    if (fadeEls.length > 0) {
        const fadeObserver = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("visible");
                    fadeObserver.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.15,
            rootMargin: "0px 0px -40px 0px"
        });

        fadeEls.forEach((el) => fadeObserver.observe(el));

        // Re-render Lucide icons when skills section enters view
        const skillsSection = document.getElementById("skills");
        if (skillsSection) {
            const skillsIconObserver = new IntersectionObserver((entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        initLucideIcons();
                        skillsIconObserver.disconnect();
                    }
                });
            }, { threshold: 0.05 });
            skillsIconObserver.observe(skillsSection);
        }
    }

    // 7. Custom Form Validation
    const contactForm = document.getElementById("contactForm");
    if (contactForm) {
        const inputs = contactForm.querySelectorAll("input[required], textarea[required]");

        inputs.forEach(input => {
            const formGroup = input.closest(".form-group");
            
            // Create error message element
            const errorMsg = document.createElement("span");
            errorMsg.className = "error-message";
            errorMsg.innerText = "Required Field";
            formGroup.appendChild(errorMsg);

            // Handle invalid event
            input.addEventListener("invalid", (e) => {
                e.preventDefault(); // Prevent default browser tooltip
                formGroup.classList.add("has-error");
            });

            // Remove error when user starts typing or fixes it
            input.addEventListener("input", () => {
                if (input.value.trim() !== "") {
                    formGroup.classList.remove("has-error");
                }
            });
        });
    }

    initLucideIcons();
    requestAnimationFrame(initLucideIcons);

    // 7. Skills section: sticky heading + 4-dash stepper sync
    const skillsSection = document.getElementById("skills");
    if (skillsSection) {
        const skillsRailDashes = skillsSection.querySelectorAll(".skills-rail-dash");
        const skillsCategories = skillsSection.querySelectorAll(".skills-category[data-skills-step]");

        const stickyTopPx = () => {
            const val = getComputedStyle(skillsSection).getPropertyValue("--skills-sticky-top").trim();
            if (val.endsWith("rem")) {
                return parseFloat(val) * parseFloat(getComputedStyle(document.documentElement).fontSize);
            }
            return parseFloat(val) || 96;
        };

        const updateSkillsScroll = () => {
            if (window.matchMedia("(max-width: 768px)").matches) {
                return;
            }

            const stickyTop = stickyTopPx();
            const viewportHeight = window.innerHeight;
            let activeStep = 0;

            skillsCategories.forEach((category, index) => {
                const catRect = category.getBoundingClientRect();
                const trigger = stickyTop + viewportHeight * 0.35;
                if (catRect.top <= trigger) {
                    activeStep = index;
                }
            });

            const lastCategory = skillsCategories[skillsCategories.length - 1];
            if (lastCategory) {
                const lastRect = lastCategory.getBoundingClientRect();
                if (lastRect.bottom <= stickyTop + viewportHeight * 0.5) {
                    activeStep = skillsCategories.length - 1;
                }
            }

            skillsRailDashes.forEach((dash, index) => {
                dash.classList.toggle("active", index === activeStep);
                dash.classList.toggle("passed", index < activeStep);
            });
        };

        let skillsTicking = false;
        const onSkillsScroll = () => {
            if (!skillsTicking) {
                requestAnimationFrame(() => {
                    updateSkillsScroll();
                    skillsTicking = false;
                });
                skillsTicking = true;
            }
        };

        window.addEventListener("scroll", onSkillsScroll, { passive: true });
        window.addEventListener("resize", onSkillsScroll, { passive: true });
        updateSkillsScroll();
    }

    // 8. Projects — timeline steps + panel transitions
    const projectsSection = document.getElementById("projects");
    const projectSteps = document.querySelectorAll("[data-project-step]");
    const projectPanels = document.querySelectorAll("[data-project-panel]");
    const projectsTimelineProgress = document.getElementById("projects-timeline-progress");

    if (projectSteps.length && projectPanels.length) {
        const stepCount = projectSteps.length;

        const setActiveProject = (index) => {
            const i = Math.min(Math.max(index, 0), stepCount - 1);

            projectSteps.forEach((step, idx) => {
                const isActive = idx === i;
                step.classList.toggle("is-active", isActive);
                step.setAttribute("aria-current", isActive ? "true" : "false");
            });

            projectPanels.forEach((panel, idx) => {
                panel.classList.toggle("is-active", idx === i);
            });

            if (projectsTimelineProgress) {
                const fill = ((i + 1) / stepCount) * 100;
                projectsTimelineProgress.style.height = `${fill}%`;
            }

            initLucideIcons();
        };

        projectSteps.forEach((step) => {
            step.addEventListener("click", () => {
                const index = parseInt(step.getAttribute("data-project-step"), 10);
                setActiveProject(index);
            });
        });

        setActiveProject(0);
    }

    if (projectsSection) {
        const projIconObserver = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    initLucideIcons();
                    projIconObserver.disconnect();
                }
            });
        }, { threshold: 0.05 });
        projIconObserver.observe(projectsSection);
    }

    // 9. Education — timeline cards + scroll progress
    const educationSection = document.getElementById("education");
    const eduTimelineProgress = document.getElementById("edu-timeline-progress");
    const eduCards = document.querySelectorAll("[data-edu-card]");

    if (eduCards.length && educationSection) {
        const eduMilestones = educationSection.querySelector(".edu-milestones");

        const updateEduProgressFill = (activeIndex) => {
            if (!eduTimelineProgress || !eduMilestones) return;
            const first = eduCards[0];
            const last = eduCards[eduCards.length - 1];
            const start = first.offsetTop + first.offsetHeight / 2;
            const end = last.offsetTop + last.offsetHeight / 2;
            const active = eduCards[activeIndex];
            const activeCenter = active.offsetTop + active.offsetHeight / 2;
            const span = end - start || 1;
            const fill = ((activeCenter - start) / span) * 100;
            eduTimelineProgress.style.height = `${Math.min(Math.max(fill, 15), 100)}%`;
        };

        const setActiveEdu = (targetCard, indexOverride) => {
            const index = indexOverride ?? [...eduCards].indexOf(targetCard);
            eduCards.forEach((card, i) => {
                const isActive = i === index;
                card.classList.toggle("is-active", isActive);
                const trigger = card.querySelector(".edu-card-trigger");
                if (trigger) {
                    trigger.setAttribute("aria-expanded", isActive ? "true" : "false");
                }
            });
            updateEduProgressFill(index);
            initLucideIcons();
        };

        eduCards.forEach((card, index) => {
            const trigger = card.querySelector(".edu-card-trigger");
            if (!trigger) return;

            trigger.addEventListener("click", () => {
                setActiveEdu(card, index);
            });
        });

        setActiveEdu(eduCards[0], 0);

        const updateEduTimeline = () => {
            const vh = window.innerHeight;
            const trigger = vh * 0.45;
            let activeIndex = 0;

            eduCards.forEach((card, index) => {
                const rect = card.getBoundingClientRect();
                const center = rect.top + rect.height / 2;
                if (center <= trigger) {
                    activeIndex = index;
                }
            });

            if (educationSection.getBoundingClientRect().top > vh * 0.35) {
                activeIndex = 0;
            }

            setActiveEdu(eduCards[activeIndex], activeIndex);
        };

        let eduTicking = false;
        const onEduScroll = () => {
            if (!eduTicking) {
                requestAnimationFrame(() => {
                    updateEduTimeline();
                    eduTicking = false;
                });
                eduTicking = true;
            }
        };

        if (eduTimelineProgress) {
            window.addEventListener("scroll", onEduScroll, { passive: true });
            window.addEventListener("resize", onEduScroll, { passive: true });
            updateEduTimeline();
        }
    }

    if (educationSection) {
        const eduIconObserver = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    initLucideIcons();
                    eduIconObserver.disconnect();
                }
            });
        }, { threshold: 0.05 });
        eduIconObserver.observe(educationSection);
    }

    // 10. Experience — interactive accordion cards + timeline progress
    const experienceSection = document.getElementById("experience");
    const timelineProgress = document.getElementById("timeline-progress");
    const expCards = document.querySelectorAll("[data-exp-card]");

    if (expCards.length) {
        const setOpenCard = (targetCard) => {
            expCards.forEach((card) => {
                const isOpen = card === targetCard;
                card.classList.toggle("is-open", isOpen);
                const btn = card.querySelector(".exp-card-toggle");
                if (btn) {
                    btn.setAttribute("aria-expanded", isOpen ? "true" : "false");
                }
            });
            initLucideIcons();
        };

        expCards.forEach((card) => {
            const toggle = card.querySelector(".exp-card-toggle");
            if (!toggle) return;

            toggle.addEventListener("click", () => {
                if (card.classList.contains("is-open")) {
                    card.classList.remove("is-open");
                    card.classList.remove("is-active");
                    toggle.setAttribute("aria-expanded", "false");
                } else {
                    setOpenCard(card);
                }
            });
        });

    }

    if (experienceSection && timelineProgress) {
        const cardsWrap = experienceSection.querySelector(".experience-cards");

        const updateTimelineProgress = () => {
            if (!cardsWrap || !expCards.length) return;

            const wrapRect = cardsWrap.getBoundingClientRect();
            const vh = window.innerHeight;
            const trigger = vh * 0.45;
            let activeIndex = 0;

            expCards.forEach((card, index) => {
                const cardRect = card.getBoundingClientRect();
                const center = cardRect.top + cardRect.height / 2;
                if (center <= trigger) {
                    activeIndex = index;
                }
                card.classList.toggle("is-active", index === activeIndex);
            });

            const firstCard = expCards[0];
            const lastCard = expCards[expCards.length - 1];
            const start = firstCard.offsetTop + firstCard.offsetHeight / 2;
            const end = lastCard.offsetTop + lastCard.offsetHeight / 2;
            const activeCard = expCards[activeIndex];
            const activeCenter = activeCard.offsetTop + activeCard.offsetHeight / 2;
            const span = end - start || 1;
            const fillPercent = ((activeCenter - start) / span) * 100;

            timelineProgress.style.height = `${Math.min(Math.max(fillPercent, 12), 100)}%`;
        };

        let expTicking = false;
        const onExpScroll = () => {
            if (!expTicking) {
                requestAnimationFrame(() => {
                    updateTimelineProgress();
                    expTicking = false;
                });
                expTicking = true;
            }
        };

        window.addEventListener("scroll", onExpScroll, { passive: true });
        window.addEventListener("resize", onExpScroll, { passive: true });
        updateTimelineProgress();
    }

    if (experienceSection) {
        const expIconObserver = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    initLucideIcons();
                    expIconObserver.disconnect();
                }
            });
        }, { threshold: 0.05 });
        expIconObserver.observe(experienceSection);
    }

    // 11. Certifications — timeline cards + scroll progress
    const certificationsSection = document.getElementById("certifications");
    const certTimelineProgress = document.getElementById("cert-timeline-progress");
    const certCards = document.querySelectorAll("[data-cert-card]");

    if (certCards.length && certificationsSection) {
        const certMilestones = certificationsSection.querySelector(".edu-milestones");

        const updateCertProgressFill = (activeIndex) => {
            if (!certTimelineProgress || !certMilestones) return;
            const first = certCards[0];
            const last = certCards[certCards.length - 1];
            const start = first.offsetTop + first.offsetHeight / 2;
            const end = last.offsetTop + last.offsetHeight / 2;
            const active = certCards[activeIndex];
            const activeCenter = active.offsetTop + active.offsetHeight / 2;
            const span = end - start || 1;
            const fill = ((activeCenter - start) / span) * 100;
            certTimelineProgress.style.height = `${Math.min(Math.max(fill, 15), 100)}%`;
        };

        const setActiveCert = (targetCard, indexOverride) => {
            const index = indexOverride ?? [...certCards].indexOf(targetCard);
            certCards.forEach((card, i) => {
                const isActive = i === index;
                card.classList.toggle("is-active", isActive);
                const trigger = card.querySelector(".edu-card-trigger");
                if (trigger) {
                    trigger.setAttribute("aria-expanded", isActive ? "true" : "false");
                }
            });
            updateCertProgressFill(index);
            initLucideIcons();
        };

        certCards.forEach((card, index) => {
            const trigger = card.querySelector(".edu-card-trigger");
            if (!trigger) return;

            trigger.addEventListener("click", () => {
                setActiveCert(card, index);
            });
        });

        setActiveCert(certCards[0], 0);

        const updateCertTimeline = () => {
            const vh = window.innerHeight;
            const trigger = vh * 0.45;
            let activeIndex = 0;

            certCards.forEach((card, index) => {
                const rect = card.getBoundingClientRect();
                const center = rect.top + rect.height / 2;
                if (center <= trigger) {
                    activeIndex = index;
                }
            });

            if (certificationsSection.getBoundingClientRect().top > vh * 0.35) {
                activeIndex = 0;
            }

            setActiveCert(certCards[activeIndex], activeIndex);
        };

        let certTicking = false;
        const onCertScroll = () => {
            if (!certTicking) {
                requestAnimationFrame(() => {
                    updateCertTimeline();
                    certTicking = false;
                });
                certTicking = true;
            }
        };

        if (certTimelineProgress) {
            window.addEventListener("scroll", onCertScroll, { passive: true });
            window.addEventListener("resize", onCertScroll, { passive: true });
            updateCertTimeline();
        }
    }

    if (certificationsSection) {
        const certIconObserver = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    initLucideIcons();
                    certIconObserver.disconnect();
                }
            });
        }, { threshold: 0.05 });
        certIconObserver.observe(certificationsSection);
    }
});
