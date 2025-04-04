import { v4 as uuidv4 } from 'uuid';
import { Portfolio, PortfolioHolding, PortfolioTransaction, PortfolioDistribution, RiskLevel, UserPortfolioSummary } from '../types/portfolio';
import { properties } from './properties';

// Generate a list of portfolio holdings
const createMockHoldings = (count: number, portfolioId: string): PortfolioHolding[] => {
  const holdings: PortfolioHolding[] = [];
  
  // Use subset of available properties
  const availableProperties = properties.slice(0, 10);
  
  for (let i = 0; i < count; i++) {
    const propertyIndex = i % availableProperties.length;
    const property = availableProperties[propertyIndex];
    
    // Calculate random values but ensure they make sense
    const purchaseDate = new Date();
    purchaseDate.setMonth(purchaseDate.getMonth() - Math.floor(Math.random() * 24)); // Between now and 24 months ago
    
    const purchasePrice = property.price * 0.9; // Assume bought at 90% of current price
    const tokens = Math.floor(Math.random() * 100) + 10; // Between 10 and 110 tokens
    const ownership = Number(((tokens / 1000) * 100).toFixed(2)); // Assuming 1000 tokens = 100% ownership
    
    const unrealizedGain = Number((((property.price - purchasePrice) / purchasePrice) * 100).toFixed(2));
    const unrealizedGainValue = Number(((property.price - purchasePrice) * (ownership / 100)).toFixed(2));
    
    const annualIncome = Number((property.price * (property.yield / 100) * (ownership / 100)).toFixed(2));
    
    holdings.push({
      id: uuidv4(),
      propertyId: property.id,
      propertyName: property.name,
      location: property.location,
      purchaseDate: purchaseDate.toISOString().split('T')[0],
      purchasePrice: Number((purchasePrice * (ownership / 100)).toFixed(2)),
      currentValue: Number((property.price * (ownership / 100)).toFixed(2)),
      tokens,
      ownership,
      unrealizedGain,
      unrealizedGainValue,
      annualIncome,
      yield: property.yield
    });
  }
  
  return holdings;
};

// Create a portfolio with calculated totals
const createPortfolio = (id: string, name: string, holdingsCount: number): Portfolio => {
  const holdings = createMockHoldings(holdingsCount, id);
  
  const totalValue = holdings.reduce((sum, holding) => sum + holding.currentValue, 0);
  const totalInvested = holdings.reduce((sum, holding) => sum + holding.purchasePrice, 0);
  const totalUnrealizedGain = holdings.reduce((sum, holding) => sum + holding.unrealizedGainValue, 0);
  const totalUnrealizedGainPercentage = Number(((totalUnrealizedGain / totalInvested) * 100).toFixed(2));
  const annualIncome = holdings.reduce((sum, holding) => sum + holding.annualIncome, 0);
  const averageYield = Number(((annualIncome / totalValue) * 100).toFixed(2));
  
  return {
    id,
    userId: 'user-1',
    name,
    holdings,
    totalValue,
    totalInvested,
    totalUnrealizedGain,
    totalUnrealizedGainPercentage,
    annualIncome,
    averageYield
  };
};

// Create mock portfolios
export const portfolios: Portfolio[] = [
  createPortfolio(uuidv4(), 'Main Portfolio', 4),
  createPortfolio(uuidv4(), 'Growth Portfolio', 3),
  createPortfolio(uuidv4(), 'Income Portfolio', 2)
];

// Create a user summary
export const userPortfolioSummary: UserPortfolioSummary = {
  totalPortfolios: portfolios.length,
  totalValue: portfolios.reduce((sum, portfolio) => sum + portfolio.totalValue, 0),
  totalInvested: portfolios.reduce((sum, portfolio) => sum + portfolio.totalInvested, 0),
  totalGain: portfolios.reduce((sum, portfolio) => sum + portfolio.totalUnrealizedGain, 0),
  totalGainPercentage: 0, // Calculated below
  portfolios: portfolios.map(portfolio => ({
    id: portfolio.id,
    name: portfolio.name,
    value: portfolio.totalValue,
    gain: portfolio.totalUnrealizedGain,
    gainPercentage: portfolio.totalUnrealizedGainPercentage
  }))
};

// Calculate the total gain percentage
userPortfolioSummary.totalGainPercentage = Number(
  ((userPortfolioSummary.totalGain / userPortfolioSummary.totalInvested) * 100).toFixed(2)
);

// Mock transactions for the user
export const transactions: PortfolioTransaction[] = [];

// Create mock transactions for each portfolio holding
portfolios.forEach(portfolio => {
  portfolio.holdings.forEach(holding => {
    // Add buy transaction for each holding
    transactions.push({
      id: uuidv4(),
      portfolioId: portfolio.id,
      propertyId: holding.propertyId,
      propertyName: holding.propertyName,
      date: holding.purchaseDate,
      type: 'buy',
      tokens: holding.tokens,
      price: holding.purchasePrice / holding.tokens,
      totalAmount: holding.purchasePrice,
      fees: Number((holding.purchasePrice * 0.015).toFixed(2)) // 1.5% transaction fee
    });
    
    // Add some sell transactions for a random subset (about 30%)
    if (Math.random() > 0.7) {
      const sellDate = new Date();
      sellDate.setMonth(sellDate.getMonth() - Math.floor(Math.random() * 6)); // Between now and 6 months ago
      
      const tokensToSell = Math.floor(holding.tokens * 0.3); // Sell 30% of holding
      const sellPrice = holding.currentValue / holding.tokens;
      
      transactions.push({
        id: uuidv4(),
        portfolioId: portfolio.id,
        propertyId: holding.propertyId,
        propertyName: holding.propertyName,
        date: sellDate.toISOString().split('T')[0],
        type: 'sell',
        tokens: tokensToSell,
        price: sellPrice,
        totalAmount: Number((tokensToSell * sellPrice).toFixed(2)),
        fees: Number((tokensToSell * sellPrice * 0.01).toFixed(2)) // 1% transaction fee for selling
      });
    }
  });
});

// Sort transactions by date (newest first)
transactions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

// Portfolio distribution by location
export const portfolioDistributionByLocation: PortfolioDistribution[] = (() => {
  const locationMap = new Map<string, number>();
  let totalValue = 0;
  
  portfolios.forEach(portfolio => {
    portfolio.holdings.forEach(holding => {
      const city = holding.location.split(',')[0].trim();
      const currentValue = locationMap.get(city) || 0;
      locationMap.set(city, currentValue + holding.currentValue);
      totalValue += holding.currentValue;
    });
  });
  
  return Array.from(locationMap.entries()).map(([category, value]) => ({
    category,
    value,
    percentage: Number(((value / totalValue) * 100).toFixed(1))
  }));
})();

// Portfolio distribution by property type
export const portfolioDistributionByType: PortfolioDistribution[] = [
  { category: 'Residential', value: userPortfolioSummary.totalValue * 0.45, percentage: 45 },
  { category: 'Commercial', value: userPortfolioSummary.totalValue * 0.30, percentage: 30 },
  { category: 'Industrial', value: userPortfolioSummary.totalValue * 0.15, percentage: 15 },
  { category: 'Land', value: userPortfolioSummary.totalValue * 0.10, percentage: 10 }
]; 