/*
 * ═══════════════════════════════════════════════════════════
 *  PROJECTS — edit this file to manage your portfolio.
 *  index.html is never touched for project changes.
 * ═══════════════════════════════════════════════════════════
 *
 *  Fields
 *  ──────
 *  title        Production name
 *  type         Card label          e.g. "Film · VFX"
 *  year         Year string         e.g. "2024"
 *  role         Your IMDB credit    e.g. "Lead FX TD"
 *  studio       VFX / dev studio    e.g. "DNEG"
 *  tools        · separated list    e.g. "Houdini · Nuke"
 *  tags         Array from FILTERS  e.g. ["Film", "Destruction"]
 *  description  Paragraph for the detail panel
 *  vimeo        Vimeo video ID      e.g. "76979871" — leave "" if none
 *  youtube      YouTube video ID    e.g. "dQw4w9WgXcQ" — leave "" if none
 *               youtube takes priority over vimeo if both are set
 *  poster       Image path          e.g. "assets/posters/dune-part-one.jpg"
 *               Recommended: 1280 × 720 px (16:9)
 *               Best source: themoviedb.org → Images → Backdrops
 *
 * ═══════════════════════════════════════════════════════════
 *  FILTERS — shown as pill buttons above the project list.
 *  Add, rename, or remove entries here to change the filter bar.
 *  Use the same strings here that you put in each project's tags[].
 * ═══════════════════════════════════════════════════════════
 */

const FILTERS = [
  { label: 'All',         value: 'all'         },
  { label: 'Games',       value: 'Games'        },
  { label: 'Film',        value: 'Film'         },
  { label: 'TV',          value: 'TV'           },
  { label: 'Destruction', value: 'Destruction'  },
  { label: 'Fluids',      value: 'Fluids'       },
  { label: 'Pyro',        value: 'Pyro'         },

];


/*
 * ═══════════════════════════════════════════════════════════
 *  PROJECT LIST
 *  To add    → copy a { } block, paste, fill fields
 *  To remove → delete that { } block
 *  To reorder → move blocks up or down
 * ═══════════════════════════════════════════════════════════
 */

const PROJECTS = [

  // ── Games ────────────────────────────────────────────────

  {
    title:       "Tomb Raider: Atlantis",
    type:        "Games · Cinematics",
    year:        "2025",
    role:        "Lead VFX Artist",
    studio:      "Eidos-Montréal",
    tools:       "Houdini · Unreal Engine 5 · Niagara",
    featured:    true,
    tags:        ["Games", "Destruction"],
    description: "Lead of the cinematics VFX team at Eidos-Montréal on the latest Tomb Raider entry. Created and integrated effects for cinematics in Unreal Engine 5, heavy on procedural Houdini and Niagara work. Supervised a team of three.",
    vimeo:       "",
    youtube:     "jZj4vWjzGas",
    poster:      "assets/posters/tomb-raider-atlantis.jpg",
  },

  {
    title:       "Fable",
    type:        "Games · Cinematics",
    year:        "2026",
    role:        "Lead VFX Artist",
    studio:      "Eidos-Montréal",
    tools:       "Houdini · ForzaTech · PopcornFX",
    featured:    true,
    tags:        ["Games"],
    description: "Lead of the cinematics VFX team at Eidos-Montréal for Xbox's open-world fantasy reboot. Built and owned the FX pipeline — custom Houdini import/export workflow into ForzaTech. Led hero destruction work while supervising a team of two.",
    youtube:     "w6TJTHdgmts",
    poster:      "assets/posters/fable.jpg",
  },

  // ── 2024 ─────────────────────────────────────────────────

  {
    title:       "Borderlands",
    type:        "Film · VFX",
    year:        "2024",
    role:        "Lead FX TD",
    studio:      "DNEG",
    tools:       "Houdini · Nuke · Houdini Engine",
    tags:        ["Film", "Destruction", "Pyro"],
    description: "Lead FX TD at DNEG on Eli Roth's live-action adaptation. Early-stage cross-site pipeline setup and prototyping — softbody effects and liquid interactions before the production moved studios.",
    vimeo:       "",
    youtube:     "lU_NKNZljoQ",
    poster:      "assets/posters/borderlands.jpg",
  },

  {
    title:       "Kingdom of the Planet of the Apes",
    type:        "Film · VFX",
    year:        "2024",
    role:        "Senior FX TD",
    studio:      "Weta FX",
    tools:       "Houdini · Nuke · Maya",
    awards:      ["VES Award — Outstanding Visual Effects in a Photoreal Feature"],
    tags:        ["Film", "Fluids"],
    description: "Senior FX TD at Weta FX on Wes Ball's continuation of the franchise. Closeup fluid simulations using Weta's proprietary toolset and Houdini.",
    vimeo:       "",
    youtube:     "XtFI7SNtVpY",
    poster:      "assets/posters/kingdom-of-the-planet-of-the-apes.jpg",
  },

  // ── 2023–2024 ────────────────────────────────────────────

  {
    title:       "Monarch: Legacy of Monsters",
    type:        "TV · VFX",
    year:        "2023–2024",
    role:        "Senior FX TD",
    studio:      "Weta FX",
    tools:       "Houdini · Nuke",
    tags:        ["TV", "Destruction"],
    description: "Senior FX TD across three episodes of Apple TV+'s MonsterVerse series. Sequence-level storm and weather systems, and hero water and rain interaction with Kong.",
    vimeo:       "",
    youtube:     "JLHsM4bpfxY",
    poster:      "assets/posters/monarch-legacy-of-monsters.jpg",
  },

  // ── 2023 ─────────────────────────────────────────────────

  {
    title:       "Transformers: Rise of the Beasts",
    type:        "Film · VFX",
    year:        "2023",
    role:        "Senior FX TD",
    studio:      "Weta FX",
    tools:       "Houdini · Nuke · Maya",
    tags:        ["Film", "Destruction"],
    description: "Senior FX TD at Weta FX on the Transformers franchise. Large-scale lava lookdev and simulation, RBD, and volumetric work in Houdini.",
    vimeo:       "",
    youtube:     "itnqEauWQZM",
    poster:      "assets/posters/transformers-rise-of-the-beasts.jpg",
  },

  {
    title:       "The Last of Us",
    type:        "TV · VFX",
    year:        "2023",
    role:        "Senior FX TD",
    studio:      "Weta FX",
    tools:       "Houdini · Nuke",
    awards:      ["Emmy Award — Outstanding Special Visual Effects"],
    tags:        ["TV"],
    description: "FX TD at Weta FX on one episode of HBO's adaptation. RBD and volumetric work on a zombie emergence sequence.",
    vimeo:       "",
    youtube:     "uLtkt8BonwM",
    poster:      "assets/posters/the-last-of-us.jpg",
  },

  // ── 2022 ─────────────────────────────────────────────────

  {
    title:       "Avatar: The Way of Water",
    type:        "Film · VFX",
    year:        "2022",
    role:        "Senior FX TD",
    studio:      "Weta FX",
    tools:       "Houdini · Nuke · Maya",
    featured:    true,
    awards:      ["Academy Award — Best Visual Effects", "BAFTA — Best Special Visual Effects"],
    tags:        ["Film", "Fluids"],
    description: "Senior FX TD at Weta FX on James Cameron's sequel. Large and small-scale fluid simulations using Weta's proprietary toolset and Houdini, troubleshooting shots and setups across the team.",
    vimeo:       "",
    youtube:     "d9MyW72ELq0",
    poster:      "assets/posters/avatar-the-way-of-water.jpg",
  },

  {
    title:       "Bullet Train",
    type:        "Film · VFX",
    year:        "2022",
    role:        "Lead Digital Artist",
    studio:      "DNEG",
    tools:       "Houdini · Nuke",
    tags:        ["Film", "Destruction", "Pyro"],
    description: "Lead Digital Artist at DNEG on David Leitch's action thriller. Destruction, glass breakage, and explosion simulations.",
    vimeo:       "",
    youtube:     "0IOsk2Vlc4o",
    poster:      "assets/posters/bullet-train.jpg",
  },

  // ── 2021 ─────────────────────────────────────────────────

  {
    title:       "Foundation",
    type:        "TV · VFX",
    year:        "2021",
    role:        "Lead FX TD",
    studio:      "DNEG",
    tools:       "Houdini · Nuke",
    tags:        ["TV"],
    description: "Lead FX TD at DNEG on one episode of Apple TV+'s adaptation of Isaac Asimov's Foundation.",
    vimeo:       "",
    youtube:     "X4QYV5GTz7c",
    poster:      "assets/posters/foundation.jpg",
  },

  {
    title:       "The Battle at Lake Changjin",
    type:        "Film · VFX",
    year:        "2021",
    role:        "Lead FX TD",
    studio:      "DNEG",
    tools:       "Houdini · Nuke",
    tags:        ["Film", "Destruction", "Pyro"],
    description: "Lead FX TD at DNEG, heading the Montréal team on one of the highest-grossing Chinese films of all time. Ocean and ship interactions, explosions, and RBD across large-scale battlefield sequences.",
    vimeo:       "",
    youtube:     "gbCUoKya2_U",
    poster:      "assets/posters/battle-at-lake-changjin.jpg",
  },

  {
    title:       "Dune: Part One",
    type:        "Film · VFX",
    year:        "2021",
    role:        "Lead FX TD",
    studio:      "DNEG",
    tools:       "Houdini · Nuke",
    featured:    true,
    awards:      ["Academy Award — Best Visual Effects", "BAFTA — Best Special Visual Effects"],
    tags:        ["Film", "Destruction"],
    description: "Lead FX TD at DNEG on Denis Villeneuve's Oscar-winning adaptation. Led teams of up to 13 artists across lookdev, cross-site setup and support, and hero shots in Houdini.",
    vimeo:       "",
    youtube:     "8g18jFHCLXk",
    poster:      "assets/posters/dune-part-one.jpg",
  },

  {
    title:       "Infinite",
    type:        "Film · VFX",
    year:        "2021",
    role:        "Lead FX TD",
    studio:      "DNEG London",
    tools:       "Houdini · Nuke",
    tags:        ["Film"],
    description: "Lead FX TD at DNEG on Antoine Fuqua's sci-fi action thriller. Cross-site setups and large-scale automation in Houdini.",
    vimeo:       "",
    youtube:     "4q-6epHUKcE",
    poster:      "assets/posters/infinite.jpg",
  },

  {
    title:       "Riverdance: The Animated Adventure",
    type:        "Film · VFX",
    year:        "2021",
    role:        "FX Artist",
    studio:      "Cinesite",
    tools:       "Houdini",
    tags:        ["Film"],
    description: "FX Artist on the animated feature inspired by the world-famous stage show. Contributed effects work supporting the film's vibrant, movement-driven visual language.",
    vimeo:       "",
    youtube:     "4A8X8qd2cRI",
    poster:      "assets/posters/riverdance-animated-adventure.jpg",
  },

  {
    title:       "Extinct",
    type:        "Film · VFX",
    year:        "2021",
    role:        "FX Artist",
    studio:      "Cinesite",
    tools:       "Houdini",
    tags:        ["Film"],
    description: "FX Artist on the animated family adventure. Simulation and effects work contributing to the film's colourful, high-energy sequences.",
    vimeo:       "",
    youtube:     "WPxoOTZIuAQ",
    poster:      "assets/posters/extinct.jpg",
  },

  // ── 2019 ─────────────────────────────────────────────────

  {
    title:       "Togo",
    type:        "Film · VFX",
    year:        "2019",
    role:        "FX TD",
    studio:      "DNEG",
    tools:       "Houdini · Nuke",
    tags:        ["Film", "Fluids"],
    description: "FX TD at DNEG on Disney+'s survival drama set in the Alaskan wilderness. Snow, ice, and blizzard simulation central to the film's brutal, elemental atmosphere.",
    vimeo:       "",
    youtube:     "HMfyueM-ZBQ",
    poster:      "assets/posters/togo.jpg",
  },

  {
    title:       "The Addams Family",
    type:        "Film · VFX",
    year:        "2019",
    role:        "FX Artist",
    studio:      "Cinesite",
    tools:       "Houdini",
    tags:        ["Film"],
    description: "FX Artist on the animated reboot of the iconic franchise. Stylised effects across the film's macabre and comedic sequences.",
    vimeo:       "",
    youtube:     "xFCrR3Uw6Mk",
    poster:      "assets/posters/addams-family.jpg",
  },

  // ── 2017 ─────────────────────────────────────────────────

  {
    title:       "Jumanji: Welcome to the Jungle",
    type:        "Film · VFX",
    year:        "2017",
    role:        "FX Artist",
    studio:      "MPC",
    tools:       "Houdini · Nuke",
    tags:        ["Film"],
    description: "FX Artist at MPC on the blockbuster sequel. Environmental and jungle FX supporting the film's lush, game-world aesthetic.",
    vimeo:       "",
    youtube:     "2QKg5SZ_35I",
    poster:      "assets/posters/jumanji-welcome-to-the-jungle.jpg",
  },

  {
    title:       "Wonder Woman",
    type:        "Film · VFX",
    year:        "2017",
    role:        "FX Artist",
    studio:      "MPC",
    tools:       "Houdini · Nuke",
    tags:        ["Film", "Destruction", "Pyro"],
    description: "FX Artist at MPC on Patty Jenkins' landmark superhero film. Battle simulations and practical FX enhancement across the film's period action sequences.",
    vimeo:       "",
    youtube:     "1Q8fG0TtVAY",
    poster:      "assets/posters/wonder-woman.jpg",
  },

  {
    title:       "Alien: Covenant",
    type:        "Film · VFX",
    year:        "2017",
    role:        "Digital Artist",
    studio:      "MPC",
    tools:       "Houdini · Nuke",
    tags:        ["Film"],
    description: "Digital Artist at MPC on Ridley Scott's continuation of the Alien saga. Atmospheric environment and creature-driven effects work across the film's most visceral sequences.",
    vimeo:       "",
    youtube:     "svnAD0TApb8",
    poster:      "assets/posters/alien-covenant.jpg",
  },

  {
    title:       "American Renegades",
    type:        "Film · VFX",
    year:        "2017",
    role:        "Digital Compositor",
    studio:      "RISE Visual Effects Studios",
    tools:       "Nuke",
    tags:        ["Film"],
    description: "Digital Compositor at RISE on the action thriller. Compositing contributions across underwater and action sequences.",
    vimeo:       "",
    youtube:     "0V-tyw_HkiQ",
    poster:      "assets/posters/american-renegades.jpg",
  },

  {
    title:       "The Mummy",
    type:        "Film · VFX",
    year:        "2017",
    role:        "Visual Effects Artist",
    studio:      "MPC",
    tools:       "Houdini · Nuke",
    tags:        ["Film", "Destruction"],
    description: "Visual Effects Artist at MPC on Universal's monster reboot. Contributed to the film's large-scale sand and destruction sequences.",
    vimeo:       "",
    youtube:     "Mn_QCUxWPyQ",
    poster:      "assets/posters/the-mummy.jpg",
  },

  {
    title:       "Little Bird's Big Adventure",
    type:        "Film · VFX",
    year:        "2017",
    role:        "Digital Compositor",
    studio:      "RISE Visual Effects Studios",
    tools:       "Nuke",
    tags:        ["Film"],
    description: "Digital Compositor at RISE on the animated family adventure.",
    vimeo:       "",
    poster:      "assets/posters/little-birds-big-adventure.jpg",
  },

  {
    title:       "Tomorrow We'll Be Happy",
    type:        "Short · VFX",
    year:        "2017",
    role:        "Assistant VFX Supervisor",
    studio:      "",
    tools:       "Houdini · Nuke",
    tags:        ["Film"],
    description: "Assistant VFX Supervisor on the short film — end-to-end involvement from shoot through final delivery.",
    vimeo:       "",
    poster:      "assets/posters/tomorrow-well-be-happy.jpg",
  },

  {
    title:       "Rewind: Die zweite Chance",
    type:        "Film · VFX",
    year:        "2017",
    role:        "Pipeline TD",
    studio:      "",
    tools:       "Python · Houdini",
    tags:        ["Film"],
    description: "Pipeline TD on the German fantasy feature. Built and maintained production pipeline tools to support the VFX team through delivery.",
    vimeo:       "",
    poster:      "assets/posters/rewind-die-zweite-chance.jpg",
  },

  // ── 2016 ─────────────────────────────────────────────────

  {
    title:       "Doctor Strange",
    type:        "Film · VFX",
    year:        "2016",
    role:        "FX TD",
    studio:      "RISE Visual Effects Studios",
    tools:       "Houdini · Nuke",
    tags:        ["Film", "Destruction"],
    description: "FX TD at RISE on Marvel's sorcerer origin story. Contributed to the film's mind-bending dimensional and environmental FX — one of the MCU's most visually inventive entries.",
    vimeo:       "",
    youtube:     "h7gvFravm4A",
    poster:      "assets/posters/doctor-strange.jpg",
  },



  {
    title:       "Captain America: Civil War",
    type:        "Film · VFX",
    year:        "2016",
    role:        "Stereo Prep Artist",
    studio:      "RISE Visual Effects Studios",
    tools:       "Nuke",
    tags:        ["Film"],
    description: "Stereo Prep Artist at RISE on the Russo Brothers' landmark Marvel ensemble. Stereo conversion contributions to the film's action-packed theatrical release.",
    vimeo:       "",
    youtube:     "43NWzay3W4s",
    poster:      "assets/posters/captain-america-civil-war.jpg",
  },

  // ── 2015 ─────────────────────────────────────────────────

  {
    title:       "Raven the Little Rascal: The Big Race",
    type:        "Film · VFX",
    year:        "2015",
    role:        "Digital Compositor",
    studio:      "Chimney",
    tools:       "Nuke",
    tags:        ["Film"],
    description: "Digital Compositor at Chimney on the animated family film.",
    vimeo:       "",
    poster:      "assets/posters/raven-the-little-rascal.jpg",
  },

  // ── 2014–2015 ────────────────────────────────────────────

  {
    title:       "Binny and the Ghost",
    type:        "TV · VFX",
    year:        "2014–2015",
    role:        "Digital Compositor",
    studio:      "Chimney",
    tools:       "Nuke",
    tags:        ["TV"],
    description: "Digital Compositor at Chimney across four episodes of the Disney Channel series.",
    vimeo:       "",
    poster:      "assets/posters/binny-and-the-ghost.jpg",
  },

  // ── 2014 ─────────────────────────────────────────────────

  {
    title:       "Alter Egon",
    type:        "Short · VFX",
    year:        "2014",
    role:        "Visual Effects Artist",
    studio:      "",
    tools:       "Nuke",
    tags:        ["Film"],
    description: "Visual Effects Artist on the graduation short from ifs Internationale Filmschule Köln (IMDB 7.8).",
    vimeo:       "",
    poster:      "assets/posters/alter-egon.jpg",
  },

  {
    title:       "Asami",
    type:        "Short · VFX",
    year:        "2014",
    role:        "Visual Effects Coordinator",
    studio:      "",
    tools:       "Nuke",
    tags:        ["Film"],
    description: "Visual Effects Coordinator on the short film.",
    vimeo:       "",
    poster:      "assets/posters/asami.jpg",
  },

  // ── 2013 ─────────────────────────────────────────────────

  {
    title:       "Pinocchio",
    type:        "TV · VFX",
    year:        "2013",
    role:        "Junior Digital Compositor",
    studio:      "",
    tools:       "Nuke",
    tags:        ["TV"],
    description: "Junior Digital Compositor across two episodes of the TV mini-series. First professional compositing credit.",
    vimeo:       "",
    poster:      "assets/posters/pinocchio.jpg",
  },

];
