// ==UserScript==
// @name         eDays Analyzer Pro
// @namespace    http://tampermonkey.net/
// @version      15.0
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
       Reads the actual page background and picks dark or light tokens.
    ═══════════════════════════════════════════════════════════════ */

    const getPageBrightness = () => {
        const candidates = [document.body, document.documentElement,
            document.getElementById('mainTimesheetPanel'),
            document.querySelector('.timesheet_container'),
            document.querySelector('.main-content'),
            document.querySelector('#content'),
        ].filter(Boolean);

        for (const el of candidates) {
            const bg = getComputedStyle(el).backgroundColor;
            const match = bg.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
            if (!match) continue;
            const [, r, g, b] = match.map(Number);
            if (r === 0 && g === 0 && b === 0) continue;
            const lum = (0.299 * r + 0.587 * g + 0.114 * b);
            return lum;
        }
        return 255;
    };

    const buildTheme = () => {
        const lum = getPageBrightness();
        const isDark = lum < 100;

        if (isDark) {
            return {
                isDark,
                bg:        '#181818',
                surface:   '#242424',
                border:    'rgba(255,255,255,0.08)',
                text:      '#e8e8e8',
                muted:     '#888888',
                faint:     'rgba(255,255,255,0.04)',
                barTrack:  'rgba(255,255,255,0.07)',
                chipBg:    'rgba(255,255,255,0.03)',
                shadow:    '0 4px 24px rgba(0,0,0,0.4)',
                ringTrack: 'rgba(255,255,255,0.12)',
            };
        } else {
            return {
                isDark,
                bg:        '#ffffff',
                surface:   '#f7f7f7',
                border:    'rgba(0,0,0,0.08)',
                text:      '#111827',
                muted:     '#6b7280',
                faint:     'rgba(0,0,0,0.03)',
                barTrack:  'rgba(0,0,0,0.07)',
                chipBg:    'rgba(0,0,0,0.03)',
                shadow:    '0 2px 12px rgba(0,0,0,0.10)',
                ringTrack: 'rgba(0,0,0,0.12)',
            };
        }
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
        return m === 0 ? `${sign}${h}h` : `${sign}${h}h ${String(m).padStart(2,'0')}m`;
    };

    const parseTime = value => {
        const match = (value || '').match(/(-?\d+):(\d{2})/);
        if (!match) return 0;
        const mins = Math.abs(parseInt(match[1])) * 60 + parseInt(match[2]);
        return parseInt(match[1]) < 0 ? -mins : mins;
    };

    const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));

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
       INLINE SVG ICONS
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
    };

    const icon = (name, size = 14, color = '#fff') =>
        `<span style="display:inline-flex;align-items:center;justify-content:center;width:${size}px;height:${size}px;color:${color};flex-shrink:0;">${ICONS[name] || ''}</span>`;

    const iconBadge = (name, bg, size = 28) =>
        `<span style="display:inline-flex;align-items:center;justify-content:center;width:${size}px;height:${size}px;background:${bg};border-radius:7px;flex-shrink:0;color:#fff;">${ICONS[name] || ''}</span>`;

    /* ═══════════════════════════════════════════════════════════════
       OFFICE TARGET COLOR — graduated thresholds
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
        const recorded = summary.recorded;

        const workableDays = Math.round(realRota / 480);
        const workedDays   = Math.round(recorded / 480);
        const progressPct  = realRota > 0 ? (recorded / realRota) * 100 : 0;

        const allDays  = [...document.querySelectorAll('.tt_day_container')];
        const todayIdx = allDays.findIndex(d => d.querySelector('.today_chip'));

        // ── Fixed "So Far": count actual elapsed workdays from the DOM ──
        // A day counts as elapsed if it's before today and not a full absence/holiday.
        // If today isn't found (viewing a past month), treat all days as elapsed.
        let soFar = 0;
        allDays.forEach((day, idx) => {
            // Skip if this day is today or in the future
            if (todayIdx !== -1 && idx >= todayIdx) return;
            // Skip pure absence/holiday days (no period containers with time)
            const hasTime = [...day.querySelectorAll('.tt_period_container')]
                .some(p => getPeriodMinutes(p) > 0 ||
                           p.querySelector('input[type="time"]')?.value);
            const absenceText = day.querySelector('.absence_detail_text')?.innerText?.trim() || '';
            // Count it as a workday if it had entries OR it wasn't a recorded absence
            // (i.e. it's a plain working day the person may or may not have filled in)
            const isPureAbsence = absenceText.length > 0 && !hasTime;
            if (!isPureAbsence) soFar++;
        });
        // If no today marker found (past month view), soFar = workableDays
        if (todayIdx === -1) soFar = workableDays;

        const daysLeft = Math.max(0, workableDays - soFar);

        let bufferMinutes;
        if (todayIdx === -1) {
            bufferMinutes = summary.difference;
        } else {
            bufferMinutes = 0;
            allDays.forEach((day, idx) => {
                const absenceText = day.querySelector('.absence_detail_text')?.innerText || '';
                if (absenceText.length > 0) return;
                const dayMins = getDayTotalMinutes(day);
                if (dayMins <= 0) return;
                const isPast = idx < todayIdx;
                if (isPast) {
                    bufferMinutes += dayMins - 480;
                } else {
                    if (dayMins > 480) bufferMinutes += dayMins - 480;
                }
            });
        }

        return { workableDays, soFar, daysLeft, workedDays, progressPct, bufferMinutes, realRota };
    };

    /* ═══════════════════════════════════════════════════════════════
       STYLES — injected fresh on each render with live theme tokens
    ═══════════════════════════════════════════════════════════════ */

    const STYLE_ID = 'edays-pro-v15-styles';

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
        #ep13 .ep-hdr-right { margin-left: auto; display: flex; align-items: center; gap: 10px; }
        #ep13 .ep-hdr-date  { font-size: 13px; color: ${T.muted}; letter-spacing: 0.5px; display: flex; align-items: center; gap: 5px; }
        #ep13 .ep-pulse { width: 6px; height: 6px; border-radius: 50%; background: #22c55e; animation: ep-pulse 2s ease-in-out infinite; }
        @keyframes ep-pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.35;transform:scale(.65)} }

        #ep13 .ep-theme-btn {
            display: inline-flex; align-items: center; justify-content: center;
            width: 26px; height: 26px; border-radius: 7px; cursor: pointer;
            border: 1px solid ${T.border};
            background: ${T.surface};
            color: ${T.muted};
            transition: background 0.15s, color 0.15s;
            flex-shrink: 0;
        }
        #ep13 .ep-theme-btn:hover { background: ${T.isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)'}; color: ${T.text}; }

        #ep13 .ep-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; }

        #ep13 .ep-card {
            background: ${T.surface};
            border: 1px solid ${T.border};
            border-radius: 10px; padding: 12px;
            display: flex; flex-direction: column; gap: 8px; min-width: 0;
        }
        #ep13 .ep-card-title { font-size: 11px; font-weight: 700; letter-spacing: 1.1px; text-transform: uppercase; color: ${T.muted}; }

        #ep13 .ep-act-row { display: flex; align-items: center; gap: 8px; }
        #ep13 .ep-act-info { flex: 1; min-width: 0; }
        #ep13 .ep-act-name { font-size: 13px; font-weight: 600; color: ${T.text}; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; line-height: 1.3; }
        #ep13 .ep-act-meta { font-size: 12px; color: ${T.muted}; line-height: 1.3; }
        #ep13 .ep-bar       { height: 3px; background: ${T.barTrack}; border-radius: 3px; margin-top: 3px; overflow: hidden; }
        #ep13 .ep-bar-fill  { height: 100%; border-radius: 3px; }
        #ep13 .ep-divider   { height: 1px; background: ${T.border}; margin: 2px 0; }
        #ep13 .ep-total-row { display: flex; justify-content: space-between; align-items: center; }
        #ep13 .ep-total-label { font-size: 12px; color: ${T.muted}; }
        #ep13 .ep-total-val   { font-size: 13px; font-weight: 600; color: ${T.text}; }

        #ep13 .ep-ring-card { align-items: center; text-align: center; }
        #ep13 .ep-ring-wrap { position: relative; display: flex; align-items: center; justify-content: center; width: 122px; height: 122px; flex-shrink: 0; }
        #ep13 .ep-ring-wrap svg { position: absolute; top: 0; left: 0; width: 122px; height: 122px; }
        #ep13 .ep-ring-center { position: relative; z-index: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; pointer-events: none; }
        #ep13 .ep-ring-pct { font-size: 26px; font-weight: 700; letter-spacing: -0.5px; line-height: 1; }
        #ep13 .ep-ring-lbl { font-size: 10px; color: ${T.muted}; letter-spacing: 0.8px; text-transform: uppercase; margin-top: 1px; }
        #ep13 .ep-stat-row { display: flex; justify-content: space-between; width: 100%; }
        #ep13 .ep-stat-k   { font-size: 12px; color: ${T.muted}; }
        #ep13 .ep-stat-v   { font-size: 12px; font-weight: 600; color: ${T.text}; }
        #ep13 .ep-hint     { font-size: 12px; color: ${T.muted}; display: flex; align-items: center; gap: 4px; margin-top: 2px; }

        #ep13 .ep-buf-top { display: flex; align-items: center; gap: 8px; }
        #ep13 .ep-buf-val { font-size: 26px; font-weight: 800; letter-spacing: -1px; line-height: 1; }
        #ep13 .ep-buf-val.pos { color: #22c55e; }
        #ep13 .ep-buf-val.neg { color: #ef4444; }
        #ep13 .ep-buf-val.zer { color: ${T.muted}; }
        #ep13 .ep-buf-sub { font-size: 12px; color: ${T.muted}; line-height: 1.4; }

        #ep13 .ep-chip-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 6px; }
        #ep13 .ep-chip { background: ${T.chipBg}; border: 1px solid ${T.border}; border-radius: 7px; padding: 7px 8px; text-align: center; }
        #ep13 .ep-chip-val { font-size: 20px; font-weight: 700; line-height: 1; color: ${T.text}; }
        #ep13 .ep-chip-lbl { font-size: 10px; color: ${T.muted}; text-transform: uppercase; letter-spacing: 0.8px; margin-top: 2px; }

        #ep13 .ep-prog-wrap { width: 100%; }
        #ep13 .ep-prog-hdr  { display: flex; justify-content: space-between; font-size: 11px; color: ${T.muted}; margin-bottom: 4px; }
        #ep13 .ep-prog-track { height: 5px; background: ${T.barTrack}; border-radius: 5px; overflow: hidden; }
        #ep13 .ep-prog-fill  { height: 100%; border-radius: 5px; background: linear-gradient(90deg, #3b82f6, #a855f7); }

        #ep13 .ep-notice       { display: flex; align-items: center; gap: 5px; font-size: 12px; color: ${T.muted}; flex-wrap: nowrap; }
        #ep13 .ep-notice.warn  { color: #ef4444; }
        #ep13 .ep-notice.good  { color: #22c55e; }
        #ep13 .ep-notice.info  { color: ${T.muted}; }
        #ep13 .ep-notices      { display: flex; flex-direction: column; gap: 4px; }
        `;
    };

    /* ═══════════════════════════════════════════════════════════════
       THEME STATE — supports manual override via button
    ═══════════════════════════════════════════════════════════════ */

    let themeOverride = null;

    const getTheme = () => {
        if (themeOverride === 'dark') {
            return {
                isDark: true,
                bg: '#181818', surface: '#242424', border: 'rgba(255,255,255,0.08)',
                text: '#e8e8e8', muted: '#888888', faint: 'rgba(255,255,255,0.04)',
                barTrack: 'rgba(255,255,255,0.07)', chipBg: 'rgba(255,255,255,0.03)',
                shadow: '0 4px 24px rgba(0,0,0,0.4)', ringTrack: 'rgba(255,255,255,0.12)',
            };
        }
        if (themeOverride === 'light') {
            return {
                isDark: false,
                bg: '#ffffff', surface: '#f7f7f7', border: 'rgba(0,0,0,0.08)',
                text: '#111827', muted: '#6b7280', faint: 'rgba(0,0,0,0.03)',
                barTrack: 'rgba(0,0,0,0.07)', chipBg: 'rgba(0,0,0,0.03)',
                shadow: '0 2px 12px rgba(0,0,0,0.10)', ringTrack: 'rgba(0,0,0,0.12)',
            };
        }
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

        const realRota = summary.rota - summary.absences - summary.holidays;
        const factor   = summary.recorded / rawTotal;

        const acts = Object.entries(actMap)
            .map(([name, mins]) => ({ name, adj: Math.floor(mins * factor) }))
            .filter(a => a.adj > 0)
            .sort((a, b) => b.adj - a.adj);

        const totalActMins = acts.reduce((s, a) => s + a.adj, 0);
        const officeEntry  = acts.find(a => a.name === 'Office');
        const officeMins   = officeEntry ? officeEntry.adj : 0;

        const targetMins   = realRota * (offTarget / 100);
        const officePct    = targetMins > 0 ? (officeMins / targetMins) * 100 : 0;
        const officeActPct = realRota   > 0 ? (officeMins / realRota)   * 100 : 0;

        const rotaPct = realRota > 0 ? (summary.recorded / realRota) * 100 : 0;

        const ds = getDayStats(summary);

        const now     = new Date();
        const dateStr = now.toLocaleDateString('en-GB', { day:'numeric', month:'short', year:'numeric' }).toUpperCase();

        const offColor  = getOffColor(officePct);
        const rotaColor = rotaPct >= 100 ? '#22c55e' : rotaPct >= 80 ? '#3b82f6' : '#f59e0b';

        const offRing  = ring({ r: 54, pct: officePct,  color: offColor,  sw: 6, trackColor: T.ringTrack });
        const rotaRing = ring({ r: 54, pct: rotaPct,    color: rotaColor, sw: 6, trackColor: T.ringTrack });

        const nextTheme   = T.isDark ? 'light' : 'dark';
        const toggleIcon  = T.isDark ? 'sun' : 'moon';
        const toggleTitle = T.isDark ? 'Switch to light theme' : 'Switch to dark theme';

        /* ── HEADER ── */
        let html = `
        <div class="ep-hdr">
            <div class="ep-hdr-logo">${icon('timer', 16)}</div>
            <div class="ep-hdr-title">eDays Analyzer Pro</div>
            <div class="ep-hdr-right">
                <button class="ep-theme-btn" title="${toggleTitle}" onclick="
                    window.__epThemeOverride = '${nextTheme}';
                    document.dispatchEvent(new CustomEvent('ep-theme-toggle'));
                ">${icon(toggleIcon, 14, T.muted)}</button>
                <div class="ep-hdr-date"><span class="ep-pulse"></span>${dateStr}</div>
            </div>
        </div>
        <div class="ep-grid">
        `;

        /* ══ CARD 1 · Activity Breakdown ══ */
        const totalActPct = realRota > 0 ? (totalActMins / realRota) * 100 : 0;
        html += `<div class="ep-card">
            <div class="ep-card-title">Activity Breakdown</div>`;

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
                <span class="ep-total-val">${fmt(totalActMins)} / ${fmt(realRota)}</span>
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
            <div class="ep-stat-row"><span class="ep-stat-k">Target</span><span class="ep-stat-v">${fmt(targetMins)}</span></div>`;

        if (officePct < 100) {
            html += `<div class="ep-hint">${icon('today', 12, T.muted)}
                <span>${offRemD > 0 ? offRemD+'d ' : ''}${offRemH}h${offRemM ? ' '+offRemM+'m' : ''} to hit ${offTarget}%</span>
            </div>`;
        } else {
            html += `<div class="ep-hint" style="color:#22c55e">${icon('check', 12, '#22c55e')}
                <span>Office target met!</span>
            </div>`;
        }
        html += `</div>`;

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
                <div class="ep-chip">
                    <div class="ep-chip-val">${ds.workableDays}</div>
                    <div class="ep-chip-lbl">Workable</div>
                </div>
                <div class="ep-chip">
                    <div class="ep-chip-val" style="color:#3b82f6">${ds.soFar}</div>
                    <div class="ep-chip-lbl">So Far</div>
                </div>
                <div class="ep-chip">
                    <div class="ep-chip-val" style="color:#a855f7">${ds.daysLeft}</div>
                    <div class="ep-chip-lbl">Days Left</div>
                </div>
                <div class="ep-chip">
                    <div class="ep-chip-val" style="color:#f59e0b">${ds.workedDays}</div>
                    <div class="ep-chip-lbl">Worked</div>
                </div>
            </div>

            <div class="ep-prog-wrap">
                <div class="ep-prog-hdr">
                    <span>Month progress</span><span>${ds.progressPct.toFixed(0)}%</span>
                </div>
                <div class="ep-prog-track">
                    <div class="ep-prog-fill" style="width:${clamp(ds.progressPct, 0, 100).toFixed(1)}%"></div>
                </div>
            </div>

            <div class="ep-notices">
                ${ds.daysLeft > 0 ? `
                <div class="ep-notice info">${icon('calendar', 12, T.muted)}
                    <span>${ds.daysLeft}d left · ${fmt(ds.daysLeft * 480)} remaining</span>
                </div>` : ''}

                ${ds.bufferMinutes > 0 ? `
                <div class="ep-notice good">${icon('savings', 12, '#22c55e')}
                    <span>${fmt(ds.bufferMinutes)} banked above daily target</span>
                </div>` : ds.bufferMinutes < 0 ? `
                <div class="ep-notice warn">${icon('warning', 12, '#ef4444')}
                    <span>${fmt(Math.abs(ds.bufferMinutes))} deficit vs past days</span>
                </div>` : `
                <div class="ep-notice info">${icon('flag', 12, T.muted)}
                    <span>Exactly on target!</span>
                </div>`}

                <div class="ep-notice info">${icon('flag', 12, T.muted)}
                    <span>Month target: ${fmt(ds.realRota)}</span>
                </div>
            </div>
        </div>`;

        html += `</div>`; // close ep-grid
        container.innerHTML = html;
    };

    /* ═══════════════════════════════════════════════════════════════
       BOOT — initial poll + MutationObserver for live updates
    ═══════════════════════════════════════════════════════════════ */

    document.addEventListener('ep-theme-toggle', () => {
        themeOverride = window.__epThemeOverride || null;
        renderUI();
    });

    const boot = () => {
        const tick = setInterval(() => {
            if (
                document.querySelector('.tt_day_container') &&
                document.querySelector('.desktop_summary')
            ) {
                clearInterval(tick);
                renderUI();

                // MutationObserver — re-render when the timesheet DOM changes
                // (e.g. user edits a time entry, changes activity type, etc.)
                let debounceTimer = null;
                const observer = new MutationObserver(() => {
                    clearTimeout(debounceTimer);
                    debounceTimer = setTimeout(renderUI, 600);
                });

                const panel = document.getElementById('mainTimesheetPanel');
                if (panel) {
                    observer.observe(panel, { childList: true, subtree: true, characterData: true, attributes: true });
                }

                // Fallback poll every 30s in case observer misses summary-only changes
                setInterval(renderUI, 30000);
            }
        }, 800);
    };

    boot();
})();
