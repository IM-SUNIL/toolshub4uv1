
'use client';

import * as React from 'react';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Search } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { getAllCategories, getIconComponent, Category } from '@/lib/data/tools'; // Import data loading function and types
import { Skeleton } from '@/components/ui/skeleton'; // Import Skeleton

// Metadata can be defined in layout.tsx or a separate metadata file if needed globally or higher up.
// export const metadata: Metadata = { ... }; // Removed from client component

export default function CategoriesPage() {
  const [searchTerm, setSearchTerm] = React.useState('');
  const [allCategories, setAllCategories] = React.useState<Category[]>([]);
  const [filteredCategories, setFilteredCategories] = React.useState<Category[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);

  // Fetch categories dynamically on component mount
  React.useEffect(() => {
      const fetchCategories = async () => {
          setIsLoading(true);
          try {
              const data = await getAllCategories();
              setAllCategories(data);
              setFilteredCategories(data); // Initially show all categories
          } catch (error) {
              console.error("Failed to fetch categories:", error);
              // Handle error state if needed
          } finally {
              setIsLoading(false);
          }
      };
      fetchCategories();
  }, []); // Empty dependency array ensures this runs only once

  // Filter categories based on search term
  React.useEffect(() => {
    const lowerCaseSearchTerm = searchTerm.toLowerCase().trim();
    if (!lowerCaseSearchTerm) {
      setFilteredCategories(allCategories);
      return;
    }

    const filtered = allCategories.filter(category =>
      category.name.toLowerCase().includes(lowerCaseSearchTerm) ||
      (category.description && category.description.toLowerCase().includes(lowerCaseSearchTerm)) ||
      (category.tags && category.tags.some(tag => tag.toLowerCase().includes(lowerCaseSearchTerm)))
    );
    setFilteredCategories(filtered);
  }, [searchTerm, allCategories]);

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
        {isLoading ? (
            // Loading State Skeletons
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
                {[...Array(8)].map((_, index) => ( // Show placeholders for categories
                    <Card key={index} className="p-6 flex flex-col items-center justify-start h-full rounded-lg">
                        <Skeleton className="h-10 w-10 rounded-full mb-4" />
                        <Skeleton className="h-6 w-3/4 mb-2" />
                        <Skeleton className="h-4 w-full" />
                    </Card>
                ))}
            </div>
        ) : filteredCategories.length > 0 ? (
          // Categories Loaded and Found
          <motion.div
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6"
            initial="hidden"
            animate="visible"
            variants={{ visible: { transition: { staggerChildren: 0.05 } } }}
          >
            {filteredCategories.map((category, index) => {
              const CategoryIcon = getIconComponent(category.iconName); // Get the icon component dynamically
              return (
                // Link to the specific category page using the slug
                <Link href={`/categories/${category.slug}`} key={category.slug} className="block h-full group">
                   <motion.div
                     variants={cardVariants}
                     custom={index}
                     initial="hidden"
                     animate="visible"
                     whileHover={{ scale: 1.05, transition: { duration: 0.2 } }}
                   >
                      <Card className="text-center p-6 bg-card border border-border hover:border-accent transition-all duration-300 hover:shadow-lg hover:shadow-accent/20 cursor-pointer flex flex-col items-center justify-start h-full rounded-lg">
                      {CategoryIcon && <CategoryIcon className="h-10 w-10 text-accent mx-auto mb-4 group-hover:scale-110 transition-transform duration-300" />}
                      <h3 className="text-lg font-semibold mb-2">{category.name}</h3>
                      <p className="text-sm text-muted-foreground flex-grow">{category.description}</p>
                      </Card>
                   </motion.div>
                </Link>
              );
            })}
          </motion.div>
        ) : (
          // No Categories Found Message
          <p className="text-center text-muted-foreground mt-8">No categories found matching your search.</p>
        )}
      </section>
    </main>
  );
}
