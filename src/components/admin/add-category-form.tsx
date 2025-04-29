
'use client';

import * as React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
// No Label needed directly if using FormLabel
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
    .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
};

// Map icon names to components for easier lookup
const iconMap: { [key: string]: React.ElementType } = {
    Zap,
    FileText,
    Scissors,
    Video,
    Code,
};

// Define Zod schema for validation
const categoryFormSchema = z.object({
  categoryName: z.string().min(2, { message: 'Category name must be at least 2 characters.' }),
  description: z.string().min(10, { message: 'Description must be at least 10 characters.' }).max(200, { message: 'Description cannot exceed 200 characters.' }),
  imageUrl: z.string().url({ message: 'Please enter a valid image URL.' }).optional().or(z.literal('')), // Optional image URL
  iconName: z.string({ required_error: 'Please select an icon.' }), // Icon name selection
  tags: z.string().optional().or(z.literal('')), // Optional tags as comma-separated string
});

type CategoryFormValues = z.infer<typeof categoryFormSchema>;

interface AddCategoryFormProps {
  onSuccess: () => void; // Callback on successful submission
  onClose: () => void; // Callback to close the dialog/form
}

export default function AddCategoryForm({ onSuccess, onClose }: AddCategoryFormProps) {
  const { toast } = useToast();
  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(categoryFormSchema),
    defaultValues: {
      categoryName: '',
      description: '',
      imageUrl: '',
      iconName: undefined,
      tags: '',
    },
  });
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  async function onSubmit(data: CategoryFormValues) {
    setIsSubmitting(true);

    const newCategory = {
        slug: generateSlug(data.categoryName), // Generate slug
        name: data.categoryName,
        description: data.description,
        iconName: data.iconName, // Store the icon name string
        imageURL: data.imageUrl || `https://picsum.photos/seed/${generateSlug(data.categoryName)}-cat/600/400`, // Use slug for seed or default
        tags: data.tags?.split(',').map(tag => tag.trim()).filter(tag => tag !== '') || [],
        createdAt: new Date().toISOString(), // Add timestamp
    };

    console.log('New Category Data (Simulated Save):', JSON.stringify(newCategory, null, 2)); // Log the processed data clearly

    // **IMPORTANT: Saving directly to categories.json in GitHub from the client-side is not possible due to security restrictions.**
    // This function currently simulates saving the data.
    // To make this work in production, you need to:
    // 1. Create a backend API endpoint (e.g., using Firebase Cloud Functions, Next.js API Routes, or another backend).
    // 2. Securely authenticate with GitHub on the backend using an API token.
    // 3. Have the backend fetch categories.json, add the new category, and commit the changes back to the GitHub repository.
    // 4. Send the `newCategory` object from this form to your backend endpoint.


    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsSubmitting(false);
    toast({
      title: 'Success (Simulated)!',
      description: `Category "${data.categoryName}" processed. Data logged to console. Update categories.json manually or implement a backend endpoint.`,
      duration: 7000, // Give more time to read the message
    });
    onSuccess();
    form.reset();
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
                       const IconComp = iconMap[iconKey];
                       return (
                           <SelectItem key={iconKey} value={iconKey}>
                             <div className="flex items-center gap-2">
                               <IconComp className="h-4 w-4" />
                               {iconKey}
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

