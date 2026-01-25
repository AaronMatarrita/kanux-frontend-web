# Login Module

## Overview
The Login module provides a complete authentication interface for users to sign in to their Kánux accounts. It includes form validation, error handling, and integration with the authentication service.

## Directory Structure

```
modules/auth/login/
├── components/          # Reusable login components
│   ├── EmailInput.tsx  # Email field component
│   ├── PasswordInput.tsx # Password field component
│   ├── LoginForm.tsx   # Complete login form component
│   └── index.ts        # Component exports
├── pages/              # Page-level components
│   ├── LoginPage.tsx   # Main login page
│   └── index.ts        # Page exports
├── styles/             # Module-scoped styles
│   └── login.module.css # Login UI styles
├── types/              # TypeScript type definitions
│   └── index.ts        # Type exports
└── index.ts            # Module entry point
```

## Features

### ✅ Implemented
- Email input field with validation
- Password input field with show/hide toggle
- Form validation (email format, password length)
- Error messages for each field
- Submit button with loading state
- "Forgot password?" link
- "Don't have an account? Sign up" link
- Remember me checkbox
- Responsive design
- Accessibility features (ARIA labels, proper form structure)
- Clean, modern UI matching Kánux branding

### Components

#### LoginForm
Main form component that handles the complete login flow.

```tsx
import { LoginForm } from '@/modules/auth/login';

<LoginForm
  onSubmit={(data) => handleLogin(data)}
  isLoading={false}
  submitError={error}
/>
```

#### EmailInput
Standalone email input field component.

```tsx
import { EmailInput } from '@/modules/auth/login';

<EmailInput
  value={email}
  error={emailError}
  onChange={setEmail}
  disabled={isLoading}
/>
```

#### PasswordInput
Standalone password input field with show/hide toggle.

```tsx
import { PasswordInput } from '@/modules/auth/login';

<PasswordInput
  value={password}
  error={passwordError}
  onChange={setPassword}
  disabled={isLoading}
/>
```

#### LoginPage
Complete page component ready to use in Next.js routing.

```tsx
// In app/auth/login/page.tsx
import { LoginPage } from '@/modules/auth/login';

export default LoginPage;
```

## Specifications Met

✅ **As a user I want to sign in to access my account**

- Email field
- Password field
- Login button
- "Don't have an account? Sign up" link
- Forgot password link
- Remember me option
- Form validation
- Error handling
- Loading state
- Responsive design

## Form Validation

### Email
- Required field
- Must be valid email format (xxx@xxx.xxx)

### Password
- Required field
- Minimum 6 characters

## Styling

The module uses CSS modules for scoped styling with a clean, modern design featuring:
- Kánux brand colors and gradients
- Responsive design (mobile-friendly)
- Smooth transitions and hover effects
- Accessible form controls
- Error states and loading indicators

## Integration with Auth Service

The `LoginPage` component includes TODO comments for integrating with the auth service:

```tsx
// TODO: Implement actual login service call
import { authService } from '@/services';
const response = await authService.login(data);

// TODO: Store token in localStorage/sessionStorage
localStorage.setItem('authToken', response.token);
```

Reference the `authService.login()` method from `@/services/auth.service.ts` for implementation details.

## Types

```typescript
interface LoginFormData {
  email: string;
  password: string;
}

interface LoginFormErrors {
  email?: string;
  password?: string;
  submit?: string;
}
```

## Future Enhancements

- [ ] Social login (Google, GitHub, etc.)
- [ ] Two-factor authentication
- [ ] Session management
- [ ] Password strength indicator
- [ ] Email verification
- [ ] Rate limiting
- [ ] Security captcha integration
