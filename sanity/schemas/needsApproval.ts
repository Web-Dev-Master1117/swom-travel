import { defineType } from 'sanity';

export default defineType({
  name: 'needsApproval',
  title: 'Add Listings',
  type: 'document',
  fields: [
    // {
    //   name: 'subscribed',
    //   title: 'Subscription',
    //   type: 'boolean',
    //   description: 'Whether the listing is a subscription or not',
    // },
    {
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'userInfo.name', // Assuming 'name' is a field under 'userInfo'
        maxLength: 96,
      },
    },
    {
      name: 'userInfo',
      title: 'User Information',
      type: 'userInfo', // Referencing the userInfo schema
    },
    {
      name: 'homeInfo',
      title: 'Home Information',
      type: 'homeInfo', // Referencing the homeInfo schema
    },
    {
      name: 'amenities',
      title: 'Amenities',
      type: 'amenities', // Referencing the amenities schema
    },


    // ... other fields like status, images, etc.
  ],
  preview: {
    select: {
      title: 'userInfo.name', // Assuming 'name' is a field under 'userInfo'
      profileImage: 'userInfo.profileImage', // Path to the image URL
    },
    prepare(selection) {
      const { title, profileImage } = selection;
      return {
        title,
        media: profileImage ? profileImage : undefined,
      };
    },
  }
}
);
