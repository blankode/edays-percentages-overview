// ==UserScript==
// @name         eDays Analyzer Pro
// @namespace    http://tampermonkey.net/
// @version      17.1
// @match        https://*.e-days.com/*
// @grant        GM_xmlhttpRequest
// @connect      router.project-osrm.org
// @connect      nominatim.openstreetmap.org
// @updateURL    https://raw.githubusercontent.com/blankode/edays-percentages-overview/main/script.js
// @downloadURL  https://raw.githubusercontent.com/blankode/edays-percentages-overview/main/script.js
// ==/UserScript==

/* ══ Set Office Target (% of rota hours) ══ */
const offTarget = 60;

(function () {
    'use strict';

    /* ═══════════════════════════════════════════════════════════════
       OFFICE REGISTRY
    ═══════════════════════════════════════════════════════════════ */
    const OFFICES = {
        timisoara: {
            label: 'Timișoara · UBC1',
            city: 'Timișoara, Romania',
            country: 'RO',
            lat: 45.7537, lng: 21.2257,
            address: 'Piața Consiliul Europei 2A, Clădirea UBC1, Timișoara',
            modes: ['car', 'bike', 'walk'],
        },
        munich: {
            label: 'München · Aschauer Str.',
            city: 'München, Germany',
            country: 'DE',
            lat: 48.0966, lng: 11.6176,
            address: 'Aschauer Straße 30, 81549 München',
            modes: ['car', 'bike', 'walk'],
        },
        frankfurt: {
            label: 'Frankfurt · Hahnstraße',
            city: 'Frankfurt, Germany',
            country: 'DE',
            lat: 50.0795, lng: 8.6437,
            address: 'Hahnstraße 68-70, 60528 Frankfurt am Main',
            modes: ['car', 'bike', 'walk'],
        },
        erfurt: {
            label: 'Erfurt · Europaplatz',
            city: 'Erfurt, Germany',
            country: 'DE',
            lat: 50.9727, lng: 11.0310,
            address: 'Europaplatz 1, 99091 Erfurt',
            modes: ['car', 'bike', 'walk'],
        },
        vienna: {
            label: 'Wien · Schönbrunner Schlossstr.',
            city: 'Wien, Austria',
            country: 'AT',
            lat: 48.1858, lng: 16.3254,
            address: 'Schönbrunner Schloßstraße 2, 1120 Wien',
            modes: ['car', 'bike', 'walk'],
        },
        paris: {
            label: 'Paris · Rue de Trévise',
            city: 'Paris, France',
            country: 'FR',
            lat: 48.8745, lng: 2.3462,
            address: '32 rue de Trévise, 75009 Paris',
            modes: ['car', 'bike', 'walk'],
        },
        venice: {
            label: 'Venezia · Santa Croce',
            city: 'Venezia, Italy',
            country: 'IT',
            lat: 45.4408, lng: 12.3192,
            address: 'Santa Croce 207, 30135 Venezia',
            modes: ['walk'],
        },
        lisbon: {
            label: 'Lisbon · Praça da Armada',
            city: 'Lisbon, Portugal',
            country: 'PT',
            lat: 38.7075, lng: -9.1531,
            address: 'Praça da Armada 7D, 1350-259 Lisboa',
            modes: ['car', 'bike', 'walk'],
        },
        madrid: {
            label: 'Madrid · Cedaceros',
            city: 'Madrid, Spain',
            country: 'ES',
            lat: 40.4162, lng: -3.6997,
            address: 'C/ Cedaceros 10, 4ª Izq., 28014 Madrid',
            modes: ['car', 'bike', 'walk'],
        },
        wallisellen: {
            label: 'Wallisellen · Richtistrasse',
            city: 'Wallisellen, Switzerland',
            country: 'CH',
            lat: 47.4103, lng: 8.5979,
            address: 'Richtistrasse 7, 8304 Wallisellen',
            modes: ['car', 'bike', 'walk'],
        },
        newbury: {
            label: 'Newbury · Greenham Business Park',
            city: 'Newbury, UK',
            country: 'GB',
            lat: 51.3771, lng: -1.2719,
            address: '2 Communications Road, Greenham Business Park, RG19 6AB',
            modes: ['car', 'bike', 'walk'],
        },
        secaucus: {
            label: 'Secaucus NJ · HQ North America',
            city: 'Secaucus, NJ, USA',
            country: 'US',
            lat: 40.7895, lng: -74.0566,
            address: '300 Lighting Way Suite 315, Secaucus NJ 07094',
            modes: ['car'],
        },
        hingham: {
            label: 'Hingham MA · Massachusetts',
            city: 'Hingham, MA, USA',
            country: 'US',
            lat: 42.2415, lng: -70.8898,
            address: '350 Lincoln Street Suite 2400, Hingham MA 02043',
            modes: ['car'],
        },
        burlington: {
            label: 'Burlington VT · Vermont',
            city: 'Burlington, VT, USA',
            country: 'US',
            lat: 44.4759, lng: -73.2121,
            address: '3 Main Street Suite 213, Burlington VT 05401',
            modes: ['car', 'bike', 'walk'],
        },
    };

    /* OSRM profile names per mode */
    const OSRM_PROFILE = { car: 'driving', bike: 'cycling', walk: 'foot' };

    /* Road/path tortuosity factors & speeds used for fallback estimation */
    const MODE_ESTIMATE = {
        car:  { speedKmh: 35, factor: 1.35 },
        bike: { speedKmh: 16, factor: 1.20 },
        walk: { speedKmh: 5,  factor: 1.15 },
    };

    /* Visual config per mode */
    const TRANSPORT_MODES = {
        car:  { label: 'Drive', icon: 'car',  color: '#f97316', grad: 'linear-gradient(135deg,#f97316,#ef4444)', bg: '#92400e' },
        bike: { label: 'Cycle', icon: 'bike', color: '#22c55e', grad: 'linear-gradient(135deg,#22c55e,#16a34a)', bg: '#14532d' },
        walk: { label: 'Walk',  icon: 'walk', color: '#3b82f6', grad: 'linear-gradient(135deg,#3b82f6,#6366f1)', bg: '#1e3a8a' },
    };

    /* ═══════════════════════════════════════════════════════════════
       LOCALSTORAGE KEYS
    ═══════════════════════════════════════════════════════════════ */
    const LS = {
        THEME:        'ep-theme-override',
        TODAY_BUF:    'ep-today-buffer',
        COMMUTE_OPEN: 'ep-commute-open',
        OFFICE:       'ep-office-key',
        MODE:         'ep-commute-mode',
        HOME_LAT:     'ep-home-lat',
        HOME_LNG:     'ep-home-lng',
        HOME_LABEL:   'ep-home-label',
        ROUTE_CACHE:  'ep-route-cache-v2',
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

    /* Haversine straight-line distance in km */
    const haversineKm = (lat1,lng1,lat2,lng2) => {
        const R=6371, dLat=(lat2-lat1)*Math.PI/180, dLng=(lng2-lng1)*Math.PI/180;
        const a=Math.sin(dLat/2)**2+Math.cos(lat1*Math.PI/180)*Math.cos(lat2*Math.PI/180)*Math.sin(dLng/2)**2;
        return R*2*Math.atan2(Math.sqrt(a),Math.sqrt(1-a));
    };

    /* Estimated travel minutes when OSRM unavailable */
    const estimateMins = (distKm, mode) => {
        const cfg = MODE_ESTIMATE[mode]||MODE_ESTIMATE.car;
        return Math.round((distKm * cfg.factor / cfg.speedKmh) * 60);
    };

    /* ═══════════════════════════════════════════════════════════════
       SCROLL HELPERS
    ═══════════════════════════════════════════════════════════════ */
    const smoothScrollTo = (el, offset=-165) => { if(!el) return; window.scrollTo({ top:el.getBoundingClientRect().top+window.scrollY+offset, behavior:'smooth' }); };
    const jumpToToday    = () => { const c=document.querySelector('.today_chip'); smoothScrollTo(c?(c.closest('.tt_day_container')||c):null); };
    const jumpToAnalyzer = () => smoothScrollTo(document.getElementById('ep13'));

    /* ═══════════════════════════════════════════════════════════════
       OSRM via GM_xmlhttpRequest  (bypasses page CSP)
    ═══════════════════════════════════════════════════════════════ */
    const CACHE_TTL = 6*60*60*1000;

    const getRouteCache = () => { try { return JSON.parse(localStorage.getItem(LS.ROUTE_CACHE)||'{}'); } catch { return {}; } };
    const setRouteCache = c => { try { localStorage.setItem(LS.ROUTE_CACHE,JSON.stringify(c)); } catch {} };

    const gmFetch = (url) => new Promise((resolve,reject) => {
        if (typeof GM_xmlhttpRequest === 'undefined') { reject(new Error('GM_xmlhttpRequest unavailable')); return; }
        GM_xmlhttpRequest({
            method: 'GET', url,
            timeout: 10000,
            onload:  r => { try { resolve(JSON.parse(r.responseText)); } catch(e) { reject(e); } },
            onerror: e => reject(e),
            ontimeout: () => reject(new Error('timeout')),
        });
    });

    const fetchRoute = async (homeLat, homeLng, officeLat, officeLng, mode) => {
        const profile = OSRM_PROFILE[mode]||'driving';
        const cacheKey = `${profile}|${homeLat.toFixed(4)},${homeLng.toFixed(4)}|${officeLat.toFixed(4)},${officeLng.toFixed(4)}`;
        const cache = getRouteCache();
        const hit = cache[cacheKey];
        if (hit && (Date.now()-hit.ts)<CACHE_TTL) return { ...hit, estimated: !!hit.estimated };

        const straight = haversineKm(homeLat,homeLng,officeLat,officeLng);

        try {
            const url = `https://router.project-osrm.org/route/v1/${profile}/` +
                `${homeLng.toFixed(6)},${homeLat.toFixed(6)};${officeLng.toFixed(6)},${officeLat.toFixed(6)}` +
                `?overview=false`;
            const data = await gmFetch(url);
            if (data.code==='Ok' && data.routes?.length) {
                const r = data.routes[0];
                const mins = Math.round(r.duration/60);
                const distanceKm = Math.round((r.distance/1000)*10)/10;
                const result = { mins, distanceKm, estimated:false, ts:Date.now() };
                cache[cacheKey] = result;
                setRouteCache(cache);
                return result;
            }
        } catch(_) { /* fall through to estimate */ }

        const distanceKm = Math.round(straight*10)/10;
        const mins = estimateMins(straight, mode);
        const result = { mins, distanceKm, estimated:true, ts:Date.now() };
        cache[cacheKey] = result;
        setRouteCache(cache);
        return result;
    };

    const reverseGeocode = (lat, lng) => new Promise(resolve => {
        const url = `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`;
        try {
            gmFetch(url).then(j => {
                const a = j.address||{};
                const suburb = a.suburb||a.neighbourhood||a.village||'';
                const city   = a.city||a.town||a.municipality||'';
                resolve([suburb,city].filter(Boolean).join(', ') || `${lat.toFixed(3)},${lng.toFixed(3)}`);
            }).catch(()=>resolve(`${lat.toFixed(3)},${lng.toFixed(3)}`));
        } catch { resolve(`${lat.toFixed(3)},${lng.toFixed(3)}`); }
    });

    /* Geocode a free-text address string via Nominatim */
    const geocodeAddress = (query) => new Promise(resolve => {
        const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=1`;
        try {
            gmFetch(url).then(results => {
                if (results && results.length) {
                    resolve({ lat: parseFloat(results[0].lat), lng: parseFloat(results[0].lon), label: results[0].display_name.split(',').slice(0,3).join(',').trim() });
                } else {
                    resolve(null);
                }
            }).catch(() => resolve(null));
        } catch { resolve(null); }
    });

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
        car:`<svg viewBox="0 0 24 24" fill="currentColor"><path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z"/></svg>`,
        bike:`<svg viewBox="0 0 24 24" fill="currentColor"><path d="M15.5 5.5c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zM5 12c-2.8 0-5 2.2-5 5s2.2 5 5 5 5-2.2 5-5-2.2-5-5-5zm0 8.5c-1.9 0-3.5-1.6-3.5-3.5s1.6-3.5 3.5-3.5 3.5 1.6 3.5 3.5-1.6 3.5-3.5 3.5zm5.8-10l2.4-2.4.8.8c1.3 1.3 3 2.1 5.1 2.1V9c-1.5 0-2.7-.6-3.6-1.5l-1.9-1.9c-.5-.4-1-.6-1.6-.6s-1.1.2-1.4.6L7.8 8.4C7.3 8.8 7 9.4 7 10c0 .6.3 1.2.8 1.6l3.2 2.4V18h2v-5l-3.2-2.5.8-.8zM19 12c-2.8 0-5 2.2-5 5s2.2 5 5 5 5-2.2 5-5-2.2-5-5-5zm0 8.5c-1.9 0-3.5-1.6-3.5-3.5s1.6-3.5 3.5-3.5 3.5 1.6 3.5 3.5-1.6 3.5-3.5 3.5z"/></svg>`,
        walk:`<svg viewBox="0 0 24 24" fill="currentColor"><path d="M13.49 5.48c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm-3.6 13.9l1-4.4 2.1 2v6h2v-7.5l-2.1-2 .6-3c1.3 1.5 3.3 2.5 5.5 2.5v-2c-1.9 0-3.5-1-4.3-2.4l-1-1.6c-.4-.6-1-1-1.7-1-.3 0-.5.1-.8.1l-5.2 2.2v4.7h2v-3.4l1.8-.7-1.6 8.1-4.9-1-.4 2 7 1.4z"/></svg>`,
        chevron_down:`<svg viewBox="0 0 24 24" fill="currentColor"><path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z"/></svg>`,
        chevron_up:`<svg viewBox="0 0 24 24" fill="currentColor"><path d="M7.41 15.41L12 10.83l4.59 4.58L18 14l-6-6-6 6 1.41 1.41z"/></svg>`,
        map_pin:`<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>`,
        lightbulb:`<svg viewBox="0 0 24 24" fill="currentColor"><path d="M9 21c0 .55.45 1 1 1h4c.55 0 1-.45 1-1v-1H9v1zm3-19C8.14 2 5 5.14 5 9c0 2.38 1.19 4.47 3 5.74V17c0 .55.45 1 1 1h6c.55 0 1-.45 1-1v-2.26c1.81-1.27 3-3.36 3-5.74 0-3.86-3.14-7-7-7z"/></svg>`,
        home:`<svg viewBox="0 0 24 24" fill="currentColor"><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/></svg>`,
        pin_drop:`<svg viewBox="0 0 24 24" fill="currentColor"><path d="M18 8c0-3.31-2.69-6-6-6S6 4.69 6 8c0 4.5 6 11 6 11s6-6.5 6-11zm-8 0c0-1.1.9-2 2-2s2 .9 2 2-.9 2-2 2-2-.9-2-2zM5 20v2h14v-2H5z"/></svg>`,
        refresh:`<svg viewBox="0 0 24 24" fill="currentColor"><path d="M17.65 6.35C16.2 4.9 14.21 4 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08c-.82 2.33-3.04 4-5.65 4-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z"/></svg>`,
        info:`<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/></svg>`,
        globe:`<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/></svg>`,
        edit:`<svg viewBox="0 0 24 24" fill="currentColor"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/></svg>`,
        search:`<svg viewBox="0 0 24 24" fill="currentColor"><path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/></svg>`,
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
        const soFar=Math.max(0,workableDays-daysLeft);
        const todayIdx=allDays.findIndex(d=>d.querySelector('.today_chip'));
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
        return {workableDays,soFar,daysLeft,workedDays,progressPct,bufferMinutes,realRota};
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
    const STYLE_ID='edays-pro-v17-styles';
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
        /* COMMUTE */
        #ep13 .ep-commute-toggle{margin-top:8px;display:flex;align-items:center;gap:8px;padding:8px 14px;background:${T.surface};border:1px solid ${T.border};border-radius:10px;cursor:pointer;user-select:none;transition:background .15s;}
        #ep13 .ep-commute-toggle:hover{background:${T.isDark?'rgba(255,255,255,0.06)':'rgba(0,0,0,0.04)'};}
        #ep13 .ep-commute-toggle-label{flex:1;font-size:12px;font-weight:600;letter-spacing:0.8px;text-transform:uppercase;color:${T.muted};}
        #ep13 .ep-commute-toggle-sub{font-size:11px;font-weight:400;color:${T.muted};opacity:.7;letter-spacing:0;text-transform:none;}
        #ep13 .ep-commute-panel{overflow:hidden;max-height:0;opacity:0;transition:max-height .35s ease,opacity .25s ease,margin-top .25s ease;margin-top:0;}
        #ep13 .ep-commute-panel.open{max-height:3000px;opacity:1;margin-top:8px;}
        #ep13 .ep-commute-inner{background:${T.surface};border:1px solid ${T.border};border-radius:10px;padding:14px 16px;display:flex;flex-direction:column;gap:14px;}
        #ep13 .ep-office-selector{display:flex;flex-direction:column;gap:6px;}
        #ep13 .ep-office-select-label{font-size:10px;font-weight:700;letter-spacing:1px;text-transform:uppercase;color:${T.muted};}
        #ep13 select.ep-office-select{width:100%;padding:7px 10px;border-radius:7px;border:1px solid ${T.border};background:${T.bg};color:${T.text};font-size:13px;font-weight:500;outline:none;cursor:pointer;font-family:inherit;appearance:none;-webkit-appearance:none;background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23888'%3E%3Cpath d='M7 10l5 5 5-5z'/%3E%3C/svg%3E");background-repeat:no-repeat;background-position:right 8px center;background-size:16px;padding-right:28px;}
        #ep13 select.ep-office-select:focus{border-color:#3b82f6;}
        #ep13 .ep-office-address{font-size:11px;color:${T.muted};display:flex;align-items:center;gap:4px;}
        #ep13 .ep-home-row{display:flex;align-items:center;gap:8px;flex-wrap:wrap;}
        #ep13 .ep-home-coords{font-size:11px;color:${T.muted};font-family:monospace;}
        #ep13 .ep-locate-btn{display:inline-flex;align-items:center;gap:5px;padding:5px 10px;border-radius:7px;cursor:pointer;border:1px solid ${T.border};background:${T.chipBg};font-size:12px;font-weight:500;color:${T.muted};user-select:none;transition:all .15s;}
        #ep13 .ep-locate-btn:hover{color:${T.text};border-color:${T.isDark?'rgba(255,255,255,0.2)':'rgba(0,0,0,0.18)'};}
        #ep13 .ep-locate-btn.loading{opacity:.6;pointer-events:none;}
        /* Manual address input */
        #ep13 .ep-addr-form{display:flex;gap:6px;margin-top:6px;flex-wrap:wrap;}
        #ep13 input.ep-addr-input{flex:1;min-width:160px;padding:6px 10px;border-radius:7px;border:1px solid ${T.border};background:${T.bg};color:${T.text};font-size:12px;font-family:inherit;outline:none;}
        #ep13 input.ep-addr-input:focus{border-color:#3b82f6;}
        #ep13 input.ep-addr-input::placeholder{color:${T.muted};}
        #ep13 .ep-addr-submit{display:inline-flex;align-items:center;gap:5px;padding:6px 12px;border-radius:7px;cursor:pointer;border:1px solid rgba(59,130,246,.4);background:rgba(59,130,246,.12);font-size:12px;font-weight:600;color:#3b82f6;user-select:none;transition:all .15s;white-space:nowrap;}
        #ep13 .ep-addr-submit:hover{background:rgba(59,130,246,.22);}
        #ep13 .ep-addr-submit.loading{opacity:.6;pointer-events:none;}
        #ep13 .ep-addr-error{font-size:11px;color:#ef4444;display:flex;align-items:center;gap:4px;margin-top:3px;}
        #ep13 .ep-cmute-controls{display:flex;align-items:flex-start;gap:16px;flex-wrap:wrap;}
        #ep13 .ep-cmute-ctrl-group{display:flex;flex-direction:column;gap:5px;}
        #ep13 .ep-cmute-ctrl-label{font-size:10px;font-weight:700;letter-spacing:1px;text-transform:uppercase;color:${T.muted};}
        #ep13 .ep-mode-btns{display:flex;gap:5px;}
        #ep13 .ep-mode-btn{display:inline-flex;align-items:center;gap:5px;padding:5px 10px;border-radius:7px;cursor:pointer;border:1px solid ${T.border};background:${T.chipBg};font-size:12px;font-weight:500;color:${T.muted};transition:all .15s;user-select:none;}
        #ep13 .ep-mode-btn:hover{color:${T.text};}
        #ep13 .ep-mode-btn.active{font-weight:600;color:#fff;}
        #ep13 .ep-mode-btn.disabled{opacity:.3;pointer-events:none;}
        #ep13 .ep-route-strip{display:flex;align-items:center;gap:10px;padding:9px 12px;background:${T.isDark?'rgba(59,130,246,0.07)':'rgba(59,130,246,0.05)'};border:1px solid ${T.isDark?'rgba(59,130,246,0.15)':'rgba(59,130,246,0.12)'};border-radius:8px;font-size:12px;flex-wrap:wrap;}
        #ep13 .ep-route-val{font-size:18px;font-weight:800;letter-spacing:-0.5px;line-height:1;}
        #ep13 .ep-route-divider{width:1px;height:28px;background:${T.border};}
        #ep13 .ep-route-fetching{font-size:12px;color:${T.muted};display:flex;align-items:center;gap:6px;}
        @keyframes ep-spin{to{transform:rotate(360deg);}}
        #ep13 .ep-spin{animation:ep-spin 1s linear infinite;display:inline-flex;}
        #ep13 .ep-cmute-stats{display:grid;grid-template-columns:repeat(4,1fr);gap:8px;}
        #ep13 .ep-cmute-stat{background:${T.chipBg};border:1px solid ${T.border};border-radius:8px;padding:9px 10px;text-align:center;}
        #ep13 .ep-cmute-stat-val{font-size:18px;font-weight:700;line-height:1;}
        #ep13 .ep-cmute-stat-lbl{font-size:10px;color:${T.muted};text-transform:uppercase;letter-spacing:.8px;margin-top:3px;}
        #ep13 .ep-cmute-compare{display:flex;flex-direction:column;gap:7px;}
        #ep13 .ep-cmute-cmp-row{display:flex;align-items:center;gap:8px;}
        #ep13 .ep-cmute-cmp-label{font-size:12px;font-weight:600;min-width:44px;}
        #ep13 .ep-cmute-cmp-bar-wrap{flex:1;height:6px;background:${T.barTrack};border-radius:4px;overflow:hidden;}
        #ep13 .ep-cmute-cmp-bar{height:100%;border-radius:4px;transition:width .4s ease;}
        #ep13 .ep-cmute-cmp-time{font-size:12px;color:${T.muted};min-width:50px;text-align:right;font-weight:500;}
        #ep13 .ep-cmute-insight{display:flex;align-items:flex-start;gap:8px;padding:10px 12px;background:${T.isDark?'rgba(59,130,246,0.08)':'rgba(59,130,246,0.06)'};border:1px solid ${T.isDark?'rgba(59,130,246,0.18)':'rgba(59,130,246,0.14)'};border-radius:8px;font-size:12px;color:${T.text};line-height:1.55;}
        #ep13 .ep-cmute-insight strong{color:#3b82f6;}
        #ep13 .ep-estimated-badge{display:inline-flex;align-items:center;gap:3px;font-size:10px;color:#f59e0b;background:rgba(245,158,11,0.12);border:1px solid rgba(245,158,11,0.25);border-radius:4px;padding:2px 6px;white-space:nowrap;}
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
       ROUTE STATE
    ═══════════════════════════════════════════════════════════════ */
    let _routeState = { status:'idle', oneWayMins:null, distanceKm:null, estimated:false, officeKey:null, mode:null };

    const currentRouteKey = () => {
        const hLat=parseFloat(localStorage.getItem(LS.HOME_LAT)||'0');
        const hLng=parseFloat(localStorage.getItem(LS.HOME_LNG)||'0');
        const ok=localStorage.getItem(LS.OFFICE)||'timisoara';
        const m=localStorage.getItem(LS.MODE)||'car';
        return `${ok}|${m}|${hLat.toFixed(4)},${hLng.toFixed(4)}`;
    };

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
            <div class="ep-cmute-stat" style="flex:1;min-width:70px;"><div class="ep-cmute-stat-val" style="color:#22c55e;">${alreadyDoneOfficeHours}h</div><div class="ep-cmute-stat-lbl">Done ✓</div></div>
            <div class="ep-cmute-stat" style="flex:1;min-width:70px;"><div class="ep-cmute-stat-val" style="color:#3b82f6;">${plannedTotalH}h</div><div class="ep-cmute-stat-lbl">Planned</div></div>
            <div class="ep-cmute-stat" style="flex:1;min-width:70px;"><div class="ep-cmute-stat-val" style="color:#a855f7;">${wfhH}h</div><div class="ep-cmute-stat-lbl">WFH/Flex</div></div>
            <div class="ep-cmute-stat" style="flex:1;min-width:70px;"><div class="ep-cmute-stat-val" style="color:${pctOffice>=offTarget?'#22c55e':'#f59e0b'};">${pctOffice}%</div><div class="ep-cmute-stat-lbl">vs target</div></div>
        </div></div>`;
        return html;
    };

    /* ═══════════════════════════════════════════════════════════════
       COMMUTE PANEL HTML
    ═══════════════════════════════════════════════════════════════ */
    const buildCommutePanel = ({T,ds,days}) => {
        const isOpen=localStorage.getItem(LS.COMMUTE_OPEN)==='true';
        const officeKey=localStorage.getItem(LS.OFFICE)||'timisoara';
        const office=OFFICES[officeKey]||OFFICES.timisoara;
        const mode=localStorage.getItem(LS.MODE)||office.modes[0]||'car';
        const modeCfg=TRANSPORT_MODES[mode];
        const homeLat=parseFloat(localStorage.getItem(LS.HOME_LAT)||'0');
        const homeLng=parseFloat(localStorage.getItem(LS.HOME_LNG)||'0');
        const homeLabel=localStorage.getItem(LS.HOME_LABEL)||'';
        const hasHome=!!(homeLat&&homeLng);

        const officeHoursNeeded=Math.round((ds.realRota*(offTarget/100))/60);
        const alreadyDoneOfficeHours=Math.round(
            days.filter(d=>d.hasOffice&&(d.isPast||d.isToday)).reduce((s,d)=>s+d.officeMins,0)/60
        );
        const stillNeeded=Math.max(0,officeHoursNeeded-alreadyDoneOfficeHours);
        const officeDaysInMonth=Math.ceil(officeHoursNeeded/8);
        const workableDays=days.filter(d=>d.isWorkable).length;
        const wfhDays=Math.max(0,workableDays-officeDaysInMonth);

        const rs=_routeState;
        const routeReady=rs.status==='ok'&&rs.oneWayMins!=null;
        const routeLoading=rs.status==='loading';
        const roundTripMins=routeReady?rs.oneWayMins*2:null;
        const monthlyCommuteMins=routeReady?roundTripMins*officeDaysInMonth:null;

        /* Toggle header */
        let html=`
        <div class="ep-commute-toggle" data-action="commute-toggle" role="button" tabindex="0">
            ${iconBadge('map_pin','linear-gradient(135deg,#f97316,#a855f7)',26)}
            <span class="ep-commute-toggle-label">Commute Forecaster
                <span class="ep-commute-toggle-sub"> · ${office.city}</span>
            </span>
            ${icon(isOpen?'chevron_up':'chevron_down',14,T.muted)}
        </div>
        <div class="ep-commute-panel${isOpen?' open':''}" id="ep-commute-panel">
        <div class="ep-commute-inner">`;

        /* Office selector */
        html+=`<div class="ep-office-selector">
            <div class="ep-office-select-label">${icon('globe',11,T.muted)} Office Location</div>
            <select class="ep-office-select" id="ep-office-select">`;
        const byCountry={};
        Object.entries(OFFICES).forEach(([k,o])=>{if(!byCountry[o.country])byCountry[o.country]=[];byCountry[o.country].push({k,...o});});
        const CL={RO:'🇷🇴 Romania',DE:'🇩🇪 Germany',AT:'🇦🇹 Austria',FR:'🇫🇷 France',IT:'🇮🇹 Italy',PT:'🇵🇹 Portugal',ES:'🇪🇸 Spain',CH:'🇨🇭 Switzerland',GB:'🇬🇧 United Kingdom',US:'🇺🇸 United States'};
        ['RO','DE','AT','FR','IT','PT','ES','CH','GB','US'].forEach(cc=>{
            if(!byCountry[cc]) return;
            html+=`<optgroup label="${CL[cc]||cc}">`;
            byCountry[cc].forEach(o=>html+=`<option value="${o.k}"${o.k===officeKey?' selected':''}>${o.label}</option>`);
            html+=`</optgroup>`;
        });
        html+=`</select>
            <div class="ep-office-address">${icon('map_pin',11,T.muted)} ${office.address}</div>
        </div>`;

        /* Home location */
        html+=`<div class="ep-cmute-ctrl-group">
            <div class="ep-cmute-ctrl-label">${icon('home',11,T.muted)} Your home location</div>
            <div class="ep-home-row">
                ${hasHome
                    ? `<span class="ep-home-coords">${homeLabel||`${homeLat.toFixed(4)}, ${homeLng.toFixed(4)}`}</span>`
                    : `<span style="font-size:12px;color:${T.muted};">Not set</span>`}
                <span class="ep-locate-btn${routeLoading?' loading':''}" data-action="locate-home" id="ep-locate-btn">
                    ${icon('pin_drop',12,T.muted)} ${hasHome?'GPS update':'Detect GPS'}
                </span>
                ${hasHome?`<span class="ep-locate-btn" data-action="clear-home" style="padding:5px 8px;" title="Clear">${icon('block',12,T.muted)}</span>`:''}
            </div>
            <div class="ep-addr-form">
                <input class="ep-addr-input" id="ep-addr-input" type="text" placeholder="Or type address: e.g. Calea Șagului 100, Timișoara" autocomplete="off" spellcheck="false">
                <span class="ep-addr-submit" data-action="geocode-address" id="ep-addr-submit">
                    ${icon('search',12,'#3b82f6')} Search
                </span>
            </div>
            <div id="ep-addr-error" style="display:none;" class="ep-addr-error">${icon('warning',11,'#ef4444')} <span id="ep-addr-error-msg"></span></div>
        </div>`;

        /* Transport mode */
        html+=`<div class="ep-cmute-ctrl-group">
            <div class="ep-cmute-ctrl-label">Transport mode</div>
            <div class="ep-mode-btns">`;
        Object.entries(TRANSPORT_MODES).forEach(([k,cfg])=>{
            const avail=office.modes.includes(k);
            const active=k===mode&&avail;
            html+=`<span class="ep-mode-btn${active?' active':''}${!avail?' disabled':''}"
                style="${active?`background:${cfg.grad};border-color:transparent;`:''}"
                data-action="commute-mode" data-mode="${k}">
                ${icon(cfg.icon,13,active?'#fff':T.muted)} ${cfg.label}
            </span>`;
        });
        html+=`</div>`;
        if(officeKey==='venice') html+=`<div class="ep-office-address" style="margin-top:4px;">${icon('info',11,'#f59e0b')} Venice: walking only (no cars/bikes on the island)</div>`;
        html+=`</div>`;

        /* Route strip */
        html+=`<div class="ep-route-strip">`;
        if(!hasHome){
            html+=`<span class="ep-route-fetching">${icon('info',13,'#f59e0b')} Set your home location above to calculate real commute times</span>`;
        } else if(routeLoading){
            html+=`<span class="ep-route-fetching"><span class="ep-spin">${icon('refresh',13,'#3b82f6')}</span> Fetching route via OSRM…</span>`;
        } else if(rs.status==='error'){
            html+=`<span class="ep-route-fetching">${icon('warning',13,'#ef4444')} Route fetch failed. <span data-action="retry-route" style="color:#3b82f6;cursor:pointer;text-decoration:underline;margin-left:4px;">Retry</span></span>`;
        } else if(routeReady){
            const estBadge=rs.estimated?`<span class="ep-estimated-badge">${icon('info',10,'#f59e0b')} estimated</span>`:'';
            html+=`
                <div style="display:flex;flex-direction:column;">
                    <span style="font-size:10px;color:${T.muted};text-transform:uppercase;letter-spacing:.8px;">${modeCfg.label} · one-way</span>
                    <span class="ep-route-val" style="color:${modeCfg.color};">${rs.oneWayMins}m</span>
                </div>
                <div class="ep-route-divider"></div>
                <div style="display:flex;flex-direction:column;">
                    <span style="font-size:10px;color:${T.muted};text-transform:uppercase;letter-spacing:.8px;">Round-trip / day</span>
                    <span class="ep-route-val" style="color:${modeCfg.color};">${rs.oneWayMins*2}m</span>
                </div>
                <div class="ep-route-divider"></div>
                <div style="display:flex;flex-direction:column;">
                    <span style="font-size:10px;color:${T.muted};text-transform:uppercase;letter-spacing:.8px;">Distance</span>
                    <span class="ep-route-val" style="color:${T.text};">${rs.distanceKm} km</span>
                </div>
                <div style="margin-left:auto;display:flex;flex-direction:column;align-items:flex-end;gap:3px;">
                    ${estBadge}
                    ${!rs.estimated?`<span style="font-size:10px;color:${T.muted};">via OSRM · OSM</span>`:''}
                </div>`;
        } else {
            html+=`<span class="ep-route-fetching">${icon('info',13,T.muted)} Route not yet loaded</span>`;
        }
        html+=`</div>`;

        /* Stats + comparison (only when route ready) */
        if(routeReady){
            html+=`<div class="ep-cmute-stats">
                <div class="ep-cmute-stat"><div class="ep-cmute-stat-val" style="color:${modeCfg.color};">${officeDaysInMonth}d</div><div class="ep-cmute-stat-lbl">Office Days</div></div>
                <div class="ep-cmute-stat"><div class="ep-cmute-stat-val" style="color:${modeCfg.color};">${fmt(monthlyCommuteMins)}</div><div class="ep-cmute-stat-lbl">Monthly Commute</div></div>
                <div class="ep-cmute-stat"><div class="ep-cmute-stat-val" style="color:#a855f7;">${wfhDays}d</div><div class="ep-cmute-stat-lbl">WFH Days</div></div>
                <div class="ep-cmute-stat"><div class="ep-cmute-stat-val" style="color:#22c55e;">${fmt(wfhDays*roundTripMins)}</div><div class="ep-cmute-stat-lbl">Time Saved</div></div>
            </div>`;

            const cache=getRouteCache();
            const allModes=office.modes.map(k=>{
                const prof=OSRM_PROFILE[k]||'driving';
                const ck=`${prof}|${homeLat.toFixed(4)},${homeLng.toFixed(4)}|${office.lat.toFixed(4)},${office.lng.toFixed(4)}`;
                const hit=cache[ck];
                const mins=hit?hit.mins:(k===mode?rs.oneWayMins:null);
                return {k,cfg:TRANSPORT_MODES[k],oneWayMins:mins,estimated:hit?hit.estimated:rs.estimated};
            }).filter(m=>m.oneWayMins!=null&&m.oneWayMins>0);

            if(allModes.length>1){
                const maxM=Math.max(...allModes.map(m=>m.oneWayMins*2*officeDaysInMonth));
                html+=`<div><div class="ep-cmute-ctrl-label" style="margin-bottom:8px;">All-mode comparison · monthly commute</div>
                    <div class="ep-cmute-compare">`;
                allModes.forEach(({k,cfg,oneWayMins})=>{
                    const monthly=oneWayMins*2*officeDaysInMonth;
                    const bp=maxM>0?(monthly/maxM)*100:0;
                    const isAct=k===mode;
                    html+=`<div class="ep-cmute-cmp-row">
                        ${icon(cfg.icon,14,cfg.color)}
                        <div class="ep-cmute-cmp-label" style="color:${isAct?cfg.color:T.text}">${cfg.label}</div>
                        <div class="ep-cmute-cmp-bar-wrap"><div class="ep-cmute-cmp-bar" style="width:${bp.toFixed(1)}%;background:${cfg.grad};${isAct?'':'opacity:.5;'}"></div></div>
                        <div class="ep-cmute-cmp-time">${fmt(monthly)}</div>
                    </div>`;
                });
                html+=`</div></div>`;
            }

            const wfhSaved=(wfhDays*roundTripMins/60).toFixed(1);
            html+=`<div class="ep-cmute-insight">
                ${icon('lightbulb',14,'#3b82f6')}
                <div>Your <strong>${rs.distanceKm} km</strong> commute by ${modeCfg.label.toLowerCase()} takes <strong>${rs.oneWayMins}m</strong> each way${rs.estimated?' (estimated)':''}.
                With <strong>${officeDaysInMonth} office days</strong> this month, you'll spend <strong>${fmt(monthlyCommuteMins)}</strong> commuting.
                ${wfhDays>0?`Working from home <strong>${wfhDays} days</strong> saves approximately <strong>${wfhSaved}h</strong> vs a full office month.`:''}
                Cluster office days mid-week (Tue–Thu) to reduce context-switching.</div>
            </div>`;
        }

        html+=`<div class="ep-divider"></div>`;
        html+=buildScheduleSection({T,days,officeHoursNeeded,alreadyDoneOfficeHours});
        html+=`</div></div>`;
        return html;
    };

    /* ═══════════════════════════════════════════════════════════════
       INTERACTIONS
    ═══════════════════════════════════════════════════════════════ */
    const triggerRouteRefresh = async (force=false) => {
        const hLat=parseFloat(localStorage.getItem(LS.HOME_LAT)||'0');
        const hLng=parseFloat(localStorage.getItem(LS.HOME_LNG)||'0');
        if(!hLat||!hLng) return;
        const officeKey=localStorage.getItem(LS.OFFICE)||'timisoara';
        const office=OFFICES[officeKey]||OFFICES.timisoara;
        const mode=localStorage.getItem(LS.MODE)||office.modes[0]||'car';
        const key=currentRouteKey();
        if(!force&&_routeState.status==='ok'&&`${_routeState.officeKey}|${_routeState.mode}|${_routeState.homeLat?.toFixed(4)},${_routeState.homeLng?.toFixed(4)}`===key) return;
        _routeState={status:'loading',oneWayMins:null,distanceKm:null,estimated:false,officeKey,mode,homeLat:hLat,homeLng:hLng};
        renderUI();
        const result=await fetchRoute(hLat,hLng,office.lat,office.lng,mode);
        if(result){
            _routeState={status:'ok',oneWayMins:result.mins,distanceKm:result.distanceKm,estimated:result.estimated||false,officeKey,mode,homeLat:hLat,homeLng:hLng};
        } else {
            _routeState={..._routeState,status:'error'};
        }
        renderUI(); injectBackButton(getTheme());
    };

    const bindInteractions = container => {
        container.querySelectorAll('[data-action]').forEach(el=>{
            el.addEventListener('click', async e=>{
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
                if(action==='commute-toggle'){
                    localStorage.setItem(LS.COMMUTE_OPEN,String(localStorage.getItem(LS.COMMUTE_OPEN)!=='true'));
                    renderUI(); injectBackButton(getTheme());
                }
                if(action==='commute-mode'){
                    const newMode=el.dataset.mode;
                    const ok=localStorage.getItem(LS.OFFICE)||'timisoara';
                    if(!OFFICES[ok]?.modes.includes(newMode)) return;
                    localStorage.setItem(LS.MODE,newMode);
                    await triggerRouteRefresh(true);
                    renderUI(); injectBackButton(getTheme());
                }
                if(action==='locate-home'){
                    const btn=document.getElementById('ep-locate-btn');
                    if(btn){btn.classList.add('loading');btn.innerHTML=`<span class="ep-spin">${icon('refresh',12,'#3b82f6')}</span> Locating…`;}
                    if(!navigator.geolocation){
                        alert('Geolocation is not supported by this browser.'); return;
                    }
                    navigator.geolocation.getCurrentPosition(
                        async pos=>{
                            const lat=pos.coords.latitude, lng=pos.coords.longitude;
                            localStorage.setItem(LS.HOME_LAT,lat);
                            localStorage.setItem(LS.HOME_LNG,lng);
                            const label=await reverseGeocode(lat,lng);
                            localStorage.setItem(LS.HOME_LABEL,label);
                            await triggerRouteRefresh(true);
                            renderUI(); injectBackButton(getTheme());
                        },
                        err=>{
                            console.warn('Geolocation error:',err.code,err.message);
                            let msg='Could not detect location.';
                            if(err.code===1) msg='Location access denied. Please allow location in your browser settings.';
                            if(err.code===2) msg='Location unavailable. Try again.';
                            if(err.code===3) msg='Location request timed out. Try again.';
                            alert(msg);
                            renderUI(); injectBackButton(getTheme());
                        },
                        {enableHighAccuracy:false,timeout:12000,maximumAge:60000}
                    );
                }
                if(action==='geocode-address'){
                    const input=document.getElementById('ep-addr-input');
                    const errEl=document.getElementById('ep-addr-error');
                    const errMsg=document.getElementById('ep-addr-error-msg');
                    const submitBtn=document.getElementById('ep-addr-submit');
                    const query=input?.value?.trim();
                    if(!query) return;
                    if(errEl) errEl.style.display='none';
                    if(submitBtn){submitBtn.classList.add('loading');submitBtn.innerHTML=`<span class="ep-spin">${icon('refresh',12,'#3b82f6')}</span> Searching…`;}
                    const result=await geocodeAddress(query);
                    if(result){
                        localStorage.setItem(LS.HOME_LAT,result.lat);
                        localStorage.setItem(LS.HOME_LNG,result.lng);
                        localStorage.setItem(LS.HOME_LABEL,result.label);
                        await triggerRouteRefresh(true);
                        renderUI(); injectBackButton(getTheme());
                    } else {
                        if(submitBtn){submitBtn.classList.remove('loading');submitBtn.innerHTML=`${icon('search',12,'#3b82f6')} Search`;}
                        if(errEl&&errMsg){errMsg.textContent='Address not found. Try a more specific query.';errEl.style.display='flex';}
                    }
                }
                if(action==='clear-home'){
                    [LS.HOME_LAT,LS.HOME_LNG,LS.HOME_LABEL].forEach(k=>localStorage.removeItem(k));
                    _routeState={status:'idle',oneWayMins:null,distanceKm:null,estimated:false,officeKey:null,mode:null};
                    renderUI(); injectBackButton(getTheme());
                }
                if(action==='retry-route'){
                    await triggerRouteRefresh(true);
                }
            });
        });

        /* Allow pressing Enter in the address field to trigger search */
        const addrInput=container.querySelector('#ep-addr-input');
        if(addrInput){
            addrInput.addEventListener('keydown', e=>{
                if(e.key==='Enter'){
                    e.preventDefault();
                    container.querySelector('[data-action="geocode-address"]')?.click();
                }
            });
        }

        const sel=container.querySelector('#ep-office-select');
        if(sel){
            sel.addEventListener('change', async ()=>{
                const newKey=sel.value;
                localStorage.setItem(LS.OFFICE,newKey);
                const newOffice=OFFICES[newKey];
                const curMode=localStorage.getItem(LS.MODE)||'car';
                if(!newOffice.modes.includes(curMode)) localStorage.setItem(LS.MODE,newOffice.modes[0]||'car');
                await triggerRouteRefresh(true);
                renderUI(); injectBackButton(getTheme());
            });
        }
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

        /* ── BUG FIX: empty-month / new-month state ──────────────────
           Previously checked summary.recorded && rawTotal, which are
           both 0 at the start of a month, causing infinite "Loading…".
           Now we check isSummaryReady() to confirm the DOM has loaded,
           then render an "empty month" card instead of spinning forever.
        ──────────────────────────────────────────────────────────────── */
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
                    <div class="ep-empty-sub">Start logging time in eDays and the dashboard will populate automatically. Commute Forecaster and Schedule Planner are still available below.</div>
                </div>`;
            // Still render commute/schedule section even with no hours
            const commuteHtml=buildCommutePanel({T,ds,days:detailedDays});
            container.innerHTML+=commuteHtml;
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
                <div class="ep-chip"><div class="ep-chip-val" style="color:#3b82f6">${ds.soFar}</div><div class="ep-chip-lbl">So Far</div></div>
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

        /* Commute panel */
        const detailedDays=getDetailedDayData();
        html+=buildCommutePanel({T,ds,days:detailedDays});

        container.innerHTML=html;
        bindInteractions(container);
    };

    /* ═══════════════════════════════════════════════════════════════
       BACK BUTTON
    ═══════════════════════════════════════════════════════════════ */
    const BACK_BTN_ID='ep-back-chip';
    const injectBackButton = T => {
        document.getElementById(BACK_BTN_ID)?.remove();
        const chip=document.querySelector('.today_chip');
        const cont=chip?.closest('.tt_day_container');
        if(!cont) return;
        const btn=document.createElement('span');
        btn.id=BACK_BTN_ID; btn.role='button'; btn.tabIndex=0;
        btn.innerHTML=`<span style="display:inline-flex;align-items:center;justify-content:center;width:13px;height:13px;color:currentColor;">${ICONS.arrow_up}</span> Back to analyzer`;
        btn.style.cssText=`display:inline-flex;align-items:center;gap:5px;font-size:12px;font-weight:500;cursor:pointer;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',system-ui,sans-serif;padding:4px 10px;border-radius:7px;border:1px solid ${T.border};background:${T.surface};color:${T.muted};margin-bottom:6px;user-select:none;white-space:nowrap;`;
        btn.addEventListener('click',e=>{e.preventDefault();jumpToAnalyzer();});
        btn.addEventListener('mouseenter',()=>{btn.style.background=T.isDark?'rgba(255,255,255,0.1)':'rgba(0,0,0,0.06)';btn.style.color=T.text;});
        btn.addEventListener('mouseleave',()=>{btn.style.background=T.surface;btn.style.color=T.muted;});
        cont.insertBefore(btn,cont.firstChild);
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
                const hLat=parseFloat(localStorage.getItem(LS.HOME_LAT)||'0');
                const hLng=parseFloat(localStorage.getItem(LS.HOME_LNG)||'0');
                if(hLat&&hLng) triggerRouteRefresh();

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
