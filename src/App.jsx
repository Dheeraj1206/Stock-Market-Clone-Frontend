import React from 'react';
import AppRouter from './routers/AppRouter';
import Navbar from './components/Navbar';
import FinancialNavbar from './components/FinancialNavbar';

const App = () => (
	<>
		<Navbar />
		<div className="mt-[4.5rem] text-lg">
			<FinancialNavbar />
		</div>
		{/* <AppRouter /> */}
	</>
);

export default App;
