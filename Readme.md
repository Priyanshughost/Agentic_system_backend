# AI Chatbot Backend

Backend service for the AI Chatbot application built with Node.js and Express.

The backend follows a **feature-based modular architecture** where each domain owns its routes, controllers, services, and validation logic. This structure keeps the codebase scalable and maintainable as new features are added.

---

# Features

* Modular architecture
* REST API design
* Request validation layer
* Service abstraction layer
* Environment-based configuration
* Ready for AI provider integration
* LangGraph-powered workflow orchestration
* Short-term conversational memory
* Real-time streaming responses
* AI model abstraction layer
* Scalable folder organization

---

# Tech Stack

* Node.js
* Express.js
* dotenv
* cors
* LangChain
* LangGraph
* Groq
* Zod

---

# Installation

Install dependencies:

```bash
npm install express dotenv cors
```

Install development dependencies:

```bash
npm install -D nodemon
```

---

# Scripts

```json
{
  "scripts": {
    "dev": "nodemon src/server.js",
    "start": "node src/server.js"
  }
}
```


# Project Structure

```text
backend/
├── src/
│
│   ├── ai/
│   │   ├── agents/
│   │   ├── graphs/
│   │   │   └── chat.graph.js
│   │   ├── models/
│   │   │   └── groq.js
│   │   ├── nodes/
│   │   │   └── chat.node.js
│   │   ├── prompts/
│   │   ├── state/
│   │   │   └── state.js
│   │   └── tools/
│
│   ├── config/
│   │   └── env.js
│
│   ├── middleware/
│   │   ├── errorHandler.js
│   │   └── notFound.js
│
│   ├── modules/
│   │   └── chat/
│   │       ├── chat.controller.js
│   │       ├── chat.routes.js
│   │       ├── chat.service.js
│   │       └── chat.validation.js
│
│   ├── routes/
│   │   └── index.js
│
│   ├── utils/
│
│   ├── app.js
│   └── server.js
│
├── .env
├── package.json
└── README.md
```

---

# Architecture

The backend is organized by feature rather than technical layer.

Instead of:

```text id="r0zogw"
controllers/
services/
routes/
```

the project uses:

```text id="d8jtyf"
modules/
└── chat/
    ├── chat.controller.js
    ├── chat.routes.js
    ├── chat.service.js
    └── chat.validation.js
```

All chat-related logic remains in a single location.

---

# Request Flow

```text id="vrnwwq"
Client Request
      ↓
Route
      ↓
Controller
      ↓
Service
      ↓
LangGraph Workflow
      ↓
MemorySaver
      ↓
Node
      ↓
Groq Model
      ↓
Streaming Chunks
      ↓
Frontend
```

Example:

```text id="0l3s0e"
POST /api/chat/message

Route
  ↓
Controller
  ↓
Chat Service
  ↓
Chat Graph
  ↓
Chat Node
  ↓
Groq Model
  ↓
Response
```

---

# Implemented Endpoint

## Send Message

```http
POST /api/chat/message
```

Request:

```json
{
  "message": "Hello"
}
```

Example Response:

```json
Streamed Response

data: {"role":"assistant","content":"Hello"}

data: {"role":"assistant","content":" there"}

data: {"role":"assistant","content":"!"}

data: {"done":true}
```

This endpoint streams model-generated responses from the LangGraph workflow to the frontend using a chunked response stream.


# AI Layer

The backend contains a dedicated AI orchestration layer.

src/ai/
├── models/
├── state/
├── nodes/
├── graphs/
├── prompts/
├── agents/
└── tools/

Responsibilities:

Models
  • LLM configuration and provider setup

State
  • Conversation state definitions

Nodes
  • Individual workflow execution units

Graphs
  • Workflow orchestration and execution

Prompts
  • Prompt templates and instructions

Agents
  • Reserved for future agent implementations

Tools
  • Reserved for future tool integrations

# Short-Term Memory

The chatbot currently uses LangGraph's MemorySaver checkpointer for short-term conversational memory.

Current implementation:

User Message
      ↓
Graph State
      ↓
MemorySaver
      ↓
Groq Model
      ↓
Response

Conversation state is maintained per thread using a thread identifier supplied during graph execution.

This enables the chatbot to retain context across multiple messages within the same conversation.

# Module Responsibilities

## Routes

Responsible for:

* API endpoint definitions
* Route grouping
* Middleware attachment

Example:

```text id="8e5r1q"
POST /chat/message
```

---

## Controllers

Responsible for:

* Receiving requests
* Extracting request data
* Calling services
* Sending responses

Controllers should remain thin.

---

## Services

Responsible for:

* Business logic
* AI interactions
* Data processing
* External integrations

Services contain the core application logic.

---

## Validation

Responsible for:

* Request validation
* Input sanitization
* Schema definitions

Validation keeps controllers clean and prevents invalid data from entering the system.

---

# Configuration

Application configuration should be centralized inside:

```text id="a4nwt6"
src/config/
```

Examples:

* Environment variables
* Database configuration
* Provider configuration

---

# Environment Variables

Example:

```env id="ezk3bz"
PORT=5000
```

Future variables may include:

```env id="hmkgzx"
OPENAI_API_KEY=
GEMINI_API_KEY=
ANTHROPIC_API_KEY=
DATABASE_URL=
```

---

# Current Development Stage

Current implementation:

```text
Frontend (React + Zustand)
        ↓
Streaming Fetch Request
        ↓
POST /api/chat/message
        ↓
Express Backend
        ↓
Controller
        ↓
Service
        ↓
LangGraph Workflow
        ↓
MemorySaver
        ↓
Groq Model
        ↓
Streaming Chunks
        ↓
Frontend UI
```

Completed milestones:

• Frontend and backend successfully connected
• Streaming frontend-backend communication
• Express server configured
• Modular routing structure implemented
• Controller-service architecture implemented
• Groq model integration implemented
• LangGraph workflow implemented
• Short-term memory implemented via MemorySaver
• Zustand state updates driven by backend responses
• Server-side response streaming implemented
• Real-time token delivery to frontend

The project has moved beyond local placeholder responses and now uses a dedicated backend service as the communication layer.

Future phases will expand the current workflow with streaming responses, tools, agents, and advanced orchestration capabilities.

# Streaming Architecture

The backend streams model responses incrementally to the frontend.

Current implementation:

Client
      ↓
POST Request
      ↓
Express Controller
      ↓
LangGraph Stream
      ↓
Groq Stream
      ↓
Chunked Response
      ↓
Frontend State Updates

This enables ChatGPT-style real-time response rendering instead of waiting for a complete response before sending data back to the client.

# Future Enhancements

## AI Providers

Potential provider integrations:

```text id="z8u0mo"
OpenAI
Gemini
Anthropic
```

A dedicated AI layer has been introduced to support future provider integrations, graph-based workflows, agents, tools, and orchestration frameworks such as LangGraph.

---

## Persistence

Future additions:

* Conversation storage
* Message history
* User management
* Authentication

---

## Observability

Possible future additions:

* Request logging
* Error tracking
* Monitoring
* Analytics

---

# Design Principles

* Feature-first architecture
* Thin controllers
* Business logic inside services
* Separation of concerns
* Scalability over convenience
* AI-provider agnostic design

---

# License

MIT License
