export async function getTrends() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/hashtags/trends`, {
    next: {
      tags: ['trends'],
    },
    credentials: 'include',
    cache: 'no-store',
  });
  // The return value is *not* serialized
  // You can return Date, Map, Set, etc.

  if (!res.ok) {
    // This will activate the closest `error.js` Error Boundary
    throw new Error('Failed to fetch data')
  }

  return res.json()
}