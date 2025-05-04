async getAllSectorsWithStocks() {
	try {
		// Get market details from the database
		const marketDetails = await MarketDetails.findOne({});
		if (!marketDetails) {
			throw new Error('Market details not found in database');
		}

		// Convert to plain object and remove _id
		const sectorsData = marketDetails.toObject();
		console.log("MongoDB data keys:", Object.keys(sectorsData));
		
		// Filter out _id and any non-array properties
		const sectors = {};
		for (const key in sectorsData) {
			if (key !== '_id' && Array.isArray(sectorsData[key])) {
				sectors[key] = sectorsData[key];
				console.log(`Sector ${key} has ${sectorsData[key].length} stocks`);
			}
		}
		
		console.log("Processed sector keys:", Object.keys(sectors));
		
		// If no sectors found, create sample data for testing
		if (Object.keys(sectors).length === 0) {
			console.log("No sectors found in database, returning sample data");
			return {
				"Technology": [
					{ name: "Apple", symbol: "AAPL" },
					{ name: "Microsoft", symbol: "MSFT" },
					{ name: "Google", symbol: "GOOGL" }
				],
				"Financials": [
					{ name: "JPMorgan", symbol: "JPM" },
					{ name: "Bank of America", symbol: "BAC" }
				]
			};
		}
		
		return sectors;
	} catch (error) {
		console.error("Error in getAllSectorsWithStocks:", error);
		throw new Error(`Failed to fetch sectors with stocks: ${error.message}`);
	}
} 