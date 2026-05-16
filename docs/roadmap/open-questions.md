# Open Questions

## Household & Relationship Logic

* How should household logic work for:

  * single persons
  * couples
  * married couples
  * separated parents
  * shared apartments (WG)
  * multigenerational households

* How should children with multiple residences be modeled?

* How should weekly residents (Wochenaufenthalter) be handled?

* Should a person belong to multiple households?

* How should temporary living situations be represented?

* How should partner relationships influence taxes, IPV, EL and social support logic?

* How should deaths, divorces, separations and moving out affect the system graph?

---

## Canton & Municipality Logic

* Which canton-specific systems must be modeled first?

* Which rules differ by:

  * canton
  * municipality
  * insurance region

* How should canton logic updates be maintained over time?

* Should legal rules be versioned historically?

* How should the app communicate uncertainty or incomplete legal accuracy?

* Which calculations are informational only vs legally reliable?

* Which systems are too complex or risky to automate fully?

---

## Financial & Social Systems

* How deeply should social assistance logic go?

* Should the app model:

  * SKOS guidelines
  * EL (Ergänzungsleistungen)
  * IPV
  * Quellensteuer
  * BVG coordination deduction
  * AHV contribution gaps
  * debt enforcement
  * unemployment insurance

* How should debt, payment plans and Betreibungen interact with the life system?

* Should budgeting remain informational or become recommendation-based?

* How should income volatility be represented?

* How should missing documents affect calculations or warnings?

---

## Documents & Legal Reliability

* Which documents should be officially generatable?

* Which documents should only be templates?

* Which generated documents require legal disclaimers?

* How should document expiration and renewal be tracked?

* Which documents are canton-dependent?

* How should the app detect missing critical documents?

* Which documents should never be exportable without encryption?

* Which documents require additional confirmation before deletion?

---

## Security & Privacy

* Which data must always remain local-only?

* Which data categories require encryption at rest?

* Which data require password confirmation before viewing?

* How should encrypted backups work?

* How should password recovery work without cloud infrastructure?

* How should device migration function safely?

* Should biometric unlock be supported later?

* How should sensitive data behave in screenshots, exports and QR codes?

* Which data should never appear in notifications?

* How should session timeout and auto-lock behave?

* What is the disaster recovery strategy if local data becomes corrupted?

---

## Offline-First Architecture

* What are the long-term limitations of localStorage and IndexedDB?

* How should storage quotas and browser limitations be handled?

* How should offline-first sync behave if optional sync is introduced later?

* Should there ever be optional encrypted cloud backup?

* How should large document collections scale locally?

* How should backups be validated for integrity?

* How should schema migrations work over years?

---

## Spinnennetz / Life-System Modeling

* How should the “life web” be visualized calmly without cognitive overload?

* Which domains influence each other most strongly?

* Which life events should trigger cascading updates?

* How should stress, instability or risk be visualized gently?

* Should the system proactively identify missing protections?

* How should the app distinguish between:

  * urgent
  * important
  * informational
  * emotional

* How should the app avoid becoming overwhelming?

* Which relationships between domains are strongest:

  * housing
  * work
  * health
  * insurance
  * family
  * taxes
  * migration status
  * retirement

---

## UX & Emotional Design

* How calm should the interface remain under heavy complexity?

* How much information should be hidden initially?

* How should onboarding work for overwhelmed users?

* How should the app communicate risk without fear?

* Which emotional states are most important to support:

  * anxiety
  * uncertainty
  * shame
  * overload
  * grief
  * financial stress

* How should reminders feel non-invasive?

* How should the system reward progress without gamification?

* How should accessibility function for elderly or cognitively overloaded users?

---

## AI & Assistance

* Should AI features remain fully optional?

* Which AI features are safe locally?

* Which AI-generated recommendations are legally risky?

* Should AI summarize documents locally?

* How should hallucination risks be communicated?

* Should AI ever make financial or legal recommendations directly?

* How should user trust be preserved when uncertainty exists?

---

## Translation & Swiss Language Support

* Should Romansh support be:

  * full
  * partial
  * glossary-based

* Which Swiss-specific legal terms must remain untranslated?

* How should dialect vs standard language be handled?

* Which regions require region-specific wording?

* How should multilingual households work?

---

## Product Scope & Boundaries

* What should explicitly NOT become part of the product?

* Which features create too much legal liability?

* Which systems are too emotionally invasive?

* Which workflows are essential for V1?

* Which ideas belong only in research mode?

* What defines:

  * Alpha
  * Beta
  * V1
  * Long-term vision

* How do we prevent feature creep while preserving system integrity?

* What is the smallest truly useful version of the product?
- Wie soll household logic funktionieren?
- Wie tief sollen Sozialhilfe-Regeln gehen?
- Welche Daten müssen verschlüsselt werden?
- Soll Romansh vollständig oder teilweise unterstützt werden?
- Wie visualisieren wir das Spinnennetz ruhig?
- Welche Dokumente sind offiziell generierbar?
- Welche Daten dürfen niemals exportiert werden?
