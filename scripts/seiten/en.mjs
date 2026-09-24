// ─── Englische Fassung der öffentlichen Erklärseiten ─────────────────────────
//
// Übersetzung des deutschen Originals in `scripts/seiten-inhalt.mjs`.
// 🛑 NICHT von einem Menschen gegengelesen — `freigegeben: false`.
//
// ─── TERMINOLOGIE ───────────────────────────────────────────────────────────
// Englisch ist KEINE Schweizer Amtssprache. Es gibt daher für viele Begriffe
// keine amtliche englische Fassung, nur verbreitete Übersetzungen. Deshalb:
// der deutsche Fachbegriff steht beim ersten Vorkommen in Klammern dabei, damit
// jemand mit dem englischen Text bei einer Amtsstelle weiterkommt. Das ist im
// deutschen Original nicht nötig und daher der einzige bewusste Zusatz.
//
//   Prämienverbilligung  → premium reduction (Prämienverbilligung)
//   Sozialhilfe          → social assistance (Sozialhilfe)
//   Ergänzungsleistungen → supplementary benefits (Ergänzungsleistungen, EL)
//   Steuerfuss           → tax multiplier (Steuerfuss) · einfache Steuer → basic tax
//   Veranlagung          → tax assessment · Verfügung → ruling
//
// 🛑 Struktur und Absatzzahl folgen dem Original eins zu eins — siehe fr.mjs.
// ─────────────────────────────────────────────────────────────────────────────

export const SEITEN = [
  // ─── Pillar ───────────────────────────────────────────────────────────────
  {
    pfad: 'was-steht-mir-zu',
    titel: 'What am I entitled to? An overview for Switzerland',
    beschreibung:
      'In Switzerland, support is spread across the federal government, the cantons and the municipalities — much goes unclaimed simply because people do not know it exists. An overview, topic by topic.',
    brotkrume: 'What am I entitled to?',
    vorspann:
      'In Switzerland, support does not come from one pot but from many small ones — spread across the federal government, the cantons and the municipalities. Who is entitled to what therefore depends heavily on where you live. The most common reason why benefits go unclaimed is not the absence of an entitlement. It is not knowing that they exist.',
    abschnitte: [
      {
        titel: 'Three levels that do not coordinate',
        absaetze: [
          'For many benefits, the <strong>federal government</strong> only sets the framework: it requires that something must exist and leaves the design to the cantons. This applies to premium reduction, for example.',
          'The <strong>cantons</strong> fill in that framework — with their own limits, their own forms, their own deadlines. Two households with identical figures can be treated differently in two cantons. That is not a flaw in the system; that is the system.',
          'In several areas the <strong>municipalities</strong> carry out what the canton decides — in social assistance they are often the office you actually deal with.',
          'In practice this means: there is no general answer to “am I entitled to this?”. There is only the answer for your place of residence, your situation and your year.',
        ],
      },
      {
        titel: 'The topics in detail',
        absaetze: [
          'Three areas affect most people, and with all three it is worth looking even if you believe they do not apply to you:',
        ],
        verweise: ['praemienverbilligung', 'sozialhilfe', 'steuern'],
      },
      {
        titel: 'Why so much goes unclaimed',
        absaetze: [
          'An entitlement nobody knows about is not claimed. On top of that come obstacles that have nothing to do with the entitlement itself: forms in a language you first have to learn. Deadlines that are nowhere listed together. The worry of doing something wrong. And the widespread assumption that support is something for other people.',
          'None of this changes the entitlement. But all of it means it is not claimed.',
        ],
      },
    ],
    faq: [
      {
        frage: 'How do I find out what I am entitled to?',
        antwort:
          'The most reliable route is through the office that actually decides — that is, your own canton or your own municipality. Calculators and overviews such as those linked here give a first indication of whether an application is worthwhile. Only the ruling of the competent office is binding.',
      },
      {
        frage: 'Why is it different depending on the canton?',
        antwort:
          'Because for many benefits the federal government deliberately sets only the framework and the cantons fill it in. They set their own income limits, procedures and deadlines. Moving across a cantonal border can therefore change your entitlement, even if nothing else has changed.',
      },
      {
        frage: 'Do I have to apply everywhere myself?',
        antwort:
          'That varies by benefit and by canton. For some benefits the offices get in touch on their own; for others nothing happens without an application. When in doubt: asking costs nothing, and an application that is never made is never approved.',
      },
      {
        frage: 'What does Maloja Plana cost?',
        antwort:
          'Nothing. Maloja Plana is free and open source. There is no account, no advertising and no tracking; all entries stay on your own device.',
      },
    ],
    quellen: ['bwoKantone', 'bsvEL', 'ahvMerkblatt'],
  },

  // ─── Premium reduction ────────────────────────────────────────────────────
  {
    pfad: 'praemienverbilligung',
    titel: 'Premium reduction: who is entitled',
    beschreibung:
      'Premium reduction (Prämienverbilligung, IPV) is a contribution towards your health insurance premium. The federal government sets the framework, the cantons decide — what that means for you.',
    brotkrume: 'Premium reduction',
    vorspann:
      'Individual premium reduction — in German usually shortened to IPV — is a contribution by the public authorities towards the health insurance premium. It is provided for in the Health Insurance Act (KVG), but the federal government does not administer it: the cantons do, each according to its own rules.',
    abschnitte: [
      {
        titel: 'What the federal government prescribes and what the canton decides',
        absaetze: [
          'The federal government prescribes <em>that</em> there must be a premium reduction and contributes to its funding. Who receives it and how much is decided by the canton.',
          'Specifically, these differ from canton to canton: the income and asset limits, how the relevant income is calculated in the first place, whether you have to apply or are contacted, and the deadlines.',
          'One thing is the same everywhere, however: <strong>where the money goes</strong>. The canton pays the contribution directly to the health insurer, not to the insured person. This is set out in the Health Insurance Act and is not within cantonal discretion.',
          'That is why the sentence “here you get it from an income of X” rarely helps. At best it is true for one canton, and there only for one year.',
        ],
      },
      {
        titel: 'Which figures count',
        absaetze: [
          'As a rule the cantons rely on tax data — and often not on that of the current year but on an earlier assessment that has already become legally binding. This has a consequence that surprises people: someone earning considerably less this year will not see that reflected automatically in many cantons — others only take it into account with the later final settlement.',
          'Several cantons have their own procedure for such cases, in which a substantial change in circumstances is taken into account retrospectively. Whether and how is a matter for the competent office — usually the cantonal social insurance institution (SVA) or the compensation office, but in some cantons the tax administration or the municipality of residence.',
        ],
      },
      {
        titel: 'The most common misconception',
        absaetze: [
          'Many people assume that with an earned income you are not entitled to anything. That is not the case: premium reduction is not a benefit only for people without work. Families with children, people in education and middle-income households qualify in many cantons.',
          'The second common misconception is that an application refused once applies forever. It applies to its year. If income, household or canton of residence change, it is a new question.',
        ],
      },
    ],
    faq: [
      {
        frage: 'Am I entitled to premium reduction?',
        antwort:
          'That depends on your canton of residence, on the relevant income and assets and on the size of your household — all three are weighted differently from canton to canton. There is no limit that applies everywhere. The competent office decides bindingly: usually the cantonal social insurance institution or the compensation office, in some cantons the tax administration or the municipality of residence.',
      },
      {
        frage: 'Do I have to apply?',
        antwort:
          'In some cantons those entitled are contacted automatically; in others the application has to be submitted yourself. Because this is governed cantonally and can change, it is worth asking your own cantonal office — even if you already received something in an earlier year.',
      },
      {
        frage: 'Which income is counted?',
        antwort:
          'As a rule an income derived from the tax assessment, often from an earlier year, and often with cantonal additions and deductions. The gross income of the current month is almost never the relevant figure.',
      },
      {
        frage: 'What if my income has fallen sharply?',
        antwort:
          'Then it is particularly worth asking. Several cantons take a substantial change in economic circumstances into account upon request, even if the underlying assessment still shows a higher income.',
      },
    ],
    quellen: ['priminfo'],
  },

  // ─── Social assistance ────────────────────────────────────────────────────
  {
    pfad: 'sozialhilfe',
    titel: 'Social assistance in Switzerland — an orientation',
    beschreibung:
      'Who decides on social assistance, what it is made up of, and why the SKOS guidelines are not automatically law. An orientation without figures.',
    brotkrume: 'Social assistance',
    vorspann:
      'Social assistance (Sozialhilfe) is the lowest tier of the Swiss safety net — it applies where everything else does not suffice, or no longer does. Responsibility lies not with the federal government but with the cantons and, in many of them, the municipalities.',
    abschnitte: [
      {
        titel: 'Subsidiary means: everything else first',
        absaetze: [
          'Social assistance is <strong>subsidiary</strong>. Before it comes into question, other entitlements are examined: wages, unemployment benefits, pensions, supplementary benefits, premium reduction, maintenance payments, scholarships. Your own assets are also taken into account, although the cantons allow an exempt amount whose level differs.',
          'That is why an application often begins with many questions about quite different benefits. It is not about mistrust, but about the order laid down by law.',
        ],
      },
      {
        titel: 'The SKOS guidelines are recommendations, not law',
        absaetze: [
          'This is the most overlooked point. The guidelines of the Swiss Conference for Social Welfare (SKOS) are <strong>recommendations</strong>. They become binding only in so far as a canton adopts them into its own law — and the cantons do so to varying degrees.',
          'In practice this means: a SKOS calculator gives a good first indication, but it is not a promise. What applies in your case is set out in the cantonal social assistance act and in the ruling of the competent office.',
        ],
      },
      {
        titel: 'What the support typically consists of',
        absaetze: [
          'In most cantons there are three components: a <strong>basic amount</strong> for living costs, <strong>housing costs</strong> within what is locally customary, and <strong>basic medical care</strong>. Situation-related benefits may be added.',
          'We deliberately do not give the amounts here: they differ by canton and household size and are adjusted regularly. A figure on a page like this one would be wrong before long.',
        ],
      },
      {
        titel: 'The right nobody can lose',
        absaetze: [
          'Independently of all of the above, <strong>Article 12 of the Federal Constitution</strong> lays down the right to assistance when in need: persons in distress and incapable of looking after themselves have the right to be helped and assisted, and to receive the means indispensable for leading a life in human dignity.',
          'This right belongs to everyone in Switzerland. It is not the same as social assistance and covers less — but it is the floor below which nobody may fall.',
        ],
      },
    ],
    faq: [
      {
        frage: 'How much social assistance am I entitled to?',
        antwort:
          'That is measured by place of residence, household size, income, assets and the actual housing and health costs — and it follows cantonal law. There is no figure that applies everywhere. Social assistance calculators give a provisional indication; the ruling of the competent office is what is binding.',
      },
      {
        frage: 'Are the SKOS guidelines law?',
        antwort:
          'No. They are recommendations of the Swiss Conference for Social Welfare. They are binding only in so far as a canton has adopted them into its own law. That is why the same situation can be assessed differently from canton to canton.',
      },
      {
        frage: 'Do I have to use up my assets first?',
        antwort:
          'Assets are taken into account, but not in full: the cantons allow an exempt amount that is not touched. How high it is differs by canton and household. The competent office calculates this in the individual case.',
      },
      {
        frage: 'What is the difference from supplementary benefits?',
        antwort:
          'Supplementary benefits (Ergänzungsleistungen, EL) belong to the first pillar and generally come into question when an old-age or disability insurance benefit does not cover subsistence needs. They are governed by federal law and are not social assistance. An entitlement to supplementary benefits takes precedence over social assistance.',
      },
    ],
    quellen: ['skosRechner', 'bsvEL', 'bwoKantone'],
  },

  // ─── Taxes ────────────────────────────────────────────────────────────────
  {
    pfad: 'steuern',
    titel: 'Taxes in Switzerland: federal, cantonal, municipal',
    beschreibung:
      'Why the same salary is taxed very differently depending on where you live — the three levels, the tax multiplier and what that means in practice.',
    brotkrume: 'Taxes',
    vorspann:
      'Anyone paying income tax in Switzerland generally pays it in three places at once: to the federal government, to the canton and to the municipality. Only the first is the same everywhere. The other two are the reason why the same salary leads to noticeably different bills in two places of residence.',
    abschnitte: [
      {
        titel: 'Direct federal tax is the same everywhere',
        absaetze: [
          'Direct federal tax is governed by the Federal Act on Direct Federal Taxation (DBG) and applies the same rate schedule throughout Switzerland. It distinguishes by marital status and household, but not by place of residence.',
          'It is nevertheless levied by the canton — the tax return is the same.',
        ],
      },
      {
        titel: 'Canton and municipality: rate schedule times multiplier',
        absaetze: [
          'At cantonal and municipal level two quantities come together. The <strong>rate schedule</strong> determines how much tax a given taxable income triggers — this gives what is known as the basic tax. The <strong>tax multiplier</strong> is a factor applied to it, usually expressed as a percentage, which the canton and the municipality each set for themselves and can adjust annually.',
          'Depending on canton and denomination, the bill contains further items, for example church tax or a personal tax. They are usually small, but they explain why the total does not exactly match what a plain income calculator produces.',
          'Two municipalities in the same canton therefore have the same rate schedule but each their own multiplier — which can differ. Two cantons differ in both. That is the real lever behind the well-known cantonal comparisons. Some cantons also have particularities, for example municipalities without a municipal tax of their own.',
        ],
      },
      {
        titel: 'What is deducted from income',
        absaetze: [
          'What is taxed is not the salary but the <strong>taxable income</strong> — that is, what remains after the permitted deductions. Depending on the situation these include work-related expenses, contributions to pillar 3a, medical costs above a threshold, deductions for children and childcare, and others.',
          'Which deductions are permitted, and at what level, differs between the federal government and the canton, and between the cantons. This is precisely where most is lost — not through wrong entries, but through deductions nobody entered.',
        ],
      },
    ],
    faq: [
      {
        frage: 'Why do I pay differently from someone in the neighbouring canton?',
        antwort:
          'Because the canton sets the rate schedule and the canton and municipality each decide their own tax multiplier. Only direct federal tax is the same everywhere. The same salary can therefore lead to markedly different bills depending on where you live.',
      },
      {
        frage: 'What is the tax multiplier?',
        antwort:
          'A factor applied to the basic tax, usually expressed as a percentage, which the canton and the municipality each decide for themselves. The rate schedule says how high the basic tax is; the multiplier says with what factor it is levied. The two together give the cantonal and municipal tax.',
      },
      {
        frage: 'Which deductions can I claim?',
        antwort:
          'That depends on your situation and on the canton — common ones are work-related expenses, contributions to pillar 3a, illness and accident costs above a threshold, and deductions for children and childcare. Amounts and conditions differ between the federal government and the canton; the guidance notes of your own canton are what is binding.',
      },
      {
        frage: 'Where can I calculate bindingly?',
        antwort:
          'In the end it is the assessment by the cantonal tax administration that is binding. For a dependable advance calculation, the Federal Tax Administration provides a calculator that takes the federal government, the canton and the municipality into account.',
      },
    ],
    quellen: ['estvRechner'],
  },
];

export const SONDERSEITEN = [
  {
    pfad: 'rechtliches',
    titel: 'Legal notice, data protection and disclaimer',
    beschreibung:
      'Who is behind Maloja Plana, what data arises when these pages are accessed, and what the calculators expressly do not answer for.',
    brotkrume: 'Legal notice',
    vorspann:
      'This page applies to malojaplana.ch and the public explanatory pages. For the application itself, the detailed data protection statement additionally applies, which is in the app under “Data protection and legal” — also without an access code.',
    abschnitte: [
      {
        titel: 'Provider',
        absaetze: [
          'Sophie Stebler / Stebler Studios<br>Basel, Switzerland<br>Email: <a href="mailto:info@malojaplana.ch">info@malojaplana.ch</a>',
          'Maloja Plana — Swiss life folder. An open-source project under AGPL-3.0. The app is free to use; for white-label and other commercial use, a separate licence is available on request.',
          'On the contact address: <a href="https://www.fedlex.admin.ch/eli/cc/1988/223_223_223/de#art_3" rel="noopener">Art. 3 para. 1 lit. s no. 1 UWG</a> requires details of identity and of the contact address «including that of electronic mail». Name, place and email are given; whether a postal address is also required is being clarified. We can be reached by email for any matter, including legal ones.',
        ],
      },
      {
        titel: 'Disclaimer',
        absaetze: [
          'Maloja Plana is an <strong>orientation tool</strong>. The calculators and overviews are based on publicly accessible legal sources and serve personal information only.',
          '<strong>Maloja Plana does not replace legal, tax, insurance or financial advice.</strong>',
          'The provider accepts no warranty for the accuracy, completeness or currency of the calculations, for the suitability of the results for individual decisions, or for damage arising from their use. Only the applicable laws and the competent authorities are decisive.',
        ],
      },
      {
        titel: 'Data protection on these pages',
        absaetze: [
          'The explanatory pages are static HTML. They load <strong>no scripts, no cookies and no third-party resources</strong>; the fonts are on the same server. There is no tracking, no analytics and no advertising.',
          'When the pages are accessed, technical data nevertheless arises at the host — <strong>Infomaniak Network SA</strong>, Rue Eugène-Marziano 25, 1227 Les Acacias / Geneva, with data centres in Switzerland: IP address in the server logs, browser type, operating system and time of access. This is technically necessary for delivery and operational security. Infomaniak acts as a processor in doing so (Art. 9 nDSG). According to the provider, access and error logs are kept for at least 7 days (Infomaniak support FAQ 1926, retrieved on 23 September 2026).',
          'There are no further recipients: no analytics services, no social media embeds, no passing on and no sale of data.',
        ],
      },
      {
        titel: 'Contact by email',
        absaetze: [
          'If you write to <a href="mailto:info@malojaplana.ch">info@malojaplana.ch</a>, we process your address, the content of your message and any attachments in order to reply. The mailbox is hosted by Infomaniak in Switzerland. The correspondence is kept for as long as the enquiry and the usual follow-up questions require, then deleted. It is not passed on to third parties unless required by law.',
        ],
      },
      {
        titel: 'Data in the application',
        absaetze: [
          'What you enter in Maloja Plana stays <strong>on your device</strong> (localStorage and IndexedDB in the browser). There is no account, no login and no transmission to the provider or to third parties. Anyone wanting to delete the data deletes it on the device — there is no second copy anywhere else.',
          'Particularly sensitive information (health, social assistance, beliefs) is likewise stored only locally by the app. The automatic backup copies in the browser are not encrypted.',
          'Because nothing is transmitted, the provider also cannot give information about your entries: it has never seen them. The detailed version with all rights under the Swiss Data Protection Act is in the app under “Data protection and legal”.',
        ],
      },
      {
        titel: 'Intellectual property',
        absaetze: [
          'The code is under <a href="https://www.gnu.org/licenses/agpl-3.0.html" rel="noopener">AGPL-3.0</a> and can be viewed on <a href="https://github.com/steblerstudios/maloja-plana" rel="noopener">GitHub</a>. “Maloja Plana” is a project designation of Sophie Stebler. Dual licensing is available for commercial use — enquiries to the address given above.',
        ],
      },
      {
        titel: 'Applicable law',
        absaetze: [
          'Swiss law applies. The place of jurisdiction is Basel-Stadt, Switzerland.',
        ],
      },
    ],
    faq: [],
    quellen: [],
  },
];
