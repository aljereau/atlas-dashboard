// Types for dual-layer value tracking and advanced analytics

export interface TokenValueDataPoint {
  date: string;          // ISO date string
  fundamentalValue: number; // Underlying property value per token
  marketValue: number;      // Trading price of token
  premium: number;          // % difference between market and fundamental (can be negative)
  volume: number;           // Trading volume
}

export interface PropertyValueHistory {
  propertyId: string;
  propertyName: string;
  data: TokenValueDataPoint[];
  metrics: {
    volatility: number;           // Standard deviation of returns
    correlation: number;          // Correlation between fundamental and market values
    averagePremium: number;       // Average price-to-NAV premium/discount
    sharpeRatio: number;          // Risk-adjusted return metric
    fundamentalAppreciation: number; // YTD % change in fundamental value
    marketAppreciation: number;   // YTD % change in market value
  };
}

export interface MarketCorrelation {
  timeframe: 'week' | 'month' | 'quarter' | 'year';
  realEstateIndex: number;  // Correlation with broad real estate market
  stockMarket: number;      // Correlation with stock market
  cryptoMarket: number;     // Correlation with crypto market
  commodities: number;      // Correlation with commodities
}

export interface LiquidityMetrics {
  spread: number;           // Bid-ask spread percentage
  depth: number;            // Market depth in EUR
  averageDailyVolume: number; // Average daily trading volume in EUR
  turnoverRate: number;     // Annual turnover rate (volume/market cap)
  orderBookDepth: {         // Mock order book depth
    bids: { price: number; amount: number }[];
    asks: { price: number; amount: number }[];
  };
}

export interface Notification {
  id: string;
  type: 'price' | 'portfolio' | 'system' | 'market';
  title: string;
  message: string;
  timestamp: string; // ISO date string
  isRead: boolean;
  relatedAssetId?: string; // Optional property or token ID
  importance: 'low' | 'medium' | 'high';
  action?: {
    label: string;
    url: string;
  };
}

export interface NotificationPreferences {
  priceAlerts: boolean;
  priceAlertThreshold: number; // % change to trigger alert
  portfolioAlerts: boolean;
  systemAlerts: boolean;
  marketAlerts: boolean;
  emailNotifications: boolean;
  pushNotifications: boolean;
} 