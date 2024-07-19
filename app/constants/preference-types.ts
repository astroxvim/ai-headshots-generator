// preference-types.ts
export enum PreferenceEnum {
  StudioMale = "StudioMale",
  EnvironmentalMale = "EnvironmentalMale",
  StudioFemale = "StudioFemale",
  EnvironmentalFemale = "EnvironmentalFemale",
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
    key: PreferenceEnum.StudioMale,
    gender: "man",
    title: "Studio",
    description: "Clean, professional photos with studio lighting",
    imageUrl: "/images/male-studio.png",
  },
  {
    key: PreferenceEnum.EnvironmentalMale,
    gender: "man",
    title: "Environmental",
    description: "Professional photos in natural settings",
    imageUrl: "/images/male-environ.png",
  },
  {
    key: PreferenceEnum.StudioFemale,
    gender: "woman",
    title: "Studio",
    description: "Elegant, refined photos with perfect lighting",
    imageUrl: "/images/female-studio.png",
  },
  {
    key: PreferenceEnum.EnvironmentalFemale,
    gender: "woman",
    title: "Environmental",
    description: "Natural, genuine photos in real-world",
    imageUrl: "/images/female-environ.png",
  },
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
