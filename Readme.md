```markdown
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

Node.js
Express.js
MongoDB
Mongoose
JWT
bcryptjs
cookie-parser
dotenv
cors
LangChain
LangGraph
Groq
Zod

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
│   │
│   ├── config/
│   │   ├── db.js
│   │   └── env.js
│   │
│   ├── middleware/
│   │   ├── auth.middleware.js
│   │   ├── errorHandler.js
│   │   └── notFound.js
│   │
│   ├── modules/
│   │   ├── auth/
│   │   │   ├── auth.controller.js
│   │   │   ├── auth.routes.js
│   │   │   ├── auth.service.js
│   │   │   ├── auth.model.js
│   │   │   ├── auth.validation.js
│   │   │   └── auth.utils.js
│   │   │
│   │   └── chat/
│   │       ├── chat.controller.js
│   │       ├── chat.routes.js
│   │       ├── chat.service.js
│   │       └── chat.validation.js
│   │
│   ├── routes/
│   │   └── index.js
│   │
│   ├── utils/
│   │
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

```text
controllers/
services/
routes/

```

the project uses:

```text
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

Now there are two major flows.

## Authentication Flow

```text
Client
    ↓
Auth Route
    ↓
Auth Controller
    ↓
Auth Service
    ↓
MongoDB
    ↓
JWT Generation
    ↓
Response

```

## Chat Flow

```text
Client
    ↓
Auth Middleware
    ↓
Chat Route
    ↓
Chat Controller
    ↓
Chat Service
    ↓
LangGraph
    ↓
MemorySaver
    ↓
Groq
    ↓
Streaming Response

```

Example Endpoints:

```text
Authentication
POST /api/auth/register
POST /api/auth/login
POST /api/auth/refresh
POST /api/auth/logout
GET  /api/auth/me

Chat
POST /api/chat/message

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

```text
src/ai/
├── models/
├── state/
├── nodes/
├── graphs/
├── prompts/
├── agents/
└── tools/

```

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

```text
User Message
      ↓
Graph State
      ↓
MemorySaver
      ↓
Groq Model
      ↓
Response

```

Conversation state is maintained per thread using a thread identifier supplied during graph execution.

This enables the chatbot to retain context across multiple messages within the same conversation.

# Module Responsibilities

## Routes

Responsible for:

* API endpoint definitions
* Route grouping
* Middleware attachment

Example:

```text
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

```text
src/config/

```

Examples:

* Environment variables
* Database configuration
* Provider configuration

---

# Environment Variables

Example:

```env
PORT=5000

```

Future variables may include:

```env
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

• MongoDB integration
• User authentication system
• JWT access token generation
• JWT refresh token generation
• Refresh token rotation flow
• HttpOnly cookie-based authentication
• User session restoration
• Protected API routes
• LangGraph workflow orchestration
• MemorySaver short-term memory
• Real-time streaming responses
• Zustand-driven frontend updates

The project has moved beyond local placeholder responses and now uses a dedicated backend service as the communication layer.

# Streaming Architecture

The backend streams model responses incrementally to the frontend.

Current implementation:

```text
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

```

This enables ChatGPT-style real-time response rendering instead of waiting for a complete response before sending data back to the client.

# Future Enhancements

## AI Providers

Potential provider integrations:

```text
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

```

```