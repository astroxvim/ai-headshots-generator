// preference-types.ts
export enum PreferenceEnum {
  StudioMale = "StudioMale",
  EnvironmentalMale = "EnvironmentalMale",
  StudioFemale = "StudioFemale",
  EnvironmentalFemale = "EnvironmentalFemale",
}

export const genders = [
  {
    key: "male",
    label: "Male",
  },
  {
    key: "female",
    label: "Female",
  },
];

export const preferenceOptions = [
  {
    key: PreferenceEnum.StudioMale,
    gender: "male",
    title: "Studio Male",
    description: "Clean, professional photos with studio lighting",
    imageUrl: "/images/male-studio.png",
  },
  {
    key: PreferenceEnum.EnvironmentalMale,
    gender: "male",
    title: "Environmental Male",
    description: "Professional photos in natural settings",
    imageUrl: "/images/male-environ.png",
  },
  {
    key: PreferenceEnum.StudioFemale,
    gender: "female",
    title: "Studio Female",
    description: "Elegant, refined photos with perfect lighting",
    imageUrl: "/images/female-studio.png",
  },
  {
    key: PreferenceEnum.EnvironmentalFemale,
    gender: "female",
    title: "Environmental Female",
    description: "Natural, genuine photos in real-world",
    imageUrl: "/images/female-environ.png",
  },
];
