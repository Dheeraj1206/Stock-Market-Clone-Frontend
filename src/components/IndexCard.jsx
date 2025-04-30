import React from 'react';

const IndexCard = () => {
	return (
		<div className="w-[230px] h-[76px] border border-gray-300 rounded-lg px-3.5 py-4 flex flex-col justify-between mr-2 cursor-pointer">
			{/* Title Section */}
			<div className="text-sm mb-1.5">NIFTY</div>

			{/* Price Section */}
			<div className="flex text-sm">
				<div className="">24,334.20</div>
				<div className="text-red-500">-1.75 (0.01%)</div>
			</div>
		</div>
	);
};

export default IndexCard;
