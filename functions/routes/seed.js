const express = require('express');
const router = express.Router();
const Category = require('../models/Category');
const Tool = require('../models/Tool');

const demoCategories = [
  {
    slug: "ai-tools",
    name: "AI Tools",
    description: "Generators, enhancers, and assistants powered by Artificial Intelligence.",
    iconName: "Zap", // Ensure this icon exists in your frontend iconMap
    imageURL: "https://picsum.photos/seed/ai-category/600/400",
    tags: ["ai", "artificial intelligence", "machine learning", "generators"]
  },
  {
    slug: "pdf-tools",
    name: "PDF Tools",
    description: "Convert, merge, split, and manage your PDF documents with ease.",
    iconName: "FileText",
    imageURL: "https://picsum.photos/seed/pdf-category/600/400",
    tags: ["pdf", "documents", "converter", "editor"]
  },
  {
    slug: "image-tools",
    name: "Image Tools",
    description: "Edit, resize, compress, and enhance your images online.",
    iconName: "Scissors",
    imageURL: "https://picsum.photos/seed/image-category/600/400",
    tags: ["image", "photo", "editor", "graphics"]
  },
  {
    slug: "video-tools",
    name: "Video Tools",
    description: "Online tools for video editing, conversion, and manipulation.",
    iconName: "Video",
    imageURL: "https://picsum.photos/seed/video-category/600/400",
    tags: ["video", "multimedia", "editor", "converter"]
  },
  {
    slug: "coding-utilities",
    name: "Coding Utilities",
    description: "Helpful tools for developers like formatters, linters, and validators.",
    iconName: "Code",
    imageURL: "https://picsum.photos/seed/coding-category/600/400",
    tags: ["code", "developer", "programming", "utility"]
  },
  {
    slug: "career-tools",
    name: "Career Tools",
    description: "Tools to help you build your resume, prepare for interviews, and advance your career.",
    iconName: "FileText", // Using FileText as a placeholder, update if a more specific icon is available
    imageURL: "https://picsum.photos/seed/career-category/600/400",
    tags: ["career", "resume", "job search", "professional development"]
  }
];

const demoTools = [
  {
    slug: "ai-content-generator",
    name: "AI Content Generator",
    image: "https://picsum.photos/seed/ai-content-tool/600/400",
    categorySlug: "ai-tools",
    isFree: true,
    rating: 4.7,
    summary: "Generate engaging articles, blog posts, and marketing copy in seconds with AI.",
    description: "<p>Our AI Content Generator uses advanced natural language processing to create high-quality, original content for various needs. Save time and overcome writer's block.</p><h3>Features:</h3><ul><li>Multiple content formats</li><li>Customizable tone and style</li><li>SEO-friendly output</li></ul>",
    usageSteps: [
      { text: "Choose your content type (e.g., blog post, ad copy)." },
      { text: "Enter a topic or keywords." },
      { text: "Select generation options (length, tone)." },
      { text: "Click 'Generate' and review the content." }
    ],
    websiteLink: "https://example.com/ai-content-generator",
    tags: ["ai", "content creation", "writing", "marketing"],
    comments: [{ name: "Demo User 1", comment: "This AI writer is amazing!", timestamp: new Date() }]
  },
  {
    slug: "pdf-to-word-converter",
    name: "PDF to Word Converter",
    image: "https://picsum.photos/seed/pdf-word-tool/600/400",
    categorySlug: "pdf-tools",
    isFree: true,
    rating: 4.5,
    summary: "Convert PDF files to editable Word documents accurately and quickly.",
    description: "<p>Easily transform your PDF documents into editable Microsoft Word (.docx) files while preserving layout, images, and text formatting.</p>",
    usageSteps: [
      { text: "Upload your PDF file." },
      { text: "Click the 'Convert' button." },
      { text: "Download your editable Word document." }
    ],
    websiteLink: "https://example.com/pdf-to-word",
    tags: ["pdf", "word", "converter", "document editing"],
    relatedToolIds: ["image-background-remover"]
  },
  {
    slug: "image-background-remover",
    name: "Image Background Remover",
    image: "https://picsum.photos/seed/bg-remover-tool/600/400",
    categorySlug: "image-tools",
    isFree: false,
    rating: 4.8,
    summary: "Automatically remove backgrounds from images with AI in just one click.",
    description: "<p>Create transparent backgrounds for your product photos, portraits, or graphic designs effortlessly. Our AI-powered tool delivers precise cutouts in seconds.</p>",
    usageSteps: [
      { text: "Upload your image (PNG or JPG)." },
      { text: "The AI will process and remove the background." },
      { text: "Download the resulting image with a transparent background." }
    ],
    websiteLink: "https://example.com/background-remover",
    tags: ["image editing", "background removal", "ai", "transparent png"],
    comments: [{ name: "Designer Pro", comment: "Saves so much time!", timestamp: new Date() }]
  },
  {
    slug: "online-video-trimmer",
    name: "Online Video Trimmer",
    image: "https://picsum.photos/seed/video-trim-tool/600/400",
    categorySlug: "video-tools",
    isFree: true,
    rating: 4.2,
    summary: "Quickly trim and cut your video files online without any software installation.",
    description: "<p>A simple and efficient tool to cut unwanted parts from your videos. Supports various video formats and allows for precise trimming.</p>",
    usageSteps: [
      { text: "Upload your video file." },
      { text: "Set the start and end points for trimming." },
      { text: "Preview the trimmed video." },
      { text: "Download your edited video." }
    ],
    websiteLink: "https://example.com/video-trimmer",
    tags: ["video editing", "trim video", "cut video", "online editor"]
  },
  {
    slug: "json-formatter-validator",
    name: "JSON Formatter & Validator",
    image: "https://picsum.photos/seed/json-tool/600/400",
    categorySlug: "coding-utilities",
    isFree: true,
    rating: 4.6,
    summary: "Format, validate, and beautify your JSON data with this easy-to-use online tool.",
    description: "<p>Perfect for developers working with JSON. This tool helps you format messy JSON into a readable structure and validate it against syntax rules.</p>",
    usageSteps: [
      { text: "Paste your JSON data into the input field." },
      { text: "Click 'Format' or 'Validate'." },
      { text: "View the formatted/validated output or error messages." }
    ],
    websiteLink: "https://example.com/json-formatter",
    tags: ["json", "formatter", "validator", "developer tools", "coding"]
  },
  {
    slug: "quick-resume-builder",
    name: "Quick Resume Builder",
    image: "https://picsum.photos/seed/resume-tool/600/400",
    categorySlug: "career-tools",
    isFree: false, // Example of a paid tool
    rating: 4.9,
    summary: "Create a professional and ATS-friendly resume in minutes with guided templates.",
    description: "<p>Build a compelling resume that stands out. Choose from various templates, get tips, and download your resume as a PDF to impress recruiters.</p>",
    usageSteps: [
      { text: "Select a resume template." },
      { text: "Fill in your personal details, experience, education, and skills." },
      { text: "Customize the design and layout." },
      { text: "Download your professional resume in PDF format." }
    ],
    websiteLink: "https://example.com/resume-builder",
    tags: ["resume", "cv", "job application", "career", "ats"]
  }
];

// @route   POST /api/seed/database
// @desc    Seed the database with demo categories and tools
// @access  Public (Consider adding auth for production seed routes)
router.post('/database', async (req, res) => {
  try {
    // Clear existing data (optional, but good for a seed script)
    await Category.deleteMany({});
    await Tool.deleteMany({});
    console.log('Existing categories and tools cleared.');

    // Insert demo categories
    const createdCategories = await Category.insertMany(demoCategories);
    console.log(`${createdCategories.length} demo categories inserted.`);

    // Insert demo tools
    const createdTools = await Tool.insertMany(demoTools);
    console.log(`${createdTools.length} demo tools inserted.`);

    res.status(201).json({
      message: 'Database seeded successfully with demo data.',
      categoriesAdded: createdCategories.length,
      toolsAdded: createdTools.length,
    });
  } catch (err) {
    console.error('Error seeding database:', err.message);
    res.status(500).json({ message: 'Server Error during database seeding.', error: err.message });
  }
});

module.exports = router;
