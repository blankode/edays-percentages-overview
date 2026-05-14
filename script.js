// ==UserScript==
// @name         eDays Analyzer Clean
// @namespace    http://tampermonkey.net/
// @version      11.4
// @match        https://*.e-days.com/*
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

    const timeToMinutes = t => {
        if (!t) return 0;
        const [h, m] = t.split(':').map(Number);
        return h * 60 + m;
    };

    const minutesToHHMM = mins => {
        const sign = mins < 0 ? '-' : '';
        const abs = Math.abs(mins);
        const hours = Math.floor(abs / 60);
        const minutes = abs % 60;
        return minutes === 0 ? `${sign}${hours}h` : `${sign}${hours}h ${String(minutes).padStart(2,'0')}m`;
    };

    const parseTime = value => {
        const match = value.match(/(-?\d+):(\d{2})/);
        if (!match) return 0;
        const mins = Math.abs(parseInt(match[1])) * 60 + parseInt(match[2]);
        return parseInt(match[1]) < 0 ? -mins : mins;
    };

    const getSummaryData = () => {
        const data = { recorded: 0, rota: 0, absences: 0, holidays: 0, difference: 0 };
        document.querySelectorAll('.desktop_summary .summary_block').forEach(block => {
            const spans = block.querySelectorAll('span');
            if (spans.length < 2) return;
            const minutes = parseTime(spans[0].innerText.trim());
            const label = spans[1].innerText.trim();
            if (label.includes("Time recorded")) data.recorded = minutes;
            if (label.includes("Rota")) data.rota = Math.abs(minutes);
            if (label.includes("Absences")) data.absences = Math.abs(minutes);
            if (label.includes("Public holidays")) data.holidays = Math.abs(minutes);
            if (label.includes("Difference")) data.difference = minutes;
        });
        return data;
    };

    const calculateRawAndWorkedDays = () => {
        const activityMap = {
            "No Activity": 0,
            "Office": 0,
            "Mobile Working": 0,
            "Business Travel": 0
        };

        let rawTotal = 0;
        let workedDays = 0;

        document.querySelectorAll('.tt_day_container').forEach(day => {
            let dayWorked = false;

            day.querySelectorAll('.tt_period_container').forEach(period => {
                const [startInput, endInput] = period.querySelectorAll('input[type="time"]');
                if (!startInput || !endInput) return;

                const duration = timeToMinutes(endInput.value) - timeToMinutes(startInput.value);
                if (duration <= 0) return;

                dayWorked = true;

                const activity = period.querySelector('.chosen-single span')?.innerText.trim() || "No Activity";
                activityMap[activity] += duration;
                rawTotal += duration;
            });

            if (dayWorked) workedDays++;
        });

        return { activityMap, rawTotal, workedDays };
    };

    const renderUI = () => {
        const mainPanel = document.getElementById('mainTimesheetPanel');
        if (!mainPanel) return;

        let container = document.getElementById('timeRecordingTemplateMonthlyExtra');
        if (!container) {
            container = document.createElement('div');
            container.id = 'timeRecordingTemplateMonthlyExtra';
            mainPanel.insertBefore(container, mainPanel.firstChild);
        }

        const summary = getSummaryData();
        const realRota = summary.rota - summary.absences - summary.holidays;
        const { activityMap, rawTotal, workedDays } = calculateRawAndWorkedDays();

        if (!summary.recorded || !rawTotal || !realRota) {
            container.innerHTML = "⏳ Loading...";
            return;
        }

        const factor = summary.recorded / rawTotal;

        const icons = {
            "Office": "apartment",
            "Mobile Working": "laptop",
            "Business Travel": "flight_takeoff",
            "No Activity": "block"
        };

        // solid colors for icons
        const colors = {
            "Office": "#1776CF",              // blue
            "Mobile Working": "#ff00cc",
            "Business Travel": "#7b1fa2",
            "No Activity": "#000000"
        };

        // gradients for bars
        const gradients = {
            "Office": "linear-gradient(90deg,#4facfe,#00f2fe)",
            "Mobile Working": "linear-gradient(90deg,#ff00cc,#ff66cc)",
            "Business Travel": "linear-gradient(90deg,#7b1fa2,#ba68c8)",
            "No Activity": "linear-gradient(90deg,#000000,#434343)"
        };

        let officeMinutes = 0;
        let totalActivityMinutes = 0;

        const sortedActivities = Object.entries(activityMap)
            .map(([activity, minutes]) => {
                const adjusted = Math.floor(minutes * factor);
                return { activity, minutes, adjusted };
            })
            .filter(a => a.adjusted > 0)
            .sort((a, b) => b.adjusted - a.adjusted);

        let columnWidth = 216;

        container.className = 'timesheet_week_summary';
        container.style.cssText = '';

        let html = `<div class="week_summary_header">
            <div class="header_title"><span style="color:#4D4D4D;">Statistics</span></div>
        </div>`;

        html += `<div class="timesheet_week_summary_list_monthly" style="
            display:flex;
            gap:16px;
            padding:12px;
            flex-wrap:nowrap;
            overflow-x:auto;
            justify-content:center;
        ">`;

        // Activities column
        html += `<div style="display:flex; flex-direction:column; flex-shrink:0; min-width:200px;">`;
        html += `<div data-activity-row style="display:flex; gap:8px; justify-content:center;">`;

        sortedActivities.forEach(({ activity, adjusted }) => {
            totalActivityMinutes += adjusted;
            if (activity === "Office") officeMinutes = adjusted;

            const percent = realRota ? (adjusted / realRota) * 100 : 0;

            html += `<div data-activity-card style="width:100px;text-align:center;">
                <i class="material-icons md-24" style="
                    color:#fff;
                    background:${colors[activity]};
                    border-radius:6px;
                    padding:4px;
                    width:24px;
                    height:24px;
                    display:block;
                    margin:0 auto;
                ">${icons[activity]}</i>
                <div style="font-weight:600;margin-top:4px;color:#4D4D4D;">${activity}</div>
                <div style="height:6px;background:#e0e0e0;border-radius:5px;margin:2px 0;">
                    <div style="width:${Math.min(percent,100)}%;height:100%;background:${gradients[activity]};border-radius:5px;"></div>
                </div>
                <div style="font-size:11px;opacity:0.8;color:#4D4D4D;">
                    ${percent.toFixed(2)}% (${minutesToHHMM(adjusted)} / ${minutesToHHMM(realRota)})
                </div>
            </div>`;
        });

        html += `</div>`;

        // Total activities segmented bar
        const totalPercent = realRota ? (totalActivityMinutes / realRota) * 100 : 0;
        let segmentsHTML = '';
        sortedActivities.forEach(({ activity, adjusted }) => {
            const percent = realRota ? (adjusted / realRota) * 100 : 0;
            segmentsHTML += `<div style="width:${percent}%;height:100%;background:${gradients[activity]};"></div>`;
        });

        html += `<div style="margin-top:6px;">
            <div style="height:6px;background:#e0e0e0;border-radius:5px;overflow:hidden;display:flex;">
                ${segmentsHTML}
            </div>
            <div style="font-size:11px;opacity:0.8;margin-top:2px;text-align:center;color:#4D4D4D;">
                Total Activities: ${minutesToHHMM(totalActivityMinutes)} / ${minutesToHHMM(realRota)} (${totalPercent.toFixed(2)}%)
            </div>
        </div>`;

        html += `</div>`;

        // Office Target block with dynamic gradient
        const targetMinutes = realRota * 0.6;
        const officePercent = realRota ? (officeMinutes / targetMinutes) * 100 : 0;
        const actualPercent = realRota ? (officeMinutes / realRota) * 100 : 0;

        const remainingMinutes = Math.max(0, targetMinutes - officeMinutes);
        const totalRemainingHours = remainingMinutes / 60;
        const fullDays = Math.floor(totalRemainingHours / 8);
        const leftoverHoursDecimal = totalRemainingHours % 8;
        const leftoverHours = Math.floor(leftoverHoursDecimal);
        const leftoverMinutes = Math.round((leftoverHoursDecimal - leftoverHours) * 60);

        const officeColorBar = officePercent >= 100
            ? 'linear-gradient(90deg,#00c853,#69f0ae)' // green gradient
            : 'linear-gradient(90deg,#ff3d00,#ff6e40)'; // red-orange gradient

        const officeIconColor = '#1776CF'; // solid blue icon

        html += `<div data-fixed-column style="
            width:${columnWidth}px;
            min-width:${columnWidth}px;
            max-width:${columnWidth}px;
            text-align:center;
            flex-shrink:0;
        ">
            <i class="material-icons md-24" style="color:#fff;background:${officeIconColor};border-radius:6px;padding:4px;width:24px;height:24px;display:block;margin:0 auto;">apartment</i>
            <div style="font-weight:600;margin-top:4px;color:#4D4D4D;">Office Target (60%)</div>
            <div style="height:8px;background:#e0e0e0;border-radius:5px;margin:4px 0;">
                <div style="width:${Math.min(officePercent,100)}%;height:100%;background:${officeColorBar};border-radius:5px;"></div>
            </div>
            <div style="font-size:11px;opacity:0.8;color:#4D4D4D;">
                ${actualPercent.toFixed(2)}% (${minutesToHHMM(officeMinutes)} / ${minutesToHHMM(targetMinutes)})
            </div>
            <div style="font-size:11px;opacity:0.8;color:#4D4D4D;">
                ⏳ ${fullDays}d ${leftoverHours}h ${leftoverMinutes ? leftoverMinutes+'m':''} remaining
            </div>
        </div>`;

        let adjustedTotalMinutes = 0;

        const dayContainers = document.querySelectorAll('.tt_day_container');

        dayContainers.forEach(day => {
            let dayMinutes = 0;

            // detect TODAY via class (this is the key fix)
            const isToday = day.querySelector('.timesheet_today, .today_chip');

            // calculate real worked minutes
            day.querySelectorAll('.tt_period_container').forEach(period => {
                const [startInput, endInput] = period.querySelectorAll('input[type="time"]');
                if (!startInput || !endInput) return;

                const duration = timeToMinutes(endInput.value) - timeToMinutes(startInput.value);
                if (duration > 0) dayMinutes += duration;
            });

            if (isToday) {
                // ALWAYS force 8h for today (until next day exists)
                adjustedTotalMinutes += 8 * 60;
            } else {
                // past days
                adjustedTotalMinutes += dayMinutes > 0 ? dayMinutes : (8 * 60);
            }
        });

        // expected quota
        const totalDays = dayContainers.length;
        const expectedMinutes = totalDays * 8 * 60;

        // final buffer
        const bufferMinutes = adjustedTotalMinutes - expectedMinutes;

        const bufferColor = bufferMinutes === 0 ? '#838383' : (bufferMinutes < 0 ? 'red' : 'green');

        html += `<div data-fixed-column style="
            width:${columnWidth}px;
            min-width:${columnWidth}px;
            max-width:${columnWidth}px;
            text-align:center;
            flex-shrink:0;
        ">
            <i class="material-icons md-24" style="color:#fff;background:#1776CF;border-radius:6px;padding:4px;width:24px;height:24px;display:block;margin:0 auto;">av_timer</i>
            <div style="font-weight:600;margin-top:4px;color:#4D4D4D;">Total / Buffer</div>
            <div style="font-size:11px;opacity:0.8;color:#4D4D4D;">
                ⏱ ${minutesToHHMM(summary.recorded)} /
                <span style="font-weight:700;color:${bufferColor}">${minutesToHHMM(bufferMinutes)}</span>
            </div>
            <div style="font-size:11px;opacity:0.8;color:#4D4D4D;">
                📅 Worked: ${workedDays} days
            </div>
        </div>`;

        html += `</div>`;

        container.innerHTML = html;
    };

    const waitForUI = () => {
        const interval = setInterval(() => {
            if (document.querySelector('.tt_day_container') && document.querySelector('.desktop_summary')) {
                clearInterval(interval);
                renderUI();
                setInterval(renderUI, 3000);
            }
        }, 1000);
    };

    waitForUI();
})();