import React from 'react';
import StockCard from './StockCard';

const StockCollection = () => {
	return (
		<div className="mt-14 mb-18">
			<div className="mb-4">
				<span className="text-xl font-semibold">Most Traded on Groww</span>
			</div>
			<div className="flex">
				<StockCard />
				<StockCard />
				<StockCard />
				<StockCard />
			</div>
		</div>
	);
};

export default StockCollection;
