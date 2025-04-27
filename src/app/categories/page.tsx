
'use client';

import type { NextPage } from 'next';
import * as React from 'react';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Search, ArrowRight, Zap, FileText, Scissors, Video, Code, Share2, Clock, Brush } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion'; // Import framer-motion for animations


// Define category data (consider moving to a shared location like src/lib/data/categories.ts)
const allCategories = [
   { name: 'Social Media Tools', icon: Share2, description: 'Schedulers, analytics, content helpers', link: '#' },
   { name: 'SEO Utilities', icon: Search, description: 'Keyword research, rank tracking', link: '#' },
   { name: 'Productivity Boosters', icon: Clock, description: 'Timers, task managers, note-taking', link: '#' },
   { name: 'Design Aids', icon: Brush, description: 'Color pickers, font finders, mockups', link: '#' },
   { name: 'Marketing Helpers', icon: Zap, description: 'Email signature generators, QR codes', link: '#' },
   { name: 'Developer Tools', icon: Code, description: 'JSON formatters, Base64 encoders', link: '#' },
   { name: 'PDF Tools', icon: FileText, description: 'Convert, merge, split PDFs', link: '#' },
   { name: 'AI Tools', icon: Zap, description: 'Generators, enhancers, assistants', link: '#' },
   { name: 'Coding Utilities', icon: Code, description: 'Formatters, linters, snippets', link: '#' },
   { name: 'Video Editors', icon: Video, description: 'Cut, trim, merge videos online', link: '#' },
   { name: 'Image Tools', icon: Scissors, description: 'Background removal, resizing', link: '#' }, // Use Scissors icon
   { name: 'Writing Aids', icon: FileText, description: 'Grammar checkers, summarizers', link: '#' },
   // Add more categories as needed
];

// Animation variants for card fade-in
const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.05, // Staggered delay
      duration: 0.3,
      ease: "easeOut"
    }
  })
};


const CategoriesPage: NextPage = () => {
  const [searchTerm, setSearchTerm] = React.useState('');

  const filteredCategories = allCategories.filter(category =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (category.description && category.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  return (
    <div className="flex flex-col items-center min-h-screen pt-[2px] px-4 md:px-10 pb-10"> {/* Adjusted top padding to 2px */}

      {/* Search Bar Section */}
      <section className="w-full max-w-xl my-8"> {/* Added margin-top and margin-bottom */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search for Categories..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="w-full pl-12 pr-4 py-3 rounded-lg shadow-md focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-0 border hover:border-accent transition-colors duration-300 focus:border-accent focus:shadow-accent/20"
            aria-label="Search categories"
          />
        </div>
      </section>

      {/* Categories Grid Section */}
      <section className="w-full max-w-6xl">
        {filteredCategories.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
            {filteredCategories.map((category, index) => (
              <motion.div
                key={category.name}
                custom={index}
                initial="hidden"
                animate="visible"
                variants={cardVariants}
                className="h-full" // Ensure motion div takes full height
              >
                <Link href={category.link || '#'} className="block h-full group">
                  <Card className="text-center p-4 sm:p-6 bg-card hover:border-accent border border-transparent transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-accent/20 cursor-pointer flex flex-col items-center justify-start h-full"> {/* Ensure card takes full height */}
                    <category.icon className="h-8 w-8 sm:h-10 sm:w-10 text-accent mb-3 sm:mb-4 group-hover:scale-110 transition-transform" aria-label={`${category.name} icon`} />
                    <h3 className="text-base sm:text-lg font-semibold mb-1 sm:mb-2">{category.name}</h3>
                    {category.description && (
                      <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2">{category.description}</p> // Allow 2 lines
                    )}
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        ) : (
          <p className="text-center text-muted-foreground mt-8">No categories found matching "{searchTerm}".</p>
        )}
      </section>
    </div>
  );
};


export default CategoriesPage;
