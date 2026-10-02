# -*- coding: utf-8 -*-
from playwright.sync_api import sync_playwright
errs = []
with sync_playwright() as p:
    b = p.chromium.launch()
    pg = b.new_page()
    pg.on('pageerror', lambda e: errs.append((getattr(e, 'stack', '') or str(e))))
    pg.on('console', lambda m: errs.append(m.type + ': ' + m.text) if m.type == 'error' else None)
    pg.goto('http://localhost:5199/', wait_until='networkidle')
    pg.wait_for_timeout(2500)
    open('errs.txt', 'w', encoding='utf-8').write('\n---\n'.join(errs) or 'none')
    b.close()
