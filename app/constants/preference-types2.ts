// preference-types2.ts
export enum PreferenceEnum {
  WatercolorMale = "WatercolorMale",
  CyberpunkMale = "CyberpunkMale",
  SuperheroMale = "SuperheroMale",
  WatercolorFemale = "WatercolorFemale",
  CyberpunkFemale = "CyberpunkFemale",
  SuperheroFemale = "SuperheroFemale",
}

export const genders = [
  {
    key: "man",
    label: "Male",
  },
  {
    key: "woman",
    label: "Female",
  },
];

export const preferenceOptions = [
  {
    key: PreferenceEnum.WatercolorMale,
    gender: "man",
    title: "Watercolor",
    description: "Creative watercolor style artwork",
    imageUrl: "/images/male-watercolor.png",
  },
  {
    key: PreferenceEnum.CyberpunkMale,
    gender: "man",
    title: "Cyberpunk",
    description: "Futuristic cyberpunk style artwork",
    imageUrl: "/images/male-cyberpunk.png",
  },
  {
    key: PreferenceEnum.SuperheroMale,
    gender: "man",
    title: "Superhero",
    description: "Epic superhero style artwork",
    imageUrl: "/images/male-superhero.png",
  },
  {
    key: PreferenceEnum.WatercolorFemale,
    gender: "woman",
    title: "Watercolor",
    description: "Creative watercolor style artwork",
    imageUrl: "/images/female-watercolor.png",
  },
  {
    key: PreferenceEnum.CyberpunkFemale,
    gender: "woman",
    title: "Cyberpunk",
    description: "Futuristic cyberpunk style artwork",
    imageUrl: "/images/female-cyberpunk.png",
  },
  {
    key: PreferenceEnum.SuperheroFemale,
    gender: "woman",
    title: "Superhero",
    description: "Epic superhero style artwork",
    imageUrl: "/images/female-superhero.png",
  },
];
