
// This file remains a Server Component - DO NOT change to 'use client'

import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getToolBySlug, getAllTools } from '@/lib/data/tools'; // Import API data helpers
import ToolDetailClient from '@/components/tools/tool-detail-client'; // Import the client component

// Generate static paths for all tools (optional, for SSG)
// export async function generateStaticParams() {
//   const tools = await getAllTools(); // Fetch all tools from API
//   return tools.map((tool) => ({
//     toolId: tool.slug, // Use slug as the parameter
//   }));
// }

// Generate Metadata dynamically based on the tool slug
export async function generateMetadata({ params }: { params: { toolId: string } }): Promise<Metadata> {
  const tool = await getToolBySlug(params.toolId); // Fetch tool by slug from API

  if (!tool) {
    return {
      title: 'Tool Not Found - Toolshub4u',
      description: 'The requested tool could not be found.',
    };
  }

  return {
    title: `${tool.name} - Toolshub4u`,
    description: tool.summary,
    openGraph: {
       images: [tool.image || 'https://picsum.photos/600/400'], // Use tool image or fallback
       title: `${tool.name} - Toolshub4u`,
       description: tool.summary,
    },
  };
}

// The main page component fetches initial data and passes it to the client component
export default async function ToolDetailPage({ params }: { params: { toolId: string } }) {
  // Fetch the specific tool data on the server
  const tool = await getToolBySlug(params.toolId); // Use toolId which is the slug

  // Handle case where tool is not found
  if (!tool) {
    notFound(); // Trigger Next.js 404 page
  }

  // Pass the fetched tool data (or just the slug) to the Client Component
  // The Client Component can then handle comments, related tools fetching, etc.
  return <ToolDetailClient toolSlug={params.toolId} initialToolData={tool} />;
}
