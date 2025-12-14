# 🎨 Chowk

<div align="center">

![Chowk Logo](https://via.placeholder.com/150x150/667eea/ffffff?text=C)

**A beautiful, collaborative whiteboard with powerful features**

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](http://makeapullrequest.com)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue.svg)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-14+-black.svg)](https://nextjs.org/)
[![Stars](https://img.shields.io/github/stars/justbytecode/Chowk?style=social)](https://github.com/justbytecode/Chowk)

[Demo](https://chowk.vercel.app) • [Documentation](https://docs.chowk.app) • [Report Bug](https://github.com/justbytecode/Chowk/issues) • [Request Feature](https://github.com/justbytecode/Chowk/issues)

</div>

---

## 📖 Table of Contents

- [About](#about)
- [Features](#features)
- [Demo](#demo)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Installation](#installation)
- [Configuration](#configuration)
- [Usage](#usage)
- [Contributing](#contributing)
- [Roadmap](#roadmap)
- [License](#license)
- [Acknowledgments](#acknowledgments)
- [Support](#support)

---

## 🌟 About

Chowk is an open-source, collaborative whiteboard application inspired by Excalidraw. It provides a beautiful, intuitive interface for creating diagrams, sketches, and visual notes with real-time collaboration capabilities. The name "Chowk" (चौक) means "square" or "open space" in Hindi/Urdu, representing our vision of an open canvas for creativity.

### Why Chowk?

- **🎨 Beautiful Design**: Modern, clean interface with glass-morphism effects
- **✨ Sketchy Style**: Hand-drawn feel with RoughJS integration
- **👥 Collaborative**: Real-time collaboration with teams and organizations
- **📱 Responsive**: Works seamlessly on desktop, tablet, and mobile
- **🔒 Secure**: Built-in authentication and permission management
- **🚀 Fast**: Optimized performance with Next.js 14
- **🎯 Open Source**: MIT licensed, community-driven development

---

## ✨ Features

### Core Drawing Features
- 🖊️ **Multiple Tools**: Rectangle, Circle, Line, Arrow, Freehand, Text, Image
- 🎨 **Styling Options**: Colors, stroke width, fill, opacity, roughness
- 🔄 **Undo/Redo**: Full history management
- 📐 **Selection & Transform**: Select, move, resize, rotate shapes
- 🖱️ **Pan & Zoom**: Infinite canvas with smooth navigation
- 📋 **Copy/Paste**: Duplicate elements easily

### Collaboration Features
- 👥 **Real-time Collaboration**: See cursors and changes in real-time
- 🔗 **Share Links**: Public and private sharing options
- 🏢 **Teams & Organizations**: Create workspaces for your team
- 📧 **Invite System**: Email invitations with role management
- 🔐 **Permissions**: View/Edit access control

### Export & Import
- 📥 **Export**: PNG, SVG, PDF, JSON formats
- 📤 **Import**: Load from JSON files
- 💾 **Auto-save**: Never lose your work
- ☁️ **Cloud Storage**: Save boards to database

### UI/UX Features
- 🌓 **Dark/Light Mode**: Beautiful themes for any preference
- 📱 **Mobile Optimized**: Touch-friendly interface
- ⌨️ **Keyboard Shortcuts**: Power user productivity
- 🎭 **Animations**: Smooth, delightful transitions
- 🌐 **Internationalization**: Multi-language support (coming soon)

---

## 🎬 Demo

Try it live: [chowk.vercel.app](https://chowk.vercel.app)

### Screenshots

<div align="center">

| Light Mode | Dark Mode |
|------------|-----------|
| ![Light](https://via.placeholder.com/400x300/ffffff/000000?text=Light+Mode) | ![Dark](https://via.placeholder.com/400x300/1e1e1e/ffffff?text=Dark+Mode) |

| Mobile View | Collaboration |
|-------------|---------------|
| ![Mobile](https://via.placeholder.com/400x300/667eea/ffffff?text=Mobile) | ![Collab](https://via.placeholder.com/400x300/764ba2/ffffff?text=Collaboration) |

</div>

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: [Next.js 14](https://nextjs.org/) (App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **UI Components**: Custom components with Lucide React icons
- **Canvas Rendering**: HTML5 Canvas API
- **Sketchy Style**: [RoughJS](https://roughjs.com/)

### Backend
- **API**: Next.js API Routes
- **Database**: [PostgreSQL](https://www.postgresql.org/)
- **ORM**: [Prisma](https://www.prisma.io/)
- **Authentication**: [NextAuth.js](https://next-auth.js.org/)
- **File Storage**: Base64 encoding (Images)

### Real-time (Optional)
- **WebSockets**: Custom WebSocket server
- **Alternative**: Polling-based updates

### DevOps
- **Deployment**: [Vercel](https://vercel.com/) (recommended)
- **Database Hosting**: [Neon](https://neon.tech/), [Supabase](https://supabase.com/), or [Railway](https://railway.app/)
- **CI/CD**: GitHub Actions

---

## 🚀 Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher)
- **npm** or **yarn** or **pnpm**
- **PostgreSQL** (v14 or higher)
- **Git**

### Quick Start

```bash
# Clone the repository
git clone https://github.com/justbytecode/Chowk.git

# Navigate to project directory
cd Chowk

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local

# Set up the database
npx prisma generate
npx prisma migrate dev

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📦 Installation

### Detailed Installation Steps

#### 1. Clone the Repository

```bash
git clone https://github.com/justbytecode/Chowk.git
cd Chowk
```

#### 2. Install Dependencies

Using npm:
```bash
npm install
```

Using yarn:
```bash
yarn install
```

Using pnpm:
```bash
pnpm install
```

#### 3. Set Up Environment Variables

Create a `.env.local` file in the root directory:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/chowk"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here" # Generate with: openssl rand -base64 32

# OAuth Providers
GITHUB_ID="your-github-oauth-client-id"
GITHUB_SECRET="your-github-oauth-client-secret"

GOOGLE_CLIENT_ID="your-google-oauth-client-id"
GOOGLE_CLIENT_SECRET="your-google-oauth-client-secret"

# Optional: WebSocket Server
WEBSOCKET_URL="ws://localhost:3001"
```

#### 4. Set Up Database

```bash
# Generate Prisma Client
npx prisma generate

# Run migrations
npx prisma migrate dev --name init

# (Optional) Seed database
npx prisma db seed
```

#### 5. Start Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:3000`.

---

## ⚙️ Configuration

### OAuth Setup

#### GitHub OAuth

1. Go to [GitHub Developer Settings](https://github.com/settings/developers)
2. Create a new OAuth App
3. Set Authorization callback URL: `http://localhost:3000/api/auth/callback/github`
4. Copy Client ID and Client Secret to `.env.local`

#### Google OAuth

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized redirect URI: `http://localhost:3000/api/auth/callback/google`
6. Copy Client ID and Client Secret to `.env.local`

### Database Configuration

#### Local PostgreSQL

```bash
# Install PostgreSQL
brew install postgresql  # macOS
sudo apt-get install postgresql  # Ubuntu

# Start PostgreSQL
brew services start postgresql  # macOS
sudo service postgresql start  # Ubuntu

# Create database
createdb chowk
```

#### Cloud Databases (Production)

- **Neon**: [neon.tech](https://neon.tech/) - Serverless PostgreSQL
- **Supabase**: [supabase.com](https://supabase.com/) - Open source Firebase alternative
- **Railway**: [railway.app](https://railway.app/) - Deploy PostgreSQL instantly

---

## 📚 Usage

### Basic Drawing

1. **Select a Tool**: Click on any tool in the left toolbar
2. **Draw**: Click and drag on the canvas
3. **Customize**: Change colors, stroke width, and fill
4. **Save**: Your work auto-saves or use File → Save

### Collaboration

1. **Share Board**: Click the Share button in the navbar
2. **Generate Link**: Choose public or private sharing
3. **Invite Team**: Add team members via email
4. **Collaborate**: See real-time cursors and changes

### Keyboard Shortcuts

| Action | Shortcut |
|--------|----------|
| Select Tool | `V` or `1` |
| Rectangle | `R` or `2` |
| Circle | `C` or `3` |
| Line | `L` or `4` |
| Arrow | `A` or `5` |
| Freehand | `P` or `6` |
| Text | `T` or `7` |
| Pan | `Space + Drag` or `H` |
| Undo | `Ctrl/Cmd + Z` |
| Redo | `Ctrl/Cmd + Y` |
| Delete | `Delete` or `Backspace` |
| Select All | `Ctrl/Cmd + A` |
| Save | `Ctrl/Cmd + S` |

---

## 🤝 Contributing

We love contributions! Chowk is open-source and welcomes contributions from developers of all skill levels.

### How to Contribute

1. **Fork the Repository**
   ```bash
   # Click the Fork button on GitHub
   ```

2. **Clone Your Fork**
   ```bash
   git clone https://github.com/YOUR-USERNAME/Chowk.git
   cd Chowk
   ```

3. **Create a Branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```

4. **Make Your Changes**
   - Write clean, readable code
   - Follow the existing code style
   - Add tests if applicable
   - Update documentation

5. **Commit Your Changes**
   ```bash
   git commit -m "Add: amazing new feature"
   ```

6. **Push to Your Fork**
   ```bash
   git push origin feature/amazing-feature
   ```

7. **Open a Pull Request**
   - Go to the original repository
   - Click "New Pull Request"
   - Select your branch
   - Describe your changes

### Contribution Guidelines

#### Code Style

- Use **TypeScript** for type safety
- Follow **ESLint** configuration
- Use **Prettier** for formatting
- Write **meaningful commit messages**

#### Commit Message Convention

```
Type: Brief description

Detailed description (optional)

- Add: New feature
- Fix: Bug fix
- Update: Update existing feature
- Refactor: Code refactoring
- Docs: Documentation changes
- Style: Code style changes
- Test: Test-related changes
- Chore: Build, dependencies, etc.
```

#### Pull Request Guidelines

- ✅ One feature/fix per PR
- ✅ Update documentation
- ✅ Add tests if applicable
- ✅ Ensure all tests pass
- ✅ Follow code style
- ✅ Link related issues

### Areas to Contribute

- 🐛 **Bug Fixes**: Found a bug? Fix it!
- ✨ **New Features**: Have an idea? Implement it!
- 📝 **Documentation**: Improve our docs
- 🎨 **Design**: Enhance UI/UX
- 🌐 **Translations**: Add new languages
- 🧪 **Tests**: Improve test coverage
- ♿ **Accessibility**: Make it more accessible
- 🚀 **Performance**: Optimize code

### Good First Issues

Look for issues labeled `good first issue` or `beginner-friendly` to get started!

---

## 🗺️ Roadmap

### Version 1.0 (Current)
- [x] Core drawing tools
- [x] Basic collaboration
- [x] Export functionality
- [x] Authentication
- [x] Teams & Organizations
- [x] Responsive design

### Version 1.1 (Q2 2024)
- [ ] Advanced shapes (polygon, star, etc.)
- [ ] Layer management
- [ ] Grid and snap-to-grid
- [ ] Custom templates
- [ ] Advanced text formatting
- [ ] Keyboard shortcuts customization

### Version 1.2 (Q3 2024)
- [ ] Real-time collaboration improvements
- [ ] Voice/Video chat integration
- [ ] Comments and annotations
- [ ] Version history
- [ ] Advanced permissions
- [ ] API for integrations

### Version 2.0 (Q4 2024)
- [ ] AI-powered features
- [ ] Collaborative whiteboard sessions
- [ ] Plugin system
- [ ] Mobile apps (iOS/Android)
- [ ] Desktop apps (Electron)
- [ ] Enterprise features

[View full roadmap →](https://github.com/justbytecode/Chowk/projects/1)

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

```
MIT License

Copyright (c) 2024 Chowk Contributors

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

---

## 🙏 Acknowledgments

This project wouldn't be possible without these amazing open-source projects:

- [Excalidraw](https://excalidraw.com/) - Inspiration for the UI/UX
- [RoughJS](https://roughjs.com/) - Hand-drawn sketchy style
- [Next.js](https://nextjs.org/) - React framework
- [Prisma](https://www.prisma.io/) - Database ORM
- [NextAuth.js](https://next-auth.js.org/) - Authentication
- [Tailwind CSS](https://tailwindcss.com/) - Styling
- [Lucide Icons](https://lucide.dev/) - Beautiful icons

Special thanks to all our [contributors](https://github.com/justbytecode/Chowk/graphs/contributors)!

---

## 💬 Support

### Community

- 💬 [Discord Server](https://discord.gg/chowk)
- 🐦 [Twitter](https://twitter.com/chowk_app)
- 📧 [Email](mailto:hello@justbytecode.com)

### Issues

Found a bug or have a feature request?

- [Report Bug](https://github.com/justbytecode/Chowk/issues/new?template=bug_report.md)
- [Request Feature](https://github.com/justbytecode/Chowk/issues/new?template=feature_request.md)

### FAQ

**Q: Is Chowk free?**  
A: Yes! It's completely free and open-source under MIT license.

**Q: Can I use it for commercial projects?**  
A: Absolutely! The MIT license allows commercial use.

**Q: How do I self-host?**  
A: Follow our [deployment guide](docs/deployment.md).

**Q: Does it work offline?**  
A: Currently, it requires an internet connection. Offline support is planned.

---

## 🌟 Star History

[![Star History Chart](https://api.star-history.com/svg?repos=justbytecode/Chowk&type=Date)](https://star-history.com/#justbytecode/Chowk&Date)

---

## 📊 Project Stats

![GitHub issues](https://img.shields.io/github/issues/justbytecode/Chowk)
![GitHub pull requests](https://img.shields.io/github/issues-pr/justbytecode/Chowk)
![GitHub contributors](https://img.shields.io/github/contributors/justbytecode/Chowk)
![GitHub last commit](https://img.shields.io/github/last-commit/justbytecode/Chowk)

---

<div align="center">

**Made with ❤️ by the Chowk community**

*"Chowk" (चौक) - An open space for creativity and collaboration*

If you find this project useful, please consider giving it a ⭐️!

[⬆ Back to Top](#-chowk)

</div>