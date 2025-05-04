import React, { useState } from 'react';
import ApiService from '../services/apiService';

const IndexCard = ({
	title = 'Index',
	value = '0.00',
	change = '0.00%',
	isPositive = false,
	symbol = '',
	onClick = () => {},
}) => {
	const [details, setDetails] = useState(null);
	const [loading, setLoading] = useState(false);

	const handleClick = async () => {
		// If we already have details, just call the onClick handler
		if (details) {
			onClick();
			return;
		}

		// Otherwise fetch the details first
		if (symbol) {
			try {
				setLoading(true);
				const data = await ApiService.getStockPrice(symbol);

				const detailsData = {
					open: data.openPrice?.toLocaleString('en-IN') || 'N/A',
					close: data.currentPrice?.toLocaleString('en-IN') || 'N/A',
					high: data.highPrice?.toLocaleString('en-IN') || 'N/A',
					low: data.lowPrice?.toLocaleString('en-IN') || 'N/A',
					volume: data.volume?.toLocaleString('en-IN') || 'N/A',
					lastUpdated: data.lastUpdated
						? new Date(data.lastUpdated).toLocaleTimeString()
						: 'N/A',
				};

				setDetails(detailsData);
				setLoading(false);

				// Call the onClick handler with the details
				onClick(detailsData);
			} catch (error) {
				console.error(`Error fetching details for ${symbol}:`, error);
				setDetails({
					open: 'N/A',
					close: 'N/A',
					high: 'N/A',
					low: 'N/A',
					volume: 'N/A',
					lastUpdated: 'N/A',
				});
				setLoading(false);
				onClick();
			}
		} else {
			onClick();
		}
	};

	return (
		<div
			className="w-[230px] h-[76px] border border-gray-300 rounded-lg px-3.5 py-3 flex flex-col justify-between mx-2 my-1 cursor-pointer hover:border-green-500 hover:shadow-sm transition-all duration-200 relative bg-white"
			onClick={handleClick}
		>
			<div className="flex justify-between items-center">
				<div className="text-sm font-medium truncate max-w-[160px]">
					{title}
				</div>
				{loading && (
					<div className="w-4 h-4 border-2 border-green-500 border-t-transparent rounded-full animate-spin"></div>
				)}
			</div>

			<div className="flex text-sm justify-between items-center">
				<div className="font-semibold">{value}</div>
				<div
					className={`${
						isPositive ? 'text-green-500' : 'text-red-500'
					} font-medium`}
				>
					{change}
				</div>
			</div>
		</div>
	);
};

export default IndexCard;
