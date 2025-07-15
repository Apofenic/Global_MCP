import { promises as fs } from 'fs';
import { join } from 'path';
import yaml from 'js-yaml';
import Ajv from 'ajv';
import { ServerConfig } from '../types';
import { Logger } from '../utils/Logger';

const logger = Logger.getInstance();

export class ConfigLoader {
  private ajv: Ajv;
  private configSchema: object;

  constructor() {
    this.ajv = new Ajv();
    this.configSchema = this.getConfigSchema();
  }

  public async load(configPath?: string): Promise<ServerConfig> {
    const path = configPath || this.getDefaultConfigPath();
    
    try {
      const configContent = await fs.readFile(path, 'utf-8');
      const config = yaml.load(configContent) as ServerConfig;
      
      // Validate configuration
      const isValid = this.ajv.validate(this.configSchema, config);
      if (!isValid) {
        throw new Error(`Invalid configuration: ${this.ajv.errorsText()}`);
      }
      
      // Apply environment overrides
      this.applyEnvironmentOverrides(config);
      
      logger.info('Configuration loaded successfully', { path });
      return config;
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
        logger.info('Config file not found, using default configuration');
        return this.getDefaultConfig();
      }
      throw error;
    }
  }

  private getDefaultConfigPath(): string {
    return process.env.CONFIG_PATH || join(process.cwd(), 'config', 'server.yaml');
  }

  private getDefaultConfig(): ServerConfig {
    return {
      port: parseInt(process.env.PORT || '3000', 10),
      host: process.env.HOST || '0.0.0.0',
      github: {
        token: process.env.GITHUB_TOKEN,
        apiUrl: process.env.GITHUB_API_URL || 'https://api.github.com',
        webhookSecret: process.env.GITHUB_WEBHOOK_SECRET,
      },
      mcp: {
        version: '1.0.0',
        servers: {},
        timeout: parseInt(process.env.MCP_TIMEOUT || '30000', 10),
        retries: parseInt(process.env.MCP_RETRIES || '3', 10),
      },
      logging: {
        level: (process.env.LOG_LEVEL as any) || 'info',
        format: (process.env.LOG_FORMAT as any) || 'json',
        file: process.env.LOG_FILE,
      },
      personas: {
        directory: process.env.PERSONAS_DIR || join(process.cwd(), 'config', 'personas'),
        defaultPersona: process.env.DEFAULT_PERSONA || 'default',
      },
      plugins: {
        directory: process.env.PLUGINS_DIR || join(process.cwd(), 'plugins'),
        enabled: process.env.ENABLED_PLUGINS?.split(',') || [],
      },
    };
  }

  private applyEnvironmentOverrides(config: ServerConfig): void {
    if (process.env.PORT) {
      config.port = parseInt(process.env.PORT, 10);
    }
    if (process.env.HOST) {
      config.host = process.env.HOST;
    }
    if (process.env.GITHUB_TOKEN) {
      config.github.token = process.env.GITHUB_TOKEN;
    }
    // Add more environment overrides as needed
  }

  private getConfigSchema(): object {
    return {
      type: 'object',
      required: ['port', 'host', 'github', 'mcp', 'logging', 'personas', 'plugins'],
      properties: {
        port: { type: 'number', minimum: 1, maximum: 65535 },
        host: { type: 'string' },
        github: {
          type: 'object',
          required: ['apiUrl'],
          properties: {
            token: { type: 'string' },
            apiUrl: { type: 'string', format: 'uri' },
            webhookSecret: { type: 'string' },
          },
        },
        mcp: {
          type: 'object',
          required: ['version', 'servers', 'timeout', 'retries'],
          properties: {
            version: { type: 'string' },
            servers: { type: 'object' },
            timeout: { type: 'number', minimum: 1000 },
            retries: { type: 'number', minimum: 0 },
          },
        },
        logging: {
          type: 'object',
          required: ['level', 'format'],
          properties: {
            level: { type: 'string', enum: ['debug', 'info', 'warn', 'error'] },
            format: { type: 'string', enum: ['json', 'simple'] },
            file: { type: 'string' },
          },
        },
        personas: {
          type: 'object',
          required: ['directory', 'defaultPersona'],
          properties: {
            directory: { type: 'string' },
            defaultPersona: { type: 'string' },
          },
        },
        plugins: {
          type: 'object',
          required: ['directory', 'enabled'],
          properties: {
            directory: { type: 'string' },
            enabled: { type: 'array', items: { type: 'string' } },
          },
        },
      },
    };
  }
}
