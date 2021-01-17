import { buildConfig } from 'payload/config';
import TodoLists from './collections/TodoLists';
import Users from './collections/Users';

export default buildConfig({
  admin: {
    user: Users.slug,
  },
  collections: [
    TodoLists,
    Users,
  ],
});
