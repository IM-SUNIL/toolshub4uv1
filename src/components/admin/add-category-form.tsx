
'use client';

import * as React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
// Import Select components if needed for Parent Category
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Zap, FileText, Scissors, Video, Code } from 'lucide-react'; // Import icons

// Helper function to generate a simple slug
const generateSlug = (name: string) => {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-') // Replace non-alphanumeric with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single
    .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
};

// Map icon names to components for easier lookup
const iconMap: { [key: string]: React.ElementType } = {
    Zap,
    FileText,
    Scissors,
    Video,
    Code,
    // Add more icons here as needed, matching the key in Zod schema
};

// Define Zod schema for validation
const categoryFormSchema = z.object({
  categoryName: z.string().min(2, { message: 'Category name must be at least 2 characters.' }),
  description: z.string().min(10, { message: 'Description must be at least 10 characters.' }).max(200, { message: 'Description cannot exceed 200 characters.' }),
  imageUrl: z.string().url({ message: 'Please enter a valid image URL.' }).optional().or(z.literal('')), // Optional image URL
  // Ensure iconName is required and uses the keys from iconMap
  iconName: z.enum(Object.keys(iconMap) as [keyof typeof iconMap, ...(keyof typeof iconMap)[]], {
     required_error: 'Please select an icon.',
     invalid_type_error: 'Invalid icon selected.'
   }),
  tags: z.string().optional().or(z.literal('')), // Optional tags as comma-separated string
});

type CategoryFormValues = z.infer<typeof categoryFormSchema>;

interface AddCategoryFormProps {
  onSuccess: () => void; // Callback on successful submission
  onClose: () => void; // Callback to close the dialog/form
}

// TODO: Replace with your actual Firebase Cloud Function URL for categories
const CATEGORY_CLOUD_FUNCTION_URL = 'YOUR_CATEGORY_CLOUD_FUNCTION_ENDPOINT_URL/updateCategoryJson';
// Example: const CATEGORY_CLOUD_FUNCTION_URL = 'https://us-central1-your-project-id.cloudfunctions.net/updateCategoryJson';


export default function AddCategoryForm({ onSuccess, onClose }: AddCategoryFormProps) {
  const { toast } = useToast();
  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(categoryFormSchema),
    defaultValues: {
      categoryName: '',
      description: '',
      imageUrl: '',
      iconName: undefined, // Use undefined or a default valid key from iconMap if needed
      tags: '',
    },
  });
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  async function onSubmit(data: CategoryFormValues) {
    setIsSubmitting(true);

    // Prepare the data in the structure expected by categories.json
    const newCategory = {
        slug: generateSlug(data.categoryName), // Generate slug
        name: data.categoryName,
        description: data.description,
        iconName: data.iconName, // Store the icon name string
        imageURL: data.imageUrl || `https://picsum.photos/seed/${generateSlug(data.categoryName)}-cat/600/400`, // Use slug for seed or default
        tags: data.tags?.split(',').map(tag => tag.trim()).filter(tag => tag !== '') || [],
        createdAt: new Date().toISOString(), // Add timestamp
    };

    console.log('Submitting New Category Data:', JSON.stringify(newCategory, null, 2));

    // Check if the URL is set correctly
    if (CATEGORY_CLOUD_FUNCTION_URL === 'YOUR_CATEGORY_CLOUD_FUNCTION_ENDPOINT_URL/updateCategoryJson') {
        console.error("Error: Firebase Cloud Function URL for categories is not set. Please update 'CATEGORY_CLOUD_FUNCTION_URL' in AddCategoryForm.tsx.");
        toast({
            title: 'Configuration Error',
            description: 'Category Cloud Function URL not set. Cannot save category.',
            variant: 'destructive',
            duration: 7000,
        });
        setIsSubmitting(false);
        // --- TEMPORARY LOGGING FOR DEMO ---
        console.log("--- SIMULATED SAVE ---");
        console.log("Category data that *would* be sent:", JSON.stringify(newCategory, null, 2));
        console.log("If the endpoint existed, this data would be POSTed to:", CATEGORY_CLOUD_FUNCTION_URL);
        console.log("--- END SIMULATED SAVE ---");
        toast({
            title: 'Simulated Success!',
            description: `Category "${data.categoryName}" processed (logged to console). Implement the backend endpoint to save permanently.`,
            duration: 7000,
        });
        onSuccess(); // Still call onSuccess for UI feedback
        form.reset();
        // --- END TEMPORARY LOGGING ---
        return; // Stop execution since endpoint isn't ready
    }

    // TODO: Implement the actual API call when the cloud function endpoint exists
    try {
        // --- Placeholder for fetch call ---
        // const response = await fetch(CATEGORY_CLOUD_FUNCTION_URL, {
        //   method: 'POST',
        //   headers: {
        //     'Content-Type': 'application/json',
        //   },
        //   body: JSON.stringify(newCategory),
        // });
        // const result = await response.json();
        // if (!response.ok) {
        //   throw new Error(result.message || `HTTP error! status: ${response.status}`);
        // }
        // --- End Placeholder ---

        // Simulate API call delay for now
        await new Promise(resolve => setTimeout(resolve, 1000));

        toast({
        title: 'Success (Simulated)!', // Update title when endpoint is live
        description: `Category "${data.categoryName}" processed. Implement backend endpoint to save to GitHub.`,
        duration: 7000,
        });
        onSuccess();
        form.reset();
    } catch (error: any) {
        console.error('Error submitting category:', error);
        toast({
        title: 'Error Saving Category',
        description: error.message || 'Failed to save the category. Check console for details.',
        variant: 'destructive',
        duration: 7000,
        });
    } finally {
        setIsSubmitting(false);
    }
  }

  return (
    <ScrollArea className="max-h-[70vh] pr-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Category Name */}
          <FormField
            control={form.control}
            name="categoryName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Category Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter category name (e.g., PDF Tools)" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Description */}
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea placeholder="Short description for the category page (max 200 chars)" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Icon Selection */}
           <FormField
            control={form.control}
            name="iconName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Category Icon</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select an icon" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {Object.keys(iconMap).map((iconKey) => {
                       // Assert key type for safety
                       const key = iconKey as keyof typeof iconMap;
                       const IconComp = iconMap[key];
                       return (
                           <SelectItem key={key} value={key}>
                             <div className="flex items-center gap-2">
                               <IconComp className="h-4 w-4" />
                               {key} {/* Display the name */}
                             </div>
                           </SelectItem>
                       );
                    })}
                  </SelectContent>
                </Select>
                 <FormDescription>Visual representation for the category.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />


          {/* Image URL (Optional) */}
          <FormField
            control={form.control}
            name="imageUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Category Image URL (Optional)</FormLabel>
                <FormControl>
                  <Input type="url" placeholder="https://example.com/category-icon.png" {...field} />
                </FormControl>
                <FormDescription>URL for the category's visual representation. Uses Picsum placeholder if empty.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Tags (Optional) */}
          <FormField
            control={form.control}
            name="tags"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tags (Optional)</FormLabel>
                <FormControl>
                  <Input placeholder="Comma-separated tags, e.g., document, conversion, utility" {...field} />
                </FormControl>
                <FormDescription>Helps with search and SEO.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
                Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : 'Save Category'}
            </Button>
          </div>
        </form>
      </Form>
     </ScrollArea>
  );
}
