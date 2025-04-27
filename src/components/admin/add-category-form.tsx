
'use client';

import * as React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
// Import Select components if needed for Parent Category
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
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
import { ScrollArea } from '@/components/ui/scroll-area'; // Import ScrollArea


// Define Zod schema for validation
const categoryFormSchema = z.object({
  categoryName: z.string().min(2, { message: 'Category name must be at least 2 characters.' }),
  description: z.string().min(10, { message: 'Description must be at least 10 characters.' }).max(200, { message: 'Description cannot exceed 200 characters.' }),
  imageUrl: z.string().url({ message: 'Please enter a valid image URL.' }).optional().or(z.literal('')), // Optional image URL
  // parentCategory: z.string().optional(), // Optional parent category - keep commented for now
  tags: z.string().optional().or(z.literal('')), // Optional tags
});

type CategoryFormValues = z.infer<typeof categoryFormSchema>;

interface AddCategoryFormProps {
  // parentCategories?: { value: string; label: string }[]; // Pass if using parent categories
  onSuccess: () => void; // Callback on successful submission
  onClose: () => void; // Callback to close the dialog/form
}

export default function AddCategoryForm({ /* parentCategories, */ onSuccess, onClose }: AddCategoryFormProps) {
  const { toast } = useToast();
  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(categoryFormSchema),
    defaultValues: {
      categoryName: '',
      description: '',
      imageUrl: '',
      // parentCategory: undefined,
      tags: '',
    },
  });
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  async function onSubmit(data: CategoryFormValues) {
    setIsSubmitting(true);
    console.log('Category Form Data Submitted:', data); // Log data for now

    // Simulate API call/saving data (replace with actual DB save later)
    // Example using localStorage:
    // try {
    //   const categories = JSON.parse(localStorage.getItem('categories')) || [];
    //   const newCategory = { ...data, id: `cat-${Date.now()}`, createdAt: new Date().toISOString() }; // Assign basic ID
    //   categories.push(newCategory);
    //   localStorage.setItem('categories', JSON.stringify(categories));
    // } catch (error) {
    //   console.error("Failed to save category to localStorage", error);
    //   toast({ title: 'Error', description: 'Failed to save category.', variant: 'destructive' });
    //   setIsSubmitting(false);
    //   return;
    // }

    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate network delay

    setIsSubmitting(false);
    toast({
      title: 'Success!',
      description: `Category "${data.categoryName}" added successfully.`,
    });
    onSuccess(); // Call the success callback (e.g., close dialog)
    form.reset(); // Reset form after successful submission
  }

  return (
    <ScrollArea className="max-h-[70vh] pr-6"> {/* Added ScrollArea */}
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
                <FormDescription>URL for the category's visual representation.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* Add File Upload if needed */}

          {/* Parent Category (Optional - Uncomment if needed) */}
          {/* <FormField
            control={form.control}
            name="parentCategory"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Parent Category (Optional)</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a parent category (optional)" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="none">None</SelectItem>
                    {parentCategories?.map((cat) => (
                      <SelectItem key={cat.value} value={cat.value}>
                        {cat.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormDescription>Select if this is a sub-category.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          /> */}

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
