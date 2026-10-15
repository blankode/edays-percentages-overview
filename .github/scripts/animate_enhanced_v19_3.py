from pathlib import Path

p = Path('script.js')
s = p.read_text(encoding='utf-8')

if '// @version      19.3' not in s:
    raise RuntimeError('Expected version 19.3')

old = """        #timesheetMonthHeader h2 .ep-enhanced-text{\n            margin-left:6px;\n            font-weight:800;\n            background:linear-gradient(135deg,#3b82f6,#a855f7);\n            -webkit-background-clip:text;\n            background-clip:text;\n            color:transparent!important;\n            -webkit-text-fill-color:transparent;\n        }\n"""
new = """        #timesheetMonthHeader h2 .ep-enhanced-text{\n            margin-left:6px;\n            font-weight:800;\n            background:linear-gradient(90deg,#3b82f6 0%,#a855f7 35%,#22d3ee 65%,#3b82f6 100%);\n            background-size:260% 100%;\n            background-position:0% 50%;\n            -webkit-background-clip:text;\n            background-clip:text;\n            color:transparent!important;\n            -webkit-text-fill-color:transparent;\n            animation:ep-enhanced-gradient 4.8s ease-in-out infinite;\n            will-change:background-position;\n        }\n        @keyframes ep-enhanced-gradient{\n            0%{background-position:0% 50%;}\n            50%{background-position:100% 50%;}\n            100%{background-position:0% 50%;}\n        }\n        @media (prefers-reduced-motion: reduce){\n            #timesheetMonthHeader h2 .ep-enhanced-text{\n                animation:none!important;\n                background-position:50% 50%;\n            }\n        }\n"""

if 'animation:ep-enhanced-gradient' not in s:
    if old not in s:
        raise RuntimeError('Enhanced CSS block not found')
    s = s.replace(old, new, 1)

if '// @version      19.3' not in s:
    raise RuntimeError('Version changed unexpectedly')

p.write_text(s, encoding='utf-8')
