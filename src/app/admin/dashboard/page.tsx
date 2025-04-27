
'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LogOut } from 'lucide-react';

export default function AdminDashboardPage() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = React.useState(false); // Assume not authenticated initially

  React.useEffect(() => {
    // Check authentication status on component mount
    if (sessionStorage.getItem('isAdmin') !== 'true') {
      router.replace('/admin'); // Redirect to login if not authenticated
    } else {
      setIsAuthenticated(true); // User is authenticated
    }
  }, [router]);

  const handleLogout = () => {
    sessionStorage.removeItem('isAdmin'); // Clear the session flag
    router.push('/admin'); // Redirect back to login page
  };

  // Render nothing or a loading state until authentication check is complete
  if (!isAuthenticated) {
    return (
       <div className="flex min-h-screen items-center justify-center bg-background">
         {/* Optional: Add a loading spinner here */}
         <p className="text-muted-foreground">Verifying access...</p>
       </div>
     );
  }

  // Render dashboard content if authenticated
  return (
    <div className="container mx-auto px-4 py-8 pt-[2px] max-w-6xl"> {/* Use existing layout padding */}
      <header className="flex justify-between items-center mb-8 pt-4">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <Button variant="outline" onClick={handleLogout}>
          <LogOut className="mr-2 h-4 w-4" /> Logout
        </Button>
      </header>

      <Card>
        <CardHeader>
          <CardTitle>Welcome, Admin!</CardTitle>
          <CardDescription>Manage tools and site settings from here.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="mb-4">Dashboard content goes here.</p>
          <p>You can add sections for:</p>
          <ul className="list-disc list-inside text-muted-foreground space-y-1 mt-2">
            <li>Adding new tools</li>
            <li>Editing existing tools</li>
            <li>Managing categories</li>
            <li>Viewing site statistics (future)</li>
          </ul>
           {/* Example: Add a link or button to add a tool */}
           {/* <Button className="mt-6">Add New Tool</Button> */}
        </CardContent>
      </Card>

      {/* Add more admin functionalities/components below */}

    </div>
  );
}
