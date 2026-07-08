export type InvestmentCategory =
  | 'index' | 'stocks' | 'realestate' | 'crypto' | 'commodities' | 'bonds' | 'forex' | 'robo' | 'retirement';

export type InvestmentRegion = 'us' | 'europe' | 'asia' | 'global';

export interface InvestmentProduct {
  id: string;
  provider: string;
  flag: string;
  country: string;
  region: InvestmentRegion;
  category: InvestmentCategory;
  productName: string;
  market?: string;            // e.g. NASDAQ, NSE, Nikkei
  expectedReturnMin: number;  // annual %
  expectedReturnMax: number;
  minInvestment: number;
  annualFee: number;          // expense ratio / management fee %
  riskLevel: 'Low' | 'Medium' | 'High';
  currency: string;
  currencySymbol: string;
  features: string[];
  rating: number;
  reviewCount: number;
  badge?: string;
  minTermYears: number;
}

export const INVESTMENT_PRODUCTS: InvestmentProduct[] = [
  // ═══════════════ INDEX / ETF (global markets) ═══════════════
  { id: 'vanguard-voo', provider: 'Vanguard', flag: '🇺🇸', country: 'United States', region: 'us', category: 'index', productName: 'S&P 500 ETF (VOO)', market: 'NYSE Arca', expectedReturnMin: 7, expectedReturnMax: 10.5, minInvestment: 1, annualFee: 0.03, riskLevel: 'Medium', currency: 'USD', currencySymbol: '$', features: ['Ultra-low 0.03% fee', 'Tracks S&P 500', 'Dividend reinvestment', 'Fractional shares'], rating: 4.9, reviewCount: 31200, badge: 'Editor’s Choice', minTermYears: 3 },
  { id: 'invesco-qqq', provider: 'Invesco', flag: '🇺🇸', country: 'United States', region: 'us', category: 'index', productName: 'QQQ (Nasdaq-100)', market: 'NASDAQ', expectedReturnMin: 9, expectedReturnMax: 14, minInvestment: 1, annualFee: 0.20, riskLevel: 'High', currency: 'USD', currencySymbol: '$', features: ['Top 100 Nasdaq tech stocks', 'High growth', 'Highly liquid', 'Options available'], rating: 4.7, reviewCount: 22600, badge: 'High Growth', minTermYears: 3 },
  { id: 'fidelity-fzrox', provider: 'Fidelity', flag: '🇺🇸', country: 'United States', region: 'us', category: 'index', productName: 'ZERO Total Market (FZROX)', market: 'US Total Market', expectedReturnMin: 6.5, expectedReturnMax: 10, minInvestment: 1, annualFee: 0.0, riskLevel: 'Medium', currency: 'USD', currencySymbol: '$', features: ['0% expense ratio', 'Whole US market', 'No minimums', 'Fractional investing'], rating: 4.8, reviewCount: 24800, badge: 'Lowest Fees', minTermYears: 3 },
  { id: 'ishares-swda', provider: 'iShares', flag: '🇩🇪', country: 'Germany', region: 'europe', category: 'index', productName: 'Core MSCI World (SWDA)', market: 'Xetra', expectedReturnMin: 6, expectedReturnMax: 9.5, minInvestment: 50, annualFee: 0.20, riskLevel: 'Medium', currency: 'EUR', currencySymbol: '€', features: ['1,500+ global stocks', 'UCITS compliant', 'Sparplan-friendly', 'Accumulating'], rating: 4.7, reviewCount: 16800, badge: 'Best Global EU', minTermYears: 3 },
  { id: 'vanguard-vwrl', provider: 'Vanguard UK', flag: '🇬🇧', country: 'United Kingdom', region: 'europe', category: 'index', productName: 'FTSE All-World (VWRL)', market: 'LSE', expectedReturnMin: 6, expectedReturnMax: 9.5, minInvestment: 100, annualFee: 0.22, riskLevel: 'Medium', currency: 'GBP', currencySymbol: '£', features: ['Global diversification', 'ISA-eligible', 'Low fee', 'Quarterly dividends'], rating: 4.7, reviewCount: 14100, minTermYears: 3 },
  { id: 'ishares-emerging', provider: 'iShares', flag: '🌍', country: 'Global', region: 'global', category: 'index', productName: 'MSCI Emerging Markets', market: 'Global EM', expectedReturnMin: 5, expectedReturnMax: 12, minInvestment: 50, annualFee: 0.18, riskLevel: 'High', currency: 'USD', currencySymbol: '$', features: ['China, India, Brazil, etc.', 'High growth potential', 'Diversified EM', 'USD-denominated'], rating: 4.4, reviewCount: 9300, minTermYears: 5 },
  { id: 'nippon-nifty50', provider: 'Nippon India MF', flag: '🇮🇳', country: 'India', region: 'asia', category: 'index', productName: 'Nifty 50 Index Fund', market: 'NSE', expectedReturnMin: 10, expectedReturnMax: 15, minInvestment: 500, annualFee: 0.20, riskLevel: 'High', currency: 'INR', currencySymbol: '₹', features: ['Top 50 NSE companies', 'India growth story', 'SIP-friendly', 'Low tracking error'], rating: 4.5, reviewCount: 18700, badge: 'Best India', minTermYears: 3 },
  { id: 'ishares-japan', provider: 'iShares', flag: '🇯🇵', country: 'Japan', region: 'asia', category: 'index', productName: 'MSCI Japan ETF', market: 'Nikkei / TSE', expectedReturnMin: 5, expectedReturnMax: 10, minInvestment: 50, annualFee: 0.50, riskLevel: 'Medium', currency: 'JPY', currencySymbol: '¥', features: ['Broad Japanese equity', 'Nikkei & TOPIX exposure', 'Yen diversification', 'Large-cap focus'], rating: 4.3, reviewCount: 6200, minTermYears: 3 },
  { id: 'ishares-china', provider: 'iShares', flag: '🇨🇳', country: 'China', region: 'asia', category: 'index', productName: 'MSCI China ETF', market: 'Shanghai / HK', expectedReturnMin: 4, expectedReturnMax: 13, minInvestment: 50, annualFee: 0.59, riskLevel: 'High', currency: 'USD', currencySymbol: '$', features: ['Shanghai & HK listings', 'Tech & consumer giants', 'High growth / volatility', 'A-shares access'], rating: 4.1, reviewCount: 7400, minTermYears: 5 },
  { id: 'kodex-200', provider: 'Samsung KODEX', flag: '🇰🇷', country: 'South Korea', region: 'asia', category: 'index', productName: 'KODEX 200 (KOSPI)', market: 'KRX / KOSPI', expectedReturnMin: 5, expectedReturnMax: 11, minInvestment: 100, annualFee: 0.15, riskLevel: 'Medium', currency: 'KRW', currencySymbol: '₩', features: ['Top 200 KOSPI firms', 'Korea’s largest ETF', 'Samsung, Hyundai, SK', 'Low fee'], rating: 4.4, reviewCount: 8100, minTermYears: 3 },

  // ═══════════════ STOCKS / BROKERAGES (by exchange) ═══════════════
  { id: 'robinhood', provider: 'Robinhood', flag: '🇺🇸', country: 'United States', region: 'us', category: 'stocks', productName: 'Commission-Free Trading', market: 'NASDAQ / NYSE', expectedReturnMin: 4, expectedReturnMax: 15, minInvestment: 1, annualFee: 0.0, riskLevel: 'High', currency: 'USD', currencySymbol: '$', features: ['$0 commissions', 'Fractional shares', 'Options & crypto', 'IRA with match'], rating: 4.2, reviewCount: 28600, badge: 'Most Popular US', minTermYears: 1 },
  { id: 'ibkr', provider: 'Interactive Brokers', flag: '🌍', country: 'Global', region: 'global', category: 'stocks', productName: 'Global Trader', market: '150+ markets, 33 countries', expectedReturnMin: 4, expectedReturnMax: 15, minInvestment: 1, annualFee: 0.0, riskLevel: 'High', currency: 'USD', currencySymbol: '$', features: ['Trade 150+ global exchanges', 'Lowest margin rates', 'Pro tools', 'Multi-currency'], rating: 4.6, reviewCount: 19800, badge: 'Best Global', minTermYears: 1 },
  { id: 'schwab', provider: 'Charles Schwab', flag: '🇺🇸', country: 'United States', region: 'us', category: 'stocks', productName: 'Brokerage Account', market: 'NYSE / NASDAQ', expectedReturnMin: 4, expectedReturnMax: 14, minInvestment: 1, annualFee: 0.0, riskLevel: 'High', currency: 'USD', currencySymbol: '$', features: ['$0 stock trades', 'Robust research', '24/7 support', 'Global access'], rating: 4.7, reviewCount: 17300, minTermYears: 1 },
  { id: 'zerodha', provider: 'Zerodha', flag: '🇮🇳', country: 'India', region: 'asia', category: 'stocks', productName: 'Kite Trading', market: 'NSE / BSE', expectedReturnMin: 8, expectedReturnMax: 16, minInvestment: 100, annualFee: 0.0, riskLevel: 'High', currency: 'INR', currencySymbol: '₹', features: ['India’s #1 broker', '₹0 equity delivery', 'Kite & Coin apps', 'Direct mutual funds'], rating: 4.5, reviewCount: 42000, badge: 'Top India Broker', minTermYears: 1 },
  { id: 'trading212', provider: 'Trading 212', flag: '🇬🇧', country: 'United Kingdom', region: 'europe', category: 'stocks', productName: 'Invest & Stocks ISA', market: 'LSE / FTSE', expectedReturnMin: 4, expectedReturnMax: 14, minInvestment: 1, annualFee: 0.0, riskLevel: 'High', currency: 'GBP', currencySymbol: '£', features: ['Commission-free', 'Fractional shares', 'AutoInvest pies', 'ISA available'], rating: 4.5, reviewCount: 22400, badge: 'Most Popular UK', minTermYears: 1 },
  { id: 'degiro', provider: 'DEGIRO', flag: '🇳🇱', country: 'Netherlands', region: 'europe', category: 'stocks', productName: 'Low-Cost Brokerage', market: 'Euronext / Xetra', expectedReturnMin: 4, expectedReturnMax: 14, minInvestment: 1, annualFee: 0.0, riskLevel: 'High', currency: 'EUR', currencySymbol: '€', features: ['Ultra-low fees', '50+ exchanges', 'No inactivity fee', 'Pan-European'], rating: 4.4, reviewCount: 18600, minTermYears: 1 },
  { id: 'rakuten-sec', provider: 'Rakuten Securities', flag: '🇯🇵', country: 'Japan', region: 'asia', category: 'stocks', productName: 'Japan & Global Trading', market: 'Tokyo / Nikkei', expectedReturnMin: 4, expectedReturnMax: 12, minInvestment: 1000, annualFee: 0.0, riskLevel: 'High', currency: 'JPY', currencySymbol: '¥', features: ['Tokyo Stock Exchange', 'US & global access', 'Rakuten points', 'NISA-eligible'], rating: 4.3, reviewCount: 9600, minTermYears: 1 },
  { id: 'tiger-brokers', provider: 'Tiger Brokers', flag: '🇸🇬', country: 'Singapore', region: 'asia', category: 'stocks', productName: 'Tiger Trade', market: 'SGX / HK / Shanghai / US', expectedReturnMin: 4, expectedReturnMax: 14, minInvestment: 1, annualFee: 0.0, riskLevel: 'High', currency: 'USD', currencySymbol: '$', features: ['Multi-market access', 'Low commissions', 'HK & China A-shares', 'Fractional US'], rating: 4.3, reviewCount: 11200, minTermYears: 1 },

  // ═══════════════ REAL ESTATE (REITs / property, worldwide) ═══════════════
  { id: 'vanguard-vnq', provider: 'Vanguard', flag: '🇺🇸', country: 'United States', region: 'us', category: 'realestate', productName: 'Real Estate ETF (VNQ)', market: 'US REITs', expectedReturnMin: 5, expectedReturnMax: 11, minInvestment: 1, annualFee: 0.13, riskLevel: 'Medium', currency: 'USD', currencySymbol: '$', features: ['160+ US REITs', 'High dividend yield', 'Inflation hedge', 'Liquid'], rating: 4.6, reviewCount: 12400, badge: 'Best REIT US', minTermYears: 3 },
  { id: 'realty-income', provider: 'Realty Income', flag: '🇺🇸', country: 'United States', region: 'us', category: 'realestate', productName: 'Monthly Dividend REIT (O)', market: 'NYSE', expectedReturnMin: 4, expectedReturnMax: 9, minInvestment: 1, annualFee: 0.0, riskLevel: 'Medium', currency: 'USD', currencySymbol: '$', features: ['Pays monthly dividends', '“The Monthly Dividend Company”', '15,000+ properties', 'Dividend aristocrat'], rating: 4.5, reviewCount: 8900, minTermYears: 3 },
  { id: 'fundrise', provider: 'Fundrise', flag: '🇺🇸', country: 'United States', region: 'us', category: 'realestate', productName: 'Private Real Estate', market: 'Crowdfunded US property', expectedReturnMin: 5, expectedReturnMax: 12, minInvestment: 10, annualFee: 1.0, riskLevel: 'Medium', currency: 'USD', currencySymbol: '$', features: ['Direct property ownership', 'Low $10 minimum', 'Quarterly distributions', 'Private market access'], rating: 4.3, reviewCount: 15600, minTermYears: 5 },
  { id: 'britishland', provider: 'British Land', flag: '🇬🇧', country: 'United Kingdom', region: 'europe', category: 'realestate', productName: 'UK Commercial REIT', market: 'LSE', expectedReturnMin: 4, expectedReturnMax: 9, minInvestment: 50, annualFee: 0.0, riskLevel: 'Medium', currency: 'GBP', currencySymbol: '£', features: ['Prime UK property', 'London campuses & retail', 'Steady dividends', 'FTSE 100 REIT'], rating: 4.2, reviewCount: 4300, minTermYears: 3 },
  { id: 'vonovia', provider: 'Vonovia', flag: '🇩🇪', country: 'Germany', region: 'europe', category: 'realestate', productName: 'European Residential REIT', market: 'Xetra / DAX', expectedReturnMin: 3, expectedReturnMax: 8, minInvestment: 50, annualFee: 0.0, riskLevel: 'Medium', currency: 'EUR', currencySymbol: '€', features: ['Largest EU residential landlord', '500k+ apartments', 'Defensive income', 'DAX-listed'], rating: 4.1, reviewCount: 5100, minTermYears: 3 },
  { id: 'embassy-reit', provider: 'Embassy REIT', flag: '🇮🇳', country: 'India', region: 'asia', category: 'realestate', productName: 'Office REIT', market: 'NSE / BSE', expectedReturnMin: 6, expectedReturnMax: 11, minInvestment: 300, annualFee: 0.0, riskLevel: 'Medium', currency: 'INR', currencySymbol: '₹', features: ['India’s first listed REIT', 'Grade-A office parks', 'Quarterly payouts', 'Blue-chip tenants'], rating: 4.4, reviewCount: 7800, badge: 'Best REIT India', minTermYears: 3 },
  { id: 'nippon-building', provider: 'Nippon Building Fund', flag: '🇯🇵', country: 'Japan', region: 'asia', category: 'realestate', productName: 'J-REIT', market: 'Tokyo (J-REIT)', expectedReturnMin: 3, expectedReturnMax: 7, minInvestment: 1000, annualFee: 0.0, riskLevel: 'Low', currency: 'JPY', currencySymbol: '¥', features: ['Prime Tokyo offices', 'Largest J-REIT', 'Stable yield', 'Institutional quality'], rating: 4.3, reviewCount: 3600, minTermYears: 3 },
  { id: 'capitaland', provider: 'CapitaLand', flag: '🇸🇬', country: 'Singapore', region: 'asia', category: 'realestate', productName: 'Diversified REIT', market: 'SGX', expectedReturnMin: 4, expectedReturnMax: 9, minInvestment: 100, annualFee: 0.0, riskLevel: 'Medium', currency: 'USD', currencySymbol: '$', features: ['Asia-Pacific property', 'Retail, office, logistics', 'SGD dividends', 'Regional diversification'], rating: 4.3, reviewCount: 6400, minTermYears: 3 },

  // ═══════════════ CRYPTO ═══════════════
  { id: 'coinbase', provider: 'Coinbase', flag: '🇺🇸', country: 'United States', region: 'us', category: 'crypto', productName: 'Crypto Exchange', market: 'BTC, ETH, 200+ coins', expectedReturnMin: 10, expectedReturnMax: 70, minInvestment: 2, annualFee: 0.6, riskLevel: 'High', currency: 'USD', currencySymbol: '$', features: ['Buy BTC, ETH & more', 'Regulated US exchange', 'Staking rewards', 'Cold storage'], rating: 4.3, reviewCount: 34200, badge: 'Most Trusted', minTermYears: 1 },
  { id: 'ibit', provider: 'BlackRock iShares', flag: '🇺🇸', country: 'United States', region: 'us', category: 'crypto', productName: 'Bitcoin ETF (IBIT)', market: 'NASDAQ', expectedReturnMin: 10, expectedReturnMax: 60, minInvestment: 1, annualFee: 0.25, riskLevel: 'High', currency: 'USD', currencySymbol: '$', features: ['Spot Bitcoin exposure', 'In a regular brokerage', 'No wallet needed', 'Institutional custody'], rating: 4.5, reviewCount: 12900, badge: 'Easiest BTC', minTermYears: 1 },
  { id: 'binance', provider: 'Binance', flag: '🌍', country: 'Global', region: 'global', category: 'crypto', productName: 'Global Crypto Exchange', market: '350+ coins worldwide', expectedReturnMin: 10, expectedReturnMax: 80, minInvestment: 1, annualFee: 0.1, riskLevel: 'High', currency: 'USD', currencySymbol: '$', features: ['World’s largest exchange', 'Lowest trading fees', 'Staking & earn', 'Futures & spot'], rating: 4.2, reviewCount: 51000, badge: 'Largest', minTermYears: 1 },
  { id: 'kraken', provider: 'Kraken', flag: '🇺🇸', country: 'United States', region: 'us', category: 'crypto', productName: 'Crypto & Staking', market: 'BTC, ETH, SOL, +', expectedReturnMin: 8, expectedReturnMax: 65, minInvestment: 1, annualFee: 0.26, riskLevel: 'High', currency: 'USD', currencySymbol: '$', features: ['Strong security record', 'Up to 20% staking APY', 'Advanced trading', 'Global availability'], rating: 4.4, reviewCount: 16700, minTermYears: 1 },
  { id: 'ethereum', provider: 'Ethereum (ETH)', flag: '🌍', country: 'Global', region: 'global', category: 'crypto', productName: 'Ether', market: 'Decentralized', expectedReturnMin: 12, expectedReturnMax: 75, minInvestment: 1, annualFee: 0.0, riskLevel: 'High', currency: 'USD', currencySymbol: '$', features: ['Smart-contract platform', 'Staking ~4% yield', 'DeFi & NFT backbone', 'Deflationary supply'], rating: 4.4, reviewCount: 28300, minTermYears: 1 },

  // ═══════════════ COMMODITIES ═══════════════
  { id: 'spdr-gold', provider: 'SPDR', flag: '🥇', country: 'United States', region: 'us', category: 'commodities', productName: 'Gold Shares (GLD)', market: 'NYSE Arca', expectedReturnMin: 3, expectedReturnMax: 10, minInvestment: 1, annualFee: 0.40, riskLevel: 'Medium', currency: 'USD', currencySymbol: '$', features: ['Physical gold-backed', 'Inflation hedge', 'Highly liquid', 'Safe-haven asset'], rating: 4.6, reviewCount: 14200, badge: 'Top Gold', minTermYears: 2 },
  { id: 'ishares-silver', provider: 'iShares', flag: '🥈', country: 'United States', region: 'us', category: 'commodities', productName: 'Silver Trust (SLV)', market: 'NYSE Arca', expectedReturnMin: 2, expectedReturnMax: 14, minInvestment: 1, annualFee: 0.50, riskLevel: 'High', currency: 'USD', currencySymbol: '$', features: ['Physical silver-backed', 'Industrial + precious', 'Higher volatility upside', 'Portfolio diversifier'], rating: 4.4, reviewCount: 9100, minTermYears: 2 },
  { id: 'copx-copper', provider: 'Global X', flag: '🥉', country: 'United States', region: 'us', category: 'commodities', productName: 'Copper Miners (COPX)', market: 'NYSE Arca', expectedReturnMin: 3, expectedReturnMax: 16, minInvestment: 1, annualFee: 0.65, riskLevel: 'High', currency: 'USD', currencySymbol: '$', features: ['Global copper miners', 'EV & green-energy demand', 'Cyclical growth', 'Inflation-linked'], rating: 4.2, reviewCount: 4700, minTermYears: 3 },
  { id: 'uso-oil', provider: 'United States Oil', flag: '🛢️', country: 'United States', region: 'us', category: 'commodities', productName: 'Crude Oil Fund (USO)', market: 'NYSE Arca', expectedReturnMin: 2, expectedReturnMax: 18, minInvestment: 1, annualFee: 0.60, riskLevel: 'High', currency: 'USD', currencySymbol: '$', features: ['WTI crude exposure', 'Energy sector hedge', 'High volatility', 'Liquid futures-based'], rating: 4.0, reviewCount: 6200, minTermYears: 2 },
  { id: 'royalmint-gold', provider: 'The Royal Mint', flag: '🇬🇧', country: 'United Kingdom', region: 'europe', category: 'commodities', productName: 'Physical Gold (RMAU)', market: 'LSE', expectedReturnMin: 3, expectedReturnMax: 10, minInvestment: 25, annualFee: 0.22, riskLevel: 'Medium', currency: 'GBP', currencySymbol: '£', features: ['Backed by physical gold', 'Stored in UK vault', 'Lowest-cost gold ETC', 'ISA-eligible'], rating: 4.5, reviewCount: 5300, badge: 'Best Gold EU', minTermYears: 2 },
  { id: 'wisdomtree-metals', provider: 'WisdomTree', flag: '🌍', country: 'Global', region: 'global', category: 'commodities', productName: 'Precious Metals Basket', market: 'Multi-listed', expectedReturnMin: 3, expectedReturnMax: 12, minInvestment: 20, annualFee: 0.44, riskLevel: 'Medium', currency: 'USD', currencySymbol: '$', features: ['Gold, silver, platinum, palladium', 'Single diversified holding', 'Inflation protection', 'Global listings'], rating: 4.3, reviewCount: 3900, minTermYears: 3 },

  // ═══════════════ BONDS (government, worldwide) ═══════════════
  { id: 'ishares-tlt', provider: 'iShares', flag: '🇺🇸', country: 'United States', region: 'us', category: 'bonds', productName: '20+ Yr Treasury (TLT)', market: 'US Treasuries', expectedReturnMin: 3, expectedReturnMax: 5.5, minInvestment: 1, annualFee: 0.15, riskLevel: 'Low', currency: 'USD', currencySymbol: '$', features: ['Long-term US govt bonds', 'Safe-haven', 'Monthly income', 'Highly liquid'], rating: 4.5, reviewCount: 11200, badge: 'Safest US', minTermYears: 2 },
  { id: 'vanguard-bnd', provider: 'Vanguard', flag: '🇺🇸', country: 'United States', region: 'us', category: 'bonds', productName: 'Total Bond Market (BND)', market: 'US Aggregate', expectedReturnMin: 3, expectedReturnMax: 5, minInvestment: 1, annualFee: 0.03, riskLevel: 'Low', currency: 'USD', currencySymbol: '$', features: ['Broad bond exposure', 'Low 0.03% fee', 'Monthly income', 'Portfolio stability'], rating: 4.6, reviewCount: 9800, minTermYears: 2 },
  { id: 'ishares-gilts', provider: 'iShares', flag: '🇬🇧', country: 'United Kingdom', region: 'europe', category: 'bonds', productName: 'Core UK Gilts', market: 'UK Gilts', expectedReturnMin: 3, expectedReturnMax: 5, minInvestment: 50, annualFee: 0.07, riskLevel: 'Low', currency: 'GBP', currencySymbol: '£', features: ['UK government bonds', 'Capital preservation', 'ISA-eligible', 'Low fee'], rating: 4.4, reviewCount: 4100, minTermYears: 2 },
  { id: 'ishares-bunds', provider: 'iShares', flag: '🇩🇪', country: 'Germany', region: 'europe', category: 'bonds', productName: 'Euro Govt Bond (Bunds)', market: 'German Bunds', expectedReturnMin: 2, expectedReturnMax: 4, minInvestment: 50, annualFee: 0.09, riskLevel: 'Low', currency: 'EUR', currencySymbol: '€', features: ['Top-rated Euro govt debt', 'German Bunds core', 'Low volatility', 'Euro stability'], rating: 4.4, reviewCount: 3700, minTermYears: 2 },
  { id: 'india-gsec', provider: 'RBI Retail Direct', flag: '🇮🇳', country: 'India', region: 'asia', category: 'bonds', productName: 'Govt Securities (G-Sec)', market: 'RBI / NSE', expectedReturnMin: 6.5, expectedReturnMax: 7.5, minInvestment: 1000, annualFee: 0.0, riskLevel: 'Low', currency: 'INR', currencySymbol: '₹', features: ['Sovereign-backed', 'Higher EM yields', 'Direct from RBI', 'No default risk'], rating: 4.4, reviewCount: 6900, badge: 'High Yield', minTermYears: 3 },
  { id: 'japan-jgb', provider: 'Japan MoF', flag: '🇯🇵', country: 'Japan', region: 'asia', category: 'bonds', productName: 'Japanese Govt Bonds (JGB)', market: 'JGB', expectedReturnMin: 0.5, expectedReturnMax: 2, minInvestment: 1000, annualFee: 0.0, riskLevel: 'Low', currency: 'JPY', currencySymbol: '¥', features: ['Ultra-safe sovereign debt', 'Yen exposure', 'Capital preservation', 'Deflation hedge'], rating: 4.1, reviewCount: 2400, minTermYears: 3 },
  { id: 'em-bonds', provider: 'iShares', flag: '🌍', country: 'Global', region: 'global', category: 'bonds', productName: 'EM Govt Bond ETF', market: 'Emerging Markets', expectedReturnMin: 5, expectedReturnMax: 8, minInvestment: 50, annualFee: 0.39, riskLevel: 'Medium', currency: 'USD', currencySymbol: '$', features: ['Higher-yield sovereign debt', 'USD-denominated', 'Global diversification', 'Monthly income'], rating: 4.2, reviewCount: 4200, minTermYears: 3 },

  // ═══════════════ FOREX / CURRENCIES ═══════════════
  { id: 'oanda', provider: 'OANDA', flag: '🌍', country: 'Global', region: 'global', category: 'forex', productName: 'Forex Trading', market: 'Major & exotic pairs', expectedReturnMin: 2, expectedReturnMax: 20, minInvestment: 1, annualFee: 0.0, riskLevel: 'High', currency: 'USD', currencySymbol: '$', features: ['70+ currency pairs', 'Tight spreads', 'Regulated globally', 'Advanced charting'], rating: 4.3, reviewCount: 13400, badge: 'Top Forex', minTermYears: 1 },
  { id: 'invesco-uup', provider: 'Invesco', flag: '🇺🇸', country: 'United States', region: 'us', category: 'forex', productName: 'US Dollar Index (UUP)', market: 'NYSE Arca', expectedReturnMin: 1, expectedReturnMax: 8, minInvestment: 1, annualFee: 0.77, riskLevel: 'Medium', currency: 'USD', currencySymbol: '$', features: ['Long the US dollar', 'Hedge against FX risk', 'Basket of majors', 'Liquid ETF'], rating: 4.1, reviewCount: 3100, minTermYears: 1 },
  { id: 'fxe-euro', provider: 'Invesco', flag: '🇪🇺', country: 'Eurozone', region: 'europe', category: 'forex', productName: 'Euro Currency Trust (FXE)', market: 'NYSE Arca', expectedReturnMin: 1, expectedReturnMax: 7, minInvestment: 1, annualFee: 0.40, riskLevel: 'Medium', currency: 'EUR', currencySymbol: '€', features: ['Direct euro exposure', 'Currency diversification', 'USD/EUR hedge', 'Liquid'], rating: 4.0, reviewCount: 2200, minTermYears: 1 },
  { id: 'wise-assets', provider: 'Wise', flag: '🌍', country: 'Global', region: 'global', category: 'forex', productName: 'Multi-Currency Holdings', market: '40+ currencies', expectedReturnMin: 1, expectedReturnMax: 5, minInvestment: 1, annualFee: 0.0, riskLevel: 'Low', currency: 'USD', currencySymbol: '$', features: ['Hold 40+ currencies', 'Mid-market rates', 'Interest on balances', 'Global spending'], rating: 4.6, reviewCount: 29800, badge: 'Best Multi-FX', minTermYears: 1 },

  // ═══════════════ ROBO-ADVISORS ═══════════════
  { id: 'betterment', provider: 'Betterment', flag: '🇺🇸', country: 'United States', region: 'us', category: 'robo', productName: 'Automated Investing', market: 'Diversified ETFs', expectedReturnMin: 5.5, expectedReturnMax: 9, minInvestment: 10, annualFee: 0.25, riskLevel: 'Medium', currency: 'USD', currencySymbol: '$', features: ['Auto-rebalancing', 'Tax-loss harvesting', 'Goal-based', 'Low minimum'], rating: 4.6, reviewCount: 15300, badge: 'Best Robo US', minTermYears: 3 },
  { id: 'wealthfront', provider: 'Wealthfront', flag: '🇺🇸', country: 'United States', region: 'us', category: 'robo', productName: 'Automated Portfolio', market: 'Diversified ETFs', expectedReturnMin: 5.5, expectedReturnMax: 9, minInvestment: 500, annualFee: 0.25, riskLevel: 'Medium', currency: 'USD', currencySymbol: '$', features: ['Direct indexing', 'Tax optimization', 'Risk parity', 'Planning tools'], rating: 4.5, reviewCount: 11700, minTermYears: 3 },
  { id: 'nutmeg', provider: 'Nutmeg', flag: '🇬🇧', country: 'United Kingdom', region: 'europe', category: 'robo', productName: 'Managed ISA Portfolio', market: 'Global ETFs', expectedReturnMin: 5, expectedReturnMax: 8.5, minInvestment: 500, annualFee: 0.75, riskLevel: 'Medium', currency: 'GBP', currencySymbol: '£', features: ['Fully managed', 'ISA & pension', '10 risk levels', 'Ethical option'], rating: 4.4, reviewCount: 8900, badge: 'Best Robo EU', minTermYears: 3 },
  { id: 'scalable', provider: 'Scalable Capital', flag: '🇩🇪', country: 'Germany', region: 'europe', category: 'robo', productName: 'Digital Wealth', market: 'Global ETFs', expectedReturnMin: 5, expectedReturnMax: 8.5, minInvestment: 20, annualFee: 0.75, riskLevel: 'Medium', currency: 'EUR', currencySymbol: '€', features: ['AI risk management', 'ETF-based', 'Low entry', 'Flexible plans'], rating: 4.3, reviewCount: 10200, minTermYears: 3 },

  // ═══════════════ RETIREMENT ═══════════════
  { id: 'fidelity-ira', provider: 'Fidelity', flag: '🇺🇸', country: 'United States', region: 'us', category: 'retirement', productName: 'Roth IRA', market: 'Tax-advantaged US', expectedReturnMin: 6, expectedReturnMax: 9.5, minInvestment: 0, annualFee: 0.0, riskLevel: 'Medium', currency: 'USD', currencySymbol: '$', features: ['Tax-free growth', 'No account fees', 'Wide fund choice', 'Planning tools'], rating: 4.8, reviewCount: 17200, badge: 'Best Retirement US', minTermYears: 5 },
  { id: 'vanguard-target', provider: 'Vanguard', flag: '🇺🇸', country: 'United States', region: 'us', category: 'retirement', productName: 'Target Retirement Fund', market: 'Auto glide-path', expectedReturnMin: 5.5, expectedReturnMax: 9, minInvestment: 1000, annualFee: 0.08, riskLevel: 'Medium', currency: 'USD', currencySymbol: '$', features: ['Auto-adjusts with age', 'One-fund solution', 'Low cost', 'Set & forget'], rating: 4.7, reviewCount: 13900, minTermYears: 10 },
  { id: 'pensionbee', provider: 'PensionBee', flag: '🇬🇧', country: 'United Kingdom', region: 'europe', category: 'retirement', productName: 'Personal Pension', market: 'UK SIPP', expectedReturnMin: 5, expectedReturnMax: 8.5, minInvestment: 0, annualFee: 0.50, riskLevel: 'Medium', currency: 'GBP', currencySymbol: '£', features: ['Combine old pensions', 'Tax relief boost', 'Flexible contributions', 'Ethical plan'], rating: 4.6, reviewCount: 12300, badge: 'Best Pension EU', minTermYears: 5 },
  { id: 'india-nps', provider: 'NPS (Govt of India)', flag: '🇮🇳', country: 'India', region: 'asia', category: 'retirement', productName: 'National Pension System', market: 'India NPS', expectedReturnMin: 8, expectedReturnMax: 11, minInvestment: 500, annualFee: 0.09, riskLevel: 'Medium', currency: 'INR', currencySymbol: '₹', features: ['Extra ₹50k tax break', 'Govt-regulated', 'Equity/debt mix', 'Ultra-low cost'], rating: 4.4, reviewCount: 9700, badge: 'Best Retirement India', minTermYears: 10 },
];

export const INVESTMENT_CATEGORIES = [
  { id: 'all', label: 'All Products', icon: '📈' },
  { id: 'index', label: 'Index / ETF', icon: '📊' },
  { id: 'stocks', label: 'Stocks', icon: '💹' },
  { id: 'realestate', label: 'Real Estate', icon: '🏠' },
  { id: 'crypto', label: 'Crypto', icon: '₿' },
  { id: 'commodities', label: 'Commodities', icon: '🥇' },
  { id: 'bonds', label: 'Bonds', icon: '🏦' },
  { id: 'forex', label: 'Currencies', icon: '💱' },
  { id: 'robo', label: 'Robo-Advisor', icon: '🤖' },
  { id: 'retirement', label: 'Retirement', icon: '🎯' },
] as const;

export const INVESTMENT_CATEGORY_IDS: InvestmentCategory[] = ['index', 'stocks', 'realestate', 'crypto', 'commodities', 'bonds', 'forex', 'robo', 'retirement'];

export const INVESTMENT_CATEGORY_COLORS: Record<string, string> = {
  index: 'from-indigo-500 to-purple-600',
  stocks: 'from-emerald-500 to-green-600',
  realestate: 'from-amber-500 to-orange-600',
  crypto: 'from-orange-500 to-yellow-500',
  commodities: 'from-yellow-500 to-amber-600',
  bonds: 'from-sky-500 to-blue-600',
  forex: 'from-teal-500 to-cyan-600',
  robo: 'from-cyan-500 to-blue-600',
  retirement: 'from-rose-500 to-pink-600',
};

export const INVESTMENT_CATEGORY_INFO: Record<string, string> = {
  index: 'Low-cost funds tracking global markets — S&P 500, Nasdaq, MSCI World, Nifty & more.',
  stocks: 'Trade individual shares on any exchange — NYSE, NASDAQ, NSE, LSE, Tokyo, Shanghai.',
  realestate: 'REITs and property funds across the US, Europe and Asia — earn rental income.',
  crypto: 'Bitcoin, Ethereum and top coins via regulated exchanges and spot ETFs.',
  commodities: 'Gold, silver, copper, oil and precious-metal baskets — hedge against inflation.',
  bonds: 'Government & sovereign bonds worldwide — US Treasuries, Gilts, Bunds, G-Secs, JGBs.',
  forex: 'Currencies and forex — trade major pairs or hold multi-currency positions.',
  robo: 'Hands-off, automatically managed and rebalanced portfolios.',
  retirement: 'Tax-advantaged accounts — IRA, ISA, pension, NPS — for the long term.',
};

export const INVESTMENT_REGIONS = [
  { id: 'all', label: '🌐 All' },
  { id: 'us', label: '🇺🇸 US' },
  { id: 'europe', label: '🇪🇺 Europe' },
  { id: 'asia', label: '🌏 Asia' },
  { id: 'global', label: '🌍 Global' },
] as const;

export const REGION_LABELS: Record<InvestmentRegion, string> = {
  us: '🇺🇸 United States',
  europe: '🇪🇺 Europe',
  asia: '🌏 Asia-Pacific',
  global: '🌍 Global',
};

// ── Matching & projection ────────────────────────────────────────────────────

export interface InvestmentProfileInput {
  country: string;
  goal: string;
  riskTolerance: string;        // 'Conservative' | 'Moderate' | 'Aggressive'
  initialInvestment: number;
  monthlyContribution: number;
  timeHorizonYears: number;
}

const GOAL_TO_CATEGORY: Record<string, InvestmentCategory> = {
  'Retirement': 'retirement', 'Build Wealth': 'index', 'Passive Income': 'realestate',
  'Hands-Off Investing': 'robo', 'Active Trading': 'stocks', 'Education Fund': 'index',
  'Speculative Growth': 'crypto', 'Safe Haven': 'commodities', 'Capital Preservation': 'bonds',
};

const RISK_TO_LEVEL: Record<string, InvestmentProduct['riskLevel']> = {
  Conservative: 'Low', Moderate: 'Medium', Aggressive: 'High',
};

export function goalToCategory(goal: string): InvestmentCategory {
  return GOAL_TO_CATEGORY[goal] ?? 'index';
}

export function estimatedReturn(product: InvestmentProduct, riskTolerance: string): number {
  const mid = (product.expectedReturnMin + product.expectedReturnMax) / 2;
  if (riskTolerance === 'Aggressive') return +((mid + product.expectedReturnMax) / 2).toFixed(2);
  if (riskTolerance === 'Conservative') return +((mid + product.expectedReturnMin) / 2).toFixed(2);
  return +mid.toFixed(2);
}

export function projectValue(initial: number, monthly: number, annualReturnPct: number, years: number): number {
  const r = annualReturnPct / 100 / 12;
  const n = years * 12;
  const fvInitial = initial * Math.pow(1 + r, n);
  const fvContrib = r === 0 ? monthly * n : monthly * ((Math.pow(1 + r, n) - 1) / r);
  return fvInitial + fvContrib;
}

export interface InvestmentMatch {
  product: InvestmentProduct;
  projectedReturn: number;
  projectedValue: number;
  totalContributed: number;
  totalGain: number;
  fits: boolean;
  matchScore: number;
}

export function matchInvestments(profile: InvestmentProfileInput): InvestmentMatch[] {
  const category = goalToCategory(profile.goal);
  const wantedRisk = RISK_TO_LEVEL[profile.riskTolerance] ?? 'Medium';
  const candidates = INVESTMENT_PRODUCTS.filter(p => p.category === category);
  const pool = candidates.length >= 2 ? candidates : INVESTMENT_PRODUCTS;

  const totalContributed = profile.initialInvestment + profile.monthlyContribution * 12 * profile.timeHorizonYears;

  return pool
    .map(product => {
      const projectedReturn = estimatedReturn(product, profile.riskTolerance);
      const projectedValue = projectValue(profile.initialInvestment, profile.monthlyContribution, projectedReturn, profile.timeHorizonYears);
      const totalGain = projectedValue - totalContributed;
      const fits = profile.initialInvestment >= product.minInvestment;
      const riskMatch = product.riskLevel === wantedRisk ? 20 : 5;
      const matchScore = Math.round((fits ? 35 : 5) + riskMatch + Math.max(0, 20 - product.annualFee * 20) + product.rating * 5);
      return { product, projectedReturn, projectedValue, totalContributed, totalGain, fits, matchScore };
    })
    .sort((a, b) => (b.fits === a.fits ? b.projectedValue - a.projectedValue : a.fits ? -1 : 1));
}
