
'use client';

import * as React from 'react';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Search, Zap, FileText, Code, Video, Scissors } from 'lucide-react'; // Add more icons as needed
import Link from 'next/link';
import { motion } from 'framer-motion';

// Define category data (consider moving to a shared location like src/lib/data/categories.ts)
const allCategories = [
  { name: 'PDF Tools', icon: FileText, description: 'Convert, merge, split PDFs', link: '/categories/pdf-tools', slug: 'pdf-tools' }, // Changed link to future dynamic route if needed, added slug
  { name: 'AI Tools', icon: Zap, description: 'Generators, enhancers, assistants', link: '/categories/ai-tools', slug: 'ai-tools' },
  { name: 'Coding Utilities', icon: Code, description: 'Formatters, linters, snippets', link: '/categories/coding-utilities', slug: 'coding-utilities' },
  { name: 'Video Editors', icon: Video, description: 'Cut, trim, merge videos online', link: '/categories/video-tools', slug: 'video-tools' },
  { name: 'Image Tools', icon: Scissors, description: 'Background removal, resizing', link: '/categories/image-tools', slug: 'image-tools' },
  { name: 'Writing Aids', icon: FileText, description: 'Grammar checkers, summarizers', link: '/categories/writing-aids', slug: 'writing-aids' },
  // Add more categories here...
];

export default function CategoriesPage() {
  const [searchTerm, setSearchTerm] = React.useState('');
  const [filteredCategories, setFilteredCategories] = React.useState(allCategories);

  React.useEffect(() => {
    const lowerCaseSearchTerm = searchTerm.toLowerCase().trim();
    if (!lowerCaseSearchTerm) {
      setFilteredCategories(allCategories);
      return;
    }

    const filtered = allCategories.filter(category =>
      category.name.toLowerCase().includes(lowerCaseSearchTerm) ||
      category.description.toLowerCase().includes(lowerCaseSearchTerm)
    );
    setFilteredCategories(filtered);
  }, [searchTerm]);

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.05, // Staggered animation
        duration: 0.3,
      },
    }),
  };

  return (
    <main className="container mx-auto px-4 md:px-10 py-8 max-w-6xl pt-[2px]">
      {/* Search Bar Section */}
      <section className="w-full max-w-xl mx-auto mt-6 mb-8"> {/* Added mt-6 */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            type="search"
            id="category-search"
            placeholder="Search for Categories..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 rounded-lg bg-input border border-border focus:ring-2 focus:ring-accent/50 focus:border-accent shadow-md focus:shadow-accent/20 transition-shadow duration-200"
            aria-label="Search categories"
          />
        </div>
      </section>

      {/* Categories Grid Section */}
      <section className="w-full">
        {filteredCategories.length > 0 ? (
          <motion.div
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6"
            initial="hidden"
            animate="visible"
            variants={{ visible: { transition: { staggerChildren: 0.05 } } }} // Animate children together
          >
            {filteredCategories.map((category, index) => (
              // Using Link for Next.js client-side navigation
              <Link href={`/tools?category=${category.slug}`} key={category.slug} className="block h-full group">
                 {/* Assuming category pages show lists of tools for now, linking to a filtered tool list */}
                 {/* If you have specific static pages like /categories/ai-tools.html, use href={category.link + '.html'} */}
                 <motion.div
                   variants={cardVariants}
                   custom={index} // Pass index for staggered animation delay
                   initial="hidden"
                   animate="visible"
                   whileHover={{ scale: 1.05, transition: { duration: 0.2 } }} // Scale on hover
                 >
                    <Card className="text-center p-6 bg-card border border-border hover:border-accent transition-all duration-300 hover:shadow-lg hover:shadow-accent/20 cursor-pointer flex flex-col items-center justify-start h-full rounded-lg">
                    <category.icon className="h-10 w-10 text-accent mx-auto mb-4 group-hover:scale-110 transition-transform duration-300" />
                    <h3 className="text-lg font-semibold mb-2">{category.name}</h3>
                    <p className="text-sm text-muted-foreground flex-grow">{category.description}</p>
                    </Card>
                 </motion.div>
              </Link>
            ))}
          </motion.div>
        ) : (
          <p className="text-center text-muted-foreground mt-8">No categories found matching your search.</p>
        )}
      </section>
    </main>
  );
}

// Export metadata if needed (optional, but good for SEO)
// Metadata must be defined outside the component if using 'use client'
// We'll move metadata to layout or keep the component as Server Component if metadata is critical here.
// For now, removing metadata export from this client component.
/*
export const metadata: Metadata = {
  title: 'Browse Categories - Toolshub4u',
  description: 'Explore all categories of free online tools available on Toolshub4u.',
};
*/
