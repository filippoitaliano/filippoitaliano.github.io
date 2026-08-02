"""Generates the isometric SVG artifacts for the repo bar.

The garden — the site logo, the favicon and this repo's own artifact — is not a
fixed drawing: it grows with the site. See `garden_growth` for the rule.
"""
import json
import math
import os
import re

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
# atmosfere: a fantasy soundscape generator — a board of mood pads, the one
# you pressed lit up and pushing rings of sound out into the room.
# --------------------------------------------------------------------------
def atmosfere():
    board, pad, lit, wave = "#e6e2dc", "#3b3470", "#f71735", "#2a7061"
    oy = 104.0
    out = [ground_shadow(87.5, 126, 46, 14)]
    out.append("  <g>")
    out.append("    " + box(-30, -30, 0, 60, 60, 4, board, oy=oy))
    # the mood pads, laid out as they are in the app: a grid you tap through
    lit_col, lit_row = 1, 1
    for row in range(3):
        for col in range(3):
            x, y = -27 + col * 18, -27 + row * 18
            if (col, row) == (lit_col, lit_row):
                continue
            out.append("    " + box(x, y, 4, 15, 15, 3, shade(pad, 1.55), oy=oy))
    # the pressed one: taller, in the accent, still ringing
    lx, ly = -27 + lit_col * 18, -27 + lit_row * 18
    out.append("    " + box(lx, ly, 4, 15, 15, 8, lit, oy=oy))
    out.append("  </g>")
    # the soundscape it is playing, rising off the pad
    top = iso(lx + 7.5, ly + 7.5, 12, oy=oy)
    for i, (r, o, w) in enumerate(((13, 0.8, 2.2), (22, 0.55, 1.8), (31, 0.34, 1.4))):
        cy = top[1] - 6 - i * 9
        out.append(f'  <ellipse cx="{top[0]:.2f}" cy="{cy:.2f}" rx="{r}" ry="{r * 0.42:.2f}" '
                   f'fill="none" stroke="{wave}" stroke-width="{w}" opacity="{o}"/>')
    # and a few notes drifting off with it
    for nx, ny, r, o in ((44, 44, 4.6, 0.5), (133, 60, 3.4, 0.4), (126, 30, 2.4, 0.3)):
        out.append(f'  <circle cx="{nx}" cy="{ny}" r="{r}" fill="{lit}" opacity="{o}"/>')
    return wrap("atmosfere", "\n".join(out))


# --------------------------------------------------------------------------
# blindtales-app: an exquisite-corpse card game — a fan of face-down cards
# with the one card you are given, face up, on top of the pile.
# --------------------------------------------------------------------------
BT_BACK, BT_FACE, BT_INK = "#3b3470", "#f7f1e3", "#f71735"


def _bt_card(cx, cy, z, w, h, ang, color, oy, thickness=1.6):
    """A rectangular card lying on the ground plane, rotated by `ang` degrees
    around its own centre before the isometric projection."""
    a = math.radians(ang)
    ca, sa = math.cos(a), math.sin(a)

    def corner(dx, dy, zz=z):
        return iso(cx + dx * ca - dy * sa, cy + dx * sa + dy * ca, zz, oy=oy)

    quad = [(-w / 2, -h / 2), (w / 2, -h / 2), (w / 2, h / 2), (-w / 2, h / 2)]
    top = [corner(dx, dy) for dx, dy in quad]
    under = [corner(dx, dy, z - thickness) for dx, dy in quad]
    # the card's own edge, so the fan reads as a stack and not as flat decals
    edge = [top[1], top[2], top[3], under[3], under[2], under[1]]
    return (
        f'    <polygon points="{pts(edge)}" fill="{shade(color, 0.7)}"/>\n'
        f'    <polygon points="{pts(top)}" fill="{color}"/>',
        corner,
    )


def _bt_ink(corner, points, z, color, width, opacity=1.0, closed=False):
    """Ink a run of card-space points onto a card lying in the scene."""
    d = "M" + " L".join(f"{x:.2f} {y:.2f}" for x, y in (corner(a, b, z) for a, b in points))
    return (f'    <path d="{d}{" z" if closed else ""}" fill="none" stroke="{color}" '
            f'stroke-width="{width}" stroke-linecap="round" stroke-linejoin="round" '
            f'opacity="{opacity}"/>')


def _bt_sparkle(cx, cy, r, color, opacity, squash=1.0):
    return (f'  <path transform="translate({cx:.2f} {cy:.2f}) scale(1 {squash})" '
            f'd="M0 {-r} Q0 0 {r} 0 Q0 0 0 {r} Q0 0 {-r} 0 Q0 0 0 {-r} z" '
            f'fill="{color}" opacity="{opacity}"/>')


def blindtales_app():
    back, face, ink = BT_BACK, BT_FACE, BT_INK
    oy = 98.0
    w, h = 34, 46
    out = [ground_shadow(87.5, 120, 44, 14)]
    out.append("  <g>")
    # the cards already played: face down, fanned, each in the deck's white rim
    for cx, cy, z, ang, emblem in ((-11, 11, 0, -40, False), (11, -10, 2.4, 26, True)):
        card, corner = _bt_card(cx, cy, z, w, h, ang, back, oy)
        out.append(card)
        out.append(_bt_ink(corner, [(-w / 2 + 3, -h / 2 + 3), (w / 2 - 3, -h / 2 + 3),
                                    (w / 2 - 3, h / 2 - 3), (-w / 2 + 3, h / 2 - 3)],
                           z + 0.2, shade(face, 0.98), 1.1, 0.65, closed=True))
        if emblem:
            ex, ey = corner(7, -13, z + 0.2)
            out.append("  " + _bt_sparkle(ex, ey, 5.2, face, 0.5, 0.62).strip())
    # the card in your hand: face up, the only one anybody can read
    z = 5.4
    card, corner = _bt_card(-2, 0, z, w, h, -6, face, oy)
    out.append(card)
    # its printed rim, the prompt, and the fold the next player writes past
    out.append(_bt_ink(corner, [(-w / 2 + 3, -h / 2 + 3), (w / 2 - 3, -h / 2 + 3),
                                (w / 2 - 3, h / 2 - 3), (-w / 2 + 3, h / 2 - 3)],
                       z + 0.2, shade(back, 1.55), 0.8, 0.55, closed=True))
    out.append(_bt_ink(corner, [(-9, -4), (9, -4)], z + 0.2, shade(back, 1.3), 2.2))
    out.append(_bt_ink(corner, [(-9, 1), (4, 1)], z + 0.2, shade(back, 1.3), 2.2))
    out.append(_bt_ink(corner, [(-11, 10), (11, 10)], z + 0.2, ink, 1.4, 0.85))
    # the turn number, top left and bottom right as on the real card
    out.append(_bt_ink(corner, [(-12, -17), (-8, -17)], z + 0.2, back, 1.8, 0.75))
    out.append(_bt_ink(corner, [(8, 17), (12, 17)], z + 0.2, back, 1.8, 0.75))
    # the crease: the story so far, folded away out of sight
    out.append(_bt_ink(corner, [(-13, 5.5), (13, 5.5)], z + 0.2, shade(back, 1.5), 0.9, 0.9))
    out.append("  </g>")
    # a little of the game's own sparkle
    for sx, sy, r, o in ((36, 34, 5.0, 0.5), (139, 52, 3.6, 0.45), (126, 116, 4.4, 0.4)):
        out.append(_bt_sparkle(sx, sy, r, ink, o))
    return wrap("blindtales-app", "\n".join(out))


# --------------------------------------------------------------------------
# filippoitaliano.github.io: the digital garden — the plot of soil that is also
# the site logo and the favicon.
#
# The garden is not a fixed drawing: it is generated from how much has been
# planted on the site. Articles become plants, projects widen the bed, and the
# flower in the middle opens up as the two grow. Re-run this script after
# publishing anything and the logo moves on by itself.
# --------------------------------------------------------------------------
SOIL, LEAF, POT, BLOOM, POLLEN = "#9a634e", "#2a7061", "#c6aa4a", "#f71735", "#e8b93f"

GRID_MAX = 3           # at most a 3x3 bed: past that the tiles turn to mush
PETALS_MIN = 5
PETALS_MAX = 8
# How wide the whole bed is drawn for each grid side. It grows, but far more
# slowly than the number of tiles, so the garden keeps sitting inside the
# guide circle instead of bursting out of it.
FOOTPRINT = {1: 56.0, 2: 68.0, 3: 78.0}
# Planting order inside the bed, per grid side: the flower goes down first, in
# the spot that reads best, then the plants spread out from it.
PLANTING_ORDER = {
    1: [(0, 0)],
    2: [(1, 1), (0, 0), (1, 0), (0, 1)],
    3: [(1, 1), (0, 0), (2, 0), (0, 2), (2, 2), (1, 0), (0, 1), (2, 1), (1, 2)],
}


def garden_growth(articles, projects):
    """The growth rule, in one place.

    `articles` is how many articles are published on the site, `projects` how
    many artifacts sit in the articles bar. From those:

    - the bed is the smallest square grid of tiles that holds every project;
    - every article puts one plant in it, filling the tiles from the middle out;
    - the flower opens a petal further as the site fills up.
    """
    articles, projects = max(0, articles), max(0, projects)
    side = min(GRID_MAX, max(1, math.ceil(math.sqrt(max(1, projects)))))
    tiles = side * side
    plants = max(1, min(tiles, articles))
    petals = min(PETALS_MAX, PETALS_MIN + (articles + projects) // 4)
    return {"side": side, "tiles": tiles, "plants": plants, "petals": petals}


def read_growth(root):
    """Counts what has been planted, straight from the site's own sources, so
    the logo cannot drift out of sync with the content."""
    articles = 0
    try:
        with open(os.path.join(root, "data", "articles.json")) as fh:
            articles = sum(1 for a in json.load(fh) if a.get("listed"))
    except (OSError, ValueError):
        pass
    projects = 0
    try:
        with open(os.path.join(root, "client", "components", "ArticlesBar.js")) as fh:
            bar = fh.read()
        block = bar.split("];", 1)[0]
        projects = len(re.findall(r"^\s*name:\s*'", block, re.MULTILINE))
    except OSError:
        pass
    return garden_growth(articles, projects)


# --- the plants ------------------------------------------------------------

def _leaves(leaf, low=-14, high=-24):
    """The pair of leaves the whole garden is drawn with."""
    return (
        f'    <path d="M0 {low} C-12 {low - 2} -19 {low - 10} -20 {low - 19} '
        f'C-9 {low - 18} -2 {low - 11} 0 {low} z" fill="{leaf}"/>\n'
        f'    <path d="M0 {high} C11 {high - 2} 18 {high - 10} 19 {high - 19} '
        f'C8 {high - 18} 2 {high - 10} 0 {high} z" fill="{shade(leaf, 1.22)}"/>'
    )


def plant_flower(petals, leaf=LEAF):
    """The one at the centre of the bed: a real flower head, not a red dot.
    It gains a petal as the garden fills up."""
    head = []
    for i in range(petals):
        a = 360.0 / petals * i
        fill = BLOOM if i % 2 == 0 else shade(BLOOM, 1.22)
        head.append(f'      <ellipse cx="0" cy="-7.2" rx="4.1" ry="7.6" fill="{fill}" '
                    f'transform="rotate({a:.1f})"/>')
    return (
        f'    <path d="M0 0 C-2 -12 2 -22 0 -34" fill="none" stroke="{shade(leaf, 0.85)}" '
        f'stroke-width="3" stroke-linecap="round"/>\n'
        + _leaves(leaf, -12, -22) + "\n"
        f'    <g transform="translate(0 -36)">\n' + "\n".join(head) + "\n"
        f'      <circle r="4" fill="{POLLEN}"/>\n'
        f'      <circle r="1.7" fill="{shade(POLLEN, 0.72)}"/>\n'
        f'    </g>'
    )


def plant_sprout(leaf=LEAF):
    """The original sprout, kept as it was: the garden's first plant."""
    return (
        f'    <path d="M0 0 C-1 -14 1 -24 0 -40" fill="none" stroke="{shade(leaf, 0.85)}" '
        f'stroke-width="3" stroke-linecap="round"/>\n'
        + _leaves(leaf) + "\n"
        f'    <circle cx="0" cy="-42" r="3.4" fill="{BLOOM}"/>'
    )


def plant_bush(leaf=LEAF):
    """A short, bushy one with a berry on it: an article that has settled."""
    return (
        f'    <path d="M0 0 C-1 -7 1 -12 0 -18" fill="none" stroke="{shade(leaf, 0.85)}" '
        f'stroke-width="2.6" stroke-linecap="round"/>\n'
        f'    <path d="M0 -6 C-9 -7 -14 -12 -15 -19 C-7 -18 -2 -12 0 -6 z" fill="{leaf}"/>\n'
        f'    <path d="M0 -11 C9 -12 14 -17 15 -24 C7 -23 2 -17 0 -11 z" '
        f'fill="{shade(leaf, 1.22)}"/>\n'
        f'    <path d="M0 -15 C-7 -17 -10 -23 -10 -29 C-4 -27 -1 -21 0 -15 z" fill="{leaf}"/>\n'
        f'    <circle cx="5" cy="-24" r="2.4" fill="{BLOOM}"/>'
    )


def plant_bud(leaf=LEAF):
    """A stalk with a closed bud: something planted, not out yet."""
    return (
        f'    <path d="M0 0 C2 -12 -2 -20 0 -30" fill="none" stroke="{shade(leaf, 0.85)}" '
        f'stroke-width="2.6" stroke-linecap="round"/>\n'
        f'    <path d="M0 -13 C-10 -15 -15 -21 -16 -28 C-7 -27 -2 -20 0 -13 z" fill="{leaf}"/>\n'
        f'    <path d="M0 -30 C-5 -33 -5 -41 0 -45 C5 -41 5 -33 0 -30 z" fill="{BLOOM}"/>\n'
        f'    <path d="M0 -30 C-3 -33 -3 -41 0 -45 z" fill="{shade(BLOOM, 1.3)}"/>'
    )


def plant_grass(leaf=LEAF):
    """Three blades: the smallest thing that still counts as planted."""
    return (
        f'    <g fill="none" stroke="{leaf}" stroke-width="2.4" stroke-linecap="round">\n'
        f'      <path d="M0 0 C-2 -8 -6 -13 -10 -17"/>\n'
        f'      <path d="M0 0 C1 -10 1 -16 0 -22" stroke="{shade(leaf, 1.2)}"/>\n'
        f'      <path d="M0 0 C3 -7 7 -11 11 -14"/>\n'
        f'    </g>'
    )


def plant_body(index, petals):
    """Which plant grows in the n-th spot. Deterministic, so the garden only
    ever changes when the content does."""
    if index == 0:
        return plant_flower(petals)
    return (plant_sprout, plant_bush, plant_bud, plant_grass)[(index - 1) % 4]()


# --- the bed ---------------------------------------------------------------

def garden_scene(growth, ox=CX, oy_base=100.0, guides=True):
    side, footprint = growth["side"], FOOTPRINT[growth["side"]]
    gap_ratio = 0.12
    tile = footprint / (side + gap_ratio * (side - 1))
    gap = tile * gap_ratio
    height = min(12.0, max(5.0, tile * 0.21))
    inset = max(1.6, tile * 0.071)
    # A wider bed is pushed up the canvas so its front corner keeps clear of
    # the bottom edge, and the plants shrink with the tiles they stand in.
    oy = oy_base - (footprint - 56.0) * 0.35
    scale = 0.55 + 0.45 * (tile / 56.0)
    half = footprint / 2.0

    def cell(col, row):
        return -half + col * (tile + gap), -half + row * (tile + gap)

    order = PLANTING_ORDER[side][:growth["plants"]]
    out = [ground_shadow(ox, oy + footprint * 0.43, footprint * 0.7 + 5,
                         (footprint * 0.7 + 5) * 0.32)]

    # the tiles, drawn back to front so their raised sides overlap correctly
    out.append("  <g>")
    for col, row in sorted(((c, r) for r in range(side) for c in range(side)),
                           key=lambda cr: (cr[0] + cr[1], cr[1])):
        x, y = cell(col, row)
        out.append("    " + box(x, y, 0, tile, tile, height, POT, ox=ox, oy=oy))
        out.append("    " + plate(x + inset, y + inset, height + 0.4,
                                  tile - 2 * inset, tile - 2 * inset, SOIL, ox=ox, oy=oy))
        out.append("    " + plate(x + inset, y + inset, height + 0.6,
                                  tile - 2 * inset, tile - 2 * inset, "#000000",
                                  ox=ox, oy=oy, opacity=0.12))
        # furrows: fewer of them as the tiles get smaller, none once they would
        # just be noise
        furrows = {1: 3, 2: 2, 3: 1}[side]
        step = (tile - 2 * inset) / (furrows + 1)
        for i in range(1, furrows + 1):
            a = x + inset + i * step
            p1 = iso(a, y + inset, height + 0.8, ox, oy)
            p2 = iso(a, y + tile - inset, height + 0.8, ox, oy)
            out.append(f'    <path d="M{p1[0]:.2f} {p1[1]:.2f} L{p2[0]:.2f} {p2[1]:.2f}" '
                       f'stroke="{shade(SOIL, 0.78)}" stroke-width="{max(0.7, 1.2 * scale):.1f}" '
                       f'stroke-linecap="round"/>')
    out.append("  </g>")

    # the plants, also back to front so the near ones stand in front
    for col, row in sorted(order, key=lambda cr: (cr[0] + cr[1], cr[1])):
        x, y = cell(col, row)
        top = iso(x + tile / 2, y + tile / 2, height + 0.8, ox, oy)
        body = plant_body(order.index((col, row)), growth["petals"])
        out.append(f'  <g transform="translate({top[0]:.2f} {top[1]:.2f}) '
                   f'scale({scale:.3f})">\n{body}\n  </g>')

    # seeds waiting on the tiles nobody has planted yet
    for col, row in PLANTING_ORDER[side][growth["plants"]:][:3]:
        x, y = cell(col, row)
        for dx, dy in ((0.34, 0.62), (0.66, 0.36)):
            p = iso(x + tile * dx, y + tile * dy, height + 1, ox, oy)
            out.append(f'  <ellipse cx="{p[0]:.2f}" cy="{p[1]:.2f}" '
                       f'rx="{2.6 * scale:.2f}" ry="{1.4 * scale:.2f}" '
                       f'fill="{shade(SOIL, 1.3)}"/>')
    return "\n".join(out)


# --------------------------------------------------------------------------
# the garden growing: the same scene at every stage of the rule, played as
# frames. Used for the flash of growth the logo does when the site opens, and
# for the loader, where it keeps going round while the server wakes up.
# --------------------------------------------------------------------------
# (grid side, plants) from the barest plot to a full bed.
GROWTH_FRAMES = ((1, 0), (1, 1), (2, 2), (2, 4), (3, 6), (3, 9))


def growth_frames(final=None):
    frames = []
    for side, plants in GROWTH_FRAMES:
        tiles = side * side
        frames.append({
            "side": side,
            "tiles": tiles,
            "plants": plants,
            "petals": min(PETALS_MAX, PETALS_MIN + (plants + tiles) // 4),
        })
    if final:
        frames.append(final)
    return frames


def _frame_keyframes(index, count):
    """One frame's slice of the timeline. The frames are stacked on top of each
    other and only one is opaque at a time, so the garden reads as stop motion
    rather than as a cross-fade."""
    step = 100.0 / count
    start, end, eps = index * step, (index + 1) * step, 0.001
    stops = []
    if index > 0:
        stops.append(f"0%,{start - eps:.3f}%{{opacity:0}}")
    stops.append(f"{start:.3f}%{{opacity:1}}")
    if index == count - 1:
        # the last frame is the one that stays up when the animation stops
        stops.append("100%{opacity:1}")
    else:
        stops.append(f"{end - eps:.3f}%{{opacity:1}}")
        stops.append(f"{end:.3f}%,100%{{opacity:0}}")
    return f"@keyframes gf{index}{{{''.join(stops)}}}"


def animated_garden(title, frames, duration, loop):
    count = len(frames)
    repeat = "infinite" if loop else "1"
    rules = [".gf{opacity:0}"]
    for i in range(count):
        rules.append(f".gf{i}{{animation:gf{i} {duration}s linear {repeat} both}}")
    rules.extend(_frame_keyframes(i, count) for i in range(count))
    # Someone who asked for less motion gets the garden as it ends up, at once.
    rules.append("@media (prefers-reduced-motion:reduce){.gf{animation:none}"
                 f".gf{count - 1}{{opacity:1}}}}")
    style = "  <style>\n    " + "\n    ".join(rules) + "\n  </style>"
    bodies = "\n".join(
        f'  <g class="gf gf{i}">\n{garden_scene(frame)}\n  </g>'
        for i, frame in enumerate(frames)
    )
    return (
        f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {W} {H}" width="{W}" height="{H}" '
        f'role="img" aria-label="{title}">\n'
        f'  <title>{title}</title>\n'
        f'{SHADOW_DEF}\n{style}\n{GUIDES}\n{bodies}\n</svg>\n'
    )


def logo_growing(growth):
    """The logo running through every stage of the rule and settling on the one
    the site is actually at."""
    return animated_garden("Filippo Italiano", growth_frames(growth), 1.4, loop=False)


def logo_loading():
    """The same growth, going round and round: the loader."""
    return animated_garden("L'orto che cresce", growth_frames(), 2.4, loop=True)


def garden_site(growth):
    """The repo artifact shown in the articles bar."""
    return wrap("filippoitaliano.github.io", garden_scene(growth))


def site_logo(growth):
    """The site logo in the topbar: same scene, kept as its own asset so the
    logo can drift from the repo artifact without touching the articles bar."""
    return wrap("Filippo Italiano", garden_scene(growth))


# --------------------------------------------------------------------------
# favicon: the same garden, cropped square and stripped of the guides and the
# fine detail that turn to mush at 16px. The bed still grows, but never past
# 2x2, and only the flower is planted in it.
# --------------------------------------------------------------------------
def site_favicon(growth):
    side = min(2, growth["side"])
    footprint = FOOTPRINT[side]
    gap_ratio = 0.12
    tile = footprint / (side + gap_ratio * (side - 1))
    gap = tile * gap_ratio
    height = min(12.0, max(5.0, tile * 0.21))
    inset = max(1.6, tile * 0.071)
    ox, oy, s = 32.0, 43.5, 0.56 * (56.0 / footprint)
    half = footprint / 2.0
    out = []
    for col, row in sorted(((c, r) for r in range(side) for c in range(side)),
                           key=lambda cr: (cr[0] + cr[1], cr[1])):
        x, y = -half + col * (tile + gap), -half + row * (tile + gap)
        out.append(box(x, y, 0, tile, tile, height, POT, ox=ox, oy=oy, s=s))
        out.append(plate(x + inset, y + inset, height + 0.4, tile - 2 * inset,
                         tile - 2 * inset, SOIL, ox=ox, oy=oy, s=s))
        out.append(plate(x + inset, y + inset, height + 0.6, tile - 2 * inset,
                         tile - 2 * inset, "#000000", ox=ox, oy=oy, s=s, opacity=0.12))
    col, row = PLANTING_ORDER[side][0]
    x, y = -half + col * (tile + gap), -half + row * (tile + gap)
    top = iso(x + tile / 2, y + tile / 2, height + 0.8, ox, oy, s)
    flower = plant_flower(growth["petals"]).replace('stroke-width="3"', 'stroke-width="4"')
    out.append(f'<g transform="translate({top[0]:.2f} {top[1]:.2f}) scale(0.72)">\n'
               f'{flower}\n  </g>')
    body = "\n  ".join(out)
    return (
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="64" height="64" '
        'role="img" aria-label="Filippo Italiano">\n'
        '  <title>Filippo Italiano</title>\n'
        f'  {body}\n</svg>\n'
    )


if __name__ == "__main__":
    import os, sys
    # The garden reads the site's own content, from the repo root: the tools
    # dir lives one level below it.
    growth = read_growth(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
    # Paths are relative to the client dir: `python3 tools/generate-artifacts.py client`.
    targets = {
        "artifacts/blindtales-app.svg": blindtales_app(),
        "artifacts/tomato-timer.svg": tomato_timer(),
        "artifacts/react-webpack-seed.svg": react_webpack_seed(),
        "artifacts/event-driven-booking-app.svg": event_driven_booking_app(),
        "artifacts/atmosfere.svg": atmosfere(),
        "artifacts/garden.svg": garden_site(growth),
        "logo.svg": site_logo(growth),
        "logo-growing.svg": logo_growing(growth),
        "logo-loading.svg": logo_loading(),
        "favicon.svg": site_favicon(growth),
    }
    outdir = sys.argv[1]
    for name, content in targets.items():
        path = os.path.join(outdir, name)
        os.makedirs(os.path.dirname(path), exist_ok=True)
        with open(path, "w") as fh:
            fh.write(content)
        print("wrote", path)
    print("garden: {tiles} tiles, {plants} plants, {petals} petals".format(**growth))
