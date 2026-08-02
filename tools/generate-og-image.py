"""Generates the 1200x630 social preview card shared alongside the site links.

Renders an HTML card with Chromium (via Playwright) into client/og-image.png.
Run it from the repo root: python3 tools/generate-og-image.py client
"""
import base64
import glob
import os
import pathlib
import sys

from playwright.sync_api import sync_playwright

WIDTH, HEIGHT = 1200, 630


def data_uri(path, mime):
    return f"data:{mime};base64," + base64.b64encode(path.read_bytes()).decode()


def build_html(client_dir):
    garamond = data_uri(client_dir / "fonts" / "EBGaramond-Regular.ttf", "font/ttf")
    garamond_bold = data_uri(client_dir / "fonts" / "EBGaramond-Bold.ttf", "font/ttf")
    hind = data_uri(client_dir / "fonts" / "Hind-Light.ttf", "font/ttf")
    logo = data_uri(client_dir / "logo.svg", "image/svg+xml")
    artifacts = [
        data_uri(client_dir / "artifacts" / f"{name}.svg", "image/svg+xml")
        for name in ("atmosfere", "tomato-timer", "blindtales-app", "react-webpack-seed")
    ]
    artifact_tags = "\n".join(f'<img class="artifact" src="{a}" />' for a in artifacts)

    return f"""<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <style>
      @font-face {{ font-family: 'Garamond'; src: url('{garamond}'); font-weight: normal; }}
      @font-face {{ font-family: 'Garamond'; src: url('{garamond_bold}'); font-weight: bold; }}
      @font-face {{ font-family: 'Hind'; src: url('{hind}'); }}

      * {{ box-sizing: border-box; margin: 0; padding: 0; }}

      body {{
        width: {WIDTH}px;
        height: {HEIGHT}px;
        background-color: #f3ece3;
        color: rgb(53, 53, 52);
        font-family: 'Hind', sans-serif;
        overflow: hidden;
        position: relative;
      }}

      .constellation {{
        position: absolute;
        inset: 0;
      }}

      .card {{
        position: relative;
        height: 100%;
        display: grid;
        grid-template-columns: 1fr 420px;
        align-items: center;
        padding: 0 80px;
        gap: 20px;
      }}

      .eyebrow {{
        font-size: 24px;
        letter-spacing: 0.32em;
        text-transform: uppercase;
        color: #8a7f74;
      }}

      .eyebrow .dot {{
        display: inline-block;
        width: 10px;
        height: 10px;
        border-radius: 50%;
        background: #f71735;
        vertical-align: middle;
        margin-right: 16px;
        margin-bottom: 4px;
      }}

      h1 {{
        font-family: 'Garamond', serif;
        font-weight: bold;
        font-size: 92px;
        line-height: 1.05;
        margin: 26px 0 22px;
      }}

      .rule {{
        width: 320px;
        height: 2px;
        border: none;
        background: linear-gradient(to right, #f71735, rgba(247, 23, 53, 0));
      }}

      p {{
        font-size: 30px;
        line-height: 1.45;
        color: #4a453f;
        max-width: 560px;
        margin-top: 26px;
      }}

      .footer {{
        margin-top: 40px;
        display: flex;
        align-items: center;
        gap: 26px;
      }}

      .domain {{
        font-size: 24px;
        letter-spacing: 0.06em;
        color: #8a7f74;
      }}

      .artifacts {{
        display: flex;
        align-items: center;
        gap: 6px;
        opacity: 0.75;
      }}

      .artifact {{ width: 62px; height: 54px; }}

      .logo {{
        width: 420px;
        justify-self: center;
      }}
    </style>
  </head>
  <body>
    <svg class="constellation" viewBox="0 0 {WIDTH} {HEIGHT}">
      <g fill="none" stroke="#e2dbd1" stroke-width="1.4">
        <circle cx="1020" cy="315" r="290" />
        <circle cx="1020" cy="315" r="200" />
        <path d="M1020 25 V605" />
        <path d="M769 170 L1271 460" />
        <path d="M769 460 L1271 170" />
      </g>
    </svg>
    <div class="card">
      <div>
        <div class="eyebrow"><span class="dot"></span>Garden</div>
        <h1>Filippo&nbsp;Italiano</h1>
        <hr class="rule" />
        <p>Il microblog dove coltivo i miei esperimenti: appunti di codice, piccoli
        strumenti e cose imparate strada facendo.</p>
        <div class="footer">
          <span class="domain">garden.filippoitaliano.com</span>
          <span class="artifacts">
            {artifact_tags}
          </span>
        </div>
      </div>
      <img class="logo" src="{logo}" />
    </div>
  </body>
</html>
"""


def find_chromium():
    """Playwright's bundled build if present, otherwise let it pick its default."""
    explicit = os.environ.get("CHROMIUM_PATH")
    if explicit:
        return explicit
    for pattern in ("chromium-*/chrome-linux/chrome", "chromium-*/chrome-mac/Chromium.app/Contents/MacOS/Chromium"):
        found = sorted(glob.glob(os.path.join(os.environ.get("PLAYWRIGHT_BROWSERS_PATH", ""), pattern)))
        if found:
            return found[-1]
    return None


def main():
    client_dir = pathlib.Path(sys.argv[1] if len(sys.argv) > 1 else "client")
    html = build_html(client_dir)
    out = client_dir / "og-image.png"

    with sync_playwright() as p:
        browser = p.chromium.launch(executable_path=find_chromium())
        page = browser.new_page(viewport={"width": WIDTH, "height": HEIGHT})
        page.set_content(html)
        page.wait_for_timeout(500)
        page.screenshot(path=str(out))
        browser.close()

    print(f"written {out}")


if __name__ == "__main__":
    main()
