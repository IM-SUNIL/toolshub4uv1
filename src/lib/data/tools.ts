
// In a real application, this data will come from the MongoDB database via API calls.

import type { LucideIcon } from 'lucide-react';
import { Zap, FileText, Scissors, Video, Code, Star, StarHalf, CheckCircle } from 'lucide-react'; // Added CheckCircle
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
    // Add more mappings as needed for tool steps or other icons
};

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

if (typeof window !== 'undefined' && !API_BASE_URL) { // Log warning only on client-side if not set
    console.warn(
        '\x1b[33m%s\x1b[0m', // Yellow text
        'Warning: NEXT_PUBLIC_API_BASE_URL environment variable is not set.'
    );
    console.warn(
        'Client-side API calls will use relative paths. This is usually fine if Next.js dev server handles proxying or if served from the same domain as the API in production (e.g. via Firebase Hosting rewrites).'
    );
    console.warn(
        'For local development with Firebase emulators, if you encounter issues with API calls, ensure NEXT_PUBLIC_API_BASE_URL is set in .env.local to point to your functions emulator URL, typically: http://127.0.0.1:5001/your-project-id/your-region/api'
    );
}


export const getAbsoluteUrl = (path: string): string => {
    if (path.startsWith('http')) {
        return path;
    }
    // For server-side rendering/fetching (e.g. in Server Components, getStaticProps, getServerSideProps),
    // API_BASE_URL is crucial.
    if (typeof window === 'undefined' && !API_BASE_URL) {
        console.error(
            '\x1b[31m%s\x1b[0m', // Red text
            `CRITICAL: NEXT_PUBLIC_API_BASE_URL is not set. Server-side fetch for path "${path}" will likely fail.`
        );
        // Attempting a relative path server-side usually fails or hits the wrong host.
        // For now, returning the relative path and letting it fail to highlight the issue.
        return path;
    }

    // For client-side, if API_BASE_URL is not set, use relative path.
    if (typeof window !== 'undefined' && !API_BASE_URL) {
        return path; // e.g., /api/tools
    }
    // If API_BASE_URL is set, use it for both client and server.
    return `${API_BASE_URL!.replace(/\/$/, '')}/${path.replace(/^\//, '')}`;
};

export const getAllTools = async (): Promise<Tool[]> => {
    try {
        const url = getAbsoluteUrl('/api/tools');
        console.log(`Fetching all tools from: ${url}`);
        const response = await fetch(url);
        const result: ApiResponse<Tool[]> = await response.json();

        if (!response.ok || !result.success) {
            const errorMsg = result.error || `HTTP error! status: ${response.status} fetching ${url}`;
            console.error(`Error fetching all tools. Status: ${response.status}, URL: ${url}, Response: ${JSON.stringify(result)}`);
            throw new Error(errorMsg);
        }
        return result.data || [];
    } catch (error) {
        console.error("Error in getAllTools:", error);
        return [];
    }
};

export const getToolBySlug = async (slug: string): Promise<Tool | null> => {
    try {
        const url = getAbsoluteUrl(`/api/tools/${slug}`);
        console.log(`Fetching tool by slug from: ${url}`);
        const response = await fetch(url);
        const result: ApiResponse<Tool> = await response.json();

        if (!response.ok) {
             if (response.status === 404) return null;
             const errorMsg = result.error || `HTTP error! status: ${response.status} fetching ${url}`;
             console.error(`Error fetching tool ${slug}. Status: ${response.status}, URL: ${url}, Response: ${JSON.stringify(result)}`);
             throw new Error(errorMsg);
        }
        return result.data;
    } catch (error) {
        console.error(`Error in getToolBySlug for ${slug}:`, error);
        return null;
    }
};

export const getAllCategories = async (): Promise<Category[]> => {
    try {
        const url = getAbsoluteUrl('/api/categories');
        console.log(`Fetching all categories from: ${url}`);
        const response = await fetch(url);
        const result: ApiResponse<Category[]> = await response.json();

        if (!response.ok || !result.success) {
            const errorMsg = result.error || `HTTP error! status: ${response.status} fetching ${url}`;
            console.error(`Error fetching all categories. Status: ${response.status}, URL: ${url}, Response: ${JSON.stringify(result)}`);
            throw new Error(errorMsg);
        }
        return result.data || [];
    } catch (error) {
        console.error("Error in getAllCategories:", error);
        return [];
    }
};

export const getToolsByCategorySlug = async (categorySlug: string): Promise<Tool[]> => {
    try {
        const url = getAbsoluteUrl(`/api/categories/${categorySlug}/tools`);
        console.log(`Fetching tools for category ${categorySlug} from: ${url}`);
        const response = await fetch(url);
        const result: ApiResponse<Tool[]> = await response.json();

        if (!response.ok) {
            if (response.status === 404 && !result.success) return []; // Category might exist but have no tools or category itself not found
            const errorMsg = result.error || `HTTP error! status: ${response.status} fetching ${url}`;
            console.error(`Error fetching tools for category ${categorySlug}. Status: ${response.status}, URL: ${url}, Response: ${JSON.stringify(result)}`);
            throw new Error(errorMsg);
        }
        return result.data || [];
    } catch (error) {
        console.error(`Error in getToolsByCategorySlug for ${categorySlug}:`, error);
        return [];
    }
};

export const addCommentToTool = async (toolSlug: string, name: string, comment: string): Promise<Comment | null> => {
    try {
        const url = getAbsoluteUrl(`/api/tools/${toolSlug}/comments`);
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
            console.error(`Error adding comment. Status: ${response.status}, Response: ${JSON.stringify(result)}`);
            throw new Error(result.error || `HTTP error! status: ${response.status}`);
        }
        return result.data;
    } catch (error) {
        console.error(`Error in addCommentToTool for ${toolSlug}:`, error);
        return null;
    }
};

export const getCommentsForTool = async (toolSlug: string): Promise<Comment[]> => {
    try {
        const url = getAbsoluteUrl(`/api/tools/${toolSlug}/comments`);
        console.log(`Fetching comments for ${toolSlug} from: ${url}`);
        const response = await fetch(url);
        const result: ApiResponse<Comment[]> = await response.json();

        if (!response.ok) {
            if (response.status === 404 && !result.success) return [];
            const errorMsg = result.error || `HTTP error! status: ${response.status} fetching ${url}`;
            console.error(`Error fetching comments for ${toolSlug}. Status: ${response.status}, URL: ${url}, Response: ${JSON.stringify(result)}`);
            throw new Error(errorMsg);
        }
        return result.data || [];
    } catch (error) {
        console.error(`Error in getCommentsForTool for ${toolSlug}:`, error);
        return [];
    }
};

// New function to fetch all comments (if needed for an admin panel or similar)
export const getAllComments = async (): Promise<Comment[]> => {
    try {
        const url = getAbsoluteUrl('/api/comments');
        console.log(`Fetching all comments from: ${url}`);
        const response = await fetch(url);
        const result: ApiResponse<Comment[]> = await response.json();

        if (!response.ok || !result.success) {
            const errorMsg = result.error || `HTTP error! status: ${response.status} fetching ${url}`;
            console.error(`Error fetching all comments. Status: ${response.status}, URL: ${url}, Response: ${JSON.stringify(result)}`);
            throw new Error(errorMsg);
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
    return allTools.sort((a, b) => b.rating - a.rating).slice(0, 6);
};

export const getRelatedTools = async (tool: Tool): Promise<Tool[]> => {
    const categoryTools = await getToolsByCategorySlug(tool.categorySlug);
    return categoryTools.filter(t => t._id !== tool._id).slice(0, 3);
};
