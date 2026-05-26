# A-027 — Calm Navigation & Spatial Architecture Review

Status: Review · 2026-05-26
Scope: Navigation, hierarchy, emotional weight, spatial rhythm

---

## 1. Chapter Weight Analysis

Each chapter carries different mental weight. This matters because a user
opening Maloja Plana should feel they're entering a calm personal space —
not a stack of administrative obligations.

| Chapter            | Mental weight | Emotional temp | Usage frequency | Complexity | Trust relevance |
|--------------------|--------------|----------------|-----------------|------------|-----------------|
| Persönliche Basis  | Light        | Neutral        | Once, then rare | Low        | Foundation      |
| Wohnen & Leben     | Light–Medium | Neutral        | Rare            | Low        | Low             |
| Finanzen & Geld    | **Heavy**    | Stressful      | Monthly         | High       | High            |
| Versicherungen     | **Heavy**    | Administrative | Yearly          | High       | Medium          |
| Ausbildung & Arbeit| Medium       | Neutral–Positive| Rare           | Low        | Medium          |
| Behörden           | **Heavy**    | Anxious        | Situational     | High       | High            |
| Notfall            | Medium       | **Emotionally heavy** | Once      | Low        | **Critical**    |

### Weight distribution problem

The current chapter list presents 3 heavy/administrative chapters in sequence
(Finanzen → Versicherungen → ... → Behörden). Scrolling through the dashboard,
the middle section feels dense and obligation-heavy. The lighter chapters
(Basis, Wohnen, Ausbildung) bookend the experience but don't counterbalance.

### Assessment
- **Basis**: feels welcoming, correct as entry point
- **Wohnen**: calm, personal — good spatial breathing room
- **Finanzen**: the first "heavy" chapter — creates cognitive weight shift
- **Versicherungen**: administrative peak — even with disclosure, 11 primary fields
- **Ausbildung**: surprisingly pleasant — professional/positive identity territory
- **Behörden**: anxiety-inducing by nature — taxes, debt enforcement, court cases
- **Notfall**: emotionally heavy but deeply personal — not administrative

---

## 2. Spatial Architecture Review

### Current dashboard layout (top → bottom)

```
[Welcome + tagline]
[Mountain map with trail icons — interactive]
[Guided start card — hides after 15% progress]
[Progress bar + percentage]
[7 chapter rows — flat list, equal visual weight]
[6 tool buttons — grid]
[Tips section]
```

### What works

- **Mountain map**: Beautiful spatial metaphor. Chapters positioned along a hiking
  trail creates a sense of journey rather than a checklist. The maturity-based
  icon styling (sketch → emerging → complete) gives organic visual feedback.
- **Guided start**: Calm onboarding that reduces initial overwhelm.
- **Progress bar**: Thin (3px), unobtrusive — not gamified.
- **Tool grid**: Compact, clearly secondary to chapters.

### What doesn't work yet

**Problem 1 — Flat chapter list**
All 7 chapters occupy identical visual rows. A freshly opened dashboard shows
7 rows of equal importance — this is the Formularliste feeling. There's no
visual distinction between "Identity" (fundamental, fill once) and "Behörden"
(situational, anxiety-heavy). The list treats them as equal units.

**Problem 2 — No spatial breathing room**
The chapter list has `gap: 0` with border-bottom separators. The visual rhythm
is uniform — row, line, row, line. This creates a clinical list feeling rather
than a spatial landscape of life areas. No grouping, no white space between
domains, no visual hierarchy.

**Problem 3 — Emotional sequence problem**
The chapter order (basis → wohnen → finanzen → versicherungen → ausbildung →
behörden → notfall) means the user scrolls through ALL administrative chapters
before reaching the emotionally meaningful ones. The heaviest chapters
(Finanzen, Versicherungen, Behörden) dominate the middle of the scroll.

**Problem 4 — Tools compete visually**
"WERKZEUGE & FEATURES" header uses the same styling as "DEINE LEBENSBEREICHE".
Tools and chapters have equal visual weight despite very different importance.
Tools are utility; chapters are the core spatial structure.

**Problem 5 — Mobile nav is a flat list**
The slide-out navigation (MobileNav.jsx) presents chapters as an undifferentiated
flat list, followed by 6 tools, then 8 "advanced" tools — 21 navigation items
total with no spatial grouping beyond section headers.

---

## 3. Chapter Hierarchy

### Proposed tier system

**Tier 1 — Core Life Domains** (always visible, primary visual weight)
These are the chapters most users touch first, touch often, or that define
the foundational identity of the person.

| Chapter | Why core |
|---------|----------|
| Persönliche Basis | Identity foundation — everything else references this |
| Wohnen & Leben | Where you live — most immediate life context |
| Finanzen & Geld | Monthly relevance — income, budget, savings |

**Tier 2 — Supporting Domains** (visible, slightly reduced visual weight)
Important but less frequently accessed. Situational rather than ongoing.

| Chapter | Why supporting |
|---------|----------------|
| Versicherungen & Vorsorge | Yearly review cycle, not daily concern |
| Ausbildung & Arbeit | Changes infrequently, professional context |

**Tier 3 — Protective Domains** (visible, distinct visual treatment)
These chapters carry emotional weight. They're important but should feel
like quiet safety nets, not administrative obligations.

| Chapter | Why protective |
|---------|----------------|
| Behörden & Rechtliches | Situational — only relevant when needed |
| Notfall | Deeply personal — fill once, trust it's there |

### Does the current navigation reflect this?

**No.** All 7 chapters are visually identical rows. The dashboard makes no
distinction between daily relevance (Finanzen) and once-in-a-lifetime data
(Notfall). The mobile nav treats chapters as a flat list.

---

## 4. Navigation Density

### Dashboard density

The dashboard currently shows on a standard viewport (768px height):
- 7 chapter rows visible without scrolling past the mountain map
- 6 tool buttons
- Tips section
- Total clickable items visible at once: ~13

This is acceptable but borderline. The issue is not quantity but **uniformity** —
all items look the same, so 13 uniform items feels like more cognitive load
than 13 items with clear visual grouping.

### Mobile nav density

The slide-out nav contains:
- 1 dashboard link
- 7 chapter links
- 6 tool links
- 8 advanced tool links
- **Total: 22 navigation items**

This is too dense. A user opening the menu sees 22 destinations with minimal
visual hierarchy. The "Tools" and "Advanced" section headers help, but the
items within each section are undifferentiated.

### Recommendations

1. **Group chapters visually on dashboard** — introduce subtle spacing or
   visual separators between Core / Supporting / Protective tiers
2. **Reduce mobile nav density** — consider collapsing "Advanced" tools behind
   a disclosure or moving less-used tools to a settings/more screen
3. **Visual weight hierarchy** — Core chapters slightly larger, Supporting
   at current size, Protective with distinct but calmer treatment

---

## 5. Emotional Temperature Balancing

### Current emotional sequence (top → bottom)

```
Basis          → neutral (identity)
Wohnen         → neutral (home)
Finanzen       → STRESSFUL (money)
Versicherungen → ADMINISTRATIVE (insurance)
Ausbildung     → neutral/positive (work, skills)
Behörden       → ANXIOUS (government, legal)
Notfall        → EMOTIONALLY HEAVY (death, emergencies)
```

### Problem: heavy tail

The last three chapters (Behörden, Notfall) end the scroll on an emotionally
heavy note. After scrolling through insurance and government affairs, the
user's last impression is emergency contacts and advance directives. The
dashboard's emotional arc descends from neutral → stressful → anxious → heavy.

### Problem: no breathing room

There's no spatial or visual pause between the stressful middle (Finanzen,
Versicherungen) and the anxious end (Behörden, Notfall). The user scrolls
through continuous administrative weight without a visual moment of calm.

### What would improve this

**Option A — Visual grouping with breathing room**
Insert subtle spacing between chapter groups:
```
[Core: Basis, Wohnen, Finanzen]     — "Dein Alltag"
                                      (visual breath)
[Supporting: Versicherungen, Ausbildung] — "Deine Absicherung"
                                      (visual breath)
[Protective: Behörden, Notfall]      — "Dein Schutz"
```

This doesn't change the order but creates an emotional arc:
daily life → preparedness → safety net.

**Option B — Reorder for emotional balance**
Move Ausbildung after Wohnen (positive interlude before the heavy middle):
```
Basis → Wohnen → Ausbildung → Finanzen → Versicherungen → Behörden → Notfall
```
This front-loads the lighter chapters but breaks the current grouping logic.

**Recommendation: Option A.** Keep the current chapter order (users may have
learned it), but add visual grouping with calm tier labels. This preserves
orientation while reducing the feeling of a continuous administrative list.

---

## Summary of findings

| Area | Current state | Risk | Recommendation |
|------|--------------|------|----------------|
| Chapter weight | 3 of 7 chapters are heavy | App feels administrative | Visual tier grouping |
| Spatial rhythm | Flat list, uniform rows | Formularliste feeling | Add breathing room between groups |
| Chapter hierarchy | No visual distinction | Everything feels equally important | 3-tier visual hierarchy |
| Navigation density | 22 items in mobile nav | Cognitive overload | Collapse advanced tools |
| Emotional temperature | Heavy tail, no breathing room | Last impression is anxiety | Group labels + spacing |

---

## Recommended next steps

These are architecture findings, not implementation tickets. Each would need
product-owner review before implementation.

1. **Dashboard chapter grouping** — add subtle tier labels and spacing between
   Core / Supporting / Protective groups (visual only, no data change)
2. **Mobile nav simplification** — collapse advanced tools behind a "Weitere
   Werkzeuge" disclosure
3. **Emotional arc awareness** — ensure the group labels use warm, reassuring
   language (especially for the Protective tier)
4. **Chapter row visual hierarchy** — slightly differentiate Core vs Supporting
   vs Protective through opacity, size, or spacing

None of these require new features. They're spatial and visual adjustments
to the existing structure.
