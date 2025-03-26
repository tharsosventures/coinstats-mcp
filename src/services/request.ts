import { COINSTATS_API_KEY } from '../config/constants.js';

// Helper function for making NWS API requests
export async function makeRequestCsApi<T>(url: string, params: Record<string, any> = {}): Promise<T | null> {
    const headers = {
        'X-API-KEY': COINSTATS_API_KEY,
    };

    try {
        const queryParams = new URLSearchParams(params);
        const response = await fetch(`${url}?${queryParams.toString()}`, { headers });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return (await response.json()) as T;
    } catch (error) {
        return null;
    }
}
