import { Service, ServiceEnum } from './ai-service-types';

const price = process.env.NEXT_PUBLIC_PRICE || "5"; // Default to 4 if not set

export const services: Service[] = [
  {
    key: ServiceEnum.Professional,
    title: "Professional Headshots",
    price: `$${price}`, // Dollar sign concatenated with the price value
    priceSuffix: "per use", // Add the price suffix here
    description: "Photos for professional and career use",
    features: [
      '<span class="text-success">60% Discount! [Limited Time]</span>',
      "Studio or on-location style options",
      "Set of 8 high-quality images",
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
    price: `$${price}`, // Dollar sign concatenated with the price value
    priceSuffix: "per use", // Add the price suffix here
    description: "Artistic and expressive photo creations",
    features: [
      "6 distinct creative options",
      "Set of 8 high-quality images",
      "No account creation required",
      "No subscriptions or bundles",
      "No personal data collection",
      "Private and secure"
    ],
    buttonText: "Coming Soon",
    buttonColor: "default",
    buttonVariant: "flat",
    imageUrl: "./images/creativehead.png" // Add your image URL here
  },
];
