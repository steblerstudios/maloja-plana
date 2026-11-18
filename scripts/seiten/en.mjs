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
          'For many benefits, the <strong>federal government</strong> only sets the framework: it requires that something must exist and leaves most of the design to the cantons. This applies to premium reduction, for example.',
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
          'The most reliable route is through the office that actually decides — that is, your own canton or your own municipality. Calculators and overviews such as those linked here give a first indication of whether an application is worthwhile. Only the ruling (Verfügung) of the competent office is binding.',
      },
      {
        frage: 'Why is it different depending on the canton?',
        antwort:
          'Because for many benefits the federal government deliberately sets only the framework and the cantons fill it in. They set their own income limits, procedures and deadlines. Moving across a cantonal border can therefore change your entitlement, even if nothing else has changed.',
      },
      {
        frage: 'Do I have to apply everywhere myself?',
        antwort:
          'That varies by benefit and by canton. For some benefits the offices get in touch on their own; for others nothing happens without an application. When in doubt: asking costs nothing, and an application that is never made is never approved. Without a Swiss passport, there is one exception for social assistance: receiving it can affect your residence permit; get advice before applying (more on the Social assistance page).',
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
      'Individual premium reduction — in German usually shortened to IPV — is a contribution by the public authorities towards the health insurance premium. It is provided for in the Health Insurance Act (KVG), but the federal government does not administer it: the cantons do, each according to its own rules, within federal law.',
    abschnitte: [
      {
        titel: 'What the federal government prescribes and what the canton decides',
        absaetze: [
          'The federal government prescribes <em>that</em> there must be a premium reduction, sets minimum requirements for it and contributes to its funding. Within these requirements, the canton decides who receives it and how much.',
          'Three requirements apply everywhere. For lower and middle incomes, the cantons reduce children’s premiums by at least 80 percent and those of young adults in education by at least 50 percent (Art. 65 para. 1bis KVG). Each canton sets the maximum share of disposable income that the premium may make up (Art. 65 para. 1ter KVG). And once entitlement is established, payment must be made so that you do not have to advance the premium (Art. 65 para. 3 KVG).',
          'Specifically, these differ from canton to canton: the income and asset limits, how the relevant income is calculated in the first place, whether you have to apply or are contacted, and the deadlines.',
          'By contrast, what is the same everywhere is <strong>where the money goes</strong>. The canton pays the contribution directly to the health insurer, not to the insured person. This is set out in the Health Insurance Act and is not within cantonal discretion.',
          'That is why the sentence “here you get it from an income of X” rarely helps. At best it is true for one canton, and there only for one year.',
        ],
      },
      {
        titel: 'Which figures count',
        absaetze: [
          'As a rule the cantons rely on tax data — and often not on that of the current year but on an earlier tax assessment (Veranlagung) that has already become legally binding. This has a consequence that surprises people: someone earning considerably less this year will not see that reflected automatically in many cantons — others only take it into account with the later final settlement.',
          'However, the KVG requires the cantons, when reviewing eligibility, to take the most recent income and family circumstances into account, in particular upon request (Art. 65 para. 3 KVG). Your canton sets the details, for example conditions, evidence, deadlines and when it takes effect. This does not automatically give you a right to a reduction. The competent office can tell you — usually the cantonal social insurance institution (Sozialversicherungsanstalt, SVA) or the compensation office (Ausgleichskasse), but in some cantons the tax administration or the municipality of residence.',
        ],
      },
      {
        titel: 'The most common misconception',
        absaetze: [
          'Many people assume that with an earned income you are not entitled to anything. That is not the case: premium reduction is not a benefit only for people without work. Families with children, people in education and middle-income households can qualify in many cantons.',
          'The second common misconception is that a refusal, once given, applies forever. It applies only to its year. If income, household or canton of residence change, it is a new question.',
        ],
      },
    ],
    faq: [
      {
        frage: 'Am I entitled to premium reduction?',
        antwort:
          'That depends on your canton of residence, on the relevant income and assets and on the size of your household — all three are weighted differently from canton to canton. There is no limit that applies everywhere. The competent office decides bindingly: usually the cantonal social insurance institution or the compensation office, in some cantons the tax administration or the municipality of residence. An exception applies in the asylum field: with an N or S permit, the entitlement is suspended while social assistance is received in full or in part (Art. 82a para. 7 AsylG). The same applies with an F permit, unless entry was more than seven years ago (Art. 86 para. 2 AIG, Art. 5b AsylV 2). Different rules may apply to provisionally admitted refugees; the cantonal office will clarify this.',
      },
      {
        frage: 'Do I have to apply?',
        antwort:
          'In some cantons those entitled are contacted automatically; in others you have to submit the application yourself. Because this is governed cantonally and can change, it is worth asking your own cantonal office — even if you already received something in an earlier year.',
      },
      {
        frage: 'Which income is counted?',
        antwort:
          'As a rule an income derived from the tax assessment, often from an earlier year, and often with cantonal adjustments (additions and subtractions). The gross income of the current month is almost never the relevant figure.',
      },
      {
        frage: 'What if my income has fallen sharply?',
        antwort:
          'Then it is particularly worth asking. The KVG requires the cantons, when reviewing eligibility, to take the most recent income and family circumstances into account, in particular upon request (Art. 65 para. 3 KVG). Your canton sets the details, for example conditions, evidence, deadlines and when it takes effect. This does not automatically give you a right to a reduction. Ask the competent office, even if the relevant assessment still shows a higher income.',
      },
    ],
    quellen: ['priminfo', 'fedlexKvgArt65'],
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
          'Social assistance is <strong>subsidiary</strong>. Before it comes into question, other entitlements are examined: wages, unemployment benefits, pensions, supplementary benefits (Ergänzungsleistungen, EL), premium reduction, maintenance payments, education grants (Stipendien). Your own assets are also taken into account, although the cantons allow an exempt amount whose level differs.',
          'That is why an application often begins with many questions about quite different benefits. It is not about mistrust, but about the order laid down by law.',
          'Without a Swiss passport, receiving social assistance can affect your residence. With a residence or short-term permit (B, L), it can be grounds for revoking the permit; with a settlement permit (C), if assistance is received long-term and to a considerable extent (Art. 62 para. 1 let. e and Art. 63 para. 1 let. c AIG). With an F permit, it can make a later application for family reunification or a residence permit more difficult (Art. 85c para. 1 let. c and Art. 84 para. 5 AIG). Partly different rules apply to nationals of EU/EFTA states. Get advice beforehand from a counselling service or the social services office. Whatever your residence status, in an emergency you are entitled to the bare necessities of life (Art. 12 Federal Constitution, further down).',
        ],
      },
      {
        titel: 'The SKOS guidelines are recommendations, not law',
        absaetze: [
          'This is the most overlooked point. The guidelines of the Swiss Conference for Social Welfare (SKOS) are <strong>recommendations</strong>. They become binding only in so far as a canton adopts them into its own law — and the cantons do so to varying degrees.',
          'In practice this means: a SKOS calculator gives a good first indication, but it is not a promise. What applies in your case is set out in the cantonal social assistance act and in the ruling (Verfügung) of the competent office.',
        ],
      },
      {
        titel: 'What the support typically consists of',
        absaetze: [
          'In most cantons there are three components: a <strong>basic needs allowance</strong> (Grundbedarf) for living costs, <strong>housing costs</strong> within what is locally customary, and <strong>basic medical care</strong>. Situation-related benefits may be added.',
          'We deliberately do not give the amounts here: they differ by canton and household size and are adjusted regularly. A figure on a page like this one would be wrong before long.',
        ],
      },
      {
        titel: 'Right to assistance when in need', // Randtitel BV Art. 12 (Fedlex, Fassung 3.3.2024); vorher absolut, vgl. BGE 130 I 71 E. 4.3 und 6
        absaetze: [
          'Independently of all of the above, <strong>Article 12 of the Federal Constitution</strong> lays down the right to assistance when in need: “Persons in need and unable to provide for themselves have the right to assistance and care, and to the financial means required for a decent standard of living.” (English translation on Fedlex, for information only. Only the German, French and Italian texts are legally binding.)',
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
          'Supplementary benefits (Ergänzungsleistungen, EL) belong to the first pillar and generally come into question when a benefit from old-age or disability insurance (AHV/IV) does not cover subsistence needs. They are governed by federal law and are not social assistance. An entitlement to supplementary benefits takes precedence over social assistance.',
      },
      {
        frage: 'Does social assistance affect my residence permit?',
        antwort:
          'Without a Swiss passport, it can. With a B or L permit, receiving it can be grounds for revoking the permit, with a C permit if it is received long-term and to a considerable extent (Art. 62 para. 1 let. e and Art. 63 para. 1 let. c AIG). With an F permit, it can make a later application for family reunification or a residence permit more difficult (Art. 85c para. 1 let. c and Art. 84 para. 5 AIG). With an N or S permit, and with an F permit in the first seven years after entry, premium reduction is also suspended while social assistance is received (Art. 82a para. 7 AsylG, Art. 5b AsylV 2). Get advice beforehand from a counselling service or the social services office.',
      },
      {
        frage: 'Do I have to repay social assistance?',
        antwort:
          'Whether and when is regulated by the canton — for example if an inheritance or larger assets come later. In addition, relatives in direct line, such as parents, children, grandparents and grandchildren, can be obliged to provide support if they live in comfortable circumstances (Art. 328 para. 1 Civil Code). The responsible office will tell you what applies in your case.',
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
          'It is nevertheless levied by the canton — you file one tax return for both.',
          'It is different with <strong>tax at source</strong>: if you work in Switzerland without a settlement permit, for example with a B permit, your employer deducts the tax directly from your wages (Art. 83 DBG). If your gross wage is below a statutory threshold, there is usually no tax return. Further deductions, for example for pillar 3a, are then only possible through a subsequent ordinary assessment; it must be requested by 31 March of the following year, or by deregistration if you leave (Art. 89a para. 3 DBG). Above it, an ordinary assessment is carried out automatically (Art. 89 DBG, Art. 9 QStV).',
        ],
      },
      {
        titel: 'Canton and municipality: rate schedule times multiplier',
        absaetze: [
          'At cantonal and municipal level two quantities come together. The <strong>rate schedule</strong> determines how much tax a given taxable income triggers — this gives what is known as the basic tax (einfache Steuer). The <strong>tax multiplier</strong> (Steuerfuss) is a factor applied to it, usually expressed as a percentage, which the canton and the municipality each set for themselves and can adjust annually.',
          'Depending on canton and denomination, the bill contains further items, for example church tax or a personal tax (Personalsteuer). They are usually small, but they explain why the total does not exactly match what a plain income calculator produces.',
          'Two municipalities in the same canton therefore have the same rate schedule but each their own multiplier — which can differ. Two cantons differ in both. That is the real lever behind the well-known cantonal comparisons. Some cantons also have particularities, for example municipalities without a municipal tax of their own.',
        ],
      },
      {
        titel: 'What is deducted from income',
        absaetze: [
          'What is taxed is not the salary but the <strong>taxable income</strong> — that is, what remains after the permitted deductions. Depending on the situation these include work-related expenses, contributions to pillar 3a, medical costs above a threshold, deductions for children and childcare, and others.',
          'Which deductions are permitted, and at what level, differs between the federal government and the canton, and between the cantons. This is often where money is lost — not through wrong entries, but through deductions nobody entered.',
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
        frage: 'Where can I get a binding calculation?',
        antwort:
          'In the end it is the tax assessment (Veranlagung) by the cantonal tax administration that is binding. For a dependable advance calculation, the Federal Tax Administration provides a calculator that takes the federal government, the canton and the municipality into account.',
      },
    ],
    quellen: ['estvRechner'],
  },

  // ─── Supplementary benefits (14.11.2026) ──────────────────────────────────
  // German terms in brackets where the reader will meet them on forms, as on the
  // other English pages. ELG/ELV/AIG cited by their German abbreviation, like KVG.
  {
    pfad: 'ergaenzungsleistungen',
    titel: 'Supplementary benefits to the AHV and IV',
    beschreibung:
      'When supplementary benefits (Ergänzungsleistungen, EL) come into question, how they are calculated and why they are not social assistance. An overview without figures.',
    brotkrume: 'Supplementary benefits',
    vorspann:
      'Supplementary benefits (Ergänzungsleistungen, EL) help where a pension from the AHV or IV and other income are not enough to cover the bare necessities of life. They are governed by the Federal Act on Supplementary Benefits (ELG) and are a legal entitlement, not a favour. They are paid out by the cantons.',
    abschnitte: [
      {
        titel: 'No AHV or IV benefit, no EL',
        absaetze: [
          'EL require a benefit from the AHV or IV: an AHV old-age or survivors’ pension, including an early one, an IV pension, an IV helplessness allowance or an IV daily allowance that has been paid without interruption for at least six months. In addition, you must be domiciled and habitually resident in Switzerland (Art. 4 ELG).',
          'Foreign nationals must also meet a minimum period of residence: as a rule ten years without interruption in Switzerland, five years for refugees and stateless persons (Art. 5 ELG). It does not apply to nationals of an EU or EFTA state.',
          'Anyone who has no pension only because too few contribution years were reached may still receive EL under certain conditions (Art. 4 ELG). Anyone in need without any AHV or IV benefit turns to the social assistance office of their municipality of residence.',
        ],
      },
      {
        titel: 'The gap between expenses and income',
        absaetze: [
          'The annual EL equals the amount by which <strong>recognised expenses</strong> exceed <strong>countable income</strong> (Art. 9 ELG). Expenses include, for example, an amount for general living costs, rent up to a ceiling and an amount for the health insurance premium (Art. 10 ELG). Income includes pensions, part of earned income and part of assets (Art. 11 ELG).',
          'Only people whose assets are below a statutory threshold are entitled; a home lived in by its owner does not count towards this threshold (Art. 9a ELG). Assets someone gave up without anything in return, for example through a gift, are counted (Art. 11a ELG).',
          'The Confederation sets the amounts for living costs and the rent ceilings, graded by three regions (Art. 10 ELG). We deliberately do not state them here: they are adjusted regularly, and a figure on a page like this would soon be wrong. For people living in a care home, the calculation follows its own rules; the cantons may limit the recognised care home costs.',
        ],
      },
      {
        titel: 'Costs of illness and disability come on top',
        absaetze: [
          'In addition to the annual EL, the canton reimburses documented costs of illness and disability, for example for the dentist, for help, care and support at home, for transport to treatment, for aids, and for the deductible and co-payment of health insurance (Art. 14 ELG). The canton decides which costs exactly and up to what amount.',
          'Even people who receive no annual EL because their income is slightly too high can have such costs reimbursed, to the extent that they exceed the income surplus.',
          'Keep invoices and receipts: only documented costs are reimbursed, and only if you claim them within a statutory period after the invoice date (Art. 15 ELG).',
        ],
      },
      {
        titel: 'Applying: to your canton of residence, and early',
        absaetze: [
          'The canton where you are domiciled is responsible. It decides which office receives the application; usually the cantonal compensation fund or social insurance institution, often via the AHV branch office of your municipality (Art. 21 ELG).',
          'Entitlement generally begins in the month in which the application is submitted (Art. 12 ELG). It can begin earlier only in certain cases, for example if the application is made within six months of a pension ruling or of entering a care home or hospital (Art. 12 para. 2 ELG, Art. 22 ELV). Waiting can therefore cost months.',
          'If you are unsure whether applying is worthwhile, ask the EL office. It examines the entitlement and gives reasons for its decision in a written ruling.',
        ],
      },
      {
        titel: 'EL are not social assistance',
        absaetze: [
          'EL are often confused with social assistance. They are something else: an entitlement under federal law, calculated by rules that apply throughout Switzerland. An entitlement to EL takes precedence over social assistance.',
          'During your lifetime you do not have to repay EL received lawfully. After death they are repaid from the estate, but only from the part that exceeds a statutory allowance; for married couples only from the estate of the second spouse to die (Art. 16a ELG).',
          'Without a Swiss passport and without the nationality of an EU or EFTA state, family reunification is as a rule not approved if you receive annual EL or would receive them because of the reunification (Art. 43 para. 1 let. e and Art. 44 para. 1 let. e AIG). In that case, seek advice beforehand.',
        ],
      },
    ],
    faq: [
      {
        frage: 'Am I entitled to supplementary benefits?',
        antwort:
          'That depends on whether you receive an AHV or IV benefit, where you live, and what your income, expenses and assets look like. There is no limit that applies to everyone, because rent, premium and household also count. The EL calculator of the AHV/IV gives a first orientation; the ruling of the EL office of your canton is binding.',
      },
      {
        frage: 'Are there EL before retirement age?',
        antwort:
          'Yes. Anyone receiving an IV pension or a widow’s, widower’s or orphan’s pension can receive EL before retirement age too. Anyone drawing the AHV pension early also meets the pension requirement (Art. 4 ELG); the reduced pension then counts as income (Art. 11 ELG). Anyone whose unemployment benefits run out at sixty or later may, under certain conditions, receive bridging benefits (Überbrückungsleistungen); these too are applied for at the EL office.',
      },
      {
        frage: 'Does my house or flat count?',
        antwort:
          'For the asset threshold, a home lived in by its owner does not count (Art. 9a ELG). In the calculation itself, its value is taken into account, but with an allowance (Art. 11 ELG). The EL office works out what that means in your case.',
      },
      {
        frage: 'What applies if I have to move into a care home?',
        antwort:
          'Then EL are calculated by their own rules: instead of living costs and rent, the daily care home rate, which the canton may cap, and an amount for personal expenses set by the canton are counted (Art. 10 para. 2 ELG). Apply within six months of moving in; entitlement can then begin from the month of entry, if the other conditions are met (Art. 12 para. 2 ELG).',
      },
      {
        frage: 'Do I have to report changes?',
        antwort:
          'Yes. Every change in personal circumstances and every significant change in financial circumstances must be reported to the EL office immediately, for example a move, a new rent, an inheritance or entering a care home (Art. 24 ELV). Benefits received unlawfully must be repaid.',
      },
      {
        frage: 'What else do EL bring?',
        antwort:
          'People receiving annual EL to the AHV or IV are exempt from the radio and television fee; the exemption is requested from the collection agency with the confirmation from the EL office. The amount for the health insurance premium included in the calculation goes directly to the health insurer. If in doubt, ask the EL office.',
      },
    ],
    quellen: ['ahvMerkblattEL', 'bsvEL'],
  },

  // ─── Unemployment (16.11.2026) ────────────────────────────────────────────
  // German abbreviations as on the other English pages; RAV kept with its English gloss.
  {
    pfad: 'arbeitslosigkeit',
    titel: 'Unemployed: what unemployment insurance pays',
    beschreibung:
      'Who is entitled to unemployment benefits, why registering with the RAV early matters, and what comes after benefits run out. An overview without figures.',
    brotkrume: 'Unemployment',
    vorspann:
      'Unemployment insurance (Arbeitslosenversicherung, ALV) is compulsory for employees: anyone who works pays contributions on their salary, and anyone who loses their job receives, under certain conditions, a daily allowance that replaces part of the salary. It is governed by the Unemployment Insurance Act (AVIG) and applies in the same way throughout Switzerland. The cantons run the regional employment centres (RAV).',
    abschnitte: [
      {
        titel: 'Who is entitled to benefits',
        absaetze: [
          'You are entitled to unemployment benefits if, among other things, you are fully or partly unemployed, have suffered a loss of work that counts, live in Switzerland, have not yet reached reference age and do not receive an AHV old-age pension, have enough contribution time or are exempt from it, are available for placement and meet the control requirements (Art. 8 AVIG). Drawing the AHV pension early therefore ends the entitlement.',
          'Contribution time means: during a certain period before unemployment, you worked long enough as an employee and paid contributions (Art. 13 AVIG). Anyone who was not employed during that period because of education, illness, accident or maternity, or who has to look for work after a separation, divorce or the death of their spouse or registered partner, may be exempt from the contribution requirement (Art. 14 AVIG).',
          'Self-employed people are not insured against unemployment for their self-employed activity; self-employment does not count as contribution time. Without a Swiss passport, being available for placement includes being allowed to work in Switzerland (Art. 15 AVIG). Seek advice on questions about your permit.',
        ],
      },
      {
        titel: 'Register with the RAV, and early',
        absaetze: [
          'Benefits are paid at the earliest from the day you register, not retroactively. Register therefore at the latest on the first day for which you claim benefits with the responsible regional employment centre (RAV), online at arbeit.swiss or in person (Art. 10 and 17 AVIG).',
          'Already during the notice period you must look for a new job and record your efforts. If they are missing or insufficient, there are suspension days, that is, days without benefits (Art. 17 and 30 AVIG).',
          'After registering, benefits generally start only after a few waiting days; how many depends on your previous income and on maintenance obligations towards children. A special waiting period may apply to people exempt from the contribution requirement (Art. 18 AVIG).',
        ],
      },
      {
        titel: 'The daily allowance replaces part of the salary',
        absaetze: [
          'The daily allowance is based on the <strong>insured earnings</strong>, that is, your previous salary up to a statutory ceiling (Art. 23 AVIG). Part of it is paid out; the share is higher if you have maintenance obligations towards children, had a low salary or receive an IV pension above a certain degree of disability (Art. 22 AVIG).',
          'The maximum number of daily allowances depends on contribution time and age; they are paid within a framework period (Art. 9 and 27 AVIG). We deliberately do not state rates or maximum numbers here. Your unemployment fund calculates them bindingly.',
          'As with a salary, contributions are deducted from the allowance, for example for the AHV (Art. 22a AVIG). It is replacement income and is taxed like a salary (Art. 23 let. a DBG).',
        ],
      },
      {
        titel: 'Interim earnings and suitable work',
        absaetze: [
          'If you earn something while unemployed, it counts as interim earnings. If they are lower than your insured earnings, the unemployment fund makes up part of the difference; together you usually receive more than the allowance alone. At least the usual local pay for this work is counted as salary (Art. 24 AVIG).',
          'In principle you must accept any suitable work. A job is not suitable, for example, if it does not meet the usual local and professional conditions, is not appropriate to your age, personal circumstances or health, or requires a very long commute (Art. 16 AVIG).',
          'Anyone who refuses a suitable job or quits their own job without a compelling reason is suspended: depending on the degree of fault, there are no benefits for a period of time (Art. 30 AVIG). Seek advice before quitting yourself.',
        ],
      },
      {
        titel: 'When the benefits run out',
        absaetze: [
          'Your benefits have run out (Aussteuerung) when you have drawn all daily allowances or your framework period has expired without a new one being opened. The public employment service remains open and free of charge (Art. 26 and 27 AVG). Anyone who builds up enough contribution time again can acquire a new entitlement (Art. 9 and 13 AVIG).',
          'After that, social assistance and premium reduction may come into question. Anyone whose benefits run out at sixty or later may, under further conditions, receive bridging benefits; they are applied for at the EL office of the canton of residence (Art. 3, 5 and 19 ÜLG).',
          'With the last allowance, accident insurance through unemployment insurance also ends, after a short extension. Tell your health insurer in good time that it must cover accidents again; it then pays as for illness, with deductible and co-payment (Art. 3 para. 2 UVG, Art. 8 and 10 KVG). Check with the AHV compensation fund whether you must pay contributions as a non-employed person so that no contribution gap arises (Art. 10 AHVG).',
        ],
      },
    ],
    faq: [
      {
        frage: 'Do I get benefits if I quit my job myself?',
        antwort:
          'Yes, but usually only after a suspension: anyone who quits without being assured of a new job receives no benefits for a period of time. This usually counts as serious fault, the most serious level, with 31 to 60 days of suspension. The exception is if staying in the job could not reasonably be expected (Art. 30 AVIG, Art. 44 and 45 AVIV). Seek advice beforehand.',
      },
      {
        frage: 'Can I register before my job ends?',
        antwort:
          'Yes, and it makes sense. You must register at the latest on the first day for which you claim benefits (Art. 17 AVIG). Job search efforts are already required for the notice period.',
      },
      {
        frage: 'Am I insured against accidents while unemployed?',
        antwort:
          'Yes, as long as you receive benefits you are insured against accidents through unemployment insurance (Art. 1a UVG). After that, this cover ends following a short extension. Tell your health insurer that it must cover accidents again; it then pays as for illness, with deductible and co-payment.',
      },
      {
        frage: 'What happens to my pension fund?',
        antwort:
          'When you leave, you must tell the pension fund which vested benefits account the assets should go to until you have a new job (Art. 4 FZG). While you receive benefits, you usually remain covered in occupational pension provision for the risks of death and disability (Art. 2 para. 3 BVG); as a rule you do not save for old age during this time. Anyone who loses their job after their fifty-eighth birthday may, under certain conditions, stay in their pension fund (Art. 47a BVG).',
      },
      {
        frage: 'May I go on holiday while unemployed?',
        antwort:
          'Yes, to a limited extent: you are entitled to control-free days, which you must report to the RAV in advance (Art. 27 AVIV). Your RAV will tell you how many you have.',
      },
    ],
    quellen: ['arbeitSwiss'],
  },

  // ─── AHV and retirement (16.11.2026) ──────────────────────────────────────
  // German abbreviations as on the other English pages; terms follow leaflet 3.04 in English
  // (“reference age”, “early withdrawal”, “deferral”).
  {
    pfad: 'ahv-pensionierung',
    titel: 'AHV and retirement — an orientation',
    beschreibung:
      'How the three pillars fit together, what determines the AHV pension, why you have to apply for it, and what early withdrawal and deferral mean. No figures.',
    brotkrume: 'AHV and retirement',
    vorspann:
      'Old-age and survivors’ insurance (AHV) is the first pillar of Swiss retirement provision and compulsory for everyone who lives or works here. How high the pension will be is decided over many years: by contribution years, earnings, and credits for raising children and caring for relatives. And it does not come by itself: you have to apply for it.',
    abschnitte: [
      {
        titel: 'Three pillars with different tasks',
        absaetze: [
          'Retirement provision rests on three pillars (Art. 111 BV). The <strong>AHV</strong> is the first: its pensions are meant to cover basic living needs appropriately (Art. 112 BV). If they are not enough, supplementary benefits are added (Art. 112a BV).',
          'The <strong>pension fund</strong>, occupational pension provision, is compulsory for employees above a minimum salary. Together with the AHV, it is meant to allow you to maintain your previous standard of living in an appropriate way (Art. 113 BV).',
          'The <strong>third pillar</strong> is voluntary. Payments into pillar 3a can be deducted from taxable income; but only people with earned income can pay in (Art. 7 BVV 3).',
        ],
      },
      {
        titel: 'What determines the pension, and why gaps matter',
        absaetze: [
          'The amount of the AHV pension depends on the countable <strong>contribution years</strong>, <strong>earned income</strong> and <strong>credits for child-raising and care</strong> (Art. 29bis AHVG). You receive a full pension if you always met the contribution obligation from the year after your twentieth birthday until the year before reference age. If a contribution year is missing, the pension is usually reduced, for life (Art. 29ter and 38 AHVG).',
          'People without earned income must also pay contributions, for example while studying, after unemployment benefits have run out or in early retirement (Art. 10 AHVG). For married people without earned income, contributions count as paid if the spouse pays at least twice the minimum contribution (Art. 3 para. 3 AHVG). Missing contributions can only be paid in arrears for a limited period (Art. 16 AHVG).',
          'An extract from your individual account (IK), which you can request from your compensation fund, shows whether you have gaps (Art. 141 AHVV). Older gaps can no longer be closed (Art. 16 AHVG).',
        ],
      },
      {
        titel: 'The pension does not come by itself',
        absaetze: [
          'You must apply for the AHV pension yourself, ideally a few months before reference age. The responsible office is the compensation fund that last received your contributions; if you paid none, the cantonal compensation fund of your canton of residence (leaflet 3.01).',
          'Entitlement begins on the first day of the month after you reach reference age and ends on the person’s death (Art. 21 para. 2 AHVG). The reference age is the same for women and men; transitional rules apply to women of the transitional generation.',
          'Anyone receiving an old-age pension in December also receives a thirteenth old-age pension equal to one twelfth of the annual old-age pension. Survivors’, disability and children’s pensions are still paid only twelve times (leaflet 3.01).',
        ],
      },
      {
        titel: 'Drawing earlier or later',
        absaetze: [
          'The pension can be drawn <strong>early</strong>, in full or in part, at the earliest from your sixty-third birthday, earlier for women of the transitional generation. The early part is reduced for life, including beyond reference age (Art. 40 and 40a AHVG). There are no children’s pensions during early withdrawal. You must apply for early withdrawal at the latest in the month before the desired start; it cannot be done retroactively (leaflet 3.04).',
          'You can also <strong>defer</strong> the pension, in full or in part, by at least one and at most five years; it is then increased for life (Art. 39 AHVG). You declare the deferral at the latest one year after reaching reference age, otherwise the pension is paid without an increase (Art. 55quater AHVV).',
          'Early withdrawal can have consequences that are not obvious: anyone who is unemployed loses entitlement to unemployment benefits by drawing early, and so does anyone receiving bridging benefits (Art. 8 AVIG, Art. 5 para. 3 ÜLG). Seek advice from your compensation fund beforehand.',
        ],
      },
      {
        titel: 'What else you may be entitled to in old age',
        absaetze: [
          'If pensions and assets are not enough for the bare necessities, <strong>supplementary benefits</strong> come into question. They are a legal entitlement, not social assistance.',
          'Anyone who draws the full old-age pension or receives supplementary benefits, lives in Switzerland and permanently depends on other people’s help in daily life, for example to dress, wash or eat, can receive a <strong>helplessness allowance</strong> from the AHV if the helplessness has lasted without interruption for at least six months and there is no entitlement to a helplessness allowance from accident or military insurance. It does not depend on income or assets (Art. 43bis AHVG, leaflet 3.01).',
          'With the <strong>pension fund</strong>, you choose between a pension and a lump sum. By law you can take a quarter as a lump sum, more only if the fund’s regulations allow it; married people need written consent (Art. 37 and 37a BVG). The deadline for choosing is in the regulations; once the lump sum has been paid out, it cannot be undone. Seek advice early.',
        ],
      },
    ],
    faq: [
      {
        frage: 'How high will my AHV pension be?',
        antwort:
          'That depends on your contribution years, your earnings and your credits. As a rule, the pension can only be calculated bindingly when you reach reference age (leaflet 3.01). You can request an advance calculation from your compensation fund.',
      },
      {
        frage: 'What applies to married couples?',
        antwort:
          'Income from the years of marriage is split and credited half to each spouse, among other cases as soon as both are entitled to a pension and on divorce. The two pensions of a married couple are capped together; the cap no longer applies, among other cases, if the joint household was dissolved by a court (leaflet 3.01).',
      },
      {
        frage: 'I have also worked abroad. What now?',
        antwort:
          'Periods abroad are usually missing in the Swiss AHV, but they can lead to a pension in the other country. With insurance periods in an EU or EFTA state, a single application in your country of residence starts the procedure in all states involved (leaflet 3.01).',
      },
      {
        frage: 'Do I get a survivor’s pension as an unmarried partner?',
        antwort:
          'An AHV widow’s or widower’s pension exists only after a marriage or registered partnership and only under further conditions. For couples without marriage or registered partnership, the AHV provides no survivor’s pension. Children may receive an orphan’s pension (Art. 23 and 25 AHVG). At the pension fund, the regulations may provide a benefit for partners.',
      },
      {
        frage: 'Do I still have to pay AHV contributions after retiring?',
        antwort:
          'Anyone who keeps working after reference age keeps paying contributions. Under certain conditions, the pension can then be recalculated. Anyone who draws the pension early and no longer works remains liable to contribute as a non-employed person until reference age (Art. 10 AHVG).',
      },
    ],
    quellen: ['ahvMerkblatt', 'ahvMerkblattFlex'],
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
      'This page applies to malojaplana.ch and the public explanatory pages. For the application itself, the detailed data protection statement additionally applies, which is in the app under “Privacy & Legal” — also without an access code. The published versions are the binding ones: this page for malojaplana.ch and the explanatory pages, the text in the app for the application. The working copies in the public source code (docs/legal) are drafts and a record of provenance, not the binding version. Where language versions differ, only the German version is binding.',
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
          'Maloja Plana is an <strong>orientation tool</strong>. The calculators and overviews are based on publicly accessible legal sources and are intended solely for personal information.',
          '<strong>Maloja Plana does not replace legal, tax, insurance or financial advice.</strong>',
          'The provider accepts no warranty for the accuracy, completeness or currency of the calculations, for the suitability of the results for individual decisions, or for damage arising from their use. Liability for damage caused intentionally or through gross negligence remains reserved. Only the applicable laws and the competent authorities are decisive.',
        ],
      },
      {
        titel: 'Data protection on these pages',
        absaetze: [
          'The explanatory pages are static HTML. They load <strong>no cookies and no third-party resources</strong>; the fonts are on the same server. The home page also loads small scripts of its own from the same server: one redirects old app addresses to /app/, one animates the images of the journey. Anyone who used the app at the main address before receives a third one, once, on their next visit to one of these pages: it empties the app’s old cache in the browser, unregisters itself and reloads the page once; it does not touch your data on the device. The animated health insurance pages (under /krankenkasse/bewegt/) also load scripts from the same server; they draw the moving figures. These scripts set no cookies and send no data. There is no tracking, no analytics and no advertising.',
          'When the pages are accessed, technical data nevertheless arises at the host — <strong>Infomaniak Network SA</strong>, Rue Eugène-Marziano 25, 1227 Les Acacias / Geneva, with data centres in Switzerland: IP address in the server logs, browser type, operating system and time of access. This is technically necessary for delivery and operational security. Infomaniak acts as a processor in doing so (Art. 9 nDSG). According to Infomaniak’s own information, access and error logs are kept for at least 7 days (Infomaniak support FAQ 1926, retrieved on 23 September 2026).',
          'There are no further recipients: no analytics services, no social media embeds, no passing on and no sale of data.',
        ],
      },
      {
        titel: 'Contact by email',
        absaetze: [
          'If you write to <a href="mailto:info@malojaplana.ch">info@malojaplana.ch</a>, we process your address, the content of your message and any attachments in order to reply. The mailbox is hosted by Infomaniak in Switzerland. The correspondence is kept for as long as the enquiry and the usual follow-up questions require, then deleted. It is not passed on to third parties unless required by law.',
          '<strong>Waiting list:</strong> If you write to us to join the waiting list, we keep your message and your email address for that purpose only. We will write to you at most twice: when the beta ends and, if it happens, when Maloja Plana appears in the App Store. After that we delete the message and the address, at the latest on 31 December 2027, even if there is no App Store version by then. On request we delete them without delay; a reply saying “unsubscribe” (or “abmelden”) is enough. We do not use the address for anything else, including a newsletter.',
        ],
      },
      {
        titel: 'Data in the application',
        absaetze: [
          'What you enter in Maloja Plana stays <strong>on your device</strong> (localStorage, IndexedDB and, for shared files, the browser cache). There is no account, no login and no transmission to the provider or to third parties. Anyone wanting to delete the data deletes it on the device — there is no second copy anywhere else.',
          'Particularly sensitive information (health, social assistance, beliefs) is likewise stored only locally by the app. The automatic backup copies in the browser are not encrypted.',
          'Because nothing is transmitted, the provider also cannot give information about your entries: it has never seen them. The detailed version with all rights under the Swiss Data Protection Act is in the app under “Privacy & Legal”.',
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
