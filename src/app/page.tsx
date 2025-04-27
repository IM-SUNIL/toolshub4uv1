

'use client';

import type { NextPage } from 'next';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Search, ArrowRight, CheckCircle, Gift, Lock, Star } from 'lucide-react'; // Import Star icon
import Link from 'next/link'; // Import Link for navigation
import { getAllCategories, getFeaturedTools } from '@/lib/data/tools'; // Import data loading functions
import Image from 'next/image'; // Import Image for tool cards

const whyUsFeatures = [
  { icon: Gift, title: 'Free Forever', description: 'Access many tools without any cost.' },
  { icon: Lock, title: 'No Signup Required', description: 'Use tools instantly, no account needed.' },
  { icon: CheckCircle, title: 'Curated Tools Only', description: 'Handpicked, high-quality tools.' },
];

const Home: NextPage = () => {
  const featuredTools = getFeaturedTools(); // Fetch featured tools
  const popularCategories = getAllCategories().slice(0, 6); // Fetch popular categories

  return (
    <div className="flex flex-col items-center">
      {/* Hero Section */}
      <section className="w-full h-[calc(70vh-14px)] md:h-[calc(50vh-14px)] flex flex-col justify-center items-center text-center px-4 relative overflow-hidden pt-[2px]">
         <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background opacity-50 dark:opacity-80 z-0"></div>
        <div className="z-10 relative">
           <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-extrabold mb-6 tracking-tight leading-tight animated-text-gradient px-4 sm:px-6 md:px-8">
            Your Ultimate Hub for Free Online Tools.
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-3xl mx-auto px-4">
            AI Tools, PDF Converters, Resume Builders and more – all in one place.
          </p>
          <Link href="#featured-tools" passHref>
              <Button size="lg" className="group transition-transform duration-300 hover:scale-105 hover:shadow-lg hover:shadow-accent/30">
                  Explore Tools <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
              </Button>
          </Link>
        </div>
      </section>

      {/* Search Bar Section */}
      <section className="w-full max-w-3xl px-4 mt-10 z-20 mb-12">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search for AI tools, converters, and more…"
            className="w-full pl-12 pr-4 py-6 rounded-lg shadow-lg focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-0 border-0"
            aria-label="Search for tools"
          />
        </div>
      </section>

       {/* Popular Categories Grid Section */}
       <section className="w-full max-w-6xl px-4 pt-0 pb-8 mb-8 relative">
        <h2 className="text-3xl font-bold text-center mb-12">Popular Categories</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 gap-6">
          {popularCategories.map((category) => {
            const CategoryIcon = category.icon; // Get the icon component
            return (
              <Link href={`/categories/${category.slug}`} key={category.slug} className="block h-full group">
                  <Card className="text-center p-6 bg-card hover:border-accent border border-transparent transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-accent/20 cursor-pointer flex flex-col items-center justify-start h-full rounded-lg">
                    {CategoryIcon && <CategoryIcon className="h-10 w-10 text-accent mx-auto mb-4 group-hover:scale-110 transition-transform" />}
                    <h3 className="text-lg font-semibold mb-2">{category.name}</h3>
                    {category.description && (
                      <p className="text-sm text-muted-foreground flex-grow">{category.description}</p>
                    )}
                  </Card>
              </Link>
            );
          })}
        </div>
        {/* Blurred Gradient Overlay */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background via-background/80 to-transparent backdrop-blur-sm pointer-events-none z-10"></div>
      </section>

      {/* Explore More Categories Button Section */}
       <section className="w-full max-w-6xl px-4 mb-16 flex justify-center -mt-8 z-20">
           <Link href="/categories" passHref>
              <Button
                 variant="outline"
                 size="lg"
                 className="group transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-accent/30 hover:border-accent bg-background/80 backdrop-blur-md border-border h-11 px-6 py-3 sm:px-8 sm:py-4"
              >
                 Explore More Categories
                 <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
              </Button>
           </Link>
      </section>


      {/* Featured Tools Section */}
      <section id="featured-tools" className="w-full max-w-6xl px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-12">Featured Tools</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {featuredTools.map((tool) => {
            const CategoryIcon = tool.categoryIcon; // Get the icon component
            return (
               <Link key={tool.id} href={`/tools/${tool.id}`} className="block h-full group">
                  <Card className="bg-card hover:border-accent transition-colors duration-300 group transform hover:-translate-y-1 hover:shadow-xl cursor-pointer flex flex-col h-full rounded-lg">
                     {/* Tool Image */}
                     <div className="relative w-full aspect-video overflow-hidden rounded-t-lg">
                        <Image
                           src={tool.image || 'https://picsum.photos/300/169'} // Use tool image or fallback
                           alt={`${tool.name} thumbnail`}
                           layout="fill"
                           objectFit="cover"
                           className="transition-transform duration-300 group-hover:scale-105"
                           unoptimized // If using external URLs like picsum
                           loading="lazy" // Added lazy loading
                        />
                     </div>
                    <CardHeader className="pb-2 pt-4 px-4">
                      <div className="flex items-center gap-2 mb-1">
                         {CategoryIcon && <CategoryIcon className="h-4 w-4 text-accent flex-shrink-0" />}
                         <CardTitle className="text-base font-semibold line-clamp-1">{tool.name}</CardTitle>
                      </div>
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
                       {/* "View Tool" Button stays inside CardContent, not nested in Link */}
                       <Button variant="outline" size="sm" className="w-full group-hover:bg-accent group-hover:text-accent-foreground transition-colors duration-300 mt-auto">
                         View Tool <ArrowRight className="ml-1 h-4 w-4 group-hover:translate-x-0.5 transition-transform duration-300" />
                       </Button>
                    </CardContent>
                  </Card>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Why Toolshub4u? Section */}
      <section className="w-full max-w-6xl px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-12">Why Choose Toolshub4u?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          {whyUsFeatures.map((feature, index) => (
            <div key={index}>
              <feature.icon className="h-12 w-12 text-accent mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;
