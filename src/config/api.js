/**
 * Centralized API configuration
 * This file contains all API endpoints used in the application
 */

// Base URLs for different services
const API_BASE_URL = 'http://localhost:5000/api';
const FLASK_API_URL = 'http://localhost:5001';

// API Endpoints
const API = {
	// Base URLs
	API_BASE_URL,
	FLASK_API_URL,

	// Node.js backend endpoints
	SECTORS: `${API_BASE_URL}/stocks/market/sectors`,
	STOCK_PRICE: (symbol) => `${API_BASE_URL}/stocks/price/${symbol}`,
	STOCK_MULTIPLE_PRICES: `${API_BASE_URL}/stocks/prices`,
	STOCK_SEARCH: `${API_BASE_URL}/stocks/search`,
	STOCK_PROFILE: (symbol) => `${API_BASE_URL}/stocks/profile/${symbol}`,
	STOCK_HISTORICAL: (symbol) => `${API_BASE_URL}/stocks/historical/${symbol}`,

	// Portfolio endpoints
	PORTFOLIO: `${API_BASE_URL}/portfolio`,
	PORTFOLIO_ADD: `${API_BASE_URL}/portfolio/add`,
	PORTFOLIO_UPDATE: (symbol) => `${API_BASE_URL}/portfolio/update/${symbol}`,
	PORTFOLIO_REMOVE: (symbol) => `${API_BASE_URL}/portfolio/remove/${symbol}`,
	PORTFOLIO_PERFORMANCE: `${API_BASE_URL}/portfolio/performance`,

	// Flask API endpoints (direct access)
	FLASK_STOCK_DATA: `${FLASK_API_URL}/stock_data`,
	FLASK_SEARCH: `${FLASK_API_URL}/search`,
};

export default API;
