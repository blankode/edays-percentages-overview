from pathlib import Path

p = Path('README.md')
s = p.read_text(encoding='utf-8')

old_badge = 'version-19.4-6366f1'
new_badge = 'version-19.5-6366f1'
if old_badge not in s:
    raise RuntimeError('README 19.4 badge not found')
s = s.replace(old_badge, new_badge, 1)

anchor = '| **19.4** | Fixed the custom **Today** highlight disappearing after refreshing eDays while persistent Dark Reader mode was already enabled. Analyzer CSS is now established before Dark Reader activates, making cascade order deterministic so the dedicated dark-mode Today row/header/chip overrides render correctly on both fresh loads and manual theme toggles. |'
entry = '| **19.5** | Removed the white flash when refreshing with persistent dark mode enabled by starting at `document-start` with a temporary dark bootstrap that hands off to Dark Reader once the page is ready. Added a fail-safe bootstrap timeout and deferred normal app startup until `<head>`/`<body>` exist. Also fixed the **Include buffer** toggle in dark mode with explicit themed button, track, thumb, hover, and on/off states. |'
if anchor not in s:
    raise RuntimeError('README 19.4 changelog anchor not found')
s = s.replace(anchor, entry + '\n' + anchor, 1)

p.write_text(s, encoding='utf-8')
