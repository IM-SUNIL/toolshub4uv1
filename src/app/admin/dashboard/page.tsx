
'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LogOut, PlusCircle, RefreshCw } from 'lucide-react'; // Added RefreshCw
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
import { useToast } from '@/hooks/use-toast'; // Import useToast
import { Skeleton } from '@/components/ui/skeleton'; // For loading state
import { getAbsoluteUrl } from '@/lib/data/tools'; // Import getAbsoluteUrl

// Define Category type matching the API response
interface Category {
    _id: string; // MongoDB ID
    slug: string;
    name: string;
    // Add other fields if needed
}

// API Endpoint URL for fetching categories
const CATEGORIES_API_PATH = '/api/categories'; // Relative path for API

export default function AdminDashboardPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isAuthenticated, setIsAuthenticated] = React.useState(false); // Assume not authenticated initially
  const [isAddToolDialogOpen, setIsAddToolDialogOpen] = React.useState(false);
  const [isAddCategoryDialogOpen, setIsAddCategoryDialogOpen] = React.useState(false);
  const [categories, setCategories] = React.useState<{ value: string; label: string }[]>([]);
  const [isLoadingCategories, setIsLoadingCategories] = React.useState(true);


  // Fetch categories from the API
   const fetchCategories = React.useCallback(async () => {
     setIsLoadingCategories(true);
     const categoriesApiUrl = getAbsoluteUrl(CATEGORIES_API_PATH);
     console.log(`Attempting to fetch categories from: ${categoriesApiUrl}`); // Log URL
     try {
       const response = await fetch(categoriesApiUrl);
       console.log(`Fetch response status for ${categoriesApiUrl}: ${response.status}`); // Log status

       if (!response.ok) {
         const errorText = await response.text(); // Get error body
         console.error(`Failed to fetch categories. Status: ${response.status}, StatusText: ${response.statusText}, Body: ${errorText}`);
         // Improved error message for toast
         throw new Error(`Failed to fetch categories: ${response.status} ${response.statusText}. URL: ${categoriesApiUrl}. Ensure API/emulators are running and environment variables (like NEXT_PUBLIC_API_BASE_URL) are correct.`);
       }
       const data: Category[] = await response.json();
       const formattedCategories = data.map(cat => ({
         value: cat.slug, // Use slug as the value for the dropdown
         label: cat.name,
       }));
       setCategories(formattedCategories);
       console.log("Fetched categories successfully:", formattedCategories);
     } catch (error: any) {
       console.error('Error fetching categories:', error);
       toast({
         title: 'Error Fetching Categories',
         description: error.message || 'Could not load categories for the dropdown. Check API endpoint and Firebase setup.',
         variant: 'destructive',
         duration: 10000, // Longer duration for error
       });
       setCategories([]); // Set empty on error
     } finally {
       setIsLoadingCategories(false);
     }
   }, [toast]); // Add toast to dependency array

  React.useEffect(() => {
    // Check authentication status on component mount
    // Use setTimeout to ensure session check happens after potential initial redirects
    const timer = setTimeout(() => {
        if (typeof window !== 'undefined' && sessionStorage.getItem('isAdmin') !== 'true') {
            router.replace('/admin'); // Redirect to login if not authenticated
        } else {
            setIsAuthenticated(true); // User is authenticated
            fetchCategories(); // Fetch categories if authenticated
        }
    }, 0); // Execute immediately after current call stack clears

     return () => clearTimeout(timer); // Cleanup timer on unmount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router]); // Rerun effect if router changes

  const handleLogout = () => {
    sessionStorage.removeItem('isAdmin'); // Clear the session flag
    router.push('/admin'); // Redirect back to login page
  };

  // Render nothing or a loading state until authentication check is complete
  if (!isAuthenticated) {
    return (
       <div className="flex min-h-screen items-center justify-center bg-background">
         {/* Optional: Add a loading spinner here */}
         <Skeleton className="h-8 w-32" />
         <p className="text-muted-foreground ml-2">Verifying access...</p>
       </div>
     );
  }

  // Render dashboard content if authenticated
  return (
    <div className="container mx-auto px-4 py-8 pt-[2px] max-w-6xl"> {/* Use existing layout padding */}
      <header className="flex flex-wrap justify-between items-center gap-4 mb-8 pt-4"> {/* Added flex-wrap and gap */}
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <div className="flex items-center gap-2">
         {/* Refresh Categories Button */}
         <Button
            variant="outline"
            size="icon"
            onClick={fetchCategories}
            disabled={isLoadingCategories}
            title="Refresh Categories List"
          >
             {isLoadingCategories ? (
                 <RefreshCw className="h-4 w-4 animate-spin" />
             ) : (
                 <RefreshCw className="h-4 w-4" />
             )}
         </Button>

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
               {isLoadingCategories ? (
                  <div className="p-4 text-center space-y-2">
                    <Skeleton className="h-5 w-24 mx-auto" />
                    <Skeleton className="h-9 w-full" />
                    <p className="text-muted-foreground text-sm">Loading categories...</p>
                  </div>
               ) : categories.length === 0 ? (
                  <p className="text-destructive p-4 text-center">
                      No categories found. Please add a category first or refresh the list.
                  </p>
               ) : (
                  <AddToolForm
                     categories={categories} // Pass fetched categories
                     onSuccess={() => setIsAddToolDialogOpen(false)} // Close dialog on success
                     onClose={() => setIsAddToolDialogOpen(false)} // Close dialog on cancel
                  />
               )}
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
                 onSuccess={() => {
                     setIsAddCategoryDialogOpen(false);
                     // Refetch categories after adding a new one
                     fetchCategories();
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
           <p className="text-muted-foreground">Data is being fetched from and saved to MongoDB via Firebase Cloud Functions.</p>
           <p className="text-green-600 dark:text-green-400">Click the refresh icon if the categories dropdown in 'Add Tool' seems outdated.</p>
           <p className="mt-4">Future enhancements could include:</p>
           <ul className="list-disc list-inside text-muted-foreground space-y-1 mt-2">
             <li>Editing existing tools and categories via API</li>
             <li>Deleting tools and categories via API</li>
             <li>Adding authentication to API endpoints</li>
             <li>Viewing site statistics</li>
           </ul>
        </CardContent>
      </Card>

      {/* Add more admin functionalities/components below */}

    </div>
  );
}
