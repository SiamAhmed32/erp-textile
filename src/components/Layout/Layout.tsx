import React from 'react';
import Footer from '../Footer/Footer';
import { Box } from '../reusables';
import { Navbar } from '../Navbar';

const Layout = ({ children }: any) => {
	return (
		<>
			<Navbar />
			<Box className='min-h-[100vh]'>{children}</Box>
			<Footer />
		</>
	);
};

export default Layout;
