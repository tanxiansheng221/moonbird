# -*- coding: utf-8 -*-
from playwright.sync_api import sync_playwright

errs = []
with sync_playwright() as p:
    b = p.chromium.launch()
    pg = b.new_page(viewport={'width': 1300, 'height': 760})
    pg.on('pageerror', lambda e: errs.append('PAGEERROR ' + str(e)))
    pg.on('console', lambda m: errs.append(m.type + ': ' + m.text) if m.type == 'error' else None)
    pg.goto('http://localhost:5199/', wait_until='load')
    pg.wait_for_timeout(3500)
    pg.screenshot(path='shot.png')
    b.close()

open('errs2.txt', 'w', encoding='utf-8').write('\n'.join(errs) if errs else 'CLEAN')
print('DONE', len(errs))
