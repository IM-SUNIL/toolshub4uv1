
// This file remains a Server Component - DO NOT add 'use client' here

import type { Metadata } from 'next';
import { getToolById } from '@/lib/data/tools.tsx'; // Import mock data and helpers
import ToolDetailClient from '@/components/tools/tool-detail-client'; // Import the client component

// Example function to generate Metadata (Needs to be outside the client component)
export async function generateMetadata({ params }: { params: { toolId: string } }): Promise<Metadata> {
  const tool = getToolById(params.toolId);

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

// The main page component now simply renders the client component
// It can fetch initial data here and pass it down if needed, but
// the client component currently handles its own data fetching based on params.
export default function ToolDetailPage({ params }: { params: { toolId: string } }) {
  // The actual rendering and logic happens in the Client Component
  return <ToolDetailClient toolId={params.toolId} />;
}
