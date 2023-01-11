import { AfterChangeHook } from 'payload/dist/collections/config/types';
import { revalidatePath } from './revalidatePath';

export const revalidatePost: AfterChangeHook = async ({ doc }) => {
  const postURL = new URL(`${process.env.PAYLOAD_PUBLIC_SERVER_URL}/posts/${doc.slug}`);
  revalidatePath(postURL.pathname);

  return doc;
};
