import { MetadataRoute } from 'next'
import { sanityClient } from '../../sanity/lib/client'

async function fetchDynamicPaths() {
  try {
    const query = `*[_type == "listing"]{ 
      _id,
    }`;
    const projects = await sanityClient.fetch(query);

    // Correctly access the `slug` property for each project
    return projects.map((project: any) => `/listings/${project._id}`);
  } catch (error) {
    console.error(error);
    return [];
  }
}

var dynamicPaths = await fetchDynamicPaths();


export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://swom.travel';

  const staticPaths = [
    '/',
    '/home',
    '/how-it-works',
    '/membership',
    '/listings',
    '/about-us',
    '/become-member',
  ];

  const combinedPaths = [...staticPaths, ...dynamicPaths];

  const formattedPaths = combinedPaths.map((path) => {
    return {
      url: `${baseUrl}${path}`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    };
  })

  return formattedPaths as MetadataRoute.Sitemap;

}