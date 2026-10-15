from pathlib import Path

p = Path('script.js')
s = p.read_text(encoding='utf-8')


def replace_once(old: str, new: str, label: str) -> None:
    global s
    if old not in s:
        raise RuntimeError(f'Missing expected block: {label}')
    s = s.replace(old, new, 1)


replace_once('// @version      19.2', '// @version      19.3', 'version')
replace_once(
    '// ==/UserScript==\n// Changelog v19.2:',
    '// ==/UserScript==\n// Changelog v19.3: Extended persistent light/dark theming across the eDays site shell, moved the theme control beside Book time off, moved Analyzer Settings beside timesheet navigation, added Time Tracking Enhanced branding, and removed the Analyzer header.\n// Changelog v19.2:',
    'changelog'
)

site_css = r'''
        /* ═══════════════════════════════════════════════════════════
           v19.3 — SITE-WIDE THEME / RELOCATED CONTROLS
        ═══════════════════════════════════════════════════════════ */
        #ep13 .ep-hdr{display:none!important;}
        #timesheetMonthHeader h2 .ep-enhanced-text{
            margin-left:6px;
            font-weight:800;
            background:linear-gradient(135deg,#3b82f6,#a855f7);
            -webkit-background-clip:text;
            background-clip:text;
            color:transparent!important;
            -webkit-text-fill-color:transparent;
        }
        #ep-site-theme-action{display:flex;align-items:center;}
        #ep-site-theme-action .v3-button{margin:0;}

        html.ep-site-dark,
        body.ep-site-dark{
            color-scheme:dark;
            background:#111318!important;
            color:#e8edf5!important;
        }
        body.ep-site-dark #main_content_wrapper,
        body.ep-site-dark #time-recording-content-wrapper,
        body.ep-site-dark #mainTimesheetContainer,
        body.ep-site-dark #mainTimesheetPanel,
        body.ep-site-dark .timesheet_container,
        body.ep-site-dark .timesheet_main_area,
        body.ep-site-dark .timesheet_week,
        body.ep-site-dark #global_help_section,
        body.ep-site-dark #mobileMyEntitlementPanel,
        body.ep-site-dark .contentHolder{
            background:#111318!important;
            color:#e8edf5!important;
        }
        body.ep-site-dark .top-title-bar,
        body.ep-site-dark #topMobileNav,
        body.ep-site-dark #top_nav,
        body.ep-site-dark #main_menu_bar,
        body.ep-site-dark #new_menu_spacer{
            background:#171a20!important;
            color:#e8edf5!important;
            border-color:#2f3540!important;
        }
        body.ep-site-dark .top-title-bar *,
        body.ep-site-dark #topMobileNav *,
        body.ep-site-dark #main_menu_bar *{
            color:inherit;
        }
        body.ep-site-dark #profile_popup,
        body.ep-site-dark #notifications_panel,
        body.ep-site-dark #notifications_panel_header,
        body.ep-site-dark #notifications_panel_content,
        body.ep-site-dark .menu_items_list,
        body.ep-site-dark .menu_header{
            background:#1c2027!important;
            color:#e8edf5!important;
            border-color:#343b46!important;
        }
        body.ep-site-dark #profile_popup_arrow_back{
            border-bottom-color:#1c2027!important;
        }

        body.ep-site-dark .timesheet_header,
        body.ep-site-dark .timesheet_week_summary,
        body.ep-site-dark .week_summary_header,
        body.ep-site-dark .timesheet_week_summary_list_monthly,
        body.ep-site-dark .timeline-controls,
        body.ep-site-dark .tt_day_inner_container,
        body.ep-site-dark .tt_period_container,
        body.ep-site-dark .tt_period_middle_container,
        body.ep-site-dark .tt_period_inner_container,
        body.ep-site-dark .tt_break_container,
        body.ep-site-dark .tt_total_container,
        body.ep-site-dark .total_hours_only_container{
            background:#1b1f26!important;
            color:#e8edf5!important;
            border-color:#343b46!important;
        }
        body.ep-site-dark .timesheet_week_header:not(.authorised_header):not(.pending_header):not(.rejected_header),
        body.ep-site-dark .timesheet_day_header:not(.timesheet_today){
            background:#20252d!important;
            color:#e8edf5!important;
            border-color:#39414d!important;
        }
        body.ep-site-dark .timesheet_day_text,
        body.ep-site-dark .timesheet_absence_text,
        body.ep-site-dark .timesheet_day_actions,
        body.ep-site-dark .timesheet_day_action,
        body.ep-site-dark .week_headers,
        body.ep-site-dark .week_number,
        body.ep-site-dark .header_title,
        body.ep-site-dark .summary_block,
        body.ep-site-dark .tt_time_input_label,
        body.ep-site-dark .duration_hours,
        body.ep-site-dark .total_hours_only{
            color:#e8edf5!important;
        }
        body.ep-site-dark .timesheet_day_action svg,
        body.ep-site-dark .material-icons{
            color:#b8c1ce!important;
            fill:#b8c1ce!important;
        }
        body.ep-site-dark #monthSummary a:not(.pendingWeek):not(.authorisedWeek):not(.rejectedWeek),
        body.ep-site-dark .timeline-controls a:not(.pendingWeek):not(.authorisedWeek):not(.rejectedWeek){
            background:#20252d!important;
            color:#e8edf5!important;
            border-color:#39414d!important;
        }
        body.ep-site-dark #monthSummary a.selectedWeek,
        body.ep-site-dark .timeline-controls a.selectedWeek{
            box-shadow:inset 0 0 0 2px #3b82f6!important;
        }

        body.ep-site-dark input,
        body.ep-site-dark select,
        body.ep-site-dark textarea,
        body.ep-site-dark .chosen-container .chosen-single,
        body.ep-site-dark .chosen-container .chosen-drop,
        body.ep-site-dark .chosen-container .chosen-results,
        body.ep-site-dark .chosen-container .chosen-results li,
        body.ep-site-dark .ui-widget-content{
            background:#15191f!important;
            color:#e8edf5!important;
            border-color:#3a424e!important;
        }
        body.ep-site-dark input::placeholder,
        body.ep-site-dark textarea::placeholder{
            color:#8d98a8!important;
        }
        body.ep-site-dark input[type="time"]{
            color-scheme:dark;
        }
        body.ep-site-dark .chosen-container .chosen-results li.highlighted{
            background:#2563eb!important;
            color:#fff!important;
        }

        body.ep-site-dark .v3-button-container.secondary,
        body.ep-site-dark .button-secondary,
        body.ep-site-dark .headerButton{
            background:#252b34!important;
            color:#e8edf5!important;
            border-color:#46505e!important;
        }
        body.ep-site-dark .v3-button-container.secondary:hover,
        body.ep-site-dark .button-secondary:hover,
        body.ep-site-dark .headerButton:hover{
            background:#303844!important;
            color:#fff!important;
            border-color:#5a6677!important;
        }
        body.ep-site-dark .v3-button-container.secondary svg,
        body.ep-site-dark .v3-button-container.secondary .v3-icon{
            fill:currentColor!important;
            color:inherit!important;
        }

        body.ep-site-dark .ui-dialog,
        body.ep-site-dark .ui-dialog-titlebar,
        body.ep-site-dark .ui-dialog-content,
        body.ep-site-dark .ui-dialog-buttonpane,
        body.ep-site-dark .global_dialog,
        body.ep-site-dark [class*="modal"]{
            background:#1b1f26!important;
            color:#e8edf5!important;
            border-color:#39414d!important;
        }
        body.ep-site-dark .ui-dialog-titlebar{
            background:#20252d!important;
        }

        body.ep-site-dark #footer,
        body.ep-site-dark #footer .container_12,
        body.ep-site-dark .edaysFooterLine,
        body.ep-site-dark #edaysFooterButtonContainer{
            background:#111318!important;
            color:#aeb8c6!important;
            border-color:#2f3540!important;
        }
        body.ep-site-dark #footer a{color:#8ab4ff!important;}
        body.ep-site-dark #footer img{filter:invert(1) brightness(1.35);}

        body.ep-site-dark .tt_day_container:has(.today_chip){
            background:linear-gradient(100deg,#172235 0%,#201d35 55%,#171c27 100%)!important;
            outline-color:rgba(96,165,250,.62)!important;
            box-shadow:inset 4px 0 0 #3b82f6,0 5px 16px rgba(0,0,0,.28)!important;
        }
        body.ep-site-dark .timesheet_day_header.timesheet_today{
            background:linear-gradient(90deg,#1c2d48 0%,#282545 58%,#1d2532 100%)!important;
            border-color:rgba(96,165,250,.42)!important;
        }
        body.ep-site-dark .timesheet_day_header.timesheet_today .timesheet_day_text{
            color:#eaf2ff!important;
        }
        body.ep-site-dark .timesheet_day_header.timesheet_today + .tt_day_inner_container{
            background:linear-gradient(100deg,#172438 0%,#211f36 58%,#181e29 100%)!important;
            border-color:rgba(96,165,250,.28)!important;
        }
'''
replace_once('        /* SETTINGS MODAL */', site_css + '\n        /* SETTINGS MODAL */', 'site CSS insertion')

site_functions = r'''
    /* ═══════════════════════════════════════════════════════════════
       SITE-WIDE THEME CONTROLS
    ═══════════════════════════════════════════════════════════════ */
    const SITE_THEME_ACTION_ID = 'ep-site-theme-action';
    let siteUiObserver = null;
    let siteUiRaf = 0;

    const applySiteTheme = () => {
        const T = getTheme();
        document.documentElement.classList.toggle('ep-site-dark', T.isDark);
        document.documentElement.dataset.epTheme = T.isDark ? 'dark' : 'light';
        if (document.body) {
            document.body.classList.toggle('ep-site-dark', T.isDark);
        }
        injectStyles(T);
        return T;
    };

    const setSiteThemeIcon = (svg, showSun) => {
        if (!svg) return;
        svg.setAttribute('viewBox', '0 0 24 24');
        svg.innerHTML = showSun
            ? '<path fill="currentColor" d="M6.76 4.84l-1.8-1.79-1.41 1.41 1.79 1.79 1.42-1.41zM4 10.5H1v2h3v-2zm9-9.95h-2V3.5h2V.55zm7.45 3.91l-1.41-1.41-1.79 1.79 1.41 1.41 1.79-1.79zm-3.21 13.7 1.79 1.8 1.41-1.41-1.8-1.79-1.4 1.4zM20 10.5v2h3v-2h-3zm-8-5c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6-2.69-6-6zm-1 16.95h2V19.5h-2v2.95zm-7.45-3.91 1.41 1.41 1.79-1.8-1.41-1.41-1.79 1.8z"/>'
            : '<path fill="currentColor" d="M12 3a9 9 0 1 0 9 9c0-.46-.04-.92-.1-1.36a5.389 5.389 0 0 1-4.4 2.26 5.403 5.403 0 0 1-3.14-9.8c-.44-.06-.9-.1-1.36-.1z"/>';
    };

    const updateSiteThemeAction = host => {
        if (!host) return;
        const T = getTheme();
        const button = host.querySelector('button');
        const label = host.querySelector('.label');
        const nextLabel = T.isDark ? 'Light mode' : 'Dark mode';
        const description = T.isDark ? 'Switch to light mode' : 'Switch to dark mode';
        if (label && label.textContent !== nextLabel) {
            label.textContent = nextLabel;
        }
        if (button) {
            button.setAttribute('title', description);
            button.setAttribute('aria-label', description);
        }
        setSiteThemeIcon(host.querySelector('svg'), T.isDark);
        host.dataset.epTheme = T.isDark ? 'dark' : 'light';
    };

    const createFallbackThemeShell = () => {
        const shell = document.createElement('div');
        shell.className = 'v3-button mobile_hidden ECL3';
        shell.innerHTML = `
            <div class="v3-button-margin-box">
                <button class="v3-button-container secondary icon-left" type="button">
                    <svg class="v3-icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" style="height:20px;width:20px;vertical-align:middle;"></svg>
                    <span class="label"></span>
                </button>
            </div>
        `;
        return shell;
    };

    const createSiteThemeAction = () => {
        const host = document.createElement('div');
        host.id = SITE_THEME_ACTION_ID;
        const nativeClockButton = document.querySelector(
            '#MainContent_PageActions_timeTrackingContainer .v3-button.mobile_hidden.ECL3'
        );
        const shell = nativeClockButton
            ? nativeClockButton.cloneNode(true)
            : createFallbackThemeShell();
        host.appendChild(shell);

        const button = host.querySelector('button');
        if (button) {
            button.type = 'button';
            button.removeAttribute('target');
            button.addEventListener('click', event => {
                event.preventDefault();
                themeOverride = getTheme().isDark ? 'light' : 'dark';
                localStorage.setItem(LS.THEME, themeOverride);
                applySiteTheme();
                updateSiteThemeAction(host);
                if (document.getElementById('ep13')) {
                    renderUI();
                }
            });
        }
        updateSiteThemeAction(host);
        return host;
    };

    const ensureSiteThemeAction = () => {
        const holidayAction = document.getElementById('MainContent_PageActions_holiday_booker_button');
        if (!holidayAction) return;

        let host = document.getElementById(SITE_THEME_ACTION_ID);
        if (!host) {
            host = createSiteThemeAction();
        }
        if (holidayAction.nextElementSibling !== host) {
            holidayAction.insertAdjacentElement('afterend', host);
        }
        updateSiteThemeAction(host);
    };

    const scheduleSiteUiEnhancements = () => {
        if (siteUiRaf) return;
        siteUiRaf = requestAnimationFrame(() => {
            siteUiRaf = 0;
            ensureSiteThemeAction();
        });
    };

    const initSiteEnhancements = () => {
        applySiteTheme();
        ensureSiteThemeAction();
        if (!siteUiObserver && document.body) {
            siteUiObserver = new MutationObserver(scheduleSiteUiEnhancements);
            siteUiObserver.observe(document.body, {
                childList: true,
                subtree: true
            });
        }
    };

'''
replace_once(
    '    /* ═══════════════════════════════════════════════════════════════\n       ACTIVITY CONFIG\n    ═══════════════════════════════════════════════════════════════ */',
    site_functions + '    /* ═══════════════════════════════════════════════════════════════\n       ACTIVITY CONFIG\n    ═══════════════════════════════════════════════════════════════ */',
    'site theme functions insertion'
)

replace_once(
    "                if (action === 'theme-toggle') {\n                    themeOverride = el.dataset.theme;\n                    localStorage.setItem(LS.THEME, themeOverride);\n                    renderUI();\n                }",
    "                if (action === 'theme-toggle') {\n                    themeOverride = el.dataset.theme;\n                    localStorage.setItem(LS.THEME, themeOverride);\n                    applySiteTheme();\n                    ensureSiteThemeAction();\n                    renderUI();\n                }",
    'legacy analyzer theme toggle'
)

replace_once(
    "    const renderUI = () => {\n        const T = getTheme();\n        injectStyles(T);",
    "    const renderUI = () => {\n        const T = applySiteTheme();",
    'renderUI theme application'
)

replace_once(
    "    const TIMESHEET_NAV_BUTTON_ID = 'ep-timesheet-nav';",
    "    const TIMESHEET_NAV_BUTTON_ID = 'ep-timesheet-nav';\n    const TIMESHEET_SETTINGS_BUTTON_ID = 'ep-timesheet-settings';",
    'settings button id'
)

nav_helpers = r'''
    const enhanceTimesheetHeading = () => {
        const heading = getTimesheetHeader()?.querySelector('h2');
        if (!heading || heading.querySelector('.ep-enhanced-text')) return;
        const text = heading.textContent.replace(/\s+/g, ' ').trim();
        if (!/^time tracking$/i.test(text)) return;

        heading.textContent = 'Time Tracking ';
        const enhanced = document.createElement('span');
        enhanced.className = 'ep-enhanced-text';
        enhanced.textContent = 'Enhanced';
        heading.appendChild(enhanced);
    };

    const createTimesheetSettingsButton = () => {
        const button = document.createElement('c3-button');
        button.id = TIMESHEET_SETTINGS_BUTTON_ID;
        button.className = 'disallow-impersonation-action';
        button.textContent = 'Settings';
        button.setAttribute('title', 'Analyzer settings');
        button.setAttribute('aria-label', 'Analyzer settings');
        button.addEventListener('click', event => {
            event.preventDefault();
            openSettingsModal();
        });
        return button;
    };

    const ensureTimesheetSettingsButton = navButton => {
        if (!navButton) return;
        let settingsButton = document.getElementById(TIMESHEET_SETTINGS_BUTTON_ID);
        if (!settingsButton || settingsButton.tagName.toLowerCase() !== 'c3-button') {
            settingsButton?.remove();
            settingsButton = createTimesheetSettingsButton();
        }
        if (navButton.nextElementSibling !== settingsButton) {
            navButton.insertAdjacentElement('afterend', settingsButton);
        }
    };

'''
replace_once(
    "    const getTimesheetHeader = () => document.getElementById('timesheetMonthHeader');\n",
    "    const getTimesheetHeader = () => document.getElementById('timesheetMonthHeader');\n\n" + nav_helpers,
    'timesheet heading/settings helpers'
)

replace_once(
    "        if (submitButton.nextElementSibling !== button) {\n            submitButton.insertAdjacentElement('afterend', button);\n        }\n\n        bindTimesheetNavScroll();\n        updateTimesheetNavButton();",
    "        if (submitButton.nextElementSibling !== button) {\n            submitButton.insertAdjacentElement('afterend', button);\n        }\n\n        enhanceTimesheetHeading();\n        ensureTimesheetSettingsButton(button);\n        bindTimesheetNavScroll();\n        updateTimesheetNavButton();",
    'timesheet control placement'
)

replace_once(
    "    const boot = () => {\n        const tick = setInterval(",
    "    const boot = () => {\n        initSiteEnhancements();\n        const tick = setInterval(",
    'global theme boot'
)

if "// @version      19.3" not in s:
    raise RuntimeError('Version bump failed')
if "↓ To today" not in s or "↑ To home" not in s:
    raise RuntimeError('Navigation labels were unexpectedly changed')
if "button.textContent = getTimesheetNavLabel(target);" not in s:
    raise RuntimeError('Native navigation pre-insertion label fix is missing')
if "#ep13 .ep-hdr{display:none!important;}" not in s:
    raise RuntimeError('Analyzer header removal styling missing')
if "SITE_THEME_ACTION_ID" not in s:
    raise RuntimeError('Site theme action missing')
if "TIMESHEET_SETTINGS_BUTTON_ID" not in s:
    raise RuntimeError('Timesheet settings button missing')
if "ep-enhanced-text" not in s:
    raise RuntimeError('Enhanced heading missing')
if '// @require' in s:
    raise RuntimeError('script.js must remain standalone')

p.write_text(s, encoding='utf-8')
