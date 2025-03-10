import { PreferenceEnum } from "./preference-types";

// Correcting the preference option keys
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
];
