---
title: 'exp_site: Building an Agentic Tool Library from Scratch'
description: 'A Python library for sandboxed LLM tool execution with human-in-the-loop channels, MCP connector, deliberate customization mode, and iterative execution control.'
pubDate: 2026-04-20
tags: ['Python', 'MCP', 'LLM Agents', 'Tool Sandbox', 'Human-in-the-Loop']
---

# exp_site: Building an Agentic Tool Library from Scratch

exp_site is a Python library for building LLM agents with sandboxed tool execution, human-in-the-loop (HIL) channels, Model Context Protocol (MCP) connectivity, and deliberate customization mode.

## Core Concepts

### Tool Sandbox

The `ToolSandbox` provides isolated, bounded execution for LLM tool calls:

```python
from agentic.tools.tool_sandbox import ToolSandbox, sandbox_tool, ResourceLimits

@sandbox_tool(
    name="calculate_date",
    description="Calculate a date by adding/subtracting days",
    resources=ResourceLimits(timeout_seconds=10, max_memory_mb=64),
    tags=["date", "calculation"]
)
def calculate_date(offset_days: int = 0) -> dict:
    """Calculate a date by adding/subtracting days from today."""
    # ... implementation
```

Each tool has resource limits (timeout, memory), optional customization constraints, and tags for discovery.

### Deliberate Customization Mode

A novel feature: LLM agents can inject custom helper code into the sandbox at runtime, within a byte budget. This lets agents "teach themselves" helper functions for repetitive tasks:

```python
sandbox.inject_customization(
    "helpers",
    """def format_date_verbose(dt):
    return dt.strftime("%B %d, %Y at %I:%M %p (%A)")"""
)
```

The sandbox tracks bytes used/remaining and enforces section-level access control (e.g., only `imports` and `helpers` sections are writable).

### Human-in-the-Loop (HIL)

The library supports multiple HIL channels for agent oversight:

- **HumanLoopManager** — Coordinates agent execution with human approval gates
- **HIL Channels** — Pluggable approval interfaces (CLI, web, messaging)
- **Iteration Controller** — Limits agent loop iterations with configurable thresholds

### MCP Connector

Built-in Model Context Protocol support for connecting to external MCP servers:

```python
from agentic.tools.mcp_connector import MCPConnector

connector = MCPConnector("http://localhost:3001")
tools = connector.list_tools()
```

This enables agents to use tools from any MCP-compliant server without custom integration code.

## Agent Presets

The library ships with preset agent configurations:

- **ReAct Agent** — Standard Reasoning + Acting loop with tool selection
- **Creator Agent** — Content generation with iterative refinement
- **Date Agent** — Demo agent for date-related questions (included in `main.py`)

## Architecture

```
agentic/
├── base_agent.py          # Abstract agent base class
├── memory.py              # Agent memory / conversation history
├── prompt_constructor.py  # Dynamic prompt assembly
├── circuit.py             # Circuit breaker for tool failures
├── hil_manager.py         # Human-in-the-loop orchestration
├── hil_channels.py        # Approval channel implementations
├── human_loop.py          # Interactive human loop interface
├── hil_types.py           # HIL type definitions
├── creator_agent.py       # Content creation agent preset
├── preset_agents/
│   └── react_agent.py     # ReAct agent implementation
└── tools/
    ├── tool_sandbox.py    # Core sandboxed execution engine
    ├── sandbox_executor.py# Sandbox process executor
    ├── sandbox_types.py   # Type definitions for sandbox
    ├── customization_injector.py  # Deliberate mode code injection
    ├── mcp_connector.py   # MCP server connector
    ├── db_connector.py    # Database tool connector
    ├── code_runner.py     # Code execution tool
    ├── searcher.py        # Web search tool
    └── iteration_controller.py    # Iteration limiting
```

## Key Learnings

1. **Sandboxed execution is essential for agent safety** — unbounded tool execution can lead to resource exhaustion or infinite loops. The sandbox enforces per-call timeout and memory limits.
2. **Deliberate mode is a middle ground between static and dynamic tools** — rather than letting agents write arbitrary code, the byte-budgeted customization section gives controlled flexibility.
3. **MCP standardizes tool discovery** — once the connector is built, any MCP server becomes available without custom adapters.
4. **Circuit breakers prevent cascading failures** — when a tool repeatedly fails, the circuit opens and the agent gets a clear error instead of burning iterations.

## Tech Stack

- Python 3.10+, LangChain, MCP SDK, Qdrant, Supabase, FastMCP, Ollama
