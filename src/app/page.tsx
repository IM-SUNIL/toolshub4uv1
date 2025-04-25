

'use client';

import type { NextPage } from 'next';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Search, ArrowRight, Zap, FileText, Scissors, Video, Code, CheckCircle, Gift, Lock, Share2, Clock, Brush } from 'lucide-react'; // Added Share2, Clock, Brush
import Link from 'next/link'; // Import Link for the button
import { useRouter } from 'next/navigation'; // Import useRouter for navigation

const featuredTools = [
  { name: 'AI Content Generator', icon: Zap, description: 'Generate marketing copy in seconds.', tags: ['AI', 'Writing'], link: '#' },
  { name: 'PDF to Word Converter', icon: FileText, description: 'Convert PDF files to editable Word docs.', tags: ['PDF', 'Converter'], link: '#' },
  { name: 'Image Background Remover', icon: Scissors, description: 'Remove image backgrounds automatically.', tags: ['Image', 'AI'], link: '#' },
  { name: 'Online Video Editor', icon: Video, description: 'Simple video editing in your browser.', tags: ['Video', 'Editor'], link: '#' },
  { name: 'Code Formatter', icon: Code, description: 'Format your code snippets instantly.', tags: ['Coding', 'Utility'], link: '#' },
  { name: 'Resume Builder', icon: FileText, description: 'Create professional resumes easily.', tags: ['Career', 'Builder'], link: '#' },
];

const categories = [
   { name: 'Social Media Tools', icon: Share2, description: 'Schedulers, analytics, content helpers' },
   { name: 'SEO Utilities', icon: Search, description: 'Keyword research, rank tracking' },
   { name: 'Productivity Boosters', icon: Clock, description: 'Timers, task managers, note-taking' },
   { name: 'PDF Tools', icon: FileText, description: 'Convert, merge, split PDFs' },
   { name: 'AI Tools', icon: Zap, description: 'Generators, enhancers, assistants' },
   { name: 'Coding Utilities', icon: Code, description: 'Formatters, linters, snippets' },
   { name: 'Video Editors', icon: Video, description: 'Cut, trim, merge videos online' },
   { name: 'Image Tools', icon: Scissors, description: 'Background removal, resizing, filters' }, // Changed icon to Scissors
   { name: 'Writing Aids', icon: FileText, description: 'Grammar checkers, summarizers' },
];


const whyUsFeatures = [
  { icon: Gift, title: 'Free Forever', description: 'Access all tools without any cost.' },
  { icon: Lock, title: 'No Signup Required', description: 'Use tools instantly, no account needed.' },
  { icon: CheckCircle, title: 'Curated Tools Only', description: 'Handpicked, high-quality tools.' },
];

const Home: NextPage = () => {
  const router = useRouter(); // Initialize router

  // Placeholder function for button click - now runs on the client
  const handleExploreMore = () => {
    console.log("Explore More Categories clicked!");
    router.push('/categories'); // Navigate to /categories page
  };

  return (
    <div className="flex flex-col items-center">
      {/* Hero Section */}
      <section className="w-full h-[60vh] flex flex-col justify-center items-center text-center px-4 relative overflow-hidden pt-10"> {/* Reduced height, Added pt-10 */}
         <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background opacity-50 dark:opacity-80 z-0"></div>
        <div className="z-10 relative">
          {/* Apply animated text gradient class here */}
          <h1 className="text-4xl md:text-6xl font-extrabold mb-6 tracking-tight leading-tight animated-text-gradient"> {/* Increased mb-4 to mb-6 */}
            Your Ultimate Hub for Free Online Tools.
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-3xl mx-auto"> {/* Increased mb-8 to mb-10 */}
            AI Tools, PDF Converters, Resume Builders and more – all in one place.
          </p>
          <Button size="lg" className="group transition-transform duration-300 hover:scale-105 hover:shadow-lg hover:shadow-accent/30">
            Explore Tools <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
          </Button>
        </div>
      </section>

      {/* Search Bar Section */}
      <section className="w-full max-w-3xl px-4 -mt-10 z-20 mb-12"> {/* Increased mb-8 to mb-12 */}
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
      <section className="w-full max-w-6xl px-4 pt-0 pb-8 rounded-lg mb-8 relative"> {/* Removed mt-8 and pt-12, set pt-0 */}
        <h2 className="text-3xl font-bold text-center mb-12">Popular Categories</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {categories.slice(0, 9).map((category, index) => ( // Display first 9 categories
            <Card key={index} className="text-center p-6 bg-card hover:bg-card/80 dark:hover:bg-muted/80 transition-all duration-300 transform hover:scale-105 hover:shadow-lg cursor-pointer flex flex-col h-full">
              <category.icon className="h-10 w-10 text-accent mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">{category.name}</h3>
              <p className="text-sm text-muted-foreground flex-grow">{category.description}</p>
            </Card>
          ))}
        </div>
        {/* Blurred Gradient Overlay */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background via-background/80 to-transparent backdrop-blur-sm pointer-events-none z-10"></div>
      </section>

      {/* Explore More Categories Button Section */}
      <section className="w-full max-w-6xl px-4 mb-16 flex justify-center -mt-8 z-20"> {/* Positioned below overlay */}
          <Button
              variant="outline"
              size="lg"
              onClick={handleExploreMore}
              className="group transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-accent/30 hover:border-accent bg-background/80 backdrop-blur-md border-border px-6 py-3 sm:px-8 sm:py-4" // Added padding for better tappability
          >
              Explore More Categories
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
          </Button>
      </section>


      {/* Featured Tools Section */}
      <section className="w-full max-w-6xl px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-12">Featured Tools</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {featuredTools.map((tool, index) => (
            <Card key={index} className="bg-card hover:border-accent transition-colors duration-300 group transform hover:-translate-y-1 hover:shadow-xl cursor-pointer flex flex-col h-full">
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                   <tool.icon className="h-6 w-6 text-accent" />
                   <CardTitle className="text-lg font-semibold">{tool.name}</CardTitle>
                </div>
                <CardDescription>{tool.description}</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col justify-between flex-grow mt-auto">
                <div className="flex flex-wrap gap-2 mb-4">
                  {tool.tags.map((tag) => (
                    <Badge key={tag} variant="secondary">{tag}</Badge>
                  ))}
                </div>
                 {/* Use Link for navigation if 'tool.link' is a valid path */}
                 <Button asChild variant="outline" size="sm" className="w-full group-hover:bg-accent group-hover:text-accent-foreground transition-colors duration-300">
                    <Link href={tool.link}>
                      Visit Tool <ArrowRight className="ml-1 h-4 w-4 group-hover:translate-x-0.5 transition-transform duration-300" />
                    </Link>
                 </Button>
              </CardContent>
            </Card>
          ))}
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

