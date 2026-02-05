'use client';

import { store } from '@/store';
import { Provider } from 'react-redux';

interface ClientProviderProps {
	children: React.ReactNode;
}

function ReduxProvider({ children }: ClientProviderProps) {
	return <Provider store={store}>{children}</Provider>;
}

export default ReduxProvider;
