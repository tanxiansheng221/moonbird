from playwright.sync_api import sync_playwright
with sync_playwright() as p:
    b = p.chromium.launch()
    pg = b.new_page(viewport={"width": 900, "height": 700})
    pg.goto("http://127.0.0.1:8123/game/index.html", timeout=30000)
    pg.wait_for_timeout(6000)
    pg.screenshot(path="page.png")
    print("saved")
    b.close()
