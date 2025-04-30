import React from 'react';
import Indices from '../components/Indices'; // Some content component
import IndexCard from '../components/IndexCard'; // Some content component
import StockCollection from './StockCollection';

const IndSection = () => {
	return (
		<div>
			<div className="w-full max-w-[1280px] mx-auto px-4 flex gap-4 my-8 mt-[2rem]">
				<div className="w-full max-w-[800px]">
					<Indices />
					<div className="flex">
						<IndexCard />
						<IndexCard />
						<IndexCard />
					</div>
				</div>

				<div className="flex-1">
					<div className="bg-gray-100 p-4 rounded">Other Content</div>
				</div>
			</div>
			<div className='w-full max-w-[1280px] mx-auto px-4 flex gap-4 my-8 mt-[2rem]'>
				<StockCollection />
			</div>
		</div>
	);
};

export default IndSection;
