// Central Event Configuration & Rich Factual Content for DPL Auction
// STRICT RULE: No invented numerical facts (no fake player counts, team counts, prize money, credits, or dates).

export const event = {
  name: 'DPL AUCTION',
  shortName: 'DPL',
  primaryTagline: 'BUILD YOUR SQUAD. MAKE YOUR MOVE.',
  secondaryTagline: 'WHERE STRATEGY MEETS THE GAME.',
  description: 'The official cricket auction event bringing together franchise teams, tacticians, and sports strategists for high-stakes squad construction under the hammer.',
  edition: 'OFFICIAL CRICKET AUCTION',
  registrationUrl: '#register',
  email: 'contact@dplauction.com',
  social: {
    instagram: 'https://instagram.com',
    linkedin: 'https://linkedin.com',
    twitter: 'https://x.com',
  },
}

// Home Page Intro: What is DPL Auction? (Concise & Engaging)
export const homeIntroCards = [
  {
    num: '01',
    label: 'THE EVENT',
    title: 'Authentic Cricket Auction',
    desc: 'An official competitive cricket player auction where franchise tables deploy tactical blueprints to assemble complete match-winning squads.',
  },
  {
    num: '02',
    label: 'THE OBJECTIVE',
    title: 'Strategic Squad Building',
    desc: 'Test your understanding of player roles, tactical balance, and resource discipline in a high-pressure, live bidding environment.',
  },
  {
    num: '03',
    label: 'THE EXPERIENCE',
    title: 'Real-Time Arena Drama',
    desc: 'Experience the electric tension of the auction room—reading rival motivations, timing your bids, and making decisive calls under the clock.',
  },
]

// 3 Editorial Blocks for About Section
export const aboutSections = [
  {
    num: '01',
    kicker: 'THE CONCEPT',
    headline: 'CRICKET VALUATION & TACTICAL ASSEMBLE',
    lead: 'The DPL Auction is designed around the core mechanics of professional sports auctions—where every decision directly impacts your roster balance.',
    details: 'Franchise tables enter the floor with strategic priorities. Success is not determined by simply bidding on marquee names, but by identifying complementary skill sets, maintaining budget discipline, and ensuring complete role coverage across the squad.',
  },
  {
    num: '02',
    kicker: 'THE EXPERIENCE',
    headline: 'THE ELECTRIC RUSH OF THE LIVE FLOOR',
    lead: 'There are no rehearsals once the auctioneer takes the podium. Every paddle raise is a commitment.',
    details: 'Participants experience authentic room dynamics—gauging rival desperation, managing time constraints, and navigating the psychological battle between aggressive bidding and tactical patience.',
  },
  {
    num: '03',
    kicker: 'THE GAME',
    headline: 'WHERE PREPARATION BECOMES VICTORY',
    lead: 'Championships are conceptualized on the drawing board and finalized under the falling gavel.',
    details: 'From opening bids to the final squad freeze, teams must constantly adapt their contingency plans as bidding wars escalate. When the auction concludes, your strategy is locked in as your official tournament roster.',
  },
]

// About Section Pillar Features
export const aboutPillars = [
  {
    icon: 'target',
    tag: 'DISCIPLINE',
    title: 'Valuation Mastery',
    desc: 'Assess player utility, tactical fit, and long-term roster balance before committing critical resources.',
  },
  {
    icon: 'users',
    tag: 'SYNERGY',
    title: 'War Room Collaboration',
    desc: 'Unify table leadership, debate valuations, and execute coordinated bidding decisions under time pressure.',
  },
  {
    icon: 'trophy',
    tag: 'INTENSITY',
    title: 'Real-Time Floor Dynamics',
    desc: 'Feel the palpable adrenaline of competitive bidding duels where every counter-bid changes the equation.',
  },
  {
    icon: 'shield',
    tag: 'INTEGRITY',
    title: 'Official Auction Protocol',
    desc: 'Structured bidding increments, transparent execution, and verified tournament roster certifications.',
  },
]

// 4 Benefit Blocks for Why Participate
export const whyBenefits = [
  {
    num: '01',
    title: 'STRATEGY',
    subtitle: 'TACTICAL FORESIGHT & DECISION MAKING',
    description: 'Evaluate options, calculate opportunity costs, and formulate agile contingency plans when bidding dynamics shift unexpectedly.',
    tag: 'TACTICAL THINKING',
  },
  {
    num: '02',
    title: 'COMPETITION',
    subtitle: 'HEAD-TO-HEAD AUCTION DUELS',
    description: 'Experience the thrill of going head-to-head against rival franchises in an authentic, high-stakes auction arena.',
    tag: 'ARENA RIVALRY',
  },
  {
    num: '03',
    title: 'TEAM BUILDING',
    subtitle: 'SHAPING A COMPLETE ROSTER',
    description: 'Focus on collective roster harmony. Assemble a squad with balance, depth, and the versatility required for championship success.',
    tag: 'SQUAD COHESION',
  },
  {
    num: '04',
    title: 'EXPERIENCE',
    subtitle: 'IMMERSIVE SPORTS ATMOSPHERE',
    description: 'Take part in an electric sports-event environment where the drama of the falling hammer creates unforgettable moments.',
    tag: 'PREMIUM ATMOSPHERE',
  },
]

// 4 Neutral Schedule Phases (No fake dates or times)
export const schedulePhases = [
  {
    phase: '01',
    status: 'PHASE 01',
    badge: 'REGISTRATION',
    title: 'Team Registration & Check-In',
    desc: 'Official team entry verification, franchise table allocation, and participant credentials distribution.',
    timing: 'Pre-Event Stage',
  },
  {
    phase: '02',
    status: 'PHASE 02',
    badge: 'ORIENTATION',
    title: 'Event Opening & Strategy Briefing',
    desc: 'Official welcome ceremony, comprehensive overview of bidding increments, auction rules, and squad composition guidelines.',
    timing: 'Opening Session',
  },
  {
    phase: '03',
    status: 'PHASE 03',
    badge: 'LIVE AUCTION',
    title: 'The DPL Auction Floor',
    desc: 'The gavel takes center stage. Franchise tables engage in real-time bidding rounds to build their tournament rosters.',
    timing: 'Main Event Floor',
  },
  {
    phase: '04',
    status: 'PHASE 04',
    badge: 'CONCLUSION',
    title: 'Event Conclusion & Squad Lock',
    desc: 'Official roster verification, squad balance evaluations, post-auction review, and closing address.',
    timing: 'Closing Milestone',
  },
]
