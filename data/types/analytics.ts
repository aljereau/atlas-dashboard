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
    valueCorrelation: number;     // Correlation between fundamental and market values
    averagePremium: number;       // Average premium/discount
    priceToNav: number;           // Price to Net Asset Value ratio
    sharpeRatio: number;          // Risk-adjusted return metric
    propertyAppreciation: number; // YTD % change in property value
    tokenAppreciation: number;    // YTD % change in token value
  };
}

export interface MarketCorrelation {
  market: string;                // Name of the market being compared
  weekCorrelation: number;       // 1-week correlation coefficient
  monthCorrelation: number;      // 1-month correlation coefficient
  quarterCorrelation: number;    // 3-month correlation coefficient
  yearCorrelation: number;       // 1-year correlation coefficient
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