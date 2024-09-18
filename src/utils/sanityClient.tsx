// create a sanity client and export it
import { createClient } from 'next-sanity';

const config = {
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  token: process.env.NEXT_PUBLIC_SANITY_API_TOKEN,
  apiVersion: '2024-01-22',
  useCdn: false,
};

export const sanityClient = createClient(config);
