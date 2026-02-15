# Manus AI System - Functions Reference Guide

## Complete Function Index

This document provides a comprehensive reference for all available functions in the Manus AI system, organized by category with detailed descriptions and examples.

---

## 1. MESSAGING FUNCTIONS

### message_notify_user()

**Purpose**: Send non-blocking informational messages to the user.

**Signature**:
```
message_notify_user(
    text: string,
    attachments?: string | string[]
) -> void
```

**Parameters**:
- `text` (required): The message content to display
- `attachments` (optional): File paths or URLs to attach to message

**Use Cases**:
- Progress updates during task execution
- Acknowledging receipt of user requests
- Notifying task completion
- Sharing results without waiting for response

**Example**:
```
message_notify_user(
    "Task completed successfully. Results saved to /path/to/results.json",
    ["/path/to/results.json", "/path/to/summary.md"]
)
```

---

### message_ask_user()

**Purpose**: Request information or confirmation from the user, blocking until response received.

**Signature**:
```
message_ask_user(
    text: string,
    attachments?: string | string[],
    suggest_user_takeover?: "none" | "browser"
) -> response: string
```

**Parameters**:
- `text` (required): The question or request to present
- `attachments` (optional): Supporting files or reference materials
- `suggest_user_takeover` (optional): Suggest user take over browser control for sensitive operations

**Use Cases**:
- Requesting clarification on ambiguous requirements
- Getting user confirmation before proceeding
- Asking for sensitive credentials or decisions
- Presenting options for user selection

**Example**:
```
response = message_ask_user(
    "Should we proceed with deploying to production? Type 'yes' or 'no'",
    suggest_user_takeover="browser"
)
```

---

## 2. FILE OPERATION FUNCTIONS

### file_read()

**Purpose**: Read contents of files, with optional line range selection.

**Signature**:
```
file_read(
    file: string,
    start_line?: integer,
    end_line?: integer,
    sudo?: boolean
) -> string
```

**Parameters**:
- `file` (required): Absolute path to file
- `start_line` (optional): Starting line (0-based)
- `end_line` (optional): Ending line (exclusive)
- `sudo` (optional): Use sudo privileges if needed

**Use Cases**:
- Reading configuration files
- Analyzing log files
- Retrieving data from stored files
- Reading source code sections

**Example**:
```
# Read entire file
content = file_read("/home/user/config.json")

# Read lines 10-20
section = file_read("/var/log/system.log", start_line=10, end_line=20)
```

---

### file_write()

**Purpose**: Create new files or overwrite/append to existing files.

**Signature**:
```
file_write(
    file: string,
    content: string,
    append?: boolean,
    leading_newline?: boolean,
    trailing_newline?: boolean,
    sudo?: boolean
) -> void
```

**Parameters**:
- `file` (required): Absolute path to file
- `content` (required): Content to write
- `append` (optional): Append instead of overwrite
- `leading_newline` (optional): Add newline at start
- `trailing_newline` (optional): Add newline at end
- `sudo` (optional): Use sudo privileges if needed

**Use Cases**:
- Creating configuration files
- Saving analysis results
- Generating reports
- Building document chains

**Example**:
```
# Create new file
file_write(
    "/home/user/report.md",
    "# Analysis Report\n\nThis is the report content.",
    trailing_newline=true
)

# Append to existing file
file_write(
    "/home/user/log.txt",
    "New log entry",
    append=true,
    leading_newline=true
)
```

---

### file_str_replace()

**Purpose**: Replace specific strings within files.

**Signature**:
```
file_str_replace(
    file: string,
    old_str: string,
    new_str: string,
    sudo?: boolean
) -> void
```

**Parameters**:
- `file` (required): Absolute path to file
- `old_str` (required): String to find and replace
- `new_str` (required): Replacement string
- `sudo` (optional): Use sudo privileges if needed

**Use Cases**:
- Updating configuration values
- Fixing errors in code
- Modifying templates
- Batch text replacements

**Example**:
```
file_str_replace(
    "/home/user/config.py",
    "DEBUG = False",
    "DEBUG = True"
)
```

---

### file_find_in_content()

**Purpose**: Search for patterns within file contents using regular expressions.

**Signature**:
```
file_find_in_content(
    file: string,
    regex: string,
    sudo?: boolean
) -> array[string]
```

**Parameters**:
- `file` (required): Absolute path to file
- `regex` (required): Regular expression pattern to match
- `sudo` (optional): Use sudo privileges if needed

**Returns**: Array of matching lines

**Use Cases**:
- Finding specific patterns in logs
- Extracting information from files
- Validating file contents
- Searching for errors or warnings

**Example**:
```
# Find all ERROR lines
errors = file_find_in_content("/var/log/app.log", "ERROR.*")

# Find lines with specific IP pattern
ips = file_find_in_content("/var/log/access.log", r"\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}")
```

---

### file_find_by_name()

**Purpose**: Locate files by name pattern in a directory.

**Signature**:
```
file_find_by_name(
    path: string,
    glob: string
) -> array[string]
```

**Parameters**:
- `path` (required): Directory path to search
- `glob` (required): Glob pattern (e.g., "*.py", "**/*.txt")

**Returns**: Array of matching file paths

**Use Cases**:
- Finding specific file types
- Locating configuration files
- Discovering source code files
- Recursive directory searches

**Example**:
```
# Find all Python files
py_files = file_find_by_name("/home/user/project", "*.py")

# Recursively find all JSON configs
configs = file_find_by_name("/home/user/project", "**/*.json")
```

---

## 3. SHELL EXECUTION FUNCTIONS

### shell_exec()

**Purpose**: Execute shell commands in a specified session with output capture.

**Signature**:
```
shell_exec(
    id: string,
    exec_dir: string,
    command: string
) -> dict{output: string, status: integer}
```

**Parameters**:
- `id` (required): Unique session identifier
- `exec_dir` (required): Working directory (absolute path)
- `command` (required): Shell command to execute

**Returns**: Dictionary with output and exit status

**Use Cases**:
- Running system commands
- Installing packages
- File operations
- Script execution
- Git operations

**Example**:
```
result = shell_exec(
    id="main",
    exec_dir="/home/user/project",
    command="npm install && npm run build"
)
```

---

### shell_view()

**Purpose**: View current state and output of a shell session.

**Signature**:
```
shell_view(id: string) -> dict{output: string, status: string}
```

**Parameters**:
- `id` (required): Shell session identifier

**Returns**: Current session state and output

**Use Cases**:
- Checking command status
- Monitoring long-running processes
- Retrieving command output
- Debugging shell execution

**Example**:
```
state = shell_view("main")
print(state.output)
```

---

### shell_wait()

**Purpose**: Block and wait for a running process to complete.

**Signature**:
```
shell_wait(
    id: string,
    seconds?: integer
) -> dict{finished: boolean}
```

**Parameters**:
- `id` (required): Shell session identifier
- `seconds` (optional): Timeout in seconds

**Returns**: Status indicating if process completed

**Use Cases**:
- Waiting for long-running tasks
- Ensuring process completion before proceeding
- Implementing timeouts
- Batch command sequencing

**Example**:
```
shell_wait("main", seconds=300)  # Wait up to 5 minutes
```

---

### shell_write_to_process()

**Purpose**: Send input to running interactive processes.

**Signature**:
```
shell_write_to_process(
    id: string,
    input: string,
    press_enter: boolean
) -> void
```

**Parameters**:
- `id` (required): Shell session identifier
- `input` (required): Text to send to process
- `press_enter` (required): Whether to press Enter after input

**Use Cases**:
- Responding to interactive prompts
- Providing passwords to commands
- Interacting with CLI applications
- Automating terminal interactions

**Example**:
```
shell_write_to_process("main", "my_password", press_enter=true)
```

---

### shell_kill_process()

**Purpose**: Terminate a running process in a shell session.

**Signature**:
```
shell_kill_process(id: string) -> void
```

**Parameters**:
- `id` (required): Shell session identifier

**Use Cases**:
- Stopping hung processes
- Cleaning up background tasks
- Emergency process termination
- Resource cleanup

**Example**:
```
shell_kill_process("main")
```

---

## 4. BROWSER & WEB FUNCTIONS

### browser_navigate()

**Purpose**: Navigate the browser to a specified URL.

**Signature**:
```
browser_navigate(url: string) -> void
```

**Parameters**:
- `url` (required): Full URL with protocol (http:// or https://)

**Use Cases**:
- Accessing websites
- Loading web applications
- Navigating to APIs
- Web research

**Example**:
```
browser_navigate("https://www.example.com")
```

---

### browser_restart()

**Purpose**: Restart browser session and navigate to URL.

**Signature**:
```
browser_restart(url: string) -> void
```

**Parameters**:
- `url` (required): URL to navigate to after restart

**Use Cases**:
- Clearing browser state
- Starting fresh session
- Resetting cookies/cache
- Clean environment for testing

**Example**:
```
browser_restart("https://www.example.com")
```

---

### browser_click()

**Purpose**: Click on page elements.

**Signature**:
```
browser_click(
    index?: integer,
    coordinate_x?: number,
    coordinate_y?: number
) -> void
```

**Parameters**:
- `index` (optional): Element index from page
- `coordinate_x` (optional): X coordinate
- `coordinate_y` (optional): Y coordinate

**Use Cases**:
- Clicking buttons
- Following links
- Interacting with UI elements
- Form submission

**Example**:
```
# Click by element index
browser_click(index=5)

# Click by coordinates
browser_click(coordinate_x=100, coordinate_y=200)
```

---

### browser_input()

**Purpose**: Enter text into input fields.

**Signature**:
```
browser_input(
    text: string,
    index?: integer,
    coordinate_x?: number,
    coordinate_y?: number,
    press_enter?: boolean
) -> void
```

**Parameters**:
- `text` (required): Text to input
- `index` (optional): Element index
- `coordinate_x` (optional): X coordinate
- `coordinate_y` (optional): Y coordinate
- `press_enter` (optional): Press Enter after input

**Use Cases**:
- Filling forms
- Entering search queries
- Typing credentials
- Providing command input

**Example**:
```
# Fill search box
browser_input("machine learning", index=0, press_enter=true)
```

---

### browser_scroll_up() / browser_scroll_down()

**Purpose**: Scroll page content vertically.

**Signature**:
```
browser_scroll_up(to_top?: boolean) -> void
browser_scroll_down(to_bottom?: boolean) -> void
```

**Parameters**:
- `to_top/to_bottom` (optional): Jump directly to top/bottom

**Use Cases**:
- Navigating long pages
- Loading more content
- Accessing page footer
- Finding specific sections

**Example**:
```
browser_scroll_down(to_bottom=true)
```

---

### browser_console_exec()

**Purpose**: Execute JavaScript in browser console.

**Signature**:
```
browser_console_exec(javascript: string) -> any
```

**Parameters**:
- `javascript` (required): JavaScript code to execute

**Returns**: Result of JavaScript execution

**Use Cases**:
- DOM manipulation
- Data extraction
- Page automation
- Advanced interactions

**Example**:
```
result = browser_console_exec("document.querySelectorAll('a').length")
```

---

### browser_console_view()

**Purpose**: View browser console logs and errors.

**Signature**:
```
browser_console_view(max_lines?: integer) -> array[string]
```

**Parameters**:
- `max_lines` (optional): Maximum lines to return

**Returns**: Array of console messages

**Use Cases**:
- Debugging JavaScript errors
- Monitoring console output
- Checking page errors
- Development debugging

**Example**:
```
logs = browser_console_view(max_lines=50)
```

---

## 5. INFORMATION & SEARCH FUNCTIONS

### info_search_web()

**Purpose**: Search the internet for information.

**Signature**:
```
info_search_web(
    query: string,
    date_range?: "all" | "past_hour" | "past_day" | "past_week" | "past_month" | "past_year"
) -> array[dict]
```

**Parameters**:
- `query` (required): Search query (3-5 keywords recommended)
- `date_range` (optional): Filter by time period

**Returns**: Array of search results with titles, URLs, and snippets

**Use Cases**:
- Research and fact-checking
- Finding recent information
- Locating resources
- Trend analysis

**Example**:
```
results = info_search_web("machine learning 2024", date_range="past_month")
```

---

## 6. DEPLOYMENT & SERVICE FUNCTIONS

### deploy_expose_port()

**Purpose**: Expose a local port for temporary public access.

**Signature**:
```
deploy_expose_port(port: integer) -> string
```

**Parameters**:
- `port` (required): Local port number to expose

**Returns**: Public URL for access

**Use Cases**:
- Sharing local web servers
- Testing deployed services
- Temporary API exposure
- Demo access

**Example**:
```
public_url = deploy_expose_port(8080)
# Returns: https://port-8080.service.proxy/
```

---

### deploy_apply_deployment()

**Purpose**: Deploy applications to production environment.

**Signature**:
```
deploy_apply_deployment(
    type: "static" | "nextjs",
    local_dir: string
) -> dict{status: string, url: string}
```

**Parameters**:
- `type` (required): Deployment type (static site or Next.js app)
- `local_dir` (required): Local directory to deploy

**Returns**: Deployment status and public URL

**Use Cases**:
- Deploying static websites
- Deploying Next.js applications
- Production releases
- Permanent deployment

**Example**:
```
result = deploy_apply_deployment(
    type="static",
    local_dir="/home/user/website"
)
```

---

## 7. SPECIAL FUNCTIONS

### idle()

**Purpose**: Signal task completion and enter idle state.

**Signature**:
```
idle() -> void
```

**Parameters**: None

**Use Cases**:
- Task completion
- Waiting for new instructions
- Idle state management

**Example**:
```
# After all tasks complete
idle()
```

---

## Function Interaction Patterns

### Pattern 1: Sequential File Processing

```
1. file_find_by_name() - Locate files
2. file_read() - Read contents
3. file_str_replace() - Modify as needed
4. file_write() - Save results
```

### Pattern 2: Web Research & Documentation

```
1. info_search_web() - Find information
2. browser_navigate() - Visit sources
3. browser_console_exec() - Extract data
4. file_write() - Document findings
```

### Pattern 3: Service Deployment

```
1. shell_exec() - Build application
2. shell_wait() - Ensure completion
3. deploy_expose_port() - Test locally
4. deploy_apply_deployment() - Production deploy
```

### Pattern 4: User Communication Loop

```
1. message_notify_user() - Inform of progress
2. message_ask_user() - Request decision
3. Process based on response
4. message_notify_user() - Report results
```

---

## Error Handling

All functions include error handling:

```
try:
    result = function_call(params)
except FunctionError as e:
    # Log error
    file_write(error_log, str(e), append=true)
    # Notify user
    message_notify_user(f"Error: {e}")
    # Retry or abort
```

---

## Best Practices

1. **Always verify paths**: Use absolute paths for all file operations
2. **Check dependencies**: Verify tools exist before shell execution
3. **Handle errors gracefully**: Implement proper error handling
4. **Log operations**: Save results and logs for audit trail
5. **Communicate progress**: Keep user informed of long operations
6. **Clean up resources**: Terminate processes and clean temporary files
7. **Optimize operations**: Parallelize independent tasks
8. **Document results**: Save findings to files for reference

---

**Last Updated**: February 15, 2026
