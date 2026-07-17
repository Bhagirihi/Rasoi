#!/usr/bin/env python3
"""Generate docs/USER_GUIDE.pdf from structured content. Requires reportlab in docs/.pdf-venv."""
from reportlab.lib import colors
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import cm, inch
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, PageBreak, Table, TableStyle
from reportlab.lib.enums import TA_CENTER, TA_JUSTIFY
from reportlab.pdfgen import canvas
import os

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUTPUT = os.path.join(ROOT, "USER_GUIDE.pdf")
VERSION = "1.0.10"
DOC_DATE = "July 3, 2026"


class NumberedCanvas(canvas.Canvas):
    def __init__(self, *args, **kwargs):
        canvas.Canvas.__init__(self, *args, **kwargs)
        self._saved_page_states = []

    def showPage(self):
        self._saved_page_states.append(dict(self.__dict__))
        self._startPage()

    def save(self):
        n = len(self._saved_page_states)
        for state in self._saved_page_states:
            self.__dict__.update(state)
            self.setFont("Helvetica", 9)
            self.setFillColor(colors.HexColor("#666666"))
            self.drawString(2 * cm, 1.2 * cm, "Rasoi User Guide")
            self.drawRightString(A4[0] - 2 * cm, 1.2 * cm, f"Page {self._pageNumber} of {n}")
            self.setStrokeColor(colors.HexColor("#E85D04"))
            self.line(2 * cm, 1.6 * cm, A4[0] - 2 * cm, 1.6 * cm)
            canvas.Canvas.showPage(self)
        canvas.Canvas.save(self)


def build_styles():
    s = getSampleStyleSheet()
    defs = {
        "RasoiCoverTitle": dict(
            parent=s["Title"], fontSize=32, textColor=colors.HexColor("#E85D04"),
            spaceAfter=20, alignment=TA_CENTER, fontName="Helvetica-Bold",
        ),
        "RasoiCoverSub": dict(
            parent=s["Normal"], fontSize=14, textColor=colors.HexColor("#333333"),
            alignment=TA_CENTER, spaceAfter=8,
        ),
        "RasoiH1": dict(
            parent=s["Heading1"], fontSize=18, textColor=colors.HexColor("#E85D04"),
            spaceBefore=14, spaceAfter=8, fontName="Helvetica-Bold",
        ),
        "RasoiH2": dict(
            parent=s["Heading2"], fontSize=13, textColor=colors.HexColor("#333333"),
            spaceBefore=10, spaceAfter=5, fontName="Helvetica-Bold",
        ),
        "RasoiBody": dict(
            parent=s["Normal"], fontSize=11, leading=15, alignment=TA_JUSTIFY, spaceAfter=6,
        ),
        "RasoiBullet": dict(parent=s["Normal"], fontSize=11, leading=14, leftIndent=18, spaceAfter=3),
        "RasoiNote": dict(parent=s["Normal"], fontSize=10, textColor=colors.HexColor("#555555"), spaceAfter=8),
        "RasoiWarn": dict(parent=s["Normal"], fontSize=10, textColor=colors.HexColor("#B45309"), spaceAfter=8),
        "RasoiTOC": dict(parent=s["Normal"], fontSize=11, leftIndent=12, spaceAfter=3),
        "RasoiPH": dict(
            parent=s["Normal"], fontSize=10, textColor=colors.HexColor("#999999"),
            alignment=TA_CENTER, borderWidth=1, borderColor=colors.HexColor("#CCCCCC"), borderPadding=24,
        ),
    }
    for name, kw in defs.items():
        s.add(ParagraphStyle(name=name, **kw))
    return s


def main():
    styles = build_styles()
    P = lambda t, st="RasoiBody": Paragraph(t, styles[st])
    story = []

    # Cover
    story += [Spacer(1, 2.4 * inch), P("Rasoi", "RasoiCoverTitle"),
              P("Indian Home Cooking Companion", "RasoiCoverSub"),
              Spacer(1, 0.4 * inch), P("Official User Guide", "RasoiCoverSub"),
              Spacer(1, 0.6 * inch), P(f"Version {VERSION}", "RasoiCoverSub"),
              P(DOC_DATE, "RasoiCoverSub"), Spacer(1, 1 * inch),
              P("https://rasoiapplication.in", "RasoiCoverSub"), PageBreak()]

    # TOC
    story.append(P("Table of Contents", "RasoiH1"))
    toc = [
        "Introduction", "Getting Started", "Creating an Account", "Logging In &amp; OTP",
        "Guest Mode", "Onboarding", "Dashboard (Home)", "Managing Pantry",
        "Recipes &amp; Search", "Recipe Detail", "Saved Recipes", "Settings",
        "Notifications", "Permissions", "Rasoi Plus Subscription", "Screen Reference",
        "User Flows", "Tips &amp; Best Practices", "Troubleshooting", "FAQ", "Glossary", "Contact",
    ]
    for i, t in enumerate(toc, 1):
        story.append(P(f"{i}. {t}", "RasoiTOC"))
    story.append(PageBreak())

    def section(num, title, paragraphs, bullets=None, screenshot=None):
        story.append(P(f"{num}. {title}", "RasoiH1"))
        for para in paragraphs:
            story.append(P(para))
        if bullets:
            for b in bullets:
                story.append(P(f"• {b}", "RasoiBullet"))
        if screenshot:
            story.append(P(f"[ Screenshot Placeholder: {screenshot} ]", "RasoiPH"))

    section("1", "Introduction", [
        "Rasoi helps Indian home cooks answer <i>Aaj kya banaye?</i> — what to cook today.",
        "Tell Rasoi what is in your kitchen and it suggests recipes you can make now.",
    ], [
        "4,000+ Indian recipes with search and filters",
        "Pantry-based recipe matching",
        "Personalized meal picks by time of day",
        "Save and share favourite recipes",
        "Rasoi Plus: ad-free with partner shopping",
        "Daily meal reminders",
    ])

    section("2", "Getting Started", [
        "Download from Google Play or install the APK from https://rasoiapplication.in/download.",
        "On Android, enable <b>Install unknown apps</b> when sideloading.",
        "Open Rasoi — you will see the splash screen, then Login if not signed in.",
    ], screenshot="app-launch")

    section("3", "Creating an Account", [
        "Tap <b>Create account</b> on the Login screen.",
        "Enter name, 10-digit Indian mobile number, and email.",
        "Verify the OTP sent to your email.",
        "Accept Terms &amp; Privacy, complete onboarding, and set up your pantry.",
    ], screenshot="register-flow")

    section("4", "Logging In &amp; OTP", [
        "Enter your registered email and request an OTP.",
        "Enter the code from your email — no password is required.",
        "Returning users skip legal consent. Onboarding appears only if incomplete.",
    ], screenshot="login-otp")

    section("5", "Guest Mode", [
        "Tap <b>Explore as Guest</b> on Login.",
        "Accept terms and complete onboarding like a new user.",
        "Upgrade later via <b>Settings → Sign up</b>.",
    ])

    section("6", "Onboarding", [
        "<b>Step 1 — Food preferences:</b> Diet, regional cuisine, favourites.",
        "<b>Step 2 — Notifications:</b> Allow daily meal reminders (optional).",
        "<b>Step 3 — Location:</b> Allow for local recommendations (optional).",
    ], screenshot="onboarding")

    section("7", "Dashboard (Home)", [
        "Your daily kitchen dashboard with greeting, tonight's picks, seasonal rail, recent cooks, and announcements.",
        "Tap any recipe card for full details.",
    ], screenshot="home-dashboard")

    section("8", "Managing Pantry", [
        "Select ingredients you have at home. Changes sync when online.",
        "Recipe match percentages update across Home, Recipes, and Saved.",
        "New users are guided to Pantry first after signup.",
    ], screenshot="pantry")

    section("9", "Recipes &amp; Search", [
        "Browse the catalog, search (2+ characters), use quick filters, and toggle pantry mode.",
    ], screenshot="recipes-search")

    section("10", "Recipe Detail", [
        "View ingredients, steps, pantry match, save, share, mark cooked, shop missing items, and order delivery.",
    ], screenshot="recipe-detail")

    section("11", "Saved Recipes", ["Bookmarked recipes appear in the Saved tab."], screenshot="saved")

    section("12", "Settings", [], [
        "Edit profile and preferences",
        "Rasoi Plus plan management",
        "Feedback, theme, rate app",
        "Log out and delete account",
    ], screenshot="settings")

    section("13", "Notifications", [
        "Up to five daily reminders: breakfast, lunch, snack, dinner, late night.",
        "Tap a notification to open the suggested recipe.",
    ])

    section("14", "Permissions", [
        "Rasoi requests notifications and location only. No camera or photo access.",
    ])

    story.append(PageBreak())
    story.append(P("15. Rasoi Plus Subscription", "RasoiH1"))
    tbl = Table([
        ["Plan", "Price", "Benefits"],
        ["Free", "₹0", "Full recipes, ads, 2 partner shops/month after trial"],
        ["Trial", "3 days", "Partner links unlocked, ads shown"],
        ["Rasoi Plus", "₹49/mo or ₹499/yr", "No ads, unlimited partner shopping"],
    ], colWidths=[3.5 * cm, 3.5 * cm, 9 * cm])
    tbl.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, 0), colors.HexColor("#E85D04")),
        ("TEXTCOLOR", (0, 0), (-1, 0), colors.white),
        ("FONTNAME", (0, 0), (-1, 0), "Helvetica-Bold"),
        ("FONTSIZE", (0, 0), (-1, -1), 10),
        ("GRID", (0, 0), (-1, -1), 0.5, colors.grey),
        ("ROWBACKGROUNDS", (0, 1), (-1, -1), [colors.white, colors.HexColor("#FFF8F0")]),
    ]))
    story += [tbl, Spacer(1, 10), P("[ Screenshot Placeholder: paywall ]", "RasoiPH"),
              P("Subscribe via Settings → Rasoi Plus. Use Restore purchases when reinstalling.", "RasoiNote")]

    story.append(P("16. Screen Reference", "RasoiH1"))
    for name in ["Login", "Register", "Legal Consent", "Onboarding", "Trial Welcome",
                 "Home", "Recipes", "Pantry", "Saved", "Settings", "Recipe Detail", "Paywall"]:
        story += [P(name, "RasoiH2"), P(f"[ Screenshot Placeholder: {name.lower().replace(' ', '-')} ]", "RasoiPH")]

    story.append(P("17. User Flows", "RasoiH1"))
    for flow in [
        "Registration: OTP → Legal → Onboarding → Pantry → Trial (optional) → Home",
        "Login: OTP → Home (or Onboarding if incomplete)",
        "Guest: Legal → Onboarding → Pantry → Home",
        "Cook: Recipe Detail → Mark as cooked",
        "Subscribe: Paywall → Google Play → Rasoi Plus active",
    ]:
        story.append(P(f"• {flow}", "RasoiBullet"))

    story.append(P("18. Tips &amp; Best Practices", "RasoiH1"))
    for tip in [
        "Keep pantry updated for accurate matches",
        "Set diet preferences early",
        "Save recipes for weekly planning",
        "Allow notifications for meal ideas",
        "Mark recipes as cooked",
        "Try the free trial before subscribing",
    ]:
        story.append(P(f"• {tip}", "RasoiBullet"))

    story.append(P("19. Troubleshooting", "RasoiH1"))
    for prob, fix in [
        ("OTP not received", "Check spam; verify email; retry"),
        ("Offline banner", "Check internet; cached recipes may show"),
        ("Partner shop disabled", "Upgrade to Rasoi Plus"),
        ("Trial ended", "Subscribe or use free plan"),
        ("Pantry not saving", "Ensure you are online"),
        ("No push notifications", "Enable in Android Settings; use release APK"),
    ]:
        story.append(P(f"<b>{prob}:</b> {fix}"))

    story.append(P("20. Frequently Asked Questions", "RasoiH1"))
    for q, a in [
        ("Do I need a password?", "No — email OTP only."),
        ("Can I share my pantry?", "Not currently."),
        ("Is Rasoi free?", "Yes, with ads. Rasoi Plus removes ads."),
        ("Offline usage?", "Cached recipes may show; sync needs internet."),
        ("Delete account?", "Settings → Delete account."),
    ]:
        story.append(P(f"<b>Q: {q}</b><br/>A: {a}"))

    story.append(P("21. Glossary", "RasoiH1"))
    story.append(P(
        "<b>Pantry</b> — ingredients at home. "
        "<b>Match %</b> — ingredients you already have. "
        "<b>Meal pick</b> — suggested recipe for current meal time. "
        "<b>Rasoi Plus</b> — premium subscription. "
        "<b>OTP</b> — one-time password by email."
    ))

    story.append(P("22. Contact &amp; Support", "RasoiH1"))
    story.append(P(
        "<b>Website:</b> https://rasoiapplication.in<br/>"
        "<b>Feedback:</b> Settings → Feedback<br/>"
        "<b>Email:</b> [PLACEHOLDER: support@rasoiapplication.in]"
    ))
    story.append(P(f"Document version {VERSION}. Generated {DOC_DATE} from Rasoi source code.", "RasoiNote"))

    doc = SimpleDocTemplate(
        OUTPUT, pagesize=A4,
        rightMargin=2 * cm, leftMargin=2 * cm, topMargin=2 * cm, bottomMargin=2.2 * cm,
    )
    doc.build(story, canvasmaker=NumberedCanvas)
    print(f"Wrote {OUTPUT} ({os.path.getsize(OUTPUT):,} bytes)")


if __name__ == "__main__":
    main()
