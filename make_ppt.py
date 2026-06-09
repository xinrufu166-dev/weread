from pptx import Presentation
from pptx.util import Inches, Pt, Emu
from pptx.dml.color import RGBColor
from pptx.enum.text import PP_ALIGN
from pptx.util import Inches, Pt
import pptx.oxml.ns as nsmap
from lxml import etree
import copy

# Color palette: fresh academic-energetic
BG_WHITE     = RGBColor(0xFA, 0xFB, 0xF6)   # warm off-white
PRIMARY      = RGBColor(0x2D, 0x6A, 0x4F)   # deep forest green
ACCENT       = RGBColor(0x52, 0xB7, 0x88)   # mint green
ACCENT2      = RGBColor(0xF4, 0xA2, 0x61)   # warm orange
LIGHT_GREEN  = RGBColor(0xD8, 0xF3, 0xDC)   # pale green bg
TEXT_DARK    = RGBColor(0x1B, 0x1B, 0x1B)
TEXT_MID     = RGBColor(0x4A, 0x4A, 0x4A)
TEXT_LIGHT   = RGBColor(0xFF, 0xFF, 0xFF)
BORDER       = RGBColor(0x52, 0xB7, 0x88)

W = Inches(13.33)
H = Inches(7.5)

prs = Presentation()
prs.slide_width  = W
prs.slide_height = H

blank = prs.slide_layouts[6]  # blank

def add_rect(slide, left, top, width, height, fill=None, line=None, line_width=Pt(0)):
    shape = slide.shapes.add_shape(
        pptx.enum.shapes.MSO_SHAPE_TYPE.AUTO_SHAPE if False else 1,
        left, top, width, height
    )
    shape.line.width = line_width
    if fill:
        shape.fill.solid()
        shape.fill.fore_color.rgb = fill
    else:
        shape.fill.background()
    if line:
        shape.line.color.rgb = line
    else:
        shape.line.fill.background()
    return shape

def add_text(slide, text, left, top, width, height,
             font_size=Pt(18), bold=False, color=TEXT_DARK,
             align=PP_ALIGN.LEFT, italic=False, wrap=True):
    txBox = slide.shapes.add_textbox(left, top, width, height)
    tf = txBox.text_frame
    tf.word_wrap = wrap
    p = tf.paragraphs[0]
    p.alignment = align
    run = p.add_run()
    run.text = text
    run.font.size = font_size
    run.font.bold = bold
    run.font.italic = italic
    run.font.color.rgb = color
    run.font.name = "Arial"
    return txBox

def set_bg(slide, color):
    bg = slide.background
    fill = bg.fill
    fill.solid()
    fill.fore_color.rgb = color

def add_circle(slide, cx, cy, r, fill_color):
    left = cx - r
    top  = cy - r
    shape = slide.shapes.add_shape(9, left, top, r*2, r*2)  # 9 = oval
    shape.fill.solid()
    shape.fill.fore_color.rgb = fill_color
    shape.line.fill.background()
    return shape

# ─────────────────────────────────────────────
# SLIDE 1  封面
# ─────────────────────────────────────────────
s = prs.slides.add_slide(blank)
set_bg(s, BG_WHITE)

# left green band
add_rect(s, 0, 0, Inches(0.18), H, fill=PRIMARY)

# decorative circles
add_circle(s, Inches(11.8), Inches(0.8), Inches(0.55), LIGHT_GREEN)
add_circle(s, Inches(12.5), Inches(1.5), Inches(0.3),  ACCENT)
add_circle(s, Inches(0.9),  Inches(6.8), Inches(0.4),  LIGHT_GREEN)
add_circle(s, Inches(12.1), Inches(6.5), Inches(0.65), LIGHT_GREEN)

# top-right accent bar
add_rect(s, Inches(10.2), 0, Inches(3.13), Inches(0.12), fill=ACCENT)

# subtitle tag box
tag = add_rect(s, Inches(0.55), Inches(1.6), Inches(3.2), Inches(0.45), fill=ACCENT)
add_text(s, "植物生物化学 · 酶学专题", Inches(0.6), Inches(1.62),
         Inches(3.1), Inches(0.4), font_size=Pt(13), color=TEXT_LIGHT, align=PP_ALIGN.LEFT)

# main title
add_text(s, "植物萜烯合酶", Inches(0.55), Inches(2.2), Inches(9), Inches(1.4),
         font_size=Pt(60), bold=True, color=PRIMARY)

# subtitle
add_text(s, "结构·机制·进化·应用", Inches(0.55), Inches(3.5), Inches(7), Inches(0.7),
         font_size=Pt(26), color=ACCENT2, bold=False)

# divider line
add_rect(s, Inches(0.55), Inches(4.35), Inches(6.5), Inches(0.04), fill=ACCENT)

# info row
add_text(s, "Plant Terpene Synthases", Inches(0.55), Inches(4.5),
         Inches(8), Inches(0.5), font_size=Pt(16), italic=True, color=TEXT_MID)

# emoji-style molecule icon (text)
add_text(s, "🌿", Inches(10.5), Inches(3.0), Inches(2), Inches(2),
         font_size=Pt(90), align=PP_ALIGN.CENTER)

# ─────────────────────────────────────────────
# SLIDE 2  目录
# ─────────────────────────────────────────────
s = prs.slides.add_slide(blank)
set_bg(s, BG_WHITE)
add_rect(s, 0, 0, Inches(0.18), H, fill=PRIMARY)
add_rect(s, Inches(0.18), 0, W - Inches(0.18), Inches(0.08), fill=ACCENT)

add_text(s, "目 录", Inches(0.5), Inches(0.25), Inches(4), Inches(0.65),
         font_size=Pt(32), bold=True, color=PRIMARY)
add_text(s, "CONTENTS", Inches(0.5), Inches(0.88), Inches(4), Inches(0.4),
         font_size=Pt(14), italic=True, color=ACCENT)

items = [
    ("01", "萜烯的生物学地位",       "植物次生代谢的核心产物"),
    ("02", "萜烯合酶的分类与结构",   "α/β/γ桶状折叠与活性位点"),
    ("03", "催化机制",               "碳正离子级联与产物多样性"),
    ("04", "基因进化",               "多基因家族与功能分化"),
    ("05", "生态功能",               "防御·授粉·竞争"),
    ("06", "应用前景",               "农业·医药·合成生物学"),
]
cols = [(Inches(0.55), Inches(1.1)), (Inches(6.9), Inches(1.1))]
for i, (num, title, sub) in enumerate(items):
    col = i % 2
    row = i // 2
    lx, ly = cols[col]
    ly += row * Inches(1.8)
    # card bg
    card = add_rect(s, lx, ly, Inches(6.0), Inches(1.55), fill=LIGHT_GREEN, line=ACCENT, line_width=Pt(1.2))
    # number circle
    add_circle(s, lx + Inches(0.45), ly + Inches(0.78), Inches(0.38), PRIMARY)
    add_text(s, num, lx + Inches(0.13), ly + Inches(0.45), Inches(0.65), Inches(0.55),
             font_size=Pt(18), bold=True, color=TEXT_LIGHT, align=PP_ALIGN.CENTER)
    add_text(s, title, lx + Inches(0.95), ly + Inches(0.12), Inches(4.8), Inches(0.55),
             font_size=Pt(19), bold=True, color=PRIMARY)
    add_text(s, sub, lx + Inches(0.95), ly + Inches(0.68), Inches(4.8), Inches(0.5),
             font_size=Pt(13), color=TEXT_MID)

# ─────────────────────────────────────────────
# SLIDE 3  萜烯的生物学地位
# ─────────────────────────────────────────────
s = prs.slides.add_slide(blank)
set_bg(s, BG_WHITE)
add_rect(s, 0, 0, Inches(0.18), H, fill=PRIMARY)

# section header band
add_rect(s, Inches(0.18), 0, W, Inches(1.15), fill=PRIMARY)
add_text(s, "01  萜烯的生物学地位", Inches(0.5), Inches(0.12),
         Inches(10), Inches(0.7), font_size=Pt(30), bold=True, color=TEXT_LIGHT)
add_text(s, "The Biological Significance of Terpenoids",
         Inches(0.5), Inches(0.72), Inches(10), Inches(0.38),
         font_size=Pt(14), italic=True, color=ACCENT)

# big fact
add_rect(s, Inches(0.5), Inches(1.3), Inches(4.5), Inches(1.2), fill=LIGHT_GREEN, line=ACCENT, line_width=Pt(1.5))
add_text(s, "> 80,000", Inches(0.55), Inches(1.35), Inches(4.4), Inches(0.7),
         font_size=Pt(38), bold=True, color=PRIMARY, align=PP_ALIGN.CENTER)
add_text(s, "已知天然萜烯化合物种数", Inches(0.55), Inches(2.0), Inches(4.4), Inches(0.4),
         font_size=Pt(14), color=TEXT_MID, align=PP_ALIGN.CENTER)

add_rect(s, Inches(5.2), Inches(1.3), Inches(3.8), Inches(1.2), fill=RGBColor(0xFF,0xF3,0xE0), line=ACCENT2, line_width=Pt(1.5))
add_text(s, "最大的天然产物家族", Inches(5.25), Inches(1.35), Inches(3.7), Inches(0.55),
         font_size=Pt(20), bold=True, color=ACCENT2, align=PP_ALIGN.CENTER)
add_text(s, "占植物次生代谢物 ~60%", Inches(5.25), Inches(1.9), Inches(3.7), Inches(0.4),
         font_size=Pt(13), color=TEXT_MID, align=PP_ALIGN.CENTER)

add_rect(s, Inches(9.3), Inches(1.3), Inches(3.7), Inches(1.2), fill=LIGHT_GREEN, line=ACCENT, line_width=Pt(1.5))
add_text(s, "C₅ 异戊二烯单元", Inches(9.35), Inches(1.35), Inches(3.6), Inches(0.55),
         font_size=Pt(20), bold=True, color=PRIMARY, align=PP_ALIGN.CENTER)
add_text(s, "所有萜烯的基本构建块", Inches(9.35), Inches(1.9), Inches(3.6), Inches(0.4),
         font_size=Pt(13), color=TEXT_MID, align=PP_ALIGN.CENTER)

# classification table header
add_text(s, "萜烯分类一览", Inches(0.5), Inches(2.75), Inches(5), Inches(0.45),
         font_size=Pt(19), bold=True, color=PRIMARY)

rows = [
    ("类别",      "碳数", "前体",             "代表化合物"),
    ("半萜",      "C₅",   "IPP",              "异戊二烯"),
    ("单萜",      "C₁₀",  "GPP",              "薄荷醇、柠檬烯"),
    ("倍半萜",    "C₁₅",  "FPP",              "法尼醇、青蒿素"),
    ("二萜",      "C₂₀",  "GGPP",             "赤霉素、紫杉醇"),
    ("三萜",      "C₃₀",  "鲨烯",             "固醇、皂苷"),
    ("四萜",      "C₄₀",  "八氢番茄红素",      "类胡萝卜素"),
]
col_w = [Inches(1.6), Inches(0.8), Inches(2.1), Inches(2.8)]
col_x = [Inches(0.5), Inches(2.12), Inches(2.93), Inches(5.05)]
for ri, row in enumerate(rows):
    ry = Inches(3.25) + ri * Inches(0.52)
    bg = PRIMARY if ri == 0 else (LIGHT_GREEN if ri % 2 == 1 else BG_WHITE)
    fc = TEXT_LIGHT if ri == 0 else TEXT_DARK
    add_rect(s, Inches(0.5), ry, Inches(7.35), Inches(0.5), fill=bg)
    for ci, cell in enumerate(row):
        add_text(s, cell, col_x[ci], ry + Inches(0.05), col_w[ci], Inches(0.42),
                 font_size=Pt(12 if ri>0 else 13), bold=(ri==0),
                 color=fc, align=PP_ALIGN.CENTER)

# right panel: roles
add_rect(s, Inches(8.1), Inches(2.65), Inches(5.0), Inches(4.7), fill=LIGHT_GREEN)
add_text(s, "生态与生理功能", Inches(8.2), Inches(2.72), Inches(4.8), Inches(0.5),
         font_size=Pt(18), bold=True, color=PRIMARY)
roles = [
    ("🌺", "花香与授粉吸引"),
    ("🛡️", "防御草食动物与病原体"),
    ("☀️", "光保护（类胡萝卜素）"),
    ("🌱", "激素信号（赤霉素、脱落酸）"),
    ("💊", "高价值天然药物来源"),
    ("🧪", "合成生物学底盘化合物"),
]
for i, (emoji, text) in enumerate(roles):
    ry = Inches(3.28) + i * Inches(0.62)
    add_text(s, emoji + "  " + text, Inches(8.25), ry, Inches(4.7), Inches(0.55),
             font_size=Pt(14), color=TEXT_DARK)

# ─────────────────────────────────────────────
# SLIDE 4  分类与结构
# ─────────────────────────────────────────────
s = prs.slides.add_slide(blank)
set_bg(s, BG_WHITE)
add_rect(s, 0, 0, Inches(0.18), H, fill=PRIMARY)
add_rect(s, Inches(0.18), 0, W, Inches(1.15), fill=PRIMARY)
add_text(s, "02  萜烯合酶的分类与结构", Inches(0.5), Inches(0.12),
         Inches(10), Inches(0.7), font_size=Pt(30), bold=True, color=TEXT_LIGHT)
add_text(s, "Classification & Structural Architecture",
         Inches(0.5), Inches(0.72), Inches(10), Inches(0.38),
         font_size=Pt(14), italic=True, color=ACCENT)

# 3 class cards
classes = [
    ("I 类\n单萜/倍半萜/二萜合酶",
     "α-螺旋桶状折叠\nDDxxD + NSE/DTE 基序\n金属离子辅助底物焦磷酸离去",
     ACCENT, LIGHT_GREEN),
    ("II 类\n二萜合酶（质子化）",
     "β/γ 桶状折叠\nDxDD 基序\n质子化触发碳正离子",
     ACCENT2, RGBColor(0xFF,0xF3,0xE0)),
    ("融合型\n半萜/三/四萜",
     "双域或多域融合\n特殊底物通道\n多步催化",
     PRIMARY, LIGHT_GREEN),
]
for i, (title, body, col, bg) in enumerate(classes):
    lx = Inches(0.45) + i * Inches(4.28)
    add_rect(s, lx, Inches(1.25), Inches(4.05), Inches(2.8), fill=bg, line=col, line_width=Pt(2))
    add_rect(s, lx, Inches(1.25), Inches(4.05), Inches(0.6), fill=col)
    add_text(s, title, lx + Inches(0.1), Inches(1.28), Inches(3.85), Inches(0.55),
             font_size=Pt(15), bold=True, color=TEXT_LIGHT, align=PP_ALIGN.CENTER)
    add_text(s, body, lx + Inches(0.15), Inches(1.95), Inches(3.75), Inches(2.0),
             font_size=Pt(13), color=TEXT_DARK)

# structural features
add_text(s, "活性位点共同特征", Inches(0.45), Inches(4.22), Inches(6), Inches(0.45),
         font_size=Pt(19), bold=True, color=PRIMARY)
features = [
    "💠  金属离子结合基序（Mg²⁺/Mn²⁺）：稳定焦磷酸基团并辅助离去",
    "🔮  疏水活性口袋：决定产物骨架的立体选择性",
    "🔗  初始碳正离子形成：焦磷酸离去（I类）或质子化（II类）",
    "⚡  碳正离子级联反应：环化、重排、脱质子…生成多样骨架",
]
for i, f in enumerate(features):
    add_text(s, f, Inches(0.5), Inches(4.75) + i * Inches(0.6),
             Inches(8), Inches(0.55), font_size=Pt(13.5), color=TEXT_DARK)

# right schematic placeholder
add_rect(s, Inches(9.1), Inches(1.25), Inches(4.0), Inches(5.8), fill=LIGHT_GREEN, line=ACCENT, line_width=Pt(1.5))
add_text(s, "结构示意", Inches(9.2), Inches(1.3), Inches(3.8), Inches(0.5),
         font_size=Pt(16), bold=True, color=PRIMARY, align=PP_ALIGN.CENTER)

# draw simplified alpha-helix barrel with shapes
barrel_cx = Inches(11.1)
barrel_cy = Inches(3.8)
# outer oval
shape = s.shapes.add_shape(9, barrel_cx - Inches(1.5), barrel_cy - Inches(2.0),
                           Inches(3.0), Inches(4.0))
shape.fill.solid(); shape.fill.fore_color.rgb = RGBColor(0xB7,0xE4,0xC7)
shape.line.color.rgb = PRIMARY; shape.line.width = Pt(2)

# inner active site
shape2 = s.shapes.add_shape(9, barrel_cx - Inches(0.6), barrel_cy - Inches(0.55),
                            Inches(1.2), Inches(1.1))
shape2.fill.solid(); shape2.fill.fore_color.rgb = ACCENT2
shape2.line.color.rgb = RGBColor(0xC0,0x60,0x20); shape2.line.width = Pt(1.5)

add_text(s, "活性\n口袋", barrel_cx - Inches(0.55), barrel_cy - Inches(0.5),
         Inches(1.1), Inches(1.0), font_size=Pt(11), bold=True, color=TEXT_LIGHT, align=PP_ALIGN.CENTER)
add_text(s, "α-螺旋桶", barrel_cx - Inches(1.4), barrel_cy + Inches(1.55),
         Inches(2.8), Inches(0.4), font_size=Pt(12), color=PRIMARY, align=PP_ALIGN.CENTER)

# metal ions
for dx in [-0.35, 0.35]:
    add_circle(s, barrel_cx + Inches(dx), barrel_cy - Inches(0.85), Inches(0.14), PRIMARY)
add_text(s, "Mg²⁺  Mg²⁺", barrel_cx - Inches(0.7), barrel_cy - Inches(1.1),
         Inches(1.4), Inches(0.3), font_size=Pt(10), color=PRIMARY, align=PP_ALIGN.CENTER)

# ─────────────────────────────────────────────
# SLIDE 5  催化机制
# ─────────────────────────────────────────────
s = prs.slides.add_slide(blank)
set_bg(s, BG_WHITE)
add_rect(s, 0, 0, Inches(0.18), H, fill=PRIMARY)
add_rect(s, Inches(0.18), 0, W, Inches(1.15), fill=PRIMARY)
add_text(s, "03  催化机制", Inches(0.5), Inches(0.12),
         Inches(10), Inches(0.7), font_size=Pt(30), bold=True, color=TEXT_LIGHT)
add_text(s, "Catalytic Mechanism — Carbocation Cascade",
         Inches(0.5), Inches(0.72), Inches(10), Inches(0.38),
         font_size=Pt(14), italic=True, color=ACCENT)

# flow steps
steps = [
    ("底物结合", "GPP/FPP/GGPP\n与 Mg²⁺ 配位进入\n活性口袋"),
    ("焦磷酸离去", "DDxxD 基序\n辅助 OPP⁻ 离去，\n生成碳正离子"),
    ("环化/重排", "碳正离子亲核\n进攻双键，形成\n环状中间体"),
    ("去质子化", "碱基（His/Tyr）\n脱去质子，恢复\n中性产物"),
    ("产物释放", "构象变化打开\n活性口袋，产物\n扩散释出"),
]
arrow_color = ACCENT
step_colors = [ACCENT, PRIMARY, ACCENT2, PRIMARY, ACCENT]
step_bgs    = [LIGHT_GREEN, RGBColor(0xD8,0xF3,0xDC), RGBColor(0xFF,0xF3,0xE0),
               RGBColor(0xD8,0xF3,0xDC), LIGHT_GREEN]
box_w = Inches(2.3)
box_h = Inches(3.8)
gap   = Inches(0.18)
start_x = Inches(0.45)
for i, (title, body) in enumerate(steps):
    lx = start_x + i * (box_w + gap)
    # card
    add_rect(s, lx, Inches(1.3), box_w, box_h, fill=step_bgs[i], line=step_colors[i], line_width=Pt(2))
    # header strip
    add_rect(s, lx, Inches(1.3), box_w, Inches(0.55), fill=step_colors[i])
    add_text(s, f"{i+1}. {title}", lx + Inches(0.08), Inches(1.33), box_w - Inches(0.1), Inches(0.48),
             font_size=Pt(14), bold=True, color=TEXT_LIGHT, align=PP_ALIGN.CENTER)
    add_text(s, body, lx + Inches(0.12), Inches(2.0), box_w - Inches(0.2), Inches(2.9),
             font_size=Pt(13), color=TEXT_DARK)
    # arrow (except last)
    if i < 4:
        ax = lx + box_w + Inches(0.03)
        ay = Inches(2.85)
        add_text(s, "▶", ax, ay, gap + Inches(0.1), Inches(0.4),
                 font_size=Pt(16), color=ACCENT, align=PP_ALIGN.CENTER)

# bottom insight box
add_rect(s, Inches(0.45), Inches(5.3), Inches(12.5), Inches(1.85), fill=LIGHT_GREEN, line=PRIMARY, line_width=Pt(1.5))
add_text(s, "🔑 多样性的秘密",
         Inches(0.6), Inches(5.38), Inches(4), Inches(0.48),
         font_size=Pt(16), bold=True, color=PRIMARY)
add_text(s,
    "同一前体（如 FPP）通过不同萜烯合酶，可生成 > 300 种倍半萜骨架。"
    "活性口袋的形状、体积与关键残基的微小变化即可切换产物特异性——"
    "这是植物化学多样性爆炸式增长的根本原因。",
    Inches(0.6), Inches(5.88), Inches(12.3), Inches(1.1),
    font_size=Pt(13.5), color=TEXT_DARK)

# ─────────────────────────────────────────────
# SLIDE 6  基因进化
# ─────────────────────────────────────────────
s = prs.slides.add_slide(blank)
set_bg(s, BG_WHITE)
add_rect(s, 0, 0, Inches(0.18), H, fill=PRIMARY)
add_rect(s, Inches(0.18), 0, W, Inches(1.15), fill=PRIMARY)
add_text(s, "04  基因进化", Inches(0.5), Inches(0.12),
         Inches(10), Inches(0.7), font_size=Pt(30), bold=True, color=TEXT_LIGHT)
add_text(s, "Gene Evolution of Plant Terpene Synthase Family",
         Inches(0.5), Inches(0.72), Inches(10), Inches(0.38),
         font_size=Pt(14), italic=True, color=ACCENT)

# TPS subfamilies table
add_text(s, "TPS 基因亚家族（TPS-a ~ TPS-h）", Inches(0.5), Inches(1.22),
         Inches(8), Inches(0.5), font_size=Pt(19), bold=True, color=PRIMARY)
subfam = [
    ("亚家族", "主要物种",     "主要产物类别",   "特点"),
    ("TPS-a",  "被子植物",     "倍半萜 / 二萜",  "最大亚家族，高度分化"),
    ("TPS-b",  "被子植物",     "单萜",           "花/叶挥发物"),
    ("TPS-c",  "所有陆地植物", "贝壳杉二烯",     "最古老，进化保守"),
    ("TPS-d",  "裸子植物",     "单萜 / 倍半萜",  "针叶树特有"),
    ("TPS-e/f","被子植物",     "二萜",           "赤霉素合成相关"),
    ("TPS-g",  "被子植物",     "单萜（无环）",   "花香成分"),
    ("TPS-h",  "苔藓",         "倍半萜",         "苔藓特有系统"),
]
col_ws2 = [Inches(1.2), Inches(2.0), Inches(2.3), Inches(3.2)]
col_xs2 = [Inches(0.5), Inches(1.72), Inches(3.74), Inches(6.06)]
for ri, row in enumerate(subfam):
    ry = Inches(1.8) + ri * Inches(0.58)
    bg = PRIMARY if ri == 0 else (LIGHT_GREEN if ri % 2 == 1 else BG_WHITE)
    fc = TEXT_LIGHT if ri == 0 else TEXT_DARK
    add_rect(s, Inches(0.5), ry, Inches(9.0), Inches(0.56), fill=bg)
    for ci, cell in enumerate(row):
        add_text(s, cell, col_xs2[ci], ry + Inches(0.05), col_ws2[ci], Inches(0.46),
                 font_size=Pt(12 if ri > 0 else 13), bold=(ri == 0),
                 color=fc, align=PP_ALIGN.LEFT if ci > 0 else PP_ALIGN.CENTER)

# right: evolution key points
add_rect(s, Inches(9.8), Inches(1.22), Inches(3.3), Inches(5.9), fill=LIGHT_GREEN, line=ACCENT, line_width=Pt(1.5))
add_text(s, "进化关键事件", Inches(9.9), Inches(1.3), Inches(3.1), Inches(0.5),
         font_size=Pt(16), bold=True, color=PRIMARY, align=PP_ALIGN.CENTER)
evo_pts = [
    "🌍 起源于原始萜烯合酶\n    祖先（与原核生物共享）",
    "🌿 陆地植物登陆后\n    基因家族快速扩张",
    "🔀 串联基因重复驱动\n    功能分化",
    "🧬 正向选择加速\n    活性位点多样化",
    "🌸 被子植物辐射后\n    TPS-a/b/g 爆发",
]
for i, pt in enumerate(evo_pts):
    add_text(s, pt, Inches(9.95), Inches(1.9) + i * Inches(0.95),
             Inches(3.0), Inches(0.88), font_size=Pt(12), color=TEXT_DARK)

# ─────────────────────────────────────────────
# SLIDE 7  生态功能
# ─────────────────────────────────────────────
s = prs.slides.add_slide(blank)
set_bg(s, BG_WHITE)
add_rect(s, 0, 0, Inches(0.18), H, fill=PRIMARY)
add_rect(s, Inches(0.18), 0, W, Inches(1.15), fill=PRIMARY)
add_text(s, "05  生态功能", Inches(0.5), Inches(0.12),
         Inches(10), Inches(0.7), font_size=Pt(30), bold=True, color=TEXT_LIGHT)
add_text(s, "Ecological Roles of Plant Terpenoids",
         Inches(0.5), Inches(0.72), Inches(10), Inches(0.38),
         font_size=Pt(14), italic=True, color=ACCENT)

eco_cards = [
    ("🛡️ 直接防御",   "抗虫", PRIMARY,
     "• 单萜（如柠檬烯）对昆虫神经毒性\n• 倍半萜影响昆虫取食与产卵\n• 二萜苦味素（如番茄素）驱食\n例：烟草单萜驱蚜虫"),
    ("📡 间接防御",    "HIPVs", ACCENT2,
     "• 植食诱导挥发物（HIPVs）\n• 招募天敌（寄生蜂、捕食螨）\n• 邻近植株预警信号\n例：玉米释放 β-石竹烯"),
    ("🌺 授粉吸引",    "传粉者", ACCENT,
     "• 花香（芳樟醇、橙花叔醇等）\n• 物种特异性气味识别\n• 夜间开花植物富含单萜\n例：玫瑰花香与蜜蜂偏好"),
    ("⚔️ 化感作用",   "竞争", PRIMARY,
     "• 土壤释放萜烯抑制竞争植物\n• 入侵植物化感优势\n• 调控根际微生物群落\n例：艾蒿樟脑抑制邻株"),
]
for i, (title, badge, col, body) in enumerate(eco_cards):
    cx = i % 2
    cy = i // 2
    lx = Inches(0.5) + cx * Inches(6.35)
    ly = Inches(1.3) + cy * Inches(2.95)
    add_rect(s, lx, ly, Inches(6.1), Inches(2.75), fill=LIGHT_GREEN, line=col, line_width=Pt(2))
    add_rect(s, lx, ly, Inches(6.1), Inches(0.58), fill=col)
    add_text(s, title, lx + Inches(0.1), ly + Inches(0.06),
             Inches(4.5), Inches(0.46), font_size=Pt(17), bold=True, color=TEXT_LIGHT)
    add_rect(s, lx + Inches(4.65), ly + Inches(0.1), Inches(1.3), Inches(0.36),
             fill=RGBColor(0xFF,0xFF,0xFF))
    add_text(s, badge, lx + Inches(4.68), ly + Inches(0.12),
             Inches(1.25), Inches(0.32), font_size=Pt(11), color=col, align=PP_ALIGN.CENTER)
    add_text(s, body, lx + Inches(0.15), ly + Inches(0.7),
             Inches(5.8), Inches(1.95), font_size=Pt(12.5), color=TEXT_DARK)

# ─────────────────────────────────────────────
# SLIDE 8  应用前景
# ─────────────────────────────────────────────
s = prs.slides.add_slide(blank)
set_bg(s, BG_WHITE)
add_rect(s, 0, 0, Inches(0.18), H, fill=PRIMARY)
add_rect(s, Inches(0.18), 0, W, Inches(1.15), fill=PRIMARY)
add_text(s, "06  应用前景", Inches(0.5), Inches(0.12),
         Inches(10), Inches(0.7), font_size=Pt(30), bold=True, color=TEXT_LIGHT)
add_text(s, "Applications: Agriculture · Medicine · Synthetic Biology",
         Inches(0.5), Inches(0.72), Inches(10), Inches(0.38),
         font_size=Pt(14), italic=True, color=ACCENT)

app_data = [
    ("💊 医药",
     [("青蒿素", "抗疟疾（倍半萜）", "酵母异源合成获批"),
      ("紫杉醇", "抗肿瘤（二萜）",   "半合成+代谢工程"),
      ("人参皂苷", "抗炎/免疫调节", "细胞工厂生产"),]),
    ("🌾 农业",
     [("Bt萜烯", "生物农药活性增强", "转基因提升防虫"),
      ("HIPVs",  "生物防治信息素",   "推-拉策略种植"),
      ("精油",   "天然防腐/驱虫",   "替代化学农药"),]),
    ("⚗️ 合成生物学",
     [("酵母底盘", "MVA 通路改造",  "倍半萜 > g/L 级产量"),
      ("大肠杆菌", "MEP 通路优化",  "单萜规模化制备"),
      ("蛋白质工程", "定向进化TPS", "产物特异性切换"),]),
]
for i, (sect, items) in enumerate(app_data):
    lx = Inches(0.5) + i * Inches(4.28)
    add_rect(s, lx, Inches(1.3), Inches(4.05), Inches(5.8), fill=LIGHT_GREEN, line=ACCENT, line_width=Pt(1.5))
    add_rect(s, lx, Inches(1.3), Inches(4.05), Inches(0.6), fill=PRIMARY)
    add_text(s, sect, lx + Inches(0.1), Inches(1.33), Inches(3.85), Inches(0.52),
             font_size=Pt(18), bold=True, color=TEXT_LIGHT, align=PP_ALIGN.CENTER)
    for j, (compound, role, note) in enumerate(items):
        ry = Inches(2.08) + j * Inches(1.6)
        add_rect(s, lx + Inches(0.1), ry, Inches(3.85), Inches(1.5),
                 fill=BG_WHITE, line=ACCENT, line_width=Pt(1))
        add_text(s, compound, lx + Inches(0.2), ry + Inches(0.06),
                 Inches(3.6), Inches(0.46), font_size=Pt(15), bold=True, color=PRIMARY)
        add_text(s, role, lx + Inches(0.2), ry + Inches(0.52),
                 Inches(3.6), Inches(0.4), font_size=Pt(12.5), color=TEXT_MID)
        add_text(s, "✓ " + note, lx + Inches(0.2), ry + Inches(0.92),
                 Inches(3.6), Inches(0.45), font_size=Pt(12), color=ACCENT2)

# ─────────────────────────────────────────────
# SLIDE 9  总结 & 展望
# ─────────────────────────────────────────────
s = prs.slides.add_slide(blank)
set_bg(s, BG_WHITE)
add_rect(s, 0, 0, Inches(0.18), H, fill=PRIMARY)

add_circle(s, Inches(12.5), Inches(0.7),  Inches(0.6), LIGHT_GREEN)
add_circle(s, Inches(0.8),  Inches(6.8),  Inches(0.35), LIGHT_GREEN)
add_circle(s, Inches(13.0), Inches(6.5),  Inches(0.45), LIGHT_GREEN)

add_rect(s, Inches(0.18), 0, W, Inches(0.1), fill=ACCENT)

add_text(s, "总结 & 展望", Inches(0.5), Inches(0.3),
         Inches(8), Inches(0.8), font_size=Pt(36), bold=True, color=PRIMARY)
add_text(s, "Summary & Future Perspectives", Inches(0.5), Inches(1.05),
         Inches(8), Inches(0.4), font_size=Pt(15), italic=True, color=ACCENT)

add_rect(s, Inches(0.5), Inches(1.55), Inches(5.5), Inches(0.04), fill=ACCENT)

takeaways = [
    ("萜烯多样性", "植物萜烯合酶是自然界最多产的天然产物合成酶家族"),
    ("结构基础",   "α/β/γ 桶状折叠与金属辅因子协同实现精准碳正离子引导"),
    ("进化驱动",   "基因重复 + 正向选择 = 活性位点快速功能分化"),
    ("生态核心",   "萜烯介导植物与昆虫、微生物及邻株的多重化学对话"),
    ("应用价值",   "合成生物学正将萜烯合酶转化为绿色化工与医药引擎"),
]
for i, (key, val) in enumerate(takeaways):
    ry = Inches(1.75) + i * Inches(0.88)
    add_circle(s, Inches(0.82), ry + Inches(0.28), Inches(0.2), ACCENT)
    add_text(s, key + "：", Inches(1.05), ry, Inches(1.5), Inches(0.5),
             font_size=Pt(14), bold=True, color=PRIMARY)
    add_text(s, val, Inches(2.6), ry, Inches(3.3), Inches(0.5),
             font_size=Pt(13.5), color=TEXT_DARK)

# future box
add_rect(s, Inches(0.5), Inches(6.22), Inches(5.5), Inches(1.08), fill=LIGHT_GREEN, line=PRIMARY, line_width=Pt(1.5))
add_text(s, "🔭 未来挑战：从单酶到通路重构、从模式植物到非模式系统、AI辅助萜烯合酶设计",
         Inches(0.62), Inches(6.32), Inches(5.3), Inches(0.85),
         font_size=Pt(13), color=PRIMARY)

# right decorative panel
add_rect(s, Inches(6.5), Inches(1.3), Inches(6.6), Inches(5.95), fill=PRIMARY)
add_text(s, "🌿", Inches(8.0), Inches(1.8), Inches(3.8), Inches(3.5),
         font_size=Pt(130), align=PP_ALIGN.CENTER, color=TEXT_LIGHT)
add_text(s, "Thank You", Inches(6.6), Inches(5.0), Inches(6.4), Inches(0.85),
         font_size=Pt(38), bold=True, color=TEXT_LIGHT, align=PP_ALIGN.CENTER)
add_text(s, "欢迎提问与讨论", Inches(6.6), Inches(5.85), Inches(6.4), Inches(0.5),
         font_size=Pt(18), color=ACCENT, align=PP_ALIGN.CENTER)

# ─────────────────────────────────────────────
out = "/home/user/weread/植物萜烯合酶.pptx"
prs.save(out)
print("Saved:", out)
