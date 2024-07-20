// preference-types2.ts
export enum PreferenceEnum {
  WatercolorMale = "WatercolorMale",
  GTAMale = "GTAMale",
  CyberpunkMale = "CyberpunkMale",
  PopartMale = "PopartMale",
  WatercolorFemale = "WatercolorFemale",
  GTAFemale = "GTAFemale",
  CyberpunkFemale = "CyberpunkFemale",
  PopartFemale = "PopartFemale",
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
    description: "Artistic portraits with soft watercolor tones ",
    imageUrl: "/images/male-watercolor.png",
  },
  {
    key: PreferenceEnum.GTAMale,
    gender: "man",
    title: "GTA Boss",
    description: "Grand Theft Auto inspired boss portraits",
    imageUrl: "/images/male-gta.png",
  },
  {
    key: PreferenceEnum.CyberpunkMale,
    gender: "man",
    title: "Cyberpunk",
    description: "Futuristic with neon cyber themes",
    imageUrl: "/images/male-cyberpunk.png",
  },
  {
    key: PreferenceEnum.PopartMale,
    gender: "man",
    title: "Pop Art",
    description: "Vibrant portraits in classic pop art style",
    imageUrl: "/images/male-popart.png",
  },
  {
    key: PreferenceEnum.WatercolorFemale,
    gender: "woman",
    title: "Watercolor",
    description: "Delicate portraits in soft watercolor hues",
    imageUrl: "/images/female-watercolor.png",
  },
  {
    key: PreferenceEnum.GTAFemale,
    gender: "woman",
    title: "GTA Boss",
    description: "Grand Theft Auto inspired femme fatale",
    imageUrl: "/images/female-gta.png",
  },
  {
    key: PreferenceEnum.CyberpunkFemale,
    gender: "woman",
    title: "Cyberpunk",
    description: "Futuristic with neon cyber elements",
    imageUrl: "/images/female-cyberpunk.png",
  },
  {
    key: PreferenceEnum.PopartFemale,
    gender: "woman",
    title: "Pop Art",
    description: "Lively portraits in vibrant pop art style",
    imageUrl: "/images/female-popart.png",
  },
];
