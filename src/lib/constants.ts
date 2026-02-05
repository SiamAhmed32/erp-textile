export const TOKEN_NAME: string =
	process.env.NEXT_PUBLIC_TOKEN_NAME || 'APP_TOKEN';
export const BASE_LIMIT: number = 10;
export const URL: any = {
	api: process.env.NEXT_PUBLIC_BACKEND || 'http://localhost:5000',
};
export const REFRESH_TOKEN: string =
	process.env.NEXT_PUBLIC_REFRESH || 'APP_REFRESH';

export const SECTION_PADDING = '100px';
export const takaSign = '৳';
export const dollarSign = '$';