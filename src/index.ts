#!/usr/bin/env node
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import express from 'express';
import { SSEServerTransport } from '@modelcontextprotocol/sdk/server/sse.js';
import { paymentMiddleware } from './middleware/payment.js';
import { registerTools } from './tools/toolFactory.js';
import { allToolConfigs } from './tools/toolConfigs.js';

// Create server instance
const server = new McpServer({
    name: 'coinstats-mcp',
    version: '1.0.0',
    capabilities: {
        resources: {},
        tools: {},
    },
});

// Register all tools from configurations
registerTools(server, allToolConfigs);

async function startHttpServer() {
    const app = express();
    app.use(express.json());
    app.use(
        paymentMiddleware(
            process.env.PAY_TO_ADDRESS || '0x0000000000000000000000000000000000000000',
            {
                '/sse': '$0.005',
                '/messages': '$0.005',
            },
            {
                network: 'base-sepolia',
                currency: 'USDC',
                apiKey: process.env.COINSTATS_API_KEY,
            },
        ),
    );

    const transports: { [sessionId: string]: SSEServerTransport } = {};

    app.get('/sse', async (_req: any, res: any) => {
        const transport = new SSEServerTransport('/messages', res);
        transports[transport.sessionId] = transport;
        res.on('close', () => {
            delete transports[transport.sessionId];
        });
        await server.connect(transport);
    });

    app.post('/messages', async (req: any, res: any) => {
        const sessionId = req.query.sessionId as string;
        const transport = transports[sessionId];
        if (transport) {
            await transport.handlePostMessage(req, res);
        } else {
            res.status(400).send('No transport found for sessionId');
        }
    });

    const port = parseInt(process.env.PORT || '3001', 10);
    app.listen(port, () => {
        console.error(`HTTP server listening on http://localhost:${port}`);
    });
}

async function main() {
    startHttpServer().catch((err) => console.error('HTTP server error:', err));
    const transport = new StdioServerTransport();
    await server.connect(transport);
    console.error('CoinStats MCP Server running on stdio');
}

main().catch((error) => {
    console.error('Fatal error in main():', error);
    process.exit(1);
});

