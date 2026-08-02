"""Generates the isometric SVG artifacts for the repo bar."""
import math

W, H = 175, 150
CX, CY = 87.5, 75.0
COS30 = math.cos(math.radians(30))


def iso(x, y, z, ox=CX, oy=CY, s=1.0):
    """Isometric projection: x goes right-down, y goes left-down, z goes up."""
    return (ox + (x - y) * COS30 * s, oy + (x + y) * 0.5 * s - z * s)


def pts(points):
    return " ".join(f"{px:.2f},{py:.2f}" for px, py in points)


def shade(hex_color, factor):
    hex_color = hex_color.lstrip("#")
    r, g, b = (int(hex_color[i:i + 2], 16) for i in (0, 2, 4))
    if factor >= 1:
        r, g, b = (int(c + (255 - c) * (factor - 1)) for c in (r, g, b))
    else:
        r, g, b = (int(c * factor) for c in (r, g, b))
    return "#%02x%02x%02x" % (min(r, 255), min(g, 255), min(b, 255))


def box(x, y, z, dx, dy, dz, color, ox=CX, oy=CY, s=1.0, opacity=1.0):
    """Isometric cuboid: top face, front-left face (y+dy), front-right face (x+dx)."""
    def p(a, b, c):
        return iso(a, b, c, ox, oy, s)

    top = [p(x, y, z + dz), p(x + dx, y, z + dz), p(x + dx, y + dy, z + dz), p(x, y + dy, z + dz)]
    right = [p(x + dx, y, z + dz), p(x + dx, y + dy, z + dz), p(x + dx, y + dy, z), p(x + dx, y, z)]
    left = [p(x, y + dy, z + dz), p(x + dx, y + dy, z + dz), p(x + dx, y + dy, z), p(x, y + dy, z)]
    o = f' opacity="{opacity}"' if opacity != 1.0 else ""
    return (
        f'<polygon points="{pts(left)}" fill="{shade(color, 0.72)}"{o}/>\n'
        f'<polygon points="{pts(right)}" fill="{shade(color, 0.86)}"{o}/>\n'
        f'<polygon points="{pts(top)}" fill="{color}"{o}/>'
    )


def plate(x, y, z, dx, dy, color, ox=CX, oy=CY, s=1.0, opacity=1.0):
    """Flat isometric quad (no thickness)."""
    def p(a, b):
        return iso(a, b, z, ox, oy, s)
    quad = [p(x, y), p(x + dx, y), p(x + dx, y + dy), p(x, y + dy)]
    o = f' opacity="{opacity}"' if opacity != 1.0 else ""
    return f'<polygon points="{pts(quad)}" fill="{color}"{o}/>'


GUIDES = """  <g fill="none" stroke="#e6e2dc" stroke-width="0.6" opacity="0.9">
    <circle cx="87.5" cy="75" r="61"/>
    <path d="M87.5 12 V138"/>
    <path d="M33 43.5 L142 106.5"/>
    <path d="M33 106.5 L142 43.5"/>
  </g>
  <g fill="none" stroke="#d9d5cf" stroke-width="0.9" stroke-linecap="round" opacity="0.75">
    <path d="M18 47 L52 67"/>
    <path d="M24 41 L46 54"/>
    <path d="M124 96 L158 116"/>
    <path d="M132 106 L152 118"/>
  </g>"""

SHADOW_DEF = """  <defs>
    <radialGradient id="sh" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#3a3532" stop-opacity="0.22"/>
      <stop offset="100%" stop-color="#3a3532" stop-opacity="0"/>
    </radialGradient>
  </defs>"""


def wrap(title, body, extra_defs=""):
    return (
        f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {W} {H}" width="{W}" height="{H}" '
        f'role="img" aria-label="{title}">\n'
        f'  <title>{title}</title>\n'
        f'{SHADOW_DEF}\n{extra_defs}'
        f'{GUIDES}\n'
        f'{body}\n</svg>\n'
    )


def ground_shadow(cx, cy, rx, ry=None):
    ry = ry or rx * 0.5
    return f'  <ellipse cx="{cx}" cy="{cy}" rx="{rx}" ry="{ry}" fill="url(#sh)"/>'


# --------------------------------------------------------------------------
# tomato-timer: an isometric tomato whose face is a countdown dial.
# --------------------------------------------------------------------------
def tomato_timer():
    red, leaf = "#f71735", "#2a7061"
    dial_cy = 80.0
    ticks = []
    for i in range(12):
        a = math.radians(i * 30)
        x1, y1 = math.sin(a) * 24, -math.cos(a) * 24
        x2, y2 = math.sin(a) * 20, -math.cos(a) * 20
        ticks.append(f'<path d="M{x1:.2f} {y1:.2f} L{x2:.2f} {y2:.2f}"/>')
    tick_svg = "".join(ticks)
    out = [ground_shadow(87.5, 118, 42, 14)]
    # squat tomato body, seen from above at the isometric angle
    out.append(f"""  <g>
    <ellipse cx="87.5" cy="93" rx="44" ry="26" fill="{shade(red, 0.7)}"/>
    <path d="M43.5 93 A44 26 0 0 0 131.5 93 L131.5 88 A44 26 0 0 1 43.5 88 z" fill="{shade(red, 0.7)}"/>
    <ellipse cx="87.5" cy="88" rx="44" ry="26" fill="{red}"/>
    <ellipse cx="87.5" cy="{dial_cy}" rx="35" ry="20.5" fill="{shade(red, 1.12)}"/>
    <ellipse cx="87.5" cy="{dial_cy}" rx="30" ry="17.5" fill="#fbf6f4"/>
  </g>""")
    # dial contents, flattened onto the isometric top plane
    out.append(f"""  <g transform="translate(87.5 {dial_cy}) scale(1 0.585)">
    <path d="M0 0 L0 -27 A27 27 0 0 1 19 19 z" fill="{red}" opacity="0.55"/>
    <g fill="none" stroke="{shade(red, 0.75)}" stroke-width="1.6" stroke-linecap="round" opacity="0.8">{tick_svg}</g>
    <g fill="none" stroke="#3a3532" stroke-width="2.6" stroke-linecap="round">
      <path d="M0 0 L0 -17"/><path d="M0 0 L13 9"/>
    </g>
    <circle r="3" fill="#3a3532"/>
  </g>""")
    # stalk and leaves, tucked at the back of the fruit
    out.append(f"""  <g transform="translate(63 62)">
    <path d="M0 4 q-15 -1 -21 -8 q12 -3 21 3 q7 -8 20 -8 q-5 9 -20 13 z" fill="{leaf}"/>
    <path d="M1 3 q-4 -9 -2 -15 q6 4 6 14 z" fill="{shade(leaf, 1.28)}"/>
    <path d="M-1 4 q1 -8 3 -13" fill="none" stroke="{shade(leaf, 0.75)}" stroke-width="3.4" stroke-linecap="round"/>
  </g>""")
    return wrap("tomato-timer", "\n".join(out))


# --------------------------------------------------------------------------
# react-webpack-seed: a crate being packed with modules, React atom above.
# --------------------------------------------------------------------------
def react_webpack_seed():
    wood, react = "#c6aa4a", "#2a7061"
    s = 1.0
    oy = 92.0
    out = [ground_shadow(87.5, 122, 44, 14)]
    # crate floor + four walls (open top)
    out.append("  <g>")
    out.append("    " + plate(-22, -22, 0, 44, 44, shade(wood, 0.62), oy=oy, s=s))
    # back walls first
    out.append("    " + box(-24, -24, 0, 48, 2, 20, shade(wood, 0.9), oy=oy, s=s))
    out.append("    " + box(-24, -24, 0, 2, 48, 20, shade(wood, 0.9), oy=oy, s=s))
    # modules inside
    out.append("    " + box(-18, -18, 0, 16, 16, 13, "#f71735", oy=oy, s=s))
    out.append("    " + box(0, -16, 0, 15, 15, 9, "#e6e2dc", oy=oy, s=s))
    out.append("    " + box(-16, 2, 0, 15, 15, 17, react, oy=oy, s=s))
    out.append("    " + box(2, 2, 0, 16, 16, 11, "#9a634e", oy=oy, s=s))
    # front walls
    out.append("    " + box(-24, 22, 0, 48, 2, 20, wood, oy=oy, s=s))
    out.append("    " + box(22, -24, 0, 2, 48, 20, wood, oy=oy, s=s))
    out.append("  </g>")
    # React atom floating above the crate
    out.append(f"""  <g transform="translate(87.5 36)" fill="none" stroke="{react}" stroke-width="2">
    <ellipse rx="24" ry="9"/>
    <ellipse rx="24" ry="9" transform="rotate(60)"/>
    <ellipse rx="24" ry="9" transform="rotate(-60)"/>
    <circle r="4" fill="{react}" stroke="none"/>
  </g>""")
    return wrap("react-webpack-seed", "\n".join(out))


# --------------------------------------------------------------------------
# event-driven-booking-app: a booking slot on a calendar plate emitting
# events towards a phone.
# --------------------------------------------------------------------------
def event_driven_booking_app():
    plate_c, slot, accent = "#e6e2dc", "#f71735", "#2a7061"
    oy = 100.0
    out = [ground_shadow(87.5, 124, 46, 14)]
    out.append("  <g>")
    out.append("    " + box(-30, -30, 0, 60, 60, 4, plate_c, oy=oy))
    # calendar grid on top
    for i in range(1, 4):
        a = -30 + i * 15
        p1 = iso(a, -30, 4, oy=oy)
        p2 = iso(a, 30, 4, oy=oy)
        p3 = iso(-30, a, 4, oy=oy)
        p4 = iso(30, a, 4, oy=oy)
        out.append(f'    <path d="M{p1[0]:.2f} {p1[1]:.2f} L{p2[0]:.2f} {p2[1]:.2f}" '
                   f'stroke="{shade(plate_c, 0.86)}" stroke-width="0.8"/>')
        out.append(f'    <path d="M{p3[0]:.2f} {p3[1]:.2f} L{p4[0]:.2f} {p4[1]:.2f}" '
                   f'stroke="{shade(plate_c, 0.86)}" stroke-width="0.8"/>')
    # the booked slot
    out.append("    " + box(-15, 0, 4, 15, 15, 9, slot, oy=oy))
    out.append("    " + box(0, -15, 4, 15, 15, 5, accent, oy=oy))
    out.append("  </g>")
    # the booking event travelling from the slot up to the subscribed client
    src = iso(-7.5, 7.5, 13, oy=oy)
    arc = f"M{src[0]:.2f} {src[1] - 4:.2f} C{src[0] + 8:.2f} {src[1] - 26:.2f} 96 22 116 30"
    out.append(f"""  <path d="{arc}" fill="none" stroke="{slot}" stroke-width="1.2"
    stroke-linecap="round" stroke-dasharray="1 4" opacity="0.55"/>
  <g fill="{slot}">
    <circle cx="{src[0] + 3:.2f}" cy="{src[1] - 14:.2f}" r="2.6"/>
    <circle cx="{src[0] + 16:.2f}" cy="{src[1] - 24:.2f}" r="2" opacity="0.6"/>
    <circle cx="{src[0] + 30:.2f}" cy="{src[1] - 26:.2f}" r="1.4" opacity="0.35"/>
  </g>""")
    # the client receiving them
    out.append(f"""  <g transform="translate(116 14)">
    <rect x="1" y="3" width="26" height="44" rx="4.5" fill="#3a3532" opacity="0.12"/>
    <rect x="0" y="0" width="26" height="44" rx="4.5" fill="{shade(plate_c, 0.5)}"/>
    <rect x="1.8" y="1.8" width="22.4" height="40.4" rx="3.2" fill="#fbf9f6"/>
    <rect x="5" y="7" width="16" height="4" rx="2" fill="{shade(plate_c, 0.85)}"/>
    <rect x="5" y="15" width="16" height="4" rx="2" fill="{shade(plate_c, 0.85)}"/>
    <rect x="5" y="23" width="16" height="4" rx="2" fill="{slot}"/>
    <rect x="5" y="31" width="10" height="4" rx="2" fill="{shade(plate_c, 0.85)}"/>
  </g>""")
    return wrap("event-driven-booking-app", "\n".join(out))


# --------------------------------------------------------------------------
# blindtales-app: a book that is listened to rather than read — a closed
# volume on a plinth, telling its tale as sound waves.
# --------------------------------------------------------------------------
def blindtales_app():
    cover, pages, wave = "#2a7061", "#f3ede2", "#f71735"
    oy = 100.0
    out = [ground_shadow(87.5, 124, 42, 13)]
    out.append("  <g>")
    # the book: a stack of pages under a cloth cover
    out.append("    " + box(-24, -18, 0, 48, 36, 11, pages, oy=oy))
    out.append("    " + plate(-24, -18, 11.2, 48, 36, cover, oy=oy))
    # spine and a ribbon marker running across the cover
    p1 = iso(0, -18, 11.4, oy=oy)
    p2 = iso(0, 18, 11.4, oy=oy)
    out.append(f'    <path d="M{p1[0]:.2f} {p1[1]:.2f} L{p2[0]:.2f} {p2[1]:.2f}" '
               f'stroke="{shade(cover, 0.72)}" stroke-width="2" stroke-linecap="round"/>')
    p3 = iso(-14, 4, 11.4, oy=oy)
    p4 = iso(14, 4, 11.4, oy=oy)
    out.append(f'    <path d="M{p3[0]:.2f} {p3[1]:.2f} L{p4[0]:.2f} {p4[1]:.2f}" '
               f'stroke="{wave}" stroke-width="2.4" stroke-linecap="round" opacity="0.85"/>')
    out.append("  </g>")
    # the tale coming off the book as sound, told rather than shown
    src = iso(-24, 0, 11.4, oy=oy)
    waves = []
    for i, r in enumerate((11, 19, 27)):
        waves.append(f'<path d="M0 {-r} A{r} {r} 0 0 0 0 {r}" opacity="{0.75 - i * 0.2:.2f}"/>')
    wx, wy = src[0] + 2, src[1] - 12
    out.append(f"""  <g transform="translate({wx:.2f} {wy:.2f})" fill="none"
    stroke="{wave}" stroke-width="2.2" stroke-linecap="round">{''.join(waves)}</g>""")
    out.append(f'  <circle cx="{wx:.2f}" cy="{wy:.2f}" r="3" fill="{wave}"/>')
    return wrap("blindtales-app", "\n".join(out))


# --------------------------------------------------------------------------
# filippoitaliano.github.io: the digital garden — a plot of soil with a sprout.
# The same scene is reused, as its own standalone file, for the site logo.
# --------------------------------------------------------------------------
SOIL, LEAF, POT = "#9a634e", "#2a7061", "#c6aa4a"


def garden_scene():
    soil, leaf, pot = SOIL, LEAF, POT
    oy = 100.0
    out = [ground_shadow(87.5, 124, 44, 14)]
    out.append("  <g>")
    out.append("    " + box(-28, -28, 0, 56, 56, 12, pot, oy=oy))
    out.append("    " + plate(-24, -24, 12.4, 48, 48, soil, oy=oy))
    out.append("    " + plate(-24, -24, 12.6, 48, 48, "#000000", oy=oy, opacity=0.12))
    # furrows in the soil
    for i in range(1, 4):
        a = -24 + i * 12
        p1 = iso(a, -24, 12.8, oy=oy)
        p2 = iso(a, 24, 12.8, oy=oy)
        out.append(f'    <path d="M{p1[0]:.2f} {p1[1]:.2f} L{p2[0]:.2f} {p2[1]:.2f}" '
                   f'stroke="{shade(soil, 0.78)}" stroke-width="1.2" stroke-linecap="round"/>')
    out.append("  </g>")
    # the sprout
    top = iso(0, 0, 12.8, oy=oy)
    out.append(f"""  <g transform="translate({top[0]:.2f} {top[1]:.2f})">
    <path d="M0 0 C-1 -14 1 -24 0 -40" fill="none" stroke="{shade(leaf, 0.85)}" stroke-width="3" stroke-linecap="round"/>
    <path d="M0 -14 C-12 -16 -19 -24 -20 -33 C-9 -32 -2 -25 0 -14 z" fill="{leaf}"/>
    <path d="M0 -24 C11 -26 18 -34 19 -43 C8 -42 2 -34 0 -24 z" fill="{shade(leaf, 1.22)}"/>
    <circle cx="0" cy="-42" r="3.4" fill="#f71735"/>
  </g>""")
    # a couple of small seeds around the plot
    for sx, sy in ((-16, 16), (17, -14)):
        p = iso(sx, sy, 13, oy=oy)
        out.append(f'  <ellipse cx="{p[0]:.2f}" cy="{p[1]:.2f}" rx="2.6" ry="1.4" fill="{shade(soil, 1.3)}"/>')
    return "\n".join(out)


def garden_site():
    """The repo artifact shown in the articles bar."""
    return wrap("filippoitaliano.github.io", garden_scene())


def site_logo():
    """The site logo in the topbar: same scene, kept as its own asset so the
    logo can drift from the repo artifact without touching the articles bar."""
    return wrap("Filippo Italiano", garden_scene())


# --------------------------------------------------------------------------
# favicon: the same garden, cropped square and stripped of the guides and the
# fine detail that turn to mush at 16px.
# --------------------------------------------------------------------------
def site_favicon():
    soil, pot, leaf = SOIL, POT, LEAF
    ox, oy, s = 32.0, 43.5, 0.56
    out = [box(-28, -28, 0, 56, 56, 12, pot, ox=ox, oy=oy, s=s),
           plate(-24, -24, 12.4, 48, 48, soil, ox=ox, oy=oy, s=s),
           plate(-24, -24, 12.6, 48, 48, "#000000", ox=ox, oy=oy, s=s, opacity=0.12)]
    top = iso(0, 0, 12.8, ox, oy, s)
    out.append(f"""<g transform="translate({top[0]:.2f} {top[1]:.2f}) scale(0.68)">
    <path d="M0 0 C-1 -14 1 -24 0 -40" fill="none" stroke="{shade(leaf, 0.85)}" stroke-width="5" stroke-linecap="round"/>
    <path d="M0 -14 C-12 -16 -19 -24 -20 -33 C-9 -32 -2 -25 0 -14 z" fill="{leaf}"/>
    <path d="M0 -24 C11 -26 18 -34 19 -43 C8 -42 2 -34 0 -24 z" fill="{shade(leaf, 1.22)}"/>
    <circle cx="0" cy="-42" r="4.4" fill="#f71735"/>
  </g>""")
    body = "\n  ".join(out)
    return (
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="64" height="64" '
        'role="img" aria-label="Filippo Italiano">\n'
        '  <title>Filippo Italiano</title>\n'
        f'  {body}\n</svg>\n'
    )


if __name__ == "__main__":
    # Paths are relative to the client dir: `python3 tools/generate-artifacts.py client`.
    targets = {
        "artifacts/blindtales-app.svg": blindtales_app(),
        "artifacts/tomato-timer.svg": tomato_timer(),
        "artifacts/react-webpack-seed.svg": react_webpack_seed(),
        "artifacts/event-driven-booking-app.svg": event_driven_booking_app(),
        "artifacts/garden.svg": garden_site(),
        "logo.svg": site_logo(),
        "favicon.svg": site_favicon(),
    }
    import os, sys
    outdir = sys.argv[1]
    for name, content in targets.items():
        path = os.path.join(outdir, name)
        os.makedirs(os.path.dirname(path), exist_ok=True)
        with open(path, "w") as fh:
            fh.write(content)
        print("wrote", path)
