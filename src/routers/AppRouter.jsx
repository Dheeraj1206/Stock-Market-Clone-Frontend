import React from 'react';
import { Routes, Route } from 'react-router-dom';
import PrivateRoute from './PrivateRoute';

const AppRouter = () => {
	return (
		<Routes>
			<Route path="*" element={<PrivateRoute />} />
		</Routes>
	);
};

export default AppRouter;
