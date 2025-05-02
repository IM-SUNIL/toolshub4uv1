

'use client'; // Ensure this component is marked as a Client Component

import type { NextPage } from 'next';
import { useRouter } from 'next/navigation'; // Use next/navigation for App Router
import * as React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import type { Tool, Comment, Category } from '@/lib/data/tools'; // Import types
import {
    renderStars,
    getIconComponent,
    addCommentToTool,
    getCommentsForTool,
    getRelatedTools,
    getAllCategories // Need this to get category details
} from '@/lib/data/tools'; // Import data helpers and API functions
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, Home, ChevronRight, Star, Send, ArrowRight, CheckCircle } from 'lucide-react'; // Import necessary icons
import { Skeleton } from '@/components/ui/skeleton'; // For loading state
import { useToast } from "@/hooks/use-toast"; // Corrected import path

// Helper function to format date (replace with a proper date formatting library if needed)
const formatDate = (isoString: string | Date) => {
  try {
    return new Date(isoString).toLocaleDateString('en-US', {
      year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
    });
  } catch {
    return 'Invalid Date';
  }
};

// Define props for the client component, including tool slug and initial data
interface ToolDetailClientProps {
  toolSlug: string;
  initialToolData: Tool; // Receive initial tool data fetched on the server
}

const ToolDetailClient: NextPage<ToolDetailClientProps> = ({ toolSlug, initialToolData }) => {
  const router = useRouter();
  const { toast } = useToast();

  const [tool, setTool] = React.useState<Tool>(initialToolData); // Use initial data
  const [category, setCategory] = React.useState<Category | null>(null);
  const [relatedTools, setRelatedTools] = React.useState<Tool[]>([]);
  const [comments, setComments] = React.useState<Comment[]>(initialToolData.comments || []); // Use initial comments
  const [newComment, setNewComment] = React.useState({ name: '', comment: '' });
  const [isSubmittingComment, setIsSubmittingComment] = React.useState(false);
  const [isLoadingRelated, setIsLoadingRelated] = React.useState(true);
  const [isLoadingCategory, setIsLoadingCategory] = React.useState(true);

  // Fetch additional data (category details, related tools, comments) on the client
  React.useEffect(() => {
    const fetchAdditionalData = async () => {
      setIsLoadingCategory(true);
      setIsLoadingRelated(true);
      try {
        // Fetch category details
        const allCats = await getAllCategories();
        const currentCategory = allCats.find(cat => cat.slug === tool.categorySlug);
        setCategory(currentCategory || null);

        // Fetch related tools
        const related = await getRelatedTools(tool);
        setRelatedTools(related);

        // Fetch latest comments (optional, if initial data might be stale)
        // const latestComments = await getCommentsForTool(toolSlug);
        // setComments(latestComments);

      } catch (error) {
        console.error("Error fetching additional tool data:", error);
      } finally {
        setIsLoadingCategory(false);
        setIsLoadingRelated(false);
      }
    };

    if (tool) {
        fetchAdditionalData();
    }
     // Fetch comments separately if needed, or rely on initialToolData
     const fetchInitialComments = async () => {
         if (!initialToolData.comments || initialToolData.comments.length === 0) {
             const fetchedComments = await getCommentsForTool(toolSlug);
             setComments(fetchedComments);
         }
     };
     fetchInitialComments();


  }, [tool, toolSlug, initialToolData.comments]); // Depend on tool object and slug


  const handleCommentChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewComment(prev => ({ ...prev, [name]: value }));
  };

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.name.trim() || !newComment.comment.trim()) {
        toast({
            title: "Error",
            description: "Please enter your name and comment.",
            variant: "destructive",
        });
        return;
    }
    setIsSubmittingComment(true);

    try {
        const addedComment = await addCommentToTool(toolSlug, newComment.name, newComment.comment);

        if (addedComment) {
             // Ensure addedComment has a timestamp and potentially an _id from backend
            setComments(prev => [...prev, { ...addedComment, timestamp: addedComment.timestamp || new Date().toISOString() }]);
            setNewComment({ name: '', comment: '' }); // Reset form
            toast({
                title: "Success",
                description: "Your comment has been posted!",
            });
        } else {
             throw new Error("Failed to add comment.");
        }
    } catch (error: any) {
        console.error("Error submitting comment:", error);
         toast({
            title: "Error",
            description: error.message || "Could not post comment.",
            variant: "destructive",
        });
    } finally {
        setIsSubmittingComment(false);
    }
  };


  // Loading State (might not be needed if initialToolData is always present)
  if (!tool) {
    // This case should ideally be handled by the parent Server Component's notFound()
    return (
        <div className="container mx-auto px-4 py-8 pt-16 md:pt-20 max-w-6xl">
            {/* Basic Skeleton for loading */}
            <Skeleton className="h-8 w-1/3 mb-6" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                <Skeleton className="w-full h-96 rounded-lg" />
                <div className="space-y-4">
                    <Skeleton className="h-10 w-3/4" />
                    <Skeleton className="h-6 w-1/4" />
                    <Skeleton className="h-6 w-1/5" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-5/6" />
                    <Skeleton className="h-12 w-1/2" />
                </div>
            </div>
        </div>
    );
  }

  // Tool Found - Render Detail Page
  const CategoryIcon = category ? getIconComponent(category.iconName) : Star; // Use fetched category icon
  const UsageStepIcon = CheckCircle; // Using CheckCircle for all steps


  return (
    <div className="container mx-auto px-4 py-8 pt-[2px] md:pt-[2px] max-w-6xl"> {/* Adjusted padding-top */}
       {/* Breadcrumbs */}
      <nav className="flex items-center text-sm text-muted-foreground mb-6 pt-4"> {/* Added pt-4 here */}
        <Link href="/" className="hover:text-accent transition-colors flex items-center">
          <Home className="h-4 w-4 mr-1" /> Home
        </Link>
        <ChevronRight className="h-4 w-4 mx-1" />
         {/* Link to the category page using the slug */}
         {category ? (
            <>
             <Link href={`/categories/${tool.categorySlug}`} className="hover:text-accent transition-colors">
                {category.name}
             </Link>
             <ChevronRight className="h-4 w-4 mx-1" />
            </>
         ) : (
             <Skeleton className="h-4 w-20 mx-1" /> // Placeholder if category is loading
         )}
        <span className="font-medium text-foreground">{tool.name}</span>
      </nav>

      {/* Hero Section */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 mb-12 items-start">
        {/* Tool Image */}
        <div className="relative w-full aspect-video rounded-lg overflow-hidden shadow-lg border border-border/10 group">
           <Image
            src={tool.image || 'https://picsum.photos/600/400'} // Fallback image
            alt={`${tool.name} showcase`}
            layout="fill"
            objectFit="cover"
            className="transition-transform duration-300 group-hover:scale-105"
            priority // Load hero image quickly
            unoptimized // Added to prevent potential issues with external URLs like picsum in some environments
          />
        </div>

        {/* Tool Info */}
        <div className="flex flex-col justify-center space-y-3 md:space-y-4">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight animated-text-gradient">
            {tool.name}
          </h1>
          <div className="flex flex-wrap items-center gap-2">
             {isLoadingCategory ? (
                 <Skeleton className="h-6 w-24 rounded-full" />
             ) : category ? (
                 <Badge variant="secondary" className="text-sm py-1 px-3 flex items-center gap-1">
                 {<CategoryIcon className="h-4 w-4"/>} {category.name}
                 </Badge>
             ) : null}
             <Badge variant={tool.isFree ? 'default' : 'destructive'} className={`text-sm py-1 px-3 ${tool.isFree ? 'bg-green-600/20 text-green-400 border-green-600/30 hover:bg-green-600/30' : 'bg-red-600/20 text-red-400 border-red-600/30 hover:bg-red-600/30'}`}>
               {tool.isFree ? 'Free' : 'Paid'}
             </Badge>
          </div>
          <div className="flex items-center gap-2">
            {renderStars(tool.rating)}
            <span className="text-muted-foreground text-sm">({tool.rating.toFixed(1)})</span>
          </div>
          <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
            {tool.summary}
          </p>
           {/* Use the actual website link from the tool data */}
           {tool.websiteLink && (
                <Button size="lg" asChild className="mt-4 w-full sm:w-auto group transition-transform duration-300 hover:scale-105 hover:shadow-lg hover:shadow-accent/30">
                    <a href={tool.websiteLink} target="_blank" rel="noopener noreferrer">
                       Visit Tool Website <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
                    </a>
                </Button>
           )}
        </div>
      </section>

       {/* Detailed Description Section */}
       <section className="mb-12 prose prose-sm sm:prose-base dark:prose-invert max-w-none prose-headings:text-foreground prose-p:text-muted-foreground prose-li:text-muted-foreground prose-a:text-accent hover:prose-a:text-accent/80 prose-strong:text-foreground">
        <h2 className="text-2xl font-bold mb-4 border-b border-border/20 pb-2">Tool Description</h2>
         {/* Use dangerouslySetInnerHTML for basic HTML formatting from description */}
        <div dangerouslySetInnerHTML={{ __html: tool.description }} />
      </section>

      {/* Steps to Use Section */}
       {tool.usageSteps && tool.usageSteps.length > 0 && (
         <section className="mb-12">
           <h2 className="text-2xl font-bold mb-6 border-b border-border/20 pb-2">How to Use This Tool</h2>
           <ul className="space-y-4">
             {tool.usageSteps.map((step, index) => (
               <li key={index} className="flex items-start gap-3">
                 <span className="flex-shrink-0 h-6 w-6 bg-accent/20 text-accent rounded-full flex items-center justify-center text-xs font-bold mt-0.5">
                   {index + 1}
                 </span>
                 <span className="text-muted-foreground">{step.text}</span>
               </li>
             ))}
           </ul>
         </section>
       )}

      {/* Comments Section */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6 border-b border-border/20 pb-2">User Comments</h2>
        <div className="space-y-6">
          {/* Existing Comments */}
          {comments && comments.length > 0 ? (
            comments.map((comment, index) => ( // Use index as key if comment._id isn't guaranteed unique initially
              <Card key={comment._id || `comment-${index}`} className="bg-card/50 border border-border/30">
                <CardHeader className="pb-2 pt-4 px-4">
                  <div className="flex justify-between items-center">
                     <CardTitle className="text-base font-semibold">{comment.name}</CardTitle>
                     <p className="text-xs text-muted-foreground">{formatDate(comment.timestamp)}</p>
                   </div>
                </CardHeader>
                <CardContent className="px-4 pb-4 pt-2">
                  <p className="text-sm text-muted-foreground">{comment.comment}</p>
                </CardContent>
              </Card>
            ))
          ) : (
            <p className="text-muted-foreground text-center py-4">No comments yet. Be the first to comment!</p>
          )}

          {/* Comment Form */}
          <Card className="bg-card/80 border border-border/40">
             <CardHeader>
                <CardTitle className="text-lg">Leave a Comment</CardTitle>
             </CardHeader>
            <CardContent>
              <form onSubmit={handleCommentSubmit} className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium mb-1 sr-only">Name</label>
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    placeholder="Your Name"
                    value={newComment.name}
                    onChange={handleCommentChange}
                    required
                    className="bg-background/70 border-border/50 focus:border-accent focus:ring-accent/50"
                  />
                </div>
                <div>
                   <label htmlFor="comment" className="block text-sm font-medium mb-1 sr-only">Comment</label>
                   <Textarea
                    id="comment"
                    name="comment"
                    placeholder="Write your comment here..."
                    value={newComment.comment}
                    onChange={handleCommentChange}
                    required
                    rows={4}
                     className="bg-background/70 border-border/50 focus:border-accent focus:ring-accent/50"
                  />
                </div>
                <Button type="submit" disabled={isSubmittingComment} className="w-full sm:w-auto group transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-accent/30">
                  {isSubmittingComment ? 'Submitting...' : <>Post Comment <Send className="ml-2 h-4 w-4 group-hover:animate-pulse"/></>}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </section>

       {/* Related Tools Section */}
       <section>
            <h2 className="text-2xl font-bold mb-6 border-b border-border/20 pb-2">Related Tools</h2>
            {isLoadingRelated ? (
                // Skeleton for related tools
                 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[...Array(3)].map((_, i) => (
                        <Card key={i} className="flex flex-col h-full rounded-lg overflow-hidden">
                            <Skeleton className="w-full aspect-video" />
                            <CardHeader className="pb-2 pt-4 px-4">
                                <Skeleton className="h-5 w-1/2 mb-1" />
                                <Skeleton className="h-4 w-full mb-1" />
                                <Skeleton className="h-4 w-5/6" />
                            </CardHeader>
                            <CardContent className="mt-auto pt-2 pb-4 px-4">
                                <div className="flex items-center justify-between">
                                    <Skeleton className="h-5 w-12 rounded-full" />
                                    <Skeleton className="h-5 w-10" />
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            ) : relatedTools.length > 0 ? (
                // Display related tools
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {relatedTools.map((relatedTool) => {
                    // Find category details for the related tool
                    // Note: This assumes categories are already fetched or you fetch them here
                    const relatedCategory = category; // Use the already fetched category for simplicity, or fetch specifically
                    const RelatedCategoryIcon = relatedCategory ? getIconComponent(relatedCategory.iconName) : Star;
                    return (
                         <Link key={relatedTool.slug} href={`/tools/${relatedTool.slug}`} className="block group">
                            <Card className="h-full bg-card hover:border-accent transition-colors duration-300 transform hover:-translate-y-1 hover:shadow-xl cursor-pointer flex flex-col overflow-hidden rounded-lg">
                                <div className="relative w-full aspect-[16/9] overflow-hidden">
                                    <Image
                                        src={relatedTool.image || 'https://picsum.photos/300/169'}
                                        alt={`${relatedTool.name} thumbnail`}
                                        layout="fill"
                                        objectFit="cover"
                                        className="transition-transform duration-300 group-hover:scale-105"
                                        unoptimized
                                        loading="lazy"
                                    />
                                </div>
                                <CardHeader className="flex-shrink-0 pb-2 pt-4 px-4">
                                     <div className="flex items-center gap-2 mb-1">
                                        {/* If you need the icon of the *related* tool's category, you'd fetch that category */}
                                        {/* For now, using the current tool's category icon as placeholder */}
                                        <RelatedCategoryIcon className="h-4 w-4 text-accent flex-shrink-0" />
                                        <CardTitle className="text-base font-semibold line-clamp-1">{relatedTool.name}</CardTitle>
                                     </div>
                                     <p className="text-xs text-muted-foreground line-clamp-2 h-8">{relatedTool.summary}</p>
                                </CardHeader>
                                <CardContent className="mt-auto pt-2 pb-4 px-4">
                                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                                        <Badge variant={relatedTool.isFree ? 'default' : 'destructive'} className={`text-xs py-0.5 px-2 ${relatedTool.isFree ? 'bg-green-600/20 text-green-400 border-green-600/30' : 'bg-red-600/20 text-red-400 border-red-600/30'}`}>
                                            {relatedTool.isFree ? 'Free' : 'Paid'}
                                        </Badge>
                                        <div className="flex items-center">
                                            <Star className="h-3 w-3 mr-1 text-yellow-500 fill-yellow-500"/>
                                            {relatedTool.rating.toFixed(1)}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </Link>
                    );
                })}
                </div>
            ) : (
                 <p className="text-muted-foreground text-center py-4">No related tools found.</p>
            )}
       </section>
    </div>
  );
};

export default ToolDetailClient;
