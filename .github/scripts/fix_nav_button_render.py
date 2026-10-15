from pathlib import Path

path = Path('script.js')
source = path.read_text(encoding='utf-8')

old_update = """    const updateTimesheetNavButton = () => {
        const button = document.getElementById(TIMESHEET_NAV_BUTTON_ID);
        if (!button) return;

        const todayRow = getTodayRow();
        let target = 'top';

        if (todayRow) {
            const scrollParent = getScrollParent(todayRow);
            const viewportTop = scrollParent === window
                ? 0
                : scrollParent.getBoundingClientRect().top;
            const todayReachedAt = viewportTop + 110;
            target = todayRow.getBoundingClientRect().top <= todayReachedAt
                ? 'top'
                : 'today';
        }

        const label = target === 'today' ? '↓ To today' : '↑ To home';
        if (button.textContent.trim() !== label) {
            button.textContent = label;
        }
        button.dataset.epTarget = target;

        const description = target === 'today'
            ? 'Jump to today in the current timesheet'
            : 'Back to the top of the timesheet';
        button.setAttribute('title', description);
        button.setAttribute('aria-label', description);
    };"""

new_update = """    const getTimesheetNavState = () => {
        const todayRow = getTodayRow();
        if (!todayRow) return 'top';

        const scrollParent = getScrollParent(todayRow);
        const viewportTop = scrollParent === window
            ? 0
            : scrollParent.getBoundingClientRect().top;
        const todayReachedAt = viewportTop + 110;

        return todayRow.getBoundingClientRect().top <= todayReachedAt
            ? 'top'
            : 'today';
    };

    const getTimesheetNavLabel = target => target === 'today'
        ? '↓ To today'
        : '↑ To home';

    const configureTimesheetNavButton = (button, target) => {
        const label = getTimesheetNavLabel(target);
        const description = target === 'today'
            ? 'Jump to today in the current timesheet'
            : 'Back to the top of the timesheet';

        button.dataset.epTarget = target;
        button.textContent = label;
        button.setAttribute('title', description);
        button.setAttribute('aria-label', description);
    };

    const createTimesheetNavButton = target => {
        const button = document.createElement('c3-button');
        button.id = TIMESHEET_NAV_BUTTON_ID;
        button.className = 'disallow-impersonation-action';

        // Configure the light-DOM label BEFORE insertion. eDays' c3-button
        // initializes from its existing child text when it is connected.
        configureTimesheetNavButton(button, target);

        button.addEventListener('click', event => {
            event.preventDefault();
            if (button.dataset.epTarget === 'today') {
                jumpToToday();
            } else {
                jumpToAnalyzer();
            }
            setTimeout(scheduleTimesheetNavUpdate, 350);
            setTimeout(scheduleTimesheetNavUpdate, 900);
        });

        return button;
    };

    const updateTimesheetNavButton = () => {
        const button = document.getElementById(TIMESHEET_NAV_BUTTON_ID);
        if (!button) return;

        const target = getTimesheetNavState();
        const label = getTimesheetNavLabel(target);

        // Do not mutate the text of an already-connected c3-button. Some eDays
        // builds cache the initial light-DOM label. Recreate only when state/text
        // changes so the native component initializes with the correct label.
        if (button.dataset.epTarget !== target || button.textContent.trim() !== label) {
            const replacement = createTimesheetNavButton(target);
            button.replaceWith(replacement);
            return;
        }

        configureTimesheetNavButton(button, target);
    };"""

if old_update not in source:
    raise RuntimeError('Current updateTimesheetNavButton block not found')
source = source.replace(old_update, new_update, 1)

old_ensure = """        let button = document.getElementById(TIMESHEET_NAV_BUTTON_ID);
        if (!button || button.tagName.toLowerCase() !== 'c3-button') {
            button?.remove();
            button = document.createElement('c3-button');
            button.id = TIMESHEET_NAV_BUTTON_ID;
            button.className = 'disallow-impersonation-action';
            button.addEventListener('click', event => {
                event.preventDefault();
                if (button.dataset.epTarget === 'today') {
                    jumpToToday();
                    setTimeout(scheduleTimesheetNavUpdate, 350);
                    setTimeout(scheduleTimesheetNavUpdate, 900);
                } else {
                    jumpToAnalyzer();
                    setTimeout(scheduleTimesheetNavUpdate, 350);
                    setTimeout(scheduleTimesheetNavUpdate, 900);
                }
            });
        }"""

new_ensure = """        let button = document.getElementById(TIMESHEET_NAV_BUTTON_ID);
        if (!button || button.tagName.toLowerCase() !== 'c3-button') {
            button?.remove();
            button = createTimesheetNavButton(getTimesheetNavState());
        }"""

if old_ensure not in source:
    raise RuntimeError('Current ensureTimesheetNavButton creation block not found')
source = source.replace(old_ensure, new_ensure, 1)

# Stay on the same iteration/version while this feature is being fixed.
if '// @version      19.2' not in source:
    raise RuntimeError('Expected userscript version 19.2')

path.write_text(source, encoding='utf-8')
