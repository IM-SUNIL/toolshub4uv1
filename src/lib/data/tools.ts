
// In a real application, this data will come from the MongoDB database via API calls.

import type { LucideIcon } from 'lucide-react';
import { Zap, FileText, Scissors, Video, Code, Star, StarHalf, CheckCircle, Home, ChevronRight, Send, ArrowLeft, ArrowRight } from 'lucide-react';
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

// Force HTTPS for the API base URL
const API_BASE_URL = "https://toolshub4u-backend.onrender.com/api";


export const getAbsoluteUrl = (path: string): string => {
    if (path.startsWith('https://') || path.startsWith('http://')) { // Check for full URLs
        return path;
    }
    // Ensure API_BASE_URL does not have a trailing slash and path starts with a slash
    const base = API_BASE_URL.replace(/\/$/, '');
    const normalizedPath = path.startsWith('/') ? path : `/${path}`;
    return `${base}${normalizedPath}`;
};

export const getAllTools = async (): Promise<Tool[]> => {
    const url = getAbsoluteUrl('/tools/all');
    console.log(`Fetching all tools from: ${url}`);
    try {
        const response = await fetch(url);

        if (!response.ok) {
            const errorBody = await response.text();
            console.error(`HTTP error fetching tools. Status: ${response.status}, URL: ${url}, Body: ${errorBody}`);
            return [];
        }

        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
            const errorBody = await response.text();
            console.error(`Expected JSON, but received ${contentType} when fetching all tools. URL: ${url}, Body: ${errorBody}`);
            return [];
        }
        
        const result: ApiResponse<Tool[]> = await response.json();

        if (!result.success) {
            console.error(`API error fetching all tools: ${result.error || 'Unknown API error'}. URL: ${url}, Full Response: ${JSON.stringify(result)}`);
            return [];
        }
        return result.data || [];
    } catch (error: any) { 
        console.error(`Network or JSON parsing error in getAllTools for ${url}:`, error);
        return [];
    }
};

export const getToolBySlug = async (slug: string): Promise<Tool | null> => {
    const url = getAbsoluteUrl(`/tools/${slug}`);
    console.log(`Fetching tool by slug from: ${url}`);
    try {
        const response = await fetch(url);

        if (!response.ok) {
            const errorBody = await response.text();
            console.error(`HTTP error fetching tool ${slug}. Status: ${response.status}, URL: ${url}, Body: ${errorBody}`);
            if (response.status === 404) return null;
            return null;
        }

        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
            const errorBody = await response.text();
            console.error(`Expected JSON, but received ${contentType} for tool ${slug}. URL: ${url}, Body: ${errorBody}`);
            return null;
        }

        const result: ApiResponse<Tool> = await response.json();
        if (!result.success) {
            console.error(`API error fetching tool ${slug}: ${result.error || 'Unknown API error'}. Full Response: ${JSON.stringify(result)}`);
            return null;
        }
        return result.data;
    } catch (error: any) {
        console.error(`Network or unexpected error in getToolBySlug for ${slug} (${url}):`, error);
        return null;
    }
};

export const getAllCategories = async (): Promise<Category[]> => {
    const url = getAbsoluteUrl('/categories'); 
    console.log(`Fetching all categories from: ${url}`);
    try {
        const response = await fetch(url);

        if (!response.ok) {
            const errorBody = await response.text(); 
            console.error(`HTTP error fetching categories. Status: ${response.status}, URL: ${url}, Body: ${errorBody}`);
            return [];
        }
        
        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
            const errorBody = await response.text();
            console.error(`Expected JSON, but received ${contentType} when fetching all categories. URL: ${url}, Body: ${errorBody}`);
            return [];
        }
        
        const result: ApiResponse<Category[]> = await response.json();

        if (!result.success) {
            console.error(`API error fetching all categories: ${result.error || 'Unknown API error'}. URL: ${url}, Full Response: ${JSON.stringify(result)}`);
            return [];
        }
        return result.data || [];
    } catch (error: any) { 
        console.error(`Network or JSON parsing error in getAllCategories for ${url}:`, error);
        return [];
    }
};

export const getToolsByCategorySlug = async (categorySlug: string): Promise<Tool[]> => {
    const url = getAbsoluteUrl(`/categories/${categorySlug}/tools`);
    console.log(`Fetching tools for category ${categorySlug} from: ${url}`);
    try {
        const response = await fetch(url);

        if (!response.ok) {
            const errorBody = await response.text();
            console.error(`HTTP error fetching tools for category ${categorySlug}. Status: ${response.status}, URL: ${url}, Body: ${errorBody}`);
            if (response.status === 404) return [];
            return [];
        }

        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
            const errorBody = await response.text();
            console.error(`Expected JSON, but received ${contentType} for category ${categorySlug} tools. URL: ${url}, Body: ${errorBody}`);
            return [];
        }

        const result: ApiResponse<Tool[]> = await response.json();
        if (!result.success) {
            console.error(`API error fetching tools for category ${categorySlug}: ${result.error || 'Unknown API error'}. Full Response: ${JSON.stringify(result)}`);
            return [];
        }
        return result.data || [];
    } catch (error: any) {
        console.error(`Network or unexpected error in getToolsByCategorySlug for ${categorySlug} (${url}):`, error);
        return [];
    }
};

export const addCommentToTool = async (toolSlug: string, name: string, comment: string): Promise<Comment | null> => {
    const url = getAbsoluteUrl(`/tools/${toolSlug}/comments`);
    console.log(`Adding comment to ${toolSlug} via: ${url}`);
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name, comment }),
        });

        const contentType = response.headers.get('content-type');
        
        if (!response.ok) {
            let errorDetail = `HTTP ${response.status} ${response.statusText}`;
            if (contentType && contentType.includes('application/json')) {
                try {
                    const errorResult: ApiResponse<any> = await response.json();
                    errorDetail = errorResult.error || JSON.stringify(errorResult);
                } catch (e) { /* ignore if parsing error response body fails */ }
            } else {
                try {
                    errorDetail = await response.text();
                } catch (e) { /* ignore if parsing error response body fails */ }
            }
            console.error(`Error adding comment. Status: ${response.status}, URL: ${url}, Details: ${errorDetail}`);
            throw new Error(`Failed to add comment: ${errorDetail}`);
        }

        if (!contentType || !contentType.includes('application/json')) {
            const responseBody = await response.text(); // Safe to read text now
            console.error(`Expected JSON response after adding comment, but received ${contentType}. URL: ${url}, Body: ${responseBody}`);
            throw new Error(`Unexpected response format from server after adding comment.`);
        }

        const result: ApiResponse<Comment> = await response.json();

        if (!result.success) {
            console.error(`API error adding comment (success:false): ${result.error || 'Unknown API error'}. URL: ${url}, Full Response: ${JSON.stringify(result)}`);
            throw new Error(result.error || `API reported failure adding comment.`);
        }
        
        return result.data;

    } catch (error: any) {
        console.error(`Network or unexpected error in addCommentToTool for ${toolSlug} (${url}):`, error);
        throw error; 
    }
};


export const getCommentsForTool = async (toolSlug: string): Promise<Comment[]> => {
    const url = getAbsoluteUrl(`/tools/${toolSlug}/comments`);
    console.log(`Fetching comments for ${toolSlug} from: ${url}`);
    try {
        const response = await fetch(url);

        if (!response.ok) {
            const errorBody = await response.text();
            console.error(`HTTP error fetching comments for ${toolSlug}. Status: ${response.status}, URL: ${url}, Body: ${errorBody}`);
            if (response.status === 404) return [];
            return [];
        }

        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
            const errorBody = await response.text();
            console.error(`Expected JSON, but received ${contentType} for comments of ${toolSlug}. URL: ${url}, Body: ${errorBody}`);
            return [];
        }
        
        const result: ApiResponse<Comment[]> = await response.json();
         if (!result.success) {
            console.error(`API error fetching comments for ${toolSlug}: ${result.error || 'Unknown API error'}. Full Response: ${JSON.stringify(result)}`);
            return [];
        }
        return result.data || [];
    } catch (error: any) {
        console.error(`Network or unexpected error in getCommentsForTool for ${toolSlug} (${url}):`, error);
        return [];
    }
};

// getAllComments is not directly used by the main UI pages but could be for an admin/overview
export const getAllComments = async (): Promise<Comment[]> => {
    const url = getAbsoluteUrl('/comments'); // Assuming a general comments endpoint
    console.log(`Fetching all comments from: ${url}`);
    try {
        const response = await fetch(url);
        if (!response.ok) {
            const errorBody = await response.text();
            console.error(`HTTP error fetching all comments. Status: ${response.status}, URL: ${url}, Body: ${errorBody}`);
            return [];
        }
        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
            const errorBody = await response.text();
            console.error(`Expected JSON, but received ${contentType} when fetching all comments. URL: ${url}, Body: ${errorBody}`);
            return [];
        }
        const result: ApiResponse<Comment[]> = await response.json();
        if (!result.success) {
            console.error(`API error fetching all comments: ${result.error || 'Unknown API error'}. Full Response: ${JSON.stringify(result)}`);
            return [];
        }
        return result.data || [];
    } catch (error: any) {
        console.error(`Network or unexpected error in getAllComments for ${url}:`, error);
        return [];
    }
};


export const getIconComponent = (iconName: string): LucideIcon => {
    return iconMap[iconName] || Zap; // Fallback to Zap icon if not found
};


export const renderStars = (rating: number): React.ReactNode[] => {
    const fullStars = Math.floor(rating);
    const halfStarPresent = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (halfStarPresent ? 1 : 0);
    const starsArray: React.ReactNode[] = [];

    const StarIcon = getIconComponent('Star');
    const StarHalfIcon = getIconComponent('StarHalf');

    for (let i = 0; i < fullStars; i++) {
        starsArray.push(React.createElement(StarIcon, { key: `full-${i}`, className: "h-5 w-5 fill-yellow-400 text-yellow-400" }));
    }
    if (halfStarPresent) {
        starsArray.push(React.createElement(StarHalfIcon, { key: "half", className: "h-5 w-5 fill-yellow-400 text-yellow-400" }));
    }
    for (let i = 0; i < emptyStars; i++) {
        starsArray.push(React.createElement(StarIcon, { key: `empty-${i}`, className: "h-5 w-5 text-muted-foreground" }));
    }
    return starsArray;
};


export const getFeaturedTools = async (): Promise<Tool[]> => {
    const allTools = await getAllTools();
    // Sort by rating (descending) then by creation date (descending)
    return allTools
        .sort((a, b) => {
            if (b.rating !== a.rating) {
                return b.rating - a.rating; // Higher rating first
            }
            // If ratings are equal, sort by newest first
            const dateA = new Date(a.createdAt).getTime();
            const dateB = new Date(b.createdAt).getTime();
            return dateB - dateA; // Newer date first
        })
        .slice(0, 6); // Get top 6
};


export const getRelatedTools = async (currentTool: Tool): Promise<Tool[]> => {
    const allTools = await getAllTools();
    // Filter out the current tool
    const otherTools = allTools.filter(t => t.slug !== currentTool.slug);

    // Prioritize tools from the same category, sorted by rating
    const sameCategoryTools = otherTools
        .filter(t => t.categorySlug === currentTool.categorySlug)
        .sort((a, b) => b.rating - a.rating); // Higher rating first

    let related = [...sameCategoryTools];

    // If not enough related tools from the same category, add highly rated tools from other categories
    if (related.length < 3) {
        const otherHighlyRatedTools = otherTools
            .filter(t => t.categorySlug !== currentTool.categorySlug) 
            .sort((a, b) => b.rating - a.rating); 

        for (const tool of otherHighlyRatedTools) {
            if (related.length >= 3) break;
            if (!related.find(rt => rt.slug === tool.slug)) {
                related.push(tool);
            }
        }
    }

    return related.slice(0, 3); 
};

// For Admin Dashboard data fetching, to be called from client components
export const apiGetAllTools = async (): Promise<Tool[]> => {
    return getAllTools(); 
};

export const apiGetAllCategories = async (): Promise<Category[]> => {
    return getAllCategories(); 
};

// For Admin Dashboard types - using specific names for clarity
export type { Tool as APITool, Category as APICategoryType };

    
