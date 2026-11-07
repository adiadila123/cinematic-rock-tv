import type { Localized } from "@/i18n/config";

export const STREAM_SOURCE_URL =
  "https://tv.broadcasting.ro/85c83a80-4f71-4f2d-a8d6-43f676896bcb.html";

/** One real moment in rock's live, amplified, recorded and televised history. */
export interface CultureMoment {
  year: string;
  /** Date and place, e.g. "15 Aug 1965 · Shea Stadium, New York". */
  where: Localized;
  title: Localized;
  body: Localized;
  /** Headline figure; localized when it contains words or number separators. */
  stat: { value: string | Localized; label: Localized };
  /** Who measured or certified the figure, when it comes from a chart or record book. */
  source?: string;
}

export interface CultureChapter {
  id: string;
  title: Localized;
  intro: Localized;
  image: string;
  imageAlt: Localized;
  moments: CultureMoment[];
}

export interface RockGenreDestination {
  id: string;
  name: Localized;
  yearsOrigin: Localized;
  bpmRange: string;
  /** Genres this one grew out of — the branches drawn on the family tree. */
  influences: string[];
  /** Legends in this genre with music videos in the gallery. */
  legendIds: string[];
  harmonicSignature: string;
  gainProfile: string;
  broadcastSlot: Localized;
  headline: Localized;
  editorialEssay: Localized;
  /** The genre's actual history, one entry per paragraph. */
  history: Localized[];
  sonicCharacteristics: Localized[];
  essentialLandmarks: {
    artist: string;
    work: string;
    year: string;
    /** A song from the record, playable in the video gallery. */
    track: string;
    /** Official upload of `track`, verified to play embedded. */
    youtubeId: string;
  }[];
  image: string;
}

export interface LegendVideo {
  /** YouTube video id from the artist's official channel, verified to play embedded. */
  youtubeId: string;
  title: string;
  note: Localized;
}

export interface RockLegendFeature {
  id: string;
  name: string;
  moniker: Localized;
  originCity: Localized;
  activeYears: Localized;
  signatureGear: string;
  rotationAnthem: string;
  editorialPortrait: Localized;
  influenceStatement: Localized;
  image: string;
  imageAlt: Localized;
  /** Wikipedia URL used for structured-data `sameAs`. */
  wikipedia: string;
  kind: "Person" | "MusicGroup";
  videos: LegendVideo[];
}

const OFFICIAL_VIDEO: Localized = { en: "Official video", ro: "Videoclip oficial" };
const OFFICIAL_AUDIO: Localized = { en: "Official audio", ro: "Audio oficial" };

export const CULTURE_CHAPTERS: CultureChapter[] = [
  {
    id: "stage",
    title: { en: "The stage", ro: "Scena" },
    intro: {
      en: "How rock outgrew clubs and theatres and learned to play to stadiums, fields and the whole planet at once.",
      ro: "Cum a depășit rockul cluburile și sălile de teatru și a învățat să cânte pe stadioane, pe câmpuri și pentru întreaga planetă deodată.",
    },
    image: "/images/experience-crowd-stage.webp",
    imageAlt: {
      en: "Concert photograph from behind the drum kit looking out at a crowd backlit by crimson stage lighting",
      ro: "Fotografie de concert din spatele tobelor, spre o mulțime luminată din spate de reflectoare purpurii",
    },
    moments: [
      {
        year: "1965",
        where: { en: "15 Aug 1965 · Shea Stadium, New York", ro: "15 aug. 1965 · Shea Stadium, New York" },
        title: { en: "The first stadium concert", ro: "Primul concert pe stadion" },
        body: {
          en: "The Beatles played to 55,600 people at a baseball stadium — the first major rock concert held in one. The sound went through the ballpark's announcement speakers, and the band could barely hear themselves over the screaming.",
          ro: "The Beatles au cântat pentru 55.600 de oameni pe un stadion de baseball — primul mare concert rock ținut într-un astfel de loc. Sunetul trecea prin difuzoarele de anunțuri ale stadionului, iar trupa abia se auzea din cauza țipetelor.",
        },
        stat: { value: { en: "55,600", ro: "55.600" }, label: { en: "people in the stands", ro: "oameni în tribune" } },
      },
      {
        year: "1969",
        where: { en: "15–18 Aug 1969 · Bethel, New York", ro: "15–18 aug. 1969 · Bethel, New York" },
        title: { en: "Woodstock", ro: "Woodstock" },
        body: {
          en: "Around 400,000 people came to a dairy farm for three days of music. Jimi Hendrix closed the festival on the Monday morning with a distorted, feedback-laden \"Star-Spangled Banner\".",
          ro: "În jur de 400.000 de oameni au venit la o fermă de lapte pentru trei zile de muzică. Jimi Hendrix a încheiat festivalul luni dimineață cu un „Star-Spangled Banner” distorsionat, plin de feedback.",
        },
        stat: { value: { en: "≈400,000", ro: "≈400.000" }, label: { en: "festival-goers", ro: "participanți" } },
      },
      {
        year: "1985",
        where: {
          en: "13 Jul 1985 · Wembley, London & JFK Stadium, Philadelphia",
          ro: "13 iul. 1985 · Wembley, Londra și JFK Stadium, Philadelphia",
        },
        title: { en: "Live Aid", ro: "Live Aid" },
        body: {
          en: "Two simultaneous concerts raised money for famine relief in Ethiopia and were broadcast live around the world. Queen's 21-minute set at Wembley is still often called the greatest live performance in rock.",
          ro: "Două concerte simultane au strâns bani pentru combaterea foametei din Etiopia și au fost transmise live în toată lumea. Recitalul de 21 de minute al trupei Queen pe Wembley e numit și azi adesea cel mai bun concert live din istoria rockului.",
        },
        stat: { value: { en: "1.9 bn", ro: "1,9 mld." }, label: { en: "estimated TV viewers", ro: "telespectatori estimați" } },
      },
    ],
  },
  {
    id: "amplification",
    title: { en: "Amplification", ro: "Amplificarea" },
    intro: {
      en: "Distortion started as a fault. Within twenty-five years it was the sound of the genre — and a matter of world records.",
      ro: "Distorsiunea a început ca o defecțiune. În douăzeci și cinci de ani devenise sunetul genului — și o chestiune de recorduri mondiale.",
    },
    image: "/images/experience-valve-amp.webp",
    imageAlt: {
      en: "Macro photograph of glowing orange vacuum tubes inside a vintage British guitar amplifier",
      ro: "Fotografie macro cu lămpi portocalii incandescente într-un amplificator de chitară britanic vintage",
    },
    moments: [
      {
        year: "1951",
        where: { en: "Mar 1951 · Sun Studio, Memphis", ro: "mart. 1951 · Sun Studio, Memphis" },
        title: { en: "\"Rocket 88\" and the broken amp", ro: "„Rocket 88” și amplificatorul stricat" },
        body: {
          en: "On the way to Sam Phillips's studio, the guitar amplifier of Ike Turner's band was damaged; its torn speaker cone was stuffed with paper and gave the guitar a fuzzy, overdriven tone. The record, credited to Jackie Brenston, is often called the first rock 'n' roll single.",
          ro: "În drum spre studioul lui Sam Phillips, amplificatorul de chitară al trupei lui Ike Turner s-a deteriorat; membrana ruptă a difuzorului a fost umplută cu hârtie și a dat chitarei un sunet murdar, saturat. Piesa, semnată de Jackie Brenston, e numită adesea primul single rock 'n' roll.",
        },
        stat: { value: "#1", label: { en: "on the Billboard R&B chart", ro: "în topul R&B Billboard" } },
        source: "Billboard",
      },
      {
        year: "1965",
        where: { en: "1962–1965 · London & Hollywood", ro: "1962–1965 · Londra și Hollywood" },
        title: { en: "The stack and the fuzz", ro: "Stack-ul și fuzz-ul" },
        body: {
          en: "Jim Marshall built his first amplifier, the JTM45, in 1962; by 1965 Pete Townshend was asking for 100-watt heads stacked on two speaker cabinets. That summer Keith Richards played the riff of \"(I Can't Get No) Satisfaction\" through a Maestro FZ-1 Fuzz-Tone.",
          ro: "Jim Marshall și-a construit primul amplificator, JTM45, în 1962; până în 1965, Pete Townshend cerea capete de 100 de wați puse pe două boxe suprapuse. În vara aceea, Keith Richards a cântat riff-ul din „(I Can't Get No) Satisfaction” printr-o pedală Maestro FZ-1 Fuzz-Tone.",
        },
        stat: { value: { en: "4 weeks", ro: "4 săptămâni" }, label: { en: "at #1 in the US for \"Satisfaction\"", ro: "pe locul 1 în SUA pentru „Satisfaction”" } },
        source: "Billboard Hot 100",
      },
      {
        year: "1976",
        where: { en: "31 May 1976 · The Valley, London", ro: "31 mai 1976 · The Valley, Londra" },
        title: { en: "The loudest concert", ro: "Cel mai zgomotos concert" },
        body: {
          en: "At Charlton Athletic's football ground, The Who were measured at 126 decibels 32 metres from the speakers and entered the Guinness Book of Records as the loudest band in the world, taking the title from Deep Purple's 117 dB in 1972.",
          ro: "Pe stadionul clubului Charlton Athletic, The Who au fost măsurați la 126 de decibeli, la 32 de metri de boxe, și au intrat în Cartea Recordurilor ca cea mai zgomotoasă trupă din lume, preluând titlul de la Deep Purple, care avusese 117 dB în 1972.",
        },
        stat: { value: "126 dB", label: { en: "measured 32 m from the stage", ro: "măsurați la 32 m de scenă" } },
        source: "Guinness World Records",
      },
    ],
  },
  {
    id: "record",
    title: { en: "The record", ro: "Discul" },
    intro: {
      en: "Every change of format changed the music: longer sides made albums, more tracks made the studio an instrument.",
      ro: "Fiecare schimbare de format a schimbat muzica: fețele mai lungi au creat albumul, mai multe piste au transformat studioul într-un instrument.",
    },
    image: "/images/experience-vinyl-archive.webp",
    imageAlt: {
      en: "Overhead photograph of vinyl records, studio master tape reels and microphones under crimson light",
      ro: "Fotografie de sus cu discuri de vinil, role de bandă master și microfoane în lumină purpurie",
    },
    moments: [
      {
        year: "1948",
        where: { en: "Jun 1948 · Columbia Records, New York", ro: "iun. 1948 · Columbia Records, New York" },
        title: { en: "The long-playing record", ro: "Discul long-play" },
        body: {
          en: "Columbia introduced the 12-inch microgroove LP, holding about 22 minutes a side instead of the four minutes of a 78. RCA answered with the 7-inch 45 in 1949 — the two formats rock would grow up on.",
          ro: "Columbia a lansat LP-ul de 12 inci cu microșanț, cu aproximativ 22 de minute pe față în locul celor patru minute ale unui disc de 78 de turații. RCA a răspuns în 1949 cu discul de 7 inci la 45 de turații — cele două formate pe care avea să crească rockul.",
        },
        stat: { value: "33⅓ rpm", label: { en: "≈22 minutes per side", ro: "≈22 de minute pe față" } },
      },
      {
        year: "1967",
        where: { en: "Nov 1966 – Apr 1967 · Abbey Road, London", ro: "nov. 1966 – apr. 1967 · Abbey Road, Londra" },
        title: { en: "Sgt. Pepper on four tracks", ro: "Sgt. Pepper pe patru piste" },
        body: {
          en: "The Beatles and producer George Martin made Sgt. Pepper's Lonely Hearts Club Band on four-track tape machines, bouncing finished tracks together to free up space — and spent around 700 hours in the studio, at a time when albums were often recorded in days.",
          ro: "The Beatles și producătorul George Martin au realizat Sgt. Pepper's Lonely Hearts Club Band pe magnetofoane cu patru piste, comasând pistele terminate ca să elibereze spațiu — și au petrecut în jur de 700 de ore în studio, într-o vreme în care albumele se înregistrau adesea în câteva zile.",
        },
        stat: { value: { en: "4 tracks", ro: "4 piste" }, label: { en: "≈700 hours in the studio", ro: "≈700 de ore în studio" } },
      },
      {
        year: "2022",
        where: { en: "1982 → 2022 · Japan to the US", ro: "1982 → 2022 · din Japonia până în SUA" },
        title: { en: "Vinyl outlives the CD", ro: "Vinilul supraviețuiește CD-ului" },
        body: {
          en: "The compact disc went on sale in Japan in October 1982, with Billy Joel's 52nd Street the first album released on it, and nearly killed vinyl. Forty years later, Americans bought 41 million vinyl albums and 33 million CDs — the first time vinyl had outsold CDs by units since 1987.",
          ro: "CD-ul a intrat în vânzare în Japonia în octombrie 1982, iar 52nd Street de Billy Joel a fost primul album lansat pe el; aproape că a omorât vinilul. Patruzeci de ani mai târziu, americanii au cumpărat 41 de milioane de albume pe vinil și 33 de milioane de CD-uri — prima dată din 1987 când vinilul a depășit CD-ul la numărul de unități.",
        },
        stat: { value: { en: "41 M", ro: "41 mil." }, label: { en: "vinyl albums sold in the US in 2022", ro: "albume pe vinil vândute în SUA în 2022" } },
        source: "RIAA",
      },
    ],
  },
  {
    id: "screen",
    title: { en: "The screen", ro: "Ecranul" },
    intro: {
      en: "Rock reached most of its audience through a television set long before it reached a stadium. ROCK TV is the latest chapter of that story.",
      ro: "Rockul și-a găsit cea mai mare parte a publicului printr-un televizor, cu mult înainte să ajungă pe stadioane. ROCK TV e cel mai nou capitol al acestei povești.",
    },
    image: "/images/hero-arena-stage.webp",
    imageAlt: {
      en: "Wide view of an arena stage under red and white lights, seen from the crowd",
      ro: "Vedere largă a unei scene de arenă în lumini roșii și albe, văzută din mulțime",
    },
    moments: [
      {
        year: "1956",
        where: { en: "9 Sep 1956 · The Ed Sullivan Show, CBS", ro: "9 sept. 1956 · The Ed Sullivan Show, CBS" },
        title: { en: "Elvis on Ed Sullivan", ro: "Elvis la Ed Sullivan" },
        body: {
          en: "Elvis Presley's first appearance on America's biggest variety show was watched by about 60 million people — 82.6 percent of the US television audience that night.",
          ro: "Prima apariție a lui Elvis Presley în cea mai mare emisiune de varietăți din America a fost urmărită de aproximativ 60 de milioane de oameni — 82,6% din publicul TV american din acea seară.",
        },
        stat: { value: { en: "82.6%", ro: "82,6%" }, label: { en: "of US viewers that night", ro: "din telespectatorii americani" } },
        source: "Nielsen",
      },
      {
        year: "1964",
        where: { en: "9 Feb 1964 · The Ed Sullivan Show, CBS", ro: "9 feb. 1964 · The Ed Sullivan Show, CBS" },
        title: { en: "The Beatles arrive", ro: "Sosesc The Beatles" },
        body: {
          en: "Two days after landing in New York, The Beatles opened with \"All My Loving\" in front of an estimated 73 million viewers — the moment usually taken as the start of the British Invasion in America.",
          ro: "La două zile după ce au aterizat la New York, The Beatles au deschis cu „All My Loving” în fața a aproximativ 73 de milioane de telespectatori — momentul considerat de obicei începutul Invaziei Britanice în America.",
        },
        stat: { value: { en: "73 M", ro: "73 mil." }, label: { en: "viewers", ro: "telespectatori" } },
        source: "Nielsen",
      },
      {
        year: "1981",
        where: { en: "1 Aug 1981, 12:01 a.m. · MTV, New York", ro: "1 aug. 1981, ora 00:01 · MTV, New York" },
        title: { en: "Music television goes 24/7", ro: "Televiziunea muzicală devine 24/7" },
        body: {
          en: "MTV launched with The Buggles' \"Video Killed the Radio Star\" and turned the music video into rock's main stage for the next decade. ROCK TV carries on the same idea: a channel that never goes off air.",
          ro: "MTV s-a lansat cu „Video Killed the Radio Star” de The Buggles și a transformat videoclipul în scena principală a rockului pentru deceniul următor. ROCK TV duce mai departe aceeași idee: un canal care nu iese niciodată din emisie.",
        },
        stat: { value: "24/7", label: { en: "music on television", ro: "muzică la televizor" } },
      },
    ],
  },
];

export const ROCK_GENRES: RockGenreDestination[] = [
  {
    id: "classic-rock",
    name: { en: "Classic Rock", ro: "Rock clasic" },
    yearsOrigin: { en: "1965 — 1979", ro: "1965 — 1979" },
    bpmRange: "92 — 136 BPM",
    influences: [],
    legendIds: ["led-zeppelin", "jimi-hendrix", "queen"],
    harmonicSignature: "Blues Pentatonic · Mixolydian Riffing",
    gainProfile: "Overdriven Plexi Stack · Non-Master Volume",
    broadcastSlot: { en: "DAILY ROTATION · HERITAGE", ro: "ROTAȚIE ZILNICĂ · MOȘTENIRE" },
    headline: {
      en: "The foundation of electric amplification",
      ro: "Fundația amplificării electrice",
    },
    editorialEssay: {
      en: "Born when electrified Chicago blues collided with British invasion audacity and FM album radio, Classic Rock turned the three-minute single into sprawling studio monuments and stadium-shaking live rituals.",
      ro: "Născut când bluesul electric din Chicago s-a ciocnit de îndrăzneala invaziei britanice și de radioul FM orientat pe albume, rockul clasic a transformat single-ul de trei minute în monumente de studio și ritualuri live care zguduiau stadioanele.",
    },
    history: [
      {
        en: "Classic rock grew out of the mid-1960s meeting of American blues and rock 'n' roll with the British Invasion. The Beatles, The Rolling Stones, The Kinks and The Who took Chuck Berry and Muddy Waters back across the Atlantic — louder, and with bigger ambitions.",
        ro: "Rockul clasic s-a născut la mijlocul anilor '60, din întâlnirea bluesului și a rock 'n' roll-ului american cu Invazia Britanică. The Beatles, The Rolling Stones, The Kinks și The Who au dus muzica lui Chuck Berry și Muddy Waters înapoi peste Atlantic — mai tare și cu ambiții mai mari.",
      },
      {
        en: "Between 1965 and 1967 the album replaced the single as rock's main form. Bob Dylan went electric at the 1965 Newport Folk Festival, and Revolver (1966) and Sgt. Pepper's Lonely Hearts Club Band (1967) turned the studio into an instrument, while Jimi Hendrix, Cream and The Doors pushed amplification and improvisation further.",
        ro: "Între 1965 și 1967, albumul a luat locul single-ului ca formă principală a rockului. Bob Dylan a cântat electric la Newport Folk Festival în 1965, iar Revolver (1966) și Sgt. Pepper's Lonely Hearts Club Band (1967) au transformat studioul într-un instrument, în timp ce Jimi Hendrix, Cream și The Doors au dus amplificarea și improvizația mai departe.",
      },
      {
        en: "The Monterey Pop (1967) and Woodstock (1969) festivals and the rise of FM album radio in the US built a mass audience. In the 1970s Led Zeppelin, Pink Floyd, Queen and Fleetwood Mac filled stadiums — the scale punk would rebel against at the end of the decade.",
        ro: "Festivalurile Monterey Pop (1967) și Woodstock (1969), împreună cu ascensiunea radioului FM orientat pe albume din SUA, au creat un public de masă. În anii '70, Led Zeppelin, Pink Floyd, Queen și Fleetwood Mac umpleau stadioanele — exact amploarea împotriva căreia avea să se revolte punkul la sfârșitul deceniului.",
      },
    ],
    sonicCharacteristics: [
      {
        en: "Twin-lead guitar harmonies and open-chord tube crunch",
        ro: "Armonii de chitară twin-lead și crunch de lămpi pe acorduri deschise",
      },
      {
        en: "Hammond B3 organ swells locked to big, roomy acoustic drums",
        ro: "Orgă Hammond B3 ancorată în tobe acustice mari, cu multă cameră",
      },
      {
        en: "Extended live improvisations and analog tape saturation",
        ro: "Improvizații live extinse și saturație analogică de bandă",
      },
    ],
    essentialLandmarks: [
      { artist: "Led Zeppelin", work: "Physical Graffiti", year: "1975", track: "Kashmir", youtubeId: "ww9484EM2OQ" },
      { artist: "The Rolling Stones", work: "Exile on Main St.", year: "1972", track: "Tumbling Dice", youtubeId: "EMoi_m2G6XU" },
      { artist: "Deep Purple", work: "Machine Head", year: "1972", track: "Smoke on the Water", youtubeId: "Q2FzZSBD5LE" },
    ],
    image: "/images/legend-electric-voodoo.webp",
  },
  {
    id: "alternative-rock",
    name: { en: "Alternative Rock", ro: "Rock alternativ" },
    yearsOrigin: { en: "1980 — 1998", ro: "1980 — 1998" },
    bpmRange: "105 — 148 BPM",
    influences: ["punk-rock"],
    legendIds: ["nirvana"],
    harmonicSignature: "Dissonant Open Strings · Quiet-Loud-Quiet Dynamics",
    gainProfile: "Fuzz Box Into Clean Twin · Chorus Modulation",
    broadcastSlot: { en: "PRIME ROTATION · SUBCULTURE", ro: "ROTAȚIE PRIME TIME · SUBCULTURĂ" },
    headline: {
      en: "Left-of-the-dial conviction that rewrote the mainstream",
      ro: "Convingerea underground care a rescris mainstreamul",
    },
    editorialEssay: {
      en: "Forged on college radio, independent pressing plants and late-night TV, Alternative Rock stripped away arena artifice in favour of stark emotional honesty, jagged feedback and seismic dynamic shifts.",
      ro: "Forjat la radiourile studențești, în fabrici de discuri independente și în emisiunile TV de noapte, rockul alternativ a renunțat la artificiile arenelor în favoarea sincerității emoționale crude, a feedback-ului tăios și a schimbărilor dinamice seismice.",
    },
    history: [
      {
        en: "Alternative rock grew out of post-punk and the independent labels of the early 1980s. US college radio spread it, playing R.E.M., The Replacements, Hüsker Dü and Sonic Youth when commercial stations would not; R.E.M.'s Murmur (1983) was its first big critical landmark.",
        ro: "Rockul alternativ a crescut din post-punk și din casele de discuri independente de la începutul anilor '80. Radiourile studențești din SUA l-au răspândit, difuzând R.E.M., The Replacements, Hüsker Dü și Sonic Youth atunci când posturile comerciale nu o făceau; Murmur de R.E.M. (1983) a fost primul său mare reper apreciat de critică.",
      },
      {
        en: "In Britain the same independent spirit produced The Smiths and The Cure, while the quiet-loud dynamics of Pixies' Doolittle (1989) shaped the decade that followed.",
        ro: "În Marea Britanie, același spirit independent a dat The Smiths și The Cure, iar dinamica liniștit-zgomotos de pe Doolittle de Pixies (1989) a modelat deceniul următor.",
      },
      {
        en: "Nirvana's Nevermind (1991) brought the scene into the mainstream. The Lollapalooza festival, launched in 1991, and MTV turned \"alternative\" into a radio format, with The Smashing Pumpkins, Radiohead and Red Hot Chili Peppers among its biggest names.",
        ro: "Nevermind de Nirvana (1991) a adus scena în mainstream. Festivalul Lollapalooza, lansat în 1991, și MTV au transformat „alternativul” într-un format radio, cu The Smashing Pumpkins, Radiohead și Red Hot Chili Peppers printre cele mai mari nume.",
      },
    ],
    sonicCharacteristics: [
      {
        en: "Whisper-to-scream verse-chorus explosions pioneered by Pixies and Sonic Youth",
        ro: "Explozii strofă-refren de la șoaptă la urlet, inițiate de Pixies și Sonic Youth",
      },
      {
        en: "Alternate tunings blending chiming arpeggios with abrasive noise",
        ro: "Acordaje alternative care îmbină arpegii cristaline cu zgomot abraziv",
      },
      {
        en: "Introspective lyrics grounded in post-industrial alienation",
        ro: "Versuri introspective, ancorate în alienarea post-industrială",
      },
    ],
    essentialLandmarks: [
      { artist: "R.E.M.", work: "Murmur", year: "1983", track: "Radio Free Europe", youtubeId: "Ac0oaXhz1u8" },
      { artist: "Pixies", work: "Doolittle", year: "1989", track: "Here Comes Your Man", youtubeId: "tPgf_btTFlc" },
      { artist: "The Smashing Pumpkins", work: "Siamese Dream", year: "1993", track: "Today", youtubeId: "xmUZ6nCFNoU" },
    ],
    image: "/images/experience-crowd-stage.webp",
  },
  {
    id: "hard-rock",
    name: { en: "Hard Rock", ro: "Hard rock" },
    yearsOrigin: { en: "1968 — PRESENT", ro: "1968 — PREZENT" },
    bpmRange: "110 — 142 BPM",
    influences: ["classic-rock"],
    legendIds: ["ac-dc", "led-zeppelin"],
    harmonicSignature: "Power-Chord Syncopation · Dorian Drive",
    gainProfile: "High-Wattage British Valve Full Stacks",
    broadcastSlot: { en: "HEAVY ROTATION · HIGH VOLTAGE", ro: "ROTAȚIE INTENSĂ · ÎNALTĂ TENSIUNE" },
    headline: {
      en: "Riff precision and stadium-scale velocity",
      ro: "Precizia riff-ului și viteză de stadion",
    },
    editorialEssay: {
      en: "Hard Rock distills the electric guitar down to its most visceral weapon: the granite-solid riff. Driven by lockstep rhythm sections and commanding vocal rasp, it turns every chorus into a fist-in-the-air anthem.",
      ro: "Hard rockul reduce chitara electrică la cea mai viscerală armă a ei: riff-ul solid ca granitul. Purtat de secțiuni ritmice perfect sincronizate și de voci răgușite și dominante, transformă fiecare refren într-un imn cu pumnul ridicat.",
    },
    history: [
      {
        en: "Hard rock took the blues-rock of Cream, The Who and The Jimi Hendrix Experience and turned it up: louder amplifiers, distorted power chords and songs built around the riff. Steppenwolf's \"Born to Be Wild\" (1968) and Led Zeppelin's 1969 debut set the template.",
        ro: "Hard rockul a preluat blues-rockul formațiilor Cream, The Who și The Jimi Hendrix Experience și l-a dat mai tare: amplificatoare mai puternice, power chords distorsionate și piese construite în jurul riff-ului. „Born to Be Wild” de Steppenwolf (1968) și debutul Led Zeppelin din 1969 au fixat modelul.",
      },
      {
        en: "In the 1970s Deep Purple, Aerosmith, Kiss and AC/DC made it arena music, and Eddie Van Halen's two-handed tapping on Van Halen's 1978 debut changed how rock guitar was played.",
        ro: "În anii '70, Deep Purple, Aerosmith, Kiss și AC/DC l-au transformat în muzică de arenă, iar tehnica de tapping cu ambele mâini a lui Eddie Van Halen, de pe debutul Van Halen din 1978, a schimbat felul în care se cântă la chitara rock.",
      },
      {
        en: "AC/DC's Back in Black (1980) became one of the best-selling albums ever, and Guns N' Roses' Appetite for Destruction (1987) the best-selling debut album in US history. Grunge pushed the style off the charts in the early 1990s, but its bands still headline stadiums today.",
        ro: "Back in Black de AC/DC (1980) a devenit unul dintre cele mai vândute albume din istorie, iar Appetite for Destruction de Guns N' Roses (1987) cel mai vândut album de debut din istoria SUA. Grunge-ul a scos genul din topuri la începutul anilor '90, dar formațiile lui umplu și azi stadioanele.",
      },
    ],
    sonicCharacteristics: [
      {
        en: "Dry, punchy rhythm guitars riding just behind a thunderous kick-and-snare pocket",
        ro: "Chitare ritmice seci și percutante, așezate chiar în spatele unui groove tunător de tobă mare și caisă",
      },
      {
        en: "Blues-steeped vocal grit that cuts through 100-watt amplifier walls",
        ro: "Voci aspre, îmbibate de blues, care străpung zidurile de amplificatoare de 100 W",
      },
      {
        en: "Call-and-response hooks built for open-air arenas",
        ro: "Refrene de tip întrebare-răspuns construite pentru arene în aer liber",
      },
    ],
    essentialLandmarks: [
      { artist: "AC/DC", work: "Back in Black", year: "1980", track: "Back in Black", youtubeId: "pAgnJDJN4VA" },
      { artist: "Guns N' Roses", work: "Appetite for Destruction", year: "1987", track: "Sweet Child O' Mine", youtubeId: "1w7OgIMMRc4" },
      { artist: "Van Halen", work: "Van Halen", year: "1978", track: "Runnin' with the Devil", youtubeId: "i5txwFv-zYM" },
    ],
    image: "/images/experience-valve-amp.webp",
  },
  {
    id: "heavy-metal",
    name: { en: "Heavy Metal", ro: "Heavy metal" },
    yearsOrigin: { en: "1970 — PRESENT", ro: "1970 — PREZENT" },
    bpmRange: "72 — 195 BPM",
    influences: ["hard-rock"],
    legendIds: ["black-sabbath", "metallica"],
    harmonicSignature: "Tritone Intervals · Phrygian Dominant & Chromatic Riffing",
    gainProfile: "Scooped High-Gain Preamp · Down-Picked Palm Mutes",
    broadcastSlot: { en: "NIGHTFALL BLOCK · IRON & THUNDER", ro: "BLOC DE NOAPTE · FIER ȘI TUNET" },
    headline: {
      en: "Born in Birmingham foundries, tempered in global fire",
      ro: "Născut în turnătoriile din Birmingham, călit în focul lumii",
    },
    editorialEssay: {
      en: "From the rain-slicked industrial streets of the English Midlands to the Bay Area thrash underground, Heavy Metal channelled mechanical weight, mythic darkness and virtuosic speed into rock's most devoted global brotherhood.",
      ro: "De pe străzile industriale ude de ploaie ale Midlands-ului englez până în underground-ul thrash din Bay Area, heavy metalul a canalizat greutatea mecanică, întunericul mitic și viteza virtuozilor în cea mai devotată frăție globală a rockului.",
    },
    history: [
      {
        en: "Heavy metal was born in Birmingham, England. Black Sabbath's debut, released on Friday 13 February 1970, slowed the blues down and filled it with dread: guitarist Tony Iommi, who had lost two fingertips in a sheet-metal factory accident, built heavy riffs around the tritone.",
        ro: "Heavy metalul s-a născut la Birmingham, în Anglia. Debutul Black Sabbath, lansat vineri, 13 februarie 1970, a încetinit bluesul și l-a umplut de neliniște: chitaristul Tony Iommi, care își pierduse vârfurile a două degete într-un accident într-o fabrică de tablă, a construit riff-uri grele în jurul tritonului.",
      },
      {
        en: "In the late 1970s Judas Priest and the New Wave of British Heavy Metal — Iron Maiden, Saxon, Motörhead — dropped the blues for speed, twin-guitar harmonies and leather. Iron Maiden's The Number of the Beast (1982) went to number one in the UK.",
        ro: "La sfârșitul anilor '70, Judas Priest și New Wave of British Heavy Metal — Iron Maiden, Saxon, Motörhead — au renunțat la blues în favoarea vitezei, a armoniilor la două chitare și a pielii negre. The Number of the Beast de Iron Maiden (1982) a ajuns pe locul 1 în Marea Britanie.",
      },
      {
        en: "In the early 1980s Metallica, Slayer, Megadeth and Anthrax built thrash metal in the US; in 2016 Metallica's Master of Puppets (1986) became the first metal recording added to the US National Recording Registry. Metal has since split into dozens of styles, from death and black metal to nu metal.",
        ro: "La începutul anilor '80, Metallica, Slayer, Megadeth și Anthrax au creat thrash metalul în SUA; în 2016, Master of Puppets de Metallica (1986) a devenit prima înregistrare metal inclusă în National Recording Registry al SUA. De atunci, metalul s-a ramificat în zeci de stiluri, de la death și black metal până la nu metal.",
      },
    ],
    sonicCharacteristics: [
      {
        en: "Downtuned riffs with percussive palm-muting",
        ro: "Riff-uri pe acordaje coborâte, cu palm-muting percutant",
      },
      {
        en: "Galloping twin-guitar leads and double-bass drum artillery",
        ro: "Solo-uri galopante la două chitare și artileria tobei duble",
      },
      {
        en: "Theatrical staging, operatic dynamics and uncompromising technique",
        ro: "Scenografie teatrală, dinamică operatică și tehnică fără compromis",
      },
    ],
    essentialLandmarks: [
      { artist: "Black Sabbath", work: "Paranoid", year: "1970", track: "Paranoid", youtubeId: "0qanF-91aJo" },
      { artist: "Iron Maiden", work: "The Number of the Beast", year: "1982", track: "Run to the Hills", youtubeId: "86URGgqONvA" },
      { artist: "Metallica", work: "Master of Puppets", year: "1986", track: "Master of Puppets", youtubeId: "E0ozmU9cJDg" },
    ],
    image: "/images/legend-heavy-monolith.webp",
  },
  {
    id: "progressive-rock",
    name: { en: "Progressive Rock", ro: "Rock progresiv" },
    yearsOrigin: { en: "1969 — PRESENT", ro: "1969 — PREZENT" },
    bpmRange: "60 — 168 BPM",
    influences: ["classic-rock"],
    legendIds: ["pink-floyd"],
    harmonicSignature: "Asymmetric Time Signatures · Modal Modulation",
    gainProfile: "Hiwatt Clean Headroom + Silicon Fuzz & Mellotron",
    broadcastSlot: { en: "LATE NIGHT CINEMA · LONG-FORM", ro: "CINEMA DE NOAPTE · FORMAT LUNG" },
    headline: {
      en: "Symphonic ambition and boundary-shattering architecture",
      ro: "Ambiție simfonică și arhitectură care sparge limitele",
    },
    editorialEssay: {
      en: "Refusing verse-chorus constraints, Progressive Rock fused jazz-fusion virtuosity, classical structure and pioneering analog synthesis into panoramic concept albums and laser-lit theatrical shows.",
      ro: "Refuzând constrângerile strofă-refren, rockul progresiv a fuzionat virtuozitatea jazz-fusion, structura clasică și sinteza analogică de pionierat în albume-concept panoramice și spectacole teatrale luminate de lasere.",
    },
    history: [
      {
        en: "Progressive rock emerged in Britain at the end of the 1960s, when bands began writing long, multi-part pieces that borrowed from classical music, jazz and the avant-garde. King Crimson's In the Court of the Crimson King (1969) is widely seen as its starting point.",
        ro: "Rockul progresiv a apărut în Marea Britanie la sfârșitul anilor '60, când formațiile au început să compună piese lungi, în mai multe părți, cu împrumuturi din muzica clasică, jazz și avangardă. In the Court of the Crimson King de King Crimson (1969) e considerat de mulți punctul lui de plecare.",
      },
      {
        en: "In the 1970s Pink Floyd, Yes, Genesis, Emerson, Lake & Palmer and Jethro Tull made concept albums, played in unusual time signatures and brought the Mellotron and the Moog synthesizer into rock. Pink Floyd's The Dark Side of the Moon (1973) spent more than 900 weeks on the Billboard 200.",
        ro: "În anii '70, Pink Floyd, Yes, Genesis, Emerson, Lake & Palmer și Jethro Tull au făcut albume-concept, au cântat în măsuri neobișnuite și au adus Mellotronul și sintetizatorul Moog în rock. The Dark Side of the Moon de Pink Floyd (1973) a stat peste 900 de săptămâni în Billboard 200.",
      },
      {
        en: "After 1976 punk made prog the symbol of excess, but it endured: Rush's Moving Pictures (1981) went multi-platinum, and progressive metal bands such as Dream Theater and Tool carried the idea through the 1990s and beyond.",
        ro: "După 1976, punkul a făcut din prog simbolul excesului, dar genul a rezistat: Moving Pictures de Rush (1981) a obținut multiple discuri de platină, iar formații de metal progresiv precum Dream Theater și Tool au dus ideea mai departe în anii '90 și după.",
      },
    ],
    sonicCharacteristics: [
      {
        en: "Odd meters (7/8, 5/4, 11/8) played with surgical ensemble precision",
        ro: "Măsuri asimetrice (7/8, 5/4, 11/8) cântate cu precizie chirurgicală",
      },
      {
        en: "Mellotron choirs, Minimoog leads and soaring guitar sustain",
        ro: "Coruri de Mellotron, solo-uri de Minimoog și sustain de chitară care plutește",
      },
      {
        en: "Concept narratives spanning entire vinyl sides",
        ro: "Narațiuni-concept care se întind pe fețe întregi de vinil",
      },
    ],
    essentialLandmarks: [
      { artist: "Pink Floyd", work: "Wish You Were Here", year: "1975", track: "Wish You Were Here", youtubeId: "K6qj09OHvjw" },
      { artist: "King Crimson", work: "In the Court of the Crimson King", year: "1969", track: "21st Century Schizoid Man", youtubeId: "7OvW8Z7kiws" },
      { artist: "Rush", work: "Moving Pictures", year: "1981", track: "Tom Sawyer", youtubeId: "auLBLk4ibAk" },
    ],
    image: "/images/legend-prog-prism.webp",
  },
  {
    id: "indie-rock",
    name: { en: "Indie Rock", ro: "Indie rock" },
    yearsOrigin: { en: "1984 — PRESENT", ro: "1984 — PREZENT" },
    bpmRange: "112 — 156 BPM",
    influences: ["alternative-rock"],
    legendIds: [],
    harmonicSignature: "Jangle Arpeggios · Angular Post-Punk Interplay",
    gainProfile: "Vox AC30 Top Boost · Overdriven Small-Combo Grit",
    broadcastSlot: { en: "METRO ROTATION · INDEPENDENT", ro: "ROTAȚIE URBANĂ · INDEPENDENT" },
    headline: {
      en: "Autonomous vision, wire-tight guitars and urban poetics",
      ro: "Viziune autonomă, chitare întinse ca sârma și poezie urbană",
    },
    editorialEssay: {
      en: "Rooted in fiercely independent labels from Manchester to New York and Sheffield, Indie Rock proved that sharp songwriting, interlocking guitars and DIY control could fill festival main stages without losing an ounce of edge.",
      ro: "Înrădăcinat în case de discuri fervent independente din Manchester, New York și Sheffield, indie rockul a dovedit că piesele bine scrise, chitarele întrețesute și controlul DIY pot umple scenele principale de festival fără să-și piardă tăișul.",
    },
    history: [
      {
        en: "Indie rock takes its name from the independent labels — Rough Trade, Factory, SST, Sub Pop, Matador — that released music outside the major-label system in the 1980s. The Smiths, signed to Rough Trade, defined its British side with The Queen Is Dead (1986).",
        ro: "Indie rockul își trage numele de la casele de discuri independente — Rough Trade, Factory, SST, Sub Pop, Matador — care au lansat muzică în afara marilor companii în anii '80. The Smiths, sub contract cu Rough Trade, i-au definit latura britanică cu The Queen Is Dead (1986).",
      },
      {
        en: "In the US, Pavement, Built to Spill and Yo La Tengo kept a lo-fi, guitar-based sound alive through the 1990s, while alternative rock took over the charts.",
        ro: "În SUA, Pavement, Built to Spill și Yo La Tengo au ținut în viață un sunet lo-fi, bazat pe chitare, de-a lungul anilor '90, în timp ce rockul alternativ cucerea topurile.",
      },
      {
        en: "A second wave arrived in 2001 with The Strokes' Is This It, followed by The White Stripes, Franz Ferdinand and Arctic Monkeys, whose 2006 debut was then the fastest-selling debut album in UK chart history. Their AM (2013) carried the sound into the streaming era.",
        ro: "Un al doilea val a sosit în 2001 cu Is This It de The Strokes, urmat de The White Stripes, Franz Ferdinand și Arctic Monkeys, al căror debut din 2006 a fost la vremea lui cel mai rapid vândut album de debut din istoria topurilor britanice. AM (2013) a dus sunetul lor în era streamingului.",
      },
    ],
    sonicCharacteristics: [
      {
        en: "Crisp, trebly guitars weaving around driving basslines",
        ro: "Chitare clare, ascuțite, care se împletesc în jurul unor linii de bas alerte",
      },
      {
        en: "Dry room recordings that keep every fret slide and breath",
        ro: "Înregistrări seci de cameră care păstrează fiecare alunecare pe taste și respirație",
      },
      {
        en: "Wry, observational lyrics with dance-floor urgency",
        ro: "Versuri ironice, observaționale, cu urgență de ring de dans",
      },
    ],
    essentialLandmarks: [
      { artist: "The Smiths", work: "The Queen Is Dead", year: "1986", track: "There Is a Light That Never Goes Out", youtubeId: "siO6dkqidc4" },
      { artist: "The Strokes", work: "Is This It", year: "2001", track: "Last Nite", youtubeId: "TOypSnKFHrE" },
      { artist: "Arctic Monkeys", work: "AM", year: "2013", track: "Do I Wanna Know?", youtubeId: "bpOSxM0rNPM" },
    ],
    image: "/images/experience-vinyl-archive.webp",
  },
  {
    id: "grunge",
    name: { en: "Grunge", ro: "Grunge" },
    yearsOrigin: { en: "1986 — 1996", ro: "1986 — 1996" },
    bpmRange: "84 — 132 BPM",
    influences: ["alternative-rock", "heavy-metal", "punk-rock"],
    legendIds: ["nirvana"],
    harmonicSignature: "Drop-D Sludge · Chromatic Power-Chord Bends",
    gainProfile: "Boss DS-1 / Big Muff Into High-Headroom Tube Stack",
    broadcastSlot: { en: "90s VAULT · PACIFIC NORTHWEST", ro: "ARHIVA ANILOR '90 · SEATTLE" },
    headline: {
      en: "Sludge, catharsis and the final analog reckoning",
      ro: "Nămol sonor, catharsis și ultima socoteală analogică",
    },
    editorialEssay: {
      en: "Emerging from rain-soaked Seattle rehearsal spaces, Grunge fused the molten weight of Black Sabbath with the raw nerve of hardcore punk. In a single autumn it swept away hair-spray excess and restored raw vulnerability to rock television.",
      ro: "Ieșit din sălile de repetiții ude de ploaie ale Seattle-ului, grunge-ul a topit greutatea Black Sabbath în nervul brut al hardcore punk-ului. Într-o singură toamnă a măturat excesul glam și a readus vulnerabilitatea crudă în televiziunea rock.",
    },
    history: [
      {
        en: "Grunge developed in Seattle in the mid-1980s, combining the weight of Black Sabbath with the rawness of hardcore punk. The 1986 compilation Deep Six and the independent label Sub Pop documented the early scene: Green River, Mudhoney, Soundgarden and Nirvana.",
        ro: "Grunge-ul s-a dezvoltat la Seattle la mijlocul anilor '80, combinând greutatea Black Sabbath cu asprimea hardcore punkului. Compilația Deep Six din 1986 și casa de discuri independentă Sub Pop au documentat scena de început: Green River, Mudhoney, Soundgarden și Nirvana.",
      },
      {
        en: "Pearl Jam's Ten (August 1991) and Nirvana's Nevermind (September 1991) came out a month apart. In January 1992 Nevermind replaced Michael Jackson's Dangerous at number one on the Billboard 200.",
        ro: "Ten de Pearl Jam (august 1991) și Nevermind de Nirvana (septembrie 1991) au apărut la o lună distanță. În ianuarie 1992, Nevermind a luat locul albumului Dangerous al lui Michael Jackson pe primul loc în Billboard 200.",
      },
      {
        en: "In 1994 both Alice in Chains' Jar of Flies and Soundgarden's Superunknown debuted at number one. Kurt Cobain's death that April, and the break-ups that followed, ended the movement by the mid-1990s.",
        ro: "În 1994, atât Jar of Flies de Alice in Chains, cât și Superunknown de Soundgarden au debutat pe locul 1. Moartea lui Kurt Cobain în aprilie același an și destrămările care au urmat au încheiat mișcarea până la mijlocul anilor '90.",
      },
    ],
    sonicCharacteristics: [
      {
        en: "Detuned, thick guitar sludge meeting punk-rock melodic immediacy",
        ro: "Chitare groase, acordate jos, întâlnind imediatețea melodică a punk-ului",
      },
      {
        en: "Cavernous drum rooms and throat-shredding vocals",
        ro: "Tobe în încăperi cavernoase și voci care sfâșie gâtul",
      },
      {
        en: "Rejection of rock-star detachment in favour of emotional truth",
        ro: "Respingerea detașării de star rock în favoarea adevărului emoțional",
      },
    ],
    essentialLandmarks: [
      { artist: "Nirvana", work: "In Utero", year: "1993", track: "Heart-Shaped Box", youtubeId: "n6P0SitRwy8" },
      { artist: "Soundgarden", work: "Superunknown", year: "1994", track: "Black Hole Sun", youtubeId: "3mbBbFH9fAg" },
      { artist: "Alice in Chains", work: "Dirt", year: "1992", track: "Would?", youtubeId: "Nco_kh8xJDs" },
    ],
    image: "/images/legend-grunge-feedback.webp",
  },
  {
    id: "punk-rock",
    name: { en: "Punk Rock", ro: "Punk rock" },
    yearsOrigin: { en: "1974 — PRESENT", ro: "1974 — PREZENT" },
    bpmRange: "152 — 210 BPM",
    influences: ["classic-rock"],
    legendIds: [],
    harmonicSignature: "Three-Chord Downstroke Barrage · Street Anthems",
    gainProfile: "Dimed Marshall JCM800 · Zero Pedals, Straight Cord",
    broadcastSlot: { en: "MIDNIGHT RIOT · THREE CHORDS", ro: "REVOLTĂ DE MIEZUL NOPȚII · TREI ACORDURI" },
    headline: {
      en: "Strip away the excess: velocity, defiance, impact",
      ro: "Fără exces: viteză, sfidare, impact",
    },
    editorialEssay: {
      en: "When rock risked becoming a museum piece in the mid-1970s, Punk kicked the doors off the hinges at CBGB and the 100 Club. Two minutes, relentless downstrokes and a refusal to ask permission turned every audience member into a participant.",
      ro: "Când rockul risca să devină piesă de muzeu la mijlocul anilor '70, punk-ul a scos ușile din balamale la CBGB și la 100 Club. Două minute, downstroke-uri neobosite și refuzul de a cere voie au transformat fiecare spectator în participant.",
    },
    history: [
      {
        en: "Punk began in New York around 1974 at the club CBGB, where the Ramones played short, fast, stripped-down songs. Their first album (1976) lasts under 30 minutes.",
        ro: "Punkul a început la New York, în jurul lui 1974, în clubul CBGB, unde Ramones cântau piese scurte, rapide și fără ornamente. Primul lor album (1976) durează sub 30 de minute.",
      },
      {
        en: "In 1976 it reached London, where the Sex Pistols, The Clash and The Damned turned it into a youth movement with its own fashion, fanzines and do-it-yourself labels. The Clash's London Calling (1979) widened its range with reggae, ska and rockabilly.",
        ro: "În 1976 a ajuns la Londra, unde Sex Pistols, The Clash și The Damned l-au transformat într-o mișcare a tinerilor, cu moda, fanzinurile și casele de discuri „do-it-yourself” proprii. London Calling de The Clash (1979) i-a lărgit registrul cu reggae, ska și rockabilly.",
      },
      {
        en: "In the 1980s American hardcore bands such as Black Flag, Minor Threat and Bad Brains built an independent touring network. In 1994 Green Day's Dookie and The Offspring's Smash took pop-punk to the mainstream.",
        ro: "În anii '80, formațiile americane de hardcore precum Black Flag, Minor Threat și Bad Brains au construit o rețea independentă de turnee. În 1994, Dookie de Green Day și Smash de The Offspring au dus pop-punkul în mainstream.",
      },
    ],
    sonicCharacteristics: [
      {
        en: "Relentless eighth-note downstrokes and propulsive basslines",
        ro: "Downstroke-uri neîntrerupte în optimi și linii de bas propulsive",
      },
      {
        en: "Street-level manifestos with zero studio polish",
        ro: "Manifeste de stradă, fără niciun lustru de studio",
      },
      {
        en: "Compact songs that detonate and vanish in under three minutes",
        ro: "Piese compacte care detonează și dispar în sub trei minute",
      },
    ],
    essentialLandmarks: [
      { artist: "The Clash", work: "London Calling", year: "1979", track: "London Calling", youtubeId: "EfK-WX2pa8c" },
      { artist: "Ramones", work: "Ramones", year: "1976", track: "Blitzkrieg Bop", youtubeId: "268C3N2dDYk" },
      { artist: "Green Day", work: "Dookie", year: "1994", track: "Basket Case", youtubeId: "NUTGr5t3MoY" },
    ],
    image: "/images/hero-arena-stage.webp",
  },
];

export const ROCK_LEGENDS: RockLegendFeature[] = [
  {
    id: "jimi-hendrix",
    name: "JIMI HENDRIX",
    moniker: { en: "The architect of electric feedback", ro: "Arhitectul feedback-ului electric" },
    originCity: { en: "SEATTLE / LONDON", ro: "SEATTLE / LONDRA" },
    activeYears: { en: "1963 — 1970", ro: "1963 — 1970" },
    signatureGear: "1968 Olympic White Stratocaster · Marshall Super Lead 100W",
    rotationAnthem: "Voodoo Child (Slight Return)",
    editorialPortrait: {
      en: "In four incandescent years, Jimi Hendrix reimagined the electric guitar not as an acoustic instrument with a pickup, but as a controlled electronic hurricane. In front of twin Marshall stacks he sculpted feedback, Octavia fuzz and Uni-Vibe phase into a language no guitarist has escaped since.",
      ro: "În patru ani incandescenți, Jimi Hendrix a reinventat chitara electrică: nu un instrument acustic cu doză, ci un uragan electronic controlat. În fața a două stack-uri Marshall, a sculptat feedback-ul, fuzz-ul Octavia și faza Uni-Vibe într-un limbaj de care niciun chitarist n-a mai scăpat.",
    },
    influenceStatement: {
      en: "Turned amplifier feedback from an engineering hazard into rock's primary expressive voice.",
      ro: "A transformat feedback-ul de amplificator dintr-un defect tehnic în vocea expresivă principală a rockului.",
    },
    image: "/images/legend-electric-voodoo.webp",
    imageAlt: {
      en: "Silhouetted guitarist kneeling before vintage amplifier stacks in crimson stage haze",
      ro: "Silueta unui chitarist îngenuncheat în fața amplificatoarelor vintage, în ceață purpurie de scenă",
    },
    wikipedia: "https://en.wikipedia.org/wiki/Jimi_Hendrix",
    kind: "Person",
    videos: [
      {
        youtubeId: "qFfnlYbFEiE",
        title: "Voodoo Child (Slight Return)",
        note: { en: "Live in Maui, 1970", ro: "Live în Maui, 1970" },
      },
      {
        youtubeId: "cJunCsrhJjg",
        title: "Purple Haze",
        note: { en: "Live at the Atlanta Pop Festival", ro: "Live la Atlanta Pop Festival" },
      },
      { youtubeId: "TLV4_xaYynY", title: "All Along The Watchtower", note: OFFICIAL_AUDIO },
    ],
  },
  {
    id: "led-zeppelin",
    name: "LED ZEPPELIN",
    moniker: { en: "Hammer of the gods", ro: "Ciocanul zeilor" },
    originCity: { en: "LONDON, UK", ro: "LONDRA, UK" },
    activeYears: { en: "1968 — 1980", ro: "1968 — 1980" },
    signatureGear: "1959 Gibson Les Paul Standard · Ludwig Amber Vistalite",
    rotationAnthem: "Kashmir / Whole Lotta Love",
    editorialPortrait: {
      en: "Jimmy Page's light-and-shade production, John Bonham's seismic drum sound, John Paul Jones's multi-instrumental anchor and Robert Plant's banshee wail created the blueprint for album-oriented rock.",
      ro: "Producția în lumini și umbre a lui Jimmy Page, sunetul seismic al tobelor lui John Bonham, ancora multi-instrumentală a lui John Paul Jones și urletul lui Robert Plant au creat schița rockului orientat pe album.",
    },
    influenceStatement: {
      en: "Defined the dynamic architecture of folk mysticism and crushing electric riffs.",
      ro: "A definit arhitectura dinamică dintre misticismul folk și riff-urile electrice zdrobitoare.",
    },
    image: "/images/experience-crowd-stage.webp",
    imageAlt: {
      en: "Arena stage seen from behind the drum kit, a stadium lit by red spotlights",
      ro: "Scenă de arenă văzută din spatele tobelor, un stadion luminat de reflectoare roșii",
    },
    wikipedia: "https://en.wikipedia.org/wiki/Led_Zeppelin",
    kind: "MusicGroup",
    videos: [
      { youtubeId: "HQmmM_qwG4k", title: "Whole Lotta Love", note: OFFICIAL_VIDEO },
      { youtubeId: "QkF3oxziUI4", title: "Stairway To Heaven", note: OFFICIAL_AUDIO },
      { youtubeId: "tzVJPgCn-Z8", title: "Kashmir", note: { en: "Remaster", ro: "Remasterizat" } },
    ],
  },
  {
    id: "black-sabbath",
    name: "BLACK SABBATH",
    moniker: { en: "Progenitors of the heavy monolith", ro: "Părinții monolitului heavy" },
    originCity: { en: "BIRMINGHAM, UK", ro: "BIRMINGHAM, UK" },
    activeYears: { en: "1968 — 2025", ro: "1968 — 2025" },
    signatureGear: "1965 Gibson SG Special · Laney Supergroup 100W",
    rotationAnthem: "War Pigs / Paranoid",
    editorialPortrait: {
      en: "Forced to slacken his strings after a sheet-metal factory injury, Tony Iommi slowed down the blues and summoned the tritone. With Geezer Butler, Bill Ward and Ozzy Osbourne, Black Sabbath birthed an entire musical universe out of post-war industrial gloom.",
      ro: "Obligat să-și slăbească corzile după un accident într-o fabrică de tablă, Tony Iommi a încetinit bluesul și a invocat tritonul. Alături de Geezer Butler, Bill Ward și Ozzy Osbourne, Black Sabbath a născut un întreg univers muzical din mohorul industrial de după război.",
    },
    influenceStatement: {
      en: "Forged the sonic DNA of heavy metal, doom and stoner rock.",
      ro: "A forjat ADN-ul sonor al heavy metalului, doom-ului și stoner rockului.",
    },
    image: "/images/legend-heavy-monolith.webp",
    imageAlt: {
      en: "Brooding 1970s heavy rock stage with a guitar raised in crimson and violet fog",
      ro: "Scenă heavy rock din anii '70, cu o chitară ridicată în ceață purpurie și violetă",
    },
    wikipedia: "https://en.wikipedia.org/wiki/Black_Sabbath",
    kind: "MusicGroup",
    videos: [
      { youtubeId: "0qanF-91aJo", title: "Paranoid", note: OFFICIAL_VIDEO },
      { youtubeId: "K3b6SGoN6dA", title: "War Pigs", note: { en: "Live video", ro: "Video live" } },
    ],
  },
  {
    id: "pink-floyd",
    name: "PINK FLOYD",
    moniker: { en: "Masters of cinematic sound & light", ro: "Maeștrii sunetului și luminii cinematice" },
    originCity: { en: "LONDON, UK", ro: "LONDRA, UK" },
    activeYears: { en: "1965 — 1995", ro: "1965 — 1995" },
    signatureGear: "The Black Strat · EMS VCS 3 · Circular Projection Truss",
    rotationAnthem: "Comfortably Numb / Shine On You Crazy Diamond",
    editorialPortrait: {
      en: "Pink Floyd turned the rock concert into an immersive architectural and visual spectacle. With quadraphonic sound, circular projection rigs and some of the most emotional guitar solos ever recorded, they proved rock could be both intimate and cosmic.",
      ro: "Pink Floyd a transformat concertul rock într-un spectacol arhitectural și vizual imersiv. Cu sunet cvadrifonic, ecrane circulare de proiecție și unele dintre cele mai emoționante solo-uri de chitară înregistrate vreodată, au dovedit că rockul poate fi intim și cosmic în același timp.",
    },
    influenceStatement: {
      en: "Pioneered arena lighting choreography and concept-album continuity.",
      ro: "Pionieri ai coregrafiei de lumini în arene și ai continuității albumelor-concept.",
    },
    image: "/images/legend-prog-prism.webp",
    imageAlt: {
      en: "Circular stage truss projecting crimson and amber laser beams over analog synthesizers",
      ro: "Structură circulară de scenă proiectând lasere purpurii și chihlimbarii peste sintetizatoare analogice",
    },
    wikipedia: "https://en.wikipedia.org/wiki/Pink_Floyd",
    kind: "MusicGroup",
    videos: [
      { youtubeId: "HrxX9TBj2zY", title: "Another Brick In The Wall, Part Two", note: OFFICIAL_VIDEO },
      { youtubeId: "7kWl-ZGMwkQ", title: "Comfortably Numb", note: { en: "Live, PULSE 1994", ro: "Live, PULSE 1994" } },
      { youtubeId: "K6qj09OHvjw", title: "Wish You Were Here", note: OFFICIAL_VIDEO },
    ],
  },
  {
    id: "nirvana",
    name: "NIRVANA",
    moniker: { en: "The Seattle cataclysm", ro: "Cataclismul din Seattle" },
    originCity: { en: "ABERDEEN / SEATTLE", ro: "ABERDEEN / SEATTLE" },
    activeYears: { en: "1987 — 1994", ro: "1987 — 1994" },
    signatureGear: "Fender Jaguar / Mustang · Boss DS-1 · EHX Polychorus",
    rotationAnthem: "Smells Like Teen Spirit / Heart-Shaped Box",
    editorialPortrait: {
      en: "Kurt Cobain, Krist Novoselic and Dave Grohl brought underground ethics straight into living rooms worldwide. Their music videos and raw live broadcasts proved that three musicians armed with bruised melodies and ferocious distortion could reset global culture overnight.",
      ro: "Kurt Cobain, Krist Novoselic și Dave Grohl au adus etica underground direct în sufrageriile lumii. Videoclipurile și concertele lor transmise brut au dovedit că trei muzicieni cu melodii învinețite și distorsiune feroce pot reseta cultura globală peste noapte.",
    },
    influenceStatement: {
      en: "Bridged punk's subterranean fury with timeless songwriting.",
      ro: "A unit furia subterană a punk-ului cu piese scrise pentru eternitate.",
    },
    image: "/images/legend-grunge-feedback.webp",
    imageAlt: {
      en: "1990s club photograph of a guitarist lunging toward a stage monitor",
      ro: "Fotografie de club din anii '90 cu un chitarist aruncându-se spre un monitor de scenă",
    },
    wikipedia: "https://en.wikipedia.org/wiki/Nirvana_(band)",
    kind: "MusicGroup",
    videos: [
      { youtubeId: "hTWKbfoikeg", title: "Smells Like Teen Spirit", note: OFFICIAL_VIDEO },
      { youtubeId: "vabnZ9-ex7o", title: "Come As You Are", note: OFFICIAL_VIDEO },
      { youtubeId: "n6P0SitRwy8", title: "Heart-Shaped Box", note: OFFICIAL_VIDEO },
    ],
  },
  {
    id: "ac-dc",
    name: "AC/DC",
    moniker: { en: "High-voltage rhythm engine", ro: "Motorul ritmic de înaltă tensiune" },
    originCity: { en: "SYDNEY, AUSTRALIA", ro: "SYDNEY, AUSTRALIA" },
    activeYears: { en: "1973 — PRESENT", ro: "1973 — PREZENT" },
    signatureGear: "1968 Gibson SG · Gretsch Jet Firebird · Marshall 1959SLP",
    rotationAnthem: "Back in Black / Thunderstruck",
    editorialPortrait: {
      en: "No synthesizers, no ballads, no compromises. Built on Malcolm Young's iron rhythm guitar and Angus Young's relentless stage propulsion, AC/DC remains the purest distillation of high-voltage rock and roll ever committed to tape.",
      ro: "Fără sintetizatoare, fără balade, fără compromisuri. Construit pe chitara ritmică de fier a lui Malcolm Young și pe energia neobosită a lui Angus Young, AC/DC rămâne cel mai pur distilat de rock and roll de înaltă tensiune pus vreodată pe bandă.",
    },
    influenceStatement: {
      en: "Perfected open-chord hard rock groove and stadium-shaking dynamics.",
      ro: "A perfecționat groove-ul hard rock pe acorduri deschise și dinamica ce zguduie stadioanele.",
    },
    image: "/images/experience-valve-amp.webp",
    imageAlt: {
      en: "Glowing vacuum tubes and the steel faceplate of a high-voltage amplifier",
      ro: "Lămpi incandescente și panoul de oțel al unui amplificator de înaltă tensiune",
    },
    wikipedia: "https://en.wikipedia.org/wiki/AC/DC",
    kind: "MusicGroup",
    videos: [
      { youtubeId: "v2AC41dglnM", title: "Thunderstruck", note: OFFICIAL_VIDEO },
      { youtubeId: "pAgnJDJN4VA", title: "Back In Black", note: OFFICIAL_VIDEO },
      { youtubeId: "l482T0yNkeo", title: "Highway to Hell", note: OFFICIAL_VIDEO },
    ],
  },
  {
    id: "metallica",
    name: "METALLICA",
    moniker: { en: "Architects of thrash & arena velocity", ro: "Arhitecții thrash-ului și ai vitezei de arenă" },
    originCity: { en: "SAN FRANCISCO / LOS ANGELES", ro: "SAN FRANCISCO / LOS ANGELES" },
    activeYears: { en: "1981 — PRESENT", ro: "1981 — PREZENT" },
    signatureGear: "ESP Explorer · Mesa/Boogie Mark IIC+ · EMG Actives",
    rotationAnthem: "Master of Puppets / Enter Sandman",
    editorialPortrait: {
      en: "From underground tape-trading in 1982 to headlining the largest open-air stages on earth, Metallica combined blistering down-picking precision with multi-movement compositional ambition.",
      ro: "De la schimbul de casete underground din 1982 până la cap de afiș pe cele mai mari scene în aer liber de pe planetă, Metallica a combinat precizia feroce a down-picking-ului cu ambiții componistice în mai multe mișcări.",
    },
    influenceStatement: {
      en: "Elevated underground thrash metal into a dominant force of stadium rock.",
      ro: "A ridicat thrash metalul underground la rang de forță dominantă a rockului de stadion.",
    },
    image: "/images/hero-arena-stage.webp",
    imageAlt: {
      en: "Darkened arena stage rig lit by crimson spotlight beams",
      ro: "Structură de scenă într-o arenă întunecată, luminată de fascicule purpurii",
    },
    wikipedia: "https://en.wikipedia.org/wiki/Metallica",
    kind: "MusicGroup",
    videos: [
      { youtubeId: "CD-E-LDc384", title: "Enter Sandman", note: OFFICIAL_VIDEO },
      { youtubeId: "WM8bTdBs-cw", title: "One", note: OFFICIAL_VIDEO },
      { youtubeId: "tAGnKpE4NCI", title: "Nothing Else Matters", note: OFFICIAL_VIDEO },
    ],
  },
  {
    id: "queen",
    name: "QUEEN",
    moniker: { en: "Operatic stadium virtuosity", ro: "Virtuozitate operatică de stadion" },
    originCity: { en: "LONDON, UK", ro: "LONDRA, UK" },
    activeYears: { en: "1970 — PRESENT", ro: "1970 — PREZENT" },
    signatureGear: "Red Special · Treble Booster + Vox AC30 Wall",
    rotationAnthem: "Bohemian Rhapsody / We Will Rock You",
    editorialPortrait: {
      en: "Freddie Mercury's four-octave command and stage charisma, paired with Brian May's orchestral, home-built Red Special harmonies, turned stadiums of 100,000 strangers into a single choir.",
      ro: "Ambitusul de patru octave și carisma de scenă ale lui Freddie Mercury, alături de armoniile orchestrale ale chitarei Red Special construite de Brian May, au transformat stadioane cu 100.000 de necunoscuți într-un singur cor.",
    },
    influenceStatement: {
      en: "Turned live rock broadcasts — from Live Aid to Wembley — into historic cultural events.",
      ro: "A transformat transmisiunile rock live — de la Live Aid la Wembley — în evenimente culturale istorice.",
    },
    image: "/images/experience-vinyl-archive.webp",
    imageAlt: {
      en: "Vintage stage microphones and black vinyl records under crimson lighting",
      ro: "Microfoane de scenă vintage și discuri de vinil negre în lumină purpurie",
    },
    wikipedia: "https://en.wikipedia.org/wiki/Queen_(band)",
    kind: "MusicGroup",
    videos: [
      { youtubeId: "fJ9rUzIMcZQ", title: "Bohemian Rhapsody", note: OFFICIAL_VIDEO },
      { youtubeId: "-tJYN-eG1zk", title: "We Will Rock You", note: OFFICIAL_VIDEO },
      { youtubeId: "HgzGwKwLmgM", title: "Don't Stop Me Now", note: OFFICIAL_VIDEO },
    ],
  },
];

/**
 * What the video gallery plays: a legend's music videos, or a genre's
 * essential records (one official track from each album).
 */
export interface Playlist {
  id: string;
  name: string | Localized;
  subtitle: Localized;
  videos: LegendVideo[];
}

/** Genre playlists are addressed as `genre:<genre id>` in the gallery. */
export const genrePlaylistId = (genreId: string) => `genre:${genreId}`;

export const LEGEND_PLAYLISTS: Playlist[] = ROCK_LEGENDS.map((legend) => ({
  id: legend.id,
  name: legend.name,
  subtitle: legend.moniker,
  videos: legend.videos,
}));

export const GENRE_PLAYLISTS: Playlist[] = ROCK_GENRES.map((genre) => ({
  id: genrePlaylistId(genre.id),
  name: genre.name,
  subtitle: genre.headline,
  videos: genre.essentialLandmarks.map((record) => {
    const from = `${record.artist} · ${record.work}, ${record.year}`;
    return { youtubeId: record.youtubeId, title: record.track, note: { en: from, ro: from } };
  }),
}));
