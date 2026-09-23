/**
 * High-definition dynamic destination cover images generator with bright daylight scenic queries.
 */

// Curated bright, high-resolution daylight Unsplash photos for major worldwide travel hubs
const CURATED_HUB_PHOTOS: Record<string, string> = {
  tokyo: "https://images.unsplash.com/photo-1542051841857-5f90071e7989?auto=format&fit=crop&w=1600&h=900&q=85",
  japan: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1600&h=900&q=85",
  kyoto: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1600&h=900&q=85",
  paris: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1600&h=900&q=85",
  france: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1600&h=900&q=85",
  london: "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=1600&h=900&q=85",
  "united kingdom": "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=1600&h=900&q=85",
  "new york": "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&w=1600&h=900&q=85",
  nyc: "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&w=1600&h=900&q=85",
  "los angeles": "https://images.unsplash.com/photo-1580655653885-65763b2597d0?auto=format&fit=crop&w=1600&h=900&q=85",
  dubai: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1600&h=900&q=85",
  uae: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1600&h=900&q=85",
  bali: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=1600&h=900&q=85",
  indonesia: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=1600&h=900&q=85",
  rome: "https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=1600&h=900&q=85",
  italy: "https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=1600&h=900&q=85",
  islamabad: "https://images.unsplash.com/photo-1627894006066-b457865373a6?auto=format&fit=crop&w=1600&h=900&q=85",
  lahore: "https://images.unsplash.com/photo-1588668214407-6ea9a6d8c272?auto=format&fit=crop&w=1600&h=900&q=85",
  karachi: "https://images.unsplash.com/photo-1596422846543-75c6fc197f07?auto=format&fit=crop&w=1600&h=900&q=85",
  pakistan: "https://images.unsplash.com/photo-1588668214407-6ea9a6d8c272?auto=format&fit=crop&w=1600&h=900&q=85",
  hunza: "https://images.unsplash.com/photo-1588668214407-6ea9a6d8c272?auto=format&fit=crop&w=1600&h=900&q=85",
  barcelona: "https://images.unsplash.com/photo-1583422409516-2895a77efded?auto=format&fit=crop&w=1600&h=900&q=85",
  spain: "https://images.unsplash.com/photo-1583422409516-2895a77efded?auto=format&fit=crop&w=1600&h=900&q=85",
  sydney: "https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?auto=format&fit=crop&w=1600&h=900&q=85",
  australia: "https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?auto=format&fit=crop&w=1600&h=900&q=85",
  santorini: "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=1600&h=900&q=85",
  greece: "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=1600&h=900&q=85",
  cairo: "https://images.unsplash.com/photo-1572252009286-268acec5ca0a?auto=format&fit=crop&w=1600&h=900&q=85",
  egypt: "https://images.unsplash.com/photo-1572252009286-268acec5ca0a?auto=format&fit=crop&w=1600&h=900&q=85",
  bangkok: "https://images.unsplash.com/photo-1508009603885-50cf7c579365?auto=format&fit=crop&w=1600&h=900&q=85",
  thailand: "https://images.unsplash.com/photo-1508009603885-50cf7c579365?auto=format&fit=crop&w=1600&h=900&q=85",
  singapore: "https://images.unsplash.com/photo-1525625293386-3f8f99389edd?auto=format&fit=crop&w=1600&h=900&q=85",
  amsterdam: "https://images.unsplash.com/photo-1512470876302-972faa2aa9a4?auto=format&fit=crop&w=1600&h=900&q=85",
  netherlands: "https://images.unsplash.com/photo-1512470876302-972faa2aa9a4?auto=format&fit=crop&w=1600&h=900&q=85",
  berlin: "https://images.unsplash.com/photo-1560969184-10fe8719e047?auto=format&fit=crop&w=1600&h=900&q=85",
  germany: "https://images.unsplash.com/photo-1560969184-10fe8719e047?auto=format&fit=crop&w=1600&h=900&q=85",
  zurich: "https://images.unsplash.com/photo-1515488764276-beab7607c1e6?auto=format&fit=crop&w=1600&h=900&q=85",
  switzerland: "https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?auto=format&fit=crop&w=1600&h=900&q=85",
  reykjavik: "https://images.unsplash.com/photo-1504893524553-b855bce32c67?auto=format&fit=crop&w=1600&h=900&q=85",
  iceland: "https://images.unsplash.com/photo-1504893524553-b855bce32c67?auto=format&fit=crop&w=1600&h=900&q=85",
  seoul: "https://images.unsplash.com/photo-1538485399081-7191377e8241?auto=format&fit=crop&w=1600&h=900&q=85",
  korea: "https://images.unsplash.com/photo-1538485399081-7191377e8241?auto=format&fit=crop&w=1600&h=900&q=85",
  riyadh: "https://images.unsplash.com/photo-1586724237569-f3d0c1dee8c6?auto=format&fit=crop&w=1600&h=900&q=85",
  "saudi arabia": "https://images.unsplash.com/photo-1586724237569-f3d0c1dee8c6?auto=format&fit=crop&w=1600&h=900&q=85",
};

// High-definition bright daylight scenic travel backdrops
const GLOBAL_FALLBACK_IMAGES = [
  "https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1600&h=900&q=85", // Scenic Mountain & Travel
  "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=1600&h=900&q=85", // Roadtrip & Wanderlust
  "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=1600&h=900&q=85", // Lake & Forest Scenic
  "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1600&h=900&q=85", // Tropical Paradise
];

export interface DestinationImageUrls {
  primary: string;
  countryLevel: string;
  fallback: string;
  curated?: string;
  kind: "photo" | "flag";
  countryCode?: string;
}

const COUNTRY_ISO_CODES: Record<string, string> = {
  afghanistan: "af", albania: "al", algeria: "dz", andorra: "ad", angola: "ao",
  argentina: "ar", armenia: "am", australia: "au", austria: "at", azerbaijan: "az",
  bahrain: "bh", bangladesh: "bd", belarus: "by", belgium: "be", belize: "bz",
  benin: "bj", bhutan: "bt", bolivia: "bo", "bosnia and herzegovina": "ba", botswana: "bw",
  brazil: "br", brunei: "bn", bulgaria: "bg", "burkina faso": "bf", burundi: "bi",
  cambodia: "kh", cameroon: "cm", canada: "ca", "cape verde": "cv", "central african republic": "cf",
  chad: "td", chile: "cl", china: "cn", colombia: "co", comoros: "km",
  congo: "cg", "costa rica": "cr", croatia: "hr", cuba: "cu", cyprus: "cy",
  "czech republic": "cz", czechia: "cz", denmark: "dk", djibouti: "dj", dominica: "dm",
  "dominican republic": "do", ecuador: "ec", egypt: "eg", "el salvador": "sv", "equatorial guinea": "gq",
  eritrea: "er", estonia: "ee", eswatini: "sz", ethiopia: "et", fiji: "fj",
  finland: "fi", france: "fr", gabon: "ga", gambia: "gm", georgia: "ge",
  germany: "de", ghana: "gh", greece: "gr", grenada: "gd", guatemala: "gt",
  guinea: "gn", "guinea-bissau": "gw", guyana: "gy", haiti: "ht", honduras: "hn",
  hungary: "hu", iceland: "is", india: "in", indonesia: "id", iran: "ir",
  iraq: "iq", ireland: "ie", israel: "il", italy: "it", "ivory coast": "ci",
  "cote d'ivoire": "ci", jamaica: "jm", japan: "jp", jordan: "jo", kazakhstan: "kz",
  kenya: "ke", kiribati: "ki", kuwait: "kw", kyrgyzstan: "kg", laos: "la",
  latvia: "lv", lebanon: "lb", lesotho: "ls", liberia: "lr", libya: "ly",
  liechtenstein: "li", lithuania: "lt", luxembourg: "lu", madagascar: "mg", malawi: "mw",
  malaysia: "my", maldives: "mv", mali: "ml", malta: "mt", mauritania: "mr",
  mauritius: "mu", mexico: "mx", micronesia: "fm", moldova: "md", monaco: "mc",
  mongolia: "mn", montenegro: "me", morocco: "ma", mozambique: "mz", myanmar: "mm",
  namibia: "na", nepal: "np", netherlands: "nl", "new zealand": "nz", nicaragua: "ni",
  niger: "ne", nigeria: "ng", "north korea": "kp", "north macedonia": "mk", norway: "no",
  oman: "om", pakistan: "pk", palau: "pw", palestine: "ps", panama: "pa",
  "papua new guinea": "pg", paraguay: "py", peru: "pe", philippines: "ph", poland: "pl",
  portugal: "pt", qatar: "qa", romania: "ro", russia: "ru", rwanda: "rw",
  "saudi arabia": "sa", senegal: "sn", serbia: "rs", "sierra leone": "sl", singapore: "sg",
  slovakia: "sk", slovenia: "si", "solomon islands": "sb", somalia: "so", "south africa": "za",
  "south korea": "kr", korea: "kr", "south sudan": "ss", spain: "es", "sri lanka": "lk",
  sudan: "sd", suriname: "sr", sweden: "se", switzerland: "ch", syria: "sy",
  taiwan: "tw", tajikistan: "tj", tanzania: "tz", thailand: "th", togo: "tg",
  tonga: "to", "trinidad and tobago": "tt", tunisia: "tn", turkey: "tr", turkmenistan: "tm",
  uganda: "ug", ukraine: "ua", "united arab emirates": "ae", uae: "ae",
  "united kingdom": "gb", uk: "gb", britain: "gb", england: "gb", scotland: "gb", wales: "gb",
  "united states": "us", usa: "us", america: "us", uruguay: "uy", uzbekistan: "uz",
  vanuatu: "vu", "vatican city": "va", venezuela: "ve", vietnam: "vn", yemen: "ye",
  zambia: "zm", zimbabwe: "zw",
};

function normalizePlaceName(value: string): string {
  return value
    .toLowerCase()
    .replace(/[’']/g, "'")
    .replace(/\b(the|region|province|state|district|republic of)\b/g, " ")
    .replace(/[^a-z\s']/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function getCountryFlagUrl(countryCode: string): string {
  return `https://flagcdn.com/w1280/${countryCode}.png`;
}

export function resolveCountryIsoCode(destination: string): string | undefined {
  const cleanDestination = (destination || "").trim();
  if (!cleanDestination) return undefined;

  const parts = cleanDestination.split(",").map((part) => normalizePlaceName(part)).filter(Boolean);
  const candidates = [...parts].reverse();
  candidates.push(normalizePlaceName(cleanDestination));

  for (const candidate of candidates) {
    if (COUNTRY_ISO_CODES[candidate]) return COUNTRY_ISO_CODES[candidate];
  }

  const haystack = normalizePlaceName(cleanDestination);
  const ranked = Object.entries(COUNTRY_ISO_CODES).sort((a, b) => b[0].length - a[0].length);
  for (const [name, code] of ranked) {
    if (haystack === name || haystack.endsWith(` ${name}`) || haystack.includes(` ${name} `)) {
      return code;
    }
  }

  return undefined;
}

/**
 * Uses a curated city photo when we have one. Otherwise the destination country's
 * flag fills the hero so unknown cities still have a real place-specific backdrop.
 */
export function getDestinationImageUrls(destination: string): DestinationImageUrls {
  const cleanDestination = (destination || "Tokyo, Japan").trim();
  const parts = cleanDestination.split(",").map((p) => p.trim());
  const city = parts[0] || "Travel";
  const country = parts[parts.length - 1] || parts[0] || "World";

  const normalizedCity = city.toLowerCase();
  const normalizedCountry = country.toLowerCase();

  let curatedPhoto: string | undefined = undefined;
  for (const [key, photoUrl] of Object.entries(CURATED_HUB_PHOTOS)) {
    if (normalizedCity === key || normalizedCountry === key || normalizedCity.includes(key)) {
      curatedPhoto = photoUrl;
      break;
    }
  }

  const countryCode = resolveCountryIsoCode(cleanDestination);
  const flagUrl = countryCode ? getCountryFlagUrl(countryCode) : undefined;
  const genericFallback = GLOBAL_FALLBACK_IMAGES[0];
  const countryLevelUrl = flagUrl || `https://source.unsplash.com/1600x900/?${encodeURIComponent(country)},nature,landmark,daylight`;

  if (curatedPhoto) {
    return {
      primary: curatedPhoto,
      countryLevel: countryLevelUrl,
      fallback: flagUrl || genericFallback,
      curated: curatedPhoto,
      kind: "photo",
      countryCode,
    };
  }

  return {
    primary: flagUrl || genericFallback,
    countryLevel: countryLevelUrl,
    fallback: genericFallback,
    kind: flagUrl ? "flag" : "photo",
    countryCode,
  };
}
