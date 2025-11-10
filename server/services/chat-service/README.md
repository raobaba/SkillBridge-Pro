# Chat Service - API Documentation

## 📋 Table of Contents

1. [Overview](#overview)
2. [Service Architecture](#service-architecture)
3. [Authentication & Authorization](#authentication--authorization)
4. [REST API Endpoints](#rest-api-endpoints)
5. [WebSocket (Socket.io) Events](#websocket-socketio-events)
6. [Real-Time Communication Flow](#real-time-communication-flow)
7. [Conversation Management APIs](#conversation-management-apis)
8. [Message Management APIs](#message-management-apis)
9. [Participant Management APIs](#participant-management-apis)
10. [Database Models](#database-models)
11. [Error Handling](#error-handling)

---

## Overview

The **Chat Service** is a microservice responsible for real-time messaging, conversations, and chat functionality in the SkillBridge Pro platform. It supports both REST APIs for standard operations and WebSocket (Socket.io) for real-time communication.

### Key Features

- 💬 Real-Time Messaging (WebSocket)
- 📱 Direct Messages (1-on-1)
- 👥 Group Conversations (Project Owners & Developers)
- ✅ Read Receipts
- ⌨️ Typing Indicators
- 📂 Conversation Management (Archive, Favorite, Mute)
- 🚩 Moderation (Flag Conversations)
- 🔔 Real-Time Notifications
- 📊 Online/Offline Status

### Base URL

```
http://localhost:3004
```

### API Prefix

- Chat APIs: `/api/v1/chat`
- WebSocket: `ws://localhost:3004` (Socket.io)

---

## Service Architecture

### Directory Structure

```
chat-service/
├── src/
│   ├── config/              # Configuration files
│   │   └── database.js      # Database connection
│   ├── controllers/         # Request handlers
│   │   └── chat.controller.js
│   ├── models/              # Database models
│   │   ├── conversations.model.js
│   │   ├── messages.model.js
│   │   ├── conversation-participants.model.js
│   │   └── message-read-receipts.model.js
│   ├── routes/              # API routes
│   │   └── chat.routes.js
│   ├── socket/              # Socket.io handlers
│   │   ├── socket.auth.js
│   │   └── socket.handlers.js
│   └── server.js            # Express & Socket.io setup
└── README.md
```

### Request Flow

```
Client Request (REST)
    ↓
API Gateway (Port 3000)
    ↓
Chat Service (Port 3004)
    ↓
Route Handler (routes/chat.routes.js)
    ↓
Authentication Middleware (JWT)
    ↓
Controller (controllers/chat.controller.js)
    ↓
Model Layer (models/*.model.js)
    ↓
Database (PostgreSQL via Drizzle ORM)
    ↓
Response to Client

Client Connection (WebSocket)
    ↓
Socket.io Server
    ↓
Socket Authentication Middleware (JWT)
    ↓
Socket Handlers (socket/socket.handlers.js)
    ↓
Real-Time Event Emission
    ↓
Connected Clients
```

---

## Authentication & Authorization

### REST API Authentication

All REST endpoints require JWT authentication via the `Authorization` header:
```
Authorization: Bearer <token>
```

### WebSocket Authentication

Socket.io connections require JWT authentication via the handshake:
```javascript
socket.io({
  auth: {
    token: "your-jwt-token"
  }
})
```

Or via headers:
```
Authorization: Bearer <token>
```

### Role-Based Authorization

- **Project Owner**: Can create group conversations and add/remove participants
- **Developer**: Can participate in conversations
- **Admin**: Can flag/unflag conversations for moderation

---

## REST API Endpoints

### Conversation Management

#### Get Conversations

**Endpoint:** `GET /api/v1/chat/conversations`

**Authentication:** Required

**Query Parameters:**
- `type`: Filter by type (`direct`, `group`)
- `archived`: Filter archived conversations (`true`, `false`)
- `favorites`: Filter favorite conversations (`true`, `false`)
- `flagged`: Filter flagged conversations (`true`)
- `search`: Search term
- `role`: Filter by participant role (`project-owner`, `developer`, `member`)

**Flow:**
1. Authenticate user
2. Query conversations where user is a participant
3. Apply filters (type, archived, favorites, flagged, search, role)
4. Get last message for each conversation
5. Get other participants for direct messages
6. Return enriched conversations with participant details

**Response:**
```json
{
  "success": true,
  "status": 200,
  "message": "Conversations retrieved successfully",
  "data": [
    {
      "id": 1,
      "type": "direct",
      "name": null,
      "projectId": null,
      "status": "active",
      "isFlagged": false,
      "lastMessage": {
        "id": 100,
        "content": "Hello!",
        "senderId": 456,
        "timestamp": "2024-01-15T10:30:00Z"
      },
      "participant": {
        "unreadCount": 2,
        "isArchived": false,
        "isFavorite": false,
        "isMuted": false,
        "lastReadAt": "2024-01-15T09:00:00Z"
      },
      "otherParticipantIds": [456],
      "participantIds": [123, 456],
      "updatedAt": "2024-01-15T10:30:00Z"
    }
  ]
}
```

#### Get or Create Direct Conversation

**Endpoint:** `GET /api/v1/chat/conversations/direct/:otherUserId`

**Authentication:** Required

**Query Parameters:**
- `projectId`: Optional project ID to associate with conversation

**Flow:**
1. Authenticate user
2. Extract `otherUserId` from URL parameter
3. Check if direct conversation already exists between users
4. If exists: Return existing conversation
5. If not exists: Create new direct conversation with both users as participants
6. If `projectId` provided: Associate conversation with project
7. Return conversation

**Response:**
```json
{
  "success": true,
  "status": 200,
  "message": "Conversation retrieved/created successfully",
  "data": {
    "id": 1,
    "type": "direct",
    "projectId": 5,
    "status": "active",
    "participants": [
      {
        "id": 1,
        "userId": 123,
        "role": "member",
        "joinedAt": "2024-01-15T10:00:00Z"
      },
      {
        "id": 2,
        "userId": 456,
        "role": "member",
        "joinedAt": "2024-01-15T10:00:00Z"
      }
    ]
  }
}
```

#### Create Group Conversation

**Endpoint:** `POST /api/v1/chat/conversations/group`

**Authentication:** Required (Project Owner)

**Request Body:**
```json
{
  "name": "Project Alpha Team",
  "projectId": 5,
  "participantIds": [456, 789, 101]
}
```

**Flow:**
1. Authenticate user (must be project-owner)
2. Validate required fields: `name`
3. Create group conversation
4. Add creator as participant with role `project-owner`
5. Add all `participantIds` as participants with role `developer`
6. Send welcome message from project-owner to all developers
7. Emit Socket.io event to notify participants
8. Return conversation

**Response:**
```json
{
  "success": true,
  "status": 201,
  "message": "Group conversation created successfully",
  "data": {
    "id": 2,
    "type": "group",
    "name": "Project Alpha Team",
    "projectId": 5,
    "status": "active"
  }
}
```

#### Delete Conversation

**Endpoint:** `DELETE /api/v1/chat/conversations/:conversationId`

**Authentication:** Required

**Flow:**
1. Authenticate user
2. Verify conversation exists
3. **For Groups**: Only project-owner who created the group can delete
4. **For Direct**: Only developer who started the conversation can delete
5. Soft delete: Set `status = 'deleted'`
6. Emit Socket.io event to notify all participants
7. Return success

### Message Management

#### Get Messages

**Endpoint:** `GET /api/v1/chat/conversations/:conversationId/messages`

**Authentication:** Required

**Query Parameters:**
- `limit`: Number of messages (default: 50)
- `offset`: Pagination offset (default: 0)

**Flow:**
1. Authenticate user
2. Verify user is a participant in the conversation
3. Query messages for conversation
4. Order by `createdAt` DESC (newest first)
5. Apply pagination
6. Reverse order (oldest first) for frontend display
7. Mark messages as read for this user
8. Return messages

**Response:**
```json
{
  "success": true,
  "status": 200,
  "message": "Messages retrieved successfully",
  "data": [
    {
      "id": 100,
      "conversationId": 1,
      "senderId": 456,
      "content": "Hello!",
      "messageType": "text",
      "status": "read",
      "isDeleted": false,
      "isEdited": false,
      "createdAt": "2024-01-15T10:30:00Z"
    }
  ],
  "pagination": {
    "limit": 50,
    "offset": 0,
    "total": 100
  }
}
```

#### Send Message

**Endpoint:** `POST /api/v1/chat/messages`

**Authentication:** Required

**Request Body:**
```json
{
  "conversationId": 1,
  "content": "Hello, how are you?",
  "messageType": "text",
  "fileUrl": null,
  "fileName": null,
  "fileSize": null,
  "replyToId": null
}
```

**Flow:**
1. Authenticate user
2. Validate required fields: `conversationId`, `content`
3. Verify user is a participant in the conversation
4. Check if conversation is flagged (non-admins cannot send messages to flagged conversations)
5. Create message record in database
6. Update conversation's `updatedAt` timestamp
7. Increment `unreadCount` for all participants except sender
8. Emit Socket.io event `new_message` to all participants
9. Return created message

**Response:**
```json
{
  "success": true,
  "status": 201,
  "message": "Message sent successfully",
  "data": {
    "id": 101,
    "conversationId": 1,
    "senderId": 123,
    "content": "Hello, how are you?",
    "messageType": "text",
    "status": "sent",
    "createdAt": "2024-01-15T10:35:00Z"
  }
}
```

#### Edit Message

**Endpoint:** `PUT /api/v1/chat/messages/:messageId`

**Authentication:** Required

**Request Body:**
```json
{
  "content": "Updated message content"
}
```

**Flow:**
1. Authenticate user
2. Find message by ID
3. Verify message belongs to user (only sender can edit)
4. Update message content
5. Set `isEdited = true` and `editedAt = current timestamp`
6. Return updated message

#### Delete Message

**Endpoint:** `DELETE /api/v1/chat/messages/:messageId`

**Authentication:** Required

**Flow:**
1. Authenticate user
2. Find message by ID
3. Verify message belongs to user (only sender can delete)
4. Soft delete: Set `isDeleted = true` and `deletedAt = current timestamp`
5. Return deleted message

#### Mark Messages as Read

**Endpoint:** `POST /api/v1/chat/conversations/:conversationId/read`

**Authentication:** Required

**Request Body:**
```json
{
  "messageIds": [100, 101, 102]
}
```

**Flow:**
1. Authenticate user
2. Verify user is a participant
3. If `messageIds` provided: Mark specific messages as read
4. If `messageIds` not provided: Mark all unread messages in conversation as read
5. Create read receipts in `message_read_receipts` table
6. Reset `unreadCount` to 0 for user in conversation
7. Update `lastReadAt` timestamp
8. Emit Socket.io event `messages_read` to conversation
9. Return success

### Participant Management

#### Get Conversation Participants

**Endpoint:** `GET /api/v1/chat/conversations/:conversationId/participants`

**Authentication:** Required

**Flow:**
1. Authenticate user
2. Verify user is a participant in the conversation
3. Query all participants for the conversation
4. Return participants list

**Response:**
```json
{
  "success": true,
  "status": 200,
  "message": "Participants retrieved successfully",
  "data": [
    {
      "id": 1,
      "conversationId": 2,
      "userId": 123,
      "role": "project-owner",
      "joinedAt": "2024-01-15T10:00:00Z",
      "unreadCount": 0,
      "isArchived": false,
      "isFavorite": false,
      "isMuted": false
    },
    {
      "id": 2,
      "conversationId": 2,
      "userId": 456,
      "role": "developer",
      "joinedAt": "2024-01-15T10:00:00Z",
      "unreadCount": 2,
      "isArchived": false,
      "isFavorite": false,
      "isMuted": false
    }
  ]
}
```

#### Add Participants to Group

**Endpoint:** `POST /api/v1/chat/conversations/:conversationId/participants`

**Authentication:** Required (Project Owner)

**Request Body:**
```json
{
  "participantIds": [789, 101]
}
```

**Flow:**
1. Authenticate user (must be project-owner)
2. Verify conversation exists and is a group
3. Verify user is project-owner participant in the group
4. For each `participantId`:
   - Check if already a participant
   - Add as participant with role `developer`
5. Emit Socket.io event `participants_added` to conversation
6. Return added participants

#### Remove Participant from Group

**Endpoint:** `DELETE /api/v1/chat/conversations/:conversationId/participants/:participantId`

**Authentication:** Required (Project Owner)

**Flow:**
1. Authenticate user (must be project-owner)
2. Verify conversation exists and is a group
3. Verify user is project-owner participant in the group
4. Verify participant is not the user (cannot remove yourself)
5. Remove participant: Set `leftAt = current timestamp`
6. Emit Socket.io event `participant_removed` to conversation
7. Return success

#### Update Participant Settings

**Endpoint:** `PUT /api/v1/chat/conversations/:conversationId/participant`

**Authentication:** Required

**Request Body:**
```json
{
  "isArchived": true,
  "isFavorite": false,
  "isMuted": true
}
```

**Flow:**
1. Authenticate user
2. Update participant settings (archive, favorite, mute)
3. Return updated participant

### Moderation

#### Flag Conversation

**Endpoint:** `POST /api/v1/chat/conversations/:conversationId/flag`

**Authentication:** Required (Admin)

**Request Body:**
```json
{
  "reason": "Inappropriate content"
}
```

**Flow:**
1. Authenticate user (must be admin)
2. Flag conversation: Set `isFlagged = true`, `flaggedReason`, `flaggedAt`, `flaggedBy`
3. Return flagged conversation

#### Unflag Conversation

**Endpoint:** `DELETE /api/v1/chat/conversations/:conversationId/flag`

**Authentication:** Required (Admin)

**Flow:**
1. Authenticate user (must be admin)
2. Unflag conversation: Set `isFlagged = false`, clear flag fields
3. Return unflagged conversation

---

## WebSocket (Socket.io) Events

### Client → Server Events

#### Connection

**Event:** `connection`

**Authentication:** Required (JWT token in handshake)

**Description:** Client connects to Socket.io server. Authentication happens automatically via middleware.

#### Join Conversation

**Event:** `join_conversation`

**Payload:**
```json
{
  "conversationId": 1
}
```

**Flow:**
1. Verify user is a participant in the conversation
2. Join Socket.io room: `conversation:${conversationId}`
3. Emit `joined_conversation` event to client

#### Leave Conversation

**Event:** `leave_conversation`

**Payload:**
```json
{
  "conversationId": 1
}
```

**Flow:**
1. Leave Socket.io room: `conversation:${conversationId}`

#### Send Message

**Event:** `send_message`

**Payload:**
```json
{
  "conversationId": 1,
  "content": "Hello!",
  "messageType": "text",
  "replyToId": null
}
```

**Flow:**
1. Verify user is a participant
2. Create message in database
3. Emit `new_message` event to all participants in the conversation room

#### Typing Indicator

**Event:** `typing`

**Payload:**
```json
{
  "conversationId": 1,
  "isTyping": true
}
```

**Flow:**
1. If `isTyping = true`: Add user to typing list, emit `user_typing` to other participants
2. If `isTyping = false`: Remove user from typing list, emit `user_typing` to other participants
3. Auto-clear typing after 3 seconds

#### Mark Messages as Read

**Event:** `mark_read`

**Payload:**
```json
{
  "conversationId": 1,
  "messageIds": [100, 101]
}
```

**Flow:**
1. Verify user is a participant
2. Mark messages as read in database
3. Emit `messages_read` event to conversation room

#### Disconnect

**Event:** `disconnect`

**Flow:**
1. Remove user from active users map
2. Remove from typing lists
3. Broadcast user offline status

### Server → Client Events

#### New Message

**Event:** `new_message`

**Payload:**
```json
{
  "conversationId": 1,
  "message": {
    "id": 101,
    "conversationId": 1,
    "senderId": 123,
    "content": "Hello!",
    "messageType": "text",
    "createdAt": "2024-01-15T10:35:00Z"
  }
}
```

**Emitted To:** All participants in the conversation room

#### Messages Read

**Event:** `messages_read`

**Payload:**
```json
{
  "conversationId": 1,
  "userId": 456,
  "messageIds": [100, 101]
}
```

**Emitted To:** All participants in the conversation room

#### User Typing

**Event:** `user_typing`

**Payload:**
```json
{
  "conversationId": 1,
  "userId": 123,
  "isTyping": true
}
```

**Emitted To:** Other participants in the conversation room (not the typist)

#### Joined Conversation

**Event:** `joined_conversation`

**Payload:**
```json
{
  "conversationId": 1
}
```

**Emitted To:** The user who joined

#### User Status Change

**Event:** `user_status_change`

**Payload:**
```json
{
  "userId": 123,
  "status": "online",
  "timestamp": "2024-01-15T10:35:00Z"
}
```

**Emitted To:** All connected clients (they filter on their end)

#### Participants Added

**Event:** `participants_added`

**Payload:**
```json
{
  "conversationId": 2,
  "participantIds": [789, 101],
  "addedBy": 123
}
```

**Emitted To:** All participants in the conversation room

#### Participant Removed

**Event:** `participant_removed`

**Payload:**
```json
{
  "conversationId": 2,
  "participantId": 789,
  "removedBy": 123
}
```

**Emitted To:** All participants in the conversation room

#### Conversation Deleted

**Event:** `conversation_deleted`

**Payload:**
```json
{
  "conversationId": 2,
  "deletedBy": 123
}
```

**Emitted To:** All participants in the conversation room

#### Error

**Event:** `error`

**Payload:**
```json
{
  "message": "Error message"
}
```

**Emitted To:** The client that caused the error

---

## Real-Time Communication Flow

### Sending a Message

1. **Client** sends message via REST API or Socket.io
2. **Server** creates message in database
3. **Server** updates conversation timestamp
4. **Server** increments unread count for recipients
5. **Server** emits `new_message` event to conversation room
6. **All Participants** receive real-time message via Socket.io
7. **Participants** update their UI with new message

### Typing Indicator

1. **Client** starts typing → emits `typing` event with `isTyping: true`
2. **Server** adds user to typing list
3. **Server** emits `user_typing` to other participants
4. **Other Participants** see typing indicator
5. **Client** stops typing → emits `typing` event with `isTyping: false`
6. **Server** removes user from typing list
7. **Server** emits `user_typing` to other participants
8. **Other Participants** hide typing indicator

### Read Receipts

1. **Client** opens conversation → calls REST API or emits `mark_read` event
2. **Server** marks messages as read in database
3. **Server** creates read receipts
4. **Server** resets unread count
5. **Server** emits `messages_read` event to conversation room
6. **Other Participants** see read receipts in real-time

### Online/Offline Status

1. **Client** connects to Socket.io → user marked as online
2. **Server** broadcasts `user_status_change` event
3. **All Clients** receive status update
4. **Clients** update UI to show user as online
5. **Client** disconnects → user marked as offline
6. **Server** broadcasts `user_status_change` event
7. **All Clients** receive status update
8. **Clients** update UI to show user as offline

---

## Database Models

### Conversations Table

```sql
CREATE TABLE conversations (
  id SERIAL PRIMARY KEY,
  type conversation_type DEFAULT 'direct' NOT NULL,
  name TEXT,
  project_id INTEGER,
  status conversation_status DEFAULT 'active' NOT NULL,
  is_flagged BOOLEAN DEFAULT false,
  flagged_reason TEXT,
  flagged_at TIMESTAMP,
  flagged_by INTEGER,
  created_at TIMESTAMP DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP DEFAULT NOW() NOT NULL
);
```

**Conversation Types:**
- `direct`: 1-on-1 conversation
- `group`: Group conversation
- `system`: System messages
- `moderation`: Moderation conversations

**Conversation Status:**
- `active`: Active conversation
- `archived`: Archived conversation
- `deleted`: Deleted conversation

### Messages Table

```sql
CREATE TABLE messages (
  id SERIAL PRIMARY KEY,
  conversation_id INTEGER NOT NULL REFERENCES conversations(id),
  sender_id INTEGER NOT NULL REFERENCES users(id),
  content TEXT NOT NULL,
  message_type TEXT DEFAULT 'text',
  file_url TEXT,
  file_name TEXT,
  file_size INTEGER,
  reply_to_id INTEGER REFERENCES messages(id),
  status TEXT DEFAULT 'sent',
  is_deleted BOOLEAN DEFAULT false,
  deleted_at TIMESTAMP,
  is_edited BOOLEAN DEFAULT false,
  edited_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP DEFAULT NOW() NOT NULL
);
```

**Message Types:**
- `text`: Text message
- `file`: File attachment
- `image`: Image attachment
- `audio`: Audio attachment
- `system`: System message

**Message Status:**
- `sent`: Message sent
- `delivered`: Message delivered
- `read`: Message read

### Conversation Participants Table

```sql
CREATE TABLE conversation_participants (
  id SERIAL PRIMARY KEY,
  conversation_id INTEGER NOT NULL REFERENCES conversations(id),
  user_id INTEGER NOT NULL REFERENCES users(id),
  role TEXT DEFAULT 'member',
  joined_at TIMESTAMP DEFAULT NOW() NOT NULL,
  last_read_at TIMESTAMP,
  unread_count INTEGER DEFAULT 0,
  is_archived BOOLEAN DEFAULT false,
  is_favorite BOOLEAN DEFAULT false,
  is_muted BOOLEAN DEFAULT false,
  left_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP DEFAULT NOW() NOT NULL
);
```

**Participant Roles:**
- `project-owner`: Project owner (group creator)
- `developer`: Developer (in groups)
- `member`: Member (default for direct messages)

### Message Read Receipts Table

```sql
CREATE TABLE message_read_receipts (
  id SERIAL PRIMARY KEY,
  message_id INTEGER NOT NULL REFERENCES messages(id),
  user_id INTEGER NOT NULL REFERENCES users(id),
  read_at TIMESTAMP DEFAULT NOW() NOT NULL
);
```

---

## Error Handling

### Error Response Format

```json
{
  "success": false,
  "status": 400,
  "message": "Error message",
  "error": "Detailed error information"
}
```

### Common HTTP Status Codes

- **200**: Success
- **201**: Created
- **400**: Bad Request (validation errors)
- **401**: Unauthorized (authentication required)
- **403**: Forbidden (insufficient permissions)
- **404**: Not Found
- **500**: Internal Server Error

### Error Scenarios

1. **Missing Authentication**:
   - Status: 401
   - Message: "User ID is required" or "Authentication error: No token provided"
   - Occurs when: JWT token is missing or invalid

2. **Not a Participant**:
   - Status: 403
   - Message: "You are not a participant in this conversation"
   - Occurs when: User tries to access conversation they're not part of

3. **Insufficient Permissions**:
   - Status: 403
   - Message: "Only project owners can create group conversations"
   - Occurs when: User doesn't have required role

4. **Conversation Not Found**:
   - Status: 404
   - Message: "Conversation not found"
   - Occurs when: Conversation ID doesn't exist

5. **Flagged Conversation**:
   - Status: 403
   - Message: "Cannot send messages to flagged conversations"
   - Occurs when: Non-admin tries to send message to flagged conversation

### Socket.io Error Handling

Socket.io errors are emitted via the `error` event:
```javascript
socket.on("error", (error) => {
  console.error("Socket error:", error.message);
});
```

---

## Environment Variables

Required environment variables for the chat service:

```env
# Server
PORT=3004
NODE_ENV=development

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/skillbridge

# JWT
JWT_SECRET=your-jwt-secret-key

# Client URL (for CORS and Socket.io)
CLIENT_URL=http://localhost:5173

# Session
SESSION_SECRET=your-session-secret
```

---

## Testing

### Manual Testing (REST API)

```bash
# Get Conversations
curl -X GET http://localhost:3004/api/v1/chat/conversations \
  -H "Authorization: Bearer YOUR_TOKEN"

# Get or Create Direct Conversation
curl -X GET http://localhost:3004/api/v1/chat/conversations/direct/456 \
  -H "Authorization: Bearer YOUR_TOKEN"

# Create Group Conversation
curl -X POST http://localhost:3004/api/v1/chat/conversations/group \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name":"Test Group","participantIds":[456,789]}'

# Send Message
curl -X POST http://localhost:3004/api/v1/chat/messages \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"conversationId":1,"content":"Hello!"}'

# Get Messages
curl -X GET http://localhost:3004/api/v1/chat/conversations/1/messages \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Manual Testing (Socket.io)

```javascript
// Connect to Socket.io
const socket = io("http://localhost:3004", {
  auth: {
    token: "your-jwt-token"
  }
});

// Join conversation
socket.emit("join_conversation", { conversationId: 1 });

// Send message
socket.emit("send_message", {
  conversationId: 1,
  content: "Hello!",
  messageType: "text"
});

// Typing indicator
socket.emit("typing", {
  conversationId: 1,
  isTyping: true
});

// Mark as read
socket.emit("mark_read", {
  conversationId: 1,
  messageIds: [100, 101]
});

// Listen for events
socket.on("new_message", (data) => {
  console.log("New message:", data);
});

socket.on("user_typing", (data) => {
  console.log("User typing:", data);
});

socket.on("messages_read", (data) => {
  console.log("Messages read:", data);
});
```

---

## Best Practices

### 1. Conversation Types

- **Direct Messages**: Always between 2 users. Automatically created when needed.
- **Group Conversations**: Created by project-owners, can have multiple developers.

### 2. Participant Roles

- **Project Owner**: Creates groups, can add/remove participants, has full control.
- **Developer**: Can participate in groups, cannot create groups or add participants.
- **Member**: Default role for direct messages.

### 3. Message Status

- **Sent**: Message created in database
- **Delivered**: Message delivered to recipient (optional, can be skipped)
- **Read**: Message read by recipient (via read receipts)

### 4. Read Receipts

- Read receipts are created when messages are marked as read
- Unread count is reset when messages are marked as read
- Read receipts are tracked per user per message

### 5. Typing Indicators

- Typing indicators are temporary (cleared after 3 seconds)
- Only shown to other participants (not the typist)
- Cleared when user stops typing or sends message

### 6. Real-Time Updates

- Use Socket.io for real-time message delivery
- Use REST API for message history and pagination
- Combine both for best user experience

### 7. Moderation

- Only admins can flag conversations
- Flagged conversations prevent non-admins from sending messages
- Flagged conversations can be unflagged by admins

---

## Integration with Other Services

### User Service

- User authentication (JWT token validation)
- User profile data for participants
- User role verification (project-owner, developer, admin)

### Project Service

- Automatic conversation creation when applications are submitted
- Project association with conversations
- Project-based group conversations

### Notification Service

- Real-time notifications for new messages
- Notification preferences (mute, archive)
- Unread message counts

---

## Performance Considerations

### 1. Socket.io Rooms

- Use Socket.io rooms (`conversation:${conversationId}`) for efficient message delivery
- Only emit to relevant rooms, not all connected clients

### 2. Message Pagination

- Always paginate messages (default: 50 per page)
- Load older messages on scroll/request
- Don't load all messages at once

### 3. Active Users Tracking

- Track active users in memory (Map)
- Clean up on disconnect
- Use for online/offline status

### 4. Typing Indicators

- Use in-memory storage (Map) for typing indicators
- Auto-clear after timeout
- Don't persist to database

### 5. Read Receipts

- Create read receipts asynchronously
- Batch read receipt creation when possible
- Don't block message delivery for read receipts

---

## Support

For issues or questions, please contact the development team or create an issue in the repository.

---

**Last Updated:** January 2024
**Version:** 1.0.0

