
"use client";

import * as React from "react";
import Link from "next/link";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"; // Import SheetHeader and SheetTitle
import { Menu, Moon, Sun, ChevronDown, Zap, FileText, Code, Video } from "lucide-react";

const categories = [
  { name: 'AI Tools', href: '#', icon: Zap },
  { name: 'PDF Tools', href: '#', icon: FileText },
  { name: 'Coding Utilities', href: '#', icon: Code },
  { name: 'Video Tools', href: '#', icon: Video },
];

export function Navbar() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);
  const [isSheetOpen, setIsSheetOpen] = React.useState(false);

  React.useEffect(() => setMounted(true), []);

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  const NavLinks = ({ mobile = false }: { mobile?: boolean }) => (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className={`flex items-center gap-1 ${mobile ? 'w-full justify-start px-4 py-2 text-left h-auto' : ''}`}>
            Categories <ChevronDown className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align={mobile ? 'start' : 'end'} className="w-56">
          {categories.map((category) => (
            <DropdownMenuItem key={category.name} asChild>
              <Link href={category.href} className="flex items-center gap-2">
                <category.icon className="h-4 w-4 text-muted-foreground" />
                {category.name}
              </Link>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
      <Button variant="ghost" asChild className={mobile ? 'w-full justify-start px-4 py-2 text-left h-auto' : ''}>
        <Link href="#">Submit Tool</Link>
      </Button>
      <Button
        variant="ghost"
        size={mobile ? "default" : "icon"} // Use default size for mobile link appearance
        onClick={toggleTheme}
        aria-label="Toggle theme"
        className={`rounded-full ${mobile ? 'w-full justify-start px-4 py-2 text-left h-auto' : ''}`}
      >
        {mounted ? (
          theme === "dark" ? (
            <Sun className={`h-5 w-5 ${mobile ? 'mr-2' : ''}`} />
          ) : (
            <Moon className={`h-5 w-5 ${mobile ? 'mr-2' : ''}`} />
          )
        ) : (
          <Sun className={`h-5 w-5 ${mobile ? 'mr-2' : ''}`} /> /* Default icon before mount */
        )}
        {mobile && <span>Toggle Theme</span>}
      </Button>
    </>
  );


  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 max-w-screen-2xl items-center px-4 sm:px-6 lg:px-8"> {/* Adjusted padding */}
        {/* Desktop Logo and Name */}
        <div className="mr-4 hidden md:flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            {/* Replace with SVG logo if available */}
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6 text-primary"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.38a2 2 0 0 0-.73-2.73l-.15-.09a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"></path><circle cx="12" cy="12" r="3"></circle></svg>
            <span className="hidden font-bold sm:inline-block">
              Toolshub4u
            </span>
          </Link>
        </div>

        {/* Mobile Menu Button */}
         <div className="md:hidden flex items-center"> {/* Container for mobile button */}
          <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                className="px-0 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0"
                aria-label="Open menu"
              >
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="pr-0 pt-8 w-full max-w-xs"> {/* Adjusted padding and width */}
                {/* Add SheetHeader and SheetTitle for accessibility */}
                <SheetHeader className="p-4 border-b mb-4">
                 <SheetTitle><span className="sr-only">Navigation Menu</span></SheetTitle>
                 {/* You can add a visible title or logo here if needed */}
                </SheetHeader>
                <nav className="flex flex-col gap-2 text-base font-medium">
                  <NavLinks mobile={true} />
                </nav>
            </SheetContent>
          </Sheet>
        </div>


        {/* Mobile Logo and Name - Centered or Right Aligned */}
        <div className="flex-1 flex justify-end md:hidden"> {/* Use flex-1 and justify-end to push logo right */}
            <Link href="/" className="flex items-center space-x-2">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6 text-primary"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.38a2 2 0 0 0-.73-2.73l-.15-.09a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                <span className="font-bold">
                Toolshub4u
                </span>
            </Link>
        </div>


        {/* Desktop Menu Items */}
        <div className="hidden md:flex flex-1 items-center justify-end space-x-2">
          <nav className="flex items-center gap-1">
             <NavLinks />
          </nav>
        </div>
      </div>
    </header>
  );
}
