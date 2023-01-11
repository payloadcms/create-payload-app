import { CollectionConfig } from 'payload/types';
import { revalidatePost } from '../utilities/revalidatePost';
import slug from './fields/slug';

const appURL = process.env.PAYLOAD_PUBLIC_SERVER_URL;

const Posts: CollectionConfig = {
  slug: 'posts',
  access: {
    read: () => true,
  },
  admin: {
    defaultColumns: ['title', 'author', 'date', 'slug'],
    preview: ({ slug }) => {
      return `${appURL}/api/preview?url=${appURL}/posts/${slug}`;
    },
  },
  hooks: {
    afterChange: [
      revalidatePost,
    ],
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'excerpt',
      type: 'textarea',
      required: true,
    },
    {
      name: 'coverImage',
      type: 'upload',
      relationTo: 'media',
      required: true,
    },
    slug,
    {
      name: 'date',
      type: 'date',
      required: true,
      admin: {
        position: 'sidebar',
      }
    },
    {
      name: 'author',
      type: 'relationship',
      relationTo: 'users',
      required: true,
      admin: {
        position: 'sidebar',
      }
    },
    {
      name: 'content',
      type: 'richText',
      required: true,
    },
    {
      name: 'ogImage',
      type: 'upload',
      relationTo: 'media'
    },
  ]
}

export default Posts;