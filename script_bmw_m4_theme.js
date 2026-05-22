// ==UserScript==
// @name         eDays BMW M4 Cluster
// @namespace    http://tampermonkey.net/
// @version      16.0
// @match        https://*.e-days.com/*
// @grant        none
// @updateURL    https://raw.githubusercontent.com/blankode/edays-percentages-overview/main/script_bmw_m4_theme.js
// @downloadURL  https://raw.githubusercontent.com/blankode/edays-percentages-overview/main/script_bmw_m4_theme.js
// ==/UserScript==

/* ══ Set Office Target ══ */
const offTarget = 60;

(function () {
    'use strict';

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
    const rad   = d => d * Math.PI / 180;

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

        const allDays     = [...document.querySelectorAll('.tt_day_container')];
        const isHalfDayVacation = (d) => {
            const txt = d.querySelector('.absence_detail_text')?.innerText?.trim() || '';
            return txt === 'Vacation: AM' || txt === 'Vacation: PM';
        };
        const workableDays = allDays.filter(d => {
            const dayText = d.querySelector('.timesheet_day_text')?.innerText?.trim() || '';
            if (dayText.startsWith('Saturday') || dayText.startsWith('Sunday')) return false;
            if (d.querySelector('.absence_detail_text') && !isHalfDayVacation(d)) return false;
            return true;
        }).length;

        const workedDays = allDays.filter(d => {
            const dayText = d.querySelector('.timesheet_day_text')?.innerText?.trim() || '';
            if (dayText.startsWith('Saturday') || dayText.startsWith('Sunday')) return false;
            return getDayTotalMinutes(d) > 0;
        }).length;

        const progressPct = realRota > 0 ? (recorded / realRota) * 100 : 0;
        const daysLeft    = Math.round(Math.max(0, realRota - recorded) / 480);
        const soFar       = Math.max(0, workableDays - daysLeft);

        const todayIdx = allDays.findIndex(d => d.querySelector('.today_chip'));
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
       COLOUR HELPERS
    ═══════════════════════════════════════════════════════════════ */

    const getOffColor  = p => p >= 100 ? '#22c55e' : p >= 85 ? '#84cc16' : p >= 65 ? '#eab308' : p >= 45 ? '#f97316' : '#ef4444';
    const getRotaColor = p => p >= 100 ? '#22c55e' : p >= 80 ? '#4d9fff' : '#f59e0b';

    /* ═══════════════════════════════════════════════════════════════
       CANVAS DRAW HELPERS
    ═══════════════════════════════════════════════════════════════ */

    const rrect = (ctx, x, y, w, h, r) => {
        ctx.beginPath();
        ctx.moveTo(x + r, y);
        ctx.lineTo(x + w - r, y);
        ctx.arcTo(x + w, y, x + w, y + r, r);
        ctx.lineTo(x + w, y + h - r);
        ctx.arcTo(x + w, y + h, x + w - r, y + h, r);
        ctx.lineTo(x + r, y + h);
        ctx.arcTo(x, y + h, x, y + h - r, r);
        ctx.lineTo(x, y + r);
        ctx.arcTo(x, y, x + r, y, r);
        ctx.closePath();
    };

    const ctxTxt = (ctx, str, x, y, size, col, align, weight) => {
        ctx.save();
        ctx.font = `${weight || 400} ${size}px "Helvetica Neue", Helvetica, Arial, sans-serif`;
        ctx.fillStyle = col;
        ctx.textAlign  = align || 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(str, x, y);
        ctx.restore();
    };

    const glowArc = (ctx, cx, cy, r, a0, a1, col, lw, blur) => {
        ctx.save();
        ctx.shadowColor = col;
        ctx.shadowBlur  = blur || 20;
        ctx.beginPath();
        ctx.arc(cx, cy, r, rad(a0), rad(a1));
        ctx.strokeStyle = col;
        ctx.lineWidth   = lw;
        ctx.lineCap     = 'round';
        ctx.stroke();
        ctx.restore();
    };

    /* ═══════════════════════════════════════════════════════════════
       DRAW BACKGROUND
    ═══════════════════════════════════════════════════════════════ */

    const drawBG = (ctx, W, H) => {
        ctx.fillStyle = '#06080e';
        ctx.fillRect(0, 0, W, H);

        const g = ctx.createRadialGradient(W / 2, H * 0.35, 20, W / 2, H * 0.35, H * 0.9);
        g.addColorStop(0, 'rgba(12,28,80,0.55)');
        g.addColorStop(0.5, 'rgba(5,12,40,0.3)');
        g.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, W, H);

        const strip = ctx.createLinearGradient(0, 0, 0, 6);
        strip.addColorStop(0, 'rgba(100,150,255,0.15)');
        strip.addColorStop(1, 'rgba(100,150,255,0)');
        ctx.fillStyle = strip;
        ctx.fillRect(0, 0, W, 6);

        const bot = ctx.createLinearGradient(0, H - 8, 0, H);
        bot.addColorStop(0, 'rgba(20,40,120,0.1)');
        bot.addColorStop(1, 'rgba(0,0,0,0.4)');
        ctx.fillStyle = bot;
        ctx.fillRect(0, H - 8, W, 8);
    };

    /* ═══════════════════════════════════════════════════════════════
       DRAW GAUGE  (works for both left & right)
    ═══════════════════════════════════════════════════════════════ */

    const drawGauge = (ctx, opt) => {
        const { cx, cy, R, startDeg, endDeg, pct, label1, label2,
                accentCol, redZoneStart, statRows, bottomRow } = opt;
        const span   = endDeg - startDeg;
        const fillEnd = startDeg + clamp(pct, 0, 100) / 100 * span;

        /* dish bg */
        ctx.save();
        const dg = ctx.createRadialGradient(cx, cy - R * 0.05, R * 0.08, cx, cy, R * 1.05);
        dg.addColorStop(0, '#0c1528');
        dg.addColorStop(0.65, '#070d1c');
        dg.addColorStop(1, '#030508');
        ctx.beginPath();
        ctx.arc(cx, cy, R, 0, Math.PI * 2);
        ctx.fillStyle = dg;
        ctx.fill();
        ctx.strokeStyle = 'rgba(50,80,180,0.22)';
        ctx.lineWidth = 1.2;
        ctx.stroke();
        ctx.restore();

        /* ambient ring */
        ctx.save();
        ctx.beginPath();
        ctx.arc(cx, cy, R - 3, rad(startDeg), rad(endDeg));
        ctx.strokeStyle = 'rgba(40,80,200,0.08)';
        ctx.lineWidth   = 18;
        ctx.stroke();
        ctx.restore();

        /* outer thin track */
        ctx.save();
        ctx.beginPath();
        ctx.arc(cx, cy, R - 10, rad(startDeg), rad(endDeg));
        ctx.strokeStyle = 'rgba(255,255,255,0.04)';
        ctx.lineWidth   = 1;
        ctx.stroke();
        ctx.restore();

        /* main track */
        ctx.save();
        ctx.beginPath();
        ctx.arc(cx, cy, R - 20, rad(startDeg), rad(endDeg));
        ctx.strokeStyle = 'rgba(30,55,130,0.35)';
        ctx.lineWidth   = 9;
        ctx.lineCap     = 'butt';
        ctx.stroke();
        ctx.restore();

        /* red zone */
        if (redZoneStart != null) {
            const rzS  = startDeg + redZoneStart / 100 * span;
            const segs = 24;
            for (let i = 0; i < segs; i++) {
                const a0 = rad(rzS + i / segs * (endDeg - rzS));
                const a1 = rad(rzS + (i + 0.55) / segs * (endDeg - rzS));
                const t  = i / segs;
                ctx.save();
                ctx.beginPath();
                ctx.arc(cx, cy, R - 20, a0, a1);
                ctx.strokeStyle = `rgba(210,25,25,${(0.35 + t * 0.55).toFixed(2)})`;
                ctx.lineWidth   = 9;
                ctx.lineCap     = 'butt';
                ctx.stroke();
                ctx.restore();
            }
        }

        /* fill arc + highlight */
        glowArc(ctx, cx, cy, R - 20, startDeg, fillEnd, accentCol, 9, 22);
        glowArc(ctx, cx, cy, R - 20, startDeg, fillEnd, 'rgba(255,255,255,0.18)', 3, 0);

        /* inner ring */
        ctx.save();
        ctx.beginPath();
        ctx.arc(cx, cy, R - 32, rad(startDeg), rad(endDeg));
        ctx.strokeStyle = 'rgba(255,255,255,0.04)';
        ctx.lineWidth   = 0.8;
        ctx.stroke();
        ctx.restore();

        /* ticks */
        const TOTAL_TICKS = 50;
        for (let i = 0; i <= TOTAL_TICKS; i++) {
            const a       = rad(startDeg + i / TOTAL_TICKS * span);
            const isSuper = i % 10 === 0;
            const isMaj   = i % 5  === 0;
            const r1      = R - 11;
            const r2      = r1 + (isSuper ? 18 : isMaj ? 12 : 6);
            const lw      = isSuper ? 1.6 : isMaj ? 1 : 0.6;
            const alpha   = isSuper ? 0.75 : isMaj ? 0.45 : 0.18;
            ctx.save();
            ctx.beginPath();
            ctx.moveTo(cx + r1 * Math.cos(a), cy + r1 * Math.sin(a));
            ctx.lineTo(cx + r2 * Math.cos(a), cy + r2 * Math.sin(a));
            ctx.strokeStyle = `rgba(180,210,255,${alpha})`;
            ctx.lineWidth   = lw;
            ctx.stroke();
            ctx.restore();
            if (isSuper) {
                const num = (i / TOTAL_TICKS * 100).toFixed(0);
                const lr  = R + 6;
                ctxTxt(ctx, num, cx + lr * Math.cos(a), cy + lr * Math.sin(a), 9, 'rgba(160,185,230,0.6)', 'center', 400);
            }
        }

        /* needle */
        {
            const na   = rad(startDeg + clamp(pct, 0, 100) / 100 * span);
            const nLen = R - 28, nBase = 20;
            const ax = Math.cos(na), ay = Math.sin(na);
            const px = -ay,         py = ax;
            ctx.save();
            ctx.shadowColor = 'rgba(0,0,0,0.8)';
            ctx.shadowBlur  = 8;
            ctx.beginPath();
            ctx.moveTo(cx - ax * nBase + px * 3.5, cy - ay * nBase + py * 3.5);
            ctx.lineTo(cx - ax * nBase - px * 3.5, cy - ay * nBase - py * 3.5);
            ctx.lineTo(cx + ax * nLen * 0.92,       cy + ay * nLen * 0.92);
            ctx.fillStyle = accentCol;
            ctx.fill();
            ctx.restore();
            /* white tip */
            ctx.save();
            ctx.beginPath();
            ctx.moveTo(cx + ax * nLen * 0.7 + px * 0.8, cy + ay * nLen * 0.7 + py * 0.8);
            ctx.lineTo(cx + ax * nLen * 0.7 - px * 0.8, cy + ay * nLen * 0.7 - py * 0.8);
            ctx.lineTo(cx + ax * nLen,                   cy + ay * nLen);
            ctx.fillStyle = 'rgba(255,255,255,0.9)';
            ctx.fill();
            ctx.restore();
            /* hub */
            ctx.save();
            ctx.beginPath();
            ctx.arc(cx, cy, 10, 0, Math.PI * 2);
            const hg = ctx.createRadialGradient(cx, cy, 0, cx, cy, 10);
            hg.addColorStop(0, '#2a3a6a');
            hg.addColorStop(1, '#0a0e1e');
            ctx.fillStyle   = hg;
            ctx.fill();
            ctx.strokeStyle = accentCol;
            ctx.lineWidth   = 1.5;
            ctx.shadowColor = accentCol;
            ctx.shadowBlur  = 8;
            ctx.stroke();
            ctx.restore();
        }

        /* centre text */
        ctx.save();
        ctx.shadowColor = accentCol;
        ctx.shadowBlur  = 24;
        ctx.font        = `700 42px "Helvetica Neue", Helvetica, Arial, sans-serif`;
        ctx.fillStyle   = accentCol;
        ctx.textAlign   = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(`${Math.round(pct)}%`, cx, cy - 12);
        ctx.restore();
        ctxTxt(ctx, label1, cx, cy + 14, 11, 'rgba(140,165,220,0.65)', 'center', 400);
        ctxTxt(ctx, label2, cx, cy + 30, 9,  'rgba(70,100,170,0.55)',  'center', 400);

        /* stat rows */
        let ry = cy + R * 0.52;
        (statRows || []).forEach(([k, v, vc]) => {
            ctxTxt(ctx, k, cx - 50, ry, 9, 'rgba(90,120,180,0.6)',    'left',  400);
            ctxTxt(ctx, v, cx + 50, ry, 9, vc || 'rgba(190,210,250,0.9)', 'right', 700);
            ry += 14;
        });

        /* bottom row */
        if (bottomRow) {
            ctxTxt(ctx, bottomRow.left,  cx - 50, cy + R * 0.82, 10, 'rgba(80,110,170,0.6)',            'left',  400);
            ctxTxt(ctx, bottomRow.right, cx + 50, cy + R * 0.82, 12, bottomRow.col || 'rgba(200,220,255,0.9)', 'right', 700);
        }
    };

    /* ═══════════════════════════════════════════════════════════════
       DRAW CENTRE PANEL
    ═══════════════════════════════════════════════════════════════ */

    const drawCentrePanel = (ctx, W, H, D) => {
        const PX = W / 2, PW = 212, PH = H - 54;
        const X  = PX - PW / 2, Y  = H / 2 - PH / 2;
        const LX = X + 11, RX = X + PW - 11;

        /* panel bg */
        ctx.save();
        rrect(ctx, X, Y, PW, PH, 10);
        const pbg = ctx.createLinearGradient(X, Y, X, Y + PH);
        pbg.addColorStop(0, 'rgba(6,12,32,0.98)');
        pbg.addColorStop(1, 'rgba(3,7,18,0.98)');
        ctx.fillStyle   = pbg;
        ctx.fill();
        ctx.strokeStyle = 'rgba(40,70,180,0.18)';
        ctx.lineWidth   = 1;
        ctx.stroke();
        ctx.restore();

        /* top blue accent line */
        ctx.save();
        const acl = ctx.createLinearGradient(X, 0, X + PW, 0);
        acl.addColorStop(0,   'rgba(50,100,220,0)');
        acl.addColorStop(0.5, 'rgba(80,140,255,0.6)');
        acl.addColorStop(1,   'rgba(50,100,220,0)');
        ctx.fillStyle = acl;
        ctx.fillRect(X, Y, PW, 1.5);
        ctx.restore();

        let cy = Y + 16;

        /* logo */
        ctx.save();
        ctx.font        = `700 12px "Helvetica Neue", Helvetica, Arial, sans-serif`;
        ctx.textAlign   = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillStyle   = 'rgba(40,80,200,0.7)';
        ctx.fillText('e', PX - 20, cy);
        ctx.fillStyle = 'rgba(100,150,255,0.85)';
        ctx.fillText('DAYS', PX + 4, cy);
        ctx.fillStyle = 'rgba(50,90,180,0.45)';
        ctx.font      = `400 8px "Helvetica Neue", Helvetica, Arial, sans-serif`;
        ctx.fillText('BMW M4 CLUSTER', PX, cy + 13);
        ctx.restore();

        const now = new Date();
        const ds  = now.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }).toUpperCase();
        ctxTxt(ctx, ds, PX, cy + 24, 8, 'rgba(50,75,150,0.5)', 'center', 400);
        cy += 36;

        const divLine = () => {
            ctx.save();
            const dl = ctx.createLinearGradient(LX, 0, RX, 0);
            dl.addColorStop(0,   'rgba(40,70,180,0)');
            dl.addColorStop(0.5, 'rgba(40,70,180,0.25)');
            dl.addColorStop(1,   'rgba(40,70,180,0)');
            ctx.strokeStyle = dl;
            ctx.lineWidth   = 0.5;
            ctx.beginPath();
            ctx.moveTo(LX, cy);
            ctx.lineTo(RX, cy);
            ctx.stroke();
            ctx.restore();
        };

        /* activity */
        divLine(); cy += 10;
        ctxTxt(ctx, 'ACTIVITY BREAKDOWN', PX, cy, 7.5, 'rgba(50,80,160,0.55)', 'center', 700);
        cy += 11;

        const ACT_COLS = {
            'Office':           '#4d9fff',
            'Mobile Working':   '#e84fa0',
            'Business Travel':  '#9f55f5',
            'No Activity':      '#6b7a9a',
        };

        D.acts.forEach(a => {
            const pct = clamp(a.mins / D.realRota, 0, 1);
            const bw  = PW - 22;
            const col = ACT_COLS[a.name] || '#64748b';
            ctx.save();
            rrect(ctx, LX, cy, bw, 18, 3);
            ctx.fillStyle = 'rgba(255,255,255,0.04)';
            ctx.fill();
            if (pct > 0) {
                rrect(ctx, LX, cy, bw * pct, 18, 3);
                ctx.fillStyle = col + '44';
                ctx.fill();
            }
            /* left accent bar */
            rrect(ctx, LX, cy, 2, 18, 1);
            ctx.fillStyle = col;
            ctx.fill();
            ctx.restore();
            ctxTxt(ctx, a.name,      LX + 7, cy + 9, 8.5, 'rgba(170,195,245,0.75)', 'left',  400);
            ctxTxt(ctx, fmt(a.mins), RX - 2, cy + 9, 8.5, col,                      'right', 700);
            cy += 22;
        });

        /* buffer */
        cy += 3; divLine(); cy += 10;
        ctxTxt(ctx, 'BUFFER', PX, cy, 7.5, 'rgba(50,80,160,0.55)', 'center', 700);
        cy += 14;
        const bc = D.buf > 0 ? '#22c55e' : D.buf < 0 ? '#ef4444' : '#888';
        ctx.save();
        ctx.font         = `700 26px "Helvetica Neue", Helvetica, Arial, sans-serif`;
        ctx.fillStyle    = bc;
        ctx.textAlign    = 'center';
        ctx.textBaseline = 'middle';
        ctx.shadowColor  = bc;
        ctx.shadowBlur   = 14;
        ctx.fillText(fmt(D.buf), PX, cy);
        ctx.restore();
        ctxTxt(ctx, D.buf >= 0 ? 'ahead of daily' : 'behind daily', PX, cy + 14, 8, 'rgba(90,120,170,0.6)', 'center', 400);
        cy += 28;

        /* days chips */
        divLine(); cy += 8;
        ctxTxt(ctx, 'DAYS', PX, cy, 7.5, 'rgba(50,80,160,0.55)', 'center', 700);
        cy += 11;

        const chips = [
            { v: D.workable,  l: 'WORKABLE', c: 'rgba(190,210,255,0.85)' },
            { v: D.soFar,     l: 'SO FAR',   c: '#4d9fff'                 },
            { v: D.daysLeft,  l: 'LEFT',     c: '#a855f7'                 },
            { v: D.workedDays,l: 'WORKED',   c: '#f59e0b'                 },
        ];
        const CW = (PW - 22) / 2 - 4, CH = 30;
        chips.forEach((chip, i) => {
            const cx2 = LX + (i % 2) * (CW + 8);
            const cy2 = cy + Math.floor(i / 2) * (CH + 5);
            ctx.save();
            rrect(ctx, cx2, cy2, CW, CH, 4);
            ctx.fillStyle   = 'rgba(255,255,255,0.03)';
            ctx.strokeStyle = 'rgba(50,80,170,0.18)';
            ctx.lineWidth   = 0.5;
            ctx.fill();
            ctx.stroke();
            ctx.restore();
            ctx.save();
            ctx.font         = `700 17px "Helvetica Neue", Helvetica, Arial, sans-serif`;
            ctx.fillStyle    = chip.c;
            ctx.textAlign    = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(chip.v, cx2 + CW / 2, cy2 + 11);
            ctx.restore();
            ctxTxt(ctx, chip.l, cx2 + CW / 2, cy2 + 24, 7, 'rgba(50,80,150,0.6)', 'center', 400);
        });

        /* progress */
        cy += 2 * (CH + 5) + 8;
        divLine(); cy += 7;
        ctxTxt(ctx, 'MONTH PROGRESS', PX, cy, 7.5, 'rgba(50,80,160,0.55)', 'center', 700);
        cy += 10;
        const pbw = PW - 22;
        ctx.save();
        rrect(ctx, LX, cy, pbw, 5, 2.5);
        ctx.fillStyle = 'rgba(255,255,255,0.05)';
        ctx.fill();
        const pfrac = clamp(D.progress / 100, 0, 1);
        if (pfrac > 0) {
            rrect(ctx, LX, cy, pbw * pfrac, 5, 2.5);
            const pg = ctx.createLinearGradient(LX, 0, LX + pbw, 0);
            pg.addColorStop(0, '#1a50cc');
            pg.addColorStop(1, '#4d9fff');
            ctx.fillStyle = pg;
            ctx.fill();
        }
        ctx.restore();
        ctxTxt(ctx, `${Math.round(D.progress)}%`, PX, cy + 13, 9, '#4d9fff', 'center', 700);
    };

    /* ═══════════════════════════════════════════════════════════════
       DRAW STATUS BAR  (bottom strip — P R N D + time + temp)
    ═══════════════════════════════════════════════════════════════ */

    const drawStatusBar = (ctx, W, H) => {
        const BY = H - 24, BH = 22;
        const bg = ctx.createLinearGradient(0, BY, 0, BY + BH);
        bg.addColorStop(0, 'rgba(5,10,28,0.9)');
        bg.addColorStop(1, 'rgba(2,5,14,0.95)');
        ctx.fillStyle = bg;
        ctx.fillRect(0, BY, W, BH);
        ctx.fillStyle = 'rgba(30,60,160,0.25)';
        ctx.fillRect(0, BY, W, 0.5);

        const now = new Date();
        const ts  = now.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
        ctxTxt(ctx, ts, W / 2, BY + 11, 11, 'rgba(120,155,220,0.7)', 'center', 700);
        ctxTxt(ctx, '101 km', 40,     BY + 11, 10, 'rgba(90,120,170,0.6)', 'left',  400);
        ctxTxt(ctx, '+8.5°C', W - 40, BY + 11, 10, 'rgba(90,120,170,0.6)', 'right', 400);

        const gearX = W / 2 - 90;
        ['P', 'R', 'N', 'D'].forEach((g, i) => {
            const active = g === 'D';
            ctxTxt(ctx, g, gearX + i * 28, BY + 11, active ? 13 : 10,
                active ? 'rgba(200,220,255,0.95)' : 'rgba(60,90,150,0.5)',
                'center', active ? 700 : 400);
        });
    };

    /* ═══════════════════════════════════════════════════════════════
       VERTICAL SEPARATOR
    ═══════════════════════════════════════════════════════════════ */

    const drawVLine = (ctx, x, H) => {
        const g = ctx.createLinearGradient(x, 30, x, H - 30);
        g.addColorStop(0,   'rgba(40,80,200,0)');
        g.addColorStop(0.3, 'rgba(40,80,200,0.2)');
        g.addColorStop(0.7, 'rgba(40,80,200,0.2)');
        g.addColorStop(1,   'rgba(40,80,200,0)');
        ctx.save();
        ctx.setLineDash([3, 5]);
        ctx.strokeStyle = g;
        ctx.lineWidth   = 0.7;
        ctx.beginPath();
        ctx.moveTo(x, 30);
        ctx.lineTo(x, H - 30);
        ctx.stroke();
        ctx.setLineDash([]);
        ctx.restore();
    };

    /* ═══════════════════════════════════════════════════════════════
       MAIN RENDER
    ═══════════════════════════════════════════════════════════════ */

    const CANVAS_ID = 'edays-bmw-cluster-canvas';
    const WRAP_ID   = 'edays-bmw-cluster-wrap';

    const renderCluster = () => {
        /* ── gather live data ── */
        const summary  = getSummaryData();
        const { actMap, rawTotal, workedDays } = getActivityData();

        if (!summary.recorded || !rawTotal) return; // not ready yet

        const realRota = summary.rota - summary.absences - summary.holidays;
        const factor   = summary.recorded / rawTotal;
        const ds       = getDayStats(summary);

        const ACT_ORDER = ['Office', 'Mobile Working', 'Business Travel', 'No Activity'];
        const acts = ACT_ORDER
            .map(name => ({ name, mins: Math.floor((actMap[name] || 0) * factor) }))
            .filter(a => a.mins > 0);

        const officeEntry  = acts.find(a => a.name === 'Office');
        const officeMins   = officeEntry ? officeEntry.adj || officeEntry.mins : 0;
        const targetMins   = realRota * (offTarget / 100);
        const officePct    = targetMins > 0 ? (officeMins / targetMins) * 100 : 0;
        const officeActPct = realRota   > 0 ? (officeMins / realRota)   * 100 : 0;
        const rotaPct      = realRota   > 0 ? (summary.recorded / realRota) * 100 : 0;

        /* ── data bundle ── */
        const D = {
            officePct, officeActPct, officeMins,
            targetMins, rotaPct,
            recorded:   summary.recorded,
            realRota,
            difference: summary.difference,
            absences:   summary.absences,
            acts,
            buf:        ds.bufferMinutes,
            workable:   ds.workableDays,
            soFar:      ds.soFar,
            daysLeft:   ds.daysLeft,
            workedDays: ds.workedDays,
            progress:   ds.progressPct,
        };

        /* ── canvas setup ── */
        const mainPanel = document.getElementById('mainTimesheetPanel');
        if (!mainPanel) return;

        let wrap = document.getElementById(WRAP_ID);
        if (!wrap) {
            wrap = document.createElement('div');
            wrap.id = WRAP_ID;
            wrap.style.cssText = 'margin:0 0 16px;border-radius:12px;overflow:hidden;box-shadow:0 8px 40px rgba(0,0,0,0.7);';
            mainPanel.insertBefore(wrap, mainPanel.firstChild);
        }

        let canvas = document.getElementById(CANVAS_ID);
        if (!canvas) {
            canvas = document.createElement('canvas');
            canvas.id = CANVAS_ID;
            canvas.style.cssText = 'display:block;width:100%;';
            wrap.appendChild(canvas);
        }

        const DPR = window.devicePixelRatio || 1;
        const LW  = wrap.clientWidth || 960;
        const LH  = Math.round(LW * (400 / 960));
        const W   = LW, H = LH;

        if (canvas.width !== W * DPR || canvas.height !== H * DPR) {
            canvas.width       = W * DPR;
            canvas.height      = H * DPR;
            canvas.style.width  = W + 'px';
            canvas.style.height = H + 'px';
        }

        const ctx = canvas.getContext('2d');
        ctx.setTransform(DPR, 0, 0, DPR, 0, 0);

        /* ── DRAW ── */
        drawBG(ctx, W, H);

        const LCX = Math.round(W * 0.203), LCY = H / 2 - 22, LR = Math.round(H * 0.415);
        drawGauge(ctx, {
            cx: LCX, cy: LCY, R: LR,
            startDeg: 148, endDeg: 392,
            pct: D.officePct,
            label1: 'of target',
            label2: `OFFICE · ${offTarget}% TARGET`,
            accentCol:    getOffColor(D.officePct),
            redZoneStart: 95,
            statRows: [
                ['Logged',   fmt(D.officeMins),           null],
                ['Target',   fmt(D.targetMins),           null],
                ['Actual %', `${D.officeActPct.toFixed(1)}%`, getOffColor(D.officePct)],
            ],
            bottomRow: { left: 'Rota days', right: `${D.workable}d`, col: 'rgba(180,205,255,0.8)' },
        });

        const RCX = Math.round(W * 0.797), RCY = H / 2 - 22, RR = LR;
        drawGauge(ctx, {
            cx: RCX, cy: RCY, R: RR,
            startDeg: 148, endDeg: 392,
            pct: D.rotaPct,
            label1: 'of rota',
            label2: 'TIME VS ROTA',
            accentCol:    getRotaColor(D.rotaPct),
            redZoneStart: 98,
            statRows: [
                ['Recorded', fmt(D.recorded),   null],
                ['Real Rota',fmt(D.realRota),   null],
                ['Diff',     fmt(D.difference), D.difference >= 0 ? '#22c55e' : '#ef4444'],
                ['Worked',   `${D.workedDays}d`, '#f59e0b'],
            ],
            bottomRow: { left: 'Absences', right: fmt(D.absences), col: 'rgba(180,205,255,0.8)' },
        });

        drawVLine(ctx, W / 2 - 123, H);
        drawVLine(ctx, W / 2 + 123, H);

        drawCentrePanel(ctx, W, H, D);
        drawStatusBar(ctx, W, H);

        /* bezel rim */
        ctx.save();
        rrect(ctx, 0, 0, W, H, 12);
        ctx.strokeStyle = 'rgba(30,60,160,0.15)';
        ctx.lineWidth   = 3;
        ctx.stroke();
        ctx.restore();
    };

    /* ═══════════════════════════════════════════════════════════════
       BOOT — poll until DOM ready, then MutationObserver + 30s fallback
    ═══════════════════════════════════════════════════════════════ */

    const boot = () => {
        const tick = setInterval(() => {
            if (
                document.querySelector('.tt_day_container') &&
                document.querySelector('.desktop_summary')
            ) {
                clearInterval(tick);
                renderCluster();

                let debounce = null;
                const observer = new MutationObserver(() => {
                    clearTimeout(debounce);
                    debounce = setTimeout(renderCluster, 600);
                });
                const panel = document.getElementById('mainTimesheetPanel');
                if (panel) {
                    observer.observe(panel, {
                        childList: true, subtree: true, characterData: true, attributes: true,
                    });
                }

                window.addEventListener('resize', () => {
                    clearTimeout(debounce);
                    debounce = setTimeout(renderCluster, 150);
                });

                setInterval(renderCluster, 30000);
            }
        }, 800);
    };

    boot();
})();
