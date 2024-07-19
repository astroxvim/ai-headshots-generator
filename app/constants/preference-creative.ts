// preference-types2.ts
export enum PreferenceEnum {
  WatercolorMale = "WatercolorMale",
  CyberpunkMale = "CyberpunkMale",
  PopartMale = "PopartMale",
  WatercolorFemale = "WatercolorFemale",
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
    description: "Expressive portraits with soft watercolor tones",
    imageUrl: "/images/male-watercolor.png",
  },
  {
    key: PreferenceEnum.CyberpunkMale,
    gender: "man",
    title: "Cyberpunk",
    description: "Futuristic photos with neon cyber themes",
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
    key: PreferenceEnum.CyberpunkFemale,
    gender: "woman",
    title: "Cyberpunk",
    description: "Futuristic photos with neon cyber elements",
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
