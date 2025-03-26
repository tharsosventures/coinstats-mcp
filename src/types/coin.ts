export interface ICoinList {
    result: Coin[];
    meta: Meta;
}

export interface Meta {
    page: number;
    limit: number;
    itemCount: number;
    pageCount: number;
    hasPreviousPage: boolean;
    hasNextPage: boolean;
}

export interface Coin {
    id: string;
    icon: string;
    name: string;
    symbol: string;
    rank: number;
    price: number;
    priceBtc: number;
    volume: number;
    marketCap: number;
    availableSupply: number;
    totalSupply: number;
    fullyDilutedValuation: number;
    priceChange1h: number;
    priceChange1d: number;
    priceChange1w: number;
    redditUrl: string;
    twitterUrl: string;
    explorers: string[];
    websiteUrl?: string;
    contractAddress?: string;
    decimals?: number;
}

export interface CoinListParams {
    name?: string;
    page?: number;
    limit?: number;
    currency?: string;
    symbol?: string;
    blockchains?: string;
    includeRiskScore?: string;
    categories?: string;
    sortBy?: string;
    sortDir?: 'asc' | 'desc';
    'marketCap~greaterThan'?: number;
    'marketCap~equals'?: number;
    'marketCap~lessThan'?: number;
    'fullyDilutedValuation~greaterThan'?: number;
    'fullyDilutedValuation~equals'?: number;
    'fullyDilutedValuation~lessThan'?: number;
    'volume~greaterThan'?: number;
    'volume~equals'?: number;
    'volume~lessThan'?: number;
    'priceChange1h~greaterThan'?: number;
    'priceChange1h~equals'?: number;
    'priceChange1h~lessThan'?: number;
    'priceChange1d~greaterThan'?: number;
    'priceChange1d~equals'?: number;
    'priceChange1d~lessThan'?: number;
    'priceChange7d~greaterThan'?: number;
    'priceChange7d~equals'?: number;
    'priceChange7d~lessThan'?: number;
    'availableSupply~greaterThan'?: number;
    'availableSupply~equals'?: number;
    'availableSupply~lessThan'?: number;
    'totalSupply~greaterThan'?: number;
    'totalSupply~equals'?: number;
    'totalSupply~lessThan'?: number;
    'rank~greaterThan'?: number;
    'rank~equals'?: number;
    'rank~lessThan'?: number;
    'price~greaterThan'?: number;
    'price~equals'?: number;
    'price~lessThan'?: number;
    'riskScore~greaterThan'?: number;
    'riskScore~equals'?: number;
    'riskScore~lessThan'?: number;
}
