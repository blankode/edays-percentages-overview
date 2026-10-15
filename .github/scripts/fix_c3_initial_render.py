from pathlib import Path

p = Path('script.js')
s = p.read_text(encoding='utf-8')

old_update = """    const updateTimesheetNavButton = () => {
        const button = document.getElementById(TIMESHEET_NAV_BUTTON_ID);
        if (!button) return;

        const todayRow = getTodayRow();
        let target = 'top';

        if (todayRow) {
            const metrics = getScrollMetrics(todayRow);
            const todayReachedAt = Math.max(0, metrics.target - 100);
            target = metrics.current >= todayReachedAt ? 'top' : 'today';
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

        const metrics = getScrollMetrics(todayRow);
        const todayReachedAt = Math.max(0, metrics.target - 100);
        return metrics.current >= todayReachedAt ? 'top' : 'today';
    };

    const getTimesheetNavLabel = target => target === 'today'
        ? '↓ To today'
        : '↑ To home';

    const configureTimesheetNavButton = (button, target) => {
        const description = target === 'today'
            ? 'Jump to today in the current timesheet'
            : 'Back to the top of the timesheet';

        button.dataset.epTarget = target;
        button.setAttribute('title', description);
        button.setAttribute('aria-label', description);
    };

    const createTimesheetNavButton = target => {
        const button = document.createElement('c3-button');
        button.id = TIMESHEET_NAV_BUTTON_ID;
        button.className = 'disallow-impersonation-action';

        // eDays' c3-button initializes its visible content when connected.
        // Give it the label first, then attach it to the document.
        button.textContent = getTimesheetNavLabel(target);
        configureTimesheetNavButton(button, target);

        button.addEventListener('click', event => {
            event.preventDefault();
            if (button.dataset.epTarget === 'today') {
                jumpToToday();
            } else {
                jumpToAnalyzer();
            }
        });

        return button;
    };

    const updateTimesheetNavButton = () => {
        const button = document.getElementById(TIMESHEET_NAV_BUTTON_ID);
        if (!button) return;

        const target = getTimesheetNavState();

        // Never rewrite text on an already-connected c3-button. Recreate it only
        // when the target actually changes, with its new label set before insertion.
        if (button.dataset.epTarget !== target) {
            button.replaceWith(createTimesheetNavButton(target));
            return;
        }

        configureTimesheetNavButton(button, target);
    };"""

if old_update not in s:
    raise RuntimeError('Expected updateTimesheetNavButton block not found')
s = s.replace(old_update, new_update, 1)

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
                } else {
                    jumpToAnalyzer();
                }
            });
        }

        if (submitButton.nextElementSibling !== button) {
            submitButton.insertAdjacentElement('afterend', button);
        }"""

new_ensure = """        let button = document.getElementById(TIMESHEET_NAV_BUTTON_ID);
        if (!button || button.tagName.toLowerCase() !== 'c3-button') {
            button?.remove();
            button = createTimesheetNavButton(getTimesheetNavState());
        }

        if (submitButton.nextElementSibling !== button) {
            submitButton.insertAdjacentElement('afterend', button);
        }"""

if old_ensure not in s:
    raise RuntimeError('Expected ensureTimesheetNavButton creation block not found')
s = s.replace(old_ensure, new_ensure, 1)

if '// @version      19.2' not in s:
    raise RuntimeError('Expected version 19.2')

p.write_text(s, encoding='utf-8')

# trigger
