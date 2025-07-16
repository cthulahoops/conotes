# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a React + TypeScript + Vite application using Convex as the backend. The project is a simple messaging/notes application with real-time capabilities.

## Development Commands

### Start Development
```bash
npm run dev
```
This runs both frontend and backend in parallel. The frontend will open automatically in your browser.

### Build for Production
```bash
npm run build
```
Compiles TypeScript and builds the Vite app for production.

### Linting
```bash
npm run lint
```
Runs ESLint on the codebase.

### Preview Production Build
```bash
npm run preview
```
Serves the production build locally for testing.

## Architecture

### Frontend Structure
- **src/main.tsx**: Entry point that sets up React root and Convex provider
- **src/App.tsx**: Main application component with message display and form
- **src/App.css**: Main application styles
- **src/index.css**: Global styles

### Backend Structure (Convex)
- **convex/notes.ts**: Contains database operations:
  - `sendMessage`: Mutation to insert new messages
  - `getMessages`: Query to retrieve all messages
- **convex/_generated/**: Auto-generated API types and client code
- **convex/tsconfig.json**: TypeScript config for Convex functions

### Key Dependencies
- **React 19**: Frontend framework
- **Convex**: Real-time backend with automatic code generation
- **Vite**: Build tool and dev server
- **TypeScript**: Type safety throughout the stack

## Database Schema

The app uses a simple "messages" table with fields:
- `user`: String (currently hardcoded to "adam")
- `body`: String message content

Note: No formal schema file exists - Convex is running in permissive mode (see convex/_generated/dataModel.d.ts:15-23).

## Environment Setup

Requires `VITE_CONVEX_URL` environment variable for Convex backend connection.

## Development Workflow

1. Run `npm run dev` to start both frontend and backend
2. Convex will automatically sync schema changes and regenerate types
3. Frontend hot-reloads on changes
4. Backend functions are deployed automatically during development

## Testing

No test framework is currently configured in this project.

## Code Organization Principles

- Place helper functions below exported functions.

## Coding Guidelines

- Use function syntax not const ... = () =>

## Development Precautions

- Never run the development server yourself.