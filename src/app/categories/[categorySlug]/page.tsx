
// This page remains a Server Component by default, but will use async functions for data fetching

import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { getToolsByCategorySlug, getAllCategories, Category, Tool, getIconComponent } from '@/lib/data/tools'; // Import API helpers and types
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowRight, Star, Home, ChevronRight } from 'lucide-react'; // Import icons

// Generate static paths for all categories (if using SSG)
// export async function generateStaticParams() {
//   const categories = await getAllCategories(); // Fetch categories from API
//   return categories.map((category) => ({
//     categorySlug: category.slug,
//   }));
// }

// Generate metadata for the category page dynamically
export async function generateMetadata({ params }: { params: { categorySlug: string } }): Promise<Metadata> {
  const categories = await getAllCategories(); // Fetch all categories to find the current one
  const category = categories.find(cat => cat.slug === params.categorySlug);

  if (!category) {
    return {
      title: 'Category Not Found - Toolshub4u',
      description: 'The requested category could not be found.',
    };
  }

  return {
    title: `${category.name} Tools - Toolshub4u`, // Changed title format
    description: category.description || `Explore tools in the ${category.name} category on Toolshub4u.`,
     openGraph: {
       images: [category.imageURL || 'https://picsum.photos/seed/cat-og/600/400'],
       title: `${category.name} Tools - Toolshub4u`,
       description: category.description || `Explore tools in the ${category.name} category.`,
    },
  };
}

// This is now an async Server Component
export default async function CategoryDetailPage({ params }: { params: { categorySlug: string } }) {
  // Fetch category details and tools in parallel
  const categories = await getAllCategories(); // Fetch all to find current category details
  const category = categories.find(cat => cat.slug === params.categorySlug);
  const tools = await getToolsByCategorySlug(params.categorySlug); // Fetch tools for this specific category

  if (!category) {
    notFound(); // Show 404 if category doesn't exist
  }

  const CategoryIcon = getIconComponent(category.iconName); // Get the icon component dynamically

  return (
    <main className="container mx-auto px-4 py-8 max-w-6xl pt-[2px]">
      {/* Breadcrumbs */}
       <nav className="flex items-center text-sm text-muted-foreground mb-6 pt-4">
         <Link href="/" className="hover:text-accent transition-colors flex items-center">
           <Home className="h-4 w-4 mr-1" /> Home
         </Link>
         <ChevronRight className="h-4 w-4 mx-1" />
         <Link href="/categories" className="hover:text-accent transition-colors">
           Categories
         </Link>
         <ChevronRight className="h-4 w-4 mx-1" />
         <span className="font-medium text-foreground">{category.name}</span>
       </nav>

      {/* Category Header */}
      <section className="text-center mb-12">
          {CategoryIcon && <CategoryIcon className="h-16 w-16 text-accent mx-auto mb-4" />}
          <h1 className="text-3xl sm:text-4xl font-bold mb-2">{category.name}</h1>
          {category.description && <p className="text-lg text-muted-foreground max-w-2xl mx-auto">{category.description}</p>}
      </section>

      {/* Tools Grid */}
      <section>
        {tools.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {tools.map((tool) => (
              // Link to the dynamic tool detail page using the tool's slug
              <Link key={tool.slug} href={`/tools/${tool.slug}`} className="block h-full group">
                <Card className="bg-card hover:border-accent transition-colors duration-300 group transform hover:-translate-y-1 hover:shadow-xl cursor-pointer flex flex-col h-full rounded-lg overflow-hidden">
                  {/* Tool Image */}
                  <div className="relative w-full aspect-video overflow-hidden">
                    <Image
                      src={tool.image || 'https://picsum.photos/300/169'}
                      alt={`${tool.name} thumbnail`}
                      layout="fill"
                      objectFit="cover"
                      className="transition-transform duration-300 group-hover:scale-105"
                      unoptimized
                      loading="lazy"
                    />
                  </div>
                  <CardHeader className="pb-2 pt-4 px-4">
                     <CardTitle className="text-base font-semibold line-clamp-1">{tool.name}</CardTitle>
                     <CardDescription className="text-xs text-muted-foreground line-clamp-2 h-8">{tool.summary}</CardDescription>
                  </CardHeader>
                   <CardContent className="mt-auto pt-2 pb-4 px-4">
                     <div className="flex items-center justify-between text-xs text-muted-foreground mb-3">
                        <Badge variant={tool.isFree ? 'default' : 'destructive'} className={`text-xs py-0.5 px-2 ${tool.isFree ? 'bg-green-600/20 text-green-400 border-green-600/30' : 'bg-red-600/20 text-red-400 border-red-600/30'}`}>
                           {tool.isFree ? 'Free' : 'Paid'}
                        </Badge>
                        <div className="flex items-center">
                           <Star className="h-3 w-3 mr-1 text-yellow-500 fill-yellow-500"/>
                           {tool.rating.toFixed(1)}
                        </div>
                     </div>
                     {/* Button is inside the Link, make it non-interactive visually */}
                     <Button variant="outline" size="sm" className="w-full group-hover:bg-accent group-hover:text-accent-foreground transition-colors duration-300 mt-auto pointer-events-none">
                       View Tool <ArrowRight className="ml-1 h-4 w-4 group-hover:translate-x-0.5 transition-transform duration-300" />
                     </Button>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        ) : (
          <p className="text-center text-muted-foreground mt-8">No tools found in this category yet.</p>
        )}
      </section>
    </main>
  );
}
