import express from 'express';
import { createServer, Server as HttpServer } from 'http';
import WebSocket from 'ws';
import { ServerConfig } from '../types';
import { Logger } from '../utils/Logger';

const logger = Logger.getInstance();

export class Server {
  private app: express.Application;
  private httpServer: HttpServer;
  private wsServer: WebSocket.Server;
  private config: ServerConfig;

  constructor(config: ServerConfig) {
    this.config = config;
    this.app = express();
    this.httpServer = createServer(this.app);
    this.wsServer = new WebSocket.Server({ server: this.httpServer });
    
    this.setupMiddleware();
    this.setupRoutes();
    this.setupWebSocket();
  }

  public async start(): Promise<void> {
    return new Promise((resolve) => {
      this.httpServer.listen(this.config.port, this.config.host, () => {
        logger.info(`Server listening on ${this.config.host}:${this.config.port}`);
        resolve();
      });
    });
  }

  public async stop(): Promise<void> {
    return new Promise((resolve) => {
      this.wsServer.close(() => {
        this.httpServer.close(() => {
          logger.info('Server stopped');
          resolve();
        });
      });
    });
  }

  private setupMiddleware(): void {
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
    
    // CORS
    this.app.use((_req, res, next) => {
      res.header('Access-Control-Allow-Origin', '*');
      res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
      res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
      next();
    });
  }

  private setupRoutes(): void {
    // Health check
    this.app.get('/health', (_req, res) => {
      res.json({ status: 'ok', timestamp: new Date().toISOString() });
    });

    // MCP endpoints
    this.app.post('/mcp/servers', this.handleListServers.bind(this));
    this.app.post('/mcp/personas', this.handleListPersonas.bind(this));
    this.app.post('/mcp/request', this.handleMCPRequest.bind(this));
  }

  private setupWebSocket(): void {
    this.wsServer.on('connection', (ws) => {
      logger.debug('WebSocket connection established');
      
      ws.on('message', async (data) => {
        try {
          const message = JSON.parse(data.toString());
          const response = await this.handleWebSocketMessage(message);
          ws.send(JSON.stringify(response));
        } catch (error) {
          logger.error('WebSocket message error:', error);
          ws.send(JSON.stringify({ error: 'Invalid message format' }));
        }
      });

      ws.on('close', () => {
        logger.debug('WebSocket connection closed');
      });
    });
  }

  private async handleListServers(req: express.Request, res: express.Response): Promise<void> {
    try {
      // TODO: Implement server listing logic
      res.json({ servers: Object.keys(this.config.mcp.servers) });
    } catch (error) {
      logger.error('Error listing servers:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  private async handleListPersonas(req: express.Request, res: express.Response): Promise<void> {
    try {
      // TODO: Implement persona listing logic
      res.json({ personas: [] });
    } catch (error) {
      logger.error('Error listing personas:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  private async handleMCPRequest(req: express.Request, res: express.Response): Promise<void> {
    try {
      // TODO: Implement MCP request handling logic
      res.json({ result: 'Not implemented yet' });
    } catch (error) {
      logger.error('Error handling MCP request:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  private async handleWebSocketMessage(message: any): Promise<any> {
    // TODO: Implement WebSocket message handling
    return { id: message.id, result: 'Not implemented yet' };
  }
}
