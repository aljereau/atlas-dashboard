export interface PortfolioHolding {
  id: string;
  propertyId: string;
  propertyName: string;
  location: string;
  purchaseDate: string;
  purchasePrice: number;
  currentValue: number;
  tokens: number;
  ownership: number; // Percentage
  unrealizedGain: number; // Percentage
  unrealizedGainValue: number; // Absolute value
  annualIncome: number;
  yield: number; // Percentage
}

export interface Portfolio {
  id: string;
  userId: string;
  name: string;
  holdings: PortfolioHolding[];
  totalValue: number;
  totalInvested: number;
  totalUnrealizedGain: number;
  totalUnrealizedGainPercentage: number;
  annualIncome: number;
  averageYield: number;
}

export interface UserPortfolioSummary {
  totalPortfolios: number;
  totalValue: number;
  totalInvested: number;
  totalGain: number;
  totalGainPercentage: number;
  portfolios: {
    id: string;
    name: string;
    value: number;
    gain: number;
    gainPercentage: number;
  }[];
}

export interface PortfolioTransaction {
  id: string;
  portfolioId: string;
  propertyId: string;
  propertyName: string;
  date: string;
  type: 'buy' | 'sell';
  tokens: number;
  price: number;
  totalAmount: number;
  fees: number;
}

export interface PortfolioDistribution {
  category: string;
  value: number;
  percentage: number;
}

export enum RiskLevel {
  VeryLow = 'Very Low',
  Low = 'Low',
  Medium = 'Medium',
  High = 'High',
  VeryHigh = 'Very High'
} 