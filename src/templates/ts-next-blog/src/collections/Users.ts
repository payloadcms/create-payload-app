import { CollectionConfig } from 'payload/types';

export const Users: CollectionConfig = {
  auth: true,
  admin: {
    useAsTitle: 'name',
  },
  slug: 'users',
  fields: [
    // Email added by default
    {
      name: 'name',
      type: 'text',
    },
    {
      name: 'picture',
      type: 'upload',
      relationTo: 'media',
    },
  ],
};

export default Users;
