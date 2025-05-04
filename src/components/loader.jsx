const [isLoading, setIsLoading] = useState(true);
const [error, setError] = useState(null);

const fetchStockData = async () => {
  try {
    setIsLoading(true);
    setError(null);
    const response = await fetch('YOUR_API_ENDPOINT');
    const data = await response.json();
    setStockData(data);
  } catch (error) {
    setError('Failed to fetch stock data');
  } finally {
    setIsLoading(false);
  }
};