import axios from 'axios';

const ASTRIA_API_URL = 'https://api.astria.com/generate'; // Replace with the actual API endpoint

const astriaApiKey = process.env.ASTRIA_API_KEY;

export const generateHeadshot = async (imageUrls: string[]): Promise<string> => {
  try {
    const response = await axios.post(
      ASTRIA_API_URL,
      { images: imageUrls },
      {
        headers: {
          Authorization: `Bearer ${astriaApiKey}`,
          'Content-Type': 'application/json',
        },
      }
    );

    return response.data.generatedImageUrl; // Adjust based on the actual response structure
  } catch (error) {
    console.error('Error generating headshot:', error);
    throw error;
  }
};
