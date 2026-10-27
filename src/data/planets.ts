export interface PlanetData {
  id: string;
  name: string;
  color: string;
  glowColor: string;
  diameter: number; // km
  distanceFromSun: number; // million km
  orbitalPeriod: number; // Earth days
  displaySize: number; // px radius for display
  displayOrbit: number; // px radius for orbit
  description: string;
  moons: number;
  type: string;
}

export const planets: PlanetData[] = [
  {
    id: 'mercury',
    name: 'Mercury',
    color: '#b5b5b5',
    glowColor: '#8a8a8a',
    diameter: 4879,
    distanceFromSun: 57.9,
    orbitalPeriod: 88,
    displaySize: 4,
    displayOrbit: 60,
    description: 'The smallest planet and closest to the Sun. It has no atmosphere and extreme temperature variations.',
    moons: 0,
    type: 'Terrestrial',
  },
  {
    id: 'venus',
    name: 'Venus',
    color: '#e8cda0',
    glowColor: '#d4a853',
    diameter: 12104,
    distanceFromSun: 108.2,
    orbitalPeriod: 225,
    displaySize: 7,
    displayOrbit: 90,
    description: 'The hottest planet with a thick toxic atmosphere. It rotates backwards compared to most planets.',
    moons: 0,
    type: 'Terrestrial',
  },
  {
    id: 'earth',
    name: 'Earth',
    color: '#4da6ff',
    glowColor: '#2980b9',
    diameter: 12756,
    distanceFromSun: 149.6,
    orbitalPeriod: 365,
    displaySize: 8,
    displayOrbit: 125,
    description: 'Our home planet — the only known world with liquid water on its surface and life.',
    moons: 1,
    type: 'Terrestrial',
  },
  {
    id: 'mars',
    name: 'Mars',
    color: '#e07050',
    glowColor: '#c0392b',
    diameter: 6792,
    distanceFromSun: 227.9,
    orbitalPeriod: 687,
    displaySize: 6,
    displayOrbit: 160,
    description: 'The Red Planet, known for its iron oxide surface. Home to the tallest volcano in the solar system.',
    moons: 2,
    type: 'Terrestrial',
  },
  {
    id: 'jupiter',
    name: 'Jupiter',
    color: '#d4a574',
    glowColor: '#c0855c',
    diameter: 142984,
    distanceFromSun: 778.6,
    orbitalPeriod: 4333,
    displaySize: 18,
    displayOrbit: 210,
    description: 'The largest planet with a Great Red Spot storm raging for centuries. A gas giant with powerful magnetic field.',
    moons: 95,
    type: 'Gas Giant',
  },
  {
    id: 'saturn',
    name: 'Saturn',
    color: '#f0d890',
    glowColor: '#d4b86a',
    diameter: 120536,
    distanceFromSun: 1433.5,
    orbitalPeriod: 10759,
    displaySize: 15,
    displayOrbit: 270,
    description: 'Famous for its stunning ring system made of ice and rock. It is less dense than water!',
    moons: 146,
    type: 'Gas Giant',
  },
  {
    id: 'uranus',
    name: 'Uranus',
    color: '#7de8e8',
    glowColor: '#48c9b0',
    diameter: 51118,
    distanceFromSun: 2872.5,
    orbitalPeriod: 30687,
    displaySize: 11,
    displayOrbit: 330,
    description: 'An ice giant that rotates on its side. It has a blue-green color from methane in its atmosphere.',
    moons: 28,
    type: 'Ice Giant',
  },
  {
    id: 'neptune',
    name: 'Neptune',
    color: '#4169e1',
    glowColor: '#2c3e9e',
    diameter: 49528,
    distanceFromSun: 4495.1,
    orbitalPeriod: 60190,
    displaySize: 10,
    displayOrbit: 380,
    description: 'The windiest planet with speeds over 2,000 km/h. The farthest planet from the Sun.',
    moons: 16,
    type: 'Ice Giant',
  },
];
