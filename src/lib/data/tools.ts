
// In a real application, this data will come from the MongoDB database via API calls.

import type { LucideIcon } from 'lucide-react';
import { Zap, FileText, Scissors, Video, Code, Star, StarHalf, CheckCircle, Home, ChevronRight, Send, ArrowLeft, ArrowRight } from 'lucide-react'; // Added CheckCircle
import * as React from 'react';

// Define Tool and Comment types based on Mongoose schemas
export interface Comment {
    _id?: string;
    name: string;
    comment: string;
    timestamp: string | Date; // Allow Date object as well
}

export interface Tool {
    _id: string;
    slug: string;
    name: string;
    image?: string;
    categorySlug: string;
    isFree: boolean;
    rating: number;
    summary: string;
    description: string; // Can contain HTML
    usageSteps: { text: string; iconName?: string }[];
    websiteLink: string;
    tags: string[];
    comments: Comment[];
    relatedToolIds?: string[]; // Store slugs of related tools
    createdAt: string | Date;
    updatedAt: string | Date;
}

export interface Category {
  _id: string;
  slug: string;
  name: string;
  description: string;
  iconName: string;
  imageURL?: string;
  tags: string[];
  createdAt: string | Date;
}

// API Response Structure
interface ApiResponse<T> {
    success: boolean;
    data: T | null;
    error: string | null;
}


export const iconMap: { [key: string]: LucideIcon } = {
    Zap,
    FileText,
    Scissors,
    Video,
    Code,
    Star,
    StarHalf,
    CheckCircle,
    Home,
    ChevronRight,
    Send,
    ArrowLeft,
    ArrowRight
    // Add more mappings as needed for tool steps or other icons
};

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "https://toolshub4u-backend.onrender.com/api";

// Log warning only once, ideally on module load, and only on client-side if relevant for client logic
if (typeof window !== 'undefined' && !process.env.NEXT_PUBLIC_API_BASE_URL) {
    console.warn(
        '\x1b[33m%s\x1b[0m', // Yellow text
        'Warning: NEXT_PUBLIC_API_BASE_URL environment variable is not set in .env file. Falling back to default https://toolshub4u-backend.onrender.com/api'
    );
}


export const getAbsoluteUrl = (path: string): string => {
    if (path.startsWith('http')) {
        return path;
    }
    // API_BASE_URL already includes /api, so we just need to append the specific path.
    // Ensure API_BASE_URL doesn't have a trailing slash and path has a leading slash.
    const base = API_BASE_URL.replace(/\/$/, '');
    const normalizedPath = path.startsWith('/') ? path : `/${path}`;
    return `${base}${normalizedPath}`;
};

export const getAllTools = async (): Promise<Tool[]> => {
    try {
        const url = getAbsoluteUrl('/tools');
        console.log(`Fetching all tools from: ${url}`); // Log the URL being fetched
        const response = await fetch(url);
        const result: ApiResponse<Tool[]> = await response.json();

        if (!response.ok || !result.success) {
            const errorText = result.error || await response.text(); // Get more details on the error
            console.error(`Error fetching all tools. Status: ${response.status}, URL: ${url}, Response: ${JSON.stringify(result)} Body: ${errorText}`);
            throw new Error(`HTTP error! status: ${response.status} fetching ${url}. Response: ${errorText}`);
        }
        return result.data || [];
    } catch (error) {
        console.error("Error in getAllTools:", error);
        return [];
    }
};

export const getToolBySlug = async (slug: string): Promise<Tool | null> => {
    try {
        const url = getAbsoluteUrl(`/tools/${slug}`);
        console.log(`Fetching tool by slug from: ${url}`);
        const response = await fetch(url);
        const result: ApiResponse<Tool> = await response.json();

        if (!response.ok) {
             if (response.status === 404) return null;
             const errorText = result.error || await response.text();
             console.error(`Error fetching tool ${slug}. Status: ${response.status}, URL: ${url}, Response: ${JSON.stringify(result)}, Body: ${errorText}`);
             throw new Error(result.error || `HTTP error! status: ${response.status} fetching ${url}. Body: ${errorText}`);
        }
        return result.data;
    } catch (error) {
        console.error(`Error in getToolBySlug for ${slug}:`, error);
        return null;
    }
};

export const getAllCategories = async (): Promise<Category[]> => {
    try {
        const url = getAbsoluteUrl('/categories'); // Corrected endpoint
        console.log(`Fetching all categories from: ${url}`);
        const response = await fetch(url);
        const result: ApiResponse<Category[]> = await response.json();

        if (!response.ok || !result.success) {
            const errorText = result.error || await response.text();
            console.error(`Error fetching all categories. Status: ${response.status}, URL: ${url}, Response: ${JSON.stringify(result)}, Body: ${errorText}`);
            throw new Error(result.error || `HTTP error! status: ${response.status} fetching ${url}. Body: ${errorText}`);
        }
        return result.data || [];
    } catch (error) {
        console.error("Error in getAllCategories:", error);
        return [];
    }
};

export const getToolsByCategorySlug = async (categorySlug: string): Promise<Tool[]> => {
    try {
        const url = getAbsoluteUrl(`/categories/${categorySlug}/tools`);
        console.log(`Fetching tools for category ${categorySlug} from: ${url}`);
        const response = await fetch(url);
        const result: ApiResponse<Tool[]> = await response.json();

        if (!response.ok) {
            if (response.status === 404 && !result.success) return [];
            const errorText = result.error || await response.text();
            console.error(`Error fetching tools for category ${categorySlug}. Status: ${response.status}, URL: ${url}, Response: ${JSON.stringify(result)}, Body: ${errorText}`);
            throw new Error(result.error || `HTTP error! status: ${response.status} fetching ${url}. Body: ${errorText}`);
        }
        return result.data || [];
    } catch (error) {
        console.error(`Error in getToolsByCategorySlug for ${categorySlug}:`, error);
        return [];
    }
};

export const addCommentToTool = async (toolSlug: string, name: string, comment: string): Promise<Comment | null> => {
    try {
        const url = getAbsoluteUrl(`/tools/${toolSlug}/comments`);
        console.log(`Adding comment to ${toolSlug} via: ${url}`);
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name, comment }),
        });
        const result: ApiResponse<Comment> = await response.json();

        if (!response.ok || !result.success) {
            const errorText = result.error || await response.text();
            console.error(`Error adding comment. Status: ${response.status}, Response: ${JSON.stringify(result)}, Body: ${errorText}`);
            throw new Error(result.error || `HTTP error! status: ${response.status}. Body: ${errorText}`);
        }
        return result.data;
    } catch (error) {
        console.error(`Error in addCommentToTool for ${toolSlug}:`, error);
        return null;
    }
};

export const getCommentsForTool = async (toolSlug: string): Promise<Comment[]> => {
    try {
        const url = getAbsoluteUrl(`/tools/${toolSlug}/comments`);
        console.log(`Fetching comments for ${toolSlug} from: ${url}`);
        const response = await fetch(url);
        const result: ApiResponse<Comment[]> = await response.json();

        if (!response.ok) {
            if (response.status === 404 && !result.success) return [];
            const errorText = result.error || await response.text();
            console.error(`Error fetching comments for ${toolSlug}. Status: ${response.status}, URL: ${url}, Response: ${JSON.stringify(result)}, Body: ${errorText}`);
            throw new Error(result.error || `HTTP error! status: ${response.status} fetching ${url}. Body: ${errorText}`);
        }
        return result.data || [];
    } catch (error) {
        console.error(`Error in getCommentsForTool for ${toolSlug}:`, error);
        return [];
    }
};

export const getAllComments = async (): Promise<Comment[]> => {
    try {
        const url = getAbsoluteUrl('/comments');
        console.log(`Fetching all comments from: ${url}`);
        const response = await fetch(url);
        const result: ApiResponse<Comment[]> = await response.json();

        if (!response.ok || !result.success) {
            const errorText = result.error || await response.text();
            console.error(`Error fetching all comments. Status: ${response.status}, URL: ${url}, Response: ${JSON.stringify(result)}, Body: ${errorText}`);
            throw new Error(result.error || `HTTP error! status: ${response.status} fetching ${url}. Body: ${errorText}`);
        }
        return result.data || [];
    } catch (error) {
        console.error("Error in getAllComments:", error);
        return [];
    }
};


export const getIconComponent = (iconName: string): LucideIcon => {
    return iconMap[iconName] || Zap;
};

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

export const getFeaturedTools = async (): Promise<Tool[]> => {
    const allTools = await getAllTools();
    return allTools
        .sort((a, b) => {
            if (b.rating !== a.rating) {
                return b.rating - a.rating;
            }
            const dateA = new Date(a.createdAt).getTime();
            const dateB = new Date(b.createdAt).getTime();
            return dateB - dateA;
        })
        .slice(0, 6);
};


export const getRelatedTools = async (currentTool: Tool): Promise<Tool[]> => {
    const allTools = await getAllTools();
    const otherTools = allTools.filter(t => t.slug !== currentTool.slug);

    const sameCategoryTools = otherTools
        .filter(t => t.categorySlug === currentTool.categorySlug)
        .sort((a, b) => b.rating - a.rating);

    let related = [...sameCategoryTools];
    if (related.length < 3) {
        const otherHighlyRatedTools = otherTools
            .filter(t => t.categorySlug !== currentTool.categorySlug)
            .sort((a, b) => b.rating - a.rating);
        related = [...related, ...otherHighlyRatedTools].slice(0, 3);
    }

    return related.slice(0, 3);
};

export const addToolToBackend = async (toolData: Omit<Tool, '_id' | 'createdAt' | 'updatedAt' | 'comments'>): Promise<Tool | null> => {
    try {
        const url = getAbsoluteUrl('/tools/add');
        console.log(`Adding tool to backend via: ${url} with payload:`, toolData);
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(toolData),
        });
        const result: ApiResponse<Tool> = await response.json();

        if (!response.ok || !result.success) {
            const errorText = result.error || await response.text();
            console.error(`Error adding tool to backend. Status: ${response.status}, Response: ${JSON.stringify(result)}, Body: ${errorText}`);
            throw new Error(`Failed to add tool: ${errorText}`);
        }
        console.log("Tool added successfully via backend:", result.data);
        return result.data;
    } catch (error) {
        console.error("Error in addToolToBackend:", error);
        return null;
    }
};

export const addCategoryToBackend = async (categoryData: Omit<Category, '_id' | 'createdAt'>): Promise<Category | null> => {
    try {
        const url = getAbsoluteUrl('/categories/add');
        console.log(`Adding category to backend via: ${url} with payload:`, categoryData);
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(categoryData),
        });
        const result: ApiResponse<Category> = await response.json();

        if (!response.ok || !result.success) {
            const errorText = result.error || await response.text();
            console.error(`Error adding category to backend. Status: ${response.status}, Response: ${JSON.stringify(result)}, Body: ${errorText}`);
            throw new Error(`Failed to add category: ${errorText}`);
        }
        console.log("Category added successfully via backend:", result.data);
        return result.data;
    } catch (error) {
        console.error("Error in addCategoryToBackend:", error);
        return null;
    }
};

// Added for Admin Dashboard types
export type { Tool as APITool, Category as APICategoryType };

    
