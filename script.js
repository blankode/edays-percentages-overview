// ==UserScript==
// @name         eDays Analyzer Pro
// @namespace    http://tampermonkey.net/
// @version      19.2
// @match        https://*.e-days.com/*
// @require      https://raw.githubusercontent.com/blankode/edays-percentages-overview/main/script_core.js?v=19.2
// @updateURL    https://raw.githubusercontent.com/blankode/edays-percentages-overview/main/script.js
// @downloadURL  https://raw.githubusercontent.com/blankode/edays-percentages-overview/main/script.js
// ==/UserScript==
// Changelog v19.2: Replaced the separate floating Back to top and Today-strip jump controls with one native eDays c3-button beside Submit month. The button switches between To today and Back to top based on scroll position.
(function() {
    'use strict';

    const NAV_BUTTON_ID = 'ep-timesheet-nav';
    let boundScrollParent = null;
    let rafId = 0;

    const getScrollParent = el => {
        let parent = el?.parentElement || null;
        while (parent) {
            const style = getComputedStyle(parent);
            if (/(auto|scroll)/.test(`${style.overflow}${style.overflowY}`)) {
                return parent;
            }
            parent = parent.parentElement;
        }
        return window;
    };

    const getTimesheetHeader = () => document.getElementById('timesheetMonthHeader');

    const getSubmitMonthButton = () => {
        const header = getTimesheetHeader();
        if (!header) return null;

        const buttons = [...header.querySelectorAll('.button_container c3-button')];
        return buttons.find(button => button.textContent.trim() === 'Submit month')
            || header.querySelector('.button_container c3-button[accesskey="s"]');
    };

    const getTodayRow = () => document.querySelector('.today_chip')?.closest('.tt_day_container') || null;
    const getTopTarget = () => document.getElementById('ep13') || document.getElementById('mainTimesheetPanel');

    const getHeaderOffset = () => {
        const header = getTimesheetHeader();
        return header ? Math.max(80, Math.ceil(header.getBoundingClientRect().height) + 12) : 80;
    };

    const scrollToElement = target => {
        if (!target) return;

        const scrollParent = getScrollParent(target);
        const offset = getHeaderOffset();

        if (scrollParent === window) {
            const top = Math.max(0, target.getBoundingClientRect().top + window.scrollY - offset);
            window.scrollTo({
                top,
                left: window.scrollX,
                behavior: 'smooth'
            });
            return;
        }

        const top = Math.max(
            0,
            target.getBoundingClientRect().top
                - scrollParent.getBoundingClientRect().top
                + scrollParent.scrollTop
                - offset
        );
        scrollParent.scrollTo({
            top,
            left: scrollParent.scrollLeft,
            behavior: 'smooth'
        });
    };

    const removeLegacyNavigation = () => {
        document.getElementById('ep-analyzer-float')?.remove();
        document.querySelectorAll('#ep13 [data-action="jump-today"]').forEach(button => button.remove());
    };

    const setNavState = button => {
        if (!button) return;

        const todayRow = getTodayRow();
        const header = getTimesheetHeader();
        let mode = 'top';

        if (todayRow) {
            const headerBottom = header ? Math.max(0, header.getBoundingClientRect().bottom) : 0;
            const triggerLine = headerBottom + 12;
            mode = todayRow.getBoundingClientRect().top <= triggerLine ? 'top' : 'today';
        }

        const label = mode === 'today' ? 'To today' : 'Back to top';
        if (button.textContent.trim() !== label) {
            button.textContent = label;
        }
        if (button.dataset.epTarget !== mode) {
            button.dataset.epTarget = mode;
        }

        const description = mode === 'today'
            ? 'Jump to today in the current timesheet'
            : 'Back to the top of the timesheet';
        if (button.getAttribute('title') !== description) {
            button.setAttribute('title', description);
            button.setAttribute('aria-label', description);
        }
    };

    const scheduleStateUpdate = () => {
        if (rafId) return;
        rafId = requestAnimationFrame(() => {
            rafId = 0;
            setNavState(document.getElementById(NAV_BUTTON_ID));
        });
    };

    const bindScrollUpdates = () => {
        const target = getTodayRow() || getTopTarget();
        const nextScrollParent = target ? getScrollParent(target) : window;
        if (nextScrollParent === boundScrollParent) return;

        if (boundScrollParent) {
            boundScrollParent.removeEventListener('scroll', scheduleStateUpdate);
        }

        boundScrollParent = nextScrollParent;
        boundScrollParent.addEventListener('scroll', scheduleStateUpdate, { passive: true });
    };

    const ensureNavButton = () => {
        removeLegacyNavigation();

        const submitButton = getSubmitMonthButton();
        if (!submitButton) return;

        let button = document.getElementById(NAV_BUTTON_ID);
        if (!button || button.tagName.toLowerCase() !== 'c3-button') {
            button?.remove();
            button = document.createElement('c3-button');
            button.id = NAV_BUTTON_ID;
            button.className = 'disallow-impersonation-action';
            button.addEventListener('click', event => {
                event.preventDefault();

                if (button.dataset.epTarget === 'today') {
                    const todayRow = getTodayRow();
                    if (todayRow) {
                        scrollToElement(todayRow);
                        return;
                    }
                }

                const topTarget = getTopTarget();
                if (topTarget) {
                    scrollToElement(topTarget);
                } else {
                    window.scrollTo({ top: 0, left: window.scrollX, behavior: 'smooth' });
                }
            });
        }

        if (submitButton.nextElementSibling !== button) {
            submitButton.insertAdjacentElement('afterend', button);
        }

        bindScrollUpdates();
        setNavState(button);
    };

    const observer = new MutationObserver(() => {
        ensureNavButton();
    });

    const start = () => {
        ensureNavButton();
        observer.observe(document.documentElement, {
            childList: true,
            subtree: true
        });
        window.addEventListener('resize', scheduleStateUpdate, { passive: true });
        setInterval(ensureNavButton, 5000);
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', start, { once: true });
    } else {
        start();
    }
})();
