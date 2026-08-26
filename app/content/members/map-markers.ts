/**
 * The 57 markers on the members map.
 *
 * **Generated from the artwork, not placed by hand.** `world-map-dots.svg`
 * turned out to hold nothing but the markers — 57 circles, no landmass; the map
 * itself is the separate `decor-map-frame.svg`, one path of 107 subpaths. So
 * every coordinate below was read straight out of that file and converted to a
 * percentage of its 1505 x 752 box. Re-export the artwork and these need
 * regenerating with it.
 *
 * **They are plotted geographically**, which was worth checking rather than
 * assuming. Read as bare numbers the coordinates span almost the whole box,
 * corner to corner, which looks like decoration scattered for effect. Rendered
 * over the map they are nothing of the sort: all 57 sit on land, and the
 * extremes turn out to be Alaska and a point beyond Australia rather than open
 * ocean. Marker coordinates mean nothing without the map under them.
 *
 * **Only Jakarta's name comes from the design. The other 56 are read off the
 * map.** Figma draws a single callout, "Jakarta, ID", and a 2px leader line
 * dropping from it (`404:28201`); that line lands 3px from the national-tier
 * marker at (1171, 572), and the tier matches the tag's own "National Members".
 * That one is measured.
 *
 * The rest were identified by rendering every marker over the map with its
 * index printed on it and reading which country each dot sits on. That is
 * honest about WHERE a dot is and silent about anything else — so each is named
 * for its country rather than a city, because a dot inside France does not say
 * Paris.
 *
 * TODO(design) / B2: these names are therefore **placeholder**, on the same
 * footing as the rest of `mock/` — a country the artwork put a dot on, not a
 * member the federation has confirmed. When the real member list arrives it
 * replaces this file wholesale, and the markers should come with it rather than
 * being matched back onto the artwork.
 */

export type MapMarker = {
  id: string
  tier: "national" | "regional" | "club" | "continent"
  /** What the callout prints. Jakarta is the design's; the rest are countries
   *  read off the map — see the note above. */
  place: string
  /** Percentages of the marker layer, so they hold at any width. */
  x: number
  y: number
}

export const MAP_MARKERS: readonly MapMarker[] = [
  {
    id: "m01",
    tier: "regional",
    place: "Greenland",
    x: 33.289,
    y: 1.197,
  },
  {
    id: "m02",
    tier: "continent",
    place: "Canada",
    x: 12.359,
    y: 17.154,
  },
  {
    id: "m03",
    tier: "national",
    place: "Russia",
    x: 71.429,
    y: 19.548,
  },
  {
    id: "m04",
    tier: "national",
    place: "Russia",
    x: 97.076,
    y: 20.213,
  },
  {
    id: "m05",
    tier: "national",
    place: "Norway",
    x: 47.575,
    y: 20.878,
  },
  {
    id: "m06",
    tier: "national",
    place: "Russia",
    x: 60.598,
    y: 20.878,
  },
  {
    id: "m07",
    tier: "national",
    place: "United States",
    x: 0.598,
    y: 21.543,
  },
  {
    id: "m08",
    tier: "national",
    place: "Russia",
    x: 77.143,
    y: 26.064,
  },
  {
    id: "m09",
    tier: "regional",
    place: "Russia",
    x: 85.515,
    y: 27.394,
  },
  {
    id: "m10",
    tier: "national",
    place: "Canada",
    x: 10.233,
    y: 28.989,
  },
  {
    id: "m11",
    tier: "regional",
    place: "Canada",
    x: 22.06,
    y: 28.989,
  },
  {
    id: "m12",
    tier: "club",
    place: "Russia",
    x: 93.754,
    y: 29.255,
  },
  {
    id: "m13",
    tier: "national",
    place: "Kazakhstan",
    x: 71.096,
    y: 32.314,
  },
  {
    id: "m14",
    tier: "national",
    place: "Italy",
    x: 46.379,
    y: 32.979,
  },
  {
    id: "m15",
    tier: "national",
    place: "Mongolia",
    x: 86.512,
    y: 33.644,
  },
  {
    id: "m16",
    tier: "club",
    place: "United States",
    x: 6.578,
    y: 36.569,
  },
  {
    id: "m17",
    tier: "national",
    place: "United States",
    x: 17.608,
    y: 36.569,
  },
  {
    id: "m18",
    tier: "national",
    place: "Greece",
    x: 50.498,
    y: 37.899,
  },
  {
    id: "m19",
    tier: "club",
    place: "Türkiye",
    x: 63.787,
    y: 39.229,
  },
  {
    id: "m20",
    tier: "national",
    place: "China",
    x: 85.515,
    y: 39.229,
  },
  {
    id: "m21",
    tier: "club",
    place: "United States",
    x: 15.415,
    y: 40.559,
  },
  {
    id: "m22",
    tier: "regional",
    place: "Japan",
    x: 89.369,
    y: 40.559,
  },
  {
    id: "m23",
    tier: "regional",
    place: "China",
    x: 75.947,
    y: 43.617,
  },
  {
    id: "m24",
    tier: "national",
    place: "Mexico",
    x: 9.568,
    y: 46.543,
  },
  {
    id: "m25",
    tier: "national",
    place: "South Korea",
    x: 87.708,
    y: 47.207,
  },
  {
    id: "m26",
    tier: "continent",
    place: "Pakistan",
    x: 68.372,
    y: 48.537,
  },
  {
    id: "m27",
    tier: "national",
    place: "China",
    x: 79.934,
    y: 48.537,
  },
  {
    id: "m28",
    tier: "regional",
    place: "Cuba",
    x: 10.897,
    y: 49.335,
  },
  {
    id: "m29",
    tier: "national",
    place: "United Arab Emirates",
    x: 64.12,
    y: 50.665,
  },
  {
    id: "m30",
    tier: "club",
    place: "Saudi Arabia",
    x: 62.591,
    y: 52.66,
  },
  {
    id: "m31",
    tier: "national",
    place: "China",
    x: 80.864,
    y: 53.989,
  },
  {
    id: "m32",
    tier: "continent",
    place: "Algeria",
    x: 44.784,
    y: 55.186,
  },
  {
    id: "m33",
    tier: "national",
    place: "Myanmar",
    x: 76.611,
    y: 55.851,
  },
  {
    id: "m34",
    tier: "national",
    place: "India",
    x: 69.834,
    y: 56.516,
  },
  {
    id: "m35",
    tier: "regional",
    place: "Egypt",
    x: 50.498,
    y: 59.84,
  },
  {
    id: "m36",
    tier: "club",
    place: "Sudan",
    x: 54.551,
    y: 60.505,
  },
  {
    id: "m37",
    tier: "continent",
    place: "Bangladesh",
    x: 75.681,
    y: 60.505,
  },
  {
    id: "m38",
    tier: "national",
    place: "Myanmar",
    x: 76.611,
    y: 61.835,
  },
  {
    id: "m39",
    tier: "regional",
    place: "Nigeria",
    x: 40.93,
    y: 63.165,
  },
  {
    id: "m40",
    tier: "national",
    place: "Ethiopia",
    x: 54.219,
    y: 63.165,
  },
  {
    id: "m41",
    tier: "national",
    place: "Chad",
    x: 48.239,
    y: 65.691,
  },
  {
    id: "m42",
    tier: "national",
    place: "Malaysia",
    x: 75.947,
    y: 68.218,
  },
  {
    id: "m43",
    tier: "national",
    place: "Kenya",
    x: 54.551,
    y: 70.479,
  },
  {
    id: "m44",
    tier: "regional",
    place: "Indonesia",
    x: 76.611,
    y: 70.479,
  },
  {
    id: "m45",
    tier: "national",
    place: "Venezuela",
    x: 22.724,
    y: 73.404,
  },
  {
    id: "m46",
    tier: "national",
    place: "Colombia",
    x: 21.395,
    y: 74.069,
  },
  {
    id: "jakarta",
    tier: "national",
    place: "Jakarta, ID",
    x: 77.807,
    y: 76.064,
  },
  {
    id: "m48",
    tier: "national",
    place: "DR Congo",
    x: 50.166,
    y: 78.59,
  },
  {
    id: "m49",
    tier: "national",
    place: "Brazil",
    x: 26.246,
    y: 81.782,
  },
  {
    id: "m50",
    tier: "continent",
    place: "Bolivia",
    x: 24.518,
    y: 83.112,
  },
  {
    id: "m51",
    tier: "national",
    place: "Madagascar",
    x: 58.671,
    y: 83.777,
  },
  {
    id: "m52",
    tier: "national",
    place: "Australia",
    x: 86.179,
    y: 86.968,
  },
  {
    id: "m53",
    tier: "regional",
    place: "Brazil",
    x: 27.309,
    y: 90.559,
  },
  {
    id: "m54",
    tier: "regional",
    place: "Zambia",
    x: 52.093,
    y: 91.223,
  },
  {
    id: "m55",
    tier: "club",
    place: "Australia",
    x: 89.701,
    y: 93.883,
  },
  {
    id: "m56",
    tier: "national",
    place: "New Zealand",
    x: 99.402,
    y: 94.548,
  },
  {
    id: "m57",
    tier: "national",
    place: "Argentina",
    x: 21.395,
    y: 98.803,
  },
]
