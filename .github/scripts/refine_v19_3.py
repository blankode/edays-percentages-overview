from pathlib import Path

p = Path('script.js')
s = p.read_text(encoding='utf-8')

if '// @version      19.3' not in s:
    raise RuntimeError('Expected version 19.3')

# Dark Reader-inspired analyzer palette.
s = s.replace("bg: '#181818'", "bg: '#181a1b'")
s = s.replace("surface: '#242424'", "surface: '#202324'")
s = s.replace("text: '#e8e8e8'", "text: '#e8e6e3'")
s = s.replace("muted: '#888888'", "muted: '#aaa49b'")

# Remove custom wrapper styling that altered the native v3 button appearance.
s = s.replace(
    "        #ep-site-theme-action{display:flex;align-items:center;}\n        #ep-site-theme-action .v3-button{margin:0;}\n",
    "        #ep-site-theme-action{margin:0;}\n",
)

# Add a later palette override so site shell colors win over the earlier v19.3 rules.
anchor = "        .ep-settings-help{font-size:11px;color:${T.muted};line-height:1.4;}"
if anchor not in s:
    raise RuntimeError('Settings CSS anchor not found')

palette = r'''        /* v19.3 refinement — Dark Reader-inspired neutral palette */
        html.ep-site-dark,
        body.ep-site-dark{
            background:#181a1b!important;
            color:#e8e6e3!important;
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
        body.ep-site-dark .contentHolder,
        body.ep-site-dark #footer{
            background:#181a1b!important;
            color:#e8e6e3!important;
        }
        body.ep-site-dark .top-title-bar,
        body.ep-site-dark #topMobileNav,
        body.ep-site-dark #top_nav,
        body.ep-site-dark #main_menu_bar,
        body.ep-site-dark #new_menu_spacer{
            background:#1b1e1f!important;
            color:#e8e6e3!important;
            border-color:#3a3e41!important;
        }
        body.ep-site-dark #profile_popup,
        body.ep-site-dark #notifications_panel,
        body.ep-site-dark #notifications_panel_header,
        body.ep-site-dark #notifications_panel_content,
        body.ep-site-dark .menu_items_list,
        body.ep-site-dark .menu_header,
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
        body.ep-site-dark .total_hours_only_container,
        body.ep-site-dark .ui-dialog,
        body.ep-site-dark .ui-dialog-content,
        body.ep-site-dark .ui-dialog-titlebar{
            background:#202324!important;
            color:#e8e6e3!important;
            border-color:#3a3e41!important;
        }
        body.ep-site-dark .timesheet_week_header:not(.authorised_header):not(.pending_header):not(.rejected_header),
        body.ep-site-dark .timesheet_day_header:not(.timesheet_today){
            background:#25282a!important;
            color:#e8e6e3!important;
            border-color:#454a4d!important;
        }
        body.ep-site-dark input,
        body.ep-site-dark textarea,
        body.ep-site-dark select,
        body.ep-site-dark .chosen-container .chosen-single,
        body.ep-site-dark .chosen-container .chosen-drop,
        body.ep-site-dark .chosen-container .chosen-results,
        body.ep-site-dark .chosen-container .chosen-results li{
            background:#181a1b!important;
            color:#e8e6e3!important;
            border-color:#454a4d!important;
        }
        body.ep-site-dark input::placeholder,
        body.ep-site-dark textarea::placeholder{
            color:#9b958d!important;
            opacity:.8!important;
        }
        body.ep-site-dark a:not(.button):not(.v3-button-container),
        body.ep-site-dark .timesheet_day_action{
            color:#3391ff!important;
        }
        body.ep-site-dark hr,
        body.ep-site-dark .edaysFooterLine{
            border-color:#3a3e41!important;
            background:#3a3e41!important;
        }
        body.ep-site-dark ::selection{
            background:#004daa!important;
            color:#e8e6e3!important;
        }
        body.ep-site-dark .timesheet_day_header.timesheet_today{
            background:linear-gradient(90deg,#1f3448 0%,#252b3a 58%,#202426 100%)!important;
            border-color:#466580!important;
        }
        body.ep-site-dark .timesheet_day_header.timesheet_today + .tt_day_inner_container{
            background:linear-gradient(100deg,#1d272d 0%,#23252d 58%,#202324 100%)!important;
            border-color:#3f5260!important;
        }
        body.ep-site-dark .timesheet_day_header.timesheet_today .timesheet_day_text{
            color:#d8e8f7!important;
        }
        body.ep-site-dark .timesheet_day_header.timesheet_today + .tt_day_inner_container .tt_break_container,
        body.ep-site-dark .timesheet_day_header.timesheet_today + .tt_day_inner_container .tt_total_container{
            background:#202324!important;
        }

'''
s = s.replace(anchor, palette + anchor, 1)

# Replace the site-theme runtime with a static/bounded implementation.
start_marker = "    /* ═══════════════════════════════════════════════════════════════\n       SITE-WIDE THEME CONTROLS"
end_marker = "    /* ═══════════════════════════════════════════════════════════════\n       ACTIVITY CONFIG"
start = s.find(start_marker)
end = s.find(end_marker, start)
if start < 0 or end < 0:
    raise RuntimeError('Site theme control block markers not found')

new_block = r'''    /* ═══════════════════════════════════════════════════════════════
       SITE-WIDE THEME CONTROLS
    ═══════════════════════════════════════════════════════════════ */
    const SITE_THEME_ACTION_ID = 'ep-site-theme-action';
    let siteThemeRetryTimer = null;
    let siteThemeRetryCount = 0;

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
        const nextIcon = showSun ? 'sun' : 'moon';
        if (svg.dataset.epThemeIcon === nextIcon) return;

        svg.dataset.epThemeIcon = nextIcon;
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
        if (button && button.getAttribute('title') !== description) {
            button.setAttribute('title', description);
            button.setAttribute('aria-label', description);
        }
        setSiteThemeIcon(host.querySelector('svg'), T.isDark);
        host.dataset.epTheme = T.isDark ? 'dark' : 'light';
    };

    const createFallbackThemeAction = () => {
        const host = document.createElement('div');
        host.id = SITE_THEME_ACTION_ID;
        host.className = 'v3-button mobile_hidden ECL3';
        host.setAttribute('data-v-1d37e861', '');
        host.innerHTML = `
            <div data-v-1d37e861="" class="v3-button-margin-box">
                <button data-v-1d37e861="" class="v3-button-container secondary icon-left" type="button" target="" title="">
                    <svg data-v-1d37e861="" class="v3-icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" style="height:20px;width:20px;vertical-align:middle;"></svg>
                    <span data-v-1d37e861="" class="label"></span>
                </button>
            </div>
        `;
        return host;
    };

    const createSiteThemeAction = () => {
        const nativeShell = document.querySelector(
            '#MainContent_PageActions_timeTrackingContainer .v3-button.mobile_hidden.ECL3'
        );

        let host;
        if (nativeShell) {
            host = document.createElement(nativeShell.tagName.toLowerCase());
            [...nativeShell.attributes].forEach(attr => {
                if (attr.name !== 'id') {
                    host.setAttribute(attr.name, attr.value);
                }
            });
            host.id = SITE_THEME_ACTION_ID;
            const nativeMargin = nativeShell.querySelector('.v3-button-margin-box');
            if (nativeMargin) {
                host.appendChild(nativeMargin.cloneNode(true));
            }
        }

        if (!host || !host.querySelector('.v3-button-margin-box')) {
            host = createFallbackThemeAction();
        }

        const button = host.querySelector('button');
        if (button) {
            button.type = 'button';
            button.setAttribute('target', '');
            button.addEventListener('click', event => {
                event.preventDefault();
                event.stopPropagation();
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
        if (!holidayAction) return false;

        let host = document.getElementById(SITE_THEME_ACTION_ID);
        if (!host) {
            host = createSiteThemeAction();
            holidayAction.insertAdjacentElement('afterend', host);
            return true;
        }

        if (holidayAction.nextElementSibling !== host) {
            holidayAction.insertAdjacentElement('afterend', host);
        }
        return true;
    };

    const scheduleSiteThemeRetry = () => {
        if (siteThemeRetryTimer) return;
        siteThemeRetryTimer = window.setInterval(() => {
            siteThemeRetryCount++;
            if (ensureSiteThemeAction() || siteThemeRetryCount >= 20) {
                clearInterval(siteThemeRetryTimer);
                siteThemeRetryTimer = null;
            }
        }, 500);
    };

    const initSiteEnhancements = () => {
        applySiteTheme();
        if (!ensureSiteThemeAction()) {
            scheduleSiteThemeRetry();
        }
    };

'''
s = s[:start] + new_block + s[end:]

# Settings becomes an icon-only native c3-button. Icon attribute is set before connection.
old_settings = '''    const createTimesheetSettingsButton = () => {
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
    };'''
new_settings = '''    const createTimesheetSettingsButton = () => {
        const button = document.createElement('c3-button');
        button.id = TIMESHEET_SETTINGS_BUTTON_ID;
        button.className = 'disallow-impersonation-action';
        button.setAttribute('icon', 'settings');
        button.setAttribute('title', 'Analyzer settings');
        button.setAttribute('aria-label', 'Analyzer settings');
        button.addEventListener('click', event => {
            event.preventDefault();
            openSettingsModal();
        });
        return button;
    };'''
if old_settings not in s:
    raise RuntimeError('Settings button block not found')
s = s.replace(old_settings, new_settings, 1)

# Safety/performance guards.
if 'new MutationObserver(scheduleSiteUiEnhancements)' in s or 'siteUiObserver.observe(document.body' in s:
    raise RuntimeError('Whole-body site theme observer still present')
if "button.setAttribute('icon', 'settings');" not in s:
    raise RuntimeError('Settings icon patch missing')
if "host.appendChild(nativeMargin.cloneNode(true));" not in s:
    raise RuntimeError('Native theme button shell clone missing')
if '// @version      19.3' not in s:
    raise RuntimeError('Version changed unexpectedly')

p.write_text(s, encoding='utf-8')
