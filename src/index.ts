import 'dotenv/config';
import { Server } from './server/Server';
import { ConfigLoader } from './config/ConfigLoader';
import { Logger } from './utils/Logger';

const logger = Logger.getInstance();

async function main(): Promise<void> {
  try {
    logger.info('Starting Global MCP Server...');
    
    // Load configuration
    const configLoader = new ConfigLoader();
    const config = await configLoader.load();
    
    logger.info('Configuration loaded successfully', { config: { port: config.port, host: config.host } });
    
    // Initialize and start server
    const server = new Server(config);
    await server.start();
    
    logger.info('Global MCP Server started successfully');
    
    // Graceful shutdown handling
    process.on('SIGINT', async () => {
      logger.info('Received SIGINT, shutting down gracefully...');
      await server.stop();
      process.exit(0);
    });
    
    process.on('SIGTERM', async () => {
      logger.info('Received SIGTERM, shutting down gracefully...');
      await server.stop();
      process.exit(0);
    });
    
  } catch (error) {
    logger.error('Failed to start Global MCP Server:', error);
    console.error('Detailed error:', error);
    process.exit(1);
  }
}

main().catch((error) => {
  console.error('Unhandled error:', error);
  process.exit(1);
});
