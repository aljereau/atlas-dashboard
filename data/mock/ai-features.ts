import { Property, properties } from './properties';

// Property AI Score Breakdown
export interface PropertyScoreBreakdown {
  propertyId: string;
  overallScore: number;
  subscores: {
    risk: number;
    yield: number;
    growth: number;
    location: number;
    condition: number;
  };
  explanation: {
    risk: string;
    yield: string;
    growth: string;
    location: string;
    condition: string;
  };
  change: number; // Score change in the last month (positive or negative)
  historicalScores: {
    date: string;
    score: number;
  }[];
}

// AI Property Tags
export type PropertyTag = 
  | 'high-yield' 
  | 'stable-growth' 
  | 'undervalued' 
  | 'prime-location' 
  | 'eco-friendly' 
  | 'high-demand' 
  | 'emerging-market' 
  | 'renovation-potential' 
  | 'limited-supply' 
  | 'price-drop';

export interface PropertyTags {
  propertyId: string;
  tags: PropertyTag[];
  tagExplanations: Record<PropertyTag, string>;
}

// Atlas Recommendations
export interface PropertyRecommendation {
  propertyId: string;
  score: number;
  category: 'high-yield' | 'stable-growth' | 'undervalued' | 'custom';
  reason: string;
}

// Generate AI score breakdown for each property
export const propertyScoreBreakdowns: PropertyScoreBreakdown[] = properties.map(property => {
  // Create deterministic random values based on property ID
  const propIdNum = parseInt(property.id.replace(/\D/g, ''), 10);
  const seed = propIdNum / 10;
  
  // Generate subscores that average to the overall score
  const random = (min: number, max: number) => {
    const randomFactor = ((propIdNum * (max - min)) % (max - min)) / (max - min);
    return min + (max - min) * randomFactor;
  };
  
  // Risk score - inversely related to property.yield
  const riskScore = 10 - Math.min(9, Math.max(3, property.yield * 0.8 + random(0.5, 2.5)));
  
  // Yield score - directly related to property.yield
  const yieldScore = Math.min(9.5, Math.max(4, property.yield * 1.2 + random(-0.5, 0.5)));
  
  // Growth score - related to property.appreciation
  const growthScore = Math.min(9.5, Math.max(4, property.appreciation * 1.3 + random(-0.5, 1.5)));
  
  // Location score - higher for expensive properties
  const locationScore = Math.min(9.8, Math.max(5, 6 + (property.price / 1000000) * 3 + random(-1, 1)));
  
  // Condition score - newer properties have better condition
  const yearsSinceBuilt = 2023 - property.yearBuilt;
  const conditionScore = Math.min(9.5, Math.max(5, 10 - (yearsSinceBuilt / 10) + random(-0.5, 1)));

  // Generate historical scores
  const historicalScores = [];
  let prevScore = property.score;
  for (let i = 5; i >= 0; i--) {
    const date = new Date();
    date.setMonth(date.getMonth() - i);
    const variance = random(-0.3, 0.3);
    prevScore = Math.min(10, Math.max(1, prevScore + variance));
    historicalScores.push({
      date: date.toISOString().split('T')[0],
      score: parseFloat(prevScore.toFixed(1)),
    });
  }
  
  return {
    propertyId: property.id,
    overallScore: property.score,
    subscores: {
      risk: parseFloat(riskScore.toFixed(1)),
      yield: parseFloat(yieldScore.toFixed(1)),
      growth: parseFloat(growthScore.toFixed(1)),
      location: parseFloat(locationScore.toFixed(1)),
      condition: parseFloat(conditionScore.toFixed(1)),
    },
    explanation: {
      risk: getRiskExplanation(riskScore),
      yield: getYieldExplanation(yieldScore, property.yield),
      growth: getGrowthExplanation(growthScore, property.appreciation),
      location: getLocationExplanation(locationScore, property.location),
      condition: getConditionExplanation(conditionScore, property.yearBuilt),
    },
    change: parseFloat((random(-0.5, 0.8) + (property.appreciation / 10)).toFixed(1)),
    historicalScores,
  };
});

// Generate AI tags for each property
export const propertyTags: PropertyTags[] = properties.map(property => {
  const tags: PropertyTag[] = [];
  
  // Assign tags based on property attributes
  if (property.yield > 5.5) tags.push('high-yield');
  if (property.appreciation > 4.5) tags.push('stable-growth');
  if (property.price / property.sqMeters < 3000) tags.push('undervalued');
  if (property.location.includes('Amsterdam') || 
      property.location.includes('Paris') || 
      property.location.includes('Berlin')) tags.push('prime-location');
  if (property.energyLabel === 'A' || property.energyLabel === 'A+') tags.push('eco-friendly');
  if (property.score > 8.5) tags.push('high-demand');
  if (property.location.includes('Lisbon') || 
      property.location.includes('Barcelona')) tags.push('emerging-market');
  if (property.yearBuilt < 2000) tags.push('renovation-potential');
  if (property.sqMeters > 150) tags.push('limited-supply');
  
  // Limit to 3-4 tags maximum for clarity
  const limitedTags = tags.slice(0, 3 + (property.id.length % 2));
  
  return {
    propertyId: property.id,
    tags: limitedTags,
    tagExplanations: {
      'high-yield': `Expected to deliver above-average returns of ${property.yield}% annually.`,
      'stable-growth': `Historical price appreciation of ${property.appreciation}% with consistent upward trajectory.`,
      'undervalued': `Price per square meter is below market average for similar properties in this area.`,
      'prime-location': `Located in a highly desirable area with excellent amenities and connectivity.`,
      'eco-friendly': `Energy-efficient building with ${property.energyLabel} rating, reducing operational costs.`,
      'high-demand': `Consistently high interest from investors with quick transactions when listed.`,
      'emerging-market': `Located in an area experiencing rapid development and price growth.`,
      'renovation-potential': `Building age suggests opportunity for value-adding improvements.`,
      'limited-supply': `Larger properties in this category are increasingly rare in the current market.`,
      'price-drop': `Recent price adjustment makes this property more attractive than previously.`
    }
  };
});

// Generate property recommendations
export const propertyRecommendations: PropertyRecommendation[] = generateRecommendations();

function generateRecommendations(): PropertyRecommendation[] {
  // Different recommendation categories
  const highYieldProperties = properties
    .filter(p => p.yield > 5.5)
    .sort((a, b) => b.yield - a.yield)
    .slice(0, 4);
    
  const stableGrowthProperties = properties
    .filter(p => p.appreciation > 4.5 && p.score > 7.5)
    .sort((a, b) => b.appreciation - a.appreciation)
    .slice(0, 3);
    
  const undervaluedProperties = properties
    .filter(p => (p.price / p.sqMeters < 3500) && p.score > 7.0)
    .sort((a, b) => (a.price / a.sqMeters) - (b.price / b.sqMeters))
    .slice(0, 3);
  
  // Create recommendations array
  const recommendations: PropertyRecommendation[] = [
    ...highYieldProperties.map(p => ({
      propertyId: p.id,
      score: parseFloat((9 * (p.yield / 7)).toFixed(1)),
      category: 'high-yield' as const,
      reason: `Exceptionally high yield of ${p.yield}% - ${(p.yield - 4.5).toFixed(1)}% above market average`
    })),
    
    ...stableGrowthProperties.map(p => ({
      propertyId: p.id,
      score: parseFloat((8.5 * (p.appreciation / 5)).toFixed(1)),
      category: 'stable-growth' as const,
      reason: `Strong historical appreciation of ${p.appreciation}% with high stability score`
    })),
    
    ...undervaluedProperties.map(p => ({
      propertyId: p.id,
      score: parseFloat((8 * (1 - ((p.price / p.sqMeters) / 4000))).toFixed(1)),
      category: 'undervalued' as const,
      reason: `Price per m² is ${((3500 - (p.price / p.sqMeters)) / 35).toFixed(0)}% below similar properties`
    }))
  ];
  
  // Sort by recommendation score
  return recommendations.sort((a, b) => b.score - a.score);
}

// Helper functions for explanations
function getRiskExplanation(score: number): string {
  if (score >= 8.5) return "Very low risk profile with strong hedging against market volatility.";
  if (score >= 7) return "Low risk investment suitable for stable long-term returns.";
  if (score >= 5.5) return "Moderate risk with reasonable protection against market fluctuations.";
  if (score >= 4) return "Above average risk that may be offset by higher yield potential.";
  return "Higher risk profile requiring active management and monitoring.";
}

function getYieldExplanation(score: number, yieldPercentage: number): string {
  if (score >= 8.5) return `Exceptional yield potential of ${yieldPercentage}%, significantly outperforming market average.`;
  if (score >= 7) return `Strong yield of ${yieldPercentage}%, above average for this property class.`;
  if (score >= 5.5) return `Competitive yield of ${yieldPercentage}%, in line with market expectations.`;
  if (score >= 4) return `Modest yield of ${yieldPercentage}%, slightly below market average but with potential for growth.`;
  return `Lower yield of ${yieldPercentage}%, balanced by other investment benefits.`;
}

function getGrowthExplanation(score: number, appreciation: number): string {
  if (score >= 8.5) return `Exceptional growth potential of ${appreciation}% annually, in top tier for capital appreciation.`;
  if (score >= 7) return `Strong growth trajectory with projected ${appreciation}% annual appreciation.`;
  if (score >= 5.5) return `Solid growth potential of ${appreciation}% annually, tracking market trends.`;
  if (score >= 4) return `Moderate growth outlook of ${appreciation}%, may accelerate with area development.`;
  return `Limited near-term growth expected at ${appreciation}%, consider as longer-term investment.`;
}

function getLocationExplanation(score: number, location: string): string {
  if (score >= 8.5) return `Prime location in ${location} with excellent connectivity and amenities.`;
  if (score >= 7) return `Desirable location in ${location} with good access to transportation and services.`;
  if (score >= 5.5) return `Good location in ${location} with reasonable access to urban conveniences.`;
  if (score >= 4) return `Developing area in ${location} with improving infrastructure.`;
  return `Emerging location in ${location} that may benefit from future development plans.`;
}

function getConditionExplanation(score: number, yearBuilt: number): string {
  const age = 2023 - yearBuilt;
  if (score >= 8.5) return `Excellent condition, built in ${yearBuilt} with modern specifications and minimal maintenance requirements.`;
  if (score >= 7) return `Very good condition for a ${age}-year-old property with up-to-date systems and features.`;
  if (score >= 5.5) return `Good condition overall, built in ${yearBuilt} with normal wear appropriate for age.`;
  if (score >= 4) return `Fair condition with some updates needed, typical for a property built in ${yearBuilt}.`;
  return `Basic condition with renovation opportunities, consider additional investment for improvements.`;
} 