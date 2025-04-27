// This component is no longer needed as we are using static HTML pages for categories.
// You can optionally keep this file to redirect users to a static index page for categories,
// or remove it entirely if your server handles the `/categories` route directly.

// Example using Next.js redirects (add this to next.config.ts instead):
// async redirects() {
//   return [
//     {
//       source: '/categories',
//       destination: '/categories.html', // Or your main categories overview page
//       permanent: true,
//     },
//   ]
// },

// If keeping this file for some reason, ensure it doesn't conflict with static routing.
// A simple redirect component could be used:

/*
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function CategoriesRedirectPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to the static categories overview page
    router.replace('/categories.html'); // Adjust if your overview page has a different name
  }, [router]);

  // Optional: Show a loading message or spinner
  return <p>Redirecting to categories...</p>;
}
*/

// For now, returning null as the page is handled by static files or redirects.
export default function CategoriesPage() {
  return null;
}
