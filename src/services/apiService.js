import API from '../config/api';

/**
 * Centralized API service for making API requests
 * This service handles all API calls and error handling
 */
class ApiService {
	/**
	 * Get all sectors with stocks
	 * @returns {Promise<Object>} Object containing sectors and stocks
	 */
	static async getSectors() {
		try {
			const response = await fetch(API.SECTORS);
			if (!response.ok) {
				throw new Error(`Failed to fetch sectors: ${response.status}`);
			}
			return await response.json();
		} catch (error) {
			console.error('Error fetching sectors:', error);
			throw error;
		}
	}

	/**
	 * Get stock price by symbol
	 * @param {string} symbol Stock symbol
	 * @returns {Promise<Object>} Stock price data
	 */
	static async getStockPrice(symbol) {
		try {
			const response = await fetch(API.STOCK_PRICE(symbol));
			if (!response.ok) {
				throw new Error(`Failed to fetch stock price: ${response.status}`);
			}
			return await response.json();
		} catch (error) {
			console.error(`Error fetching stock price for ${symbol}:`, error);
			throw error;
		}
	}

	/**
	 * Get multiple stock prices by symbols
	 * @param {Array<string>} symbols Array of stock symbols
	 * @returns {Promise<Array<Object>>} Array of stock price data
	 */
	static async getMultipleStockPrices(symbols) {
		try {
			const response = await fetch(API.STOCK_MULTIPLE_PRICES, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ symbols }),
			});

			if (!response.ok) {
				throw new Error(
					`Failed to fetch multiple stock prices: ${response.status}`
				);
			}

			return await response.json();
		} catch (error) {
			console.error('Error fetching multiple stock prices:', error);
			throw error;
		}
	}

	/**
	 * Search stocks by query
	 * @param {string} query Search query
	 * @returns {Promise<Array<Object>>} Array of matching stocks
	 */
	static async searchStocks(query) {
		try {
			const response = await fetch(
				`${API.STOCK_SEARCH}?query=${encodeURIComponent(query)}`
			);
			if (!response.ok) {
				throw new Error(`Failed to search stocks: ${response.status}`);
			}
			return await response.json();
		} catch (error) {
			console.error(`Error searching stocks with query '${query}':`, error);
			throw error;
		}
	}

	/**
	 * Get stock profile by symbol
	 * @param {string} symbol Stock symbol
	 * @returns {Promise<Object>} Stock profile data
	 */
	static async getStockProfile(symbol) {
		try {
			const response = await fetch(API.STOCK_PROFILE(symbol));
			if (!response.ok) {
				throw new Error(`Failed to fetch stock profile: ${response.status}`);
			}
			return await response.json();
		} catch (error) {
			console.error(`Error fetching stock profile for ${symbol}:`, error);
			throw error;
		}
	}

	/**
	 * Get historical data for a stock
	 * @param {string} symbol Stock symbol
	 * @param {string} period Period for historical data (e.g., '1d', '1mo', '1y')
	 * @param {string} interval Data interval (e.g., '1d', '1h')
	 * @returns {Promise<Array>} Historical stock data
	 */
	static async getHistoricalData(symbol, period = '1y', interval = '1d') {
		try {
			const response = await fetch(
				`${API.STOCK_HISTORICAL(symbol)}?period=${period}&interval=${interval}`
			);
			if (!response.ok) {
				throw new Error(`Failed to fetch historical data: ${response.status}`);
			}
			return await response.json();
		} catch (error) {
			console.error(`Error fetching historical data for ${symbol}:`, error);
			throw error;
		}
	}

	/**
	 * Get user's portfolio
	 * @returns {Promise<Object>} Portfolio data including holdings and summary
	 */
	static async getPortfolio() {
		try {
			const token = localStorage.getItem('token');
			if (!token) {
				throw new Error('Authentication required');
			}

			const response = await fetch(API.PORTFOLIO, {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			});

			if (!response.ok) {
				throw new Error(`Failed to fetch portfolio: ${response.status}`);
			}

			return await response.json();
		} catch (error) {
			console.error('Error fetching portfolio:', error);
			throw error;
		}
	}

	/**
	 * Add a stock to the user's portfolio
	 * @param {Object} stockData Object containing symbol, quantity, and buyPrice
	 * @returns {Promise<Object>} Updated portfolio data
	 */
	static async addStockToPortfolio(stockData) {
		try {
			const token = localStorage.getItem('token');
			if (!token) {
				throw new Error('Authentication required');
			}

			const response = await fetch(API.PORTFOLIO_ADD, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${token}`,
				},
				body: JSON.stringify(stockData),
			});

			if (!response.ok) {
				const errorData = await response.json();
				throw new Error(
					errorData.error || `Failed to add stock: ${response.status}`
				);
			}

			return await response.json();
		} catch (error) {
			console.error('Error adding stock to portfolio:', error);
			throw error;
		}
	}

	/**
	 * Update a stock in the user's portfolio
	 * @param {string} symbol Stock symbol to update
	 * @param {Object} updateData Object containing quantity and/or buyPrice
	 * @returns {Promise<Object>} Updated portfolio data
	 */
	static async updateStockInPortfolio(symbol, updateData) {
		try {
			const token = localStorage.getItem('token');
			if (!token) {
				throw new Error('Authentication required');
			}

			const response = await fetch(API.PORTFOLIO_UPDATE(symbol), {
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${token}`,
				},
				body: JSON.stringify(updateData),
			});

			if (!response.ok) {
				const errorData = await response.json();
				throw new Error(
					errorData.error || `Failed to update stock: ${response.status}`
				);
			}

			return await response.json();
		} catch (error) {
			console.error(`Error updating stock ${symbol} in portfolio:`, error);
			throw error;
		}
	}

	/**
	 * Remove a stock from the user's portfolio
	 * @param {string} symbol Stock symbol to remove
	 * @returns {Promise<Object>} Updated portfolio data
	 */
	static async removeStockFromPortfolio(symbol) {
		try {
			const token = localStorage.getItem('token');
			if (!token) {
				throw new Error('Authentication required');
			}

			const response = await fetch(API.PORTFOLIO_REMOVE(symbol), {
				method: 'DELETE',
				headers: {
					Authorization: `Bearer ${token}`,
				},
			});

			if (!response.ok) {
				const errorData = await response.json();
				throw new Error(
					errorData.error || `Failed to remove stock: ${response.status}`
				);
			}

			return await response.json();
		} catch (error) {
			console.error(`Error removing stock ${symbol} from portfolio:`, error);
			throw error;
		}
	}

	/**
	 * Get portfolio performance data
	 * @returns {Promise<Object>} Portfolio performance data
	 */
	static async getPortfolioPerformance() {
		try {
			const token = localStorage.getItem('token');
			if (!token) {
				throw new Error('Authentication required');
			}

			const response = await fetch(API.PORTFOLIO_PERFORMANCE, {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			});

			if (!response.ok) {
				throw new Error(
					`Failed to fetch portfolio performance: ${response.status}`
				);
			}

			return await response.json();
		} catch (error) {
			console.error('Error fetching portfolio performance:', error);
			throw error;
		}
	}
}

export default ApiService;
