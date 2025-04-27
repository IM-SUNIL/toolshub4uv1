
'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast'; // Using toast for error messages
import { Eye, EyeOff } from 'lucide-react'; // Import icons

// WARNING: Storing credentials and performing authentication purely on the client-side
// is inherently insecure and not recommended for production environments handling sensitive data.
// This implementation is for demonstration or very low-security scenarios only.
const ADMIN_USERNAME = 'sunil.x.rajput';
const ADMIN_PASSWORD = 'Rajput@689'; // Consider encoding/obfuscating this, though still insecure.

export default function AdminLoginPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [username, setUsername] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [showPassword, setShowPassword] = React.useState(false); // State for password visibility
  const [isLoading, setIsLoading] = React.useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = React.useState(true); // State to manage initial auth check

  // Check if already logged in on component mount
  React.useEffect(() => {
    if (sessionStorage.getItem('isAdmin') === 'true') {
      router.replace('/admin/dashboard'); // Use replace to avoid adding login to history
    } else {
      setIsCheckingAuth(false); // Finished checking, allow rendering login form
    }
  }, [router]);

  const handleLogin = (event: React.FormEvent) => {
    event.preventDefault();
    setIsLoading(true);

    // Simulate login delay (optional)
    setTimeout(() => {
      if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
        sessionStorage.setItem('isAdmin', 'true');
        router.push('/admin/dashboard'); // Redirect to dashboard on success
      } else {
        toast({
          title: 'Login Failed',
          description: 'Invalid username or password.',
          variant: 'destructive',
        });
        setIsLoading(false);
      }
      // Do not reset isLoading here if redirecting on success
    }, 500);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // Render nothing or a loading indicator while checking auth status
  if (isCheckingAuth) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        {/* Optional: Add a loading spinner here */}
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-background via-blue-950/10 to-background px-4 py-12">
      <Card className="w-full max-w-md shadow-xl border-border/20">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Admin Login</CardTitle>
          <CardDescription>Enter your credentials to access the dashboard.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="bg-input/50 focus:ring-accent"
                autoComplete="username"
              />
            </div>
            <div className="space-y-2 relative"> {/* Added relative positioning */}
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'} // Toggle input type
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="bg-input/50 focus:ring-accent pr-10" // Added padding-right for icon
                autoComplete="current-password"
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-2 top-2/3 transform -translate-y-1/2 h-7 w-7 text-muted-foreground hover:text-foreground" // Position icon
                onClick={togglePasswordVisibility}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Logging in...' : 'Login'}
            </Button>
          </form>
          <p className="mt-6 text-center text-xs text-muted-foreground">
             Note: This login uses client-side validation for demonstration purposes.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
