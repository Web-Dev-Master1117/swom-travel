import { defineType } from 'sanity';
export default defineType({
  name: 'userInfo',
  title: 'User Information',
  type: 'object',
  fields: [
    { name: 'name', type: 'string', title: 'Name', validation: Rule => Rule.required().error('This field is required.') },
    {
      name: 'profileImage', type: 'image', title: 'Profile Image',
    },
    {
      name: 'dob', type: 'date', title: 'Date of Birth',
    },
    { name: 'email', type: 'string', title: 'Email', validation: Rule => Rule.required().error('This field is required.') },
    {
      name: 'phone', type: 'string', title: 'Phone', validation: Rule => Rule.required().regex(/^\+\d+/, 'Phone number must start with a country code (+ followed by digits)')
    },
    { name: 'age', type: 'number', title: 'Age' },
    { name: 'profession', type: 'string', title: 'Profession' },
    { name: 'about_me', type: 'text', title: 'About Me' },
    {
      name: 'children', type: 'string', title: 'Children', options: {
        list: [
          { title: 'Always', value: 'always' },
          { title: 'Sometimes', value: 'sometimes' },
          { title: 'Never', value: 'never' },
        ],
        layout: 'radio', // if you want the options as radio buttons
      },
    },
    { name: 'recommended', type: 'string', title: 'Recommended' },
    {
      name: 'openToOtherCities', type: 'object', title: 'Open to Other Cities',
      fields: [
        { name: 'cityVisit1', type: 'string', title: 'City Visit 1' },
        { name: 'cityVisit2', type: 'string', title: 'City Visit 2' },
        { name: 'cityVisit3', type: 'string', title: 'City Visit 3' }
      ]
    },
    { name: 'openToOtherDestinations', type: 'boolean', title: 'Open to Other Destinations' }
  ]
});
