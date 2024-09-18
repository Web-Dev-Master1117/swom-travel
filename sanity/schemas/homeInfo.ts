
import { defineType } from "sanity";
export default defineType({
  name: 'homeInfo',
  title: 'Home Information',
  type: 'object',
  fields: [
    {
      name: 'title',
      type: 'string',
      title: 'Title',
      validation: Rule => Rule.required()
    },
    {
      name: 'address', type: 'geopoint', title: 'Address',
      validation: Rule => Rule.required().error('This field is required.')
    },
    {
      name: 'description', type: 'text', title: 'Description',
    },
    {
      name: 'listingImages',
      title: 'Listing Images',
      type: 'array',
      of: [{ type: 'image' }],
      options: {
        layout: 'grid',
      },
      validation: Rule => Rule.max(16).error('You can only upload up to 16 images.')
    },
    {
      name: 'property',
      type: 'string',
      title: 'Property Type',
      options: {
        list: [
          { value: 'House', title: 'House' },
          { value: 'Apartment', title: 'Apartment' },
          { value: 'Villa', title: 'Villa' },
          { value: 'Farm', title: 'Farm' },
          { value: 'Boat', title: 'Boat' },
          { value: 'RV', title: 'RV' },
          { value: 'Other', title: 'Other' }
        ]
      },
      validation: Rule => Rule.required().error('This field is required.')
    },
    {
      name: 'howManySleep', type: 'number', title: 'How Many Sleep', validation: Rule => Rule.required().error('This field is required.')
    },
    {
      name: 'locatedIn',
      type: 'string',
      title: 'Located In',
      options: {
        list: [
          { value: 'a condominium', title: 'A Condominium' },
          { value: 'a gated community', title: 'A Gated Community' },
          { value: 'it rests freely', title: 'It Rests Freely' },
          { value: 'other', title: 'Other' }
        ]
      },
      validation: Rule => Rule.required().error('This field is required.')
    },
    {
      name: 'city', type: 'string', title: 'City', validation: Rule => Rule.required().error('This field is required.')
    },
    {
      name: 'mainOrSecond', type: 'string', title: 'Main or Second Home', options: {
        list: [
          { value: 'main', title: 'Main' },
          { value: 'second', title: 'Second' }
        ]
      },
      validation: Rule => Rule.required().error('This field is required.')
    },
    {
      name: 'bathrooms', type: 'number', title: 'Bathrooms', validation: Rule => Rule.required().error('This field is required.')
    },
    {
      name: 'area', type: 'string', title: 'Area', options: {
        list: [
          { title: "60 - 100", value: "60-100" },
          { title: "100 - 150", value: "100-150" },
          { title: "150 - 200", value: "150-200" },
          {
            title: "200 - 250", value: "200-250"
          },
          { title: "250 - 300", value: "250-300" },
          { title: "300 - 350", value: "300-350" },
          { title: "350 - 400", value: "350-400" },
          { title: "400 - 450", value: "400-450" },
          { title: "450 - 500", value: "450-500" },
          { title: "500+", value: "500+" }
          // Add more options as needed
        ]
      }, validation: Rule => Rule.required().error('This field is required.')
    },
  ],

});
