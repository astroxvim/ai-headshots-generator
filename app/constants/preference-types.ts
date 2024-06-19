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
    description: "Studio style for males",
    imageUrl: "/images/male-studio.png",
  },
  {
    key: PreferenceEnum.EnvironmentalMale,
    gender: "male",
    title: "Environmental Male",
    description: "Environmental style for males",
    imageUrl: "/images/male-environ.png",
  },
  {
    key: PreferenceEnum.StudioFemale,
    gender: "female",
    title: "Studio Female",
    description: "Studio style for females",
    imageUrl: "/images/female-studio.png",
  },
  {
    key: PreferenceEnum.EnvironmentalFemale,
    gender: "female",
    title: "Environmental Female",
    description: "Environmental style for females",
    imageUrl: "/images/female-environ.png",
  },
];
