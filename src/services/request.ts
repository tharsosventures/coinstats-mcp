import { COINSTATS_API_KEY } from '../config/constants.js';

// Helper function for making CoinStats API requests
export async function makeRequestCsApi<T>(url: string, method: string = 'GET', params: Record<string, any> = {}, body?: any): Promise<T | null> {
    const headers = {
        'X-API-KEY': COINSTATS_API_KEY,
        'Content-Type': 'application/json',
    };

    try {
        // Build request options
        const options: RequestInit = { method, headers };

        // Add body for non-GET requests if provided
        if (method !== 'GET' && body) {
            options.body = JSON.stringify(body);
        }

        // Add query params for all requests
        const queryParams = new URLSearchParams(params);
        const queryString = queryParams.toString();
        const urlWithParams = queryString ? `${url}?${queryString}` : url;

        const response = await fetch(urlWithParams, options);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return (await response.json()) as T;
    } catch (error) {
        return null;
    }
}

// Universal handler for API requests
export async function universalApiHandler<T>(
    basePath: string,
    endpoint: string,
    method: string = 'GET',
    params: Record<string, any> = {},
    body?: any
): Promise<{
    content: Array<{ type: 'text'; text: string; isError?: boolean }>;
}> {
    try {
        // MCP clients might not support '~' in parameter names, so we replace '-' with '~' specifically for the /coins endpoint before making the request.
        let processedParams = params;
        if (endpoint === '/coins') {
            processedParams = Object.entries(params).reduce((acc, [key, value]) => {
                acc[key.replace(/-/g, '~')] = value;
                return acc;
            }, {} as Record<string, any>);
        }

        const url = `${basePath}${endpoint}`;
        const data = await makeRequestCsApi<T>(url, method, processedParams, body);

        if (!data) {
            return {
                content: [{ type: 'text', text: 'Something went wrong', isError: true }],
            };
        }

        return {
            content: [
                {
                    type: 'text',
                    text: JSON.stringify(data),
                },
            ],
        };
    } catch (error) {
        return {
            content: [{ type: 'text', text: `Error: ${error}`, isError: true }],
        };
    }
}
