import React from 'react';
import Navbar from '../components/Navbar';
import FinancialNavbar from '../components/FinancialNavbar';
import IndSection from '../components/IndSection';

const HomePage = () => {
	return (
		<>
			<Navbar />
			<FinancialNavbar />
			<IndSection />
		</>
	);
};

export default HomePage;
