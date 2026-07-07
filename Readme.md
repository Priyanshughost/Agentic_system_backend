# AI Chatbot Backend

A production-ready AI chatbot backend built with **Node.js**, **Express**, **MongoDB**, and **LangGraph**.

The backend follows a **feature-based modular architecture**, where every domain owns its routes, controllers, services, models, and validation logic. This organization keeps the codebase scalable, maintainable, and easy to extend as additional AI capabilities are introduced.

The application acts as an orchestration layer between the frontend, authentication system, database, and LangGraph-powered AI workflows.

---

# Features

The backend is divided into two major capability groups:

- **Application Backend** — Authentication, persistence, API orchestration, and streaming.
- **AI Runtime** — Dynamic planning, compilation, and execution of runtime-generated multi-agent workflows.

---

## Application Backend

### Authentication

- User registration
- Email verification with OTP
- User login
- JWT access tokens
- JWT refresh tokens
- HttpOnly refresh cookies
- Automatic access token refresh
- Secure session restoration
- Protected API routes
- Secure logout

### Conversations

- Automatic conversation creation
- Persistent conversation storage
- Conversation history
- User-specific conversations
- Conversation title generation
- Conversation retrieval
- Active conversation support

### Messages

- Persistent message storage
- User and assistant message separation
- Chronological message retrieval
- Conversation-based organization

### Streaming

- Real-time AI response streaming
- Server-Sent Events (SSE)
- Incremental frontend rendering
- Streaming persistence pipeline

---

## AI Runtime

### Planning Pipeline

- Intent Analyzer
- Clarification Node
- Meta Architect
- Blueprint Validation
- Agent Specification Generator

### Runtime Compilation

- Dynamic runtime graph compilation
- Runtime agent generation
- Runtime model resolution
- Runtime tool resolution
- Automatic graph construction
- LangGraph compilation

### Runtime Execution

- Ephemeral runtime agents
- Shared runtime execution state
- Runtime input resolution
- Runtime output validation
- Runtime state merging
- Deterministic task execution
- Runtime graph execution engine

### Tool System

- Runtime tool registry
- Runtime tool catalog
- Dynamic tool binding
- Tavily web search integration
- Tool result compression
- Runtime tool caching

### AI Infrastructure

- LangGraph workflow orchestration
- Runtime StateGraph generation
- Provider abstraction layer
- Multiple model registry
- Structured execution pipeline
- Blueprint validation framework

---

## Backend Architecture

- Feature-based modular architecture
- Thin controllers
- Service layer abstraction
- Database abstraction
- Authentication middleware
- Validation layer
- Runtime compiler architecture
- Runtime execution engine
- AI orchestration layer

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
src/
│
├── app.js
├── server.js
│
├── ai/
│   │
│   ├── compiler/
│   │   └── compileRuntimeGraph.js
│   │
│   ├── graphs/
│   │   ├── chat.graph.js
│   │   └── test.graph.js
│   │
│   ├── models/
│   │   ├── allam-2-7b.js
│   │   ├── gpt-120b.js
│   │   ├── gpt-20b.js
│   │   ├── gpt-safeguard.js
│   │   ├── llama-17b.js
│   │   ├── llama-22m.js
│   │   ├── llama-86m.js
│   │   ├── llama-8b.js
│   │   └── registry.js
│   │
│   ├── nodes/
│   │   ├── intent.node.js
│   │   ├── clarification.node.js
│   │   ├── architect.node.js
│   │   ├── agentSpecification.node.js
│   │   └── chat.node.js
│   │
│   ├── prompts/
│   │   ├── intent.prompt.js
│   │   ├── clarification.prompt.js
│   │   ├── architect.prompt.js
│   │   └── agentSpecification.prompt.js
│   │
│   ├── runtime/
│   │   ├── createAgentPrompt.js
│   │   ├── createRuntimeAgent.js
│   │   ├── inputResolver.js
│   │   ├── outputMerger.js
│   │   ├── parseRuntimeOutput.js
│   │   ├── processToolResult.js
│   │   ├── runtime.state.js
│   │   └── runtimeExecutor.js
│   │
│   ├── state/
│   │   ├── state.js
│   │   ├── intent.state.js
│   │   ├── clarification.state.js
│   │   ├── architect.state.js
│   │   └── agentSpecification.state.js
│   │
│   ├── tools/
│   │   ├── catalog.js
│   │   ├── registry.js
│   │   └── webSearch.tool.js
│   │
│   └── validators/
│       ├── blueprint.validator.js
│       ├── constraint.validator.js
│       ├── dependency.validator.js
│       ├── edge.validator.js
│       ├── graph.validator.js
│       ├── metrics.js
│       └── task.validator.js
│
├── config/
│   ├── db.js
│   └── env.js
│
├── middleware/
│   ├── auth.js
│   ├── errorHandler.js
│   ├── notFound.js
│   └── rateLimiter.js
│
├── modules/
│   │
│   ├── auth/
│   ├── chat/
│   ├── conversation/
│   └── message/
│
├── routes/
│   └── index.js
│
└── utils/
```

## Directory Responsibilities

| Directory | Responsibility |
|-----------|----------------|
| `compiler/` | Compiles validated execution blueprints into executable LangGraph runtime workflows. |
| `graphs/` | Defines planning graphs and runtime testing graphs. |
| `models/` | Central registry and initialization of all supported LLMs. |
| `nodes/` | Planning nodes executed during blueprint generation. |
| `prompts/` | Prompt templates separated from orchestration logic. |
| `runtime/` | Runtime agent execution engine, prompt generation, tool processing, parsing, state merging, and execution orchestration. |
| `state/` | Shared LangGraph state definitions used throughout the planning pipeline. |
| `tools/` | Runtime tool catalog, registry, and external capability implementations. |
| `validators/` | Structural validation of execution blueprints before compilation. |
| `modules/` | REST API business logic organized by feature. |
| `middleware/` | Shared Express middleware. |
| `config/` | Environment and database configuration. |
| `routes/` | API route aggregation. |
| `utils/` | Shared helper utilities. |

The backend is organized into two major subsystems.

The **application layer** (`modules/`) contains the production REST API responsible for authentication, conversations, persistent storage, request validation, and HTTP communication.

The **AI layer** (`src/ai/`) is completely isolated from the REST API and contains the planning, validation, compilation, and runtime execution infrastructure for dynamically generated multi-agent workflows.

This separation allows the AI runtime to evolve independently from the application layer while keeping the backend modular, scalable, and maintainable.
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

The backend follows a two-stage execution architecture that separates **planning** from **execution**.

Rather than asking a single LLM to solve an entire request, the system first constructs an execution plan and then compiles that plan into a brand-new executable LangGraph at runtime.

```text
                       USER REQUEST
                             │
                             ▼
                  Intent Analysis Node
                             │
                             ▼
                 Clarification Node
                             │
                             ▼
                  Meta Architect Node
                             │
                             ▼
               Execution Blueprint (JSON)
                             │
                             ▼
            Blueprint Validation Pipeline
                             │
                             ▼
          Agent Specification Generator
                             │
                             ▼
                 Runtime Compiler
                             │
          ┌──────────────────────────────┐
          │ Creates an entirely new      │
          │ LangGraph at runtime         │
          └──────────────────────────────┘
                             │
                             ▼
                 Runtime Agent Graph
                             │
           ┌──────────────────────────┐
           │ Runtime Agent #1         │
           └──────────────────────────┘
                             │
                             ▼
                     Shared Runtime State
                             │
           ┌──────────────────────────┐
           │ Runtime Agent #2         │
           └──────────────────────────┘
                             │
                             ▼
                     Shared Runtime State
                             │
                             ▼
                           ...
                             │
                             ▼
                    Final Runtime Agent
                             │
                             ▼
                    Final Runtime Output
```

---

## Stage 1 — Planning

The planning pipeline is responsible for converting natural language into deterministic execution artifacts.

Outputs produced during this stage include:

- Intent Object
- Clarification
- Execution Blueprint
- Blueprint Validation
- Runtime Agent Specifications

No user task is executed during planning.

Instead, planning produces a complete description of *how* the task should be executed.

---

## Stage 2 — Compilation

The runtime compiler consumes the planning artifacts and constructs a brand-new executable LangGraph.

During compilation it:

- Creates runtime nodes
- Resolves runtime models
- Resolves runtime tools
- Connects execution edges
- Produces an executable StateGraph

The compiler performs no reasoning.

It is a deterministic transformation step.

---

## Stage 3 — Runtime Execution

The compiled graph is immediately executed.

Each runtime agent:

1. Resolves its required inputs.
2. Builds its runtime prompt.
3. Invokes its assigned language model.
4. Uses external tools when required.
5. Compresses tool outputs.
6. Produces structured outputs.
7. Merges results into the shared runtime state.

Every downstream agent consumes outputs produced by previous runtime agents through the shared runtime state rather than conversational history.

---

## Design Principles

The runtime architecture follows several core principles:

- Planning and execution are completely separated.
- Runtime graphs are generated dynamically.
- Runtime agents are ephemeral and exist only for a single execution.
- Shared runtime state replaces direct agent-to-agent communication.
- Models and tools are resolved dynamically through registries.
- Every execution is deterministic once the planning phase is complete.

---
# AI Chatbot & Meta-Graph Backend

A production-ready AI orchestration backend capable of synthesizing, compiling, and executing dynamic multi-agent workflows generated entirely at runtime.

Currently acting as an orchestration layer between the frontend, authentication system, database, and a standard LangGraph workflow, the system is actively evolving from a conversational chatbot into a dynamic, self-assembling AI operating system.

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

# AI Layer

The AI layer is completely isolated from the REST API and acts as the backend's intelligent orchestration engine.

Unlike conventional chatbot backends that execute a single prompt against an LLM, this project transforms every user request into a deterministic execution pipeline capable of planning, validating, compiling, and executing runtime-generated multi-agent workflows.

```text
src/ai/
│
├── compiler/
├── graphs/
├── models/
├── nodes/
├── prompts/
├── runtime/
├── state/
├── tools/
└── validators/
```

Each directory represents an independent subsystem with clearly defined responsibilities.

---

## Graphs

Graphs define high-level orchestration workflows.

Responsibilities:

- Coordinate execution pipelines
- Connect planning nodes
- Define workflow entry points
- Produce execution state

Current graphs include:

- Chat Graph
- Runtime testing graphs

---

## Nodes

Nodes represent intelligent planning stages executed inside LangGraph.

Current planning nodes include:

- Intent Analyzer
- Clarification Node
- Meta Architect
- Agent Specification Generator
- Chat Node

Each node performs a single well-defined responsibility and communicates exclusively through structured state.

---

## State

State definitions provide the shared data contracts used throughout LangGraph execution.

Responsibilities:

- Define execution state
- Define planning state
- Maintain structured communication between nodes
- Eliminate implicit prompt-based communication

Separate state definitions exist for each planning subsystem together with the shared graph state.

---

## Prompts

Prompt templates are separated from execution logic.

Responsibilities:

- Store reusable system prompts
- Define planning behavior
- Keep orchestration code independent from prompt engineering
- Enable prompt iteration without modifying runtime logic

---

## Models

The model layer provides an abstraction over supported LLM providers.

Responsibilities:

- Configure language models
- Register available providers
- Centralize model initialization
- Support runtime model selection

Runtime agents resolve models dynamically through the model registry instead of depending on hardcoded implementations.

---

## Validators

The validation layer ensures execution plans are structurally correct before runtime compilation begins.

Current validators verify:

- Task definitions
- Dependencies
- Execution edges
- Graph topology
- Execution constraints
- Runtime metrics

No runtime graph is allowed to execute until every validation stage succeeds.

---

## Compiler

The compiler bridges AI-driven planning with deterministic runtime infrastructure.

Responsibilities:

- Consume validated execution blueprints
- Resolve runtime specifications
- Instantiate runtime agents
- Resolve runtime models
- Resolve runtime tools
- Construct runtime LangGraph nodes
- Wire execution edges
- Produce executable runtime graphs

The compiler performs no reasoning. It deterministically transforms planning artifacts into executable runtime infrastructure.

---

## Runtime

The runtime subsystem executes dynamically generated workflows.

Responsibilities:

- Instantiate ephemeral runtime agents
- Resolve task inputs
- Construct runtime prompts
- Execute language models
- Handle tool invocation
- Compress tool outputs
- Parse structured responses
- Merge outputs into shared runtime state
- Coordinate runtime execution

Runtime agents communicate exclusively through the shared runtime state rather than conversational context.

---

## Tools

External capabilities are exposed through a centralized runtime tool system.

Responsibilities:

- Register available tools
- Maintain runtime tool catalog
- Resolve tools during compilation
- Bind tools to runtime agents
- Execute external capabilities

Current implementation includes:

- Tavily Web Search

The registry architecture allows additional capabilities such as retrieval, databases, code execution, browser automation, and external APIs to be integrated without modifying the runtime engine.

---

## Overall Responsibility

The AI layer transforms natural language into deterministic execution through a sequence of independent subsystems:

```text
User Request
      │
      ▼
Intent Analysis
      │
      ▼
Clarification
      │
      ▼
Execution Planning
      │
      ▼
Blueprint Validation
      │
      ▼
Agent Specification Generation
      │
      ▼
Runtime Compilation
      │
      ▼
Dynamic LangGraph
      │
      ▼
Runtime Execution
```

Each subsystem operates on structured intermediate artifacts rather than raw natural language, enabling deterministic planning, runtime compilation, and explainable execution.

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

The project has progressed beyond a traditional chatbot architecture and now includes a complete planning and runtime execution pipeline.

## Completed

### Backend Infrastructure

- Feature-based Express architecture
- MongoDB persistence
- Authentication system
- JWT access and refresh tokens
- OTP email verification
- Conversation persistence
- Message persistence
- SSE streaming responses

---

### AI Planning Pipeline

- Intent Analyzer
- Clarification Node
- Meta Architect
- Blueprint generation
- Blueprint validation
- Agent Specification Generator

---

### Runtime Infrastructure

- Runtime graph compiler
- Dynamic LangGraph generation
- Runtime agent factory
- Runtime execution engine
- Runtime state management
- Runtime input resolution
- Runtime output validation
- Runtime output merging

---

### Runtime Tool System

- Tool catalog
- Tool registry
- Dynamic tool resolution
- Dynamic tool binding
- Tavily Web Search integration
- Tool response compression
- Duplicate tool-call caching

---

### Runtime Models

- Centralized model registry
- Runtime model selection
- Multiple LLM support

---

## Currently In Progress

The focus has shifted from infrastructure development to improving runtime intelligence and execution quality.

Current work includes:

- Runtime execution optimization
- Smarter tool usage strategies
- Conditional graph routing
- Parallel task execution
- Runtime retries
- Error recovery
- Output validation improvements
- Cost and token optimization

---

## Planned

The remaining work focuses on transforming the runtime engine into a production-grade autonomous agent platform.

Planned components include:

- Governance Layer
- Verifier Agent
- Reflection Agent
- Runtime Memory
- Planner feedback loop
- Human approval checkpoints
- Long-term memory
- Knowledge retrieval
- Runtime metrics
- Execution tracing
- Observability dashboard
- Multi-agent parallel scheduling
- Workflow visualization

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

---

# Roadmap

The project is being developed incrementally toward a fully autonomous runtime-generated multi-agent platform.

---

## Phase 1 — Backend Foundation ✅ Completed

- Express backend architecture
- MongoDB integration
- JWT authentication
- OTP email verification
- Conversation persistence
- Message persistence
- SSE response streaming
- Modular feature-based architecture

---

## Phase 2 — AI Planning Pipeline ✅ Completed

- Intent Analyzer
- Clarification Node
- Meta Architect
- Execution Blueprint generation
- Blueprint validation
- Agent Specification Generator

---

## Phase 3 — Runtime Infrastructure ✅ Completed

- Runtime graph compiler
- Dynamic LangGraph generation
- Runtime agent factory
- Runtime execution engine
- Shared runtime state
- Runtime input resolution
- Runtime output parsing
- Runtime output merging
- Dynamic model resolution
- Dynamic tool resolution
- Runtime executor

---

## Phase 4 — Runtime Tooling ✅ Completed

- Tool catalog
- Tool registry
- Tavily Web Search integration
- Dynamic tool binding
- Tool result compression
- Duplicate tool-call caching

---

## Phase 5 — Runtime Intelligence 🚧 In Progress

Current focus areas include:

- Conditional runtime routing
- Parallel task execution
- Runtime retry strategies
- Improved prompt optimization
- Runtime error recovery
- Execution cost optimization
- Token usage optimization
- Enhanced runtime logging
- Runtime metrics collection

---

## Phase 6 — Autonomous Runtime Platform 📌 Planned

The following capabilities are planned to transform the runtime engine into a production-grade autonomous agent platform:

### Governance

- Governance layer
- Policy enforcement
- Runtime safety rules
- Permission management

### Quality Assurance

- Verifier agents
- Reflection agents
- Self-correction pipeline
- Output quality scoring

### Memory

- Long-term memory
- Semantic retrieval
- User preference memory
- Execution memory
- Knowledge storage

### Scheduling

- Parallel workflow scheduler
- Dynamic worker allocation
- Dependency-aware execution
- Load balancing

### Human Collaboration

- Human approval checkpoints
- Interruptible workflows
- Manual task injection
- Runtime overrides

### Observability

- Execution tracing
- Runtime visualization
- Graph inspection
- Agent telemetry
- Cost analytics
- Token analytics
- Execution metrics dashboard

### Developer Experience

- Runtime graph visualization
- Blueprint inspection tools
- Execution replay
- Debugging interface
- Workflow export/import

---

## Long-Term Vision

The long-term objective is to build a general-purpose runtime orchestration platform capable of converting complex natural language requests into dynamically generated, self-contained multi-agent execution graphs.

Rather than relying on predefined workflows, the system will synthesize execution plans, compile runtime graphs, orchestrate specialized agents, and adapt execution strategies based on the requirements of each individual task.


# Intent Object (Intermediate Representation)

The Intent Object is the canonical representation of the user's request inside the AI runtime.

Rather than allowing downstream components to repeatedly interpret natural language, the Intent Analyzer performs this translation exactly once.

Every subsequent subsystem—including planning, compilation, verification, and reflection—operates exclusively on the Intent Object.

This architecture follows the same philosophy used by modern compilers:

```text
Natural Language
        │
        ▼
Intent Analyzer
        │
        ▼
Intent Object (IR)
        │
        ▼
Meta Architect
        │
        ▼
Blueprint
        │
        ▼
Compiled Runtime Graph
```

By introducing an intermediate representation, the system gains:

- Deterministic planning
- Reduced hallucination propagation
- Better explainability
- Easier debugging
- Stable contracts between AI components
- Independent evolution of each subsystem

# Execution Blueprint

The Execution Blueprint is the canonical planning artifact of the runtime.

While the Intent Object represents **what the user wants**, the Blueprint represents **how the runtime intends to accomplish it**.

The Blueprint is generated exclusively by the Meta Architect and serves as the contract between AI-driven planning and deterministic execution.

Every downstream subsystem—including validation, capability mapping, graph compilation, scheduling, verification, and reflection—operates on the Blueprint rather than the original user request.

The Blueprint intentionally remains implementation-independent.

It describes execution semantics without referencing:

- LangGraph
- Node.js
- Express
- JavaScript
- Runtime prompts
- Internal tool implementations

Conceptually, the planning pipeline becomes:

```text
Natural Language
        │
        ▼
Intent Analyzer
        │
        ▼
Intent Object
        │
        ▼
Meta Architect
        │
        ▼
Execution Blueprint
        │
        ▼
Blueprint Validator
        │
        ▼
Compiled Runtime Graph
```

This separation allows execution engines to evolve independently from planning while preserving deterministic interfaces between every subsystem.

# AI Runtime Components
## Intent Analyzer

The Intent Analyzer is the first intelligent component in the runtime execution pipeline.

Its responsibility is **not** to solve the user's request. Instead, it transforms unstructured natural language into a deterministic **Intent Object**, which serves as the canonical intermediate representation (IR) for every downstream AI subsystem.

No subsequent component—including the Meta-Architect—directly consumes the user's raw prompt. Every planning decision begins from the structured Intent Object.

### Responsibilities

- Extract the primary objective
- Classify the problem domain
- Identify technologies
- Normalize requested features
- Determine the user's intent category
- Classify the task type
- Extract explicit constraints
- Detect ambiguities
- Determine whether clarification is required
- Estimate reasoning and execution complexity
- Produce confidence scores for extracted fields

### Output

The Intent Analyzer produces a structured Intent Object containing:

```text
Goal
Problem Domain
Technologies
Features
Intent Category
Task Type
Constraints
Inputs
Expected Output
Ambiguities
Requires Clarification
Complexity
Confidence
```

This object acts as the intermediate representation of the user's request and becomes the single source of truth throughout execution.

The Intent Analyzer never:

- Designs workflows
- Chooses tools
- Creates agents
- Executes tasks
- Produces user-facing responses

## Clarification Node

The Clarification Node is the second intelligent subsystem within the runtime pipeline.

Rather than attempting to solve the user's request, it evaluates the structured Intent Object and determines whether sufficient information exists to produce a deterministic execution blueprint.

Unlike conventional chatbots that silently assume missing information, the Clarification Node explicitly requests additional decisions whenever they could materially influence the generated execution graph.

### Responsibilities

- Consume the Intent Object produced by the Intent Analyzer
- Evaluate detected ambiguities
- Determine whether planning can proceed deterministically
- Generate the smallest possible set of clarification questions
- Produce structured clarification metadata for frontend rendering
- Preserve explicit user intent instead of relying on hidden assumptions

### Output

The Clarification Node produces a structured clarification payload containing:

```text
Requires Clarification
Questions
Question Identifier
Target Intent Field
Question
Required Flag
Selectable Options
```

Each clarification question is mapped to an exact property path inside the Intent Object.

Example:

```text
constraints.authentication.method
constraints.deployment.environment
constraints.streaming.protocol
constraints.scalability.strategy
```

This allows future deterministic Intent updates without requiring another LLM pass.

Whenever selectable answers are provided, a fallback option of **"Other (Please specify)"** is always included, allowing users to override system recommendations with custom values.

The Clarification Node never:

- Modifies the Intent Object
- Plans workflows
- Creates agents
- Chooses tools
- Generates execution graphs
- Produces user-facing solutions

## Meta Architect

The Meta Architect is the first planning subsystem within the AI runtime.

Rather than solving the user's request directly, it consumes the validated Intent Object and synthesizes a deterministic execution blueprint describing **what** work must be performed, **in what order**, and **under which execution constraints**.

The Meta Architect is intentionally independent of any execution engine. It has no knowledge of LangGraph, Node.js, tools, prompts, or runtime implementation details.

Its sole responsibility is to transform user intent into a structured execution specification.

### Responsibilities

- Consume the validated Intent Object
- Analyze task dependencies
- Decompose complex objectives into independent execution tasks
- Design execution topology
- Define execution constraints
- Specify task capabilities
- Produce execution success criteria
- Generate a deterministic Blueprint

### Blueprint Structure

The generated Blueprint contains:

```text
Metadata
Execution Configuration
Tasks
Edges
Constraints
Global Success Criteria
Final Output Specification
```

Each task represents a unit of work rather than a concrete implementation.

Tasks describe:

```text
Identifier
Name
Objective
Rationale
Capabilities
Dependencies
Expected Inputs
Expected Outputs
Success Criteria
```

The Meta Architect never:

- Executes tasks
- Selects runtime tools
- Generates prompts
- Instantiates agents
- Compiles execution graphs
- Produces user-facing responses

Its output becomes the canonical execution specification consumed by all downstream runtime infrastructure.

## Blueprint Validator

The Blueprint Validator is the first deterministic subsystem following AI-driven planning.

Its responsibility is to verify that the Execution Blueprint produced by the Meta Architect is structurally, semantically, and topologically valid before any runtime compilation begins.

Rather than attempting to repair invalid plans, the Validator behaves similarly to the front-end of a compiler: it either certifies the blueprint as executable or produces a detailed validation report describing every detected issue.

No downstream subsystem is permitted to consume an invalid blueprint.

### Responsibilities

- Validate task definitions
- Detect duplicate task identifiers
- Detect duplicate task names
- Validate task dependencies
- Detect unknown dependencies
- Detect self-dependencies
- Validate execution edges
- Detect invalid edge references
- Validate graph connectivity
- Detect orphan tasks
- Detect unreachable tasks
- Detect cyclic execution graphs
- Validate execution constraints
- Compute execution metrics for valid blueprints

### Validation Pipeline

```text
Execution Blueprint
        │
        ▼
Task Validation
        │
        ▼
Dependency Validation
        │
        ▼
Edge Validation
        │
        ▼
Graph Validation
        │
        ▼
Constraint Validation
        │
        ▼
Blueprint Accepted
        │
        ▼
Execution Metrics
```

Execution metrics are generated only after all validation stages succeed.

This prevents downstream runtime infrastructure from operating on structurally invalid execution graphs.

### Execution Metrics

For every valid blueprint, the Validator computes runtime metadata including:

```text
Total Tasks
Total Edges
Root Tasks
Leaf Tasks
Graph Depth
Execution Width
Longest Execution Path
Maximum Parallel Branches
```

These metrics are later consumed by the Runtime Scheduler, System Governor, Reflection Engine, and future optimization components.

### Output

The Blueprint Validator produces a deterministic validation report containing:

```text
Validation Status
Errors
Warnings
Execution Metrics
Validated Blueprint
```

The Blueprint Validator never:

- Repairs execution plans
- Reorders tasks
- Generates prompts
- Selects tools
- Compiles execution graphs
- Executes runtime agents

## Agent Specification Generator

The Agent Specification Generator is the final AI-driven planning subsystem before the runtime transitions into deterministic infrastructure.

Its responsibility is to transform every abstract task contained in the validated Execution Blueprint into a fully specified runtime agent definition.

Unlike the Meta Architect, which decides **what work must be performed**, the Agent Specification Generator decides **how each runtime worker should behave**.

Each generated specification becomes the blueprint from which an Ephemeral Runtime Agent will later be instantiated.

### Responsibilities

- Consume the validated Execution Blueprint
- Generate one runtime specification per task
- Produce deterministic system prompts
- Define agent personas
- Assign execution roles
- Select the appropriate language model
- Configure temperature
- Define runtime tool strategy
- Configure execution limits

### Runtime Agent Specification

Each generated specification contains:

```text
Task Identifier
Persona
Role
System Prompt
Model
Temperature
Tool Strategy
Maximum Iterations

### Responsibilities

- Consume the validated Execution Blueprint
- Generate one runtime specification per task
- Produce deterministic system prompts
- Define agent personas
- Assign execution roles
- Select the appropriate language model
- Configure temperature
- Define runtime tool strategy

```

### Runtime Agent Specification

Each generated specification contains:

```text
Task Identifier
Persona
Role
System Prompt
Model
Temperature
Tool Strategy
Maximum Iterations
```

These specifications define the behavior of each runtime agent while remaining completely independent of the execution engine.

The execution state shared between runtime agents is instead defined by the Execution Blueprint through each task's expected inputs and expected outputs.

### Example Pipeline

```text
Execution Blueprint
        │
        ▼
Task
        │
        ▼
Agent Specification Generator
        │
        ▼
Runtime Agent Specification
        │
        ▼
Ephemeral Runtime Agent
```

The Agent Specification Generator never:

- Execute tasks
- Call external tools
- Compile graphs
- Schedule execution
- Produce user-facing responses

Its sole responsibility is to synthesize deterministic runtime specifications that later become executable runtime agents.

### Responsibilities

- Consume the validated Execution Blueprint
- Generate one runtime specification per task
- Produce deterministic system prompts
- Define agent personas
- Assign execution roles
- Select the appropriate language model
- Configure temperature
- Define tool usage strategy
- Generate structured output contracts

### Runtime Agent Specification

Each generated specification contains:

```text
Task Identifier
Persona
Role
System Prompt
Model
Temperature
Tool Strategy
Output Schema
```

The generated Output Schema acts as a deterministic contract between the runtime agent and downstream infrastructure.

Instead of returning arbitrary natural language, every runtime agent is expected to produce structured outputs that can be validated before being merged into the global execution state.

This enables predictable state transitions, reliable validation, and deterministic communication between runtime agents.

### Example Pipeline

```text
Execution Blueprint
        │
        ▼
Task
        │
        ▼
Agent Specification Generator
        │
        ▼
Runtime Agent Specification
        │
        ▼
Ephemeral Agent
```

The Agent Specification Generator never:

- Execute tasks
- Call external tools
- Compile graphs
- Schedule execution
- Produce user-facing responses

Its sole responsibility is to synthesize deterministic runtime specifications that later become executable workers.

## Runtime Graph Compiler

The Runtime Graph Compiler is the first deterministic runtime subsystem following AI-driven planning.

Its responsibility is to transform the validated Execution Blueprint together with the generated Runtime Agent Specifications into an executable LangGraph workflow.

Unlike traditional workflow engines that rely on predefined graphs, the Runtime Graph Compiler synthesizes an entirely new execution graph for every user request.

No runtime agents, nodes, or execution topology exist beforehand.

### Responsibilities

- Consume the validated Execution Blueprint
- Consume Runtime Agent Specifications
- Instantiate ephemeral runtime agents
- Resolve runtime models
- Resolve runtime tools
- Construct LangGraph nodes
- Wire execution edges
- Compile an executable StateGraph

### Runtime Compilation Pipeline

```text
Validated Blueprint
        │
        ▼
Runtime Agent Specifications
        │
        ▼
Resolve Models
        │
        ▼
Resolve Tools
        │
        ▼
Instantiate Runtime Agents
        │
        ▼
Create Runtime Nodes
        │
        ▼
Connect Execution Edges
        │
        ▼
Compile LangGraph
        │
        ▼
Executable Runtime Graph
```

### Responsibilities

- Consume the validated Execution Blueprint
- Consume Runtime Agent Specifications
- Instantiate ephemeral runtime agents
- Bind language models
- Bind runtime tools
- Construct LangGraph nodes
- Wire execution edges
- Compile an executable StateGraph

### Compilation Pipeline

```text
Validated Blueprint
        │
        ▼
Runtime Agent Specifications
        │
        ▼
Instantiate Runtime Agents
        │
        ▼
Bind Models
        │
        ▼
Bind Tools
        │
        ▼
Construct Nodes
        │
        ▼
Connect Edges
        │
        ▼
Compile LangGraph
        │
        ▼
Executable Runtime Graph
```

The Runtime Graph Compiler never:

- Executes runtime agents
- Performs reasoning
- Modifies execution plans
- Generates prompts
- Produces user-facing responses

Its sole responsibility is compiling runtime artifacts into an executable LangGraph.


## Runtime Execution Engine

Once the Runtime Graph Compiler produces an executable LangGraph, the Runtime Execution Engine becomes responsible for executing every ephemeral runtime agent while maintaining the shared execution state.

Rather than relying on conversational memory between agents, all communication occurs through a deterministic shared runtime state.

Each runtime agent:

1. Resolves the inputs declared by its task's `expectedInput`.
2. Receives only those resolved inputs together with its runtime specification.
3. Executes its assigned tools when necessary.
4. Produces structured JSON output.
5. Validates that every declared `expectedOutput` has been produced.
6. Merges those outputs into the shared runtime state.
7. Passes execution to the next task according to the compiled graph.

### Runtime Execution Cycle

```text
Runtime State
        │
        ▼
Resolve Expected Inputs
        │
        ▼
Construct Agent Prompt
        │
        ▼
Invoke Runtime Agent
        │
        ▼
Optional Tool Calls
        │
        ▼
Structured JSON Output
        │
        ▼
Validate Expected Outputs
        │
        ▼
Merge Into Runtime State
        │
        ▼
Next Runtime Agent
```

## System Governor
The safety net that wraps the dynamic graph in a strict control layer.

Responsibilities: Applies execution policies including runtime time limits, token budgets, recursion limits, and security constraints.

## Runtime Scheduler
Coordinates the actual execution of the compiled graph.

Responsibilities: Manages sequential/parallel execution, dependency management, retries, and cancellation.

## Ephemeral Agents
Runtime-generated workers created from blueprint specifications.

Characteristics: They do not exist permanently in the codebase. Each agent is instantiated solely for the duration of the execution and garbage-collected afterward.

## Verifier
Validates execution results against the original Intent constraints.

Responsibilities: Produces structured diagnostics rather than text corrections, forcing a re-compilation loop if the execution failed its objective.

## Response Composer
Transforms structured execution state into human-readable responses suitable for SSE streaming.

## Reflection Engine
Runs asynchronously in the background after the user receives their response.

Responsibilities: Collects execution metrics, topology performance, tool reliability, and optimization opportunities to train future generation strategies.

## Design Principles

The runtime architecture follows several core principles.

### Runtime Synthesis

No execution graph is predefined.

Every workflow is synthesized dynamically from the analyzed user intent.

---

### Intermediate Representation

Natural language is translated exactly once into a structured Intent Object.

Every downstream subsystem operates exclusively on structured representations rather than raw prompts.

---

### Separation of Concerns

Intent analysis, planning, compilation, orchestration, execution, verification, response generation, and reflection remain completely independent subsystems with clearly defined responsibilities.

---

### Deterministic Infrastructure

Infrastructure components such as scheduling, validation, compilation, governance, dependency management, and runtime orchestration are implemented deterministically rather than through LLM reasoning.

---

### Disposable Runtime Workers

Problem-solving agents exist only during execution.

They are dynamically instantiated from blueprint specifications and destroyed immediately after execution completes.

---

### Structured Communication

Every subsystem exchanges strictly validated structured objects instead of free-form natural language.

This minimizes hallucination propagation and provides stable contracts between components.

---

### Explainable Execution

Every execution can be reconstructed through a chain of structured runtime artifacts.

```text
User Request
      │
      ▼
Intent Object
      │
      ▼
Clarification Payload
      │
      ▼
Validated Intent
      │
      ▼
Execution Blueprint
      │
      ▼
Validated Blueprint
      │
      ▼
Compiled Runtime Graph
      │
      ▼
Execution Trace
      │
      ▼
Verification Report
      │
      ▼
Reflection Report
```

Each artifact represents a well-defined transformation stage with explicit responsibilities.

This architecture enables deterministic debugging, replayable executions, complete execution traceability, and independent evolution of planning and execution subsystems.

# How It Works

Every request is processed through two independent phases:

1. **Planning**
2. **Runtime Execution**

This separation allows the backend to dynamically generate specialized multi-agent workflows instead of relying on a fixed agent architecture.

---

## 1. User Request

A user submits a request through the chat API.

Example:

> Plan a 14-day cultural and culinary trip to Japan for two people with a budget of $2500.

The request is forwarded to the AI orchestration pipeline.

---

## 2. Intent Analysis

The Intent Analyzer extracts the user's objective into a structured intent representation.

Example outputs include:

- Primary objective
- Constraints
- Required capabilities
- Complexity estimate

This structured representation becomes the foundation for the planning pipeline.

---

## 3. Clarification

If required information is missing or ambiguous, the Clarification Node requests additional details.

Examples include:

- Budget
- Dates
- Preferred destinations
- Travel style
- Missing constraints

Once sufficient information is available, execution proceeds automatically.

---

## 4. Meta Architecture Planning

The Meta Architect decomposes the request into an executable workflow.

Instead of solving the task directly, it produces a validated execution blueprint describing:

- Tasks
- Dependencies
- Execution edges
- Required tools
- Expected inputs
- Expected outputs
- Success conditions

This blueprint defines **what should be executed**, not **how it is executed**.

---

## 5. Blueprint Validation

Before execution, the generated blueprint is validated.

Validation includes:

- Task integrity
- Dependency correctness
- Edge validation
- Graph consistency
- Execution constraints

Invalid workflows are rejected before runtime compilation.

---

## 6. Agent Specification Generation

For every task inside the validated blueprint, a runtime agent specification is generated.

Each specification defines:

- Persona
- Role
- Runtime system prompt
- Model selection
- Tool strategy
- Iteration limits

These specifications act as runtime blueprints for individual agents.

---

## 7. Runtime Compilation

The Runtime Compiler combines:

- Execution Blueprint
- Agent Specifications

to generate a completely new executable LangGraph.

During compilation it:

- Creates runtime nodes
- Resolves models
- Resolves tools
- Wires execution edges
- Produces an executable runtime graph

No reasoning occurs during compilation.

---

## 8. Runtime Execution

The compiled graph is immediately executed.

Each runtime agent performs the following sequence:

1. Resolve required inputs from shared runtime state.
2. Construct a runtime prompt.
3. Invoke the assigned language model.
4. Call external tools when required.
5. Compress tool responses.
6. Produce structured JSON output.
7. Merge results into shared runtime state.

Each agent operates independently while sharing execution state with downstream agents.

---

## 9. Tool Invocation

When runtime agents require external information, they invoke tools through the centralized runtime tool registry.

Current capabilities include:

- Tavily Web Search

Tool responses are:

- Cached within the agent
- Compressed before re-entering the context window
- Passed back as structured ToolMessages

This minimizes token consumption while preserving relevant information.

---

## 10. Runtime State Propagation

Runtime agents never communicate directly.

Instead, every successful task writes its outputs into the shared runtime state.

Subsequent agents resolve their required inputs directly from this state.

Example:

```text
Initialize Trip Planner
            │
            ▼
trip_parameters
            │
            ▼
Research Destination Options
            │
            ▼
destination_options
            │
            ▼
Optimize Transportation
            │
            ▼
transportation_plan
            │
            ▼
Plan Accommodations
            │
            ▼
accommodation_plan
            │
            ▼
...
```

This creates deterministic data flow throughout execution.

---

## 11. Final Output

Once every runtime agent has completed successfully, the runtime graph returns the final shared execution state.

The backend extracts the requested final artifact and streams it back to the client using Server-Sent Events (SSE).

Because the workflow itself is generated dynamically, two different user requests may execute entirely different runtime graphs while sharing the same underlying execution engine.