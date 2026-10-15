from pathlib import Path

path = Path('script.js')
source = path.read_text(encoding='utf-8')

old_config = """    const configureTimesheetNavButton = (button, target) => {
        const label = getTimesheetNavLabel(target);
        const description = target === 'today'
            ? 'Jump to today in the current timesheet'
            : 'Back to the top of the timesheet';

        button.dataset.epTarget = target;
        button.textContent = label;
        button.setAttribute('title', description);
        button.setAttribute('aria-label', description);
    };"""

new_config = """    const configureTimesheetNavButton = (button, target) => {
        const label = getTimesheetNavLabel(target);
        const description = target === 'today'
            ? 'Jump to today in the current timesheet'
            : 'Back to the top of the timesheet';

        button.dataset.epTarget = target;

        // c3-button reads its light-DOM label when first connected. Never rewrite
        // child text after connection: that would trigger our body MutationObserver
        // and can create a self-sustaining render loop in eDays.
        if (!button.isConnected && button.textContent.trim() !== label) {
            button.textContent = label;
        }

        button.setAttribute('title', description);
        button.setAttribute('aria-label', description);
    };"""

if old_config not in source:
    raise RuntimeError('configureTimesheetNavButton block not found')
source = source.replace(old_config, new_config, 1)

old_update = """        // Do not mutate the text of an already-connected c3-button. Some eDays
        // builds cache the initial light-DOM label. Recreate only when state/text
        // changes so the native component initializes with the correct label.
        if (button.dataset.epTarget !== target || button.textContent.trim() !== label) {
            const replacement = createTimesheetNavButton(target);
            button.replaceWith(replacement);
            return;
        }

        configureTimesheetNavButton(button, target);"""

new_update = """        // Once connected, c3-button may manage/transform its own child content.
        // Only recreate when the navigation TARGET changes. Comparing or rewriting
        // textContent here can make the MutationObserver continuously replace it.
        if (button.dataset.epTarget !== target) {
            const replacement = createTimesheetNavButton(target);
            button.replaceWith(replacement);
            return;
        }

        configureTimesheetNavButton(button, target);"""

if old_update not in source:
    raise RuntimeError('updateTimesheetNavButton replacement block not found')
source = source.replace(old_update, new_update, 1)

# Keep this work on the existing 19.2 userscript line.
if '// @version      19.2' not in source:
    raise RuntimeError('Expected userscript version 19.2')

path.write_text(source, encoding='utf-8')
