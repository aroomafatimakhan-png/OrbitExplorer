export type PlanetData = {
  id: string;
  name: string;
  color: string;
  emissive?: string;
  radiusKm: number;
  distanceAu: number;
  orbitalPeriodDays: number;
  rotationHours: number;
  axialTiltDeg: number;
  moons: number;
  hasRings?: boolean;
  temperatureC: string;
  composition: string;
  fact: string;
};

// Real astronomical data. Visual scene scales radius and distance
// logarithmically/independently so the whole system is legible on one screen —
// true-to-scale would put Neptune 2,700x further out than Mercury is wide.
export const PLANETS: PlanetData[] = [
  {
    id: "mercury",
    name: "Mercury",
    color: "#9C9284",
    radiusKm: 2439.7,
    distanceAu: 0.39,
    orbitalPeriodDays: 88,
    rotationHours: 1407.6,
    axialTiltDeg: 0.03,
    moons: 0,
    temperatureC: "-173 to 427",
    composition: "Rocky, iron core ~85% of planet radius",
    fact: "A day on Mercury (sunrise to sunrise) lasts 176 Earth days — longer than its year.",
  },
  {
    id: "venus",
    name: "Venus",
    color: "#D8B978",
    radiusKm: 6051.8,
    distanceAu: 0.72,
    orbitalPeriodDays: 224.7,
    rotationHours: -5832.5,
    axialTiltDeg: 177.4,
    moons: 0,
    temperatureC: "~465 (surface)",
    composition: "Rocky, thick CO2 atmosphere, sulfuric acid clouds",
    fact: "Venus rotates backwards and so slowly that its day is longer than its year.",
  },
  {
    id: "earth",
    name: "Earth",
    color: "#3B82C4",
    radiusKm: 6371,
    distanceAu: 1.0,
    orbitalPeriodDays: 365.25,
    rotationHours: 23.93,
    axialTiltDeg: 23.44,
    moons: 1,
    temperatureC: "-88 to 58",
    composition: "Rocky, nickel-iron core, nitrogen-oxygen atmosphere",
    fact: "Earth's 23.44° axial tilt is the reason we have seasons.",
  },
  {
    id: "mars",
    name: "Mars",
    color: "#B5522E",
    radiusKm: 3389.5,
    distanceAu: 1.52,
    orbitalPeriodDays: 687,
    rotationHours: 24.6,
    axialTiltDeg: 25.19,
    moons: 2,
    temperatureC: "-153 to 20",
    composition: "Rocky, iron oxide surface, thin CO2 atmosphere",
    fact: "Mars hosts Olympus Mons, the largest volcano in the solar system at ~22 km high.",
  },
  {
    id: "jupiter",
    name: "Jupiter",
    color: "#C8A277",
    radiusKm: 69911,
    distanceAu: 5.2,
    orbitalPeriodDays: 4333,
    rotationHours: 9.93,
    axialTiltDeg: 3.13,
    moons: 95,
    temperatureC: "-108 (cloud tops)",
    composition: "Gas giant — hydrogen and helium, rocky/metallic core",
    fact: "The Great Red Spot is a storm wider than Earth that has raged for at least 190 years.",
  },
  {
    id: "saturn",
    name: "Saturn",
    color: "#E3C88F",
    radiusKm: 58232,
    distanceAu: 9.58,
    orbitalPeriodDays: 10759,
    rotationHours: 10.7,
    axialTiltDeg: 26.73,
    moons: 146,
    hasRings: true,
    temperatureC: "-139 (cloud tops)",
    composition: "Gas giant — hydrogen and helium, icy ring system",
    fact: "Saturn is so low-density it would float in a bathtub large enough to hold it.",
  },
  {
    id: "uranus",
    name: "Uranus",
    color: "#9FDCE0",
    radiusKm: 25362,
    distanceAu: 19.2,
    orbitalPeriodDays: 30687,
    rotationHours: -17.2,
    axialTiltDeg: 97.77,
    moons: 28,
    hasRings: true,
    temperatureC: "-197 (cloud tops)",
    composition: "Ice giant — water, methane, ammonia ices",
    fact: "Uranus spins almost on its side, likely from an ancient collision.",
  },
  {
    id: "neptune",
    name: "Neptune",
    color: "#3F5FD6",
    radiusKm: 24622,
    distanceAu: 30.05,
    orbitalPeriodDays: 60190,
    rotationHours: 16.1,
    axialTiltDeg: 28.32,
    moons: 16,
    temperatureC: "-201 (cloud tops)",
    composition: "Ice giant — water, methane, ammonia ices",
    fact: "Neptune's winds reach up to 2,100 km/h, the fastest measured in the solar system.",
  },
];
