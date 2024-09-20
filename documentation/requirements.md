# Starter Template Requirements

## 1. Technology Stack

### Backend

- TypeScript
- Express.js
- PostgreSQL
- RESTful API patterns
- Swagger for API documentation
- ORM: Prisma or Drizzle (choose based on ease of use)

### Frontend

- React
- shadcn/ui component library
- Tailwind CSS
- Responsive, mobile-first design

### Project Structure

- NX for monorepo management

### Not Used

- Redis (explicitly excluded)

## 2. Code Organization

- Separate:
  - Interfaces
  - DTOs (Data Transfer Objects)
  - Shared utils (UI/API)
  - API features, middlewares, helpers, ORM-specific code
  - UI features, context, components, data-access, helpers

## 3. Core Features

### Database

- [ ] Implement database migrations system

### Authentication & Authorization

- [ ] Session-based authentication
- [ ] API key authentication
- [ ] User impersonation (log in as user)
- [ ] Implement role-based access control

### Audit & Logging

- [ ] Create an audit log system for all site actions

### File Management

- [ ] Implement S3 integration for file storage
- [ ] Single file upload functionality
- [ ] Multi-file upload functionality
- [ ] Large file upload handling

### Admin Experience

- [ ] Implement admin CMS (consider AdminJS)

### Internationalization

- [ ] Implement i18n support

### Asynchronous Processing

- [ ] Implement job queues using PostgreSQL

### Real-time Communication

- [ ] Implement WebSocket support for live updates
- [ ] Create WebRTC handshake server

### Messaging & Notifications

- [ ] Develop internal messaging feature
- [ ] Implement email sending functionality

### Integration

- [ ] Create system for exposing and managing webhooks

## 4. Development Practices

- [ ] Establish code linting and formatting standards
- [ ] Implement comprehensive unit testing
- [ ] Set up continuous integration and deployment pipelines
- [ ] Create documentation for codebase and API

## 5. Scalability & Performance Considerations

- [ ] Implement caching strategies (without Redis)
- [ ] Design for horizontal scalability
- [ ] Optimize database queries and indexing
- [ ] Implement rate limiting for API endpoints

## 6. Security Measures

- [ ] Implement HTTPS
- [ ] Set up CORS policies
- [ ] Implement input validation and sanitization
- [ ] Set up secure session management
- [ ] Implement protection against common web vulnerabilities (XSS, CSRF, etc.)

## 7. Monitoring & Observability

- [ ] Set up application performance monitoring
- [ ] Implement structured logging
- [ ] Create health check endpoints

## 8. AI Integration Considerations

- [ ] Design code structure to be easily parseable by LLMs
- [ ] Create clear documentation for AI-assisted development workflows
- [ ] Implement prompts or comments in code to guide AI in future iterations

## 9. Extensibility

- [ ] Design plugin architecture for easy feature additions
- [ ] Create guidelines for adding new libraries and features to the monorepo

This template aims to provide a solid foundation for rapid iteration with AI assistance while adhering to best practices for scalability and maintainability.
