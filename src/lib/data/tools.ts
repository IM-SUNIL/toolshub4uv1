// Mock data for tools
// In a real application, this would likely come from a database or API

import type { LucideIcon } from 'lucide-react';
import { Zap, FileText, Scissors, Video, Code, CheckCircle, Star, StarHalf } from 'lucide-react';

export interface Tool {
  id: string;
  name: string;
  image: string; // URL to the tool's image or logo
  category: string;
  categoryIcon: LucideIcon;
  isFree: boolean;
  rating: number; // e.g., 4.5
  summary: string;
  description: string; // Can include markdown or basic HTML for formatting
  usageSteps: { icon?: LucideIcon; text: string }[];
  comments?: { id: string; name: string; comment: string; timestamp: string }[]; // Optional comments
  relatedToolIds?: string[]; // Optional IDs of related tools
}

export const mockTools: Tool[] = [
  {
    id: 'ai-content-generator',
    name: 'AI Content Generator',
    image: 'https://picsum.photos/seed/ai-gen/600/400',
    category: 'AI Tools',
    categoryIcon: Zap,
    isFree: true,
    rating: 4.5,
    summary: 'Generate high-quality marketing copy, blog posts, and more in seconds.',
    description: `
      <p>Unlock the power of artificial intelligence to create compelling content effortlessly. Our AI Content Generator helps you overcome writer's block and produce engaging text for various platforms.</p>
      <br/>
      <h3 class="font-semibold text-lg mb-2">Key Features:</h3>
      <ul class="list-disc list-inside space-y-1">
        <li>Multiple content types (blog posts, social media, ads).</li>
        <li>Adjustable tone and style.</li>
        <li>Supports multiple languages.</li>
        <li>Fast and efficient generation.</li>
      </ul>
      <br/>
      <p>Ideal for marketers, bloggers, and business owners looking to scale their content production without compromising quality.</p>
    `,
    usageSteps: [
      { icon: CheckCircle, text: 'Select the desired content type (e.g., Blog Post Intro).' },
      { icon: CheckCircle, text: 'Provide a brief description or keywords for the topic.' },
      { icon: CheckCircle, text: 'Choose the tone of voice (e.g., Professional, Casual).' },
      { icon: CheckCircle, text: 'Click "Generate" and review the output.' },
      { icon: CheckCircle, text: 'Edit or regenerate as needed.' },
    ],
    comments: [
      { id: 'c1', name: 'Alice', comment: 'This tool is a lifesaver for blog posts!', timestamp: '2024-08-14T10:30:00Z' },
      { id: 'c2', name: 'Bob', comment: 'Really easy to use and generates great copy.', timestamp: '2024-08-14T11:15:00Z' },
    ],
    relatedToolIds: ['pdf-converter', 'image-bg-remover'],
  },
  {
    id: 'pdf-converter',
    name: 'PDF to Word Converter',
    image: 'https://picsum.photos/seed/pdf-conv/600/400',
    category: 'PDF Tools',
    categoryIcon: FileText,
    isFree: true,
    rating: 4.0,
    summary: 'Easily convert your PDF documents into editable Microsoft Word files.',
    description: `
      <p>Stop retyping PDF documents! Our PDF to Word Converter accurately transforms your PDFs into fully formatted .docx files that you can edit and reuse.</p>
      <br/>
      <h3 class="font-semibold text-lg mb-2">Why Use It?</h3>
      <ul class="list-disc list-inside space-y-1">
        <li>Preserves original layout, fonts, and images.</li>
        <li>Fast conversion process.</li>
        <li>No software installation required - fully online.</li>
        <li>Secure and private handling of your files.</li>
      </ul>
      <br/>
      <p>Perfect for students, professionals, and anyone needing to modify PDF content.</p>
    `,
    usageSteps: [
      { icon: CheckCircle, text: 'Click "Upload PDF" and select your file.' },
      { icon: CheckCircle, text: 'Wait for the conversion process to complete.' },
      { icon: CheckCircle, text: 'Click "Download Word File" to save the .docx.' },
    ],
    comments: [
       { id: 'c3', name: 'Charlie', comment: 'Worked perfectly for my report!', timestamp: '2024-08-13T15:00:00Z' },
    ],
     relatedToolIds: ['ai-content-generator', 'online-video-editor'],
  },
  {
    id: 'image-bg-remover',
    name: 'Image Background Remover',
    image: 'https://picsum.photos/seed/img-rem/600/400',
    category: 'Image Tools',
    categoryIcon: Scissors,
    isFree: false, // Example of a paid tool
    rating: 4.8,
    summary: 'Automatically remove the background from any image with just one click.',
     description: `
      <p>Get professional-looking images without complex software. This tool uses AI to detect the foreground subject and accurately remove the background, leaving you with a transparent PNG.</p>
      <br/>
      <h3 class="font-semibold text-lg mb-2">Ideal For:</h3>
      <ul class="list-disc list-inside space-y-1">
        <li>E-commerce product photos.</li>
        <li>Portraits and headshots.</li>
        <li>Graphic design projects.</li>
        <li>Creating transparent logos.</li>
      </ul>
      <br/>
      <p>Saves hours compared to manual editing in Photoshop.</p>
    `,
    usageSteps: [
      { icon: CheckCircle, text: 'Upload your image file (JPG, PNG, etc.).' },
      { icon: CheckCircle, text: 'The AI automatically processes the image.' },
      { icon: CheckCircle, text: 'Preview the result with a transparent background.' },
      { icon: CheckCircle, text: 'Download the high-resolution PNG file.' },
    ],
     relatedToolIds: ['pdf-converter', 'online-video-editor'],
  },
   {
    id: 'online-video-editor',
    name: 'Online Video Editor',
    image: 'https://picsum.photos/seed/vid-edit/600/400',
    category: 'Video Tools',
    categoryIcon: Video,
    isFree: true,
    rating: 3.9,
    summary: 'Simple and quick video editing directly in your web browser.',
    description: `
      <p>Edit your videos without installing heavy software. This online editor provides basic tools for trimming, cutting, merging, and adding simple text or filters to your videos.</p>
      <br/>
      <h3 class="font-semibold text-lg mb-2">Features:</h3>
      <ul class="list-disc list-inside space-y-1">
        <li>Trim and cut video clips.</li>
        <li>Merge multiple video files.</li>
        <li>Add text overlays.</li>
        <li>Apply basic color filters.</li>
        <li>Export in common formats like MP4.</li>
      </ul>
    `,
    usageSteps: [
      { icon: CheckCircle, text: 'Upload your video file(s).' },
      { icon: CheckCircle, text: 'Use the timeline editor to make changes (trim, cut, merge).' },
      { icon: CheckCircle, text: 'Add text or apply filters if desired.' },
      { icon: CheckCircle, text: 'Preview your edited video.' },
      { icon: CheckCircle, text: 'Click "Export" and choose your format/quality.' },
    ],
    comments: [
      { id: 'c4', name: 'Diana', comment: 'Good for quick trims, but limited features.', timestamp: '2024-08-12T09:00:00Z' },
    ],
    relatedToolIds: ['image-bg-remover', 'ai-content-generator'],
  },
   {
    id: 'code-formatter',
    name: 'Code Formatter',
    image: 'https://picsum.photos/seed/code-fmt/600/400',
    category: 'Coding Utilities',
    categoryIcon: Code,
    isFree: true,
    rating: 4.2,
    summary: 'Beautify and format your code snippets instantly online.',
     description: `
      <p>Ensure your code is readable and consistently styled. Paste your code snippet, select the language, and let the formatter clean it up according to standard conventions.</p>
      <br/>
      <h3 class="font-semibold text-lg mb-2">Supported Languages:</h3>
      <ul class="list-disc list-inside space-y-1">
        <li>JavaScript, TypeScript</li>
        <li>HTML, CSS</li>
        <li>JSON, XML</li>
        <li>Python, Java, C++ (and more)</li>
      </ul>
    `,
    usageSteps: [
      { icon: CheckCircle, text: 'Paste your code into the input area.' },
      { icon: CheckCircle, text: 'Select the programming language from the dropdown.' },
      { icon: CheckCircle, text: 'Click the "Format Code" button.' },
      { icon: CheckCircle, text: 'Copy the formatted code from the output area.' },
    ],
     relatedToolIds: ['pdf-converter', 'ai-content-generator'],
  },
  {
    id: 'resume-builder',
    name: 'Resume Builder',
    image: 'https://picsum.photos/seed/resume/600/400',
    category: 'Career',
    categoryIcon: FileText,
    isFree: false, // Example paid
    rating: 4.7,
    summary: 'Create a professional and modern resume in minutes.',
    description: `
      <p>Build a standout resume with professionally designed templates. Our builder guides you through each section, offering tips and examples to help you land your dream job.</p>
      <br/>
      <h3 class="font-semibold text-lg mb-2">Highlights:</h3>
      <ul class="list-disc list-inside space-y-1">
        <li>Multiple modern templates.</li>
        <li>Real-time preview.</li>
        <li>Easy section management (Experience, Education, Skills).</li>
        <li>Download as PDF.</li>
        <li>Tips and suggestions included.</li>
      </ul>
    `,
    usageSteps: [
      { icon: CheckCircle, text: 'Choose a resume template.' },
      { icon: CheckCircle, text: 'Fill in your details section by section (Contact, Experience, etc.).' },
      { icon: CheckCircle, text: 'Customize the layout and colors (optional).' },
      { icon: CheckCircle, text: 'Preview your completed resume.' },
      { icon: CheckCircle, text: 'Download the final resume as a PDF.' },
    ],
    comments: [
       { id: 'c5', name: 'Ethan', comment: 'Made resume building so much easier!', timestamp: '2024-08-15T12:00:00Z' },
    ],
    relatedToolIds: ['ai-content-generator', 'code-formatter'],
  },
  // Add more mock tools as needed
];

// Helper function to get a specific tool by ID
export const getToolById = (id: string): Tool | undefined => {
  return mockTools.find(tool => tool.id === id);
};

// Helper function to get related tools
export const getRelatedTools = (tool: Tool): Tool[] => {
  if (!tool.relatedToolIds) return [];
  return mockTools.filter(t => tool.relatedToolIds?.includes(t.id) && t.id !== tool.id);
};

// Helper function to render star ratings
export const renderStars = (rating: number) => {
  const fullStars = Math.floor(rating);
  const halfStar = rating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);
  const stars = [];

  for (let i = 0; i < fullStars; i++) {
    stars.push(<Star key={`full-${i}`} className="h-5 w-5 fill-yellow-400 text-yellow-400" />);
  }
  if (halfStar) {
    stars.push(<StarHalf key="half" className="h-5 w-5 fill-yellow-400 text-yellow-400" />);
  }
  for (let i = 0; i < emptyStars; i++) {
    stars.push(<Star key={`empty-${i}`} className="h-5 w-5 text-muted-foreground" />);
  }
  return stars;
};
