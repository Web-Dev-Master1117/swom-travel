import { createClient } from 'next-sanity'

import { apiVersion, dataset, projectId, useCdn, authToken } from '../env'

export const sanityClient = createClient({
  apiVersion,
  dataset,
  projectId,
  useCdn,
  token: authToken,
})
