# B.E.R.N.D. | Chatbot Frontend

A React-based web frontend for **B.E.R.N.D.**, an AI-powered chatbot backed by a RAG (Retrieval-Augmented Generation) service. The app connects to the backend over WebSockets, requires Microsoft Azure AD authentication, and is deployed as an Azure Static Web App.

---

## ✨ Features

- 🔐 **Azure AD login** via MSAL (Microsoft Authentication Library)
- ⚡ **Real-time chat** over WebSockets with automatic reconnection
- 💬 **Multiple conversations** — create, switch between, and delete chat sessions
- 📎 **File uploads** — send documents directly into the RAG knowledge base (PDF, Excel, PowerPoint, JPG; max 50 MB)
- 📝 **Markdown rendering** with syntax highlighting in bot responses
- 🔔 **Toast notifications** for connection status, errors, and upload confirmations
- ☁️ **CI/CD** via Azure DevOps → Azure Static Web Apps

---

## 🗂️ Project Structure

```
Projekt/
└── chatbot/
    ├── public/                  # Static assets (index.html, favicon, manifest)
    └── src/
        ├── App.js               # Root component, layout, auth gate
        ├── components/
        │   ├── Message/         # Single chat message bubble
        │   ├── MessageInput/    # Text input + upload button
        │   ├── MessageList/     # Scrollable message history
        │   ├── Sidebar/         # Conversation list + new/delete actions
        │   └── SiteHeader/      # Top bar with user info and menu toggle
        ├── managers/
        │   └── auth/
        │       ├── msal.js      # MSAL instance, token acquisition, logout
        │       └── graph.js     # Microsoft Graph API (profile, avatar)
        └── utils/
            ├── useChatData.js        # Main hook: WS lifecycle, send, upload, conversations
            ├── useMsalUser.js        # Hook: current user info from Graph
            ├── conversationReducer.js # State management for conversation list
            ├── conversationActions.js # Action creators
            └── chatUtils.js          # ID helpers, timestamp formatting, WS URL builder
```

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) 18+
- An Azure AD App Registration (SPA type) with the appropriate API scope
- The RAG backend running and accessible

### Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/FireLighT1337/abschlussprojekt.git
   cd abschlussprojekt/Projekt/chatbot
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Create a `.env.local` file** in the `chatbot/` directory:

   ```env
   REACT_APP_AZURE_CLIENT_ID=<your-azure-spa-client-id>
   REACT_APP_AZURE_AUTHORITY=https://login.microsoftonline.com/<your-tenant-id>
   REACT_APP_AZURE_SCOPE=<your-api-scope>        # e.g. api://<client-id>/chat
   REACT_APP_API_BASE=http://localhost:8000       # Backend base URL
   REACT_APP_WS_PATH=/chat                        # WebSocket endpoint path
   ```

4. **Start the development server:**
   ```bash
   npm start
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🔌 Backend Integration

The frontend communicates with the backend in two ways:

| Channel       | Used for                                                                   |
| ------------- | -------------------------------------------------------------------------- |
| **HTTP REST** | Auth ticket (`POST /chat/auth/ticket`), file upload (`POST /files/upload`) |
| **WebSocket** | Real-time messaging, conversation list, conversation history               |

### WebSocket message types

| Direction | Type                  | Description                               |
| --------- | --------------------- | ----------------------------------------- |
| → Server  | `GetConversationList` | Fetch all conversations for the user      |
| → Server  | `GetConversation`     | Load messages for a specific conversation |
| → Server  | `message`             | Send a user message                       |
| → Server  | `DeleteConversation`  | Delete a conversation                     |
| ← Client  | `conversationList`    | List of all conversations                 |
| ← Client  | `conversation`        | Messages for a single conversation        |
| ← Client  | `message`             | Bot reply                                 |
| ← Client  | `success`             | Confirmation (e.g. delete)                |
| ← Client  | `error`               | Error from server                         |

The WebSocket connection is established using a short-lived ticket obtained from `POST /chat/auth/ticket` with the user's Azure AD Bearer token. The connection auto-reconnects on close (5 s) or failure (8 s).

---

## 📁 Supported Upload Types

| Format     | Extensions      |
| ---------- | --------------- |
| PDF        | `.pdf`          |
| Excel      | `.xls`, `.xlsx` |
| PowerPoint | `.ppt`, `.pptx` |
| Image      | `.jpg`, `.jpeg` |

Maximum file size: **50 MB**

---

## 🧪 Running Tests

```bash
npm test
```

Tests use [React Testing Library](https://testing-library.com/) and [MSW](https://mswjs.io/) for API mocking. Test files are colocated with their components (`.test.jsx`).

---

## ☁️ Deployment

The app is deployed automatically to **Azure Static Web Apps** via Azure DevOps CI/CD on every push or pull request to `main`.

The pipeline reads the following variables from an Azure DevOps variable group (`Azure-Static-Web-Apps-ambitious-sea-03e2a0803-variable-group`):

| Variable                              | Description                  |
| ------------------------------------- | ---------------------------- |
| `REACT_APP_AZURE_CLIENT_ID`           | Azure AD SPA client ID       |
| `REACT_APP_AZURE_AUTHORITY`           | Azure AD authority URL       |
| `REACT_APP_AZURE_SCOPE`               | API scope for token requests |
| `REACT_APP_API_BASE`                  | Production backend base URL  |
| `REACT_APP_WS_PATH`                   | Production WebSocket path    |
| `AZURE_STATIC_WEB_APPS_API_TOKEN_...` | Deployment token             |

---

## 🛠️ Tech Stack

|               | Library / Service                              |
| ------------- | ---------------------------------------------- |
| Framework     | React 19                                       |
| UI Components | Ant Design 6                                   |
| Auth          | @azure/msal-browser 4                          |
| Markdown      | react-markdown + remark-gfm + rehype-highlight |
| Notifications | react-toastify                                 |
| Testing       | React Testing Library + MSW                    |
| Hosting       | Azure Static Web Apps                          |
| CI/CD         | Azure DevOps Pipelines                         |

---

## 👤 Author

**FireLighT1337** — [github.com/FireLighT1337](https://github.com/FireLighT1337)
