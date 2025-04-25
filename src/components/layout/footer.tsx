import Link from 'next/link';
import { Github, Linkedin, Twitter } from 'lucide-react'; // Using Twitter icon as X placeholder

export function Footer() {
  return (
    <footer className="bg-gradient-to-r from-blue-950 via-slate-900 to-blue-950 text-primary-foreground py-12 mt-16">
      {/* Centered grid container */}
      <div className="container max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
        {/* Quick Links */}
        <div className="flex flex-col items-center">
          <h4 className="font-semibold mb-4 text-lg dark:text-white">Quick Links</h4>
          <ul className="space-y-2">
            <li>
              <Link href="#" className="text-muted-foreground hover:text-accent transition-colors">
                Submit Tool
              </Link>
            </li>
            <li>
              <Link href="#" className="text-muted-foreground hover:text-accent transition-colors">
                Suggest Feature
              </Link>
            </li>
             <li>
              <Link href="#" className="text-muted-foreground hover:text-accent transition-colors">
                About Us
              </Link>
            </li>
             <li>
              <Link href="#" className="text-muted-foreground hover:text-accent transition-colors">
                Contact
              </Link>
            </li>
          </ul>
        </div>

        {/* Popular Categories */}
         <div className="flex flex-col items-center">
          <h4 className="font-semibold mb-4 text-lg dark:text-white">Popular Categories</h4>
          <ul className="space-y-2">
            <li>
              <Link href="#" className="text-muted-foreground hover:text-accent transition-colors">
                AI Tools
              </Link>
            </li>
            <li>
              <Link href="#" className="text-muted-foreground hover:text-accent transition-colors">
                PDF Tools
              </Link>
            </li>
            <li>
              <Link href="#" className="text-muted-foreground hover:text-accent transition-colors">
                Coding Utilities
              </Link>
            </li>
            <li>
              <Link href="#" className="text-muted-foreground hover:text-accent transition-colors">
                Video Editors
              </Link>
            </li>
             <li>
              <Link href="#" className="text-muted-foreground hover:text-accent transition-colors">
                Image Tools
              </Link>
            </li>
          </ul>
        </div>

        {/* Socials */}
        <div className="flex flex-col items-center">
          <h4 className="font-semibold mb-4 text-lg dark:text-white">Connect With Us</h4>
          <div className="flex space-x-4">
            <Link href="#" aria-label="LinkedIn" className="text-muted-foreground hover:text-accent transition-colors">
              <Linkedin className="h-6 w-6" />
            </Link>
            <Link href="#" aria-label="GitHub" className="text-muted-foreground hover:text-accent transition-colors">
              <Github className="h-6 w-6" />
            </Link>
            <Link href="#" aria-label="X (Twitter)" className="text-muted-foreground hover:text-accent transition-colors">
              <Twitter className="h-6 w-6" />
            </Link>
          </div>
        </div>
      </div>
      {/* Centered copyright */}
      <div className="container max-w-6xl mx-auto mt-12 pt-8 border-t border-border/30 text-center text-muted-foreground text-sm">
        © {new Date().getFullYear()} Toolshub4u. All rights reserved.
      </div>
    </footer>
  );
}
