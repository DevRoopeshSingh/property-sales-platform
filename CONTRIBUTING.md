# Contributing to PropConnect

Thank you for your interest in contributing to PropConnect! We welcome contributions to improve the platform. Please follow the guidelines below to ensure a smooth collaboration process.

## 🚀 Getting Started

1. **Fork and Clone the Repository**
   Fork the repository to your own GitHub account and then clone it to your local machine.
   ```bash
   git clone https://github.com/your-username/property-sales-platform.git
   cd property-sales-platform
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Set Up the Environment**
   Create a `.env.local` file based on the setup instructions in the `README.md`.

4. **Initialize the Database**
   ```bash
   npx prisma db push
   ```

5. **Start the Development Server**
   ```bash
   npm run dev
   ```

## 🌿 Branching Strategy

- **`main`**: Production-ready code.
- **`dev` / `staging`**: Pre-production code.
- **Feature Branches**: Branch off from `main` or `dev` using the following naming conventions:
  - `feature/short-description` (e.g., `feature/add-property-filters`)
  - `fix/short-description` (e.g., `fix/header-alignment`)
  - `docs/short-description` (e.g., `docs/update-readme`)
  - `chore/short-description` (e.g., `chore/update-dependencies`)

## 💻 Coding Standards

- **TypeScript**: We use strict TypeScript. Please ensure all new code is strongly typed and avoids the use of `any` where possible.
- **Styling**: We use **Tailwind CSS**. Prefer utility classes for styling. When creating reusable UI components, use **Radix UI** primitives for accessibility.
- **Linting & Formatting**: Ensure your code passes the linter before committing.
  ```bash
  npm run lint
  ```
- **File Naming**: 
  - React components should be PascalCase (`PropertyCard.tsx`).
  - Utility files and hooks should be camelCase (`useLocalStorage.ts`, `formatDate.ts`).
  - Next.js routing files must follow App Router conventions (`page.tsx`, `layout.tsx`).

## 💾 Database Changes

We use Prisma ORM. If you need to make changes to the database schema (`prisma/schema.prisma`):

1. Make your changes in `prisma/schema.prisma`.
2. Test them locally using `npx prisma db push`.
3. If this is a production-level change, ensure you generate a migration instead:
   ```bash
   npx prisma migrate dev --name your_migration_name
   ```
4. Commit the generated migration files.

## 📝 Commit Messages

We prefer structured commit messages. A good convention to follow is the [Conventional Commits](https://www.conventionalcommits.org/) specification:

- `feat:` for new features.
- `fix:` for bug fixes.
- `docs:` for documentation changes.
- `style:` for formatting, missing semi colons, etc.
- `refactor:` for code refactoring.
- `chore:` for updating build tasks, package manager configs, etc.

**Example**: `feat: add price range filter to property search`

## 📬 Pull Requests

1. **Keep PRs small and focused**: A PR should ideally address a single issue or add a single feature.
2. **Write a descriptive title and body**: Explain *what* was changed and *why*.
3. **Link to issues**: If your PR resolves an open issue, mention it (e.g., "Fixes #123").
4. **Review**: Once submitted, a maintainer will review your code. Be prepared to make requested changes.

Thank you for contributing!
