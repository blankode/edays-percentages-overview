from pathlib import Path

p = Path('script.js')
s = p.read_text(encoding='utf-8')

if '// @version      19.4' not in s:
    raise RuntimeError('Expected version 19.4')

s = s.replace('// @version      19.4', '// @version      19.5', 1)

meta_anchor = '// @downloadURL  https://raw.githubusercontent.com/blankode/edays-percentages-overview/main/script.js\n// ==/UserScript=='
meta_replacement = '// @downloadURL  https://raw.githubusercontent.com/blankode/edays-percentages-overview/main/script.js\n// @run-at       document-start\n// ==/UserScript=='
if meta_anchor not in s:
    raise RuntimeError('Metadata anchor not found')
s = s.replace(meta_anchor, meta_replacement, 1)

bootstrap_anchor = '// ==/UserScript==\n\n/* === VENDORED DARK READER API 4.9.133 (MIT) === */'
bootstrap = r'''// ==/UserScript==

/* v19.5 — prevent a white first paint when persisted dark mode is enabled. */
const EP_DARK_BOOTSTRAP_ID = 'ep-dark-bootstrap';
const EP_DARK_BOOTSTRAP_CLASS = 'ep-dark-bootstrapping';
const EP_DARK_BOOTSTRAP_KEY = 'ep-theme-override';
const EP_DARK_BOOTSTRAP_TIMEOUT_MS = 5000;

const clearEarlyDarkBootstrap = () => {
    const root = document.documentElement;
    if (root) {
        root.classList.remove(EP_DARK_BOOTSTRAP_CLASS);
        root.style.removeProperty('background-color');
        root.style.removeProperty('color-scheme');
    }
    document.getElementById(EP_DARK_BOOTSTRAP_ID)?.remove();
};

(() => {
    try {
        if (localStorage.getItem(EP_DARK_BOOTSTRAP_KEY) !== 'dark') return;
        const root = document.documentElement;
        if (!root) return;

        root.classList.add(EP_DARK_BOOTSTRAP_CLASS);
        root.style.setProperty('background-color', '#181a1b', 'important');
        root.style.setProperty('color-scheme', 'dark');

        const style = document.createElement('style');
        style.id = EP_DARK_BOOTSTRAP_ID;
        style.textContent = `
            html{background:#181a1b!important;color-scheme:dark!important;}
            body{background:#181a1b!important;}
            html.${EP_DARK_BOOTSTRAP_CLASS} body{visibility:hidden!important;}
        `;
        (document.head || root).appendChild(style);

        // Safety valve: never leave eDays hidden if startup is interrupted.
        window.setTimeout(clearEarlyDarkBootstrap, EP_DARK_BOOTSTRAP_TIMEOUT_MS);
    } catch (_) {
        clearEarlyDarkBootstrap();
    }
})();

/* === VENDORED DARK READER API 4.9.133 (MIT) === */'''
if bootstrap_anchor not in s:
    raise RuntimeError('Dark Reader bundle anchor not found')
s = s.replace(bootstrap_anchor, bootstrap, 1)

changelog_anchor = "// Changelog v19.4: Fixed Today highlight styling after refresh when persistent Dark Reader mode is enabled by making stylesheet/theme activation order deterministic."
changelog_line = "// Changelog v19.5: Eliminated the persisted-dark white flash on refresh with a document-start bootstrap and fixed Include buffer control rendering in dark mode."
if changelog_anchor not in s:
    raise RuntimeError('v19.4 changelog anchor not found')
s = s.replace(changelog_anchor, changelog_line + '\n' + changelog_anchor, 1)

old_apply = '''            if (T.isDark) {
                // Dark mode: Analyzer CSS must exist first so Dark Reader's dedicated
                // Today fixes are inserted later and reliably win the cascade.
                injectStyles(T);
                DarkReader.enable(DARK_READER_THEME, DARK_READER_FIXES);
            } else {
                // Light mode: DarkReader.disable() removes every style.darkreader,
                // including our protected Analyzer stylesheet. Disable first, then
                // recreate the Analyzer CSS so cards/layout never collapse to text.
                if (typeof DarkReader.disable === 'function') {
                    DarkReader.disable();
                }
                injectStyles(T);
            }
        } catch (error) {
            console.error('[eDays Analyzer Pro] Dark Reader theme error:', error);
            // Never leave the Analyzer unstyled if Dark Reader fails midway.
            injectStyles(T);
        }

        return T;'''
new_apply = '''            if (T.isDark) {
                // Dark mode: Analyzer CSS must exist first so Dark Reader's dedicated
                // Today fixes are inserted later and reliably win the cascade.
                injectStyles(T);
                DarkReader.enable(DARK_READER_THEME, DARK_READER_FIXES);

                // Keep the early dark bootstrap in place through the next two paint
                // opportunities so users never see the original white eDays theme.
                requestAnimationFrame(() => {
                    requestAnimationFrame(clearEarlyDarkBootstrap);
                });
            } else {
                clearEarlyDarkBootstrap();
                // Light mode: DarkReader.disable() removes every style.darkreader,
                // including our protected Analyzer stylesheet. Disable first, then
                // recreate the Analyzer CSS so cards/layout never collapse to text.
                if (typeof DarkReader.disable === 'function') {
                    DarkReader.disable();
                }
                injectStyles(T);
            }
        } catch (error) {
            console.error('[eDays Analyzer Pro] Dark Reader theme error:', error);
            // Never leave the Analyzer unstyled or the page bootstrap-hidden.
            injectStyles(T);
            clearEarlyDarkBootstrap();
        }

        return T;'''
if old_apply not in s:
    raise RuntimeError('applySiteTheme branch block not found')
s = s.replace(old_apply, new_apply, 1)

old_toggle_css = '''        #ep13 .ep-today-actions{display:flex;align-items:center;gap:6px;flex-shrink:0;}
        #ep13 .ep-toggle-track{display:inline-block;width:28px;height:16px;border-radius:8px;position:relative;vertical-align:middle;flex-shrink:0;transition:background .2s;}
        #ep13 .ep-toggle-thumb{position:absolute;width:12px;height:12px;background:#fff;border-radius:50%;top:2px;box-shadow:0 1px 2px rgba(0,0,0,0.25);transition:left .2s;}
'''
new_toggle_css = '''        #ep13 .ep-today-actions{display:flex;align-items:center;gap:6px;flex-shrink:0;}
        #ep13 .ep-toggle-track{display:inline-block;width:28px;height:16px;border-radius:8px;position:relative;vertical-align:middle;flex-shrink:0;transition:background .2s,border-color .2s;}
        #ep13 .ep-toggle-thumb{position:absolute;width:12px;height:12px;background:#fff;border-radius:50%;top:2px;box-shadow:0 1px 2px rgba(0,0,0,0.25);transition:left .2s;}
        #ep13 .ep-buffer-toggle{background:${T.isDark?'#25282a':'transparent'}!important;color:${T.text}!important;border-color:${T.isDark?'#4b5054':'#bcc1c2'}!important;}
        #ep13 .ep-buffer-toggle:hover{background:${T.isDark?'#303436':'#f0f0f0'}!important;color:${T.text}!important;border-color:${T.isDark?'#666d72':'#bcc1c2'}!important;}
        #ep13 .ep-buffer-toggle.is-off .ep-toggle-track{background:${T.isDark?'#4b5155':'rgba(0,0,0,.16)'}!important;box-shadow:inset 0 0 0 1px ${T.isDark?'rgba(255,255,255,.08)':'rgba(0,0,0,.06)'};}
        #ep13 .ep-buffer-toggle.is-on .ep-toggle-track{background:#3b82f6!important;box-shadow:inset 0 0 0 1px rgba(147,197,253,.25);}
        #ep13 .ep-buffer-toggle .ep-toggle-thumb{background:${T.isDark?'#f3f4f6':'#fff'}!important;box-shadow:0 1px 3px rgba(0,0,0,.38)!important;}
'''
if old_toggle_css not in s:
    raise RuntimeError('Toggle CSS anchor not found')
s = s.replace(old_toggle_css, new_toggle_css, 1)

old_markup = '''                                <span
                                    class="ep-btn ep-btn-pill"
                                    data-action="buf-toggle"
                                >
                                    <span
                                        class="ep-toggle-track"
                                        style="background:${todayBufOn ? '#3b82f6' : T.barTrack};"
                                    >'''
new_markup = '''                                <span
                                    class="ep-btn ep-btn-pill ep-buffer-toggle ${todayBufOn ? 'is-on' : 'is-off'}"
                                    data-action="buf-toggle"
                                >
                                    <span class="ep-toggle-track">'''
if old_markup not in s:
    raise RuntimeError('Include buffer markup anchor not found')
s = s.replace(old_markup, new_markup, 1)

old_boot = '''    const boot = () => {
        initSiteEnhancements();
        const tick = setInterval('''
new_boot = '''    const boot = () => {
        // @run-at document-start is required for the anti-flash bootstrap. Defer
        // the normal application boot until eDays has created head and body.
        if (!document.head || !document.body) {
            requestAnimationFrame(boot);
            return;
        }

        initSiteEnhancements();
        const tick = setInterval('''
if old_boot not in s:
    raise RuntimeError('Boot anchor not found')
s = s.replace(old_boot, new_boot, 1)

# Guards
required = [
    '// @version      19.5',
    '// @run-at       document-start',
    'EP_DARK_BOOTSTRAP_TIMEOUT_MS = 5000',
    'requestAnimationFrame(clearEarlyDarkBootstrap)',
    'ep-buffer-toggle ${todayBufOn',
    "#ep13 .ep-buffer-toggle.is-off .ep-toggle-track",
    "if (!document.head || !document.body)",
]
for marker in required:
    if marker not in s:
        raise RuntimeError(f'Missing marker: {marker}')

p.write_text(s, encoding='utf-8')
