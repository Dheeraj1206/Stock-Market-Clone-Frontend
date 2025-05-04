import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import ApiService from '../services/apiService';

const PortfolioPage = () => {
	const [portfolio, setPortfolio] = useState({
		holdings: [],
		summary: {
			totalCurrentValue: 0,
			totalInvestedValue: 0,
			totalProfitLoss: 0,
			totalProfitLossPercentage: 0,
		},
	});
	const [performance, setPerformance] = useState({
		performance: [],
		overall: {
			totalReturn: 0,
			totalReturnPercentage: 0,
		},
	});
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [showAddModal, setShowAddModal] = useState(false);
	const [activeTab, setActiveTab] = useState('holdings'); // 'holdings' or 'performance'
	const [formData, setFormData] = useState({
		symbol: '',
		quantity: '',
		buyPrice: '',
	});

	const navigate = useNavigate();

	useEffect(() => {
		// Check if user is logged in
		const token = localStorage.getItem('token');
		if (!token) {
			navigate('/login');
			return;
		}

		fetchPortfolioData();
	}, [navigate]);

	const fetchPortfolioData = async () => {
		try {
			setLoading(true);
			setError(null);

			// Fetch both portfolio and performance data
			const [portfolioData, performanceData] = await Promise.all([
				ApiService.getPortfolio(),
				ApiService.getPortfolioPerformance(),
			]);

			setPortfolio(portfolioData);
			setPerformance(performanceData);
			setLoading(false);
		} catch (error) {
			console.error('Error fetching portfolio data:', error);
			setError('Failed to load portfolio data. Please try again.');
			setLoading(false);
		}
	};

	const handleInputChange = (e) => {
		const { name, value } = e.target;
		setFormData({
			...formData,
			[name]: value,
		});
	};

	const handleAddStock = async (e) => {
		e.preventDefault();

		try {
			await ApiService.addStockToPortfolio({
				symbol: formData.symbol,
				quantity: parseFloat(formData.quantity),
				buyPrice: parseFloat(formData.buyPrice),
			});

			// Reset form and close modal
			setFormData({ symbol: '', quantity: '', buyPrice: '' });
			setShowAddModal(false);

			// Refresh portfolio data
			fetchPortfolioData();
		} catch (error) {
			console.error('Error adding stock:', error);
			setError(error.message || 'Failed to add stock to portfolio');
		}
	};

	const handleRemoveStock = async (symbol) => {
		if (
			window.confirm(
				`Are you sure you want to remove ${symbol} from your portfolio?`
			)
		) {
			try {
				await ApiService.removeStockFromPortfolio(symbol);
				fetchPortfolioData();
			} catch (error) {
				console.error('Error removing stock:', error);
				setError(error.message || 'Failed to remove stock from portfolio');
			}
		}
	};

	if (loading) {
		return (
			<div>
				<Navbar />
				<div className="container mx-auto px-4 py-8">
					<div className="animate-pulse">
						<div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
						<div className="h-64 bg-gray-200 rounded mb-6"></div>
					</div>
					<p className="text-center text-gray-500">Loading portfolio data...</p>
				</div>
			</div>
		);
	}

	return (
		<div className="bg-gray-50 min-h-screen">
			<Navbar />
			<div className="container mx-auto px-4 py-8">
				<div className="flex justify-between items-center mb-6">
					<h1 className="text-2xl font-bold text-gray-800">My Portfolio</h1>
					<button
						onClick={() => setShowAddModal(true)}
						className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
					>
						Add Stock
					</button>
				</div>

				{error && (
					<div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
						{error}
					</div>
				)}

				{/* Portfolio Summary Card */}
				<div className="bg-white rounded-lg shadow p-6 mb-6">
					<h2 className="text-xl font-semibold mb-4">Portfolio Summary</h2>
					<div className="grid grid-cols-1 md:grid-cols-4 gap-4">
						<div className="bg-gray-50 p-4 rounded">
							<p className="text-sm text-gray-500">Current Value</p>
							<p className="text-xl font-bold">
								₹
								{portfolio.summary.totalCurrentValue.toLocaleString('en-IN', {
									maximumFractionDigits: 2,
								})}
							</p>
						</div>
						<div className="bg-gray-50 p-4 rounded">
							<p className="text-sm text-gray-500">Invested Value</p>
							<p className="text-xl font-bold">
								₹
								{portfolio.summary.totalInvestedValue.toLocaleString('en-IN', {
									maximumFractionDigits: 2,
								})}
							</p>
						</div>
						<div className="bg-gray-50 p-4 rounded">
							<p className="text-sm text-gray-500">Total P&L</p>
							<p
								className={`text-xl font-bold ${
									portfolio.summary.totalProfitLoss >= 0
										? 'text-green-600'
										: 'text-red-600'
								}`}
							>
								{portfolio.summary.totalProfitLoss >= 0 ? '+' : ''}₹
								{portfolio.summary.totalProfitLoss.toLocaleString('en-IN', {
									maximumFractionDigits: 2,
								})}
							</p>
						</div>
						<div className="bg-gray-50 p-4 rounded">
							<p className="text-sm text-gray-500">P&L %</p>
							<p
								className={`text-xl font-bold ${
									portfolio.summary.totalProfitLossPercentage >= 0
										? 'text-green-600'
										: 'text-red-600'
								}`}
							>
								{portfolio.summary.totalProfitLossPercentage >= 0 ? '+' : ''}
								{portfolio.summary.totalProfitLossPercentage.toFixed(2)}%
							</p>
						</div>
					</div>
				</div>

				{/* Performance Overview Card */}
				{performance.overall && (
					<div className="bg-white rounded-lg shadow p-6 mb-6">
						<h2 className="text-xl font-semibold mb-4">Performance Overview</h2>
						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<div className="bg-gray-50 p-4 rounded">
								<p className="text-sm text-gray-500">Total Return</p>
								<p
									className={`text-xl font-bold ${
										performance.overall.totalReturn >= 0
											? 'text-green-600'
											: 'text-red-600'
									}`}
								>
									{performance.overall.totalReturn >= 0 ? '+' : ''}₹
									{performance.overall.totalReturn.toLocaleString('en-IN', {
										maximumFractionDigits: 2,
									})}
								</p>
							</div>
							<div className="bg-gray-50 p-4 rounded">
								<p className="text-sm text-gray-500">Return %</p>
								<p
									className={`text-xl font-bold ${
										performance.overall.totalReturnPercentage >= 0
											? 'text-green-600'
											: 'text-red-600'
									}`}
								>
									{performance.overall.totalReturnPercentage >= 0 ? '+' : ''}
									{performance.overall.totalReturnPercentage.toFixed(2)}%
								</p>
							</div>
						</div>
					</div>
				)}

				{/* Tab Navigation */}
				<div className="border-b border-gray-200 mb-6">
					<nav className="-mb-px flex">
						<button
							onClick={() => setActiveTab('holdings')}
							className={`py-4 px-6 font-medium text-sm ${
								activeTab === 'holdings'
									? 'border-b-2 border-blue-500 text-blue-600'
									: 'text-gray-500 hover:text-gray-700'
							}`}
						>
							Holdings
						</button>
						<button
							onClick={() => setActiveTab('performance')}
							className={`py-4 px-6 font-medium text-sm ${
								activeTab === 'performance'
									? 'border-b-2 border-blue-500 text-blue-600'
									: 'text-gray-500 hover:text-gray-700'
							}`}
						>
							Performance
						</button>
					</nav>
				</div>

				{/* Conditional Content based on Active Tab */}
				{activeTab === 'holdings' ? (
					/* Holdings Table */
					<div className="bg-white rounded-lg shadow overflow-hidden">
						<h2 className="text-xl font-semibold p-6 border-b">
							Your Holdings
						</h2>

						{portfolio.holdings.length === 0 ? (
							<div className="p-6 text-center text-gray-500">
								<p>You don't have any stocks in your portfolio yet.</p>
								<button
									onClick={() => setShowAddModal(true)}
									className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
								>
									Add your first stock
								</button>
							</div>
						) : (
							<div className="overflow-x-auto">
								<table className="min-w-full divide-y divide-gray-200">
									<thead className="bg-gray-50">
										<tr>
											<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
												Stock
											</th>
											<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
												Qty
											</th>
											<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
												Avg. Price
											</th>
											<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
												Current Price
											</th>
											<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
												Current Value
											</th>
											<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
												P&L
											</th>
											<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
												Actions
											</th>
										</tr>
									</thead>
									<tbody className="bg-white divide-y divide-gray-200">
										{portfolio.holdings.map((holding) => (
											<tr key={holding.symbol}>
												<td className="px-6 py-4 whitespace-nowrap">
													<div className="font-medium text-gray-900">
														{holding.symbol}
													</div>
												</td>
												<td className="px-6 py-4 whitespace-nowrap">
													{holding.quantity}
												</td>
												<td className="px-6 py-4 whitespace-nowrap">
													₹{holding.averageBuyPrice.toFixed(2)}
												</td>
												<td className="px-6 py-4 whitespace-nowrap">
													<div className="flex items-center">
														<span>₹{holding.currentPrice.toFixed(2)}</span>
														<span
															className={`ml-2 text-xs ${
																holding.percentChange >= 0
																	? 'text-green-600'
																	: 'text-red-600'
															}`}
														>
															{holding.percentChange >= 0 ? '+' : ''}
															{holding.percentChange.toFixed(2)}%
														</span>
													</div>
												</td>
												<td className="px-6 py-4 whitespace-nowrap">
													₹{holding.currentValue.toFixed(2)}
												</td>
												<td className="px-6 py-4 whitespace-nowrap">
													<div
														className={
															holding.profitLoss >= 0
																? 'text-green-600'
																: 'text-red-600'
														}
													>
														<div>
															{holding.profitLoss >= 0 ? '+' : ''}₹
															{holding.profitLoss.toFixed(2)}
														</div>
														<div className="text-xs">
															{holding.profitLossPercentage >= 0 ? '+' : ''}
															{holding.profitLossPercentage.toFixed(2)}%
														</div>
													</div>
												</td>
												<td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
													<button
														onClick={() => handleRemoveStock(holding.symbol)}
														className="text-red-600 hover:text-red-900"
													>
														Remove
													</button>
												</td>
											</tr>
										))}
									</tbody>
								</table>
							</div>
						)}
					</div>
				) : (
					/* Performance Details */
					<div className="bg-white rounded-lg shadow overflow-hidden">
						<h2 className="text-xl font-semibold p-6 border-b">
							Performance Details
						</h2>

						{performance.performance.length === 0 ? (
							<div className="p-6 text-center text-gray-500">
								<p>No performance data available yet.</p>
							</div>
						) : (
							<div className="overflow-x-auto">
								<table className="min-w-full divide-y divide-gray-200">
									<thead className="bg-gray-50">
										<tr>
											<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
												Stock
											</th>
											<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
												Current Price
											</th>
											<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
												Day Change
											</th>
											<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
												Invested
											</th>
											<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
												Current Value
											</th>
											<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
												Total P&L
											</th>
											<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
												Return %
											</th>
										</tr>
									</thead>
									<tbody className="bg-white divide-y divide-gray-200">
										{performance.performance.map((item) => (
											<tr key={item.symbol}>
												<td className="px-6 py-4 whitespace-nowrap">
													<div className="font-medium text-gray-900">
														{item.symbol}
													</div>
													<div className="text-xs text-gray-500">
														{item.quantity} shares @ ₹
														{item.averageBuyPrice.toFixed(2)}
													</div>
												</td>
												<td className="px-6 py-4 whitespace-nowrap">
													₹{item.currentPrice.toFixed(2)}
												</td>
												<td className="px-6 py-4 whitespace-nowrap">
													<span
														className={`${
															item.dailyChange >= 0
																? 'text-green-600'
																: 'text-red-600'
														}`}
													>
														{item.dailyChange >= 0 ? '+' : ''}
														{item.dailyChange.toFixed(2)}%
													</span>
												</td>
												<td className="px-6 py-4 whitespace-nowrap">
													₹{item.investedValue.toFixed(2)}
												</td>
												<td className="px-6 py-4 whitespace-nowrap">
													₹{item.currentValue.toFixed(2)}
												</td>
												<td className="px-6 py-4 whitespace-nowrap">
													<span
														className={`${
															item.profitLoss >= 0
																? 'text-green-600'
																: 'text-red-600'
														}`}
													>
														{item.profitLoss >= 0 ? '+' : ''}₹
														{item.profitLoss.toFixed(2)}
													</span>
												</td>
												<td className="px-6 py-4 whitespace-nowrap">
													<span
														className={`${
															item.profitLossPercentage >= 0
																? 'text-green-600'
																: 'text-red-600'
														}`}
													>
														{item.profitLossPercentage >= 0 ? '+' : ''}
														{item.profitLossPercentage.toFixed(2)}%
													</span>
												</td>
											</tr>
										))}
									</tbody>
								</table>
							</div>
						)}
					</div>
				)}
			</div>

			{/* Add Stock Modal */}
			{showAddModal && (
				<div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
					<div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
						<div className="flex justify-between items-center mb-4">
							<h2 className="text-xl font-bold">Add Stock to Portfolio</h2>
							<button
								onClick={() => setShowAddModal(false)}
								className="text-gray-500 hover:text-gray-700"
							>
								✕
							</button>
						</div>

						<form onSubmit={handleAddStock}>
							<div className="mb-4">
								<label
									className="block text-gray-700 text-sm font-bold mb-2"
									htmlFor="symbol"
								>
									Stock Symbol
								</label>
								<input
									type="text"
									id="symbol"
									name="symbol"
									value={formData.symbol}
									onChange={handleInputChange}
									placeholder="e.g., RELIANCE.NS"
									className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
									required
								/>
							</div>

							<div className="mb-4">
								<label
									className="block text-gray-700 text-sm font-bold mb-2"
									htmlFor="quantity"
								>
									Quantity
								</label>
								<input
									type="number"
									id="quantity"
									name="quantity"
									value={formData.quantity}
									onChange={handleInputChange}
									placeholder="Number of shares"
									min="1"
									step="1"
									className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
									required
								/>
							</div>

							<div className="mb-6">
								<label
									className="block text-gray-700 text-sm font-bold mb-2"
									htmlFor="buyPrice"
								>
									Buy Price (₹)
								</label>
								<input
									type="number"
									id="buyPrice"
									name="buyPrice"
									value={formData.buyPrice}
									onChange={handleInputChange}
									placeholder="Price per share"
									min="0.01"
									step="0.01"
									className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
									required
								/>
							</div>

							<div className="flex items-center justify-end">
								<button
									type="button"
									onClick={() => setShowAddModal(false)}
									className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded mr-2"
								>
									Cancel
								</button>
								<button
									type="submit"
									className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
								>
									Add Stock
								</button>
							</div>
						</form>
					</div>
				</div>
			)}
		</div>
	);
};

export default PortfolioPage;
