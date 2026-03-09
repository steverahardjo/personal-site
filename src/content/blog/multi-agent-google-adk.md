---
title: 'Multi-Agent Systems with Google ADK'
description: 'Exploring agent orchestration patterns using Google Agent Development Kit for financial workflows.'
pubDate: 2026-02-01
tags: ['Google ADK', 'AI Agents', 'MCP', 'Python']
---

# Multi-Agent Systems with Google ADK

This article explores agent orchestration patterns using Google's Agent Development Kit (ADK) and the Model Context Protocol (MCP) for building intelligent financial workflows.

## Overview

Google's Agent Development Kit provides a powerful framework for building multi-agent systems that can collaborate on complex tasks. This article discusses structured output parsing, artifact management, and Model Context Protocol (MCP) for tool integration.

## What is Google ADK?

Google ADK is a framework for building AI agents that can:
- Understand and process natural language
- Execute tools and actions
- Maintain conversation state
- Collaborate with other agents

## Multi-Agent Architecture

### Agent Roles

In a multi-agent system, each agent has a specific role:

1. **Coordinator Agent:** Orchestrates workflow and delegates tasks
2. **Specialist Agents:** Handle domain-specific tasks (e.g., expense categorization, budget analysis)
3. **Tool Agent:** Manages external API integrations via MCP

### Communication Patterns

Agents communicate through:
- Direct method calls
- Message queues
- Shared state/artifacts

## Model Context Protocol (MCP)

MCP provides a standardized way for agents to interact with external tools and data sources.

### Key Concepts

- **Resources:** Data sources agents can read from
- **Tools:** Functions agents can invoke
- **Prompts:** Reusable prompt templates

### Example MCP Server

```python
from mcp.server import Server
from mcp.types import Tool

server = Server("expense-tracker")

@server.list_tools()
async def list_tools() -> list[Tool]:
    return [
        Tool(
            name="categorize_expense",
            description="Categorize an expense transaction",
            inputSchema={
                "type": "object",
                "properties": {
                    "amount": {"type": "number"},
                    "description": {"type": "string"},
                    "merchant": {"type": "string"}
                }
            }
        )
    ]
```

## Structured Output Parsing

Getting structured data from LLMs is crucial for agent workflows.

### Using Pydantic Models

```python
from pydantic import BaseModel, Field
from google.adk import Agent

class Expense(BaseModel):
    amount: float = Field(description="Transaction amount")
    category: str = Field(description="Expense category")
    merchant: str = Field(description="Merchant name")
    date: str = Field(description="Transaction date")

agent = Agent(
    name="expense_parser",
    model="gemini-2.0-flash",
    output_type=Expense
)
```

## Artifact Management

Artifacts are shared data objects that agents can read and write:

```python
from google.adk import Artifact

# Create an artifact
expense_report = Artifact(
    name="monthly_report",
    data={"expenses": [], "total": 0}
)

# Agents can access shared artifacts
async def analyze_expenses(ctx):
    report = await ctx.get_artifact("monthly_report")
    # Process report data
```

## Building an Expense Tracking Agent

### Agent Definition

```python
from google.adk import Agent, Runner
from google.adk.tools import FunctionTool

def get_expenses(start_date: str, end_date: str) -> list:
    """Retrieve expenses within date range."""
    # Database query logic
    pass

def add_expense(amount: float, category: str, description: str) -> dict:
    """Add a new expense."""
    # Insert logic
    pass

expense_agent = Agent(
    name="expense_assistant",
    model="gemini-2.0-flash",
    instruction="""You are an expense tracking assistant.
    Help users track their spending, categorize expenses,
    and provide financial insights.""",
    tools=[
        FunctionTool(get_expenses),
        FunctionTool(add_expense)
    ]
)
```

### Multi-Agent Orchestration

```python
from google.adk import Runner

runner = Runner(
    agents=[coordinator_agent, expense_agent, budget_agent],
    main_agent="coordinator_agent"
)

async with runner.session() as session:
    response = await session.run(
        agent_id="coordinator_agent",
        message="How much did I spend on food last month?"
    )
```

## Best Practices

1. **Clear Role Definition:** Each agent should have a well-defined responsibility
2. **Efficient Communication:** Minimize inter-agent messages
3. **Error Handling:** Implement robust error handling for tool failures
4. **State Management:** Use artifacts for shared state carefully
5. **Security:** Validate all tool inputs and outputs

## Conclusion

Google ADK provides a powerful framework for building multi-agent systems. By combining structured output parsing, artifact management, and MCP for tool integration, you can create sophisticated AI applications that handle complex workflows.
