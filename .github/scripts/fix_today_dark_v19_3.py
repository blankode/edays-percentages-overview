from pathlib import Path

p = Path('script.js')
s = p.read_text(encoding='utf-8')

if '// @version      19.3' not in s:
    raise RuntimeError('Expected version 19.3')

old = """    const DARK_READER_FIXES = Object.freeze({
        invert: [],
        css: '',
        ignoreInlineStyle: [],
"""

new = r"""    const DARK_READER_FIXES = Object.freeze({
        invert: [],
        css: `
            /* Preserve eDays Analyzer Pro's Today identity inside Dark Reader. */
            .tt_day_container:has(.today_chip){
                position:relative!important;
                z-index:2!important;
                background:linear-gradient(100deg,#172235 0%,#201d35 55%,#171c27 100%)!important;
                border-radius:7px!important;
                outline:1px solid rgba(96,165,250,.62)!important;
                box-shadow:inset 4px 0 0 #3b82f6,0 5px 16px rgba(0,0,0,.28)!important;
            }
            .timesheet_day_header.timesheet_today{
                background:linear-gradient(90deg,#1c2d48 0%,#282545 58%,#1d2532 100%)!important;
                border-color:rgba(96,165,250,.42)!important;
                padding-left:10px!important;
                box-sizing:border-box!important;
            }
            .timesheet_day_header.timesheet_today .timesheet_day_text{
                color:#eaf2ff!important;
                font-weight:750!important;
            }
            .timesheet_day_header.timesheet_today + .tt_day_inner_container{
                background:linear-gradient(100deg,#172438 0%,#211f36 58%,#181e29 100%)!important;
                border-color:rgba(96,165,250,.28)!important;
                padding-left:10px!important;
                padding-right:5px!important;
                box-sizing:border-box!important;
            }
            .timesheet_day_header.timesheet_today + .tt_day_inner_container .tt_break_container,
            .timesheet_day_header.timesheet_today + .tt_day_inner_container .tt_total_container{
                background:rgba(23,34,53,.55)!important;
                border-color:rgba(96,165,250,.16)!important;
            }
            .timesheet_day_header.timesheet_today .today_chip{
                background:#2563eb!important;
                color:#f8fbff!important;
                border-color:rgba(147,197,253,.55)!important;
                box-shadow:0 2px 7px rgba(37,99,235,.38)!important;
            }
            .timesheet_day_header.timesheet_today .today_chip::before{
                background:#bfdbfe!important;
                box-shadow:0 0 0 2px rgba(191,219,254,.16)!important;
            }
            @supports not selector(:has(*)){
                .timesheet_day_header.timesheet_today,
                .timesheet_day_header.timesheet_today + .tt_day_inner_container{
                    box-shadow:inset 4px 0 0 #3b82f6!important;
                }
            }
        `,
        ignoreInlineStyle: [],
"""

if old not in s:
    if 'Preserve eDays Analyzer Pro\'s Today identity inside Dark Reader.' in s:
        raise SystemExit(0)
    raise RuntimeError('Dark Reader fixes block not found')

s = s.replace(old, new, 1)

if "css: ''," in s[s.find('const DARK_READER_FIXES'):s.find('const DARK_READER_FIXES') + 8000]:
    raise RuntimeError('Dark Reader fixes CSS replacement failed')
if 'background:linear-gradient(100deg,#172235' not in s:
    raise RuntimeError('Today dark gradient missing')
if '// @version      19.3' not in s:
    raise RuntimeError('Version changed unexpectedly')

p.write_text(s, encoding='utf-8')
