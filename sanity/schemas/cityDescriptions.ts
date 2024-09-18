import { defineType } from 'sanity';

export default defineType({
  title: 'City Descriptions',
  name: 'city',
  type: 'document',
  fields: [
    {
      name: 'city',
      title: 'City Name',
      type: 'string',
      description: 'The name of the city'
    },
    {
      name: 'country',
      title: 'Country',
      type: 'string',
      description: 'The country where the city is located'
    },
    {
      name: 'description',
      title: 'Description',
      type: 'text',
      description: 'A detailed description of the city'
    }
  ]
});
