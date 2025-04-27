// In a real application, this data would likely come from a database or API.
// For this version, we are reading from a local JSON file.

import type { LucideIcon } from 'lucide-react';
import { Zap, FileText, Scissors, Video, Code, CheckCircle, Star, StarHalf } from 'lucide-react';
import * as React from 'react'; // Import React for JSX in renderStars

// Import the JSON data directly. This works because JSON files can be imported like modules.
import toolsData from './tools.json';
import categoriesData from './categories.json'; // Import categories for mapping icons etc.

export interface Tool {
  id: string;
  name: string;
  image: string; // URL to the tool's image or logo
  categorySlug: string; // Reference to category by slug
  isFree: boolean;
  rating: number; // e.g., 4.5
  summary: string;
  description: string; // Can include markdown or basic HTML for formatting
  usageSteps: { iconName?: string; text: string }[]; // Use icon name string
  comments?: { id: string; name: string; comment: string; timestamp: string }[]; // Optional comments
  relatedToolIds?: string[]; // Optional IDs of related tools
  websiteLink: string; // Added website link
  tags: string[]; // Added tags
}

// Map category slugs to icons and full names for convenience
export const categoryDetailsMap = new Map<string, { name: string; icon: LucideIcon }>();
categoriesData.forEach(cat => {
    // Dynamically select the icon based on its name string
    let IconComponent: LucideIcon;
    switch (cat.iconName) {
        case 'Zap': IconComponent = Zap; break;
        case 'FileText': IconComponent = FileText; break;
        case 'Scissors': IconComponent = Scissors; break;
        case 'Video': IconComponent = Video; break;
        case 'Code': IconComponent = Code; break;
        // Add more cases as needed
        default: IconComponent = Zap; // Default icon
    }
    categoryDetailsMap.set(cat.slug, { name: cat.name, icon: IconComponent });
});


// Type assertion to treat the imported JSON as an array of Tool objects
export const allTools: Tool[] = toolsData as Tool[];

// Helper function to get a specific tool by ID
export const getToolById = (id: string): (Tool & { categoryName: string; categoryIcon: LucideIcon }) | undefined => {
  const tool = allTools.find(tool => tool.id === id);
  if (!tool) return undefined;

  const categoryDetails = categoryDetailsMap.get(tool.categorySlug);
  return {
    ...tool,
    categoryName: categoryDetails?.name || 'Unknown Category',
    categoryIcon: categoryDetails?.icon || Zap, // Provide a default icon
  };
};

// Helper function to get related tools
export const getRelatedTools = (tool: Tool): Tool[] => {
  if (!tool.relatedToolIds) return [];
  return allTools.filter(t => tool.relatedToolIds?.includes(t.id) && t.id !== tool.id).map(t => {
     const categoryDetails = categoryDetailsMap.get(t.categorySlug);
     return {
         ...t,
         categoryName: categoryDetails?.name || 'Unknown',
         categoryIcon: categoryDetails?.icon || Zap
     };
  });
};

// Helper function to render star ratings - Using React.createElement to avoid potential JSX issues in .ts file
export const renderStars = (rating: number): React.ReactNode[] => {
  const fullStars = Math.floor(rating);
  const halfStar = rating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);
  const stars: React.ReactNode[] = [];

  for (let i = 0; i < fullStars; i++) {
    stars.push(React.createElement(Star, { key: `full-${i}`, className: "h-5 w-5 fill-yellow-400 text-yellow-400" }));
  }
  if (halfStar) {
    stars.push(React.createElement(StarHalf, { key: "half", className: "h-5 w-5 fill-yellow-400 text-yellow-400" }));
  }
  for (let i = 0; i < emptyStars; i++) {
    stars.push(React.createElement(Star, { key: `empty-${i}`, className: "h-5 w-5 text-muted-foreground" }));
  }
  return stars;
};


// Helper function to get all categories with details
export const getAllCategories = () => {
    return categoriesData.map(cat => ({
        ...cat,
        icon: categoryDetailsMap.get(cat.slug)?.icon || Zap // Add the mapped icon
    }));
};

// Helper function to get tools by category slug
export const getToolsByCategory = (categorySlug: string): (Tool & { categoryName: string; categoryIcon: LucideIcon })[] => {
    return allTools
        .filter(tool => tool.categorySlug === categorySlug)
        .map(tool => {
            const categoryDetails = categoryDetailsMap.get(tool.categorySlug);
            return {
                ...tool,
                categoryName: categoryDetails?.name || 'Unknown Category',
                categoryIcon: categoryDetails?.icon || Zap,
            };
        });
};


// Helper function to get featured tools (example: first 6 tools)
export const getFeaturedTools = (): (Tool & { categoryName: string; categoryIcon: LucideIcon })[] => {
    return allTools.slice(0, 6).map(tool => {
        const categoryDetails = categoryDetailsMap.get(tool.categorySlug);
        return {
            ...tool,
            categoryName: categoryDetails?.name || 'Unknown',
            categoryIcon: categoryDetails?.icon || Zap
        };
    });
};
