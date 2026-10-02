from playwright.sync_api import sync_playwright
with sync_playwright() as p:
    b = p.chromium.launch()
    pg = b.new_page()
    errs = []
    pg.on("pageerror", lambda e: errs.append(str(e)))
    pg.goto("http://127.0.0.1:8123/game/index.html", timeout=30000)
    pg.wait_for_timeout(8000)
    info = pg.evaluate("""()=>{const a=document.querySelector('wasm4-app').shadowRoot;return {canvas:!!a.querySelector('canvas'),len:a.innerHTML.length}}""")
    print("SHADOW:", info)
    print("RES:", pg.evaluate("""()=>performance.getEntriesByType('resource').map(r=>r.name.split('/').pop()+':'+r.transferSize)"""))
    print("PAGEERR:", errs)
    b.close()
