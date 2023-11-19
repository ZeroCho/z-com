import {Post} from "@/model/Post";

type Props = {
  pageParam?: number;
  queryKey: [_1: string, _2: string, _3: string],
}
export const getComments  = async ({ queryKey, pageParam }: Props) => {
  const [_1, id] = queryKey;
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/posts/${id}/comments?cursor=${pageParam || 0}`, {
    next: {
      tags: ['posts', id, 'comments'],
    },
    cache: 'no-store',
  });
  // The return value is *not* serialized
  // You can return Date, Map, Set, etc.

  if (!res.ok) {
    // This will activate the closest `error.js` Error Boundary
    throw new Error('Failed to fetch data')
  }

  return res.json();
}