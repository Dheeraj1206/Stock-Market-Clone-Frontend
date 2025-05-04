import React, { useState, useEffect } from 'react';
import Indices from '../components/Indices';
import StockCollection from './StockCollection';
import API from '../config/api';
import ApiService from '../services/apiService';
import { filterValidStocks, filterValidSymbols } from '../utils/stockUtils';

const INITIAL_STATE = {
	sectors: [],
	isLoading: true,
	error: null,
};

const IndSection = () => {
	const [marketData, setMarketData] = useState(INITIAL_STATE);
	const [indicesData, setIndicesData] = useState([]);
	const [indicesLoading, setIndicesLoading] = useState(true);

	const fetchSectorData = async () => {
		try {
			setMarketData({ ...marketData, isLoading: true, error: null });

			const response = await fetch(API.SECTORS);

			if (!response.ok) {
				throw new Error(
					`Failed to fetch sector data: ${response.status} ${response.statusText}`
				);
			}

			const data = await response.json();
			console.log('API Response:', data);

			// Process MongoDB data format - the data should be an array of sector documents
			if (!Array.isArray(data)) {
				throw new Error(
					'Expected array of sectors but received a different format'
				);
			}

			// Extract Indian Indices data for the top indices section
			const indicesData = data.find(
				(sector) => sector.category === 'Indian Indices'
			) || { stocks: [] };

			// Fetch and filter valid indices to remove ones that cause errors
			const filteredIndices = await filterValidIndices(indicesData.stocks);

			// Filter out the Indices from sectors to display
			const filteredSectors = data.filter(
				(sector) => sector.category !== 'Indian Indices'
			);

			console.log(
				'Valid sectors for display:',
				filteredSectors.map((s) => s.category)
			);

			if (filteredSectors.length === 0) {
				throw new Error('No valid sector data received from server');
			}

			setMarketData({
				sectors: filteredSectors,
				isLoading: false,
				error: null,
			});
		} catch (error) {
			console.error('Error fetching sector data:', error);
			setMarketData({
				sectors: [],
				isLoading: false,
				error: error.message || 'Failed to load sector data',
			});
		}
	};

	const filterValidIndices = async (indices) => {
		try {
			// Filter out indices we can't fetch data for
			const symbols = indices.map((index) => index.symbol);
			const validSymbols = await filterValidSymbols(symbols);

			// Only keep indices with valid symbols
			const validIndices = indices.filter((index) =>
				validSymbols.includes(index.symbol)
			);
			console.log(
				`Found ${validIndices.length} valid indices out of ${indices.length}`
			);

			// Fetch prices for the valid indices
			fetchIndicesPrices(validIndices);

			return validIndices;
		} catch (error) {
			console.error('Error filtering valid indices:', error);
			// Return the original list if there's an error in filtering
			fetchIndicesPrices(indices.slice(0, 3));
			return indices;
		}
	};

	const fetchIndicesPrices = async (indices) => {
		try {
			setIndicesLoading(true);

			// Create an array to hold our promises
			const pricePromises = indices.map(async (index) => {
				try {
					// Use the ApiService to fetch prices
					const priceData = await ApiService.getStockPrice(index.symbol);

					return {
						title: index.name,
						symbol: index.symbol,
						value: priceData.currentPrice.toLocaleString('en-IN'),
						change: `${priceData.percentChange > 0 ? '+' : ''}${
							priceData.percentChange
						}%`,
						isPositive: parseFloat(priceData.percentChange) >= 0,
					};
				} catch (error) {
					console.error(`Error fetching price for ${index.symbol}:`, error);
					// Return a fallback with the index name but placeholder data
					return {
						title: index.name,
						symbol: index.symbol,
						value: '0.00',
						change: '0.00%',
						isPositive: true,
						hasError: true, // Mark this entry as having an error
					};
				}
			});

			// Wait for all price fetches to complete
			const allIndicesWithPrices = await Promise.all(pricePromises);

			// Filter out indices with errors
			const indicesWithPrices = allIndicesWithPrices.filter(
				(index) => !index.hasError
			);

			console.log(
				`Displaying ${indicesWithPrices.length} indices after filtering errors`
			);
			setIndicesData(indicesWithPrices);
			setIndicesLoading(false);
		} catch (error) {
			console.error('Error fetching indices prices:', error);
			setIndicesLoading(false);
			// Set default data if there's an error
			setIndicesData([]);
		}
	};

	useEffect(() => {
		fetchSectorData();
	}, []);

	return (
		<div className=" min-h-screen pb-10">
			<div className="w-full max-w-[1280px] mx-auto px-4 py-6">
				<div className="flex flex-col lg:flex-row gap-6">
					{/* Left column - Market data */}
					<div className="w-full lg:w-[800px]">
						{/* Indices section */}
						<div className="mb-6  p-3">
							{indicesLoading ? (
								<div className="text-center py-4">
									<div className="animate-pulse">
										<div className="h-6 bg-gray-200 rounded w-1/4 mx-auto mb-4"></div>
										<div className="flex justify-center space-x-4">
											<div className="h-16 bg-gray-200 rounded w-[230px]"></div>
											<div className="h-16 bg-gray-200 rounded w-[230px]"></div>
											<div className="h-16 bg-gray-200 rounded w-[230px]"></div>
										</div>
									</div>
									<p className="mt-3 text-gray-500">Loading indices data...</p>
								</div>
							) : (
								<Indices indices={indicesData} />
							)}
						</div>

						{/* Sectors section */}
						<div>
							{marketData.isLoading ? (
								<div className="text-center py-8 bg-white rounded-lg shadow-sm">
									<div className="animate-pulse">
										<div className="h-4 bg-gray-200 rounded w-1/4 mx-auto mb-4"></div>
										<div className="h-20 bg-gray-200 rounded w-full mx-auto"></div>
									</div>
									<p className="mt-4 text-gray-500">Loading sectors data...</p>
								</div>
							) : marketData.error ? (
								<div className="text-red-500 text-center py-4 bg-white rounded-lg shadow-sm border border-red-100">
									<p>Error: {marketData.error}</p>
									<button
										className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
										onClick={fetchSectorData}
									>
										Retry
									</button>
								</div>
							) : (
								<div>
									{marketData.sectors.length === 0 ? (
										<div className="text-center py-4">
											No sectors data available
										</div>
									) : (
										marketData.sectors.map((sector) => (
											<div key={sector._id}>
												<StockCollection
													title={sector.category}
													stocks={sector.stocks || []}
												/>
											</div>
										))
									)}
								</div>
							)}
						</div>
					</div>

					{/* Right column - Market news, etc. */}
					<div className="flex-1">
						<div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 sticky top-4">
							<h2 className="text-xl font-semibold mb-4">Market News</h2>
							<div className="space-y-4">
								<div className="pb-3 border-b border-gray-100">
									<h3 className="font-medium text-sm">
										Market rallies on strong earnings reports
									</h3>
									<p className="text-xs text-gray-500 mt-1">2 hours ago</p>
								</div>
								<div className="pb-3 border-b border-gray-100">
									<h3 className="font-medium text-sm">
										Tech stocks lead the gains as inflation concerns ease
									</h3>
									<p className="text-xs text-gray-500 mt-1">4 hours ago</p>
								</div>
								<div>
									<h3 className="font-medium text-sm">
										Banking sector shows resilience amid volatility
									</h3>
									<p className="text-xs text-gray-500 mt-1">6 hours ago</p>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default IndSection;
