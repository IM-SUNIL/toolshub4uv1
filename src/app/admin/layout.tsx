
// This layout applies to all routes within the /admin path.
// You can add specific styling or shared components for the admin section here.
// For now, it just renders the children. You could add authentication checks here
// in a more complex setup, but for the current client-side approach, checks are in the pages.

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Admin - Toolshub4u',
  description: 'Admin area for Toolshub4u',
  // Prevent indexing of admin pages
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: {
        index: false,
        follow: false,
        noimageindex: true,
       'max-video-preview': -1,
       'max-image-preview': 'large',
       'max-snippet': -1,
     },
   },
};


export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {/*
        You could wrap children in an AuthProvider or similar component here
        if using context or more advanced state management for authentication.
        For the simple sessionStorage approach, checks are handled within
        the individual admin pages (/admin/page.tsx and /admin/dashboard/page.tsx).
      */}
      {children}
    </>
  );
}
