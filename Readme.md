# AI Chatbot Backend

A production-ready AI chatbot backend built with **Node.js**, **Express**, **MongoDB**, and **LangGraph**.

The backend follows a **feature-based modular architecture**, where every domain owns its routes, controllers, services, models, and validation logic. This organization keeps the codebase scalable, maintainable, and easy to extend as additional AI capabilities are introduced.

The application acts as an orchestration layer between the frontend, authentication system, database, and LangGraph-powered AI workflows.

---

# Features

## Authentication

* User registration
* User login
* JWT access tokens
* JWT refresh tokens
* HttpOnly refresh cookies
* Automatic access token refresh
* Protected API routes
* Session restoration
* Secure logout

---

## Conversations

* Persistent conversations
* Automatic conversation creation
* Conversation history
* User-specific conversations
* Conversation retrieval
* Active conversation support

---

## Messages

* Persistent message storage
* User messages
* Assistant messages
* Chronological retrieval
* Conversation-based organization

---

## AI

* LangGraph workflow orchestration
* MemorySaver short-term memory
* Streaming AI responses
* Provider abstraction layer
* AI orchestration layer
* Ready for tools and agents

---

## Backend Architecture

* Feature-based modules
* Thin controllers
* Service layer abstraction
* Database abstraction
* Authentication middleware
* Environment-based configuration

---

# Tech Stack

## Runtime

* Node.js

## Framework

* Express.js

## Database

* MongoDB
* Mongoose

## Authentication

* JWT
* bcryptjs
* cookie-parser

## AI

* LangChain
* LangGraph
* Groq

## Validation

* Zod

## Configuration

* dotenv
* cors

---

# Project Structure

```text
backend/
│
├── src/
│
│   ├── ai/
│   │
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
│   │   ├── auth.js
│   │   ├── errorHandler.js
│   │   └── notFound.js
│   │
│   ├── modules/
│   │
│   │   ├── auth/
│   │   │   ├── auth.controller.js
│   │   │   ├── auth.routes.js
│   │   │   ├── auth.service.js
│   │   │   ├── auth.model.js
│   │   │   ├── auth.validation.js
│   │   │   └── auth.utils.js
│   │   │
│   │   ├── chat/
│   │   │   ├── chat.controller.js
│   │   │   ├── chat.routes.js
│   │   │   ├── chat.service.js
│   │   │   └── chat.validation.js
│   │   │
│   │   ├── conversation/
│   │   │   ├── conversation.controller.js
│   │   │   ├── conversation.routes.js
│   │   │   ├── conversation.service.js
│   │   │   └── conversation.model.js
│   │   │
│   │   └── message/
│   │       ├── message.service.js
│   │       └── message.model.js
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

# Installation

Clone the repository

```bash
git clone <repository-url>
cd backend
```

Install dependencies

```bash
npm install
```

Start the development server

```bash
npm run dev
```

Run the production server

```bash
npm start
```

---

# Architecture

The backend follows a **feature-first architecture**.

Instead of organizing files by technical layers such as:

```text
controllers/
services/
routes/
models/
```

the application groups everything by feature:

```text
modules/
│
├── auth/
├── chat/
├── conversation/
└── message/
```

Each module owns its own:

* Routes
* Controllers
* Services
* Models
* Validation

This significantly reduces coupling and makes features easier to maintain.

---

# Current Backend Responsibilities

The backend is responsible for:

* User authentication
* Session management
* JWT generation
* Refresh token rotation
* Conversation persistence
* Message persistence
* Conversation retrieval
* Streaming AI responses
* LangGraph orchestration
* MongoDB communication
* Request validation
* API authorization

Rather than serving only as an API, the backend functions as the application's orchestration layer, coordinating authentication, persistence, and AI execution.
# Authentication Architecture

The backend implements a stateless authentication system using **JWT access tokens** combined with **HttpOnly refresh token cookies**.

This approach minimizes exposure of long-lived credentials while allowing secure session restoration.

---

## Authentication Flow

```text
Client
    │
    ▼
Register / Login
    │
    ▼
Auth Controller
    │
    ▼
Auth Service
    │
    ▼
MongoDB
    │
    ▼
Generate JWT Access Token
Generate Refresh Token
    │
    ▼
Return Access Token
Set HttpOnly Cookie
```

The frontend stores only the short-lived access token.

The refresh token remains inaccessible to JavaScript inside an HttpOnly cookie.

---

## Session Restoration

When the access token expires, the frontend automatically requests a new one.

```text
Application Starts
        │
        ▼
POST /auth/refresh
        │
        ▼
Verify Refresh Token
        │
        ▼
Generate New Access Token
        │
        ▼
Return Access Token
        │
        ▼
GET /auth/me
        │
        ▼
Restore User Session
```

This allows users to refresh the browser or reopen it later without logging in again.

---

# Conversation Architecture

Unlike traditional chat applications that create conversations immediately, this backend creates a conversation **only after the user's first message**.

This prevents storing empty conversations in the database.

---

## Conversation Creation Flow

```text
User Sends First Message
        │
        ▼
No Conversation ID
        │
        ▼
Conversation Service
        │
        ▼
Create Conversation
        │
        ▼
Store First User Message
        │
        ▼
Generate AI Response
        │
        ▼
Store Assistant Message
        │
        ▼
Return Conversation Metadata
```

Subsequent messages reuse the existing conversation.

```text
Existing Conversation
        │
        ▼
Conversation ID Provided
        │
        ▼
Skip Conversation Creation
        │
        ▼
Store Messages
        │
        ▼
Generate Response
```

---

# Message Persistence

Every exchanged message is stored.

Messages are linked to a conversation using its identifier.

```text
Conversation
      │
      ▼
User Message
      │
      ▼
Assistant Message
      │
      ▼
MongoDB
```

This allows conversations to be reconstructed later without depending on LangGraph memory.

---

# Request Flow

## Authentication Requests

```text
Client
    │
    ▼
Route
    │
    ▼
Controller
    │
    ▼
Service
    │
    ▼
MongoDB
    │
    ▼
JWT Generation
    │
    ▼
Response
```

---

## Conversation Requests

```text
Client
    │
    ▼
Authentication Middleware
    │
    ▼
Conversation Route
    │
    ▼
Conversation Controller
    │
    ▼
Conversation Service
    │
    ▼
MongoDB
    │
    ▼
Conversation List
```

---

## Message Request Flow

```text
Client
    │
    ▼
Authentication Middleware
    │
    ▼
Chat Route
    │
    ▼
Chat Controller
    │
    ▼
Conversation Service
    │
    ▼
Message Service
    │
    ▼
LangGraph
    │
    ▼
Streaming Response
    │
    ▼
Save Assistant Message
    │
    ▼
Client
```

---

# Streaming Architecture

Responses are streamed incrementally from LangGraph to the client using **Server-Sent Event (SSE)** formatting.

```text
Client
      │
      ▼
POST /chat/message
      │
      ▼
Express Controller
      │
      ▼
LangGraph Stream
      │
      ▼
Groq Model
      │
      ▼
Streaming Tokens
      │
      ▼
Express Response
      │
      ▼
Frontend
```

The client begins rendering the assistant response immediately instead of waiting for completion.

---

# LangGraph Workflow

The chatbot uses LangGraph as its orchestration engine.

```text
User Message
      │
      ▼
StateGraph
      │
      ▼
MemorySaver
      │
      ▼
Chat Node
      │
      ▼
Groq Model
      │
      ▼
Streaming Output
```

The workflow is intentionally modular so additional nodes, tools, or agents can be introduced without changing the API layer.

---

# Short-Term Memory

Short-term conversational context is managed through LangGraph's **MemorySaver**.

Current flow:

```text
Conversation ID
        │
        ▼
Thread ID
        │
        ▼
MemorySaver
        │
        ▼
Conversation Context
        │
        ▼
LLM
```

The thread identifier corresponds to the authenticated user, allowing the graph to retain conversational context across multiple requests.

Long-term persistence is handled independently through MongoDB, keeping AI memory and application storage separate.
# Module Responsibilities

The backend follows a feature-first architecture.

Each module owns its controllers, services, models, validation logic, and routes.

This keeps business logic isolated and makes features easy to extend.

---

## Routes

Routes are responsible for exposing HTTP endpoints.

Responsibilities:

- Define API endpoints
- Apply middleware
- Group related endpoints
- Delegate requests to controllers

Example:

```text
POST /api/auth/login
POST /api/chat/message
GET  /api/conversations
GET  /api/conversations/:id
```

---

## Controllers

Controllers act as the interface between HTTP requests and business logic.

Responsibilities:

- Receive requests
- Extract request data
- Validate request flow
- Call services
- Return HTTP responses

Controllers remain intentionally thin and contain no business logic.

---

## Services

Services contain the application's business logic.

Responsibilities:

- Authentication logic
- JWT generation
- Refresh token rotation
- Conversation creation
- Message persistence
- AI interactions
- LangGraph orchestration
- Database operations

Keeping business logic inside services makes the application easier to maintain and test.

---

## Models

Models define the application's database schema.

Current models include:

- User
- Conversation
- Message

Models are responsible only for representing stored data and relationships.

---

## Middleware

Middleware executes before requests reach controllers.

Current middleware includes:

- Authentication
- Error handling
- Not Found handler

Authentication middleware verifies access tokens and attaches the authenticated user to the request.

---

## Validation

Validation ensures only valid data reaches the business layer.

Responsibilities:

- Request validation
- Input sanitization
- Schema enforcement

This prevents malformed requests from reaching services.

---

## AI Layer

The AI layer is completely separated from the REST API.

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

### Models

- Configure LLM providers
- Provider abstraction
- Model initialization

### State

- Define LangGraph state
- Manage conversation state

### Nodes

- Execute individual workflow steps

### Graphs

- Coordinate workflow execution
- Connect nodes together

### Prompts

- Store reusable prompt templates

### Agents

Reserved for future multi-agent implementations.

### Tools

Reserved for future tool calling, web search, retrieval, file processing, and external integrations.

This separation keeps the REST API independent from AI implementation details.
# Configuration

Application configuration is centralized inside:

```text
src/config/
├── db.js
└── env.js
```

Keeping configuration separate from business logic makes the application easier to maintain and deploy across different environments.

Current configuration includes:

- MongoDB connection
- Environment variable loading
- Application startup configuration

Future configuration may include:

- Redis
- Object storage
- Logging providers
- Email providers
- AI provider configuration
- Rate limiting
- Caching

---

# Environment Variables

Example:

```env
PORT=5000

MONGODB_URI=

JWT_ACCESS_SECRET=
JWT_REFRESH_SECRET=

ACCESS_TOKEN_EXPIRES_IN=15m
REFRESH_TOKEN_EXPIRES_IN=7d

CLIENT_URL=

GROQ_API_KEY=
```

Future variables may include:

```env
OPENAI_API_KEY=
GEMINI_API_KEY=
ANTHROPIC_API_KEY=

REDIS_URL=

SMTP_HOST=
SMTP_PORT=
SMTP_USER=
SMTP_PASSWORD=

AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
S3_BUCKET=
```

Environment variables allow sensitive configuration to remain outside the codebase and simplify deployment across development, staging, and production environments.

---

# Current Development Stage

The project has evolved into a complete authenticated AI chatbot platform.

Current architecture:

```text
React Frontend
        │
        ▼
Authentication
(JWT + Refresh Token)
        │
        ▼
Protected API Requests
        │
        ▼
Express Backend
        │
        ▼
Business Services
        │
        ├──────────────┐
        ▼              ▼
MongoDB         LangGraph Workflow
        │              │
        ▼              ▼
Conversation DB   Groq LLM
        │              │
        └──────┬───────┘
               ▼
      Streaming Response
               ▼
        React UI Updates
```

Completed milestones:

- MongoDB integration
- User authentication
- JWT access token authentication
- Refresh token rotation
- HttpOnly cookie authentication
- Automatic session restoration
- Protected API routes
- Conversation persistence
- Message persistence
- Conversation history retrieval
- Conversation switching
- LangGraph workflow integration
- MemorySaver short-term memory
- Streaming AI responses
- Real-time frontend streaming
- Zustand state management
- Modular feature-based architecture

The application has moved beyond a simple chatbot prototype into a production-oriented architecture capable of supporting persistent conversations, authenticated users, and future AI workflows.
# Streaming Architecture

The backend streams model responses incrementally to the frontend instead of waiting for the complete response to be generated.

Current flow:

```text
Client
      │
      ▼
POST /api/chat/message
      │
      ▼
Authentication Middleware
      │
      ▼
Chat Controller
      │
      ▼
Conversation Creation
(if required)
      │
      ▼
Save User Message
      │
      ▼
LangGraph Stream
      │
      ▼
Groq Model
      │
      ▼
Streaming Chunks
      │
      ▼
Save Assistant Message
      │
      ▼
Frontend Incremental Rendering
```

The frontend receives partial responses over a streamed HTTP connection and progressively updates the assistant message in real time.

This provides a ChatGPT-style experience where users can read responses as they are generated rather than waiting for the entire completion.