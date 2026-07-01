# StaffingOS Challenge Frontend

This is a modern web application built for the StaffingOS Challenge. It serves as the frontend client that connects to a backend API to handle user authentication and post management.

## Features

- **Authentication**: Secure login system with robust error handling for backend validation errors (e.g., `422 Unprocessable Entity` and `401 Unauthorized`).
- **Post Management**: Full CRUD capabilities allowing users to create, read, update, and delete their posts.
- **Interactive UI**: Includes confirmation modals for destructive actions (like deleting posts) and global toast notifications to provide immediate feedback to the user.
- **Comprehensive Testing**: Fully tested using Vitest and Vue Test Utils covering stores, services, utility functions, and Vue components.
- **Responsive Design**: Polished and mobile-friendly UI built with Tailwind CSS.

## Tech Stack

- **Framework**: [Vue 3](https://vuejs.org/) (Composition API)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **State Management**: [Pinia](https://pinia.vuejs.org/)
- **Routing**: [Vue Router](https://router.vuejs.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **HTTP Client**: [Axios](https://axios-http.com/)
- **Testing**: [Vitest](https://vitest.dev/) & [@vue/test-utils](https://test-utils.vuejs.org/)

## Project Structure

```text
src/
├── api/          # Axios instance configuration and interceptors
├── components/   # Reusable UI components (PostCard, ToastNotification, ConfirmationModal)
├── models/       # TypeScript interfaces and type definitions
├── router/       # Vue Router configuration and navigation guards
├── services/     # API interaction layer (authService, postService)
├── stores/       # Pinia stores for global state (auth, post, ui)
├── utils/        # Utility functions (e.g., API error parsing)
├── views/        # Page-level components (LoginView, HomeView)
├── App.vue       # Root application component
└── main.ts       # Application entry point
```

## Setup Instructions

### Prerequisites
- [Node.js](https://nodejs.org/) (v16 or higher recommended)
- `npm` or `yarn`

### Installation

1. Clone the repository and navigate to the project directory.
2. Install the dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the root directory based on `.env.example` (if provided), or set the API base URL directly:
   ```env
   VITE_API_URL=http://localhost:3333
   ```
   *(Ensure this points to the running backend service).*

### Running for Development

Start the Vite development server with Hot-Module Replacement (HMR):
```bash
npm run dev
```

### Building for Production

Type-check the codebase and build an optimized production bundle:
```bash
npm run build
```

## Testing

### Unit Tests
The project features a comprehensive unit test suite covering API services, Pinia stores, Vue components, and Views.

To run the unit tests in watch mode:
```bash
npm run test:unit
```

To run the unit tests a single time:
```bash
npm run test:unit -- --run
```

### API Backend Testing
A Postman collection is included in the root directory of this repository (`staffingos challenge.postman_collection.json`). You can import this file into Postman to easily test the backend API endpoints directly.
