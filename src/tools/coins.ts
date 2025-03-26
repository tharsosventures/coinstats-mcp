import { z } from 'zod';
import { COINSTATS_API_BASE } from '../config/constants.js';
import { makeRequestCsApi } from '../services/request.js';
import { Coin, CoinListParams, ICoinList } from '../types/coin.js';

export const coinListTool = {
    name: 'get-coin-list',
    description:
        'Get comprehensive data about all cryptocurrencies: Price, market cap, and volume. Price changes (1h, 24h, 7d). Supply information. Trading metrics. Social links and metadata. Optional Parameters: currency: Price display currency (default: USD). limit & skip: Pagination controls. includeRiskScore: Add risk analysis data. categories: Filter by coin categories. blockchain: Filter by blockchain networks. Sorting Options: sortBy: rank, price, volume, etc. sortDir: asc or desc',
    parameters: {
        name: z.string().optional().describe('Search coins by name'),
        page: z.number().optional().describe('Page number').default(1),
        limit: z.number().optional().describe('Number of results per page').default(20),
        currency: z.string().optional().describe('Currency for price data').default('USD'),
        symbol: z.string().optional().describe('Get coins by symbol'),
        blockchains: z.string().optional().describe('Blockchain filters, separated by commas (e.g., ethereum,solana)'),
        includeRiskScore: z.string().optional().describe('Include risk score: true or false. Default - false'),
        categories: z.string().optional().describe('Category filters, separated by commas (e.g., memecoins,sports)'),
        sortBy: z.string().optional().describe('Field to sort by'),
        sortDir: z.enum(['asc', 'desc']).optional().describe('Sort direction'),

        // Market Cap filters
        'marketCap~greaterThan': z.number().optional().describe('Marketcap Greater Than'),
        'marketCap~equals': z.number().optional().describe('Marketcap Equals'),
        'marketCap~lessThan': z.number().optional().describe('Marketcap Less Than'),

        // Fully Diluted Valuation filters
        'fullyDilutedValuation~greaterThan': z.number().optional().describe('Fully Diluted Valuation Greater Than'),
        'fullyDilutedValuation~equals': z.number().optional().describe('Fully Diluted Valuation Equals'),
        'fullyDilutedValuation~lessThan': z.number().optional().describe('Fully Diluted Valuation Less Than'),

        // Volume filters
        'volume~greaterThan': z.number().optional().describe('Volume Greater Than'),
        'volume~equals': z.number().optional().describe('Volume Equals'),
        'volume~lessThan': z.number().optional().describe('Volume Less Than'),

        // Price Change filters
        'priceChange1h~greaterThan': z.number().optional().describe('Price Change 1h Greater Than'),
        'priceChange1h~equals': z.number().optional().describe('Price Change 1h Equals'),
        'priceChange1h~lessThan': z.number().optional().describe('Price Change 1h Less Than'),

        'priceChange1d~greaterThan': z.number().optional().describe('Price Change 1d Greater Than'),
        'priceChange1d~equals': z.number().optional().describe('Price Change 1d Equals'),
        'priceChange1d~lessThan': z.number().optional().describe('Price Change 1d Less Than'),

        'priceChange7d~greaterThan': z.number().optional().describe('Price Change 7d Greater Than'),
        'priceChange7d~equals': z.number().optional().describe('Price Change 7d Equals'),
        'priceChange7d~lessThan': z.number().optional().describe('Price Change 7d Less Than'),

        // Supply filters
        'availableSupply~greaterThan': z.number().optional().describe('Available Supply Greater Than'),
        'availableSupply~equals': z.number().optional().describe('Available Supply Equals'),
        'availableSupply~lessThan': z.number().optional().describe('Available Supply Less Than'),

        'totalSupply~greaterThan': z.number().optional().describe('Total Supply Greater Than'),
        'totalSupply~equals': z.number().optional().describe('Total Supply Equals'),
        'totalSupply~lessThan': z.number().optional().describe('Total Supply Less Than'),

        // Rank filters
        'rank~greaterThan': z.number().optional().describe('Rank Greater Than'),
        'rank~equals': z.number().optional().describe('Rank Equals'),
        'rank~lessThan': z.number().optional().describe('Rank Less Than'),

        // Price filters
        'price~greaterThan': z.number().optional().describe('Price Greater Than'),
        'price~equals': z.number().optional().describe('Price Equals'),
        'price~lessThan': z.number().optional().describe('Price Less Than'),

        // Risk Score filters
        'riskScore~greaterThan': z.number().optional().describe('Risk Score Greater Than (Only if includeRiskScore=true)'),
        'riskScore~equals': z.number().optional().describe('Risk Score Equals (Only if includeRiskScore=true)'),
        'riskScore~lessThan': z.number().optional().describe('Risk Score Less Than (Only if includeRiskScore=true)'),
    },
    handler: async (params: CoinListParams) => {
        // Get grid point data
        const url = `${COINSTATS_API_BASE}/coins`;
        const data = await makeRequestCsApi<ICoinList>(url, params);

        if (!data) {
            return {
                content: [{ type: 'text' as const, text: 'Something went wrong', isError: true }],
            };
        }

        if (data.result.length === 0) {
            return {
                content: [{ type: 'text' as const, text: 'No data found' }],
            };
        }

        return {
            content: [
                {
                    type: 'text' as const,
                    text: JSON.stringify(data.result),
                },
            ],
        };
    },
};
