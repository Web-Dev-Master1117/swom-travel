import { defineType } from "sanity";
export default defineType({
  name: 'highlightedListings',
  title: 'Highlighted Listings',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Title',
      type: 'string',
    },
    {
      name: 'listings',
      title: 'Listings',
      type: 'array',
      of: [
        {
          type: 'reference',
          to: [
            { type: 'listing' }, // This should match the name of your listing schema
          ],
        },
      ],
    },
  ],
});