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

[![Version](https://img.shields.io/badge/version-20.8-6366f1?style=flat-square&labelColor=0f0f0f)](https://github.com/blankode/edays-percentages-overview)
[![Platform](https://img.shields.io/badge/platform-Tampermonkey-f59e0b?style=flat-square&labelColor=0f0f0f)](https://www.tampermonkey.net/)
[![License](https://img.shields.io/badge/license-MIT-22c55e?style=flat-square&labelColor=0f0f0f)](LICENSE)
[![Site](https://img.shields.io/badge/works%20on-e--days.com-3b82f6?style=flat-square&labelColor=0f0f0f)](https://e-days.com)

<br/>

</div>

---

## ✦ What It Does

eDays has no built-in way to track your office attendance percentage, buffer time, or remaining workdays at a glance. This script adds a live, compact dashboard directly under the native Timesheet toolbar. The expanded view starts with **Today**, followed by an inline **Buffer & Outlook** KPI strip, three analytics cards and **Office Planner**. All metrics update automatically as you edit entries.

<br/>

## ◈ Dashboard Layout

The UI follows the approved light-mode mockup while preserving dark-mode support. **The existing eDays Timesheet title/icon, Settings and Minimize buttons are not duplicated inside the Analyzer.** Today is the first full-width live status row with a thin blue progress bar, normal finish/overtime details, break coverage and the Include buffer toggle. The next row is the horizontal **Buffer & Outlook** KPI strip: buffer, workable days, days left, office time needed, available WFH time and monthly progress. On narrower screens the strip wraps into balanced rows without clipping the values.

### Expanded view — three equally sized cards

### 1 · Activity Breakdown
Breaks down your logged time by activity type — Office, Mobile Working, Business Travel — as both hours and percentage of your real rota. Includes a progress bar per activity and a total logged line with completion percentage.

### 2 · Office Target
Tracks your office attendance against a configurable target (default **60%**). Displays a ring gauge showing how close you are, how many hours you've logged in-office, what the target is in hours, and how much more you need to hit it.

### 3 · Time vs Rota
Shows recorded hours against your real rota (gross rota minus absences and public holidays). Ring gauge, raw numbers, and a breakdown of absences, holidays, and days worked.

<br/>

## ⤢ Compact Dashboard

On the previous eDays layout, the native **Minimize** button remains next to **Analyzer Settings** in the Time Tracking header. On the new Vue 3 layout, **the full Analyzer panel sits immediately below the native Timesheet toolbar**, before the month selector and day entries. **To today / To home**, **Settings**, and **Minimize / Expand** are placed after **Submit month** in the native right-side Timesheet action row, without duplicate controls in the Analyzer itself. The Theme switch remains beside eDays' Book time off action; controls are restored after Vue re-renders. Click it to replace the expanded analytics cards and Office Planner with a low-profile four-metric view:

- **Today** — time worked against today's effective target, time remaining, optional leave-at estimate, and a compact **Include buffer** switch.
- **Office Target** — percentage of the configured office target achieved, logged office time, and time still needed.
- **Buffer** — current surplus or deficit relative to the scheduled daily target.
- **Month Progress** — recorded hours against real rota, completion percentage, and remaining hours.

**Today (Vue 3 and legacy):** aim for **8h net work**, plus the **mandatory 30-minute break** (configurable 0–480m) only if it has not already been covered. Before any break, a 09:00 clock-in projects 17:30. A 09:00–13:00 session followed by a **13:00–15:00 clock-out gap** covers the mandatory break; after clocking in at 15:00 the user has 4h to work, so the standard finish moves to **19:00**, not 19:30. Other gaps, even 4h, count toward break coverage without becoming worked hours. The current clock-out gap updates live. **Vue 3's read-only Breaks field often repeats the same clock-out gaps**; v20.7 deliberately ignores that read-only value as an additional break or work requirement. If a Breaks field is manually editable, only the part not already reflected in clock-out gaps is treated as time inside a work period. The expanded and compact Today displays show the break status. **Buffer uses net worked time versus net rota** and never deducts the mandatory break again. Include buffer may move the optional leave estimate, but the standard finish and overtime threshold remain based on 8h work and the actual outstanding break; overtime versus target is not necessarily payroll-approved overtime.

Click **Expand** to restore the complete dashboard. The setting is saved locally and persists after page refreshes. Compact mode uses the same underlying calculations, light/dark theme, spacing/alignment, and metric card borders as the expanded view, without an extra outer border.

<br/>

## ⬡ Installation

### Prerequisites
- [Tampermonkey](https://www.tampermonkey.net/) installed in your browser (Chrome, Firefox, Edge, Safari)

### Steps

**1. Open Tampermonkey**
Click the Tampermonkey icon in your browser toolbar → **Create a new script**

**2. Paste the main script**
Replace the default contents with [`script.js`](https://raw.githubusercontent.com/blankode/edays-percentages-overview/main/script.js). It automatically loads [`theme.js`](https://github.com/blankode/edays-percentages-overview/blob/main/theme.js) using Tampermonkey's `@require` directive; you do **not** need a second userscript or to paste `theme.js` manually. Ensure the required GitHub resource is permitted to load.

**3. Save**
`Ctrl + S` — the script is now active. On first installation, Tampermonkey must download its `@require` dependency.

**4. Navigate to eDays**
Go to your timesheet at `*.e-days.com` — on Vue 3 the dashboard will appear automatically below the Timesheet toolbar

<br/>

## ⧉ File Structure (introduced in v20.4)

The userscript remains split into two maintained source files. The modular structure was introduced in **20.4**; the current userscript version is **20.8**:

| File | Responsibility |
|---|---|
| [`script.js`](https://github.com/blankode/edays-percentages-overview/blob/main/script.js) | Analyzer logic: timesheet parsing, activity/office metrics, Today, buffer, planning, UI, navigation, and Analyzer-specific CSS. |
| [`theme.js`](https://github.com/blankode/edays-percentages-overview/blob/main/theme.js) | Vendored Dark Reader engine (MIT license preserved), early dark-mode anti-flash bootstrap, color palettes, site-wide styling, and Dark/Light toggle. |

`script.js` loads the theme first via the userscript metadata:

```javascript
// @require      https://raw.githubusercontent.com/blankode/edays-percentages-overview/main/theme.js?release=20.4-theme-split-1
```

The theme exposes a small `EPTheme` API so the Analyzer does not need to embed or maintain Dark Reader code. The modular split reduced the original main script from **13,447 to 3,349 lines** in v20.4; after the v20.8 dashboard restructuring, `script.js` contains approximately **3,600 lines**. The versioned query suffix also distinguishes this dependency URL from older cached resources; when changing `theme.js` again, update that suffix in `script.js` so Tampermonkey fetches the new dependency.

**Updating to 20.8:** Tampermonkey can detect the new main-script version normally. If automatic updating is delayed, open the latest [raw `script.js`](https://raw.githubusercontent.com/blankode/edays-percentages-overview/main/script.js) and reinstall it. Only `script.js` needs installation — `theme.js` is downloaded through `@require`.

**Note:** `@run-at document-start` is preserved, but loading an external `@require` may postpone first execution while the dependency downloads; the anti-flash bootstrap cannot be guaranteed on a cold first install.

<br/>

## ⚙ Configuration

Use **Settings** in the right-side Timesheet actions to configure the office attendance target (**60%** by default). The **Mandatory break** setting is available on both Vue 3 and legacy Timesheet (30 minutes by default, 0–480 minutes). It affects the remaining break allowance in Today projections, not the monthly net-work buffer. Settings are stored in browser LocalStorage.

<br/>

## ↻ Auto-Updates

The script includes auto-update headers pointing to the raw GitHub file:

```
// @updateURL  https://raw.githubusercontent.com/blankode/edays-percentages-overview/main/script.js
// @downloadURL  https://raw.githubusercontent.com/blankode/edays-percentages-overview/main/script.js
// @require      https://raw.githubusercontent.com/blankode/edays-percentages-overview/main/theme.js?release=20.4-theme-split-1
```

Tampermonkey detects version bumps such as **20.7 → 20.8** and can prompt you to update. The separately required `theme.js` remains cached under its unchanged `@require` URL. To control how often Tampermonkey checks:

> **Tampermonkey Settings → Updates → Script Update Interval** → set to `Every 12 hours`

<br/>

## ◐ Theme

The userscript now provides a persistent **Dark mode / Light mode** control beside the native eDays **Book time off** action. Dark mode uses the official **Dark Reader Dynamic Theme engine**, now bundled in the separate `theme.js` dependency, so the complete eDays site is themed dynamically across pages and newly rendered components rather than relying on a fixed list of selectors. Analyzer-specific styling, including the custom Today highlight and animated **Enhanced** branding, is preserved with dedicated Dark Reader fixes.

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

Legacy timesheet layout support is retained. Version 20.8 continues to recognize the new v3 day-card layout with stable IDs such as `timesheet-day-2026-10-26`, separate hour/minute inputs, activity selectors, daily totals and editable breaks. The v3 monthly summary is now parsed directly from eDays for **Time recorded, Absences, Public holidays, Rota, and signed Difference**. Only when the official totals are not rendered yet will Analyzer display provisional estimates derived from visible day cards. Browser-specific and complete live-site end-to-end behavior have not yet been re-tested.

<br/>

## ∿ Changelog

| Version | Changes |
|---|---|
| **20.8** | Rebuilt the expanded Analyzer to match the approved clean dashboard mockup. **Today** now sits at the top as the live header-level status card (worked/target, time remaining, leave estimate, standard finish/overtime, break coverage and Include buffer). **Buffer & Outlook** is a compact full-width horizontal KPI strip immediately below, showing buffer, workable, days left, office needed, WFH available and month progress. The analytics section now has **three equal-height cards**: Activity Breakdown, Office Target and Time vs Rota, followed by the Office Planner accordion. Reused theme-aware white/dark surfaces, rounded corners, subtle shadows, readable spacing and responsive wrap for smaller screens. Did not duplicate the existing native **Timesheet title/icon, Settings or Minimize** controls. Preserved monthly metrics, mandatory-break calculation, target celebration GIF, native toolbar, and existing compact Minimize behavior. `theme.js` unchanged. |
| **20.7** | Fixed Today incorrectly displaying **9h28 total** when a **1h28 clock-out gap** was already covering the required 30-minute break. Root cause: v20.6 interpreted Vue 3's read-only **Breaks** field as an extra 1h28 of working time. v20.7 distinguishes read-only gap summaries from manually editable breaks, counts real gaps once, and limits the additional time allowance to the **uncovered mandatory break only** (30m by default). After the break, the target is **8h net work**, never 8h plus the full gap. Example from 9 November: **4h01 / 8h**, **3h59 remaining**, rather than 4h01 / 9h28 and 5h27 remaining. Expanded and compact Today, standard finish time, overtime threshold and optional Include buffer all use the same calculation; Buffer & Outlook continues using net time from eDays. Theme and navigation unchanged. |
| **20.6** | Corrected mandatory break calculations for both Vue 3 and legacy timesheets: full-day projections require **8h net work plus 30m mandatory break until covered**, and all actual clock-out gaps (including an ongoing pause) are counted toward that requirement without double-deducting them. After a 09:00–13:00 session and 13:00–15:00 gap, resuming at 15:00 correctly projects a 19:00 finish (4h remaining). Entered Breaks are respected, pause coverage appears in expanded and compact Today, and the normal overtime threshold remains independent of Include buffer. The monthly buffer remains based on eDays net totals only. **To home** also switches on as soon as manual scrolling passes the Analyzer header, rather than only after reaching Today. Existing theme dependency unchanged. |
| **20.5** | Fixed stale **To today / To home** state after manual scrolling in the redesigned Timesheet. Vue 3 now determines the button label and click destination from the actual scroll position instead of keeping a permanent click-forced target; the visible Today day-card and month-end clamped scrolling are handled correctly. Detects the actual vertically scrollable container, watches both window scrolling and nested scroll events, avoids comparing offsets from different scroll roots, and retains the old Timesheet's click override only for legacy navigation. Users no longer need to click twice to switch between Today and Home. `theme.js` remains unchanged. |
| **20.4** | Moved the full Analyzer below the rendered Vue 3 **Timesheet** title/action bar, before monthly navigation. Repaired header detection for the hydrated Vue DOM (where `<v3-timesheet>` no longer exists), and injected a single set of native-styled **To today / To home**, **Settings**, and **Minimize / Expand** controls immediately after **Submit month**. Changed the new Timesheet daily target to **8h of recorded work**, with no automatically added 30-minute mandatory break, across expanded/mini Today, leave-at time, buffer, and overtime. Legacy break settings remain available; Vue 3 labels them as inapplicable. Also recognized new Vue 3 Vacation tags in the planner/day capacity calculations. **Native UI polish:** To today / To home, Settings, and Minimize / Expand now clone eDays' Save month ECL3 button structure, including `secondary icon-left`, Vue-scoped attributes, and 20 px SVG icons; the original animated **Enhanced** gradient now appears beside the Vue 3 **Timesheet** title, without duplicate badges on rerender. **Typography fix:** Enhanced dynamically inherits the exact native Timesheet title CSS-module class, so both words use the same font size even after eDays changes its hashed classes. **Code organization addition:** extracted the vendored Dark Reader engine, anti-flash bootstrap, dark/light palette and site toggle, and theme-only CSS to `theme.js`, required from `script.js` using `@require`. Analyzer logic now stays in a much smaller main file (13,447 → 3,349 lines), with version **20.4** unchanged. Existing 20.4 users must manually replace the script to get same-version changes. |
| **20.3** | Removed the disconnected v3 toolbar and consolidated To today, Settings and Minimize/Expand into one native-style, responsive Analyzer header. Kept the site-wide Theme control next to Book time off instead of duplicating it. Prevented duplicate controls and mounted the dashboard outside Vue-owned day cards; stabilized live refresh across month switches and input edits. **Refactor:** read the official Vue 3 monthly summary (Time recorded, Absences, Public holidays, Rota, signed Difference), retaining estimates only during summary loading. **Navigation fix:** place a single To today / To home eDays-style button directly after Submit month in the Timesheet, and keep Settings / Minimize in Analyzer. |
| **20.2** | Added compatibility for the redesigned eDays v3 timesheet day cards (stable day IDs, HH:MM start/end inputs, daily totals, break field, activity selection and Today detection). Restored dashboard mounting, toolbar, navigation, and activity/office calculations when the old HTML structure is absent. Preserved legacy compatibility. New monthly figures are **explicitly flagged as provisional** if no official month summary is available. Updated README/version history. |
| **20.1** | Fixed Buffer & Outlook showing a false deficit (for example −1h 44m while monthly Difference was zero). Banked time now compares net hours against the net daily rota and does not deduct breaks twice. |
| **20.0** | Increased Office Planner typography and contrast, especially calendar hour values and weekly schedule hours, with responsive behavior on smaller screens. |
| **19.10** | Added separate standard finish time and live overtime-versus-target indicators, while preserving the independent Include buffer early finish. |
| **19.9** | Extended configurable mandatory break from 0–30 to 0–480 minutes throughout input validation, LocalStorage and Today gross target logic. |
| **19.8** | Latest release includes the Office Target Met GIF background and the 30-minute break cap. Additional 19.8 fixes: Today now counts **gross elapsed time starting from zero** against **8h30 by default** (8h work + configured mandatory break), with the same logic in the full and mini views and Buffer. Mandatory-break settings are validated at **0–30 minutes** and update the gross target. Today/Home navigation changes immediately on clicking even when month-end scrolling is clamped, and Buffer & Outlook card content is centered without disturbing the celebration image. |
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