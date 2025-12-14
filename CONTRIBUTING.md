# Contributing to Chowk

First off, thank you for considering contributing to Chowk! 🎉

It's people like you that make Chowk such a great tool. We welcome contributions from everyone, whether it's a bug report, feature suggestion, documentation improvement, or code contribution.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [How Can I Contribute?](#how-can-i-contribute)
- [Development Setup](#development-setup)
- [Pull Request Process](#pull-request-process)
- [Style Guidelines](#style-guidelines)
- [Community](#community)

## Code of Conduct

This project and everyone participating in it is governed by our Code of Conduct. By participating, you are expected to uphold this code. Please report unacceptable behavior to [hello@justbytecode.com](mailto:hello@justbytecode.com).

### Our Pledge

We pledge to make participation in our project a harassment-free experience for everyone, regardless of age, body size, disability, ethnicity, gender identity, level of experience, nationality, personal appearance, race, religion, or sexual identity and orientation.

### Our Standards

**Positive behavior includes:**
- Using welcoming and inclusive language
- Being respectful of differing viewpoints
- Gracefully accepting constructive criticism
- Focusing on what is best for the community
- Showing empathy towards others

**Unacceptable behavior includes:**
- Harassment, trolling, or discriminatory comments
- Publishing others' private information
- Any conduct that could be considered inappropriate

## How Can I Contribute?

### 🐛 Reporting Bugs

Before creating bug reports, please check existing issues to avoid duplicates. When creating a bug report, include:

- **Clear title and description**
- **Steps to reproduce** the behavior
- **Expected behavior** vs actual behavior
- **Screenshots** if applicable
- **Environment details** (OS, browser, version)

**Use our bug report template:**

```markdown
**Describe the bug**
A clear description of what the bug is.

**To Reproduce**
Steps to reproduce:
1. Go to '...'
2. Click on '...'
3. See error

**Expected behavior**
What you expected to happen.

**Screenshots**
Add screenshots if applicable.

**Environment:**
- OS: [e.g., macOS 13.0]
- Browser: [e.g., Chrome 120]
- Version: [e.g., 1.0.0]
```

### 💡 Suggesting Features

Feature suggestions are welcome! Please provide:

- **Clear use case** - Why is this feature needed?
- **Detailed description** - How should it work?
- **Mockups/Examples** - Visual aids if possible
- **Alternative solutions** - What alternatives have you considered?

### 📝 Improving Documentation

Documentation improvements are always appreciated! This includes:

- README updates
- Code comments
- API documentation
- Tutorials and guides
- Fixing typos

### 💻 Code Contributions

#### Good First Issues

Look for issues labeled:
- `good first issue` - Perfect for newcomers
- `beginner-friendly` - Easy to tackle
- `help wanted` - We need your help!
- `documentation` - Non-code contributions

## Development Setup

### Prerequisites

```bash
Node.js >= 18.0.0
npm >= 9.0.0
PostgreSQL >= 14.0
Git
```

### Fork and Clone

```bash
# Fork the repo on GitHub, then:
git clone https://github.com/YOUR-USERNAME/Chowk.git
cd Chowk

# Add upstream remote
git remote add upstream https://github.com/justbytecode/Chowk.git
```

### Install Dependencies

```bash
npm install
```

### Environment Setup

```bash
# Copy environment template
cp .env.example .env.local

# Edit .env.local with your configuration
# See README.md for details
```

### Database Setup

```bash
# Generate Prisma client
npx prisma generate

# Run migrations
npx prisma migrate dev

# (Optional) Seed data
npx prisma db seed
```

### Start Development

```bash
npm run dev
```

Visit `http://localhost:3000`

### Project Structure

```
Chowk/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   ├── board/             # Board pages
│   └── page.tsx           # Home page
├── components/            # React components
│   ├── Canvas/           # Canvas-related components
│   ├── Tools/            # Tool components
│   ├── Shapes/           # Shape components
│   └── Auth/             # Authentication components
├── engine/               # Core drawing engine
│   ├── Scene.ts         # Scene management
│   ├── Viewport.ts      # Viewport/Camera
│   ├── History.ts       # Undo/Redo
│   └── HitTest.ts       # Collision detection
├── lib/                  # Utilities
│   ├── prisma.ts        # Prisma client
│   ├── auth.ts          # Auth configuration
│   ├── theme.ts         # Theme system
│   └── export.ts        # Export utilities
├── prisma/              # Database schema
│   └── schema.prisma
├── public/              # Static assets
└── styles/              # Global styles
```

## Pull Request Process

### Before Submitting

1. ✅ **Test your changes** thoroughly
2. ✅ **Update documentation** if needed
3. ✅ **Follow code style** guidelines
4. ✅ **Write meaningful commits**
5. ✅ **Rebase on latest main**

### Submitting PR

```bash
# Create a feature branch
git checkout -b feature/amazing-feature

# Make your changes
git add .
git commit -m "Add: amazing feature"

# Push to your fork
git push origin feature/amazing-feature

# Open PR on GitHub
```

### PR Checklist

- [ ] Branch is up-to-date with main
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Comments added for complex code
- [ ] Documentation updated
- [ ] No new warnings
- [ ] Tests added/updated
- [ ] All tests passing
- [ ] Linked related issues

### PR Title Format

```
Type: Brief description

Examples:
Add: Real-time cursor tracking
Fix: Selection box not rendering correctly
Update: Improve export performance
Refactor: Simplify canvas rendering logic
Docs: Add contribution guidelines
```

### PR Description Template

```markdown
## Description
Brief description of changes.

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## How Has This Been Tested?
Describe tests performed.

## Screenshots (if applicable)
Add screenshots here.

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-reviewed
- [ ] Commented complex code
- [ ] Updated documentation
- [ ] No new warnings
- [ ] Added tests
- [ ] Tests pass
```

## Style Guidelines

### TypeScript/JavaScript

```typescript
// ✅ Good
interface UserProps {
  name: string;
  email: string;
}

export function UserCard({ name, email }: UserProps) {
  return (
    <div className="user-card">
      <h2>{name}</h2>
      <p>{email}</p>
    </div>
  );
}

// ❌ Bad
function UserCard(props: any) {
  return <div><h2>{props.name}</h2></div>;
}
```

### Code Style Rules

- Use **TypeScript** for type safety
- Use **functional components** with hooks
- Use **meaningful variable names**
- Keep functions **small and focused**
- Add **comments** for complex logic
- Use **async/await** over promises
- Handle **errors** properly
- Write **self-documenting code**

### Naming Conventions

```typescript
// Components: PascalCase
export function ToolButton() {}

// Functions: camelCase
function handleClick() {}

// Constants: UPPER_SNAKE_CASE
const MAX_CANVAS_SIZE = 5000;

// Types/Interfaces: PascalCase
interface ShapeData {}
type ToolType = 'select' | 'rectangle';

// Files: kebab-case
// tool-button.tsx
// user-settings.ts
```

### File Organization

```typescript
// 1. Imports - grouped
import React from 'react';
import { NextPage } from 'next';

import { Button } from '@/components/ui';
import { useAuth } from '@/hooks';

import { formatDate } from '@/lib/utils';
import type { User } from '@/types';

// 2. Types/Interfaces
interface PageProps {
  user: User;
}

// 3. Component
export function UserPage({ user }: PageProps) {
  // Hooks
  const { logout } = useAuth();
  
  // Handlers
  const handleLogout = () => {
    logout();
  };
  
  // Render
  return (
    <div>
      <h1>{user.name}</h1>
      <Button onClick={handleLogout}>Logout</Button>
    </div>
  );
}
```

### Git Commit Messages

```bash
# Format
Type: Brief description (50 chars max)

Detailed explanation if needed (wrap at 72 chars)

# Types
Add:      New feature
Fix:      Bug fix
Update:   Update existing feature
Refactor: Code refactoring
Docs:     Documentation
Style:    Formatting, missing semi-colons, etc.
Test:     Adding tests
Chore:    Updating build tasks, package manager configs, etc.

# Examples
Add: Real-time collaboration cursor tracking

Fix: Selection box rendering on high-DPI displays

Update: Improve canvas rendering performance by 40%

Refactor: Extract shape rendering into separate module
- Split RoughRenderer into smaller classes
- Improve testability
- Reduce complexity

Docs: Add API documentation for Scene class

Style: Format code with Prettier

Test: Add unit tests for History class

Chore: Update dependencies to latest versions
```

### Testing Guidelines

```typescript
// Use Jest and React Testing Library
import { render, screen, fireEvent } from '@testing-library/react';
import { ToolButton } from './ToolButton';

describe('ToolButton', () => {
  it('should render correctly', () => {
    render(<ToolButton tool="rectangle" />);
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('should call onClick when clicked', () => {
    const handleClick = jest.fn();
    render(<ToolButton tool="rectangle" onClick={handleClick} />);
    
    fireEvent.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
```

## Community

### Communication Channels

- 💬 **Discord**: [Join our server](https://discord.gg/chowk)
- 🐦 **Twitter**: [@chowk_app](https://twitter.com/chowk_app)
- 📧 **Email**: [hello@justbytecode.com](mailto:hello@justbytecode.com)

### Getting Help

- Check [existing issues](https://github.com/justbytecode/Chowk/issues)
- Ask in [Discord #help channel](https://discord.gg/chowk)
- Read the [documentation](https://docs.chowk.app)

### Recognition

Contributors are recognized in:
- README.md contributors section
- Release notes
- Project website
- Annual contributor spotlight

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

## Thank You! 🙏

Your contributions make Chowk better for everyone. We appreciate your time and effort!

**Happy coding!** 🚀