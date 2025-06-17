import express from 'express';

export interface PaymentOptions {
    network?: string;
    currency?: string;
    apiKey?: string;
}

export function paymentMiddleware(payToAddress: string, priceMap: Record<string, string>, opts: PaymentOptions = {}) {
    const expectedApiKey = opts.apiKey ?? process.env.COINSTATS_API_KEY;
    return (req: any, res: any, next: any) => {
        const matched = Object.keys(priceMap).find((pattern) => {
            if (pattern.endsWith('*')) {
                const prefix = pattern.slice(0, -1);
                return req.path.startsWith(prefix);
            }
            return req.path === pattern;
        });

        if (!matched) {
            return next();
        }

        const apiKeyHeader = req.header('X-API-KEY');
        if (expectedApiKey && apiKeyHeader === expectedApiKey) {
            return next();
        }

        const paymentHeader = req.header('X-PAYMENT');
        if (!paymentHeader) {
            res.status(402).send('Payment Required');
            return;
        }

        next();
    };
}

