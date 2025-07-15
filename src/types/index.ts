export interface ServerConfig {
  port: number;
  host: string;
  github: GitHubConfig;
  mcp: MCPConfig;
  logging: LoggingConfig;
  personas: PersonasConfig;
  plugins: PluginsConfig;
}

export interface GitHubConfig {
  token?: string;
  apiUrl: string;
  webhookSecret?: string;
}

export interface MCPConfig {
  version: string;
  servers: Record<string, MCPServerConfig>;
  timeout: number;
  retries: number;
}

export interface MCPServerConfig {
  type: 'stdio' | 'sse' | 'websocket';
  command?: string;
  args?: string[];
  env?: Record<string, string>;
  url?: string;
}

export interface LoggingConfig {
  level: 'debug' | 'info' | 'warn' | 'error';
  format: 'json' | 'simple';
  file?: string;
}

export interface PersonasConfig {
  directory: string;
  defaultPersona: string;
}

export interface PluginsConfig {
  directory: string;
  enabled: string[];
}

export interface MCPRequest {
  id: string;
  method: string;
  params?: Record<string, unknown>;
}

export interface MCPResponse {
  id: string;
  result?: unknown;
  error?: MCPError;
}

export interface MCPError {
  code: number;
  message: string;
  data?: unknown;
}

export interface Persona {
  id: string;
  name: string;
  description: string;
  prompt: string;
  capabilities: string[];
  metadata?: Record<string, unknown>;
}

export interface RepositoryContext {
  owner: string;
  repo: string;
  branch?: string;
  path?: string;
  user?: {
    login: string;
    id: number;
  };
}
