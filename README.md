<div align="center">

<br/>

```
  ███████╗██████╗  █████╗ ██╗   ██╗███████╗
  ██╔════╝██╔══██╗██╔══██╗╚██╗ ██╔╝██╔════╝
  █████╗  ██║  ██║███████║ ╚████╔╝ ███████╗
  ██╔══╝  ██║  ██║██╔══██║  ╚██╔╝  ╚════██║
  ███████╗██████╔╝██║  ██║   ██║   ███████║
  ╚══════╝╚═════╝ ╚═╝  ╚═╝   ╚═╝   ╚══════╝
```

# eDays Analyzer Pro

**A Tampermonkey userscript that overlays a live analytics dashboard on top of eDays — showing office attendance, time vs rota, buffer, and day counts at a glance.**

[![Version](https://img.shields.io/badge/version-19.7-6366f1?style=flat-square&labelColor=0f0f0f)](https://github.com/blankode/edays-percentages-overview)
[![Platform](https://img.shields.io/badge/platform-Tampermonkey-f59e0b?style=flat-square&labelColor=0f0f0f)](https://www.tampermonkey.net/)
[![License](https://img.shields.io/badge/license-MIT-22c55e?style=flat-square&labelColor=0f0f0f)](LICENSE)
[![Site](https://img.shields.io/badge/works%20on-e--days.com-3b82f6?style=flat-square&labelColor=0f0f0f)](https://e-days.com)

<br/>

</div>

---

## ✦ What It Does

eDays has no built-in way to track your office attendance percentage, buffer time, or remaining workdays at a glance. This script injects a **4-card dashboard** at the top of your timesheet that computes all of that in real time — and updates automatically as you edit entries.

<br/>

## ◈ Dashboard Cards

### 1 · Activity Breakdown
Breaks down your logged time by activity type — Office, Mobile Working, Business Travel — as both hours and percentage of your real rota. Includes a progress bar per activity and a total logged line with completion percentage.

### 2 · Office Target
Tracks your office attendance against a configurable target (default **60%**). Displays a ring gauge showing how close you are, how many hours you've logged in-office, what the target is in hours, and how much more you need to hit it.

### 3 · Time vs Rota
Shows recorded hours against your real rota (gross rota minus absences and public holidays). Ring gauge, raw numbers, and a breakdown of absences, holidays, and days worked.

### 4 · Buffer & Outlook
Shows whether you're ahead or behind on your daily 8h target based on past days. Includes chip counters for Workable / So Far / Days Left / Worked days, a month progress bar, and notices for your running buffer.

<br/>

## ⤢ Compact Dashboard

The native **Minimize** button appears immediately to the right of **Analyzer Settings** in the Time Tracking header. Click it to replace the expanded analytics cards and Office Planner with a low-profile four-metric view:

- **Today** — time worked against today's effective target, time remaining, optional leave-at estimate, and a compact **Include buffer** switch.
- **Office Target** — percentage of the configured office target achieved, logged office time, and time still needed.
- **Buffer** — current surplus or deficit relative to the scheduled daily target.
- **Month Progress** — recorded hours against real rota, completion percentage, and remaining hours.

The **Today** figure starts from eDays' worked time (Total): when **Breaks** is nonzero, the deduction is **capped at 30 minutes**, even if the selected break is longer. When Breaks is `00:00`, the configured mandatory break is used (also capped at 30 minutes). Gaps between periods are not counted as additional breaks. For example, **7h08 recorded** with a 1h50 selected break shows **6h38 effective worked time**, leaving **1h22** to an 8-hour net target.

Click **Expand** to restore the complete dashboard. The setting is saved locally and persists after page refreshes. Compact mode uses the same underlying calculations, light/dark theme, spacing/alignment, and metric card borders as the expanded view, without an extra outer border.

<br/>

## ⬡ Installation

### Prerequisites
- [Tampermonkey](https://www.tampermonkey.net/) installed in your browser (Chrome, Firefox, Edge, Safari)

### Steps

**1. Open Tampermonkey**
Click the Tampermonkey icon in your browser toolbar → **Create a new script**

**2. Paste the script**
Replace the default contents with the full script from [`script.js`](https://raw.githubusercontent.com/blankode/edays-percentages-overview/main/script.js)

**3. Save**
`Ctrl + S` — the script is now active

**4. Navigate to eDays**
Go to your timesheet at `*.e-days.com` — the dashboard will appear automatically at the top

<br/>

## ⚙ Configuration

At the very top of the script, one line controls the office attendance target:

```js
const offTarget = 60; // percentage target for office days
```

Change `60` to whatever your company requires (e.g. `50`, `75`) and save.

<br/>

## ↻ Auto-Updates

The script includes auto-update headers pointing to the raw GitHub file:

```
// @updateURL  https://raw.githubusercontent.com/blankode/edays-percentages-overview/main/script.js
// @downloadURL  https://raw.githubusercontent.com/blankode/edays-percentages-overview/main/script.js
```

Tampermonkey will detect version bumps and prompt you to update. To control how often it checks:

> **Tampermonkey Settings → Updates → Script Update Interval** → set to `Every 12 hours`

<br/>

## ◐ Theme

The userscript now provides a persistent **Dark mode / Light mode** control beside the native eDays **Book time off** action. Dark mode uses the bundled official **Dark Reader Dynamic Theme engine**, so the complete eDays site is themed dynamically across pages and newly rendered components rather than relying on a fixed list of selectors. Analyzer-specific styling, including the custom Today highlight and animated **Enhanced** branding, is preserved with dedicated Dark Reader fixes.

<br/>

## ◻ How Days Are Counted

| Chip | Logic |
|---|---|
| **Workable** | All day containers on the page, excluding weekends (Saturday/Sunday) and full-day absences/holidays. Half-day vacations (AM or PM) **are** counted as workable. |
| **So Far** | `Workable − Days Left` |
| **Days Left** | `(realRota − recorded) ÷ 480 mins` rounded |
| **Worked** | Days with any logged hours, excluding weekends |

**Real Rota** = Gross rota − absences − public holidays

<br/>

## ◈ Activity Types Supported

| Activity | Colour |
|---|---|
| Office | Blue |
| Mobile Working | Pink → Orange |
| Business Travel | Purple |
| No Activity | Dark grey |
| Custom / unknown | Slate fallback |

<br/>

## ⟳ Live Updates

The dashboard re-renders automatically via a **MutationObserver** watching the timesheet panel — so edits to time entries and activity dropdowns reflect instantly (600ms debounce). A 30-second fallback poll catches summary-only changes.

<br/>

## ◎ Compatibility

| Browser | Status |
|---|---|
| Chrome | ✅ |
| Firefox | ✅ |
| Edge | ✅ |
| Safari | ✅ (with Tampermonkey) |

Tested on `*.e-days.com` monthly timesheet view.

<br/>

## ∿ Changelog

| Version | Changes |
|---|---|
| **19.7** | Fixed Today time accounting across expanded and compact dashboards: read the break from eDays' **Breaks** selectors when nonzero but **never deduct more than 30 minutes**, even for longer selected breaks. When `00:00` is selected, use the configured mandatory-break default (also capped at 30 minutes). Gaps between working periods do not create additional deductions. Today worked/remaining hours, leave-at estimates, progress, and Buffer projections use this consistent rule. |
| **19.6** | Promoted the tested `script_mini.js` compact layout into the main standalone userscript. Added a persistent native **Minimize / Expand** button immediately to the right of Analyzer Settings. Minimized mode displays only **Today**, **Office Target**, **Buffer**, and **Month Progress**, including a compact **Include buffer** control and the same calculations as the full dashboard. Matched the expanded view's light/dark background, padding, and alignment while keeping metric card borders and removing the unwanted outer border. The separate mini test script was retired. |
| **19.5** | Removed the white flash when refreshing with persistent dark mode enabled by starting at `document-start` with a temporary dark bootstrap that hands off to Dark Reader once the page is ready. Added a fail-safe bootstrap timeout and deferred normal app startup until `<head>`/`<body>` exist. Also fixed the **Include buffer** toggle in dark mode with explicit themed button, track, thumb, hover, and on/off states. |
| **19.4** | Fixed the custom **Today** highlight disappearing after refreshing eDays while persistent Dark Reader mode was already enabled. Analyzer CSS is now established before Dark Reader activates, making cascade order deterministic so the dedicated dark-mode Today row/header/chip overrides render correctly on both fresh loads and manual theme toggles. |
| **19.3** | Expanded light/dark theming from the Analyzer to the full eDays site and moved the theme control beside **Book time off** using native eDays button styling. Replaced the hand-maintained dark CSS with the bundled official **Dark Reader 4.9.133 Dynamic Theme engine** for consistent theming across pages and dynamically rendered components; removed the whole-page theme observer that could slow or freeze the site. Added **Time Tracking Enhanced** branding with an animated blue/purple/cyan gradient, moved Analyzer Settings beside the Today/Home navigation as an icon-only native button, removed the old Analyzer header/separator, and added dedicated Dark Reader fixes so the custom Today row/header/chip styling remains visually distinct in dark mode. |
| **19.2** | Unified Today / Back to top navigation into one native eDays `c3-button` placed immediately after Submit month. The button switches between **To today** and **Back to top** based on scroll position; the old floating button and Today-strip jump action are removed. |
| **19.1** | Added a subtle full-row Today highlight with blue accent, tinted background, and a stronger Today chip for faster visual scanning. |
| **19.0** | Replaced the inline Back to Analyzer button with a floating down-arrow that appears after scrolling and returns to the analyzer. |
| **18.9** |Changelog v18.9: Added persistent Analyzer Settings for Office Target and Mandatory Break, with validation, live recalculation, and reset-to-defaults support. |
| **18.8** | Made the mandatory break configurable and included any missing break in Today buffer calculations, including the predicted post-clock-out deficit. |
| **18.7** | Unified exact office-time calculations across Office Target and Buffer & Outlook, fixed formatter initialization, and added mandatory 30-minute break handling to Today/leave-at time. |
| **18.6** | Buffer & Outlook now show exact days/hours/minutes, keep values on one line without resizing chips, and hide zero-value units such as 0d, 0h, and 0m. |
| **18.5** | Fixed buffer calculation to take only surplus/discrepancy into account. |
| **18.4** | Fixed percentage discrepancy across categories. |
| **18.3** | Fixed Buffer & Outlook to include today’s positive or negative variance in the current banked balance while preserving the pre-today buffer for the “Include buffer” option. |
| **18.2** | Unified and refined button styling, plus fixed Back to Analyzer scrolling to prevent persistent page shifting. |
| **18.1** | Improved office-time accuracy and remaining-time labels. |
| **18.0** | Fixed half-day vacation (AM/PM) handling across daily targets, buffer, Today leave time, remaining hours, and office planner calculations. |
| **17.9** | Corrected buffer calculation. |
| **17.8** | Buttons now use blue styling in the light theme and orange styling in the dark theme. |
| **17.7** | Replaced Office Streak and Worked with Office Days Needed and WFH Days Available in the Buffer & Outlook section. |
| **17.6** | Fixed buffer time accumulation on last day; Fixed Office Planner day date display. |
| **17.5** | Fixed Dark Reader hover styling for Back to analyzer and added TODAY leave-at time after remaining hours. |
| **17.4** | Commute Forecaster removed and transformed it to Office Planner instead. |
| **17.3** | Added smooth scrolling between today and analyzer |
| **17.2** | Cleaned up code, replaced SO FAR with OFFICE STREAK; fixed back to analyzer button bg when in dark mode; fixed anchor points for analyzer/today |
| **17.1** | Fixed infinite loading on empty/new months; added manual address text input for home location alongside GPS detection |
| **17.0** | Completed implementation of commute forecaster with real traffic data based on location; included all Company offices |
| **16.0** | Implemented commute forecaster for Timisoara UBC1 Office; fixed mouse hover issues with the span elements |
| **15.9** | Replaced all <button> elements with <span role="button"> + data-action delegation to fix page refresh caused by form submit; removed stopPropagation; unified scroll offset to −165px above target |
| **15.8** | Redesigned Today row as a full-width horizontal strip below the card grid; added "Jump to today" button in strip and header; added "Back to analyzer" chip injected directly above today's entry in the eDays DOM |
| **15.7** | Added Today's Progress strip with live hours worked vs 8h target, progress bar, and "Include buffer" toggle persisted to localStorage |
| **15.6** | Moved dark/white theme to localStorage |
| **15.5** | Added % to Total Logged in Activity Breakdown |
| **15.4** | Half-day vacations (AM/PM) excluded from absence filter |
| **15.3** | Worked days now counted from DOM, not hour division |
| **15.2** | Weekends excluded from Workable days count |
| **15.1** | Days Left = remaining hours ÷ 8; So Far = Workable − Days Left |
| **15.0** | Added `@updateURL` / `@downloadURL` for auto-updates; MutationObserver replaces fixed poll; So Far counts actual elapsed workdays |
| **14.0** | Initial public release |

<br/>

---

<div align="center">

Made for people who just want to know if they've been in the office enough this month.

</div>