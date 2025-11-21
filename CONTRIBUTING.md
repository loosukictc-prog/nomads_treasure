# Contributing to Nomad Treasures

Thank you for your interest in contributing! We're excited to work with you to improve the Nomad Treasures platform.

## 📋 Code of Conduct

By participating in this project, you agree to abide by our Code of Conduct:

- Be respectful and inclusive
- Welcome diverse perspectives
- Focus on constructive feedback
- Report unacceptable behavior to project maintainers

## 🚀 Getting Started

### 1. Fork and Clone

```bash
# Fork the repository on GitHub
# Then clone your fork
git clone https://github.com/YOUR-USERNAME/nomad-treasures.git
cd nomad-treasures

# Add upstream remote
git remote add upstream https://github.com/ORIGINAL-OWNER/nomad-treasures.git
```

### 2. Create a Branch

```bash
git checkout -b feature/your-feature-name
# or
git checkout -b bugfix/issue-description
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Make Your Changes

- Write clean, readable code
- Follow existing code style
- Add comments for complex logic
- Update relevant documentation

### 5. Test Your Changes

```bash
npm run dev          # Test in development
npm run test         # Run tests
npm run typecheck    # Verify TypeScript
npm run build        # Build for production
```

### 6. Commit and Push

```bash
# Format code first
npm run format.fix

# Commit with clear message
git commit -m "feat: add new feature" -m "Detailed description of changes"

# Push to your fork
git push origin feature/your-feature-name
```

### 7. Create a Pull Request

- Go to the original repository
- Click "New Pull Request"
- Select your branch
- Fill in the PR template with:
  - Description of changes
  - Related issues
  - Testing steps
  - Screenshots (if applicable)

## 💡 Types of Contributions

### Bug Reports

If you find a bug:

1. **Check existing issues** - Avoid duplicates
2. **Use a clear title** - Describe the bug concisely
3. **Include details:**
   - Steps to reproduce
   - Expected behavior
   - Actual behavior
   - Environment (OS, Node version, etc.)
   - Error messages/logs
4. **Add labels** - Use the "bug" label

### Feature Requests

For new features:

1. **Use a descriptive title**
2. **Explain the problem** - What issue does this solve?
3. **Describe the solution** - How should it work?
4. **Consider alternatives** - Any other approaches?
5. **Use the "enhancement" label**

### Documentation

Help improve docs:

- Fix typos and grammar
- Clarify unclear sections
- Add examples
- Update outdated information
- Add API documentation

## 🎯 Development Guidelines

### Code Style

#### TypeScript

```typescript
// Use explicit types
const users: User[] = [];

// Avoid 'any'
function processUser(user: User): void {
  // Clear implementation
}

// Use modern syntax
const [items, setItems] = useState<Item[]>([]);

// Comments for complex logic
// Generate secure token with 24-hour expiry
const token = crypto.randomBytes(32).toString('hex');
const expiresAt = Date.now() + 24 * 60 * 60 * 1000;
```

#### React Components

```typescript
// Functional components with TypeScript
interface Props {
  title: string;
  onClose: () => void;
  children?: React.ReactNode;
}

export function Modal({ title, onClose, children }: Props) {
  return (
    <div className="modal">
      <h1 className="text-2xl font-bold">{title}</h1>
      {children}
      <button onClick={onClose}>Close</button>
    </div>
  );
}
```

#### TailwindCSS

```typescript
// Use utility classes
className="flex items-center justify-between gap-4 p-4 bg-white rounded-lg shadow-md"

// Use cn() for conditional classes
className={cn(
  "base-classes",
  isActive && "active-classes",
  isDisabled && "disabled-classes"
)}

// Avoid inline styles
// ❌ style={{ color: 'red' }}
// ✅ className="text-red-500"
```

### Commit Messages

Follow conventional commits:

```
<type>(<scope>): <subject>

<body>

<footer>
```

**Types:** `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`

**Examples:**

```
feat(admin): add product filtering by category

fix(auth): resolve JWT token expiration issue

docs(readme): add deployment instructions

refactor(api): simplify order processing logic
```

### Branch Naming

- `feature/feature-name` - New features
- `bugfix/issue-description` - Bug fixes
- `docs/what-to-document` - Documentation
- `refactor/what-to-refactor` - Refactoring

## 📋 Pull Request Process

1. **Keep PRs focused** - One feature per PR
2. **Write clear descriptions** - Explain your changes
3. **Reference issues** - Use `Closes #123`
4. **Keep commits clean** - Rebase if needed
5. **Request review** - Ask maintainers for feedback
6. **Address feedback** - Make requested changes
7. **Wait for approval** - PR must be approved before merging

### PR Template

```markdown
## Description
Brief description of changes

## Related Issues
Closes #(issue number)

## Changes
- Change 1
- Change 2
- Change 3

## Testing
How to test these changes:
1. Step 1
2. Step 2

## Screenshots (if applicable)
Add screenshots for UI changes

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Comments added for complex logic
- [ ] Documentation updated
- [ ] Tests added/updated
- [ ] No breaking changes (or documented)
```

## 🧪 Testing

### Run Tests

```bash
npm test
```

### Write Tests

Create tests alongside your code:

```typescript
// components/Button.spec.tsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Button from './Button';

describe('Button Component', () => {
  it('renders button with text', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('calls onClick handler', () => {
    const onClick = vi.fn();
    render(<Button onClick={onClick}>Click</Button>);
    screen.getByText('Click').click();
    expect(onClick).toHaveBeenCalled();
  });
});
```

### Coverage

Aim for at least 80% code coverage for critical features.

## 📚 Documentation

### Code Comments

```typescript
// Good: Explains why, not what
// Tokens expire after 24 hours for security
const expiresAt = Date.now() + 24 * 60 * 60 * 1000;

// Avoid: Obvious comments
// Set user to null
user = null;
```

### API Documentation

Document endpoints:

```typescript
/**
 * Updates an order status
 * @param orderId - The ID of the order to update
 * @param status - New status: pending, processing, completed, cancelled
 * @returns Updated order object
 * @throws Error if order not found
 */
export const updateOrder = (orderId: number, status: string) => {
  // Implementation
};
```

## 🔐 Security Considerations

### Never Commit
- Passwords or API keys
- Environment variables with secrets
- Private keys or tokens
- Database credentials

### Security Best Practices

- Validate all user input
- Use environment variables for secrets
- Hash passwords properly
- Sanitize data before rendering
- Use HTTPS in production
- Keep dependencies updated

## 📦 Dependency Management

### Adding Dependencies

```bash
npm install package-name
```

### Important Notes

- Minimize dependencies
- Prefer well-maintained packages
- Check for security vulnerabilities: `npm audit`
- Document why dependencies are needed

### Updating Dependencies

```bash
npm update
npm audit fix
```

## 🆘 Getting Help

- **Discord**: Join our community (if available)
- **Issues**: Ask questions in issue discussions
- **Docs**: Check [README.md](README.md)
- **Maintainers**: Mention @maintainer-name for help

## 📞 Reporting Security Issues

⚠️ **Do not** create public issues for security vulnerabilities.

Email security concerns to: security@nomadtreasures.com

## ✅ Checklist Before Submitting

- [ ] Code is clean and readable
- [ ] TypeScript types are correct
- [ ] No console.log() or debug code
- [ ] Tests pass: `npm test`
- [ ] Types check: `npm run typecheck`
- [ ] Builds successfully: `npm run build`
- [ ] Code is formatted: `npm run format.fix`
- [ ] PR description is clear
- [ ] Related issues are referenced

## 🎓 Learning Resources

- [Git Workflow](https://guides.github.com/introduction/flow/)
- [How to Write Good Commit Messages](https://cbea.ms/git-commit/)
- [TypeScript Best Practices](https://www.typescriptlang.org/docs/handbook/)
- [React Best Practices](https://react.dev/learn)

## 🙏 Thank You!

Your contributions make Nomad Treasures better for everyone. We appreciate your time and effort!

---

Happy coding! 🚀
