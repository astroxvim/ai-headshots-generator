import { Service, ServiceEnum } from './ai-service-types';

export const services: Service[] = [
  {
    key: ServiceEnum.Professional,
    title: "Professional Headshots",
    price: "$1",
    priceSuffix: "per use", // Add the price suffix here
    description: "Photos for professional and career use",
    features: [
      "Studio or on-location style options",
      "Set of 4 high-quality images",
      "No account creation required",
      "No subscriptions or bundles",
      "No personal data collection",
      "Private and secure"
    ],
    buttonText: "Get Started",
    buttonColor: "primary",
    buttonVariant: "solid",
    mostPopular: true,
    imageUrl: "./images/prohead.png" // Add your image URL here
  },
  {
    key: ServiceEnum.Creative,
    title: "Creative Artwork",
    price: "$1",
    priceSuffix: "per use", // Add the price suffix here
    description: "Artistic and expressive photo creations",
    features: [
      "6 distinct creative options",
      "Set of 4 high-quality images",
      "No account creation required",
      "No subscriptions or bundles",
      "No personal data collection",
      "Private and secure"
    ],
    buttonText: "Coming Soon",
    buttonColor: "default",
    buttonVariant: "flat",
    imageUrl: "https://nextui-docs-v2.vercel.app/images/hero-card-complete.jpeg" // Add your image URL here
  },
];
