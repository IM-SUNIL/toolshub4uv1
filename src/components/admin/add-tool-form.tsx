
'use client';

import * as React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
// No Label needed directly if using FormLabel
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
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

// Helper function to generate a simple slug
const generateSlug = (name: string) => {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-') // Replace non-alphanumeric with hyphens
    .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
};


// Define Zod schema for validation
const toolFormSchema = z.object({
  toolName: z.string().min(2, { message: 'Tool name must be at least 2 characters.' }),
  imageUrl: z.string().url({ message: 'Please enter a valid image URL.' }).optional().or(z.literal('')), // Optional image URL
  rating: z.coerce.number().min(0).max(5, { message: 'Rating must be between 0 and 5.' }), // Allow 0 rating
  categorySlug: z.string({ required_error: 'Please select a category.' }), // Changed name to categorySlug
  priceType: z.enum(['Free', 'Paid'], { required_error: 'Please select a price type.' }),
  shortDescription: z.string().min(10, { message: 'Short description must be at least 10 characters.' }).max(160, { message: 'Short description must not exceed 160 characters.' }),
  fullDescription: z.string().min(20, { message: 'Full description must be at least 20 characters.' }),
  usageSteps: z.string().optional().or(z.literal('')), // Optional steps as single string for now
  websiteLink: z.string().url({ message: 'Please enter a valid website URL.' }),
  tags: z.string().optional().or(z.literal('')), // Optional tags as comma-separated string
});

type ToolFormValues = z.infer<typeof toolFormSchema>;

interface AddToolFormProps {
  categories: { value: string; label: string }[];
  onSuccess: () => void; // Callback on successful submission
  onClose: () => void; // Callback to close the dialog/form
}

export default function AddToolForm({ categories, onSuccess, onClose }: AddToolFormProps) {
  const { toast } = useToast();
  const form = useForm<ToolFormValues>({
    resolver: zodResolver(toolFormSchema),
    defaultValues: {
      toolName: '',
      imageUrl: '',
      rating: 4.0,
      categorySlug: undefined,
      priceType: 'Free',
      shortDescription: '',
      fullDescription: '',
      usageSteps: '',
      websiteLink: '',
      tags: '',
    },
  });
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  async function onSubmit(data: ToolFormValues) {
    setIsSubmitting(true);

    const newTool = {
        id: generateSlug(data.toolName), // Generate slug as ID
        name: data.toolName,
        image: data.imageUrl || `https://picsum.photos/seed/${generateSlug(data.toolName)}/600/400`, // Use slug for seed or default
        categorySlug: data.categorySlug,
        isFree: data.priceType === 'Free',
        rating: data.rating,
        summary: data.shortDescription,
        description: data.fullDescription,
        // Convert usage steps string (one per line) into array of objects
        usageSteps: data.usageSteps?.split('\n').filter(step => step.trim() !== '').map(step => ({ text: step.trim() })) || [],
        websiteLink: data.websiteLink,
        tags: data.tags?.split(',').map(tag => tag.trim()).filter(tag => tag !== '') || [],
        // comments: [], // Initialize with empty comments if needed
        // relatedToolIds: [], // Initialize related IDs if needed
        createdAt: new Date().toISOString(), // Add timestamp
    };


    console.log('New Tool Data:', newTool); // Log the processed data

    // **Placeholder for saving data:**
    // In a real app, you would send `newTool` to your backend API
    // which would then update the `tools.json` file or save to a database.
    // Example (conceptual - requires backend logic):
    // try {
    //   const response = await fetch('/api/add-tool', { // Your backend endpoint
    //     method: 'POST',
    //     headers: { 'Content-Type': 'application/json' },
    //     body: JSON.stringify(newTool),
    //   });
    //   if (!response.ok) throw new Error('Failed to save tool');
    //   toast({ title: 'Success!', description: `Tool "${data.toolName}" added.` });
    //   onSuccess();
    //   form.reset();
    // } catch (error) {
    //   console.error("Failed to save tool", error);
    //   toast({ title: 'Error', description: 'Failed to save tool.', variant: 'destructive' });
    // } finally {
    //   setIsSubmitting(false);
    // }

    // Simulate delay for now
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsSubmitting(false);
    toast({
      title: 'Success (Simulated)!',
      description: `Tool "${data.toolName}" added (Check console for data).`,
    });
    onSuccess();
    form.reset();
  }

  return (
     <ScrollArea className="max-h-[70vh] pr-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Tool Name */}
          <FormField
            control={form.control}
            name="toolName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tool Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter tool name" {...field} />
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
                <FormLabel>Image URL (Optional)</FormLabel>
                <FormControl>
                  <Input type="url" placeholder="https://example.com/image.png" {...field} />
                </FormControl>
                 <FormDescription>Enter the URL of the tool's image or logo. Uses Picsum placeholder if empty.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
             {/* Rating */}
             <FormField
                control={form.control}
                name="rating"
                render={({ field }) => (
                <FormItem>
                    <FormLabel>Rating (0-5)</FormLabel>
                    <FormControl>
                    <Input type="number" step="0.1" min="0" max="5" placeholder="e.g., 4.5" {...field} />
                    </FormControl>
                    <FormMessage />
                </FormItem>
                )}
             />

             {/* Category */}
             <FormField
                control={form.control}
                name="categorySlug" // Ensure this matches the schema
                render={({ field }) => (
                <FormItem>
                    <FormLabel>Category</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                        <SelectTrigger>
                        <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                        {categories.map((cat) => (
                        <SelectItem key={cat.value} value={cat.value}>
                            {cat.label}
                        </SelectItem>
                        ))}
                    </SelectContent>
                    </Select>
                    <FormMessage />
                </FormItem>
                )}
             />

             {/* Price Type */}
             <FormField
                control={form.control}
                name="priceType"
                render={({ field }) => (
                <FormItem>
                    <FormLabel>Price Type</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                        <SelectTrigger>
                        <SelectValue placeholder="Select price type" />
                        </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                        <SelectItem value="Free">Free</SelectItem>
                        <SelectItem value="Paid">Paid</SelectItem>
                        {/* Add Freemium etc. if needed */}
                    </SelectContent>
                    </Select>
                    <FormMessage />
                </FormItem>
                )}
             />
          </div>


          {/* Short Description */}
          <FormField
            control={form.control}
            name="shortDescription"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Short Description (Summary)</FormLabel>
                <FormControl>
                  <Textarea placeholder="A brief summary for the tool card (max 160 chars)" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Full Description */}
          <FormField
            control={form.control}
            name="fullDescription"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Full Description</FormLabel>
                <FormControl>
                  <Textarea rows={5} placeholder="Detailed explanation for the tool detail page. You can use basic HTML." {...field} />
                </FormControl>
                 <FormDescription>Supports basic HTML tags like &lt;p&gt;, &lt;ul&gt;, &lt;li&gt;, &lt;strong&gt;.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Usage Steps (Optional) */}
          <FormField
            control={form.control}
            name="usageSteps"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Steps to Use (Optional)</FormLabel>
                <FormControl>
                  <Textarea rows={4} placeholder="Enter steps, one per line. e.g.,&#10;1. Upload your file.&#10;2. Select options.&#10;3. Click Convert." {...field} />
                </FormControl>
                 <FormDescription>Enter each step on a new line.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Website Link */}
          <FormField
            control={form.control}
            name="websiteLink"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Website Link</FormLabel>
                <FormControl>
                  <Input type="url" placeholder="https://toolwebsite.com" {...field} />
                </FormControl>
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
                  <Input placeholder="Comma-separated tags, e.g., pdf, converter, productivity" {...field} />
                </FormControl>
                 <FormDescription>Helps users find the tool via search.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex justify-end gap-2 pt-4">
              <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
                 Cancel
              </Button>
             <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Saving...' : 'Save Tool'}
             </Button>
          </div>
        </form>
      </Form>
     </ScrollArea>
  );
}
