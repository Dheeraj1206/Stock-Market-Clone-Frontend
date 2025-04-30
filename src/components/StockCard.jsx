import React from 'react';

const StockCard = () => {
  return (
    <a
      href="/stocks/sonata-software-ltd"
      className="flex flex-col justify-between p-4 w-[188px] h-[172px] bg-white border border-gray-300 rounded-lg hover:shadow-md transition mr-2"
    >
      <div className="flex items-center justify-between">
        {/* Logo */}
        <div className="w-10 h-10 flex items-center justify-center bg-gray-100 border rounded">
          <img
            src="https://assets-netstorage.groww.in/stock-assets/logos2/SonataSoftware_68199282617_12490.png"
            alt="Sonata Software"
            className="w-full h-full object-contain"
          />
        </div>

        {/* Watchlist Icon */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="currentColor"
          viewBox="0 0 24 24"
          height="24"
          width="24"
          className="text-blue-600"
        >
          <path fill="none" d="M0 0h24v24H0z" />
          <path d="M13 7h-2v4H7v2h4v4h2v-4h4v-2h-4zm-1-5C6.48 2 2 6.48 2 12s4.48 10 10 10
          10-4.48 10-10S17.52 2 12 2m0 18c-4.41 0-8-3.59-8-8s3.59-8
          8-8 8 3.59 8 8-3.59 8-8 8" />
        </svg>
      </div>

      {/* Stock Info */}
      <div className="mt-1">
        <div className="text-sm font-semibold truncate">Sonata Software</div>
        <div className="text-sm font-bold">₹421.55</div>
        <div className="text-sm text-green-600 font-medium">+45.55 (12.11%)</div>
      </div>
    </a>
  );
};

export default StockCard;
