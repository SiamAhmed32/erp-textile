// Authentication & Storage
export const TOKEN_NAME: string = process.env.NEXT_PUBLIC_TOKEN_NAME || 'APP_TOKEN';
export const REFRESH_TOKEN: string = process.env.NEXT_PUBLIC_REFRESH || 'APP_REFRESH';

// API Configuration
export const BASE_LIMIT: number = 10;

export const URL = {
	api: process.env.NEXT_PUBLIC_BACKEND || 'http://192.168.0.114:3030/api',
};

// Styling Constants
export const BORDER_COLOR = '#ccc';
export const BLACK_COLOR = '#000';
export const WHITE_COLOR = '#fff';
export const SUCCESS_COLOR = '#00AA55';
export const ERROR_COLOR = '#FF0000';
export const WARNING_COLOR = '#FFA500';

// App Settings
export const currencySign = '$';


