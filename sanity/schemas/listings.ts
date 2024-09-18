import { defineType } from 'sanity';

export default defineType({
  name: 'listing',
  title: 'Live Listings',
  type: 'document',
  fields: [
    // {
    //   name: 'subscribed',
    //   title: 'Subscription',
    //   type: 'boolean',
    //   description: 'Whether the listing is a subscription or not',
    // },
    {
      name: 'orderRank',
      title: 'Order Rank',
      type: 'string',
      hidden: true, // Hide this field in the studio
    },
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
      name: 'highlightTag',
      title: 'Highlight Tag',
      type: 'string',
      description: 'Small tag to include if listing is highlighted',
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
  ],
  preview: {
    select: {
      slug: 'slug',
      title: 'userInfo.name', // Assuming 'name' is a field under 'userInfo'
      profileImage: 'userInfo.profileImage', // Path to the image URL
    },
    prepare(selection) {
      const { title, profileImage, slug } = selection;
      return {
        title: slug ? `${title} - ${slug.current}` : title,
        media: profileImage ? profileImage : undefined,
      };
    },
  }
}
);
