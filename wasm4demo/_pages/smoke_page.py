import sys
from playwright.sync_api import sync_playwright

errors = []
with sync_playwright() as p:
    b = p.chromium.launch()
    pg = b.new_page()
    pg.on("pageerror", lambda e: errors.append(f"pageerror: {e}"))
    pg.on("console", lambda m: errors.append(f"console.{m.type}: {m.text}") if m.type == "error" else None)
    pg.goto("http://127.0.0.1:8123/game/index.html", timeout=30000)
    pg.wait_for_timeout(6000)
    # wasm4-app element should exist and be upgraded
    ok = pg.evaluate("""() => {
        const app = document.querySelector('wasm4-app');
        return app ? (app.shadowRoot ? 'upgraded' : 'exists-no-shadow') : 'missing';
    }""")
    has_canvas = pg.evaluate("() => !!document.querySelector('canvas')")
    print("APP:", ok, "| CANVAS:", has_canvas)
    if ok == "upgraded":
        pg.wait_for_timeout(3000)
    b.close()

print("ERRORS:", errors if errors else "none")
sys.exit(1 if errors or "upgraded" not in str(ok) else 0)
