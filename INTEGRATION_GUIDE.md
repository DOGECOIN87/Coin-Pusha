# Manus AI System - Integration Guide

## Quick Integration Examples

This guide provides ready-to-use code snippets and workflow examples for integrating Manus functions into your projects.

---

## 1. Message-Based User Communication

### Pattern: Notify and Ask Loop

```python
def interactive_workflow():
    # Step 1: Notify user of task start
    message_notify_user(
        "Starting data analysis workflow...",
        attachments=["config/settings.json"]
    )
    
    # Step 2: Perform analysis
    results = analyze_data()
    
    # Step 3: Ask for confirmation
    response = message_ask_user(
        f"Results show {len(results)} items. Proceed with deployment?",
        attachments=["results.json"]
    )
    
    if response.lower() == "yes":
        deploy_results(results)
        message_notify_user("✓ Deployment complete!")
    else:
        message_notify_user("⚠ Deployment cancelled")
```

---

## 2. File Processing Pipeline

### Pattern: Read → Process → Write

```python
def process_config_files():
    # Find all configuration files
    configs = file_find_by_name("/home/user/app", "**/*.json")
    
    processed = []
    for config_file in configs:
        # Read configuration
        content = file_read(config_file)
        data = json.loads(content)
        
        # Process data
        processed_data = transform_config(data)
        
        # Save processed version
        output_path = config_file.replace(".json", ".processed.json")
        file_write(output_path, json.dumps(processed_data, indent=2))
        
        processed.append(output_path)
    
    message_notify_user(f"Processed {len(processed)} configuration files")
    return processed
```

---

## 3. Shell Command Automation

### Pattern: Execute → Wait → Process Results

```python
def automated_build_pipeline():
    # Start build process
    shell_exec(
        id="build",
        exec_dir="/home/user/project",
        command="npm install && npm run build"
    )
    
    # Wait for completion (max 30 minutes)
    shell_wait("build", seconds=1800)
    
    # Check results
    build_output = shell_view("build")
    
    if "error" in build_output.lower():
        file_write(
            "/home/user/build_errors.log",
            build_output,
            trailing_newline=true
        )
        message_notify_user(
            "⚠ Build completed with errors",
            attachments=["/home/user/build_errors.log"]
        )
    else:
        message_notify_user("✓ Build completed successfully")
```

---

## 4. Web Scraping & Data Extraction

### Pattern: Navigate → Extract → Save

```python
def web_data_extraction():
    # Navigate to target website
    browser_navigate("https://example.com/data")
    
    # Wait for page load (implementation depends on site)
    time.sleep(2)
    
    # Extract data using JavaScript
    data = browser_console_exec("""
        const items = document.querySelectorAll('.data-item');
        return Array.from(items).map(item => ({
            title: item.querySelector('.title')?.textContent,
            value: item.querySelector('.value')?.textContent
        }));
    """)
    
    # Save extracted data
    file_write(
        "/home/user/extracted_data.json",
        json.dumps(data, indent=2)
    )
    
    message_notify_user(f"✓ Extracted {len(data)} items from website")
```

---

## 5. Batch Search and Research

### Pattern: Search → Aggregate → Analyze

```python
def research_topic(topic):
    # Search for information
    results = info_search_web(
        query=topic,
        date_range="past_month"
    )
    
    # Process results
    research_data = {
        "topic": topic,
        "search_date": datetime.now().isoformat(),
        "total_results": len(results),
        "sources": []
    }
    
    for result in results:
        research_data["sources"].append({
            "title": result.get("title"),
            "url": result.get("url"),
            "snippet": result.get("snippet")
        })
    
    # Save research findings
    output_file = f"/home/user/research_{topic.replace(' ', '_')}.json"
    file_write(output_file, json.dumps(research_data, indent=2))
    
    message_notify_user(
        f"✓ Research complete: {len(results)} sources found",
        attachments=[output_file]
    )
    
    return research_data
```

---

## 6. Service Deployment Workflow

### Pattern: Build → Test → Deploy

```python
def deploy_application(app_type, app_dir):
    message_notify_user("Starting deployment process...")
    
    # Build phase
    message_notify_user("Step 1: Building application...")
    shell_exec("deploy", app_dir, "npm run build")
    shell_wait("deploy", seconds=600)
    
    # Test phase
    message_notify_user("Step 2: Running tests...")
    shell_exec("deploy", app_dir, "npm test")
    build_output = shell_view("deploy")
    
    if "passed" not in build_output:
        message_notify_user("⚠ Tests failed - deployment cancelled")
        return False
    
    # Expose for testing
    message_notify_user("Step 3: Exposing for preview...")
    public_url = deploy_expose_port(8080)
    
    # Ask for confirmation
    confirmation = message_ask_user(
        f"Preview available at: {public_url}\nProceed with production deployment?",
        suggest_user_takeover="browser"
    )
    
    if confirmation.lower() == "yes":
        # Production deployment
        message_notify_user("Step 4: Deploying to production...")
        result = deploy_apply_deployment(app_type, app_dir)
        
        message_notify_user(
            f"✓ Deployment complete!\nLive at: {result['url']}",
            attachments=[app_dir]
        )
        return True
    
    return False
```

---

## 7. Task-Based Project Management

### Pattern: Create → Track → Update

```python
def manage_project(project_name, tasks):
    # Create todo list
    todo_content = f"# {project_name}\n\n"
    
    for i, task in enumerate(tasks, 1):
        todo_content += f"- [ ] {i}. {task}\n"
    
    todo_file = f"/home/user/{project_name.replace(' ', '_')}_todo.md"
    file_write(todo_file, todo_content)
    
    message_notify_user(
        f"✓ Project '{project_name}' created with {len(tasks)} tasks",
        attachments=[todo_file]
    )
    
    # Track progress
    for i, task in enumerate(tasks, 1):
        message_ask_user(
            f"[{i}/{len(tasks)}] Complete this task?\n{task}",
            suggest_user_takeover="none"
        )
        
        # Update task status
        old_line = f"- [ ] {i}."
        new_line = f"- [x] {i}."
        file_str_replace(todo_file, old_line, new_line)
        
        completion = (i / len(tasks)) * 100
        message_notify_user(f"Progress: {completion:.0f}% complete")
    
    return todo_file
```

---

## 8. Data Pipeline with Error Handling

### Pattern: Robust ETL Process

```python
def robust_data_pipeline(source_file):
    """Extract, Transform, Load with comprehensive error handling"""
    
    pipeline_log = {
        "start_time": datetime.now().isoformat(),
        "stages": {},
        "errors": []
    }
    
    try:
        # Extract
        message_notify_user("Pipeline: Extract phase starting...")
        try:
            raw_data = file_read(source_file)
            data = json.loads(raw_data)
            pipeline_log["stages"]["extract"] = "success"
        except Exception as e:
            pipeline_log["errors"].append(f"Extract failed: {str(e)}")
            raise
        
        # Transform
        message_notify_user("Pipeline: Transform phase starting...")
        try:
            transformed = transform_data(data)
            pipeline_log["stages"]["transform"] = "success"
        except Exception as e:
            pipeline_log["errors"].append(f"Transform failed: {str(e)}")
            raise
        
        # Load
        message_notify_user("Pipeline: Load phase starting...")
        try:
            output_file = f"{source_file}.processed.json"
            file_write(output_file, json.dumps(transformed, indent=2))
            pipeline_log["stages"]["load"] = "success"
        except Exception as e:
            pipeline_log["errors"].append(f"Load failed: {str(e)}")
            raise
        
        # Success
        pipeline_log["end_time"] = datetime.now().isoformat()
        pipeline_log["status"] = "completed"
        
        # Save log
        log_file = f"{source_file}.pipeline.log"
        file_write(log_file, json.dumps(pipeline_log, indent=2))
        
        message_notify_user(
            "✓ Data pipeline completed successfully",
            attachments=[output_file, log_file]
        )
        
    except Exception as e:
        pipeline_log["status"] = "failed"
        log_file = f"{source_file}.pipeline_error.log"
        file_write(log_file, json.dumps(pipeline_log, indent=2))
        
        message_notify_user(
            f"✗ Pipeline failed: {str(e)}",
            attachments=[log_file]
        )
```

---

## 9. Monitoring and Alerts

### Pattern: Continuous Monitoring

```python
def monitor_system(check_interval=60):
    """Monitor system health and alert on issues"""
    
    log_file = "/home/user/system_monitor.log"
    
    while True:
        try:
            # Perform health checks
            checks = {
                "timestamp": datetime.now().isoformat(),
                "disk_space": check_disk_space(),
                "memory_usage": check_memory_usage(),
                "process_status": check_processes(),
                "alerts": []
            }
            
            # Alert on issues
            if checks["disk_space"] < 10:
                checks["alerts"].append("⚠ Low disk space")
            
            if checks["memory_usage"] > 90:
                checks["alerts"].append("⚠ High memory usage")
            
            # Log results
            file_write(
                log_file,
                json.dumps(checks) + "\n",
                append=True
            )
            
            # Notify on alerts
            if checks["alerts"]:
                message_notify_user(
                    f"System Alerts:\n" + "\n".join(checks["alerts"]),
                    attachments=[log_file]
                )
            
            # Wait before next check
            time.sleep(check_interval)
            
        except Exception as e:
            message_notify_user(f"Monitor error: {str(e)}")
```

---

## 10. Complete Integration Example

### Multi-Phase Workflow

```python
def complete_integration_example():
    """Full example integrating multiple functions"""
    
    project_dir = "/home/user/integration_project"
    os.makedirs(project_dir, exist_ok=True)
    
    # Phase 1: Information Gathering
    print("Phase 1: Information Gathering")
    research = research_topic("artificial intelligence frameworks 2024")
    
    # Phase 2: File Management
    print("Phase 2: File Management")
    file_write(
        f"{project_dir}/research.md",
        format_research_as_markdown(research)
    )
    
    # Phase 3: Task Planning
    print("Phase 3: Task Planning")
    tasks = [
        "Review research findings",
        "Design architecture",
        "Implement core features",
        "Setup testing",
        "Deploy application"
    ]
    
    # Phase 4: Execution
    print("Phase 4: Project Execution")
    for i, task in enumerate(tasks, 1):
        print(f"Executing task {i}/{len(tasks)}: {task}")
        # Execute task logic here
        message_notify_user(f"Completed: {task} ({i}/{len(tasks)})")
    
    # Phase 5: Results and Deployment
    print("Phase 5: Deployment")
    public_url = deploy_expose_port(8080)
    message_notify_user(
        f"✓ Project complete! Preview at: {public_url}",
        attachments=[f"{project_dir}/research.md"]
    )
    
    return project_dir
```

---

## Best Practices Summary

1. **Always handle errors** - Use try/except for all operations
2. **Log everything** - Save logs for audit and debugging
3. **Communicate progress** - Keep users informed with message functions
4. **Use absolute paths** - Always specify full paths for files
5. **Verify results** - Check operation success before proceeding
6. **Clean up** - Remove temporary files and processes
7. **Document workflows** - Add comments explaining logic
8. **Test thoroughly** - Validate functions before production use

---

**Last Updated**: February 15, 2026
