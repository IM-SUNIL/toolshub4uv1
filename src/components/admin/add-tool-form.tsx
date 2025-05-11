
'use client';

import * as React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
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
import { getAbsoluteUrl } from '@/lib/data/tools'; // Import getAbsoluteUrl

// Helper function to generate a simple slug (consider more robust slugification if needed)
const generateSlug = (name: string) => {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-') // Replace non-alphanumeric with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single
    .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
};


// Define Zod schema for validation (ensure it matches the expected structure for the API)
const toolFormSchema = z.object({
  toolName: z.string().min(2, { message: 'Tool name must be at least 2 characters.' }),
  imageUrl: z.string().url({ message: 'Please enter a valid image URL.' }).optional().or(z.literal('')), // Optional image URL
  rating: z.coerce.number().min(0).max(5, { message: 'Rating must be between 0 and 5.' }), // Allow 0 rating
  categorySlug: z.string({ required_error: 'Please select a category.' }),
  priceType: z.enum(['Free', 'Paid'], { required_error: 'Please select a price type.' }),
  shortDescription: z.string().min(10, { message: 'Short description must be at least 10 characters.' }).max(160, { message: 'Short description must not exceed 160 characters.' }),
  fullDescription: z.string().min(20, { message: 'Full description must be at least 20 characters.' }),
  usageSteps: z.string().optional().or(z.literal('')), // Optional steps as single string, will be processed
  websiteLink: z.string().url({ message: 'Please enter a valid website URL.' }),
  tags: z.string().optional().or(z.literal('')), // Optional tags as comma-separated string
});

type ToolFormValues = z.infer<typeof toolFormSchema>;

interface AddToolFormProps {
  categories: { value: string; label: string }[];
  onSuccess: () => void; // Callback on successful submission
  onClose: () => void; // Callback to close the dialog/form
}

// API Endpoint relative path for adding tools
const ADD_TOOL_API_PATH = '/api/tools/add';


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
  const [toolSlug, setToolSlug] = React.useState(''); // State to store generated slug

   // Watch toolName field and generate slug
   const watchedToolName = form.watch('toolName');
   React.useEffect(() => {
       if (watchedToolName) {
           setToolSlug(generateSlug(watchedToolName));
       } else {
           setToolSlug('');
       }
   }, [watchedToolName]);


  async function onSubmit(data: ToolFormValues) {
    setIsSubmitting(true);
    const addToolApiUrl = getAbsoluteUrl(ADD_TOOL_API_PATH);

    // Prepare the data in the structure expected by the backend API
    const newToolPayload = {
        slug: toolSlug, // Use the generated slug
        name: data.toolName,
        image: data.imageUrl || `https://picsum.photos/seed/${toolSlug}/600/400`, // Use slug for seed or default
        categorySlug: data.categorySlug,
        isFree: data.priceType === 'Free',
        rating: data.rating,
        summary: data.shortDescription,
        description: data.fullDescription,
        usageSteps: data.usageSteps?.split('\n').filter(step => step.trim() !== '').map(step => ({ text: step.trim() })) || [],
        websiteLink: data.websiteLink,
        tags: data.tags?.split(',').map(tag => tag.trim()).filter(tag => tag !== '') || [],
        // Comments, relatedToolIds, createdAt, updatedAt will be handled by backend/DB defaults
    };

    console.log('Submitting New Tool Payload to URL:', addToolApiUrl, JSON.stringify(newToolPayload, null, 2));

    try {
        const response = await fetch(addToolApiUrl, {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json',
             // Add Authorization header if your API requires it later
             // 'Authorization': `Bearer YOUR_AUTH_TOKEN`
            },
            body: JSON.stringify(newToolPayload), // Send the processed data
        });

        const result = await response.json(); // Get response body

        if (!response.ok) {
            // Handle specific error messages from the backend
            let errorMsg = result.msg || `HTTP error! status: ${response.status}`;
            if (result.errors) {
                 // Append validation errors if they exist
                 errorMsg += ` Details: ${result.errors.join(', ')}`;
            }
            throw new Error(errorMsg);
        }

        toast({
            title: 'Success!',
            description: `Tool "${data.toolName}" added successfully!`,
            duration: 5000,
        });
        onSuccess(); // Close the dialog
        form.reset(); // Reset the form fields

    } catch (error: any) {
        console.error('Error submitting tool:', error);
        toast({
            title: 'Error Saving Tool',
            description: error.message || 'Failed to save the tool. Check console for details.',
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

          {/* Tool Slug (Readonly, generated from Name) */}
          <FormItem>
             <FormLabel>Tool Slug (Auto-generated)</FormLabel>
             <FormControl>
                <Input placeholder="Unique identifier..." value={toolSlug} readOnly disabled className="bg-muted/50 cursor-not-allowed"/>
             </FormControl>
              <FormDescription>This unique ID is generated from the name and used in the URL.</FormDescription>
             <FormMessage />
          </FormItem>


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
                            {cat.label} {/* Display category name */}
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
                  <Textarea rows={5} placeholder="Detailed explanation for the tool detail page. You can use basic HTML or Markdown." {...field} />
                </FormControl>
                 <FormDescription>Supports basic HTML or Markdown for formatting.</FormDescription>
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
                 <FormDescription>Enter each step on a new line. Will be stored as an array.</FormDescription>
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
                 <FormDescription>Helps users find the tool via search. Will be stored as an array.</FormDescription>
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
