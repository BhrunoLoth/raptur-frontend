import { ReactNode } from 'react';
import { useLocation } from 'wouter';
import { Button } from './ui/button';
import { useAuthStore } from '@/lib/store';

interface LayoutProps {
  children: ReactNode;
  title: string;
  showBack?: boolean;
  backTo?: string;
}

export default function Layout({ children, title, showBack = true, backTo = '/dashboard' }: LayoutProps) {
  const [, setLocation] = useLocation();
  const { logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    setLocation('/login');
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card sticky top-0 z-10">
        <div className="container flex items-center justify-between h-16">
          <div className="flex items-center gap-4">
            {showBack && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setLocation(backTo)}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </Button>
            )}
            <h1 className="text-xl md:text-2xl font-bold text-primary">{title}</h1>
          </div>
          <Button variant="outline" size="sm" onClick={handleLogout}>
            Sair
          </Button>
        </div>
      </header>
      <main className="container py-4 md:py-8">
        {children}
      </main>
    </div>
  );
}

