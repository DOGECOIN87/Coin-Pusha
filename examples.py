#!/usr/bin/env python3
"""
Manus AI System - Example Usage Demonstrations

This file contains practical examples of using the Manus system functions
for common tasks. Each example shows proper error handling and best practices.
"""

import os
import json
from datetime import datetime

# Example 1: File Operations
def example_file_operations():
    """Demonstrate file read, write, and search operations."""
    
    # Create a sample data file
    data = {
        "project": "Manus AI",
        "version": "1.0",
        "status": "active",
        "components": ["messaging", "files", "shell", "browser", "deployment"]
    }
    
    # Write JSON data to file
    output_file = "/home/mattrick/Desktop/Coin-Pusha/.manus/data/example.json"
    with open(output_file, 'w') as f:
        json.dump(data, f, indent=2)
    
    print(f"✓ Created {output_file}")
    
    # Read file contents
    with open(output_file, 'r') as f:
        content = json.load(f)
    
    print(f"✓ Read project: {content['project']}")
    
    return output_file

# Example 2: Task Management
def example_task_management():
    """Demonstrate task creation and tracking."""
    
    tasks = [
        "Configure environment variables",
        "Initialize system components",
        "Setup data APIs",
        "Deploy services",
        "Verify deployment"
    ]
    
    todo_content = "# Task List\n\n"
    for i, task in enumerate(tasks, 1):
        todo_content += f"- [ ] {i}. {task}\n"
    
    todo_file = "/home/mattrick/Desktop/Coin-Pusha/todo.md"
    with open(todo_file, 'w') as f:
        f.write(todo_content)
    
    print(f"✓ Created task list with {len(tasks)} items")
    return todo_file

# Example 3: Log Management
def example_logging():
    """Demonstrate logging best practices."""
    
    log_dir = "/home/mattrick/Desktop/Coin-Pusha/.manus/logs"
    log_file = os.path.join(log_dir, "example_operations.log")
    
    logs = [
        {"timestamp": datetime.now().isoformat(), "level": "INFO", "message": "System initialized"},
        {"timestamp": datetime.now().isoformat(), "level": "INFO", "message": "Configuration loaded"},
        {"timestamp": datetime.now().isoformat(), "level": "INFO", "message": "Services started"},
    ]
    
    with open(log_file, 'w') as f:
        for log in logs:
            f.write(json.dumps(log) + "\n")
    
    print(f"✓ Created log file: {log_file}")
    return log_file

# Example 4: Data Processing Pipeline
def example_data_pipeline():
    """Demonstrate a complete data processing workflow."""
    
    # Input data
    raw_data = {
        "readings": [23.5, 24.1, 23.8, 25.2, 24.5, 23.9],
        "timestamp": datetime.now().isoformat(),
        "location": "Lab A"
    }
    
    # Process data
    avg = sum(raw_data["readings"]) / len(raw_data["readings"])
    min_val = min(raw_data["readings"])
    max_val = max(raw_data["readings"])
    
    # Result
    result = {
        "source": raw_data,
        "analysis": {
            "average": avg,
            "minimum": min_val,
            "maximum": max_val,
            "count": len(raw_data["readings"])
        }
    }
    
    # Save result
    result_file = "/home/mattrick/Desktop/Coin-Pusha/.manus/data/analysis_result.json"
    with open(result_file, 'w') as f:
        json.dump(result, f, indent=2)
    
    print(f"✓ Completed data pipeline analysis")
    return result_file

# Example 5: Environment Configuration
def example_environment_setup():
    """Demonstrate environment configuration best practices."""
    
    env_config = {
        "MANUS_HOME": "/home/mattrick/Desktop/Coin-Pusha/.manus",
        "MANUS_PROJECT_ROOT": "/home/mattrick/Desktop/Coin-Pusha",
        "MANUS_CONFIG": "/home/mattrick/Desktop/Coin-Pusha/config",
        "MANUS_SCRIPTS": "/home/mattrick/Desktop/Coin-Pusha/scripts",
        "MANUS_LOG_DIR": "/home/mattrick/Desktop/Coin-Pusha/.manus/logs",
        "MANUS_CACHE_DIR": "/home/mattrick/Desktop/Coin-Pusha/.manus/cache",
        "MANUS_DATA_DIR": "/home/mattrick/Desktop/Coin-Pusha/.manus/data",
    }
    
    # Create shell environment file
    env_file = "/home/mattrick/Desktop/Coin-Pusha/.manus/manus.env"
    with open(env_file, 'w') as f:
        for key, value in env_config.items():
            f.write(f'export {key}="{value}"\n')
    
    print(f"✓ Created environment file: {env_file}")
    return env_file

# Example 6: API Response Processing
def example_api_response_handling():
    """Demonstrate handling API responses."""
    
    # Simulated API response
    api_response = {
        "status": "success",
        "data": {
            "items": [
                {"id": 1, "name": "Item 1", "value": 100},
                {"id": 2, "name": "Item 2", "value": 200},
                {"id": 3, "name": "Item 3", "value": 150}
            ],
            "total": 450,
            "count": 3
        }
    }
    
    # Process and validate response
    if api_response.get("status") == "success":
        data = api_response["data"]
        print(f"✓ Processed API response with {data['count']} items")
        
        # Save to file
        response_file = "/home/mattrick/Desktop/Coin-Pusha/.manus/data/api_response.json"
        with open(response_file, 'w') as f:
            json.dump(api_response, f, indent=2)
        
        return response_file
    else:
        print("✗ API response error")
        return None

# Example 7: Error Handling Pattern
def example_error_handling():
    """Demonstrate proper error handling patterns."""
    
    def safe_file_operation(filepath, operation="read"):
        """Safely perform file operations with error handling."""
        try:
            if operation == "read":
                with open(filepath, 'r') as f:
                    return f.read()
            elif operation == "write":
                with open(filepath, 'w') as f:
                    f.write("Test content")
                return True
        except FileNotFoundError:
            print(f"✗ File not found: {filepath}")
            return None
        except PermissionError:
            print(f"✗ Permission denied: {filepath}")
            return None
        except Exception as e:
            print(f"✗ Unexpected error: {e}")
            return None
    
    # Test the safe operation
    result = safe_file_operation("/home/mattrick/Desktop/Coin-Pusha/.manus/data/test.txt", "write")
    print(f"✓ Safe file operation completed: {result}")

# Example 8: Progress Tracking
def example_progress_tracking():
    """Demonstrate progress tracking for long operations."""
    
    total_steps = 5
    progress_log = []
    
    steps = [
        "Initializing system",
        "Loading configuration",
        "Setting up services",
        "Running diagnostics",
        "Finalizing setup"
    ]
    
    for i, step in enumerate(steps, 1):
        progress = {
            "step": i,
            "total": total_steps,
            "percentage": (i / total_steps) * 100,
            "task": step,
            "timestamp": datetime.now().isoformat()
        }
        progress_log.append(progress)
        print(f"✓ [{i}/{total_steps}] {step} ({progress['percentage']:.0f}%)")
    
    # Save progress log
    progress_file = "/home/mattrick/Desktop/Coin-Pusha/.manus/data/progress.json"
    with open(progress_file, 'w') as f:
        json.dump(progress_log, f, indent=2)
    
    return progress_file

# Main execution
def main():
    """Run all examples."""
    
    print("=" * 60)
    print("Manus AI System - Example Usage Demonstrations")
    print("=" * 60)
    print()
    
    # Ensure directories exist
    os.makedirs("/home/mattrick/Desktop/Coin-Pusha/.manus/data", exist_ok=True)
    os.makedirs("/home/mattrick/Desktop/Coin-Pusha/.manus/logs", exist_ok=True)
    
    print("Running examples...")
    print()
    
    # Execute examples
    print("[1] File Operations Example")
    example_file_operations()
    print()
    
    print("[2] Task Management Example")
    example_task_management()
    print()
    
    print("[3] Logging Example")
    example_logging()
    print()
    
    print("[4] Data Processing Pipeline Example")
    example_data_pipeline()
    print()
    
    print("[5] Environment Setup Example")
    example_environment_setup()
    print()
    
    print("[6] API Response Handling Example")
    example_api_response_handling()
    print()
    
    print("[7] Error Handling Pattern Example")
    example_error_handling()
    print()
    
    print("[8] Progress Tracking Example")
    example_progress_tracking()
    print()
    
    print("=" * 60)
    print("All examples completed successfully!")
    print("Check .manus/data/ for generated files")
    print("=" * 60)

if __name__ == "__main__":
    main()
