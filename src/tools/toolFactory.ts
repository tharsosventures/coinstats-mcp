import { z, ZodType } from 'zod';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { universalApiHandler } from '../services/request.js';
import { COINSTATS_API_BASE } from '../config/constants.js';

// Tool configuration interface
export interface ToolConfig<T> {
    name: string;
    description: string;
    endpoint: string;
    method?: string; // HTTP method (GET, POST, PUT, DELETE, etc.)
    basePath?: string; // Optional, defaults to COINSTATS_API_BASE
    parameters: Record<string, ZodType>;
}

// Register all tools with the MCP server
export function registerTools(server: McpServer, toolConfigs: ToolConfig<any>[]) {
    toolConfigs.forEach((config) => {
        server.tool(config.name, config.description, config.parameters, async (params: Record<string, any>) => {
            const basePath = config.basePath || COINSTATS_API_BASE;
            const method = config.method || 'GET';

            // Methods that typically have a request body
            const bodyMethods = ['POST', 'PUT', 'PATCH'];

            // For GET/DELETE requests, all params go in the URL
            // For POST/PUT/PATCH, send params as the body
            if (bodyMethods.includes(method.toUpperCase())) {
                return universalApiHandler(basePath, config.endpoint, method, {}, params);
            } else {
                return universalApiHandler(basePath, config.endpoint, method, params);
            }
        });
    });
}

// Create a standard tool configuration
export function createToolConfig<T>(
    name: string,
    description: string,
    endpoint: string,
    parameters: Record<string, ZodType>,
    method: string = 'GET',
    basePath?: string
): ToolConfig<T> {
    return {
        name,
        description,
        endpoint,
        method,
        parameters,
        basePath,
    };
}
