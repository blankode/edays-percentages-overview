// ==UserScript==
// @name         eDays Analyzer Pro
// @namespace    http://tampermonkey.net/
// @version      16.0
// @match        https://*.e-days.com/*
// @grant        none
// @updateURL    https://raw.githubusercontent.com/blankode/edays-percentages-overview/main/script.js
// @downloadURL  https://raw.githubusercontent.com/blankode/edays-percentages-overview/main/script.js
// ==/UserScript==

/* ══ Set Office Target ══ */
const offTarget = 60;

(function () {
    'use strict';

    /* ═══════════════════════════════════════════════════════════════
       THEME DETECTION
    ═══════════════════════════════════════════════════════════════ */

    const getPageBrightness = () => {
        const candidates = [
            document.body,
            document.documentElement,
            document.getElementById('mainTimesheetPanel'),
            document.querySelector('.timesheet_container'),
            document.querySelector('.main-content'),
            document.querySelector('#content'),
        ].filter(Boolean);

        for (const el of candidates) {
            const bg    = getComputedStyle(el).backgroundColor;
            const match = bg.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
            if (!match) continue;
            const [, r, g, b] = match.map(Number);
            if (r === 0 && g === 0 && b === 0) continue;
            return (0.299 * r + 0.587 * g + 0.114 * b);
        }
        return 255;
    };

    const buildTheme = () => {
        const isDark = getPageBrightness() < 100;
        if (isDark) {
            return {
                isDark,
                bg: '#181818', surface: '#242424', border: 'rgba(255,255,255,0.08)',
                text: '#e8e8e8', muted: '#888888', faint: 'rgba(255,255,255,0.04)',
                barTrack: 'rgba(255,255,255,0.07)', chipBg: 'rgba(255,255,255,0.03)',
                shadow: '0 4px 24px rgba(0,0,0,0.4)', ringTrack: 'rgba(255,255,255,0.12)',
            };
        }
        return {
            isDark,
            bg: '#ffffff', surface: '#f7f7f7', border: 'rgba(0,0,0,0.08)',
            text: '#111827', muted: '#6b7280', faint: 'rgba(0,0,0,0.03)',
            barTrack: 'rgba(0,0,0,0.07)', chipBg: 'rgba(0,0,0,0.03)',
            shadow: '0 2px 12px rgba(0,0,0,0.10)', ringTrack: 'rgba(0,0,0,0.12)',
        };
    };

    /* ═══════════════════════════════════════════════════════════════
       UTILITIES
    ═══════════════════════════════════════════════════════════════ */

    const timeToMinutes = t => {
        if (!t) return 0;
        const [h, m] = t.split(':').map(Number);
        return h * 60 + m;
    };

    const fmt = (mins) => {
        const sign = mins < 0 ? '-' : '';
        const abs  = Math.abs(mins);
        const h    = Math.floor(abs / 60);
        const m    = abs % 60;
        return m === 0 ? `${sign}${h}h` : `${sign}${h}h ${String(m).padStart(2, '0')}m`;
    };

    const parseTime = value => {
        const match = (value || '').match(/(-?\d+):(\d{2})/);
        if (!match) return 0;
        const mins = Math.abs(parseInt(match[1])) * 60 + parseInt(match[2]);
        return parseInt(match[1]) < 0 ? -mins : mins;
    };

    const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));

    /* ═══════════════════════════════════════════════════════════════
       SCROLL HELPERS
    ═══════════════════════════════════════════════════════════════ */

    const smoothScrollTo = (el, offset = -165) => {
        if (!el) return;
        const top = el.getBoundingClientRect().top + window.scrollY + offset;
        window.scrollTo({ top, behavior: 'smooth' });
    };

    const jumpToToday = () => {
        const chip   = document.querySelector('.today_chip');
        const target = chip ? (chip.closest('.tt_day_container') || chip) : null;
        smoothScrollTo(target);
    };

    const jumpToAnalyzer = () => smoothScrollTo(document.getElementById('ep13'));

    /* ═══════════════════════════════════════════════════════════════
       PERIOD / DAY HELPERS
    ═══════════════════════════════════════════════════════════════ */

    const getDayTotalMinutes = (dayEl) => {
        const txt = dayEl.querySelector('.duration_hours')?.innerText?.trim() || '';
        return timeToMinutes(txt);
    };

    const getPeriodMinutes = (periodEl) => {
        const inputs = periodEl.querySelectorAll('input[type="time"]');
        if (inputs.length >= 2 && inputs[0].value && inputs[1].value) {
            const dur = timeToMinutes(inputs[1].value) - timeToMinutes(inputs[0].value);
            return dur > 0 ? dur : 0;
        }
        const lbl   = periodEl.querySelector('label.hiddenLabel')?.innerText || '';
        const match = lbl.match(/(\d{2}:\d{2})\s+to\s+(\d{2}:\d{2})/);
        if (match) {
            const dur = timeToMinutes(match[2]) - timeToMinutes(match[1]);
            return dur > 0 ? dur : 0;
        }
        return 0;
    };

    /* ═══════════════════════════════════════════════════════════════
       ICONS
    ═══════════════════════════════════════════════════════════════ */

    const ICONS = {
        office:        `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M3 21h18v-2H3v2zm0-4h18v-2H3v2zm0-4h18v-2H3v2zm0-4h18V7H3v2zm0-6v2h18V3H3z"/></svg>`,
        laptop:        `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M20 18c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2H4c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2H0v2h24v-2h-4zM4 6h16v10H4V6z"/></svg>`,
        flight:        `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z"/></svg>`,
        block:         `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15v-4H7l5-8v4h4l-5 8z"/></svg>`,
        timer:         `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M15 1H9v2h6V1zm-4 13h2V8h-2v6zm8.03-6.61l1.42-1.42c-.43-.51-.9-.99-1.41-1.41l-1.42 1.42C16.07 4.74 14.12 4 12 4c-4.97 0-9 4.03-9 9s4.02 9 9 9 9-4.03 9-9c0-2.12-.74-4.07-1.97-5.61zM12 20c-3.87 0-7-3.13-7-7s3.13-7 7-7 7 3.13 7 7-3.13 7-7 7z"/></svg>`,
        trending_up:   `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M16 6l2.29 2.29-4.88 4.88-4-4L2 16.59 3.41 18l6-6 4 4 6.3-6.29L22 12V6z"/></svg>`,
        trending_down: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M16 18l2.29-2.29-4.88-4.88-4 4L2 7.41 3.41 6l6 6 4-4 6.3 6.29L22 12v6z"/></svg>`,
        trending_flat: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M22 12l-4-4v3H3v2h15v3z"/></svg>`,
        check:         `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>`,
        warning:       `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z"/></svg>`,
        calendar:      `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M17 12h-5v5h5v-5zM16 1v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2h-1V1h-2zm3 18H5V8h14v11z"/></svg>`,
        today:         `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z"/></svg>`,
        flag:          `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M14.4 6L14 4H5v17h2v-7h5.6l.4 2h7V6z"/></svg>`,
        savings:       `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M11.5 2C6.81 2 3 5.81 3 10.5S6.81 19 11.5 19h.5v3c4.86-2.34 8-7 8-11.5C20 5.81 16.19 2 11.5 2zm1 14.5h-2v-2h2v2zm0-4h-2c0-3.25 3-3 3-5 0-1.1-.9-2-2-2s-2 .9-2 2h-2c0-2.21 1.79-4 4-4s4 1.79 4 4c0 2.5-3 2.75-3 5z"/></svg>`,
        sun:           `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M6.76 4.84l-1.8-1.79-1.41 1.41 1.79 1.79 1.42-1.41zM4 10.5H1v2h3v-2zm9-9.95h-2V3.5h2V.55zm7.45 3.91l-1.41-1.41-1.79 1.79 1.41 1.41 1.79-1.79zm-3.21 13.7l1.79 1.8 1.41-1.41-1.8-1.79-1.4 1.4zM20 10.5v2h3v-2h-3zm-8-5c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6-2.69-6-6-6zm-1 16.95h2V19.5h-2v2.95zm-7.45-3.91l1.41 1.41 1.79-1.8-1.41-1.41-1.79 1.8z"/></svg>`,
        moon:          `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 3a9 9 0 1 0 9 9c0-.46-.04-.92-.1-1.36a5.389 5.389 0 0 1-4.4 2.26 5.403 5.403 0 0 1-3.14-9.8c-.44-.06-.9-.1-1.36-.1z"/></svg>`,
        arrow_down:    `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M20 12l-1.41-1.41L13 16.17V4h-2v12.17l-5.58-5.59L4 12l8 8 8-8z"/></svg>`,
        arrow_up:      `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M4 12l1.41 1.41L11 7.83V20h2V7.83l5.58 5.59L20 12l-8-8-8 8z"/></svg>`,
        car:           `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z"/></svg>`,
        bike:          `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M15.5 5.5c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zM5 12c-2.8 0-5 2.2-5 5s2.2 5 5 5 5-2.2 5-5-2.2-5-5-5zm0 8.5c-1.9 0-3.5-1.6-3.5-3.5s1.6-3.5 3.5-3.5 3.5 1.6 3.5 3.5-1.6 3.5-3.5 3.5zm5.8-10l2.4-2.4.8.8c1.3 1.3 3 2.1 5.1 2.1V9c-1.5 0-2.7-.6-3.6-1.5l-1.9-1.9c-.5-.4-1-.6-1.6-.6s-1.1.2-1.4.6L7.8 8.4C7.3 8.8 7 9.4 7 10c0 .6.3 1.2.8 1.6l3.2 2.4V18h2v-5l-3.2-2.5.8-.8zM19 12c-2.8 0-5 2.2-5 5s2.2 5 5 5 5-2.2 5-5-2.2-5-5-5zm0 8.5c-1.9 0-3.5-1.6-3.5-3.5s1.6-3.5 3.5-3.5 3.5 1.6 3.5 3.5-1.6 3.5-3.5 3.5z"/></svg>`,
        walk:          `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M13.49 5.48c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm-3.6 13.9l1-4.4 2.1 2v6h2v-7.5l-2.1-2 .6-3c1.3 1.5 3.3 2.5 5.5 2.5v-2c-1.9 0-3.5-1-4.3-2.4l-1-1.6c-.4-.6-1-1-1.7-1-.3 0-.5.1-.8.1l-5.2 2.2v4.7h2v-3.4l1.8-.7-1.6 8.1-4.9-1-.4 2 7 1.4z"/></svg>`,
        chevron_down:  `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z"/></svg>`,
        chevron_up:    `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M7.41 15.41L12 10.83l4.59 4.58L18 14l-6-6-6 6 1.41 1.41z"/></svg>`,
        map_pin:       `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>`,
        lightbulb:     `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M9 21c0 .55.45 1 1 1h4c.55 0 1-.45 1-1v-1H9v1zm3-19C8.14 2 5 5.14 5 9c0 2.38 1.19 4.47 3 5.74V17c0 .55.45 1 1 1h6c.55 0 1-.45 1-1v-2.26c1.81-1.27 3-3.36 3-5.74 0-3.86-3.14-7-7-7z"/></svg>`,
        home:          `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/></svg>`,
    };

    const icon = (name, size = 14, color = '#fff') =>
        `<span style="display:inline-flex;align-items:center;justify-content:center;width:${size}px;height:${size}px;color:${color};flex-shrink:0;">${ICONS[name] || ''}</span>`;

    const iconBadge = (name, bg, size = 28) =>
        `<span style="display:inline-flex;align-items:center;justify-content:center;width:${size}px;height:${size}px;background:${bg};border-radius:7px;flex-shrink:0;color:#fff;">${ICONS[name] || ''}</span>`;

    /* ═══════════════════════════════════════════════════════════════
       OFFICE TARGET COLOR
    ═══════════════════════════════════════════════════════════════ */

    const getOffColor = (pct) => {
        if (pct >= 100) return '#22c55e';
        if (pct >= 85)  return '#84cc16';
        if (pct >= 65)  return '#eab308';
        if (pct >= 45)  return '#f97316';
        return '#ef4444';
    };

    /* ═══════════════════════════════════════════════════════════════
       SVG RING
    ═══════════════════════════════════════════════════════════════ */

    const ring = ({ r = 54, pct, color, sw = 6, trackColor }) => {
        const circ = 2 * Math.PI * r;
        const dash = clamp(pct, 0, 100) / 100 * circ;
        const cx   = r + sw + 1;
        const sz   = cx * 2;
        return `<svg viewBox="0 0 ${sz} ${sz}" style="transform:rotate(-90deg);">
            <circle cx="${cx}" cy="${cx}" r="${r}" fill="none" stroke="${trackColor}" stroke-width="${sw}"/>
            <circle cx="${cx}" cy="${cx}" r="${r}" fill="none" stroke="${color}" stroke-width="${sw}"
                stroke-dasharray="${dash.toFixed(2)} ${circ.toFixed(2)}" stroke-linecap="round"/>
        </svg>`;
    };

    /* ═══════════════════════════════════════════════════════════════
       DATA GATHERING
    ═══════════════════════════════════════════════════════════════ */

    const getSummaryData = () => {
        const data = { recorded: 0, rota: 0, absences: 0, holidays: 0, difference: 0 };
        document.querySelectorAll('.desktop_summary .summary_block').forEach(block => {
            const spans = block.querySelectorAll('span');
            if (spans.length < 2) return;
            const minutes = parseTime(spans[0].innerText.trim());
            const label   = spans[1].innerText.trim();
            if (label.includes('Time recorded'))   data.recorded   = minutes;
            if (label.includes('Rota'))            data.rota       = Math.abs(minutes);
            if (label.includes('Absences'))        data.absences   = Math.abs(minutes);
            if (label.includes('Public holidays')) data.holidays   = Math.abs(minutes);
            if (label.includes('Difference'))      data.difference = minutes;
        });
        return data;
    };

    const getActivityData = () => {
        const actMap = { 'Office': 0, 'Mobile Working': 0, 'Business Travel': 0, 'No Activity': 0 };
        let rawTotal = 0, workedDays = 0;
        document.querySelectorAll('.tt_day_container').forEach(day => {
            let dayWorked = false;
            day.querySelectorAll('.tt_period_container').forEach(period => {
                const dur = getPeriodMinutes(period);
                if (dur <= 0) return;
                dayWorked = true;
                const act = period.querySelector('.chosen-single span')?.innerText.trim() || 'No Activity';
                if (!(act in actMap)) actMap[act] = 0;
                actMap[act] += dur;
                rawTotal    += dur;
            });
            if (dayWorked) workedDays++;
        });
        return { actMap, rawTotal, workedDays };
    };

    const getDayStats = (summary) => {
        const realRota = summary.rota - summary.absences - summary.holidays;
        const allDays  = [...document.querySelectorAll('.tt_day_container')];

        const isHalfDayVacation = (d) => {
            const txt = d.querySelector('.absence_detail_text')?.innerText?.trim() || '';
            return txt === 'Vacation: AM' || txt === 'Vacation: PM';
        };

        const workableDays = allDays.filter(d => {
            const t = d.querySelector('.timesheet_day_text')?.innerText?.trim() || '';
            if (t.startsWith('Saturday') || t.startsWith('Sunday')) return false;
            if (d.querySelector('.absence_detail_text') && !isHalfDayVacation(d)) return false;
            return true;
        }).length;

        const workedDays = allDays.filter(d => {
            const t = d.querySelector('.timesheet_day_text')?.innerText?.trim() || '';
            if (t.startsWith('Saturday') || t.startsWith('Sunday')) return false;
            return getDayTotalMinutes(d) > 0;
        }).length;

        const progressPct = realRota > 0 ? (summary.recorded / realRota) * 100 : 0;
        const daysLeft    = Math.round(Math.max(0, realRota - summary.recorded) / 480);
        const soFar       = Math.max(0, workableDays - daysLeft);
        const todayIdx    = allDays.findIndex(d => d.querySelector('.today_chip'));

        let bufferMinutes;
        if (todayIdx === -1) {
            bufferMinutes = summary.difference;
        } else {
            bufferMinutes = 0;
            allDays.forEach((day, idx) => {
                if (day.querySelector('.absence_detail_text')?.innerText) return;
                const dayMins = getDayTotalMinutes(day);
                if (dayMins <= 0) return;
                if (idx < todayIdx) {
                    bufferMinutes += dayMins - 480;
                } else if (dayMins > 480) {
                    bufferMinutes += dayMins - 480;
                }
            });
        }

        return { workableDays, soFar, daysLeft, workedDays, progressPct, bufferMinutes, realRota };
    };

    const getTodayMinutes = () => {
        const todayEl = [...document.querySelectorAll('.tt_day_container')]
            .find(d => d.querySelector('.today_chip'));
        return todayEl ? getDayTotalMinutes(todayEl) : 0;
    };

    const hasTodayOnPage = () => !!document.querySelector('.today_chip');

    /**
     * Returns a rich array of every calendar day in the current timesheet view.
     * Each entry: { label, dateNum, dayOfWeek (0=Sun…6=Sat), isWeekend,
     *               isAbsent, isHoliday, isToday, isPast, isFuture,
     *               totalMins, hasOffice, hasWFH, isWorkable }
     */
    const getDetailedDayData = () => {
        const todayIdx = [...document.querySelectorAll('.tt_day_container')]
            .findIndex(d => d.querySelector('.today_chip'));

        return [...document.querySelectorAll('.tt_day_container')].map((day, idx) => {
            const label   = day.querySelector('.timesheet_day_text')?.innerText?.trim() || '';
            // label is like "Monday 5" or "Tuesday 12"
            const parts   = label.split(' ');
            const dayName = parts[0] || '';
            const dateNum = parseInt(parts[1] || '0', 10);

            const DOW_MAP = { Sunday:0, Monday:1, Tuesday:2, Wednesday:3, Thursday:4, Friday:5, Saturday:6 };
            const dayOfWeek = DOW_MAP[dayName] ?? -1;
            const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;

            const absenceText  = day.querySelector('.absence_detail_text')?.innerText?.trim() || '';
            const isHalfDay    = absenceText === 'Vacation: AM' || absenceText === 'Vacation: PM';
            const isAbsent     = !!absenceText && !isHalfDay;
            const isHoliday    = absenceText.toLowerCase().includes('holiday');

            const isToday  = idx === todayIdx;
            const isPast   = todayIdx !== -1 ? idx < todayIdx : false;
            const isFuture = todayIdx !== -1 ? idx > todayIdx : true;

            const totalMins = getDayTotalMinutes(day);

            // Scan periods for activity types
            let hasOffice = false, hasWFH = false;
            day.querySelectorAll('.tt_period_container').forEach(period => {
                const dur = getPeriodMinutes(period);
                if (dur <= 0) return;
                const act = period.querySelector('.chosen-single span')?.innerText.trim() || '';
                if (act === 'Office') hasOffice = true;
                if (act === 'Mobile Working') hasWFH = true;
            });

            const isWorkable = !isWeekend && !isAbsent && !isHoliday;

            return {
                label, dayName, dateNum, dayOfWeek, isWeekend,
                isAbsent, isHoliday, isHalfDay, isToday, isPast, isFuture,
                totalMins, hasOffice, hasWFH, isWorkable,
                el: day,
            };
        });
    };

    /**
     * Given the full day array and how many office days are still needed,
     * returns a schedule plan: which future workable days to go to the office.
     *
     * Strategy:
     *  - Prefer Tue / Wed / Thu (avoids isolating Mon or Fri)
     *  - Then fill Mon / Fri if still needed
     *  - Group consecutive days within the same week (cluster rule)
     *  - Spread load as evenly as possible across remaining weeks
     */
    const buildSchedulePlan = ({ days, officeStillNeeded }) => {
        // Separate future workable days — not already committed to office
        const future = days.filter(d => (d.isFuture || d.isToday) && d.isWorkable && !d.hasOffice);

        // Group future days by ISO week number (Mon=week start)
        const weekMap = new Map();
        future.forEach(d => {
            // Compute a simple week key: floor((dateNum - 1) / 7) is not reliable across months;
            // use dayOfWeek to assign week bucket relative to first day
            const firstFutureDate = future[0]?.dateNum || 1;
            const weekKey = Math.floor((d.dateNum - 1) / 7);
            if (!weekMap.has(weekKey)) weekMap.set(weekKey, []);
            weekMap.get(weekKey).push(d);
        });

        // Sort each week's days by preference: Wed(3) > Tue(2) > Thu(4) > Mon(1) > Fri(5)
        const DOW_PREF = { 3: 0, 2: 1, 4: 2, 1: 3, 5: 4 };
        weekMap.forEach(wdays => wdays.sort((a, b) =>
            (DOW_PREF[a.dayOfWeek] ?? 9) - (DOW_PREF[b.dayOfWeek] ?? 9)
        ));

        const weeks       = [...weekMap.entries()].sort((a, b) => a[0] - b[0]);
        const planned     = new Set(); // dateNums of planned office days
        let remaining     = officeStillNeeded;

        // Distribute: try to fill each week with at most ceil(remaining/weeksLeft) days,
        // clustered on preferred days
        weeks.forEach(([, wdays], wi) => {
            if (remaining <= 0) return;
            const weeksLeft  = weeks.length - wi;
            const quota      = Math.ceil(remaining / weeksLeft);
            const toAssign   = Math.min(quota, wdays.length, remaining);
            // Pick the top `toAssign` preferred days
            wdays.slice(0, toAssign).forEach(d => planned.add(d.dateNum));
            remaining -= toAssign;
        });

        return planned; // Set of dateNums that should be office days
    };

    /* ═══════════════════════════════════════════════════════════════
       COMMUTE FORECASTER — config & persistence
    ═══════════════════════════════════════════════════════════════ */

    const COMMUTE_OPEN_KEY    = 'ep-commute-open';
    const COMMUTE_KM_KEY      = 'ep-commute-km';
    const COMMUTE_MODE_KEY    = 'ep-commute-mode';

    // Transport mode configs: speeds in km/h, colours, labels
    const TRANSPORT_MODES = {
        car: {
            label:    'Drive',
            icon:     'car',
            // avg speed in city traffic (Timișoara), km/h
            // includes parking walk (~5 min flat overhead each way)
            speedKmh: 30,
            parkingMin: 5,       // flat overhead each way for parking
            color:    '#f97316', // orange
            grad:     'linear-gradient(135deg,#f97316,#ef4444)',
            bg:       '#92400e',
            tip:      'Assumes city traffic. Add +5 min parking overhead each way.',
        },
        bike: {
            label:    'Cycle',
            icon:     'bike',
            speedKmh: 16,
            parkingMin: 2,
            color:    '#22c55e', // green
            grad:     'linear-gradient(135deg,#22c55e,#16a34a)',
            bg:       '#14532d',
            tip:      'Assumes an average cycling pace on urban roads.',
        },
        walk: {
            label:    'Walk',
            icon:     'walk',
            speedKmh: 5,
            parkingMin: 0,
            color:    '#3b82f6', // blue
            grad:     'linear-gradient(135deg,#3b82f6,#6366f1)',
            bg:       '#1e3a8a',
            tip:      'Assumes a brisk walking pace (~5 km/h).',
        },
    };

    /**
     * Calculate commute stats for a given km distance and transport mode.
     * Returns one-way minutes, round-trip minutes, monthly totals etc.
     */
    const calcCommute = ({ km, mode, officeDaysPerMonth, workableDays }) => {
        const cfg = TRANSPORT_MODES[mode];
        // one-way travel time in minutes
        const travelMins = (km / cfg.speedKmh) * 60;
        const oneWayMins = Math.round(travelMins + cfg.parkingMin);
        const roundTripMins = oneWayMins * 2;

        // monthly totals
        const monthlyCommuteMins  = roundTripMins * officeDaysPerMonth;
        const monthlyCommuteHours = monthlyCommuteMins / 60;

        // How many clustered weeks could optimise commuting
        // (e.g. doing all 3 office days in one go Mon-Wed-Thu)
        const weeksInMonth = workableDays / 5;
        const daysPerWeek  = officeDaysPerMonth / weeksInMonth;

        // Efficiency: WFH saves this time back
        const wfhDays          = workableDays - officeDaysPerMonth;
        const timeSavedVsAllOffice = ((workableDays - officeDaysPerMonth) * roundTripMins);

        return {
            oneWayMins,
            roundTripMins,
            monthlyCommuteMins,
            monthlyCommuteHours,
            daysPerWeek: Math.round(daysPerWeek * 10) / 10,
            wfhDays,
            timeSavedVsAllOffice,
        };
    };

    /* ═══════════════════════════════════════════════════════════════
       STYLES
    ═══════════════════════════════════════════════════════════════ */

    const STYLE_ID = 'edays-pro-v16-styles';

    const injectStyles = (T) => {
        let s = document.getElementById(STYLE_ID);
        if (!s) { s = document.createElement('style'); s.id = STYLE_ID; document.head.appendChild(s); }

        s.textContent = `
        #ep13 {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif;
            background: ${T.bg};
            border-radius: 14px;
            padding: 14px 16px 12px;
            margin: 0 0 16px;
            color: ${T.text};
        }

        #ep13 .ep-hdr {
            display: flex; align-items: center; gap: 10px;
            margin-bottom: 12px; padding-bottom: 10px;
            border-bottom: 1px solid ${T.border};
        }
        #ep13 .ep-hdr-logo {
            width: 30px; height: 30px;
            background: linear-gradient(135deg, #3b82f6, #a855f7);
            border-radius: 8px;
            display: flex; align-items: center; justify-content: center; flex-shrink: 0;
        }
        #ep13 .ep-hdr-title { font-size: 17px; font-weight: 700; letter-spacing: -0.3px; color: ${T.text}; }
        #ep13 .ep-hdr-right { margin-left: auto; display: flex; align-items: center; gap: 8px; }
        #ep13 .ep-hdr-date  { font-size: 13px; color: ${T.muted}; letter-spacing: 0.5px; display: flex; align-items: center; gap: 5px; }
        #ep13 .ep-pulse { width: 6px; height: 6px; border-radius: 50%; background: #22c55e; animation: ep-pulse 3.5s ease-in-out infinite; }
        @keyframes ep-pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.35;transform:scale(.65)} }

        #ep13 .ep-btn {
            display: inline-flex; align-items: center; gap: 5px;
            font-size: 12px; font-weight: 500;
            border-radius: 7px; cursor: pointer;
            border: 1px solid ${T.border};
            background: ${T.surface};
            color: ${T.muted};
            transition: background 0.15s, color 0.15s, border-color 0.15s;
            user-select: none; white-space: nowrap;
        }
        #ep13 .ep-btn:hover {
            background: ${T.isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.06)'};
            color: ${T.text};
            border-color: ${T.isDark ? 'rgba(255,255,255,0.18)' : 'rgba(0,0,0,0.15)'};
        }
        #ep13 .ep-btn-icon  { width: 26px; height: 26px; padding: 0; justify-content: center; }
        #ep13 .ep-btn-label { padding: 4px 10px; }
        #ep13 .ep-btn-pill  {
            padding: 4px 10px; gap: 6px;
            background: ${T.chipBg};
        }

        #ep13 .ep-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; }

        #ep13 .ep-card {
            background: ${T.surface}; border: 1px solid ${T.border};
            border-radius: 10px; padding: 12px;
            display: flex; flex-direction: column; gap: 8px; min-width: 0;
        }
        #ep13 .ep-card-title { font-size: 11px; font-weight: 700; letter-spacing: 1.1px; text-transform: uppercase; color: ${T.muted}; }

        #ep13 .ep-act-row  { display: flex; align-items: center; gap: 8px; }
        #ep13 .ep-act-info { flex: 1; min-width: 0; }
        #ep13 .ep-act-name { font-size: 13px; font-weight: 600; color: ${T.text}; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; line-height: 1.3; }
        #ep13 .ep-act-meta { font-size: 12px; color: ${T.muted}; line-height: 1.3; }
        #ep13 .ep-bar      { height: 3px; background: ${T.barTrack}; border-radius: 3px; margin-top: 3px; overflow: hidden; }
        #ep13 .ep-bar-fill { height: 100%; border-radius: 3px; }
        #ep13 .ep-divider  { height: 1px; background: ${T.border}; margin: 2px 0; }
        #ep13 .ep-total-row   { display: flex; justify-content: space-between; align-items: center; }
        #ep13 .ep-total-label { font-size: 12px; color: ${T.muted}; }
        #ep13 .ep-total-val   { font-size: 13px; font-weight: 600; color: ${T.text}; }

        #ep13 .ep-ring-card   { align-items: center; text-align: center; }
        #ep13 .ep-ring-wrap   { position: relative; display: flex; align-items: center; justify-content: center; width: 122px; height: 122px; flex-shrink: 0; }
        #ep13 .ep-ring-wrap svg { position: absolute; top: 0; left: 0; width: 122px; height: 122px; }
        #ep13 .ep-ring-center { position: relative; z-index: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; pointer-events: none; }
        #ep13 .ep-ring-pct    { font-size: 26px; font-weight: 700; letter-spacing: -0.5px; line-height: 1; }
        #ep13 .ep-ring-lbl    { font-size: 10px; color: ${T.muted}; letter-spacing: 0.8px; text-transform: uppercase; margin-top: 1px; }
        #ep13 .ep-stat-row    { display: flex; justify-content: space-between; width: 100%; }
        #ep13 .ep-stat-k      { font-size: 12px; color: ${T.muted}; }
        #ep13 .ep-stat-v      { font-size: 12px; font-weight: 600; color: ${T.text}; }
        #ep13 .ep-hint        { font-size: 12px; color: ${T.muted}; display: flex; align-items: center; gap: 4px; margin-top: 2px; }

        #ep13 .ep-buf-top { display: flex; align-items: center; gap: 8px; }
        #ep13 .ep-buf-val { font-size: 26px; font-weight: 800; letter-spacing: -1px; line-height: 1; }
        #ep13 .ep-buf-val.pos { color: #22c55e; }
        #ep13 .ep-buf-val.neg { color: #ef4444; }
        #ep13 .ep-buf-val.zer { color: ${T.muted}; }
        #ep13 .ep-buf-sub { font-size: 12px; color: ${T.muted}; line-height: 1.4; }

        #ep13 .ep-chip-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 6px; }
        #ep13 .ep-chip      { background: ${T.chipBg}; border: 1px solid ${T.border}; border-radius: 7px; padding: 7px 8px; text-align: center; }
        #ep13 .ep-chip-val  { font-size: 20px; font-weight: 700; line-height: 1; color: ${T.text}; }
        #ep13 .ep-chip-lbl  { font-size: 10px; color: ${T.muted}; text-transform: uppercase; letter-spacing: 0.8px; margin-top: 2px; }

        #ep13 .ep-prog-wrap  { width: 100%; }
        #ep13 .ep-prog-hdr   { display: flex; justify-content: space-between; font-size: 11px; color: ${T.muted}; margin-bottom: 4px; }
        #ep13 .ep-prog-track { height: 5px; background: ${T.barTrack}; border-radius: 5px; overflow: hidden; }
        #ep13 .ep-prog-fill  { height: 100%; border-radius: 5px; background: linear-gradient(90deg, #3b82f6, #a855f7); }

        #ep13 .ep-notice      { display: flex; align-items: center; gap: 5px; font-size: 12px; color: ${T.muted}; }
        #ep13 .ep-notice.warn { color: #ef4444; }
        #ep13 .ep-notice.good { color: #22c55e; }
        #ep13 .ep-notices     { display: flex; flex-direction: column; gap: 4px; }

        /* ── Today strip ── */
        #ep13 .ep-today-strip {
            margin-top: 10px;
            background: ${T.surface};
            border: 1px solid ${T.border};
            border-radius: 10px;
            padding: 10px 14px;
            display: flex; align-items: center; gap: 16px;
        }
        #ep13 .ep-today-label {
            display: flex; align-items: center; gap: 8px; flex-shrink: 0;
        }
        #ep13 .ep-today-label-text {
            font-size: 11px; font-weight: 700; letter-spacing: 1.1px;
            text-transform: uppercase; color: ${T.muted}; white-space: nowrap;
        }
        #ep13 .ep-today-centre {
            flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 6px;
        }
        #ep13 .ep-today-nums-row {
            display: flex; align-items: baseline; gap: 6px;
        }
        #ep13 .ep-today-done  { font-size: 20px; font-weight: 800; letter-spacing: -0.5px; line-height: 1; color: ${T.text}; }
        #ep13 .ep-today-sep   { font-size: 13px; color: ${T.muted}; }
        #ep13 .ep-today-total { font-size: 13px; color: ${T.muted}; }
        #ep13 .ep-today-rem   { font-size: 12px; color: ${T.muted}; margin-left: 6px; display: flex; align-items: center; gap: 4px; }
        #ep13 .ep-today-rem.done { color: #22c55e; }
        #ep13 .ep-today-track { height: 5px; background: ${T.barTrack}; border-radius: 5px; overflow: hidden; }
        #ep13 .ep-today-fill  { height: 100%; border-radius: 5px; transition: width 0.4s ease; }
        #ep13 .ep-today-actions { display: flex; align-items: center; gap: 6px; flex-shrink: 0; }

        /* toggle pill inside the buffer button */
        #ep13 .ep-toggle-track {
            display: inline-block; width: 28px; height: 16px; border-radius: 8px;
            position: relative; vertical-align: middle; flex-shrink: 0;
            transition: background 0.2s;
        }
        #ep13 .ep-toggle-thumb {
            position: absolute; width: 12px; height: 12px; background: #fff;
            border-radius: 50%; top: 2px;
            box-shadow: 0 1px 2px rgba(0,0,0,0.25);
            transition: left 0.2s;
        }

        /* ══ COMMUTE FORECASTER ══ */
        #ep13 .ep-commute-toggle {
            margin-top: 8px;
            display: flex; align-items: center; gap: 8px;
            padding: 8px 14px;
            background: ${T.surface};
            border: 1px solid ${T.border};
            border-radius: 10px;
            cursor: pointer;
            user-select: none;
            transition: background 0.15s;
        }
        #ep13 .ep-commute-toggle:hover {
            background: ${T.isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)'};
        }
        #ep13 .ep-commute-toggle-label {
            flex: 1;
            font-size: 12px; font-weight: 600; letter-spacing: 0.8px;
            text-transform: uppercase; color: ${T.muted};
        }
        #ep13 .ep-commute-toggle-sub {
            font-size: 11px; font-weight: 400; color: ${T.muted};
            opacity: 0.7; letter-spacing: 0; text-transform: none;
        }

        #ep13 .ep-commute-panel {
            overflow: hidden;
            max-height: 0;
            opacity: 0;
            transition: max-height 0.35s ease, opacity 0.25s ease, margin-top 0.25s ease;
            margin-top: 0;
        }
        #ep13 .ep-commute-panel.open {
            max-height: 600px;
            opacity: 1;
            margin-top: 8px;
        }
        #ep13 .ep-commute-inner {
            background: ${T.surface};
            border: 1px solid ${T.border};
            border-radius: 10px;
            padding: 14px 16px;
            display: flex; flex-direction: column; gap: 14px;
        }

        /* Controls row */
        #ep13 .ep-cmute-controls {
            display: flex; align-items: center; gap: 16px; flex-wrap: wrap;
        }
        #ep13 .ep-cmute-ctrl-group {
            display: flex; flex-direction: column; gap: 5px;
        }
        #ep13 .ep-cmute-ctrl-label {
            font-size: 10px; font-weight: 700; letter-spacing: 1px;
            text-transform: uppercase; color: ${T.muted};
        }

        /* Mode buttons */
        #ep13 .ep-mode-btns { display: flex; gap: 5px; }
        #ep13 .ep-mode-btn {
            display: inline-flex; align-items: center; gap: 5px;
            padding: 5px 10px; border-radius: 7px; cursor: pointer;
            border: 1px solid ${T.border};
            background: ${T.chipBg};
            font-size: 12px; font-weight: 500;
            color: ${T.muted};
            transition: all 0.15s;
            user-select: none;
        }
        #ep13 .ep-mode-btn:hover { color: ${T.text}; border-color: ${T.isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.18)'}; }
        #ep13 .ep-mode-btn.active {
            font-weight: 600;
            color: #fff;
        }

        /* Distance slider */
        #ep13 .ep-km-row { display: flex; align-items: center; gap: 10px; }
        #ep13 .ep-km-val {
            font-size: 18px; font-weight: 800; min-width: 44px;
            letter-spacing: -0.5px; color: ${T.text};
        }
        #ep13 .ep-km-unit { font-size: 11px; color: ${T.muted}; margin-top: 2px; }
        #ep13 input[type=range].ep-slider {
            -webkit-appearance: none; appearance: none;
            height: 4px; border-radius: 4px;
            background: ${T.barTrack};
            outline: none; cursor: pointer; flex: 1;
        }
        #ep13 input[type=range].ep-slider::-webkit-slider-thumb {
            -webkit-appearance: none; appearance: none;
            width: 14px; height: 14px; border-radius: 50%;
            background: #fff; border: 2px solid currentColor;
            cursor: pointer; transition: transform 0.15s;
        }
        #ep13 input[type=range].ep-slider:hover::-webkit-slider-thumb { transform: scale(1.2); }

        /* Stats grid */
        #ep13 .ep-cmute-stats {
            display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px;
        }
        #ep13 .ep-cmute-stat {
            background: ${T.chipBg}; border: 1px solid ${T.border};
            border-radius: 8px; padding: 9px 10px; text-align: center;
        }
        #ep13 .ep-cmute-stat-val {
            font-size: 18px; font-weight: 700; line-height: 1;
        }
        #ep13 .ep-cmute-stat-lbl {
            font-size: 10px; color: ${T.muted}; text-transform: uppercase;
            letter-spacing: 0.8px; margin-top: 3px;
        }

        /* Mode comparison bar */
        #ep13 .ep-cmute-compare { display: flex; flex-direction: column; gap: 7px; }
        #ep13 .ep-cmute-cmp-row { display: flex; align-items: center; gap: 8px; }
        #ep13 .ep-cmute-cmp-icon { flex-shrink: 0; }
        #ep13 .ep-cmute-cmp-label { font-size: 12px; font-weight: 600; color: ${T.text}; min-width: 44px; }
        #ep13 .ep-cmute-cmp-bar-wrap { flex: 1; height: 6px; background: ${T.barTrack}; border-radius: 4px; overflow: hidden; }
        #ep13 .ep-cmute-cmp-bar { height: 100%; border-radius: 4px; transition: width 0.4s ease; }
        #ep13 .ep-cmute-cmp-time { font-size: 12px; color: ${T.muted}; min-width: 50px; text-align: right; font-weight: 500; }

        /* Insight box */
        #ep13 .ep-cmute-insight {
            display: flex; align-items: flex-start; gap: 8px;
            padding: 10px 12px;
            background: ${T.isDark ? 'rgba(59,130,246,0.08)' : 'rgba(59,130,246,0.06)'};
            border: 1px solid ${T.isDark ? 'rgba(59,130,246,0.18)' : 'rgba(59,130,246,0.14)'};
            border-radius: 8px;
            font-size: 12px; color: ${T.text}; line-height: 1.55;
        }
        #ep13 .ep-cmute-insight strong { color: #3b82f6; }

        /* ── Schedule Planner ── */
        #ep13 .ep-sched-section { display: flex; flex-direction: column; gap: 10px; }
        #ep13 .ep-sched-hdr {
            display: flex; align-items: center; gap: 6px;
            font-size: 10px; font-weight: 700; letter-spacing: 1px;
            text-transform: uppercase; color: ${T.muted};
        }

        /* Legend */
        #ep13 .ep-sched-legend {
            display: flex; gap: 12px; flex-wrap: wrap;
        }
        #ep13 .ep-sched-leg-item {
            display: flex; align-items: center; gap: 5px;
            font-size: 11px; color: ${T.muted};
        }
        #ep13 .ep-sched-leg-dot {
            width: 10px; height: 10px; border-radius: 3px; flex-shrink: 0;
        }

        /* Calendar grid */
        #ep13 .ep-cal-grid {
            display: grid;
            grid-template-columns: repeat(7, 1fr);
            gap: 3px;
        }
        #ep13 .ep-cal-dow {
            font-size: 9px; font-weight: 700; letter-spacing: 0.8px;
            text-transform: uppercase; color: ${T.muted};
            text-align: center; padding: 2px 0 4px;
        }
        #ep13 .ep-cal-day {
            aspect-ratio: 1;
            border-radius: 5px;
            display: flex; align-items: center; justify-content: center;
            font-size: 11px; font-weight: 600;
            position: relative;
            transition: transform 0.1s;
        }
        #ep13 .ep-cal-day.ep-cal-empty     { background: transparent; }
        #ep13 .ep-cal-day.ep-cal-weekend   { background: ${T.chipBg}; color: ${T.muted}; opacity: 0.4; }
        #ep13 .ep-cal-day.ep-cal-absent    { background: ${T.chipBg}; color: ${T.muted}; opacity: 0.5; }
        #ep13 .ep-cal-day.ep-cal-done-off  { background: rgba(34,197,94,0.18); color: #22c55e; border: 1px solid rgba(34,197,94,0.3); }
        #ep13 .ep-cal-day.ep-cal-done-wfh  { background: rgba(168,85,247,0.15); color: #a855f7; border: 1px solid rgba(168,85,247,0.25); }
        #ep13 .ep-cal-day.ep-cal-done-any  { background: rgba(100,116,139,0.15); color: ${T.muted}; }
        #ep13 .ep-cal-day.ep-cal-plan-off  { background: rgba(59,130,246,0.18); color: #3b82f6; border: 1px solid rgba(59,130,246,0.35); }
        #ep13 .ep-cal-day.ep-cal-plan-wfh  { background: ${T.chipBg}; color: ${T.muted}; border: 1px solid ${T.border}; }
        #ep13 .ep-cal-day.ep-cal-today     { outline: 2px solid #f59e0b; outline-offset: 1px; }
        #ep13 .ep-cal-day .ep-cal-dot {
            position: absolute; bottom: 2px; left: 50%; transform: translateX(-50%);
            width: 4px; height: 4px; border-radius: 50%;
        }

        /* Week rows */
        #ep13 .ep-week-rows { display: flex; flex-direction: column; gap: 5px; }
        #ep13 .ep-week-row {
            display: flex; align-items: center; gap: 6px;
        }
        #ep13 .ep-week-label {
            font-size: 10px; color: ${T.muted}; font-weight: 600;
            min-width: 30px; letter-spacing: 0.5px;
        }
        #ep13 .ep-week-days { display: flex; gap: 3px; flex: 1; }
        #ep13 .ep-week-day-pill {
            flex: 1; padding: 4px 2px; border-radius: 5px;
            text-align: center; font-size: 10px; font-weight: 700;
            letter-spacing: 0.3px;
        }
        #ep13 .ep-week-day-pill.ep-wp-office  { background: rgba(59,130,246,0.2); color: #3b82f6; }
        #ep13 .ep-week-day-pill.ep-wp-done    { background: rgba(34,197,94,0.18); color: #22c55e; }
        #ep13 .ep-week-day-pill.ep-wp-wfh     { background: ${T.chipBg}; color: ${T.muted}; }
        #ep13 .ep-week-day-pill.ep-wp-off     { background: transparent; color: ${T.muted}; opacity: 0.35; }
        #ep13 .ep-week-day-pill.ep-wp-absent  { background: ${T.chipBg}; color: ${T.muted}; opacity: 0.4; font-size: 9px; }
        #ep13 .ep-week-row-summary {
            font-size: 11px; color: ${T.muted}; min-width: 80px; text-align: right;
        }
        #ep13 .ep-week-row-summary span { color: ${T.text}; font-weight: 600; }
        `;
    };

    /* ═══════════════════════════════════════════════════════════════
       THEME STATE
    ═══════════════════════════════════════════════════════════════ */

    const THEME_KEY     = 'ep-theme-override';
    const TODAY_BUF_KEY = 'ep-today-buffer';
    let themeOverride   = localStorage.getItem(THEME_KEY) || null;

    const getTheme = () => {
        if (themeOverride === 'dark') return {
            isDark: true,
            bg: '#181818', surface: '#242424', border: 'rgba(255,255,255,0.08)',
            text: '#e8e8e8', muted: '#888888', faint: 'rgba(255,255,255,0.04)',
            barTrack: 'rgba(255,255,255,0.07)', chipBg: 'rgba(255,255,255,0.03)',
            shadow: '0 4px 24px rgba(0,0,0,0.4)', ringTrack: 'rgba(255,255,255,0.12)',
        };
        if (themeOverride === 'light') return {
            isDark: false,
            bg: '#ffffff', surface: '#f7f7f7', border: 'rgba(0,0,0,0.08)',
            text: '#111827', muted: '#6b7280', faint: 'rgba(0,0,0,0.03)',
            barTrack: 'rgba(0,0,0,0.07)', chipBg: 'rgba(0,0,0,0.03)',
            shadow: '0 2px 12px rgba(0,0,0,0.10)', ringTrack: 'rgba(0,0,0,0.12)',
        };
        return buildTheme();
    };

    /* ═══════════════════════════════════════════════════════════════
       ACTIVITY CONFIG
    ═══════════════════════════════════════════════════════════════ */

    const ACT_CFG = {
        'Office':          { icon: 'office',  grad: 'linear-gradient(135deg,#3b82f6,#06b6d4)', bg: '#1d4ed8' },
        'Mobile Working':  { icon: 'laptop',  grad: 'linear-gradient(135deg,#ec4899,#f97316)', bg: '#9d174d' },
        'Business Travel': { icon: 'flight',  grad: 'linear-gradient(135deg,#a855f7,#7c3aed)', bg: '#6b21a8' },
        'No Activity':     { icon: 'block',   grad: 'linear-gradient(135deg,#374151,#111827)', bg: '#374151' },
    };
    const FALLBACK_CFG = { icon: 'timer', grad: 'linear-gradient(135deg,#64748b,#334155)', bg: '#475569' };

    /* ═══════════════════════════════════════════════════════════════
       BUILD SCHEDULE PLANNER HTML
    ═══════════════════════════════════════════════════════════════ */

    const buildScheduleSection = ({ T, days, officeDaysNeeded, alreadyDoneOffice }) => {
        const officeStillNeeded = Math.max(0, officeDaysNeeded - alreadyDoneOffice);
        const plannedDates      = buildSchedulePlan({ days, officeStillNeeded });

        // ── Legend ──
        let html = `<div class="ep-sched-section">
        <div class="ep-sched-hdr">
            ${icon('calendar', 12, T.muted)}
            Office Schedule Plan · ${officeDaysNeeded} days needed &nbsp;·&nbsp;
            ${alreadyDoneOffice} done &nbsp;·&nbsp; ${officeStillNeeded} to go
        </div>
        <div class="ep-sched-legend">
            <div class="ep-sched-leg-item"><div class="ep-sched-leg-dot" style="background:#22c55e;"></div>Office done</div>
            <div class="ep-sched-leg-item"><div class="ep-sched-leg-dot" style="background:#3b82f6;"></div>Plan: office</div>
            <div class="ep-sched-leg-item"><div class="ep-sched-leg-dot" style="background:#a855f7;"></div>WFH done</div>
            <div class="ep-sched-leg-item"><div class="ep-sched-leg-dot" style="background:${T.isDark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.12)'};"></div>WFH / flex</div>
            <div class="ep-sched-leg-item"><div class="ep-sched-leg-dot" style="background:${T.isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'};"></div>Absent / W/E</div>
        </div>`;

        // ── Calendar grid ──
        // Figure out what weekday the first day of the month is so we can offset
        const firstDay = days.find(d => !d.isWeekend);
        const firstDate = days[0];

        // Build a 7-column grid (Mon–Sun header)
        const DOW_LABELS = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
        html += `<div class="ep-cal-grid">`;

        // Header row
        DOW_LABELS.forEach(d => html += `<div class="ep-cal-dow">${d}</div>`);

        // Find the dayOfWeek of the first entry to know offset (Mon=1 → col 0, Sat=6 → col 5, Sun=0 → col 6)
        const firstDow = days[0]?.dayOfWeek ?? 1; // Mon=1
        const colOffset = firstDow === 0 ? 6 : firstDow - 1; // Mon-based offset

        // Empty cells before day 1
        for (let i = 0; i < colOffset; i++) {
            html += `<div class="ep-cal-day ep-cal-empty"></div>`;
        }

        // Day cells
        days.forEach(d => {
            let cls = 'ep-cal-day ';
            if (d.isWeekend)          cls += 'ep-cal-weekend';
            else if (d.isAbsent || d.isHoliday) cls += 'ep-cal-absent';
            else if (d.hasOffice)     cls += 'ep-cal-done-off';
            else if (d.hasWFH && (d.isPast || d.isToday)) cls += 'ep-cal-done-wfh';
            else if (d.isPast || d.isToday) cls += 'ep-cal-done-any';
            else if (plannedDates.has(d.dateNum)) cls += 'ep-cal-plan-off';
            else if (d.isFuture)      cls += 'ep-cal-plan-wfh';
            else                       cls += 'ep-cal-plan-wfh';

            if (d.isToday) cls += ' ep-cal-today';

            html += `<div class="${cls}" title="${d.label}">${d.dateNum}</div>`;
        });

        html += `</div>`; // end calendar grid

        // ── Week-by-week breakdown ──
        // Group days into Mon–Fri calendar weeks
        const weekBuckets = new Map();
        days.forEach(d => {
            if (d.isWeekend) return;
            const wk = Math.floor((d.dateNum - 1) / 7);
            if (!weekBuckets.has(wk)) weekBuckets.set(wk, []);
            weekBuckets.get(wk).push(d);
        });

        html += `<div class="ep-week-rows">`;
        const DNAMES = { 1:'Mon', 2:'Tue', 3:'Wed', 4:'Thu', 5:'Fri' };
        let weekNum = 0;
        weekBuckets.forEach((wdays) => {
            weekNum++;
            const offDone  = wdays.filter(d => d.hasOffice).length;
            const planned  = wdays.filter(d => plannedDates.has(d.dateNum)).length;
            const wfhDone  = wdays.filter(d => d.hasWFH && !d.hasOffice && (d.isPast || d.isToday)).length;

            // Build 5-slot row Mon→Fri
            const slotMap = new Map(wdays.map(d => [d.dayOfWeek, d]));
            html += `<div class="ep-week-row">
                <div class="ep-week-label">W${weekNum}</div>
                <div class="ep-week-days">`;

            [1,2,3,4,5].forEach(dow => {
                const d = slotMap.get(dow);
                if (!d) {
                    html += `<div class="ep-week-day-pill ep-wp-off">—</div>`;
                    return;
                }
                let cls = 'ep-week-day-pill ';
                let label = DNAMES[dow];
                if (d.isAbsent || d.isHoliday) { cls += 'ep-wp-absent'; label = 'abs'; }
                else if (d.hasOffice)           { cls += 'ep-wp-done'; }
                else if (plannedDates.has(d.dateNum)) { cls += 'ep-wp-office'; }
                else if (d.hasWFH)              { cls += 'ep-wp-wfh'; }
                else if (d.isFuture || d.isToday) { cls += 'ep-wp-wfh'; }
                else                            { cls += 'ep-wp-wfh'; }
                html += `<div class="${cls}" title="${d.label}">${label}</div>`;
            });

            const offTotal = offDone + planned;
            html += `</div>
                <div class="ep-week-row-summary">
                    <span>${offTotal}</span>/${wdays.length} in office
                </div>
            </div>`;
        });

        html += `</div>`; // end week rows

        // ── Summary stat: efficiency ──
        const totalWorkable   = days.filter(d => d.isWorkable).length;
        const totalPlanned    = plannedDates.size + alreadyDoneOffice;
        const totalWFH        = totalWorkable - totalPlanned;
        const pctOffice       = totalWorkable > 0 ? Math.round((totalPlanned / totalWorkable) * 100) : 0;

        html += `<div style="display:flex;gap:8px;flex-wrap:wrap;">
            <div class="ep-cmute-stat" style="flex:1;min-width:80px;">
                <div class="ep-cmute-stat-val" style="color:#22c55e;">${alreadyDoneOffice}d</div>
                <div class="ep-cmute-stat-lbl">Done ✓</div>
            </div>
            <div class="ep-cmute-stat" style="flex:1;min-width:80px;">
                <div class="ep-cmute-stat-val" style="color:#3b82f6;">${plannedDates.size}d</div>
                <div class="ep-cmute-stat-lbl">Planned</div>
            </div>
            <div class="ep-cmute-stat" style="flex:1;min-width:80px;">
                <div class="ep-cmute-stat-val" style="color:#a855f7;">${totalWFH}d</div>
                <div class="ep-cmute-stat-lbl">WFH / Flex</div>
            </div>
            <div class="ep-cmute-stat" style="flex:1;min-width:80px;">
                <div class="ep-cmute-stat-val" style="color:${pctOffice >= offTarget ? '#22c55e' : '#f59e0b'};">${pctOffice}%</div>
                <div class="ep-cmute-stat-lbl">Month target</div>
            </div>
        </div>`;

        html += `</div>`; // end ep-sched-section
        return html;
    };

    /* ═══════════════════════════════════════════════════════════════
       BUILD COMMUTE FORECASTER HTML
    ═══════════════════════════════════════════════════════════════ */

    const buildCommutePanel = ({ T, summary, ds, days }) => {
        const km        = parseInt(localStorage.getItem(COMMUTE_KM_KEY) || '5', 10);
        const mode      = localStorage.getItem(COMMUTE_MODE_KEY) || 'car';
        const isOpen    = localStorage.getItem(COMMUTE_OPEN_KEY) === 'true';

        const realRota          = ds.realRota;
        // office days required this month to hit the target
        const requiredOfficeMins = realRota * (offTarget / 100);
        const officeDaysNeeded  = Math.ceil(requiredOfficeMins / 480);
        const workable          = ds.workableDays;
        const officeDaysPerMonth = Math.min(officeDaysNeeded, workable);

        // Already-done office days (past + today)
        const alreadyDoneOffice = days.filter(d =>
            d.hasOffice && (d.isPast || d.isToday)
        ).length;

        const stats = calcCommute({ km, mode, officeDaysPerMonth, workableDays: workable });

        const modeCfg  = TRANSPORT_MODES[mode];

        // Build comparison bars — all 3 modes at current km
        const allModeStats = Object.entries(TRANSPORT_MODES).map(([key, cfg]) => {
            const s = calcCommute({ km, mode: key, officeDaysPerMonth, workableDays: workable });
            return { key, cfg, ...s };
        });
        const maxMonthlyMins = Math.max(...allModeStats.map(m => m.monthlyCommuteMins));

        // Insight text
        const savedHours = (stats.timeSavedVsAllOffice / 60).toFixed(1);
        const insightText = buildInsightText({ stats, mode, km, officeDaysPerMonth, workable, savedHours, modeCfg });

        /* ── Toggle header ── */
        let html = `
        <div class="ep-commute-toggle" data-action="commute-toggle" role="button" tabindex="0" aria-expanded="${isOpen}">
            ${iconBadge('map_pin', 'linear-gradient(135deg,#f97316,#a855f7)', 26)}
            <span class="ep-commute-toggle-label">
                Commute Forecaster
                <span class="ep-commute-toggle-sub"> · Iulius Mall UBC1, Timișoara</span>
            </span>
            ${icon(isOpen ? 'chevron_up' : 'chevron_down', 14, T.muted)}
        </div>
        <div class="ep-commute-panel${isOpen ? ' open' : ''}" id="ep-commute-panel">
        <div class="ep-commute-inner">`;

        /* ── Controls ── */
        html += `<div class="ep-cmute-controls">`;

        // Mode selector
        html += `<div class="ep-cmute-ctrl-group">
            <div class="ep-cmute-ctrl-label">Transport</div>
            <div class="ep-mode-btns">`;
        Object.entries(TRANSPORT_MODES).forEach(([key, cfg]) => {
            const active = key === mode;
            html += `<span class="ep-mode-btn${active ? ' active' : ''}"
                style="${active ? `background:${cfg.grad};border-color:transparent;` : ''}"
                data-action="commute-mode" data-mode="${key}">
                ${icon(cfg.icon, 13, active ? '#fff' : T.muted)}
                ${cfg.label}
            </span>`;
        });
        html += `</div></div>`;

        // Distance slider
        html += `<div class="ep-cmute-ctrl-group" style="flex:1;min-width:180px;">
            <div class="ep-cmute-ctrl-label">Distance from office</div>
            <div class="ep-km-row">
                <div>
                    <span class="ep-km-val" id="ep-km-display">${km}</span>
                    <span class="ep-km-unit"> km</span>
                </div>
                <input type="range" class="ep-slider" id="ep-km-slider"
                    min="1" max="25" step="1" value="${km}"
                    style="color:${modeCfg.color};">
            </div>
        </div>`;

        html += `</div>`; // end controls

        /* ── Stats chips ── */
        html += `<div class="ep-cmute-stats">
            <div class="ep-cmute-stat">
                <div class="ep-cmute-stat-val" style="color:${modeCfg.color};">${stats.oneWayMins}m</div>
                <div class="ep-cmute-stat-lbl">One Way</div>
            </div>
            <div class="ep-cmute-stat">
                <div class="ep-cmute-stat-val" style="color:${modeCfg.color};">${stats.roundTripMins}m</div>
                <div class="ep-cmute-stat-lbl">Round Trip / Day</div>
            </div>
            <div class="ep-cmute-stat">
                <div class="ep-cmute-stat-val" style="color:${modeCfg.color};">${officeDaysPerMonth}d</div>
                <div class="ep-cmute-stat-lbl">Office Days Needed</div>
            </div>
            <div class="ep-cmute-stat">
                <div class="ep-cmute-stat-val" style="color:${modeCfg.color};">${fmt(stats.monthlyCommuteMins)}</div>
                <div class="ep-cmute-stat-lbl">Monthly Commute</div>
            </div>
        </div>`;

        /* ── Mode comparison ── */
        html += `<div>
            <div class="ep-cmute-ctrl-label" style="margin-bottom:8px;">All-Mode Comparison · monthly commute at ${km} km</div>
            <div class="ep-cmute-compare">`;
        allModeStats.forEach(({ key, cfg, monthlyCommuteMins, oneWayMins }) => {
            const barPct = maxMonthlyMins > 0 ? (monthlyCommuteMins / maxMonthlyMins) * 100 : 0;
            const isActive = key === mode;
            html += `<div class="ep-cmute-cmp-row">
                <div class="ep-cmute-cmp-icon">${icon(cfg.icon, 14, cfg.color)}</div>
                <div class="ep-cmute-cmp-label" style="color:${isActive ? cfg.color : T.text}">${cfg.label}</div>
                <div class="ep-cmute-cmp-bar-wrap">
                    <div class="ep-cmute-cmp-bar" style="width:${barPct.toFixed(1)}%;background:${cfg.grad};${isActive ? '' : 'opacity:0.5;'}"></div>
                </div>
                <div class="ep-cmute-cmp-time">${fmt(monthlyCommuteMins)}</div>
            </div>`;
        });
        html += `</div></div>`;

        /* ── Insight ── */
        html += `<div class="ep-cmute-insight">
            ${icon('lightbulb', 14, '#3b82f6')}
            <div>${insightText}</div>
        </div>`;

        /* ── Schedule Planner ── */
        html += `<div class="ep-divider"></div>`;
        html += buildScheduleSection({
            T, days,
            officeDaysNeeded: officeDaysPerMonth,
            alreadyDoneOffice,
        });

        html += `</div></div>`; // close inner + panel

        return html;
    };

    const buildInsightText = ({ stats, mode, km, officeDaysPerMonth, workable, savedHours, modeCfg }) => {
        const wfhDays = workable - officeDaysPerMonth;
        const modeLabel = modeCfg.label.toLowerCase();

        // Clustered office days advice
        // Recommend clustering e.g. Mon-Tue-Wed to minimise frequency-related costs
        const daysPerWeek = stats.daysPerWeek;
        const clusterTip = daysPerWeek <= 3
            ? `Clustering your <strong>${officeDaysPerMonth} office days</strong> into <strong>${Math.ceil(daysPerWeek)} consecutive days per week</strong> minimises context-switching and commute overhead.`
            : `Your office requirement is high — aim to group days back-to-back to reduce transition time.`;

        // Time efficiency
        const timeCost = stats.roundTripMins;
        let efficiencyTip = '';
        if (timeCost >= 90) {
            efficiencyTip = ` At <strong>${timeCost}m/day</strong> round-trip by ${modeLabel}, commuting costs you <strong>${fmt(stats.monthlyCommuteMins)}</strong> this month — consider a closer pickup/drop-off point or carpooling.`;
        } else if (timeCost >= 45) {
            efficiencyTip = ` At <strong>${timeCost}m/day</strong> round-trip, your ${modeLabel} commute is moderate — <strong>${fmt(stats.monthlyCommuteMins)}</strong> total this month.`;
        } else {
            efficiencyTip = ` Your short <strong>${timeCost}m/day</strong> round-trip makes ${modeLabel} a great choice — only <strong>${fmt(stats.monthlyCommuteMins)}</strong> lost this month.`;
        }

        // WFH savings
        const savingsTip = wfhDays > 0
            ? ` Working from home <strong>${wfhDays} days</strong> saves you approximately <strong>${fmt(stats.timeSavedVsAllOffice)}</strong> vs a full office month.`
            : '';

        return clusterTip + efficiencyTip + savingsTip;
    };

    /* ═══════════════════════════════════════════════════════════════
       BIND INTERACTIONS
    ═══════════════════════════════════════════════════════════════ */

    const bindInteractions = (container) => {
        container.querySelectorAll('[data-action]').forEach(el => {
            el.addEventListener('click', (e) => {
                e.preventDefault();
                const action = el.dataset.action;

                if (action === 'jump-today')    { jumpToToday(); }
                if (action === 'jump-analyzer') { jumpToAnalyzer(); }

                if (action === 'theme-toggle') {
                    themeOverride = el.dataset.theme;
                    localStorage.setItem(THEME_KEY, themeOverride);
                    renderUI();
                    injectBackButton(getTheme());
                }

                if (action === 'buf-toggle') {
                    const cur = localStorage.getItem(TODAY_BUF_KEY) === 'true';
                    localStorage.setItem(TODAY_BUF_KEY, String(!cur));
                    renderUI();
                    injectBackButton(getTheme());
                }

                if (action === 'commute-toggle') {
                    const cur = localStorage.getItem(COMMUTE_OPEN_KEY) === 'true';
                    localStorage.setItem(COMMUTE_OPEN_KEY, String(!cur));
                    renderUI();
                    injectBackButton(getTheme());
                }

                if (action === 'commute-mode') {
                    localStorage.setItem(COMMUTE_MODE_KEY, el.dataset.mode);
                    renderUI();
                    injectBackButton(getTheme());
                }
            });
        });

        // Slider — live update without full re-render for smoothness
        const slider = container.querySelector('#ep-km-slider');
        if (slider) {
            const display = container.querySelector('#ep-km-display');
            slider.addEventListener('input', () => {
                if (display) display.textContent = slider.value;
            });
            slider.addEventListener('change', () => {
                localStorage.setItem(COMMUTE_KM_KEY, slider.value);
                renderUI();
                injectBackButton(getTheme());
            });
        }
    };

    /* ═══════════════════════════════════════════════════════════════
       RENDER
    ═══════════════════════════════════════════════════════════════ */

    const renderUI = () => {
        const T = getTheme();
        injectStyles(T);

        const mainPanel = document.getElementById('mainTimesheetPanel');
        if (!mainPanel) return;

        let container = document.getElementById('ep13');
        if (!container) {
            container = document.createElement('div');
            container.id = 'ep13';
            mainPanel.insertBefore(container, mainPanel.firstChild);
        }

        const summary  = getSummaryData();
        const { actMap, rawTotal, workedDays } = getActivityData();

        if (!summary.recorded || !rawTotal) {
            container.innerHTML = `<div class="ep-hdr">
                <div class="ep-hdr-logo">${icon('timer', 16)}</div>
                <div class="ep-hdr-title">eDays Analyzer Pro</div>
                <div class="ep-hdr-date"><span class="ep-pulse"></span> Loading…</div>
            </div>`;
            return;
        }

        const realRota     = summary.rota - summary.absences - summary.holidays;
        const factor       = summary.recorded / rawTotal;
        const acts         = Object.entries(actMap)
            .map(([name, mins]) => ({ name, adj: Math.floor(mins * factor) }))
            .filter(a => a.adj > 0)
            .sort((a, b) => b.adj - a.adj);

        const totalActMins = acts.reduce((s, a) => s + a.adj, 0);
        const officeEntry  = acts.find(a => a.name === 'Office');
        const officeMins   = officeEntry ? officeEntry.adj : 0;
        const targetMins   = realRota * (offTarget / 100);
        const officePct    = targetMins > 0 ? (officeMins / targetMins) * 100 : 0;
        const officeActPct = realRota   > 0 ? (officeMins / realRota)   * 100 : 0;
        const rotaPct      = realRota   > 0 ? (summary.recorded / realRota) * 100 : 0;
        const ds           = getDayStats(summary);

        const now          = new Date();
        const dateStr      = now.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }).toUpperCase();
        const offColor     = getOffColor(officePct);
        const rotaColor    = rotaPct >= 100 ? '#22c55e' : rotaPct >= 80 ? '#3b82f6' : '#f59e0b';
        const offRing      = ring({ r: 54, pct: officePct, color: offColor,  sw: 6, trackColor: T.ringTrack });
        const rotaRing     = ring({ r: 54, pct: rotaPct,   color: rotaColor, sw: 6, trackColor: T.ringTrack });
        const todayOnPage  = hasTodayOnPage();
        const nextTheme    = T.isDark ? 'light' : 'dark';
        const toggleIcon   = T.isDark ? 'sun' : 'moon';
        const toggleTitle  = T.isDark ? 'Switch to light theme' : 'Switch to dark theme';

        /* ── HEADER ── */
        let html = `
        <div class="ep-hdr">
            <div class="ep-hdr-logo">${icon('timer', 16)}</div>
            <div class="ep-hdr-title">eDays Analyzer Pro</div>
            <div class="ep-hdr-right">
                <span class="ep-btn ep-btn-icon" role="button" tabindex="0" data-action="theme-toggle" data-theme="${nextTheme}" title="${toggleTitle}">
                    ${icon(toggleIcon, 14, T.muted)}
                </span>
                <div class="ep-hdr-date"><span class="ep-pulse"></span>${dateStr}</div>
            </div>
        </div>
        <div class="ep-grid">`;

        /* ══ CARD 1 · Activity Breakdown ══ */
        const totalActPct = realRota > 0 ? (totalActMins / realRota) * 100 : 0;
        html += `<div class="ep-card"><div class="ep-card-title">Activity Breakdown</div>`;
        acts.forEach(({ name, adj }) => {
            const cfg = ACT_CFG[name] || FALLBACK_CFG;
            const pct = realRota > 0 ? (adj / realRota) * 100 : 0;
            html += `<div class="ep-act-row">
                ${iconBadge(cfg.icon, cfg.bg, 26)}
                <div class="ep-act-info">
                    <div class="ep-act-name">${name}</div>
                    <div class="ep-act-meta">${fmt(adj)} &nbsp;·&nbsp; ${pct.toFixed(1)}%</div>
                    <div class="ep-bar"><div class="ep-bar-fill" style="width:${clamp(pct,0,100)}%;background:${cfg.grad};"></div></div>
                </div>
            </div>`;
        });
        html += `<div class="ep-divider"></div>
            <div class="ep-total-row">
                <span class="ep-total-label">Total logged</span>
                <span class="ep-total-val">${fmt(totalActMins)} (${totalActPct.toFixed(1)}%) / ${fmt(realRota)} (100%)</span>
            </div>
            <div class="ep-bar"><div class="ep-bar-fill" style="width:${clamp(totalActPct,0,100)}%;background:linear-gradient(90deg,#3b82f6,#a855f7);"></div></div>
        </div>`;

        /* ══ CARD 2 · Office Target ══ */
        const offRemaining = Math.max(0, targetMins - officeMins);
        const offRemD = Math.floor(offRemaining / 480);
        const offRemH = Math.floor((offRemaining % 480) / 60);
        const offRemM = offRemaining % offTarget;
        html += `<div class="ep-card ep-ring-card">
            <div class="ep-card-title">Office Target · ${offTarget}%</div>
            <div class="ep-ring-wrap">
                ${offRing}
                <div class="ep-ring-center">
                    <span class="ep-ring-pct" style="color:${offColor}">${officePct.toFixed(0)}%</span>
                    <span class="ep-ring-lbl">of target</span>
                </div>
            </div>
            <div class="ep-stat-row"><span class="ep-stat-k">Actual</span><span class="ep-stat-v">${officeActPct.toFixed(1)}% of rota</span></div>
            <div class="ep-stat-row"><span class="ep-stat-k">Logged</span><span class="ep-stat-v">${fmt(officeMins)}</span></div>
            <div class="ep-stat-row"><span class="ep-stat-k">Target</span><span class="ep-stat-v">${fmt(targetMins)}</span></div>
            ${officePct < 100
                ? `<div class="ep-hint">${icon('today', 12, T.muted)}<span>${offRemD > 0 ? offRemD + 'd ' : ''}${offRemH}h${offRemM ? ' ' + offRemM + 'm' : ''} to hit ${offTarget}%</span></div>`
                : `<div class="ep-hint" style="color:#22c55e">${icon('check', 12, '#22c55e')}<span>Office target met!</span></div>`}
        </div>`;

        /* ══ CARD 3 · Time vs Rota ══ */
        html += `<div class="ep-card ep-ring-card">
            <div class="ep-card-title">Time vs Rota</div>
            <div class="ep-ring-wrap">
                ${rotaRing}
                <div class="ep-ring-center">
                    <span class="ep-ring-pct" style="color:${rotaColor}">${rotaPct.toFixed(0)}%</span>
                    <span class="ep-ring-lbl">rota</span>
                </div>
            </div>
            <div class="ep-stat-row"><span class="ep-stat-k">Recorded</span><span class="ep-stat-v">${fmt(summary.recorded)}</span></div>
            <div class="ep-stat-row"><span class="ep-stat-k">Real Rota</span><span class="ep-stat-v">${fmt(realRota)}</span></div>
            <div class="ep-stat-row"><span class="ep-stat-k">Absences</span><span class="ep-stat-v">${fmt(summary.absences)}</span></div>
            <div class="ep-stat-row"><span class="ep-stat-k">Holidays</span><span class="ep-stat-v">${fmt(summary.holidays)}</span></div>
            <div class="ep-stat-row"><span class="ep-stat-k">Days worked</span><span class="ep-stat-v">${workedDays}d</span></div>
        </div>`;

        /* ══ CARD 4 · Buffer & Outlook ══ */
        const bufClass = ds.bufferMinutes > 0 ? 'pos' : ds.bufferMinutes < 0 ? 'neg' : 'zer';
        const bufIcon  = ds.bufferMinutes > 0 ? 'trending_up' : ds.bufferMinutes < 0 ? 'trending_down' : 'trending_flat';
        const bufColor = ds.bufferMinutes > 0 ? '#22c55e' : ds.bufferMinutes < 0 ? '#ef4444' : T.muted;
        html += `<div class="ep-card">
            <div class="ep-card-title">Buffer &amp; Outlook</div>
            <div class="ep-buf-top">
                ${icon(bufIcon, 20, bufColor)}
                <span class="ep-buf-val ${bufClass}">${fmt(ds.bufferMinutes)}</span>
                <span class="ep-buf-sub">${ds.bufferMinutes >= 0 ? 'ahead of' : 'behind'} daily target<br>vs past days</span>
            </div>
            <div class="ep-chip-grid">
                <div class="ep-chip"><div class="ep-chip-val">${ds.workableDays}</div><div class="ep-chip-lbl">Workable</div></div>
                <div class="ep-chip"><div class="ep-chip-val" style="color:#3b82f6">${ds.soFar}</div><div class="ep-chip-lbl">So Far</div></div>
                <div class="ep-chip"><div class="ep-chip-val" style="color:#a855f7">${ds.daysLeft}</div><div class="ep-chip-lbl">Days Left</div></div>
                <div class="ep-chip"><div class="ep-chip-val" style="color:#f59e0b">${ds.workedDays}</div><div class="ep-chip-lbl">Worked</div></div>
            </div>
            <div class="ep-prog-wrap">
                <div class="ep-prog-hdr"><span>Month progress</span><span>${ds.progressPct.toFixed(0)}%</span></div>
                <div class="ep-prog-track"><div class="ep-prog-fill" style="width:${clamp(ds.progressPct, 0, 100).toFixed(1)}%"></div></div>
            </div>
            <div class="ep-notices">
                ${ds.daysLeft > 0 ? `<div class="ep-notice">${icon('calendar', 12, T.muted)}<span>${ds.daysLeft}d left · ${fmt(ds.daysLeft * 480)} remaining</span></div>` : ''}
                ${ds.bufferMinutes > 0
                    ? `<div class="ep-notice good">${icon('savings', 12, '#22c55e')}<span>${fmt(ds.bufferMinutes)} banked above daily target</span></div>`
                    : ds.bufferMinutes < 0
                        ? `<div class="ep-notice warn">${icon('warning', 12, '#ef4444')}<span>${fmt(Math.abs(ds.bufferMinutes))} deficit vs past days</span></div>`
                        : `<div class="ep-notice">${icon('flag', 12, T.muted)}<span>Exactly on target!</span></div>`}
                <div class="ep-notice">${icon('flag', 12, T.muted)}<span>Month target: ${fmt(ds.realRota)}</span></div>
            </div>
        </div>`;

        html += `</div>`; // close .ep-grid

        /* ══ TODAY STRIP ══ */
        const todayBufOn      = localStorage.getItem(TODAY_BUF_KEY) === 'true';
        const todayWorked     = getTodayMinutes();
        const dailyTarget     = 480;
        const effectiveTarget = todayBufOn ? Math.max(0, dailyTarget - ds.bufferMinutes) : dailyTarget;
        const todayRemaining  = Math.max(0, effectiveTarget - todayWorked);
        const todayPct        = effectiveTarget > 0 ? Math.min(100, (todayWorked / effectiveTarget) * 100) : 0;
        const todayDone       = todayWorked >= effectiveTarget;
        const todayBarColor   = todayDone ? '#22c55e' : '#3b82f6';

        const remMarkup = todayDone
            ? `<span class="ep-today-rem done">${icon('check', 12, '#22c55e')} Day complete!</span>`
            : `<span class="ep-today-rem">${icon('timer', 12, T.muted)} ${fmt(todayRemaining)} left</span>`;

        html += `
        <div class="ep-today-strip">
            <div class="ep-today-label">
                ${iconBadge('timer', '#1d4ed8', 26)}
                <span class="ep-today-label-text">Today</span>
            </div>

            <div class="ep-today-centre">
                <div class="ep-today-nums-row">
                    <span class="ep-today-done">${fmt(todayWorked)}</span>
                    <span class="ep-today-sep">/</span>
                    <span class="ep-today-total">${fmt(effectiveTarget)}</span>
                    ${remMarkup}
                </div>
                <div class="ep-today-track">
                    <div class="ep-today-fill" style="width:${todayPct.toFixed(1)}%;background:${todayBarColor};"></div>
                </div>
            </div>

            <div class="ep-today-actions">
                <span class="ep-btn ep-btn-pill" role="button" tabindex="0" data-action="buf-toggle" title="${todayBufOn ? 'Disable' : 'Enable'} buffer adjustment">
                    <span class="ep-toggle-track" style="background:${todayBufOn ? '#3b82f6' : T.barTrack};">
                        <span class="ep-toggle-thumb" style="left:${todayBufOn ? '14px' : '2px'};"></span>
                    </span>
                    Include buffer
                </span>
                ${todayOnPage ? `
                <span class="ep-btn ep-btn-label" role="button" tabindex="0" data-action="jump-today" title="Scroll to today's entry">
                    ${icon('arrow_down', 13, T.muted)} Jump to today
                </span>` : ''}
            </div>
        </div>`;

        /* ══ COMMUTE FORECASTER ══ */
        const detailedDays = getDetailedDayData();
        html += buildCommutePanel({ T, summary, ds, days: detailedDays });

        container.innerHTML = html;

        // Wire up all interactions after render — zero inline onclick
        bindInteractions(container);
    };

    /* ═══════════════════════════════════════════════════════════════
       BACK BUTTON
    ═══════════════════════════════════════════════════════════════ */

    const BACK_BTN_ID = 'ep-back-chip';

    const injectBackButton = (T) => {
        document.getElementById(BACK_BTN_ID)?.remove();

        const todayChip      = document.querySelector('.today_chip');
        const todayContainer = todayChip?.closest('.tt_day_container');
        if (!todayContainer) return;

        const btn = document.createElement('span');
        btn.id            = BACK_BTN_ID;
        btn.role          = 'button';
        btn.tabIndex      = 0;
        btn.title         = 'Scroll back to eDays Analyzer';
        btn.innerHTML     = `<span style="display:inline-flex;align-items:center;justify-content:center;width:13px;height:13px;color:currentColor;">${ICONS['arrow_up']}</span> Back to analyzer`;
        btn.style.cssText = `
            display: inline-flex; align-items: center; gap: 5px;
            font-size: 12px; font-weight: 500; cursor: pointer;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif;
            padding: 4px 10px; border-radius: 7px;
            border: 1px solid ${T.border};
            background: ${T.surface};
            color: ${T.muted};
            margin-bottom: 6px;
            user-select: none; white-space: nowrap;
        `;

        const hover = (on) => {
            btn.style.background = on
                ? (T.isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.06)')
                : T.surface;
            btn.style.color = on ? T.text : T.muted;
        };

        btn.addEventListener('click',       (e) => { e.preventDefault(); jumpToAnalyzer(); });
        btn.addEventListener('keydown',     (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); jumpToAnalyzer(); } });
        btn.addEventListener('mouseenter',  () => hover(true));
        btn.addEventListener('mouseleave',  () => hover(false));

        todayContainer.insertBefore(btn, todayContainer.firstChild);
    };

    /* ═══════════════════════════════════════════════════════════════
       BOOT
    ═══════════════════════════════════════════════════════════════ */

    const boot = () => {
        const tick = setInterval(() => {
            if (
                document.querySelector('.tt_day_container') &&
                document.querySelector('.desktop_summary')
            ) {
                clearInterval(tick);
                renderUI();
                injectBackButton(getTheme());

                let debounceTimer = null;
                const observer = new MutationObserver((mutations) => {
                    // Ignore any mutation that originates inside our own widget —
                    // those are caused by our own renders / CSS hover transitions
                    // and must never trigger a re-render loop.
                    const ep      = document.getElementById('ep13');
                    const backBtn = document.getElementById(BACK_BTN_ID);
                    const ours = mutations.every(m =>
                        (ep      && (ep.contains(m.target)      || ep      === m.target)) ||
                        (backBtn && (backBtn.contains(m.target)  || backBtn === m.target))
                    );
                    if (ours) return;

                    clearTimeout(debounceTimer);
                    debounceTimer = setTimeout(() => {
                        renderUI();
                        if (!document.getElementById(BACK_BTN_ID)) {
                            injectBackButton(getTheme());
                        }
                    }, 600);
                });

                const panel = document.getElementById('mainTimesheetPanel');
                if (panel) {
                    observer.observe(panel, {
                        childList:     true,
                        subtree:       true,
                        characterData: true,
                        // attributes deliberately omitted — we don't need to watch
                        // style/class attribute changes and they cause hover flicker
                    });
                }

                // Fallback poll every 30s
                setInterval(renderUI, 30000);
            }
        }, 800);
    };

    boot();
})();
