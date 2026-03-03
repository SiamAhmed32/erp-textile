import { cookies } from 'next/headers';
'use server';
type GetAllProps = {
	limit?: number;
	sort?: string;
	status?: string;
	path: string;
	page?: number;
	filters?: Record<string, string | number | boolean>;
};
const BASE_URL = process.env.NEXT_PUBLIC_BACKEND;

async function getAll({
	limit = 10,
	sort = '-createdAt',
	status = 'published',
	path,
	page = 1,
	filters = {},
}: GetAllProps) {
	const cookieStore = await cookies();
	const token = cookieStore.get('token')?.value;

	const headers: Record<string, string> = {
		'Content-Type': 'application/json',
	};

	if (token) {
		headers['authorization'] = `Bearer ${token}`;
	}

	// Build query parameters
	const params = new URLSearchParams({
		limit: limit.toString(),
		sort,
		page: page.toString(),
		status,
		...Object.entries(filters).reduce((acc, [key, value]) => {
			acc[key] = value.toString();
			return acc;
		}, {} as Record<string, string>),
	});

	// Always add the published status (assuming this is for published properties)

	const api = `${BASE_URL}/${path}?${params.toString()}`;
	// console.log('api::', api); // Debug log to see the URL

	const res = await fetch(api, {
		method: 'GET',
		next: { revalidate: 60 }, // ISR with 60-second revalidation
		headers,
	});

	if (!res.ok) {
		console.error(`Failed to fetch contents, Status: ${res.status}`);
		const errorText = await res.text();
		console.error('Error response:', errorText);
		return { doc: [] }; // Fallback to prevent crashes
	}

	const data = await res.json();
	return data; // Expected format: { doc: [...] }
}

export default getAll;
