# Global MCP Server

An extensible, containerized MCP (Model Context Protocol) server designed to act as a central hub for GitHub-enhanced capabilities. This server aggregates and provides access to multiple MCP servers through a unified interface, supporting dynamic configuration, persona prompts, and custom GitHub integrations.

## 🚀 Features

- **Containerized Deployment**: Docker-based deployment for consistency across environments
- **Meta-Server Pattern**: Acts as a proxy/aggregator for multiple underlying MCP servers
- **Plugin-Based Extensibility**: Modular architecture for adding new MCP configurations and logic
- **Dynamic Persona Selection**: Runtime selection of AI personas based on calling repository arguments
- **GitHub Integration**: Enhanced GitHub capabilities beyond standard API
- **Configuration-Driven**: Behavior controlled through external configuration files

## 📁 Project Structure

```
├── src/                    # Source code
│   ├── config/            # Configuration management
│   ├── github/            # GitHub integration
│   ├── persona/           # Persona management
│   ├── plugins/           # Plugin system
│   ├── server/            # Core server implementation
│   ├── types/             # TypeScript type definitions
│   └── utils/             # Utility functions
├── config/                # Configuration files
│   ├── personas/          # Persona definitions
│   └── server.yaml        # Main server configuration
├── docs/                  # Documentation
├── tests/                 # Test files
├── Dockerfile             # Docker configuration
├── docker-compose.yml     # Development environment
└── package.json           # Project dependencies
```

## 🛠️ Development Setup

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Docker (optional, for containerized development)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd Global_MCP
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
# Edit .env with your configuration
```

4. Build the project:
```bash
npm run build
```

5. Start development server:
```bash
npm run dev
```

## 🐳 Docker Development

### Using Docker Compose

```bash
# Start all services
docker-compose up

# Start in development mode
docker-compose up global-mcp-server

# Build and start fresh
docker-compose up --build
```

### Manual Docker Build

```bash
# Build the image
docker build -t global-mcp-server .

# Run the container
docker run -p 3000:3000 --env-file .env global-mcp-server
```

## ⚙️ Configuration

The server uses a YAML-based configuration system with environment variable overrides:

- Main config: `config/server.yaml`
- Environment overrides: `.env` file
- Persona definitions: `config/personas/*.yaml`

### Example Configuration

```yaml
# Server settings
port: 3000
host: "0.0.0.0"

# GitHub integration
github:
  token: "${GITHUB_TOKEN}"
  apiUrl: "https://api.github.com"

# MCP servers
mcp:
  version: "1.0.0"
  servers:
    filesystem:
      type: "stdio"
      command: "npx"
      args: ["-y", "@modelcontextprotocol/server-filesystem", "/workspace"]

# Personas
personas:
  directory: "/app/config/personas"
  defaultPersona: "default"
```

## 🎭 Personas

Personas are AI assistants with specific capabilities and prompts. Create persona files in `config/personas/`:

```yaml
id: "code-reviewer"
name: "Code Reviewer"
description: "Expert code reviewer focused on quality and security"
prompt: |
  You are an expert code reviewer...
capabilities:
  - "code-review"
  - "security-audit"
```

## 📝 Scripts

- `npm run build` - Build the TypeScript project
- `npm run start` - Start the production server
- `npm run dev` - Start development server with hot reload
- `npm run test` - Run tests
- `npm run lint` - Lint code
- `npm run format` - Format code with Prettier

## 🔧 API Endpoints

- `GET /health` - Health check
- `POST /mcp/servers` - List available MCP servers
- `POST /mcp/personas` - List available personas
- `POST /mcp/request` - Forward MCP requests

## 🚧 Development Status

### ✅ Completed (Phase 1)

- [x] Project scaffolding and environment setup
- [x] Docker containerization
- [x] Configuration system with validation
- [x] Basic server structure
- [x] TypeScript setup with linting and testing

### 🚀 Next Steps (Phase 2)

- [ ] Core MCP protocol implementation
- [ ] Server registry and discovery
- [ ] Request routing engine

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details.
