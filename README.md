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

[![Version](https://img.shields.io/badge/version-15.5-6366f1?style=flat-square&labelColor=0f0f0f)](https://github.com/blankode/edays-percentages-overview)
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

The dashboard auto-detects light or dark mode based on the eDays page background. You can also manually toggle between themes using the **sun/moon button** in the top-right corner of the dashboard. The preference resets on page reload.

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
| **17.0** | Completed implementation of commute forecaster with real traffic data based on location; included all Company offices;
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
