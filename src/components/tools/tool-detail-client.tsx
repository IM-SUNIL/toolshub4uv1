

'use client'; // Ensure this component is marked as a Client Component

import type { NextPage } from 'next';
import { useParams, useRouter } from 'next/navigation'; // Use next/navigation for App Router
import * as React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { getToolById, getRelatedTools, renderStars, type Tool } from '@/lib/data/tools.tsx'; // Import mock data and helpers
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, Home, ChevronRight, Star, Send, ArrowRight } from 'lucide-react'; // Import necessary icons
import { Skeleton } from '@/components/ui/skeleton'; // For loading state
import { useToast } from "@/hooks/use-toast"; // Corrected import path

// Helper function to format date (replace with a proper date formatting library if needed)
const formatDate = (isoString: string) => {
  try {
    return new Date(isoString).toLocaleDateString('en-US', {
      year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
    });
  } catch {
    return 'Invalid Date';
  }
};

// Define props for the client component, including toolId
interface ToolDetailClientProps {
  toolId: string;
}

const ToolDetailClient: NextPage<ToolDetailClientProps> = ({ toolId }) => {
  // Removed useParams() as toolId is passed as a prop now
  const router = useRouter();
  const { toast } = useToast(); // Get toast function

  const [tool, setTool] = React.useState<Tool | null | undefined>(undefined); // undefined initially, null if not found, Tool if found
  const [relatedTools, setRelatedTools] = React.useState<Tool[]>([]);
  const [newComment, setNewComment] = React.useState({ name: '', comment: '' });
  const [comments, setComments] = React.useState<Tool['comments']>([]);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  React.useEffect(() => {
    // Fetch tool data based on the toolId prop
    if (toolId) {
      const fetchedTool = getToolById(toolId);
      setTool(fetchedTool); // Will be undefined if not found initially
      if (fetchedTool) {
        setComments(fetchedTool.comments || []);
        setRelatedTools(getRelatedTools(fetchedTool));
      } else {
          setTool(null); // Explicitly set to null if not found after check
      }
    }
  }, [toolId]); // Dependency array includes toolId prop

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
    setIsSubmitting(true);
    // Simulate API call delay
    setTimeout(() => {
      const commentToAdd = {
        id: `c${(comments?.length || 0) + 1}`, // Simple ID generation
        name: newComment.name,
        comment: newComment.comment,
        timestamp: new Date().toISOString(),
      };
      setComments(prev => [...(prev || []), commentToAdd]);
      setNewComment({ name: '', comment: '' }); // Reset form
      setIsSubmitting(false);
      toast({
          title: "Success",
          description: "Your comment has been posted!",
          // Removed className as it's not a standard prop for toast
      });
    }, 500); // Simulate network delay
  };


  // Loading State
  if (tool === undefined) {
    return (
        <div className="container mx-auto px-4 py-8 pt-16 md:pt-20 max-w-6xl">
            {/* Skeleton for Breadcrumbs */}
            <Skeleton className="h-4 w-1/3 mb-6" />
             {/* Skeleton for Hero Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 mb-12">
                <Skeleton className="w-full h-64 md:h-96 rounded-lg" />
                <div className="flex flex-col justify-center space-y-4">
                    <Skeleton className="h-8 w-3/4" />
                    <div className="flex items-center gap-2">
                        <Skeleton className="h-6 w-20 rounded-full" />
                        <Skeleton className="h-6 w-16 rounded-full" />
                    </div>
                    <Skeleton className="h-6 w-28" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-5/6" />
                     <Skeleton className="h-12 w-full sm:w-1/2" /> {/* Skeleton for button */}
                </div>
            </div>
            {/* Skeleton for Description */}
            <Skeleton className="h-32 w-full mb-12" />
            {/* Skeleton for Steps */}
            <Skeleton className="h-48 w-full mb-12" />
            {/* Skeleton for Comments */}
            <Skeleton className="h-64 w-full" />
        </div>
    );
  }

  // Not Found State
  if (!tool) {
    return (
      <div className="container mx-auto px-4 py-8 pt-16 text-center min-h-[60vh] flex flex-col justify-center items-center">
        <h1 className="text-4xl font-bold mb-4">Tool Not Found</h1>
        <p className="text-muted-foreground mb-8">Sorry, the tool you are looking for does not exist.</p>
        <Button onClick={() => router.push('/')}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Go Back Home
        </Button>
      </div>
    );
  }

  // Tool Found - Render Detail Page
  return (
    <div className="container mx-auto px-4 py-8 pt-[2px] md:pt-[2px] max-w-6xl"> {/* Adjusted padding-top */}
       {/* Breadcrumbs */}
      <nav className="flex items-center text-sm text-muted-foreground mb-6 pt-4"> {/* Added pt-4 here */}
        <Link href="/" className="hover:text-accent transition-colors flex items-center">
          <Home className="h-4 w-4 mr-1" /> Home
        </Link>
        <ChevronRight className="h-4 w-4 mx-1" />
        {/* Assuming category link would go to a general categories page */}
        <Link href="/categories" className="hover:text-accent transition-colors">
          {tool.category || 'Categories'}
        </Link>
         <ChevronRight className="h-4 w-4 mx-1" />
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
             <Badge variant="secondary" className="text-sm py-1 px-3 flex items-center gap-1">
               {tool.categoryIcon && <tool.categoryIcon className="h-4 w-4"/>} {tool.category}
             </Badge>
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
           {/* Assuming the tool object has a direct website link */}
           {tool.id && ( // Check if tool.id exists (replace with actual link property if different)
                <Button size="lg" asChild className="mt-4 w-full sm:w-auto group transition-transform duration-300 hover:scale-105 hover:shadow-lg hover:shadow-accent/30">
                    {/* Use a generic link for now, replace tool.websiteLink with the actual property */}
                    <a href={`#`} target="_blank" rel="noopener noreferrer">
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
            comments.map((comment) => (
              <Card key={comment.id} className="bg-card/50 border border-border/30">
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
                <Button type="submit" disabled={isSubmitting} className="w-full sm:w-auto group transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-accent/30">
                  {isSubmitting ? 'Submitting...' : <>Post Comment <Send className="ml-2 h-4 w-4 group-hover:animate-pulse"/></>}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </section>

       {/* Related Tools Section (Bonus) */}
       {relatedTools.length > 0 && (
            <section>
                <h2 className="text-2xl font-bold mb-6 border-b border-border/20 pb-2">Related Tools</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {relatedTools.map((relatedTool) => (
                    <Link key={relatedTool.id} href={`/tools/${relatedTool.id}`} className="block group">
                        <Card className="h-full bg-card hover:border-accent transition-colors duration-300 transform hover:-translate-y-1 hover:shadow-xl cursor-pointer flex flex-col">
                             {/* Added Image to Related Tools Card */}
                            <div className="relative w-full aspect-[16/9] overflow-hidden rounded-t-lg">
                                <Image
                                    src={relatedTool.image || 'https://picsum.photos/300/169'}
                                    alt={`${relatedTool.name} thumbnail`}
                                    layout="fill"
                                    objectFit="cover"
                                    className="transition-transform duration-300 group-hover:scale-105"
                                    unoptimized
                                />
                            </div>
                            <CardHeader className="flex-shrink-0 pb-2 pt-4 px-4">
                                <div className="flex items-center gap-2 mb-1">
                                    {relatedTool.categoryIcon && <relatedTool.categoryIcon className="h-4 w-4 text-accent flex-shrink-0" />}
                                    <CardTitle className="text-base font-semibold line-clamp-1">{relatedTool.name}</CardTitle>
                                </div>
                                <p className="text-xs text-muted-foreground line-clamp-2 h-8">{relatedTool.summary}</p> {/* Fixed height */}
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
                ))}
                </div>
            </section>
       )}
    </div>
  );
};

export default ToolDetailClient;
