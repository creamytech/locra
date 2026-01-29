import { Metadata } from 'next';
import LoginPageClient from './LoginPageClient';

export const metadata: Metadata = {
  title: 'Sign In',
  description: 'Sign in to your LOCRA Travel Club account to access your passport, rewards, and exclusive member benefits.',
};

export default function LoginPage() {
  return <LoginPageClient />;
}
