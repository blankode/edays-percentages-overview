from pathlib import Path

p = Path('script.js')
s = p.read_text(encoding='utf-8')

if '// @version      19.3' not in s:
    raise RuntimeError('Expected version 19.3')

s = s.replace('// @version      19.3', '// @version      19.4', 1)

old_changelog = "// Changelog v19.3: Uses the bundled official Dark Reader Dynamic Theme engine for site-wide dark mode; keeps the theme control beside Book time off, Analyzer Settings beside navigation, Time Tracking Enhanced branding, and the compact Analyzer layout."
new_changelog = "// Changelog v19.4: Fixed Today highlight styling after refresh when persistent Dark Reader mode is enabled by making stylesheet/theme activation order deterministic.\n" + old_changelog
if old_changelog not in s:
    raise RuntimeError('v19.3 changelog anchor not found')
s = s.replace(old_changelog, new_changelog, 1)

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

if old not in s:
    raise RuntimeError('applySiteTheme block not found')
s = s.replace(old, new, 1)

if '// @version      19.4' not in s:
    raise RuntimeError('Version bump failed')
block_start = s.index('    const applySiteTheme = () => {')
block_end = s.index('    const setSiteThemeIcon', block_start)
block = s[block_start:block_end]
if block.index('injectStyles(T);') > block.index('DarkReader.enable(DARK_READER_THEME, DARK_READER_FIXES);'):
    raise RuntimeError('injectStyles still runs after Dark Reader enable')
if block.count('injectStyles(T);') != 1:
    raise RuntimeError('Unexpected injectStyles count in applySiteTheme')

p.write_text(s, encoding='utf-8')
