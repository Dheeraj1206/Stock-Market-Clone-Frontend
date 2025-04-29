import React from 'react';

const Home = () => {
	return (
		<div className='flex items-center justify-center'>
			<div className="flex items-end h-[3.5rem] w-[80rem] space-x-4 px-4 sm:px-8">
				<div className='mr-9'>Stocks</div>
				<div className='mr-9'>F&O</div>
				<div className='mr-9'>Mutual Funds</div>
			</div>
		</div>
	);
};

export default Home;
