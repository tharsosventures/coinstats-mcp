import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { coinListTool } from './tools/coins.js';

// Create server instance
const server = new McpServer({
    name: 'coinstats-mcp',
    version: '1.0.0',
    capabilities: {
        resources: {},
        tools: {},
    },
});

server.tool(coinListTool.name, coinListTool.description, coinListTool.parameters, coinListTool.handler);

async function main() {
    const transport = new StdioServerTransport();
    await server.connect(transport);
    console.error('CoinStats MCP Server running on stdio');
}

main().catch((error) => {
    console.error('Fatal error in main():', error);
    process.exit(1);
});
