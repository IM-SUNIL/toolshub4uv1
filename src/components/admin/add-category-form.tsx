
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
import { getAbsoluteUrl } from '@/lib/data/tools'; // Import getAbsoluteUrl

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

// API Endpoint relative path for adding categories
const ADD_CATEGORY_API_PATH = '/categories/add'; // Updated path


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
  const [categorySlug, setCategorySlug] = React.useState(''); // State for generated slug

   // Watch categoryName field and generate slug
   const watchedCategoryName = form.watch('categoryName');
   React.useEffect(() => {
       if (watchedCategoryName) {
           setCategorySlug(generateSlug(watchedCategoryName));
       } else {
           setCategorySlug('');
       }
   }, [watchedCategoryName]);


  async function onSubmit(data: CategoryFormValues) {
    setIsSubmitting(true);
    const addCategoryApiUrl = getAbsoluteUrl(ADD_CATEGORY_API_PATH);

    // Prepare the data in the structure expected by the backend API
    const newCategoryPayload = {
        slug: categorySlug, // Use generated slug
        name: data.categoryName,
        description: data.description,
        iconName: data.iconName, // Store the icon name string
        imageURL: data.imageUrl || `https://picsum.photos/seed/${categorySlug}-cat/600/400`, // Use slug for seed or default
        tags: data.tags?.split(',').map(tag => tag.trim()).filter(tag => tag !== '') || [],
        // createdAt will be handled by backend/DB default
    };

    console.log('Submitting New Category Payload to URL:', addCategoryApiUrl, JSON.stringify(newCategoryPayload, null, 2));

    try {
        const response = await fetch(addCategoryApiUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
             // Add Authorization header if needed
          },
          body: JSON.stringify(newCategoryPayload),
        });

        const result = await response.json();

        if (!response.ok) {
           let errorMsg = result.msg || result.error || `HTTP error! status: ${response.status}`;
            if (result.errors) {
                 errorMsg += ` Details: ${result.errors.join(', ')}`;
            }
            throw new Error(errorMsg);
        }

        toast({
            title: 'Success!',
            description: `Category "${data.categoryName}" added successfully.`,
            duration: 5000,
        });
        onSuccess(); // Close the dialog
        form.reset(); // Reset form fields
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

           {/* Category Slug (Readonly, generated from Name) */}
           <FormItem>
             <FormLabel>Category Slug (Auto-generated)</FormLabel>
             <FormControl>
                <Input placeholder="Unique identifier..." value={categorySlug} readOnly disabled className="bg-muted/50 cursor-not-allowed"/>
             </FormControl>
              <FormDescription>This unique ID is generated from the name and used in the URL.</FormDescription>
             <FormMessage />
           </FormItem>


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
