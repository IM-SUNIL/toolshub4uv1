
'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LogOut, PlusCircle } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import AddToolForm from '@/components/admin/add-tool-form';
import AddCategoryForm from '@/components/admin/add-category-form';
import categoriesData from '@/lib/data/categories.json'; // Import categories JSON

export default function AdminDashboardPage() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = React.useState(false); // Assume not authenticated initially
  const [isAddToolDialogOpen, setIsAddToolDialogOpen] = React.useState(false);
  const [isAddCategoryDialogOpen, setIsAddCategoryDialogOpen] = React.useState(false);

  // Map categories from JSON for the dropdown
  const categoriesForDropdown = categoriesData.map(cat => ({
    value: cat.slug,
    label: cat.name,
  }));

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
      <header className="flex flex-wrap justify-between items-center gap-4 mb-8 pt-4"> {/* Added flex-wrap and gap */}
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <div className="flex items-center gap-2">
          {/* Add Tool Dialog */}
          <Dialog open={isAddToolDialogOpen} onOpenChange={setIsAddToolDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <PlusCircle className="mr-2 h-4 w-4" /> Add Tool
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]"> {/* Adjust width as needed */}
              <DialogHeader>
                <DialogTitle>Add New Tool</DialogTitle>
                <DialogDescription>
                  Fill in the details for the new tool below. Click save when you're done.
                </DialogDescription>
              </DialogHeader>
              <AddToolForm
                categories={categoriesForDropdown} // Pass fetched categories
                onSuccess={() => setIsAddToolDialogOpen(false)} // Close dialog on success
                onClose={() => setIsAddToolDialogOpen(false)} // Close dialog on cancel
               />
            </DialogContent>
          </Dialog>

           {/* Add Category Dialog */}
          <Dialog open={isAddCategoryDialogOpen} onOpenChange={setIsAddCategoryDialogOpen}>
            <DialogTrigger asChild>
               <Button variant="outline">
                 <PlusCircle className="mr-2 h-4 w-4" /> Add Category
               </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]"> {/* Adjust width as needed */}
               <DialogHeader>
                 <DialogTitle>Add New Category</DialogTitle>
                 <DialogDescription>
                    Fill in the details for the new category. Click save when done.
                 </DialogDescription>
               </DialogHeader>
               <AddCategoryForm
                 // In a real app, you'd refetch categories or update state here
                 onSuccess={() => {
                     setIsAddCategoryDialogOpen(false);
                     // Potentially trigger a refetch of categories for the Add Tool form dropdown
                     // For now, simply closing the dialog.
                     // You might need state management or context to update categories globally.
                 }}
                 onClose={() => setIsAddCategoryDialogOpen(false)} // Close dialog on cancel
               />
            </DialogContent>
          </Dialog>

           {/* Logout Button */}
          <Button variant="outline" onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" /> Logout
          </Button>
        </div>
      </header>

      <Card>
        <CardHeader>
          <CardTitle>Welcome, Admin!</CardTitle>
          <CardDescription>Manage tools and site settings from here.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="mb-4">Use the buttons above to add new tools or categories.</p>
           <p className="text-muted-foreground">Note: Currently, adding data saves locally. Implement backend/API calls to persist data (e.g., to Firebase Firestore or a server endpoint).</p>
           <p>Future enhancements could include:</p>
           <ul className="list-disc list-inside text-muted-foreground space-y-1 mt-2">
             <li>Saving data to a database (like Firebase)</li>
             <li>Editing existing tools and categories</li>
             <li>Deleting tools and categories</li>
             <li>Viewing site statistics</li>
           </ul>
        </CardContent>
      </Card>

      {/* Add more admin functionalities/components below */}

    </div>
  );
}
