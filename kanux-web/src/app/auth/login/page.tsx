import { LoginPage } from '@/modules/auth/login';

export const metadata = {
  title: 'Sign in | Kánux',
  description: 'Sign in to your Kánux account and continue building skills',
};

export default function AuthLoginPage() {
  return <LoginPage />;
}
