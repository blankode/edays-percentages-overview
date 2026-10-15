from pathlib import Path

p = Path('script.js')
s = p.read_text(encoding='utf-8')

if '// @version      19.4' not in s:
    raise RuntimeError('Expected version 19.4')

old = '''    const applySiteTheme = () => {
        const T = getTheme();

        // v19.3 originally used a large hand-maintained selector list. Keep those
        // legacy rules inert and let Dark Reader's Dynamic Theme engine analyze the
        // actual page instead, including pages/components we have never seen before.
        document.documentElement.classList.remove('ep-site-dark');
        document.documentElement.dataset.epTheme = T.isDark ? 'dark' : 'light';
        if (document.body) {
            document.body.classList.remove('ep-site-dark');
        }

        // Keep Analyzer CSS earlier in the cascade. The Today light-theme rules use
        // !important, so Dark Reader's fixes must be inserted after this stylesheet
        // to win consistently on both fresh loads and manual theme toggles.
        injectStyles(T);

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

        return T;
    };'''

new = '''    const applySiteTheme = () => {
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

        return T;
    };'''

if old not in s:
    raise RuntimeError('applySiteTheme v19.4 block not found')
s = s.replace(old, new, 1)

anchor = "// Changelog v19.4: Fixed Today highlight styling after refresh when persistent Dark Reader mode is enabled by making stylesheet/theme activation order deterministic."
extra = "// Changelog v19.4: Fixed light-mode switching removing Analyzer styles by recreating protected CSS after Dark Reader is disabled."
if extra not in s:
    if anchor not in s:
        raise RuntimeError('v19.4 changelog anchor not found')
    s = s.replace(anchor, anchor + '\n' + extra, 1)

block_start = s.index('    const applySiteTheme = () => {')
block_end = s.index('    const setSiteThemeIcon', block_start)
block = s[block_start:block_end]
if "DarkReader.disable();\n                }\n                injectStyles(T);" not in block:
    raise RuntimeError('Light-mode reinjection ordering missing')
if "injectStyles(T);\n                DarkReader.enable" not in block:
    raise RuntimeError('Dark-mode ordering changed unexpectedly')
if "catch (error)" not in block or block.count('injectStyles(T);') < 3:
    raise RuntimeError('Fallback Analyzer reinjection missing')

p.write_text(s, encoding='utf-8')
