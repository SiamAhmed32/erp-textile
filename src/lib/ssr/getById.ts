'use server';

type GetByIdProps = {
  id: string;
  path: string;
};

const BASE_URL = process.env.NEXT_PUBLIC_BACKEND;

async function getById({ id, path }: GetByIdProps) {
  const token = process.env.NEXT_PUBLIC_TOKEN;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (token) {
    headers['authorization'] = `Bearer ${token}`; // Bearer prefix (adjust if not needed)
  }

  const api = `${BASE_URL}/${path}/${id}`; // Fetching a specific property by its `id`

  const res = await fetch(api, {
    next: { revalidate: 60 }, // ISR with 60-second revalidation
    headers,
  });

  if (!res.ok) {
    // If the request fails, return an empty doc to prevent crashes
    return { doc: null }; // Return null if no data is found
  }

  const data = await res.json();
  return data; // Expected format: { doc: {...} }
}

export default getById;
