// ==UserScript==
// @name         eDays Analyzer Pro
// @namespace    http://tampermonkey.net/
// @version      17.4
// @match        https://*.e-days.com/*
// @updateURL    https://raw.githubusercontent.com/blankode/edays-percentages-overview/main/script.js
// @downloadURL  https://raw.githubusercontent.com/blankode/edays-percentages-overview/main/script.js
// ==/UserScript==

/* ══ Set Office Target (% of rota hours) ══ */
const offTarget = 60;

(function () {
    'use strict';

    /* ═══════════════════════════════════════════════════════════════
       LOCALSTORAGE KEYS
    ═══════════════════════════════════════════════════════════════ */
    const LS = {
        THEME:        'ep-theme-override',
        TODAY_BUF:    'ep-today-buffer',
        PLANNER_OPEN: 'ep-planner-open',
    };

    /* ═══════════════════════════════════════════════════════════════
       THEME
    ═══════════════════════════════════════════════════════════════ */
    const getPageBrightness = () => {
        const candidates = [
            document.body, document.documentElement,
            document.getElementById('mainTimesheetPanel'),
            document.querySelector('.timesheet_container'),
            document.querySelector('.main-content'),
            document.querySelector('#content'),
        ].filter(Boolean);
        for (const el of candidates) {
            const bg = getComputedStyle(el).backgroundColor;
            const m = bg.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
            if (!m) continue;
            const [,r,g,b] = m.map(Number);
            if (r===0&&g===0&&b===0) continue;
            return 0.299*r + 0.587*g + 0.114*b;
        }
        return 255;
    };
    const buildTheme = () => {
        const isDark = getPageBrightness() < 100;
        return isDark ? {
            isDark, bg:'#181818', surface:'#242424', border:'rgba(255,255,255,0.08)',
            text:'#e8e8e8', muted:'#888888', faint:'rgba(255,255,255,0.04)',
            barTrack:'rgba(255,255,255,0.07)', chipBg:'rgba(255,255,255,0.03)',
            shadow:'0 4px 24px rgba(0,0,0,0.4)', ringTrack:'rgba(255,255,255,0.12)',
        } : {
            isDark, bg:'#ffffff', surface:'#f7f7f7', border:'rgba(0,0,0,0.08)',
            text:'#111827', muted:'#6b7280', faint:'rgba(0,0,0,0.03)',
            barTrack:'rgba(0,0,0,0.07)', chipBg:'rgba(0,0,0,0.03)',
            shadow:'0 2px 12px rgba(0,0,0,0.10)', ringTrack:'rgba(0,0,0,0.12)',
        };
    };
    let themeOverride = localStorage.getItem(LS.THEME) || null;
    const getTheme = () => {
        if (themeOverride==='dark')  return { isDark:true,  bg:'#181818', surface:'#242424', border:'rgba(255,255,255,0.08)', text:'#e8e8e8', muted:'#888888', faint:'rgba(255,255,255,0.04)', barTrack:'rgba(255,255,255,0.07)', chipBg:'rgba(255,255,255,0.03)', shadow:'0 4px 24px rgba(0,0,0,0.4)', ringTrack:'rgba(255,255,255,0.12)' };
        if (themeOverride==='light') return { isDark:false, bg:'#ffffff', surface:'#f7f7f7', border:'rgba(0,0,0,0.08)', text:'#111827', muted:'#6b7280', faint:'rgba(0,0,0,0.03)', barTrack:'rgba(0,0,0,0.07)', chipBg:'rgba(0,0,0,0.03)', shadow:'0 2px 12px rgba(0,0,0,0.10)', ringTrack:'rgba(0,0,0,0.12)' };
        return buildTheme();
    };

    /* ═══════════════════════════════════════════════════════════════
       UTILITIES
    ═══════════════════════════════════════════════════════════════ */
    const timeToMinutes = t => { if(!t) return 0; const [h,m]=t.split(':').map(Number); return h*60+(m||0); };
    const fmt = (mins) => { const sign=mins<0?'-':''; const abs=Math.abs(mins); const h=Math.floor(abs/60); const m=abs%60; return m===0?`${sign}${h}h`:`${sign}${h}h ${String(m).padStart(2,'0')}m`; };
    const parseTime = value => { const m=(value||'').match(/(-?\d+):(\d{2})/); if(!m) return 0; const mins=Math.abs(parseInt(m[1]))*60+parseInt(m[2]); return parseInt(m[1])<0?-mins:mins; };
    const clamp = (v,lo,hi) => Math.max(lo,Math.min(hi,v));

    /* ═══════════════════════════════════════════════════════════════
       SCROLL HELPERS
    ═══════════════════════════════════════════════════════════════ */
    const getScrollParent = el => { let p = el.parentElement; while(p) { const { overflow, overflowY } = getComputedStyle(p); if(/(auto|scroll)/.test(overflow + overflowY)) return p; p = p.parentElement; } return window; };
    const jumpToToday = () => { const c = document.querySelector('.today_chip'); if(c) { const d = c.closest('.tt_day_container'); if(d) { const sp = getScrollParent(d); const offset = 80; if(sp === window) { const y = d.getBoundingClientRect().top + window.scrollY - offset; window.scrollTo({ top: y, behavior:'smooth' }); } else { const y = d.getBoundingClientRect().top - sp.getBoundingClientRect().top + sp.scrollTop - offset; sp.scrollTo({ top: y, behavior:'smooth' }); } } } };
    const jumpToAnalyzer = () => { const el = document.getElementById('ep13'); if(el) el.scrollIntoView({ behavior:'smooth', block:'start' }); };

    /* ═══════════════════════════════════════════════════════════════
       PERIOD / DAY HELPERS
    ═══════════════════════════════════════════════════════════════ */
    const getDayTotalMinutes = dayEl => timeToMinutes(dayEl.querySelector('.duration_hours')?.innerText?.trim()||'');
    const getPeriodMinutes = periodEl => {
        const inputs = periodEl.querySelectorAll('input[type="time"]');
        let sv=inputs[0]?.value||'', ev=inputs[1]?.value||'';
        if (!sv) { const lbl=periodEl.querySelector('label.hiddenLabel')?.innerText||''; const m=lbl.match(/(\d{2}:\d{2})\s+to\s+(\d{2}:\d{2})?/); if(m){sv=m[1]||'';ev=m[2]||'';} }
        if (!sv) return 0;
        if (!ev) { const n=new Date(); ev=`${String(n.getHours()).padStart(2,'0')}:${String(n.getMinutes()).padStart(2,'0')}`; }
        const d=timeToMinutes(ev)-timeToMinutes(sv);
        return d>0?d:0;
    };

    /* ═══════════════════════════════════════════════════════════════
       ICONS
    ═══════════════════════════════════════════════════════════════ */
    const ICONS = {
        office:`<svg viewBox="0 0 24 24" fill="currentColor"><path d="M3 21h18v-2H3v2zm0-4h18v-2H3v2zm0-4h18v-2H3v2zm0-4h18V7H3v2zm0-6v2h18V3H3z"/></svg>`,
        laptop:`<svg viewBox="0 0 24 24" fill="currentColor"><path d="M20 18c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2H4c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2H0v2h24v-2h-4zM4 6h16v10H4V6z"/></svg>`,
        flight:`<svg viewBox="0 0 24 24" fill="currentColor"><path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z"/></svg>`,
        block:`<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15v-4H7l5-8v4h4l-5 8z"/></svg>`,
        timer:`<svg viewBox="0 0 24 24" fill="currentColor"><path d="M15 1H9v2h6V1zm-4 13h2V8h-2v6zm8.03-6.61l1.42-1.42c-.43-.51-.9-.99-1.41-1.41l-1.42 1.42C16.07 4.74 14.12 4 12 4c-4.97 0-9 4.03-9 9s4.02 9 9 9 9-4.03 9-9c0-2.12-.74-4.07-1.97-5.61zM12 20c-3.87 0-7-3.13-7-7s3.13-7 7-7 7 3.13 7 7-3.13 7-7 7z"/></svg>`,
        trending_up:`<svg viewBox="0 0 24 24" fill="currentColor"><path d="M16 6l2.29 2.29-4.88 4.88-4-4L2 16.59 3.41 18l6-6 4 4 6.3-6.29L22 12V6z"/></svg>`,
        trending_down:`<svg viewBox="0 0 24 24" fill="currentColor"><path d="M16 18l2.29-2.29-4.88-4.88-4 4L2 7.41 3.41 6l6 6 4-4 6.3 6.29L22 12v6z"/></svg>`,
        trending_flat:`<svg viewBox="0 0 24 24" fill="currentColor"><path d="M22 12l-4-4v3H3v2h15v3z"/></svg>`,
        check:`<svg viewBox="0 0 24 24" fill="currentColor"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>`,
        warning:`<svg viewBox="0 0 24 24" fill="currentColor"><path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z"/></svg>`,
        calendar:`<svg viewBox="0 0 24 24" fill="currentColor"><path d="M17 12h-5v5h5v-5zM16 1v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2h-1V1h-2zm3 18H5V8h14v11z"/></svg>`,
        today:`<svg viewBox="0 0 24 24" fill="currentColor"><path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z"/></svg>`,
        flag:`<svg viewBox="0 0 24 24" fill="currentColor"><path d="M14.4 6L14 4H5v17h2v-7h5.6l.4 2h7V6z"/></svg>`,
        savings:`<svg viewBox="0 0 24 24" fill="currentColor"><path d="M11.5 2C6.81 2 3 5.81 3 10.5S6.81 19 11.5 19h.5v3c4.86-2.34 8-7 8-11.5C20 5.81 16.19 2 11.5 2zm1 14.5h-2v-2h2v2zm0-4h-2c0-3.25 3-3 3-5 0-1.1-.9-2-2-2s-2 .9-2 2h-2c0-2.21 1.79-4 4-4s4 1.79 4 4c0 2.5-3 2.75-3 5z"/></svg>`,
        sun:`<svg viewBox="0 0 24 24" fill="currentColor"><path d="M6.76 4.84l-1.8-1.79-1.41 1.41 1.79 1.79 1.42-1.41zM4 10.5H1v2h3v-2zm9-9.95h-2V3.5h2V.55zm7.45 3.91l-1.41-1.41-1.79 1.79 1.41 1.41 1.79-1.79zm-3.21 13.7l1.79 1.8 1.41-1.41-1.8-1.79-1.4 1.4zM20 10.5v2h3v-2h-3zm-8-5c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6-2.69-6-6-6zm-1 16.95h2V19.5h-2v2.95zm-7.45-3.91l1.41 1.41 1.79-1.8-1.41-1.41-1.79 1.8z"/></svg>`,
        moon:`<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 3a9 9 0 1 0 9 9c0-.46-.04-.92-.1-1.36a5.389 5.389 0 0 1-4.4 2.26 5.403 5.403 0 0 1-3.14-9.8c-.44-.06-.9-.1-1.36-.1z"/></svg>`,
        arrow_down:`<svg viewBox="0 0 24 24" fill="currentColor"><path d="M20 12l-1.41-1.41L13 16.17V4h-2v12.17l-5.58-5.59L4 12l8 8 8-8z"/></svg>`,
        arrow_up:`<svg viewBox="0 0 24 24" fill="currentColor"><path d="M4 12l1.41 1.41L11 7.83V20h2V7.83l5.58 5.59L20 12l-8-8-8 8z"/></svg>`,
        chevron_down:`<svg viewBox="0 0 24 24" fill="currentColor"><path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z"/></svg>`,
        chevron_up:`<svg viewBox="0 0 24 24" fill="currentColor"><path d="M7.41 15.41L12 10.83l4.59 4.58L18 14l-6-6-6 6 1.41 1.41z"/></svg>`,
    };
    const icon = (name,size=14,color='#fff') =>
        `<span style="display:inline-flex;align-items:center;justify-content:center;width:${size}px;height:${size}px;color:${color};flex-shrink:0;">${ICONS[name]||''}</span>`;
    const iconBadge = (name,bg,size=28) =>
        `<span style="display:inline-flex;align-items:center;justify-content:center;width:${size}px;height:${size}px;background:${bg};border-radius:7px;flex-shrink:0;color:#fff;">${ICONS[name]||''}</span>`;

    /* ═══════════════════════════════════════════════════════════════
       OFFICE TARGET COLOR / RING
    ═══════════════════════════════════════════════════════════════ */
    const getOffColor = p => p>=100?'#22c55e':p>=85?'#84cc16':p>=65?'#eab308':p>=45?'#f97316':'#ef4444';
    const ring = ({r=54,pct,color,sw=6,trackColor}) => {
        const circ=2*Math.PI*r, dash=clamp(pct,0,100)/100*circ, cx=r+sw+1, sz=cx*2;
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
        const d={recorded:0,rota:0,absences:0,holidays:0,difference:0};
        document.querySelectorAll('.desktop_summary .summary_block').forEach(block=>{
            const spans=block.querySelectorAll('span'); if(spans.length<2) return;
            const mins=parseTime(spans[0].innerText.trim()), lbl=spans[1].innerText.trim();
            if(lbl.includes('Time recorded')) d.recorded=mins;
            if(lbl.includes('Rota'))          d.rota=Math.abs(mins);
            if(lbl.includes('Absences'))      d.absences=Math.abs(mins);
            if(lbl.includes('Public holidays')) d.holidays=Math.abs(mins);
            if(lbl.includes('Difference'))    d.difference=mins;
        });
        return d;
    };

    /* Check if eDays summary panel has actually loaded (rota > 0 means the page is ready) */
    const isSummaryReady = () => {
        const blocks = document.querySelectorAll('.desktop_summary .summary_block');
        return blocks.length > 0;
    };

    const getActivityData = () => {
        const actMap={'Office':0,'Mobile Working':0,'Business Travel':0,'No Activity':0};
        let rawTotal=0, workedDays=0;
        document.querySelectorAll('.tt_day_container').forEach(day=>{
            let worked=false;
            day.querySelectorAll('.tt_period_container').forEach(p=>{
                const dur=getPeriodMinutes(p); if(dur<=0) return;
                worked=true;
                const act=p.querySelector('.chosen-single span')?.innerText.trim()||'No Activity';
                if(!(act in actMap)) actMap[act]=0;
                actMap[act]+=dur; rawTotal+=dur;
            });
            if(worked) workedDays++;
        });
        return {actMap,rawTotal,workedDays};
    };

    const getDayStats = summary => {
        const realRota=summary.rota-summary.absences-summary.holidays;
        const allDays=[...document.querySelectorAll('.tt_day_container')];
        const isHalfDay=d=>{const t=d.querySelector('.absence_detail_text')?.innerText?.trim()||'';return t==='Vacation: AM'||t==='Vacation: PM';};
        const workableDays=allDays.filter(d=>{
            const t=d.querySelector('.timesheet_day_text')?.innerText?.trim()||'';
            if(t.startsWith('Saturday')||t.startsWith('Sunday')) return false;
            if(d.querySelector('.absence_detail_text')&&!isHalfDay(d)) return false;
            return true;
        }).length;
        const workedDays=allDays.filter(d=>{
            const t=d.querySelector('.timesheet_day_text')?.innerText?.trim()||'';
            if(t.startsWith('Saturday')||t.startsWith('Sunday')) return false;
            return getDayTotalMinutes(d)>0;
        }).length;
        const progressPct=realRota>0?(summary.recorded/realRota)*100:0;
        const daysLeft=Math.round(Math.max(0,realRota-summary.recorded)/480);
        const todayIdx=allDays.findIndex(d=>d.querySelector('.today_chip'));

        /* Office streak: longest consecutive run of days with Office time, up to and including today */
        let officeStreak=0, curStreak=0;
        allDays.forEach((day,idx)=>{
            if(todayIdx!==-1&&idx>todayIdx) return; // only past + today
            const t=day.querySelector('.timesheet_day_text')?.innerText?.trim()||'';
            if(t.startsWith('Saturday')||t.startsWith('Sunday')) return; // skip weekends (don't break streak)
            const hasOfficeToday=[...day.querySelectorAll('.tt_period_container')].some(p=>{
                const dur=getPeriodMinutes(p); if(dur<=0) return false;
                return p.querySelector('.chosen-single span')?.innerText.trim()==='Office';
            });
            if(hasOfficeToday){ curStreak++; officeStreak=Math.max(officeStreak,curStreak); }
            else { curStreak=0; }
        });
        let bufferMinutes;
        if(todayIdx===-1){bufferMinutes=summary.difference;}
        else{
            bufferMinutes=0;
            allDays.forEach((day,idx)=>{
                if(day.querySelector('.absence_detail_text')?.innerText) return;
                const m=getDayTotalMinutes(day); if(m<=0) return;
                if(idx<todayIdx){bufferMinutes+=m-480;}
                else if(m>480){bufferMinutes+=m-480;}
            });
        }
        return {workableDays,officeStreak,daysLeft,workedDays,progressPct,bufferMinutes,realRota};
    };

    const getTodayMinutes = () => {
        const el=[...document.querySelectorAll('.tt_day_container')].find(d=>d.querySelector('.today_chip'));
        if(!el) return 0;
        let t=0; el.querySelectorAll('.tt_period_container').forEach(p=>t+=getPeriodMinutes(p));
        return t;
    };
    const hasTodayOnPage = () => !!document.querySelector('.today_chip');

    const getDetailedDayData = () => {
        const todayIdx=[...document.querySelectorAll('.tt_day_container')].findIndex(d=>d.querySelector('.today_chip'));
        return [...document.querySelectorAll('.tt_day_container')].map((day,idx)=>{
            const label=day.querySelector('.timesheet_day_text')?.innerText?.trim()||'';
            const parts=label.split(' ');
            const dayName=parts[0]||'';

            let dateNum=0;
            for(let i=1;i<parts.length;i++){
                const n=parseInt(parts[i],10);
                if(!isNaN(n)&&n>=1&&n<=31){dateNum=n;break;}
            }
            if(!dateNum){
                const txt=day.querySelector('[class*="date"]')?.innerText||'';
                const m=txt.match(/\d+/); if(m) dateNum=parseInt(m[0],10);
            }

            const DOW_MAP={Sunday:0,Monday:1,Tuesday:2,Wednesday:3,Thursday:4,Friday:5,Saturday:6};
            const dayOfWeek=DOW_MAP[dayName]??-1;
            const isWeekend=dayOfWeek===0||dayOfWeek===6;
            const absenceText=day.querySelector('.absence_detail_text')?.innerText?.trim()||'';
            const isHalfDay=absenceText==='Vacation: AM'||absenceText==='Vacation: PM';
            const isAbsent=!!absenceText&&!isHalfDay;
            const isHoliday=absenceText.toLowerCase().includes('holiday');
            const isToday=idx===todayIdx;
            const isPast=todayIdx!==-1?idx<todayIdx:false;
            const isFuture=todayIdx!==-1?idx>todayIdx:true;
            const totalMins=getDayTotalMinutes(day);
            let officeMins=0,wfhMins=0,hasOffice=false,hasWFH=false;
            day.querySelectorAll('.tt_period_container').forEach(p=>{
                const dur=getPeriodMinutes(p); if(dur<=0) return;
                const act=p.querySelector('.chosen-single span')?.innerText.trim()||'';
                if(act==='Office'){officeMins+=dur;hasOffice=true;}
                if(act==='Mobile Working'){wfhMins+=dur;hasWFH=true;}
            });
            return {label,dayName,dateNum,dayOfWeek,isWeekend,isAbsent,isHoliday,isHalfDay,isToday,isPast,isFuture,totalMins,officeMins,wfhMins,hasOffice,hasWFH,isWorkable:!isWeekend&&!isAbsent&&!isHoliday,el:day};
        });
    };

    /* ═══════════════════════════════════════════════════════════════
       HOURS-BASED SCHEDULE PLANNER
    ═══════════════════════════════════════════════════════════════ */
    const buildHoursSchedulePlan = ({days, officeHoursStillNeeded}) => {
        if(officeHoursStillNeeded<=0) return new Map();
        const future=days.filter(d=>(d.isFuture||d.isToday)&&d.isWorkable);
        if(!future.length) return new Map();
        let remaining=officeHoursStillNeeded;
        const STANDARD_H=8;
        const weekMap=new Map();
        future.forEach(d=>{
            const wk=Math.floor((d.dateNum-1)/7);
            if(!weekMap.has(wk)) weekMap.set(wk,[]);
            weekMap.get(wk).push(d);
        });
        const DOW_PREF={3:0,2:1,4:2,1:3,5:4};
        weekMap.forEach(w=>w.sort((a,b)=>(DOW_PREF[a.dayOfWeek]??9)-(DOW_PREF[b.dayOfWeek]??9)));
        const weeks=[...weekMap.entries()].sort((a,b)=>a[0]-b[0]);
        const planned=new Map();
        weeks.forEach(([,wdays],wi)=>{
            if(remaining<=0) return;
            const weeksLeft=weeks.length-wi;
            const quota=Math.ceil(remaining/weeksLeft);
            let assigned=0;
            for(const d of wdays){
                if(remaining<=0||assigned>=quota) break;
                const h=Math.min(STANDARD_H,remaining,quota-assigned);
                planned.set(d.dateNum,h);
                assigned+=h; remaining-=h;
            }
        });
        return planned;
    };

    /* ═══════════════════════════════════════════════════════════════
       STYLES
    ═══════════════════════════════════════════════════════════════ */
    const STYLE_ID='edays-pro-v18-styles';
    const injectStyles = T => {
        let s=document.getElementById(STYLE_ID);
        if(!s){s=document.createElement('style');s.id=STYLE_ID;document.head.appendChild(s);}
        s.textContent=`
        #ep13{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',system-ui,sans-serif;background:${T.bg};border-radius:14px;padding:14px 16px 12px;margin:0 0 16px;color:${T.text};}
        #ep13 .ep-hdr{display:flex;align-items:center;gap:10px;margin-bottom:12px;padding-bottom:10px;border-bottom:1px solid ${T.border};}
        #ep13 .ep-hdr-logo{width:30px;height:30px;background:linear-gradient(135deg,#3b82f6,#a855f7);border-radius:8px;display:flex;align-items:center;justify-content:center;flex-shrink:0;}
        #ep13 .ep-hdr-title{font-size:17px;font-weight:700;letter-spacing:-0.3px;color:${T.text};}
        #ep13 .ep-hdr-right{margin-left:auto;display:flex;align-items:center;gap:8px;}
        #ep13 .ep-hdr-date{font-size:13px;color:${T.muted};letter-spacing:0.5px;display:flex;align-items:center;gap:5px;}
        #ep13 .ep-pulse{width:6px;height:6px;border-radius:50%;background:#22c55e;animation:ep-pulse 3.5s ease-in-out infinite;}
        @keyframes ep-pulse{0%,100%{opacity:1;transform:scale(1)}50%{opacity:.35;transform:scale(.65)}}
        #ep13 .ep-btn{display:inline-flex;align-items:center;gap:5px;font-size:12px;font-weight:500;border-radius:7px;cursor:pointer;border:1px solid ${T.border};background:${T.surface};color:${T.muted};transition:background .15s,color .15s,border-color .15s;user-select:none;white-space:nowrap;}
        #ep13 .ep-btn:hover{background:${T.isDark?'rgba(255,255,255,0.1)':'rgba(0,0,0,0.06)'};color:${T.text};border-color:${T.isDark?'rgba(255,255,255,0.18)':'rgba(0,0,0,0.15)'};}
        #ep13 .ep-btn-icon{width:26px;height:26px;padding:0;justify-content:center;}
        #ep13 .ep-btn-label{padding:4px 10px;}
        #ep13 .ep-btn-pill{padding:4px 10px;gap:6px;background:${T.chipBg};}
        #ep13 .ep-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:10px;}
        #ep13 .ep-card{background:${T.surface};border:1px solid ${T.border};border-radius:10px;padding:12px;display:flex;flex-direction:column;gap:8px;min-width:0;}
        #ep13 .ep-card-title{font-size:11px;font-weight:700;letter-spacing:1.1px;text-transform:uppercase;color:${T.muted};}
        #ep13 .ep-act-row{display:flex;align-items:center;gap:8px;}
        #ep13 .ep-act-info{flex:1;min-width:0;}
        #ep13 .ep-act-name{font-size:13px;font-weight:600;color:${T.text};white-space:nowrap;overflow:hidden;text-overflow:ellipsis;line-height:1.3;}
        #ep13 .ep-act-meta{font-size:12px;color:${T.muted};line-height:1.3;}
        #ep13 .ep-bar{height:3px;background:${T.barTrack};border-radius:3px;margin-top:3px;overflow:hidden;}
        #ep13 .ep-bar-fill{height:100%;border-radius:3px;}
        #ep13 .ep-divider{height:1px;background:${T.border};margin:2px 0;}
        #ep13 .ep-total-row{display:flex;justify-content:space-between;align-items:center;}
        #ep13 .ep-total-label{font-size:12px;color:${T.muted};}
        #ep13 .ep-total-val{font-size:13px;font-weight:600;color:${T.text};}
        #ep13 .ep-ring-card{align-items:center;text-align:center;}
        #ep13 .ep-ring-wrap{position:relative;display:flex;align-items:center;justify-content:center;width:122px;height:122px;flex-shrink:0;}
        #ep13 .ep-ring-wrap svg{position:absolute;top:0;left:0;width:122px;height:122px;}
        #ep13 .ep-ring-center{position:relative;z-index:1;display:flex;flex-direction:column;align-items:center;justify-content:center;pointer-events:none;}
        #ep13 .ep-ring-pct{font-size:26px;font-weight:700;letter-spacing:-0.5px;line-height:1;}
        #ep13 .ep-ring-lbl{font-size:10px;color:${T.muted};letter-spacing:0.8px;text-transform:uppercase;margin-top:1px;}
        #ep13 .ep-stat-row{display:flex;justify-content:space-between;width:100%;}
        #ep13 .ep-stat-k{font-size:12px;color:${T.muted};}
        #ep13 .ep-stat-v{font-size:12px;font-weight:600;color:${T.text};}
        #ep13 .ep-hint{font-size:12px;color:${T.muted};display:flex;align-items:center;gap:4px;margin-top:2px;}
        #ep13 .ep-buf-top{display:flex;align-items:center;gap:8px;}
        #ep13 .ep-buf-val{font-size:26px;font-weight:800;letter-spacing:-1px;line-height:1;}
        #ep13 .ep-buf-val.pos{color:#22c55e;}#ep13 .ep-buf-val.neg{color:#ef4444;}#ep13 .ep-buf-val.zer{color:${T.muted};}
        #ep13 .ep-buf-sub{font-size:12px;color:${T.muted};line-height:1.4;}
        #ep13 .ep-chip-grid{display:grid;grid-template-columns:1fr 1fr;gap:6px;}
        #ep13 .ep-chip{background:${T.chipBg};border:1px solid ${T.border};border-radius:7px;padding:7px 8px;text-align:center;}
        #ep13 .ep-chip-val{font-size:20px;font-weight:700;line-height:1;color:${T.text};}
        #ep13 .ep-chip-lbl{font-size:10px;color:${T.muted};text-transform:uppercase;letter-spacing:0.8px;margin-top:2px;}
        #ep13 .ep-prog-wrap{width:100%;}
        #ep13 .ep-prog-hdr{display:flex;justify-content:space-between;font-size:11px;color:${T.muted};margin-bottom:4px;}
        #ep13 .ep-prog-track{height:5px;background:${T.barTrack};border-radius:5px;overflow:hidden;}
        #ep13 .ep-prog-fill{height:100%;border-radius:5px;background:linear-gradient(90deg,#3b82f6,#a855f7);}
        #ep13 .ep-notice{display:flex;align-items:center;gap:5px;font-size:12px;color:${T.muted};}
        #ep13 .ep-notice.warn{color:#ef4444;}#ep13 .ep-notice.good{color:#22c55e;}
        #ep13 .ep-notices{display:flex;flex-direction:column;gap:4px;}
        #ep13 .ep-today-strip{margin-top:10px;background:${T.surface};border:1px solid ${T.border};border-radius:10px;padding:10px 14px;display:flex;align-items:center;gap:16px;}
        #ep13 .ep-today-label{display:flex;align-items:center;gap:8px;flex-shrink:0;}
        #ep13 .ep-today-label-text{font-size:11px;font-weight:700;letter-spacing:1.1px;text-transform:uppercase;color:${T.muted};white-space:nowrap;}
        #ep13 .ep-today-centre{flex:1;min-width:0;display:flex;flex-direction:column;gap:6px;}
        #ep13 .ep-today-nums-row{display:flex;align-items:baseline;gap:6px;}
        #ep13 .ep-today-done{font-size:20px;font-weight:800;letter-spacing:-0.5px;line-height:1;color:${T.text};}
        #ep13 .ep-today-sep{font-size:13px;color:${T.muted};}
        #ep13 .ep-today-total{font-size:13px;color:${T.muted};}
        #ep13 .ep-today-rem{font-size:12px;color:${T.muted};margin-left:6px;display:flex;align-items:center;gap:4px;}
        #ep13 .ep-today-rem.done{color:#22c55e;}
        #ep13 .ep-today-track{height:5px;background:${T.barTrack};border-radius:5px;overflow:hidden;}
        #ep13 .ep-today-fill{height:100%;border-radius:5px;transition:width .4s ease;}
        #ep13 .ep-today-actions{display:flex;align-items:center;gap:6px;flex-shrink:0;}
        #ep13 .ep-toggle-track{display:inline-block;width:28px;height:16px;border-radius:8px;position:relative;vertical-align:middle;flex-shrink:0;transition:background .2s;}
        #ep13 .ep-toggle-thumb{position:absolute;width:12px;height:12px;background:#fff;border-radius:50%;top:2px;box-shadow:0 1px 2px rgba(0,0,0,0.25);transition:left .2s;}
        /* EMPTY STATE */
        #ep13 .ep-empty{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:8px;padding:28px 16px;text-align:center;}
        #ep13 .ep-empty-icon{width:44px;height:44px;background:${T.surface};border:1px solid ${T.border};border-radius:12px;display:flex;align-items:center;justify-content:center;}
        #ep13 .ep-empty-title{font-size:15px;font-weight:700;color:${T.text};}
        #ep13 .ep-empty-sub{font-size:13px;color:${T.muted};line-height:1.5;max-width:340px;}
        /* OFFICE PLANNER */
        #ep13 .ep-planner-toggle{margin-top:8px;display:flex;align-items:center;gap:8px;padding:8px 14px;background:${T.surface};border:1px solid ${T.border};border-radius:10px;cursor:pointer;user-select:none;transition:background .15s;}
        #ep13 .ep-planner-toggle:hover{background:${T.isDark?'rgba(255,255,255,0.06)':'rgba(0,0,0,0.04)'};}
        #ep13 .ep-planner-toggle-label{flex:1;font-size:12px;font-weight:600;letter-spacing:0.8px;text-transform:uppercase;color:${T.muted};}
        #ep13 .ep-planner-toggle-sub{font-size:11px;font-weight:400;color:${T.muted};opacity:.7;letter-spacing:0;text-transform:none;}
        #ep13 .ep-planner-panel{overflow:hidden;max-height:0;opacity:0;transition:max-height .35s ease,opacity .25s ease,margin-top .25s ease;margin-top:0;}
        #ep13 .ep-planner-panel.open{max-height:3000px;opacity:1;margin-top:8px;}
        #ep13 .ep-planner-inner{background:${T.surface};border:1px solid ${T.border};border-radius:10px;padding:14px 16px;display:flex;flex-direction:column;gap:14px;}
        /* SCHEDULE */
        #ep13 .ep-sched-section{display:flex;flex-direction:column;gap:10px;}
        #ep13 .ep-sched-hdr{display:flex;align-items:center;gap:6px;font-size:10px;font-weight:700;letter-spacing:1px;text-transform:uppercase;color:${T.muted};}
        #ep13 .ep-sched-legend{display:flex;gap:12px;flex-wrap:wrap;}
        #ep13 .ep-sched-leg-item{display:flex;align-items:center;gap:5px;font-size:11px;color:${T.muted};}
        #ep13 .ep-sched-leg-dot{width:10px;height:10px;border-radius:3px;flex-shrink:0;}
        #ep13 .ep-cal-grid{display:grid;grid-template-columns:repeat(7,1fr);gap:3px;}
        #ep13 .ep-cal-dow{font-size:9px;font-weight:700;letter-spacing:.8px;text-transform:uppercase;color:${T.muted};text-align:center;padding:2px 0 4px;}
        #ep13 .ep-cal-day{aspect-ratio:1;border-radius:5px;display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:600;position:relative;transition:transform .1s;flex-direction:column;gap:1px;}
        #ep13 .ep-cal-day.ep-cal-empty{background:transparent;}
        #ep13 .ep-cal-day.ep-cal-weekend{background:${T.chipBg};color:${T.muted};opacity:.4;}
        #ep13 .ep-cal-day.ep-cal-absent{background:${T.chipBg};color:${T.muted};opacity:.5;}
        #ep13 .ep-cal-day.ep-cal-done-off{background:rgba(34,197,94,.18);color:#22c55e;border:1px solid rgba(34,197,94,.3);}
        #ep13 .ep-cal-day.ep-cal-done-wfh{background:rgba(168,85,247,.15);color:#a855f7;border:1px solid rgba(168,85,247,.25);}
        #ep13 .ep-cal-day.ep-cal-done-any{background:rgba(100,116,139,.15);color:${T.muted};}
        #ep13 .ep-cal-day.ep-cal-plan-off{background:rgba(59,130,246,.18);color:#3b82f6;border:1px solid rgba(59,130,246,.35);}
        #ep13 .ep-cal-day.ep-cal-plan-wfh{background:${T.chipBg};color:${T.muted};border:1px solid ${T.border};}
        #ep13 .ep-cal-day.ep-cal-today{outline:2px solid #f59e0b;outline-offset:1px;}
        #ep13 .ep-cal-day .ep-cal-hrs{font-size:8px;opacity:.75;line-height:1;}
        #ep13 .ep-week-rows{display:flex;flex-direction:column;gap:5px;}
        #ep13 .ep-week-row{display:flex;align-items:center;gap:6px;}
        #ep13 .ep-week-label{font-size:10px;color:${T.muted};font-weight:600;min-width:30px;letter-spacing:.5px;}
        #ep13 .ep-week-days{display:flex;gap:3px;flex:1;}
        #ep13 .ep-week-day-pill{flex:1;padding:4px 2px;border-radius:5px;text-align:center;font-size:10px;font-weight:700;letter-spacing:.3px;display:flex;flex-direction:column;align-items:center;gap:1px;}
        #ep13 .ep-week-day-pill .ep-pill-sub{font-size:8px;font-weight:400;opacity:.8;}
        #ep13 .ep-week-day-pill.ep-wp-office{background:rgba(59,130,246,.2);color:#3b82f6;}
        #ep13 .ep-week-day-pill.ep-wp-done{background:rgba(34,197,94,.18);color:#22c55e;}
        #ep13 .ep-week-day-pill.ep-wp-wfh{background:${T.chipBg};color:${T.muted};}
        #ep13 .ep-week-day-pill.ep-wp-off{background:transparent;color:${T.muted};opacity:.35;}
        #ep13 .ep-week-day-pill.ep-wp-absent{background:${T.chipBg};color:${T.muted};opacity:.4;font-size:9px;}
        #ep13 .ep-week-row-summary{font-size:11px;color:${T.muted};min-width:100px;text-align:right;}
        #ep13 .ep-week-row-summary span{color:${T.text};font-weight:600;}
        #ep13 .ep-hours-progress{display:flex;flex-direction:column;gap:4px;}
        #ep13 .ep-hours-prog-hdr{display:flex;justify-content:space-between;font-size:11px;color:${T.muted};}
        #ep13 .ep-hours-prog-track{height:6px;background:${T.barTrack};border-radius:6px;overflow:hidden;display:flex;}
        #ep13 .ep-hours-prog-done{height:100%;background:linear-gradient(90deg,#22c55e,#84cc16);}
        #ep13 .ep-hours-prog-plan{height:100%;background:linear-gradient(90deg,#3b82f6,#6366f1);}
        #ep13 .ep-sched-stat{background:${T.chipBg};border:1px solid ${T.border};border-radius:8px;padding:9px 10px;text-align:center;}
        #ep13 .ep-sched-stat-val{font-size:18px;font-weight:700;line-height:1;}
        #ep13 .ep-sched-stat-lbl{font-size:10px;color:${T.muted};text-transform:uppercase;letter-spacing:.8px;margin-top:3px;}
        html { scroll-behavior: smooth; }
        #ep-today-anchor { scroll-margin-top: 75px; }
        #ep13 { scroll-margin-top: 75px; }
        `;
    };

    /* ═══════════════════════════════════════════════════════════════
       ACTIVITY CONFIG
    ═══════════════════════════════════════════════════════════════ */
    const ACT_CFG = {
        'Office':          {icon:'office',grad:'linear-gradient(135deg,#3b82f6,#06b6d4)',bg:'#1d4ed8'},
        'Mobile Working':  {icon:'laptop',grad:'linear-gradient(135deg,#ec4899,#f97316)',bg:'#9d174d'},
        'Business Travel': {icon:'flight',grad:'linear-gradient(135deg,#a855f7,#7c3aed)',bg:'#6b21a8'},
        'No Activity':     {icon:'block', grad:'linear-gradient(135deg,#374151,#111827)',bg:'#374151'},
    };
    const FALLBACK_CFG = {icon:'timer',grad:'linear-gradient(135deg,#64748b,#334155)',bg:'#475569'};

    /* ═══════════════════════════════════════════════════════════════
       SCHEDULE SECTION HTML
    ═══════════════════════════════════════════════════════════════ */
    const buildScheduleSection = ({T,days,officeHoursNeeded,alreadyDoneOfficeHours}) => {
        const stillNeeded=Math.max(0,officeHoursNeeded-alreadyDoneOfficeHours);
        const plannedMap=buildHoursSchedulePlan({days,officeHoursStillNeeded:stillNeeded});
        const plannedTotalH=[...plannedMap.values()].reduce((a,b)=>a+b,0);
        const totalWorkableDays=days.filter(d=>d.isWorkable).length;
        const totalWorkableHours=totalWorkableDays*8;
        const donePct=officeHoursNeeded>0?(alreadyDoneOfficeHours/officeHoursNeeded)*100:0;
        const planPct=officeHoursNeeded>0?(plannedTotalH/officeHoursNeeded)*100:0;
        const totalOfficeH=alreadyDoneOfficeHours+plannedTotalH;
        const wfhH=Math.max(0,totalWorkableHours-totalOfficeH);
        const pctOffice=totalWorkableHours>0?Math.round((totalOfficeH/totalWorkableHours)*100):0;

        let html=`<div class="ep-sched-section">
            <div class="ep-sched-hdr">${icon('calendar',12,T.muted)}
                Office Schedule &nbsp;·&nbsp; <strong style="color:${T.text}">${officeHoursNeeded}h needed</strong> &nbsp;·&nbsp; ${alreadyDoneOfficeHours}h done &nbsp;·&nbsp; ${stillNeeded}h remaining
            </div>
            <div class="ep-hours-progress">
                <div class="ep-hours-prog-hdr"><span>Hours progress</span><span style="color:${T.text};font-weight:600;">${alreadyDoneOfficeHours}h / ${officeHoursNeeded}h</span></div>
                <div class="ep-hours-prog-track">
                    <div class="ep-hours-prog-done" style="width:${clamp(donePct,0,100).toFixed(1)}%;"></div>
                    <div class="ep-hours-prog-plan" style="width:${clamp(Math.min(planPct,100-donePct),0,100).toFixed(1)}%;"></div>
                </div>
                <div class="ep-sched-legend">
                    <span class="ep-sched-leg-item"><span class="ep-sched-leg-dot" style="background:#22c55e;"></span>Done (${alreadyDoneOfficeHours}h)</span>
                    <span class="ep-sched-leg-item"><span class="ep-sched-leg-dot" style="background:#3b82f6;"></span>Planned (${plannedTotalH}h)</span>
                    <span class="ep-sched-leg-item"><span class="ep-sched-leg-dot" style="background:#a855f7;"></span>WFH done</span>
                    <span class="ep-sched-leg-item"><span class="ep-sched-leg-dot" style="background:${T.isDark?'rgba(255,255,255,0.15)':'rgba(0,0,0,0.12)'};"></span>WFH/flex</span>
                </div>
            </div>`;

        // Calendar
        html+=`<div class="ep-cal-grid">`;
        ['M','T','W','T','F','S','S'].forEach(d=>html+=`<div class="ep-cal-dow">${d}</div>`);
        const firstDow=days[0]?.dayOfWeek??1;
        const colOffset=firstDow===0?6:firstDow-1;
        for(let i=0;i<colOffset;i++) html+=`<div class="ep-cal-day ep-cal-empty"></div>`;

        days.forEach(d=>{
            if(!d.dateNum){html+=`<div class="ep-cal-day ep-cal-empty"></div>`;return;}
            let cls='ep-cal-day ';
            let hrsLbl='';
            if(d.isWeekend)                cls+='ep-cal-weekend';
            else if(d.isAbsent||d.isHoliday) cls+='ep-cal-absent';
            else if(d.hasOffice){
                cls+='ep-cal-done-off';
                hrsLbl=`<span class="ep-cal-hrs">${d.officeMins>=60?Math.round(d.officeMins/60)+'h':d.officeMins+'m'}</span>`;
            }
            else if(d.hasWFH&&(d.isPast||d.isToday)) cls+='ep-cal-done-wfh';
            else if(d.isPast||d.isToday)              cls+='ep-cal-done-any';
            else if(plannedMap.has(d.dateNum)){
                cls+='ep-cal-plan-off';
                hrsLbl=`<span class="ep-cal-hrs">${plannedMap.get(d.dateNum)}h</span>`;
            }
            else cls+='ep-cal-plan-wfh';
            if(d.isToday) cls+=' ep-cal-today';
            html+=`<div class="${cls}" title="${d.label}">${d.dateNum}${hrsLbl}</div>`;
        });
        html+=`</div>`;

        // Week rows
        const weekBuckets=new Map();
        days.forEach(d=>{
            if(d.isWeekend||!d.dateNum) return;
            const wk=Math.floor((d.dateNum-1)/7);
            if(!weekBuckets.has(wk)) weekBuckets.set(wk,[]);
            weekBuckets.get(wk).push(d);
        });
        const DNAMES={1:'Mon',2:'Tue',3:'Wed',4:'Thu',5:'Fri'};
        html+=`<div class="ep-week-rows">`;
        let wn=0;
        weekBuckets.forEach(wdays=>{
            wn++;
            const offDoneH=wdays.reduce((s,d)=>s+(d.officeMins||0),0)/60;
            const plannedH=wdays.reduce((s,d)=>s+(plannedMap.get(d.dateNum)||0),0);
            const slotMap=new Map(wdays.map(d=>[d.dayOfWeek,d]));
            html+=`<div class="ep-week-row"><div class="ep-week-label">W${wn}</div><div class="ep-week-days">`;
            [1,2,3,4,5].forEach(dow=>{
                const d=slotMap.get(dow);
                if(!d){html+=`<div class="ep-week-day-pill ep-wp-off">—</div>`;return;}
                let cls='ep-week-day-pill ';
                let sub='';
                if(d.isAbsent||d.isHoliday){cls+='ep-wp-absent';}
                else if(d.hasOffice){cls+='ep-wp-done';sub=`<span class="ep-pill-sub">${Math.round(d.officeMins/60)}h</span>`;}
                else if(plannedMap.has(d.dateNum)){cls+='ep-wp-office';sub=`<span class="ep-pill-sub">${plannedMap.get(d.dateNum)}h</span>`;}
                else if(d.hasWFH){cls+='ep-wp-wfh';sub=`<span class="ep-pill-sub">WFH</span>`;}
                else{cls+='ep-wp-wfh';}
                html+=`<div class="${cls}" title="${d.label}">${DNAMES[dow]}${sub}</div>`;
            });
            html+=`</div><div class="ep-week-row-summary"><span>${Math.round(offDoneH*10)/10+plannedH}h</span> office</div></div>`;
        });
        html+=`</div>`;

        // Summary chips
        html+=`<div style="display:flex;gap:8px;flex-wrap:wrap;">
            <div class="ep-sched-stat" style="flex:1;min-width:70px;"><div class="ep-sched-stat-val" style="color:#22c55e;">${alreadyDoneOfficeHours}h</div><div class="ep-sched-stat-lbl">Done ✓</div></div>
            <div class="ep-sched-stat" style="flex:1;min-width:70px;"><div class="ep-sched-stat-val" style="color:#3b82f6;">${plannedTotalH}h</div><div class="ep-sched-stat-lbl">Planned</div></div>
            <div class="ep-sched-stat" style="flex:1;min-width:70px;"><div class="ep-sched-stat-val" style="color:#a855f7;">${wfhH}h</div><div class="ep-sched-stat-lbl">WFH/Flex</div></div>
            <div class="ep-sched-stat" style="flex:1;min-width:70px;"><div class="ep-sched-stat-val" style="color:${pctOffice>=offTarget?'#22c55e':'#f59e0b'};">${pctOffice}%</div><div class="ep-sched-stat-lbl">vs target</div></div>
        </div></div>`;
        return html;
    };

    /* ═══════════════════════════════════════════════════════════════
       OFFICE PLANNER PANEL HTML
    ═══════════════════════════════════════════════════════════════ */
    const buildOfficePlannerPanel = ({T,ds,days}) => {
        const isOpen=localStorage.getItem(LS.PLANNER_OPEN)==='true';
        const officeHoursNeeded=Math.round((ds.realRota*(offTarget/100))/60);
        const alreadyDoneOfficeHours=Math.round(
            days.filter(d=>d.hasOffice&&(d.isPast||d.isToday)).reduce((s,d)=>s+d.officeMins,0)/60
        );

        let html=`
        <div class="ep-planner-toggle" data-action="planner-toggle" role="button" tabindex="0">
            ${iconBadge('calendar','linear-gradient(135deg,#3b82f6,#a855f7)',26)}
            <span class="ep-planner-toggle-label">Office Planner
                <span class="ep-planner-toggle-sub"> · ${officeHoursNeeded}h needed this month</span>
            </span>
            ${icon(isOpen?'chevron_up':'chevron_down',14,T.muted)}
        </div>
        <div class="ep-planner-panel${isOpen?' open':''}" id="ep-planner-panel">
        <div class="ep-planner-inner">`;

        html+=buildScheduleSection({T,days,officeHoursNeeded,alreadyDoneOfficeHours});

        html+=`</div></div>`;
        return html;
    };

    /* ═══════════════════════════════════════════════════════════════
       INTERACTIONS
    ═══════════════════════════════════════════════════════════════ */
    const bindInteractions = container => {
        container.querySelectorAll('[data-action]').forEach(el=>{
            el.addEventListener('click', e=>{
                e.preventDefault();
                const action=el.dataset.action;
                if(action==='jump-today')    jumpToToday();
                if(action==='jump-analyzer') jumpToAnalyzer();
                if(action==='theme-toggle'){
                    themeOverride=el.dataset.theme;
                    localStorage.setItem(LS.THEME,themeOverride);
                    renderUI(); injectBackButton(getTheme());
                }
                if(action==='buf-toggle'){
                    localStorage.setItem(LS.TODAY_BUF,String(localStorage.getItem(LS.TODAY_BUF)!=='true'));
                    renderUI(); injectBackButton(getTheme());
                }
                if(action==='planner-toggle'){
                    localStorage.setItem(LS.PLANNER_OPEN,String(localStorage.getItem(LS.PLANNER_OPEN)!=='true'));
                    renderUI(); injectBackButton(getTheme());
                }
            });
        });
    };

    /* ═══════════════════════════════════════════════════════════════
       MAIN RENDER
    ═══════════════════════════════════════════════════════════════ */
    const renderUI = () => {
        const T=getTheme();
        injectStyles(T);
        const mainPanel=document.getElementById('mainTimesheetPanel');
        if(!mainPanel) return;
        let container=document.getElementById('ep13');
        if(!container){container=document.createElement('div');container.id='ep13';mainPanel.insertBefore(container,mainPanel.firstChild);}

        if(!isSummaryReady()){
            container.innerHTML=`<div class="ep-hdr"><div class="ep-hdr-logo">${icon('timer',16)}</div><div class="ep-hdr-title">eDays Analyzer Pro</div><div class="ep-hdr-date"><span class="ep-pulse"></span> Loading…</div></div>`;
            return;
        }

        const summary=getSummaryData();
        const {actMap,rawTotal,workedDays}=getActivityData();
        const dateStr=new Date().toLocaleDateString('en-GB',{day:'numeric',month:'short',year:'numeric'}).toUpperCase();

        /* Empty month: panel is ready but nothing logged yet */
        if(!summary.recorded && !rawTotal){
            const ds=getDayStats(summary);
            const detailedDays=getDetailedDayData();
            const nextTheme=T.isDark?'light':'dark';
            container.innerHTML=`
                <div class="ep-hdr">
                    <div class="ep-hdr-logo">${icon('timer',16)}</div>
                    <div class="ep-hdr-title">eDays Analyzer Pro</div>
                    <div class="ep-hdr-right">
                        <span class="ep-btn ep-btn-icon" data-action="theme-toggle" data-theme="${nextTheme}" title="${T.isDark?'Light':'Dark'} theme">${icon(T.isDark?'sun':'moon',14,T.muted)}</span>
                        <div class="ep-hdr-date"><span class="ep-pulse"></span>${dateStr}</div>
                    </div>
                </div>
                <div class="ep-empty">
                    <div class="ep-empty-icon">${icon('calendar',22,T.muted)}</div>
                    <div class="ep-empty-title">New month — no entries yet</div>
                    <div class="ep-empty-sub">Start logging time in eDays and the dashboard will populate automatically. The Office Planner is still available below.</div>
                </div>`;
            container.innerHTML+=buildOfficePlannerPanel({T,ds,days:detailedDays});
            bindInteractions(container);
            return;
        }

        const realRota=summary.rota-summary.absences-summary.holidays;
        const factor=summary.recorded/rawTotal;
        const acts=Object.entries(actMap).map(([n,m])=>({name:n,adj:Math.floor(m*factor)})).filter(a=>a.adj>0).sort((a,b)=>b.adj-a.adj);
        const totalActMins=acts.reduce((s,a)=>s+a.adj,0);
        const officeMins=(acts.find(a=>a.name==='Office')?.adj)||0;
        const targetMins=realRota*(offTarget/100);
        const officePct=targetMins>0?(officeMins/targetMins)*100:0;
        const officeActPct=realRota>0?(officeMins/realRota)*100:0;
        const rotaPct=realRota>0?(summary.recorded/realRota)*100:0;
        const ds=getDayStats(summary);
        const offColor=getOffColor(officePct);
        const rotaColor=rotaPct>=100?'#22c55e':rotaPct>=80?'#3b82f6':'#f59e0b';
        const nextTheme=T.isDark?'light':'dark';

        let html=`<div class="ep-hdr">
            <div class="ep-hdr-logo">${icon('timer',16)}</div>
            <div class="ep-hdr-title">eDays Analyzer Pro</div>
            <div class="ep-hdr-right">
                <span class="ep-btn ep-btn-icon" data-action="theme-toggle" data-theme="${nextTheme}" title="${T.isDark?'Light':'Dark'} theme">
                    ${icon(T.isDark?'sun':'moon',14,T.muted)}
                </span>
                <div class="ep-hdr-date"><span class="ep-pulse"></span>${dateStr}</div>
            </div>
        </div><div class="ep-grid">`;

        /* Card 1 */
        const totalActPct=realRota>0?(totalActMins/realRota)*100:0;
        html+=`<div class="ep-card"><div class="ep-card-title">Activity Breakdown</div>`;
        acts.forEach(({name,adj})=>{
            const cfg=ACT_CFG[name]||FALLBACK_CFG;
            const pct=realRota>0?(adj/realRota)*100:0;
            html+=`<div class="ep-act-row">${iconBadge(cfg.icon,cfg.bg,26)}<div class="ep-act-info"><div class="ep-act-name">${name}</div><div class="ep-act-meta">${fmt(adj)} · ${pct.toFixed(1)}%</div><div class="ep-bar"><div class="ep-bar-fill" style="width:${clamp(pct,0,100)}%;background:${cfg.grad};"></div></div></div></div>`;
        });
        html+=`<div class="ep-divider"></div><div class="ep-total-row"><span class="ep-total-label">Total logged</span><span class="ep-total-val">${fmt(totalActMins)} (${totalActPct.toFixed(1)}%)</span></div><div class="ep-bar"><div class="ep-bar-fill" style="width:${clamp(totalActPct,0,100)}%;background:linear-gradient(90deg,#3b82f6,#a855f7);"></div></div></div>`;

        /* Card 2 */
        const offRemH=Math.floor(Math.max(0,targetMins-officeMins)/60), offRemM=Math.max(0,targetMins-officeMins)%60;
        html+=`<div class="ep-card ep-ring-card"><div class="ep-card-title">Office Target · ${offTarget}%</div>
            <div class="ep-ring-wrap">${ring({r:54,pct:officePct,color:offColor,sw:6,trackColor:T.ringTrack})}
                <div class="ep-ring-center"><span class="ep-ring-pct" style="color:${offColor}">${officePct.toFixed(0)}%</span><span class="ep-ring-lbl">of target</span></div>
            </div>
            <div class="ep-stat-row"><span class="ep-stat-k">Actual</span><span class="ep-stat-v">${officeActPct.toFixed(1)}% of rota</span></div>
            <div class="ep-stat-row"><span class="ep-stat-k">Logged</span><span class="ep-stat-v">${fmt(officeMins)}</span></div>
            <div class="ep-stat-row"><span class="ep-stat-k">Target</span><span class="ep-stat-v">${fmt(targetMins)}</span></div>
            ${officePct<100?`<div class="ep-hint">${icon('today',12,T.muted)}<span>${offRemH}h${offRemM?' '+offRemM+'m':''} to hit ${offTarget}%</span></div>`:`<div class="ep-hint" style="color:#22c55e">${icon('check',12,'#22c55e')}<span>Office target met!</span></div>`}
        </div>`;

        /* Card 3 */
        html+=`<div class="ep-card ep-ring-card"><div class="ep-card-title">Time vs Rota</div>
            <div class="ep-ring-wrap">${ring({r:54,pct:rotaPct,color:rotaColor,sw:6,trackColor:T.ringTrack})}
                <div class="ep-ring-center"><span class="ep-ring-pct" style="color:${rotaColor}">${rotaPct.toFixed(0)}%</span><span class="ep-ring-lbl">rota</span></div>
            </div>
            <div class="ep-stat-row"><span class="ep-stat-k">Recorded</span><span class="ep-stat-v">${fmt(summary.recorded)}</span></div>
            <div class="ep-stat-row"><span class="ep-stat-k">Real Rota</span><span class="ep-stat-v">${fmt(realRota)}</span></div>
            <div class="ep-stat-row"><span class="ep-stat-k">Absences</span><span class="ep-stat-v">${fmt(summary.absences)}</span></div>
            <div class="ep-stat-row"><span class="ep-stat-k">Holidays</span><span class="ep-stat-v">${fmt(summary.holidays)}</span></div>
            <div class="ep-stat-row"><span class="ep-stat-k">Days worked</span><span class="ep-stat-v">${workedDays}d</span></div>
        </div>`;

        /* Card 4 */
        const bc=ds.bufferMinutes>0?'pos':ds.bufferMinutes<0?'neg':'zer';
        const bi=ds.bufferMinutes>0?'trending_up':ds.bufferMinutes<0?'trending_down':'trending_flat';
        const bCol=ds.bufferMinutes>0?'#22c55e':ds.bufferMinutes<0?'#ef4444':T.muted;
        html+=`<div class="ep-card"><div class="ep-card-title">Buffer &amp; Outlook</div>
            <div class="ep-buf-top">${icon(bi,20,bCol)}<span class="ep-buf-val ${bc}">${fmt(ds.bufferMinutes)}</span><span class="ep-buf-sub">${ds.bufferMinutes>=0?'ahead of':'behind'} daily target<br>vs past days</span></div>
            <div class="ep-chip-grid">
                <div class="ep-chip"><div class="ep-chip-val">${ds.workableDays}</div><div class="ep-chip-lbl">Workable</div></div>
                <div class="ep-chip"><div class="ep-chip-val" style="color:#3b82f6">${ds.officeStreak}</div><div class="ep-chip-lbl">Office Streak</div></div>
                <div class="ep-chip"><div class="ep-chip-val" style="color:#a855f7">${ds.daysLeft}</div><div class="ep-chip-lbl">Days Left</div></div>
                <div class="ep-chip"><div class="ep-chip-val" style="color:#f59e0b">${ds.workedDays}</div><div class="ep-chip-lbl">Worked</div></div>
            </div>
            <div class="ep-prog-wrap">
                <div class="ep-prog-hdr"><span>Month progress</span><span>${ds.progressPct.toFixed(0)}%</span></div>
                <div class="ep-prog-track"><div class="ep-prog-fill" style="width:${clamp(ds.progressPct,0,100).toFixed(1)}%"></div></div>
            </div>
            <div class="ep-notices">
                ${ds.daysLeft>0?`<div class="ep-notice">${icon('calendar',12,T.muted)}<span>${ds.daysLeft}d left · ${fmt(ds.daysLeft*480)} remaining</span></div>`:''}
                ${ds.bufferMinutes>0?`<div class="ep-notice good">${icon('savings',12,'#22c55e')}<span>${fmt(ds.bufferMinutes)} banked</span></div>`:ds.bufferMinutes<0?`<div class="ep-notice warn">${icon('warning',12,'#ef4444')}<span>${fmt(Math.abs(ds.bufferMinutes))} deficit</span></div>`:`<div class="ep-notice">${icon('flag',12,T.muted)}<span>Exactly on target!</span></div>`}
                <div class="ep-notice">${icon('flag',12,T.muted)}<span>Month target: ${fmt(ds.realRota)}</span></div>
            </div>
        </div>`;

        html+=`</div>`; // close grid

        /* Today strip */
        const todayBufOn=localStorage.getItem(LS.TODAY_BUF)==='true';
        const todayWorked=getTodayMinutes();
        const effTarget=todayBufOn?Math.max(0,480-ds.bufferMinutes):480;
        const todayPct=effTarget>0?Math.min(100,(todayWorked/effTarget)*100):0;
        const todayDone=todayWorked>=effTarget;
        html+=`<div class="ep-today-strip">
            <div class="ep-today-label">${iconBadge('timer','#1d4ed8',26)}<span class="ep-today-label-text">Today</span></div>
            <div class="ep-today-centre">
                <div class="ep-today-nums-row">
                    <span class="ep-today-done">${fmt(todayWorked)}</span>
                    <span class="ep-today-sep">/</span>
                    <span class="ep-today-total">${fmt(effTarget)}</span>
                    ${todayDone?`<span class="ep-today-rem done">${icon('check',12,'#22c55e')} Day complete!</span>`:`<span class="ep-today-rem">${icon('timer',12,T.muted)} ${fmt(Math.max(0,effTarget-todayWorked))} left</span>`}
                </div>
                <div class="ep-today-track"><div class="ep-today-fill" style="width:${todayPct.toFixed(1)}%;background:${todayDone?'#22c55e':'#3b82f6'};"></div></div>
            </div>
            <div class="ep-today-actions">
                <span class="ep-btn ep-btn-pill" data-action="buf-toggle">
                    <span class="ep-toggle-track" style="background:${todayBufOn?'#3b82f6':T.barTrack};"><span class="ep-toggle-thumb" style="left:${todayBufOn?'14px':'2px'};"></span></span>
                    Include buffer
                </span>
                ${hasTodayOnPage()?`<span class="ep-btn ep-btn-label" data-action="jump-today">${icon('arrow_down',13,T.muted)} Jump to today</span>`:''}
            </div>
        </div>`;

        /* Office Planner panel */
        html+=buildOfficePlannerPanel({T,ds,days:getDetailedDayData()});

        container.innerHTML=html;
        bindInteractions(container);
    };

    /* ═══════════════════════════════════════════════════════════════
       BACK BUTTON
    ═══════════════════════════════════════════════════════════════ */
    const BACK_BTN_ID='ep-back-chip';
    const injectBackButton = T => {
        document.getElementById(BACK_BTN_ID)?.remove();
        const chip = document.querySelector('.today_chip');
        const cont = chip?.closest('.tt_day_container');
        if(!cont) return;
        const btn = document.createElement('span');
        btn.id = BACK_BTN_ID; btn.role = 'button'; btn.tabIndex = 0;
        btn.innerHTML = `<span style="display:inline-flex;align-items:center;justify-content:center;width:13px;height:13px;color:currentColor;">${ICONS.arrow_up}</span> Back to analyzer`;
        btn.style.cssText = `display:inline-flex;align-items:center;gap:5px;font-size:12px;font-weight:500;cursor:pointer;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',system-ui,sans-serif;padding:4px 10px;border-radius:7px;border:1px solid ${T.border};background:${T.surface};color:${T.muted};margin-bottom:6px;user-select:none;white-space:nowrap;transition:background .15s,color .15s,border-color .15s;`;
        btn.addEventListener('click', e => { e.preventDefault(); jumpToAnalyzer(); });
        btn.addEventListener('mouseenter', () => {
            btn.style.setProperty('background', T.isDark ? '#2e2e2e' : '#ebebeb', 'important');
            btn.style.setProperty('color', T.isDark ? '#e8e8e8' : '#111827', 'important');
            btn.style.setProperty('border-color', T.isDark ? 'rgba(255,255,255,0.18)' : 'rgba(0,0,0,0.15)', 'important');
        });
        btn.addEventListener('mouseleave', () => {
            btn.style.setProperty('background', T.surface, 'important');
            btn.style.setProperty('color', T.muted, 'important');
            btn.style.setProperty('border-color', T.border, 'important');
        });
        cont.insertBefore(btn, cont.firstChild);
    };

    /* ═══════════════════════════════════════════════════════════════
       BOOT
    ═══════════════════════════════════════════════════════════════ */
    const boot = () => {
        const tick=setInterval(()=>{
            if(document.querySelector('.tt_day_container')&&document.querySelector('.desktop_summary')){
                clearInterval(tick);
                renderUI();
                injectBackButton(getTheme());

                let debounce=null;
                const observer=new MutationObserver(mutations=>{
                    const ep=document.getElementById('ep13');
                    const bb=document.getElementById(BACK_BTN_ID);
                    if(mutations.every(m=>(ep&&(ep.contains(m.target)||ep===m.target))||(bb&&(bb.contains(m.target)||bb===m.target)))) return;
                    clearTimeout(debounce);
                    debounce=setTimeout(()=>{renderUI();if(!document.getElementById(BACK_BTN_ID))injectBackButton(getTheme());},600);
                });
                const panel=document.getElementById('mainTimesheetPanel');
                if(panel) observer.observe(panel,{childList:true,subtree:true,characterData:true});
                setInterval(renderUI,30000);
            }
        },800);
    };

    boot();
})();
