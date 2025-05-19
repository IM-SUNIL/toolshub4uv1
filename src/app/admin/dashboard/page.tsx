
'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LogOut, PlusCircle, RefreshCw } from 'lucide-react';
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
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import { getAllTools as apiGetAllTools, getAllCategories as apiGetAllCategories, Tool as APITool, Category as APICategoryType } from '@/lib/data/tools';
import {
  Table,
  TableBody,
  TableCell,
  TableCaption,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from '@/components/ui/badge';

export default function AdminDashboardPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isAuthenticated, setIsAuthenticated] = React.useState(false);
  const [isAddToolDialogOpen, setIsAddToolDialogOpen] = React.useState(false);
  const [isAddCategoryDialogOpen, setIsAddCategoryDialogOpen] = React.useState(false);

  // State for dropdowns in AddToolForm
  const [categoriesForDropdown, setCategoriesForDropdown] = React.useState<{ value: string; label: string }[]>([]);
  const [isLoadingDropdownCategories, setIsLoadingDropdownCategories] = React.useState(true);

  // State for tables
  const [tools, setTools] = React.useState<APITool[]>([]);
  const [isLoadingToolsTable, setIsLoadingToolsTable] = React.useState(true);
  const [categories, setCategories] = React.useState<APICategoryType[]>([]); // For category table
  const [isLoadingCategoriesTable, setIsLoadingCategoriesTable] = React.useState(true);

  const loadInitialData = React.useCallback(async (showToastFeedback = false) => {
    setIsLoadingDropdownCategories(true);
    setIsLoadingToolsTable(true);
    setIsLoadingCategoriesTable(true);

    let categoriesFetched = false;
    let toolsFetched = false;

    try {
      const [categoriesData, toolsData] = await Promise.all([
        apiGetAllCategories(),
        apiGetAllTools()
      ]);

      if (categoriesData) {
        const formattedCategories = categoriesData.map(cat => ({
          value: cat.slug,
          label: cat.name,
        }));
        setCategoriesForDropdown(formattedCategories);
        setCategories(categoriesData);
        categoriesFetched = true;
      } else {
        setCategoriesForDropdown([]);
        setCategories([]);
        toast({ title: "Error", description: "Failed to load categories.", variant: "destructive" });
      }

      if (toolsData) {
        setTools(toolsData);
        toolsFetched = true;
      } else {
        setTools([]);
        toast({ title: "Error", description: "Failed to load tools.", variant: "destructive" });
      }

      if (showToastFeedback && (categoriesFetched || toolsFetched)) {
        toast({ title: "Data Reloaded", description: "Tools and categories have been updated." });
      }

    } catch (error: any) {
      console.error('Error loading initial data:', error);
      toast({
        title: 'Error Loading Data',
        description: error.message || 'Could not load tools or categories. Check API and console.',
        variant: 'destructive',
        duration: 10000,
      });
      setCategoriesForDropdown([]);
      setCategories([]);
      setTools([]);
    } finally {
      setIsLoadingDropdownCategories(false);
      setIsLoadingToolsTable(false);
      setIsLoadingCategoriesTable(false);
    }
  }, [toast]);

  React.useEffect(() => {
    const timer = setTimeout(() => {
        if (typeof window !== 'undefined' && sessionStorage.getItem('isAdmin') !== 'true') {
            router.replace('/admin');
        } else {
            setIsAuthenticated(true);
            loadInitialData();
        }
    }, 0);
     return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router]); // loadInitialData is stable due to useCallback

  const handleRefreshData = () => {
    loadInitialData(true);
  }

  const handleLogout = () => {
    sessionStorage.removeItem('isAdmin');
    router.push('/admin');
  };

  if (!isAuthenticated) {
    return (
       <div className="flex min-h-screen items-center justify-center bg-background">
         <Skeleton className="h-8 w-32" />
         <p className="text-muted-foreground ml-2">Verifying access...</p>
       </div>
     );
  }

  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  return (
    <div className="container mx-auto px-4 py-8 pt-[2px] max-w-7xl">
      <header className="flex flex-wrap justify-between items-center gap-4 mb-8 pt-4">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <div className="flex items-center gap-2">
         <Button
            variant="outline"
            size="icon"
            onClick={handleRefreshData}
            disabled={isLoadingDropdownCategories || isLoadingToolsTable || isLoadingCategoriesTable}
            title="Refresh All Data"
          >
             {(isLoadingDropdownCategories || isLoadingToolsTable || isLoadingCategoriesTable) ? (
                 <RefreshCw className="h-4 w-4 animate-spin" />
             ) : (
                 <RefreshCw className="h-4 w-4" />
             )}
         </Button>

          <Dialog open={isAddToolDialogOpen} onOpenChange={setIsAddToolDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <PlusCircle className="mr-2 h-4 w-4" /> Add Tool
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Add New Tool</DialogTitle>
                <DialogDescription>
                  Fill in the details for the new tool below. Click save when you're done.
                </DialogDescription>
              </DialogHeader>
               {isLoadingDropdownCategories ? (
                  <div className="p-4 text-center space-y-2">
                    <Skeleton className="h-5 w-24 mx-auto" />
                    <Skeleton className="h-9 w-full" />
                    <p className="text-muted-foreground text-sm">Loading categories for dropdown...</p>
                  </div>
               ) : categoriesForDropdown.length === 0 ? (
                  <p className="text-destructive p-4 text-center">
                      No categories found for dropdown. Please add a category first or refresh the list.
                  </p>
               ) : (
                  <AddToolForm
                     categories={categoriesForDropdown}
                     onSuccess={() => {
                        setIsAddToolDialogOpen(false);
                        loadInitialData(true); // Refresh data
                     }}
                     onClose={() => setIsAddToolDialogOpen(false)}
                  />
               )}
            </DialogContent>
          </Dialog>

          <Dialog open={isAddCategoryDialogOpen} onOpenChange={setIsAddCategoryDialogOpen}>
            <DialogTrigger asChild>
               <Button variant="outline">
                 <PlusCircle className="mr-2 h-4 w-4" /> Add Category
               </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
               <DialogHeader>
                 <DialogTitle>Add New Category</DialogTitle>
                 <DialogDescription>
                    Fill in the details for the new category. Click save when done.
                 </DialogDescription>
               </DialogHeader>
               <AddCategoryForm
                 onSuccess={() => {
                     setIsAddCategoryDialogOpen(false);
                     loadInitialData(true); // Refresh data
                 }}
                 onClose={() => setIsAddCategoryDialogOpen(false)}
               />
            </DialogContent>
          </Dialog>

          <Button variant="outline" onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" /> Logout
          </Button>
        </div>
      </header>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Welcome, Admin!</CardTitle>
          <CardDescription>Manage tools and site settings from here.</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Use the buttons above to add new tools or categories. Below you can view existing items.</p>
        </CardContent>
      </Card>

      {/* Manage Tools Section */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Manage Tools</CardTitle>
          <CardDescription>List of all tools in the database.</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoadingToolsTable ? (
            <div className="space-y-2">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          ) : tools.length > 0 ? (
            <Table>
              <TableCaption>A list of your tools.</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[200px]">Name</TableHead>
                  <TableHead>Category Slug</TableHead>
                  <TableHead>Rating</TableHead>
                  <TableHead>Free</TableHead>
                  <TableHead className="w-[300px]">Summary</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tools.map((tool) => (
                  <TableRow key={tool._id}>
                    <TableCell className="font-medium">{tool.name}</TableCell>
                    <TableCell>{tool.categorySlug}</TableCell>
                    <TableCell>{tool.rating.toFixed(1)}</TableCell>
                    <TableCell>
                      <Badge variant={tool.isFree ? "default" : "destructive"}>
                        {tool.isFree ? 'Yes' : 'No'}
                      </Badge>
                    </TableCell>
                    <TableCell>{truncateText(tool.summary, 50)}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm" disabled>Edit</Button> {/* Placeholder */}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <p className="text-center text-muted-foreground py-4">No tools found. Add one using the button above!</p>
          )}
        </CardContent>
      </Card>

      {/* Manage Categories Section */}
      <Card>
        <CardHeader>
          <CardTitle>Manage Categories</CardTitle>
          <CardDescription>List of all categories in the database.</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoadingCategoriesTable ? (
             <div className="space-y-2">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          ) : categories.length > 0 ? (
            <Table>
              <TableCaption>A list of your categories.</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[200px]">Name</TableHead>
                  <TableHead>Slug</TableHead>
                  <TableHead className="w-[300px]">Description</TableHead>
                  <TableHead>Icon Name</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {categories.map((category) => (
                  <TableRow key={category._id}>
                    <TableCell className="font-medium">{category.name}</TableCell>
                    <TableCell>{category.slug}</TableCell>
                    <TableCell>{truncateText(category.description, 50)}</TableCell>
                    <TableCell>{category.iconName}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm" disabled>Edit</Button> {/* Placeholder */}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <p className="text-center text-muted-foreground py-4">No categories found. Add one using the button above!</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
