import { useEffect } from "react";
import { useLocation } from "wouter";
import { useAuthStore } from "@/lib/store";
import { Button } from "@/components/ui/button";

/**
 * All content in this page are only for example, delete if unneeded
 * When building pages, remember your instructions in Frontend Best Practices, Design Guide and Common Pitfalls
 */
export default function Home() {
  const [, setLocation] = useLocation();
  const { isAuthenticated } = useAuthStore();

  useEffect(() => {
    if (isAuthenticated) {
      setLocation('/dashboard');
    } else {
      setLocation('/login');
    }
  }, [isAuthenticated]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
        <p className="mt-4 text-muted-foreground">Carregando...</p>
      </div>
    </div>
  );
}
