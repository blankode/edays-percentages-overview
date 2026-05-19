# eDays Analyzer PRO

A lightweight and clean userscript for the e-days platform that provides advanced monthly timesheet statistics, activity breakdowns, office target tracking, and buffer calculations directly inside the existing UI.

Designed for people who want better visibility into their worked time without manually calculating percentages, office attendance, or remaining targets.

<img width="800" height="350" alt="image" src="https://github.com/user-attachments/assets/9325b422-957c-4547-a062-2bcdf18d259a" />

---

## Features

- 📊 Real-time activity statistics
- 🏢 Office attendance target tracking (60%)
- ⏱ Buffer / overtime calculation
- 📅 Worked days counter
- 🎨 Modern visual UI with progress bars and gradients
- 🔄 Auto-refresh every 3 seconds
- 📈 Segmented activity distribution overview
- 💻 Supports:
  - Office
  - Mobile Working
  - Business Travel
  - No Activity

---

## What It Calculates

### Activity Distribution

Shows how much time was spent in each activity category relative to the actual rota time.

Example:
- Office → 65%
- Mobile Working → 25%
- Business Travel → 10%

---

### Office Target (60%)

Tracks progress toward a required office attendance target.

Displays:
- Current office percentage
- Target completion progress bar
- Remaining time required
- Estimated remaining days/hours

---

### Buffer Calculation

Calculates the difference between:
- Expected worked hours
- Actual adjusted worked hours

Useful for quickly checking:
- Overtime
- Missing hours
- Monthly balance

---

### Worked Days Counter

Counts actual worked days automatically based on registered time periods.

---

## Installation

### 1. Install Tampermonkey

Download:
- Chrome: https://www.tampermonkey.net/
- Firefox: https://www.tampermonkey.net/

---

### 2. Create a New Script

Open Tampermonkey and create a new userscript.

---

### 3. Paste the Script

Replace the default content with the provided script.

---

### 4. Save

Save the script and refresh your e-days page.

The statistics panel will automatically appear above the timesheet.

---

## Compatibility

Tested on:
- e-days web platform
- Chromium-based browsers
- Firefox

---

## Auto Refresh

The dashboard automatically refreshes every 3 seconds to keep statistics updated while editing timesheets.

---

## UI Overview

The script injects a custom statistics panel containing:

| Section | Description |
|---|---|
| Activities | Time split per activity |
| Total Activities | Combined activity coverage |
| Office Target | 60% office attendance tracker |
| Total / Buffer | Recorded time and overtime buffer |
| Worked Days | Number of active worked days |

---

## Technologies Used

- Vanilla JavaScript
- DOM Parsing
- Dynamic HTML Rendering
- CSS Gradients
- Tampermonkey Userscript API

---

## Notes

- The script does not modify any e-days data.
- Everything is calculated client-side inside the browser.
- No external requests or APIs are used.
- Safe for personal productivity tracking.

---

## Future Improvements

Possible future additions:
- Dark mode
- Export statistics
- Weekly statistics
- Custom office target percentage
- More activity types
- Better mobile responsiveness

---

## License

MIT License

Feel free to modify and improve the script for personal use.
