# Manus AI System - Complete Environment Setup

Welcome to the Manus AI Assistant system environment! This comprehensive setup includes all necessary configurations, utilities, and documentation to leverage the full suite of available functions and capabilities.

## 📋 Table of Contents

1. [Quick Start](#quick-start)
2. [System Architecture](#system-architecture)
3. [Available Functions & Tools](#available-functions--tools)
4. [Configuration Files](#configuration-files)
5. [Utility Scripts](#utility-scripts)
6. [Environment Setup](#environment-setup)
7. [Development Workflow](#development-workflow)
8. [Advanced Usage](#advanced-usage)
9. [Troubleshooting](#troubleshooting)

## 🚀 Quick Start

### Initial Setup

1. Initialize the system:
```bash
cd /home/mattrick/Desktop/Coin-Pusha
bash scripts/init.sh
```

2. Load environment variables:
```bash
source .manus/manus.env
```

3. Verify installation:
```bash
bash scripts/service-manager.sh list
```

## 🏗️ System Architecture

The Manus system is organized into the following structure:

```
Coin-Pusha/
├── .manus/                    # System runtime directory
│   ├── runtime/              # Service runtime files and PIDs
│   ├── logs/                 # System and service logs
│   ├── cache/                # Cached data and temporary files
│   ├── data/                 # Persistent data storage
│   └── manus.env            # Environment configuration
├── config/                   # Configuration files
│   ├── tools.json           # Tool definitions (JSON schema)
│   └── system-prompt.md     # System prompt and guidelines
├── scripts/                  # Utility scripts
│   ├── init.sh              # Initialization script
│   ├── task-manager.sh      # Task management utility
│   ├── service-manager.sh   # Service lifecycle management
│   └── setup-data-api.sh    # Data API integration setup
└── README.md               # This file
```

## 🛠️ Available Functions & Tools

### Core Function Categories

#### 1. **Messaging Tools**
- `message_notify_user()` - Send non-blocking messages for updates and acknowledgments
- `message_ask_user()` - Request user response for clarification or confirmation

#### 2. **File Operations**
- `file_read()` - Read file contents (with optional line ranges)
- `file_write()` - Write or append content to files
- `file_str_replace()` - Replace specific strings within files
- `file_find_in_content()` - Search for patterns using regex
- `file_find_by_name()` - Locate files by name pattern

#### 3. **Shell Execution**
- `shell_exec()` - Execute arbitrary shell commands
- `shell_view()` - View output from shell sessions
- `shell_wait()` - Wait for long-running processes
- `shell_write_to_process()` - Interact with running processes
- `shell_kill_process()` - Terminate processes

#### 4. **Web & Browsing**
- `browser_navigate()` - Navigate to URLs
- `browser_restart()` - Restart browser session
- `browser_click()` - Click page elements
- `browser_input()` - Fill form fields
- `browser_scroll_up/down()` - Navigate page content
- `browser_console_exec()` - Execute JavaScript
- `browser_press_key()` - Simulate keyboard input

#### 5. **Information & Search**
- `info_search_web()` - Search the internet using search engines
- Supports date range filtering and keyword-based queries

#### 6. **Deployment & Service Exposure**
- `deploy_expose_port()` - Expose local ports for temporary public access
- `deploy_apply_deployment()` - Deploy static/Next.js applications

#### 7. **Special Functions**
- `idle()` - Signal completion and enter idle state

### Function Capabilities Matrix

| Category | Functions | Use Cases |
|----------|-----------|-----------|
| **Communication** | notify_user, ask_user | User interaction, progress updates |
| **File Management** | read, write, search, replace | Data processing, configuration |
| **Shell Commands** | exec, view, wait, kill | System automation, CLI tools |
| **Web Interaction** | navigate, click, input, scroll | Web scraping, testing |
| **Information** | search_web | Research, fact-checking |
| **Deployment** | expose_port, apply_deployment | Service sharing, production deployment |

## 📄 Configuration Files

### tools.json
Located at `config/tools.json`, this file contains the formal JSON schema definition for all available tools. It includes:
- Function names and descriptions
- Parameter specifications
- Type definitions
- Required vs optional parameters

### system-prompt.md
Located at `config/system-prompt.md`, this defines:
- System identity and capabilities
- Operational principles
- Task approach methodology
- Error handling procedures

## 🔧 Utility Scripts

### 1. init.sh - System Initialization
```bash
bash scripts/init.sh
```
**What it does:**
- Creates directory structure
- Sets up environment variables
- Initializes git repository
- Creates .gitignore
- Verifies system dependencies

**Environment Variables Set:**
- `MANUS_HOME` - System root directory
- `MANUS_PROJECT_ROOT` - Project root
- `MANUS_CONFIG` - Configuration directory
- `MANUS_SCRIPTS` - Scripts directory
- `MANUS_LOG_DIR` - Log directory
- `MANUS_CACHE_DIR` - Cache directory
- `MANUS_DATA_DIR` - Data directory

### 2. task-manager.sh - Task Management
```bash
# List all tasks
bash scripts/task-manager.sh list

# Add new task
bash scripts/task-manager.sh add "Task description"

# Mark task as complete
bash scripts/task-manager.sh complete 1

# Show statistics
bash scripts/task-manager.sh stats
```

**Features:**
- Create and manage todo.md
- Track task completion
- View task statistics
- Support for multiple task states (pending, in-progress, completed)

### 3. service-manager.sh - Service Lifecycle
```bash
# Start a service
bash scripts/service-manager.sh start service-name "command to run"

# Stop a service
bash scripts/service-manager.sh stop service-name

# Check status
bash scripts/service-manager.sh status service-name

# List all services
bash scripts/service-manager.sh list
```

**Features:**
- PID-based service tracking
- Automatic log file management
- Graceful shutdown and force kill
- Service status monitoring

### 4. setup-data-api.sh - Data API Integration
```bash
bash scripts/setup-data-api.sh
```

**What it does:**
- Creates API client template
- Sets up data integration examples
- Configures data directory

## 🔐 Environment Setup

### Loading Environment Variables

```bash
# Source the environment file
source .manus/manus.env

# Verify variables are loaded
echo $MANUS_HOME
```

### Python Environment

For Python-based tasks, ensure you have:
```bash
# Check Python version
python3 --version

# Create virtual environment (optional)
python3 -m venv venv
source venv/bin/activate
```

### Node.js Environment

For JavaScript/Node.js tasks:
```bash
# Check Node version
node --version

# Install dependencies
npm install
```

## 📊 Development Workflow

### 1. Task Planning

Create a structured task list:
```bash
bash scripts/task-manager.sh add "Analyze requirements"
bash scripts/task-manager.sh add "Design solution"
bash scripts/task-manager.sh add "Implement code"
bash scripts/task-manager.sh add "Test and validate"
```

### 2. Execution & Tracking

```bash
# Mark task as in-progress
bash scripts/task-manager.sh in-progress 2

# Execute task using available functions
# (E.g., file operations, shell commands, web browsing)

# Mark as complete when done
bash scripts/task-manager.sh complete 2
```

### 3. Monitoring & Logging

```bash
# View service logs
tail -f .manus/logs/*.log

# Check service status
bash scripts/service-manager.sh list

# View task statistics
bash scripts/task-manager.sh stats
```

### 4. Data Management

```bash
# Store data results
# Files are saved to: .manus/data/

# Access cached information
ls -la .manus/cache/

# Review logs
ls -la .manus/logs/
```

## 🔬 Advanced Usage

### Shell Command Execution

Execute complex commands with proper error handling:
```bash
# Run command in specific directory
bash scripts/shell-exec.sh "pwd && ls -la"

# Chain commands
bash scripts/shell-exec.sh "cd /tmp && mkdir test && cd test && pwd"
```

### Data API Integration

Query data APIs programmatically:
```python
#!/usr/bin/env python3
import sys
sys.path.append('/opt/.manus/.sandbox-runtime')

from data_api import ApiClient
client = ApiClient()

# Query weather data
result = client.call_api('WeatherBank/get_weather', 
                         query={'location': 'Singapore'})
print(result)
```

### Service Deployment

Expose services for external access:
```bash
# Start a web server
python3 -m http.server 8000 &

# Expose port 8000
bash scripts/service-manager.sh start webserver \
  "python3 -m http.server 8000"

# Deploy to production (if applicable)
# deploy_apply_deployment("static", "/home/mattrick/Desktop/Coin-Pusha/public")
```

### File Processing

Perform batch file operations:
```bash
# Find all Python files
find . -name "*.py" -type f

# Process files
for file in *.txt; do
  # Your processing logic
  echo "Processing $file"
done
```

## 🐛 Troubleshooting

### Common Issues

#### 1. Environment Variables Not Loaded
```bash
# Verify environment file exists
ls -la .manus/manus.env

# Source manually
source .manus/manus.env

# Test
echo $MANUS_HOME
```

#### 2. Permission Denied on Scripts
```bash
# Make scripts executable
chmod +x scripts/*.sh

# Run with bash explicitly
bash scripts/init.sh
```

#### 3. Missing Dependencies
```bash
# Check for required tools
which python3
which node
which git

# Install missing tools on Ubuntu/Debian
sudo apt update
sudo apt install python3 python3-pip nodejs npm git
```

#### 4. Service Won't Start
```bash
# Check logs
tail -f .manus/logs/*.log

# Verify command syntax
bash scripts/service-manager.sh status service-name

# Check ports
netstat -tulpn | grep LISTEN
```

#### 5. Data API Connection Issues
```bash
# Verify API client is available
python3 -c "import sys; sys.path.append('/opt/.manus/.sandbox-runtime'); from data_api import ApiClient"

# Test simple query
python3 api_client_template.py
```

## 📚 Additional Resources

### Configuration Best Practices

1. **Keep environment variables consistent** - Use the provided `.manus/manus.env`
2. **Log everything** - All operations logged to `.manus/logs/`
3. **Version control** - Use git to track changes (see `.gitignore`)
4. **Data safety** - Backup `.manus/data/` regularly

### Performance Optimization

1. **Use caching** - Store intermediate results in `.manus/cache/`
2. **Batch operations** - Group related tasks
3. **Monitor resources** - Check system load and memory usage
4. **Clean up** - Remove old logs and cache files regularly

### Security Considerations

1. **Sensitive data** - Never commit credentials to git
2. **Environment secrets** - Use `.env` files in `.manus/` (not tracked)
3. **Permissions** - Properly set file and directory permissions
4. **API keys** - Store in environment variables, never in code

## ✅ Verification Checklist

After setup, verify everything is working:

- [ ] Environment variables loaded: `echo $MANUS_HOME`
- [ ] All scripts executable: `ls -l scripts/`
- [ ] Directories created: `ls -la .manus/`
- [ ] Configuration files present: `ls -la config/`
- [ ] Git initialized: `git status`
- [ ] Todo system working: `bash scripts/task-manager.sh stats`
- [ ] Services manageable: `bash scripts/service-manager.sh list`

## 🎯 Next Steps

1. **Explore Tools** - Review `config/tools.json` for available functions
2. **Run Examples** - Execute the sample API client template
3. **Create Tasks** - Use task-manager.sh to organize work
4. **Develop Solution** - Use available tools to accomplish objectives
5. **Document Results** - Save findings to `.manus/data/`

## 📞 Support

For issues or questions:
1. Check the Troubleshooting section
2. Review log files in `.manus/logs/`
3. Verify configuration in `.manus/manus.env`
4. Test individual tools manually

---

**Last Updated**: February 15, 2026  
**System Version**: Manus AI v1.0  
**Status**: Ready for Production
