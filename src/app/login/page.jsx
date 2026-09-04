import { Suspense } from 'react';
import LoginForm from '@/components/LoginForm';

export const dynamic = 'force-dynamic';

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-[85vh] flex items-center justify-center text-sm font-medium text-slate-500">Loading...</div>}>
      <LoginForm />
    </Suspense>
  );
}