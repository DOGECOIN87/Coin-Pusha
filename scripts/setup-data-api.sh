#!/bin/bash
# Data API Integration Module for Manus System

PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
MANUS_DATA_DIR="${MANUS_DATA_DIR:-$PROJECT_ROOT/.manus/data}"

# Color codes
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

mkdir -p "$MANUS_DATA_DIR"

# Example: Create data API client template
create_api_client_template() {
  cat > "$PROJECT_ROOT/api_client_template.py" << 'EOF'
#!/usr/bin/env python3
"""
Manus Data API Client Template
This template demonstrates how to use the Data API system for data retrieval
"""

import sys
import json
from datetime import datetime

# Add sandbox runtime to path for data API access
sys.path.append('/opt/.manus/.sandbox-runtime')

class DataAPIClient:
    """
    Client for accessing Manus Data APIs
    
    Usage:
        client = DataAPIClient()
        result = client.call_api('WeatherBank/get_weather', query={'location': 'Singapore'})
        print(result)
    """
    
    def __init__(self):
        """Initialize the Data API client"""
        try:
            from data_api import ApiClient
            self.client = ApiClient()
            self.available = True
        except ImportError:
            self.available = False
            print("Warning: Data API not available in this environment")
    
    def call_api(self, api_name, query=None, params=None):
        """
        Call a data API endpoint
        
        Args:
            api_name: Fully-qualified API name (e.g., 'WeatherBank/get_weather')
            query: Query parameters dict
            params: Additional parameters dict
            
        Returns:
            API response data
        """
        if not self.available:
            raise RuntimeError("Data API client not available")
        
        try:
            result = self.client.call_api(api_name, query=query or {})
            return result
        except Exception as e:
            print(f"API Error: {e}")
            return None
    
    def save_result(self, data, filename):
        """Save API result to file"""
        output_path = f"{filename}.json"
        with open(output_path, 'w') as f:
            json.dump(data, f, indent=2)
        print(f"Data saved to {output_path}")
        return output_path


# Example usage functions
def example_weather_query():
    """Example: Query weather data"""
    client = DataAPIClient()
    data = client.call_api('WeatherBank/get_weather', query={'location': 'Singapore'})
    if data:
        client.save_result(data, 'weather_data')


if __name__ == '__main__':
    print("Manus Data API Client Template")
    print("See comments for usage examples")
EOF
  chmod +x "$PROJECT_ROOT/api_client_template.py"
  echo -e "${GREEN}✓ Created API client template${NC}"
}

# Initialize module
create_api_client_template
