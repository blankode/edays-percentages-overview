from pathlib import Path

SCRIPT = Path('script.js')
DARKREADER = Path('/tmp/darkreader.js')
LICENSE = Path('/tmp/darkreader-LICENSE')

s = SCRIPT.read_text(encoding='utf-8')
if '// @version      19.3' not in s:
    raise RuntimeError('Expected userscript version 19.3')

dr = DARKREADER.read_text(encoding='utf-8')
license_text = LICENSE.read_text(encoding='utf-8').strip()
if 'DarkReader' not in dr or len(dr) < 250_000:
    raise RuntimeError('Downloaded Dark Reader API bundle looks invalid')

begin = '/* === VENDORED DARK READER API 4.9.133 (MIT) === */'
end = '/* === END VENDORED DARK READER API === */'

# Idempotency: remove an older vendored block before inserting the pinned build.
if begin in s:
    a = s.index(begin)
    b = s.index(end, a) + len(end)
    s = s[:a] + s[b:]

metadata_end = '// ==/UserScript=='
pos = s.index(metadata_end) + len(metadata_end)
vendor = (
    '\n\n' + begin + '\n'
    + '/*\n' + license_text + '\n*/\n'
    + dr.rstrip() + '\n'
    + end + '\n'
)
s = s[:pos] + vendor + s[pos:]

# Dark Reader API can ignore author-owned stylesheets carrying class="darkreader".
# Keep Analyzer/Enhanced styles under our control while Dark Reader themes eDays.
style_old = """            s = document.createElement('style');\n            s.id = STYLE_ID;\n            document.head.appendChild(s);"""
style_new = """            s = document.createElement('style');\n            s.id = STYLE_ID;\n            s.classList.add('darkreader');\n            document.head.appendChild(s);"""
if "s.classList.add('darkreader');" not in s:
    if style_old not in s:
        raise RuntimeError('Analyzer style creation block not found')
    s = s.replace(style_old, style_new, 1)

# Replace the manual site-shell class theming switch with the official Dark Reader API.
site_marker = '       SITE-WIDE THEME CONTROLS'
site_pos = s.index(site_marker)
apply_start = s.index('    const applySiteTheme = () => {', site_pos)
apply_end_marker = '\n    };\n\n    const setSiteThemeIcon'
apply_end = s.index(apply_end_marker, apply_start)

new_apply = r'''    const DARK_READER_THEME = Object.freeze({
        mode: 1,
        brightness: 100,
        contrast: 100,
        grayscale: 0,
        sepia: 0,
        darkSchemeBackgroundColor: '#181a1b',
        darkSchemeTextColor: '#e8e6e3',
        scrollbarColor: 'auto',
        selectionColor: 'auto',
        styleSystemControls: true,
    });

    const DARK_READER_FIXES = Object.freeze({
        invert: [],
        css: '',
        ignoreInlineStyle: [],
        ignoreImageAnalysis: [
            '#ep13 .ep-hdr-logo',
            '#timesheetMonthHeader h2 .ep-enhanced-text',
        ],
        disableStyleSheetsProxy: false,
        ignoreCSSUrl: [],
    });

    const applySiteTheme = () => {
        const T = getTheme();

        // v19.3 originally used a large hand-maintained selector list. Keep those
        // legacy rules inert and let Dark Reader's Dynamic Theme engine analyze the
        // actual page instead, including pages/components we have never seen before.
        document.documentElement.classList.remove('ep-site-dark');
        document.documentElement.dataset.epTheme = T.isDark ? 'dark' : 'light';
        if (document.body) {
            document.body.classList.remove('ep-site-dark');
        }

        try {
            if (typeof DarkReader === 'undefined' || typeof DarkReader.enable !== 'function') {
                throw new Error('Bundled Dark Reader API is unavailable');
            }

            if (T.isDark) {
                DarkReader.enable(DARK_READER_THEME, DARK_READER_FIXES);
            } else if (typeof DarkReader.disable === 'function') {
                DarkReader.disable();
            }
        } catch (error) {
            console.error('[eDays Analyzer Pro] Dark Reader theme error:', error);
        }

        injectStyles(T);
        return T;
    };'''

s = s[:apply_start] + new_apply + s[apply_end + len('\n    };'):]

# Keep the existing 19.3 release number but make the changelog accurately describe
# the now-official dynamic engine.
old_changelog = '// Changelog v19.3: Extended persistent light/dark theming across the eDays site shell, moved the theme control beside Book time off, moved Analyzer Settings beside timesheet navigation, added Time Tracking Enhanced branding, and removed the Analyzer header.'
new_changelog = '// Changelog v19.3: Uses the bundled official Dark Reader Dynamic Theme engine for site-wide dark mode; keeps the theme control beside Book time off, Analyzer Settings beside navigation, Time Tracking Enhanced branding, and the compact Analyzer layout.'
if old_changelog in s:
    s = s.replace(old_changelog, new_changelog, 1)

# Guardrails.
if '// @version      19.3' not in s:
    raise RuntimeError('Version changed unexpectedly')
if "DarkReader.enable(DARK_READER_THEME, DARK_READER_FIXES);" not in s:
    raise RuntimeError('Dark Reader enable call missing')
if "s.classList.add('darkreader');" not in s:
    raise RuntimeError('Analyzer stylesheet ignore marker missing')
if "classList.toggle('ep-site-dark'" in s:
    raise RuntimeError('Manual ep-site-dark activation still present')
if '\n// @require' in s:
    raise RuntimeError('script.js must remain standalone')

SCRIPT.write_text(s, encoding='utf-8')
