// Example of fetching multiple stocks
const stockSymbols = ['AAPL', 'GOOGL', 'MSFT'];

const fetchMultipleStocks = async () => {
  try {
    const response = await fetch('http://localhost:5000/api/stocks/prices', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        symbols: stockSymbols
      })
    });
    
    const data = await response.json();
    const stocksData = data.map(stock => ({
      name: stock.symbol,
      price: stock.currentPrice,
      change: stock.change,
      percentChange: stock.percentChange,
      high: stock.highPrice,
      low: stock.lowPrice,
      open: stock.openPrice,
      prevClose: stock.previousClose,
      timestamp: new Date(stock.timestamp * 1000).toLocaleString()
    }));
    
    setStockData({
      stockInfo: stocksData,
      isLoading: false,
      error: null
    });
  } catch (error) {
    setStockData({
      stockInfo: null,
      isLoading: false,
      error: error.message
    });
  }
};