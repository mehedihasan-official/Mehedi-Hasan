// Static portfolio content shown on the home + work pages.
// Later this can be pulled from the admin CMS (projects with
// publishedToPortfolio=true); for now it's curated here so the site
// looks alive from day one.

export type FeaturedProject = {
  slug: string;
  title: string;
  clientName: string;
  category: string;
  problem: string;
  outcome: string;
  gradient: 'brand' | 'sunset' | 'ocean' | 'forest' | 'plum' | 'coral';
  liveUrl?: string;
};

export const FEATURED_PROJECTS: FeaturedProject[] = [
  {
    slug: 'platinum-club',
    title: 'Platinum Club — Members-Only Travel',
    clientName: 'Brian Caceres',
    category: 'Travel & Booking',
    problem: 'Needed a premium members-only booking flow that felt as high-end as the destinations.',
    outcome: 'Launched a fast, polished platform. Members book in under 90 seconds.',
    gradient: 'brand',
    liveUrl: 'https://travelleisure.vip',
  },
  {
    slug: 'travel-leisure',
    title: 'Travel + Leisure Club',
    clientName: 'Brian Caceres',
    category: 'Travel & Booking',
    problem: 'Old site scared off inquiries with slow load and dated design.',
    outcome: 'Rebuilt in Next.js. Inquiries went up, bounce rate dropped.',
    gradient: 'ocean',
    liveUrl: 'https://travelclub.it.com',
  },
  {
    slug: 'rci',
    title: 'RCI Travel Portal',
    clientName: 'Brian Caceres',
    category: 'Travel & Booking',
    problem: 'Owners needed one place to browse, book, and redeem — nothing existed.',
    outcome: 'Built the redemption portal from scratch. Owners self-serve daily.',
    gradient: 'sunset',
    liveUrl: 'https://rcitravelleisure.com',
  },
  {
    slug: 'email-finder',
    title: 'Email Finder Tool',
    clientName: 'Oliver',
    category: 'SaaS',
    problem: 'Had a Figma design — needed it live in weeks, not months.',
    outcome: 'Shipped a working SaaS site with pricing and lead capture.',
    gradient: 'forest',
    liveUrl: 'https://emailfindertool.com',
  },
  {
    slug: 'ifx-payments',
    title: 'Payments Landing Rebuild',
    clientName: 'Rahman',
    category: 'Fintech',
    problem: 'Wanted a landing page that converted like the big-name payment brands.',
    outcome: 'Delivered a clean, animated Next.js site that closes leads.',
    gradient: 'plum',
  },
  {
    slug: 'dbsee-agency',
    title: 'DBSEE Marketing Agency',
    clientName: 'Salman',
    category: 'Marketing / Agency',
    problem: 'Agency was hidden — no online presence to sell their services.',
    outcome: '15+ pages, fully responsive, live in three weeks.',
    gradient: 'coral',
  },
];

export type Testimonial =
  | {
      type: 'quote';
      quote: string;
      author: string;
      role?: string;
      country?: string;
    }
  | {
      type: 'screenshot';
      /**
       * Path under /public/testimonials/ (e.g. "brian-appreciation.png").
       * Drop screenshot images there and this card shows them at native aspect ratio.
       */
      image: string;
      author: string;
      role?: string;
      country?: string;
      alt: string;
    };

export const TESTIMONIALS: Testimonial[] = [
  {
    type: 'quote',
    quote:
      "Mehedi doesn't just write code — he understands the business behind it. Every project he's built for me runs faster and closes more customers than the one before.",
    author: 'Brian Caceres',
    role: 'Founder, VTR Synergy',
    country: 'United States',
  },
  {
    type: 'quote',
    quote:
      'I had a Figma file and a deadline. Mehedi turned it into a live site that converts. On time, on budget, no drama.',
    author: 'Oliver',
    role: 'Founder, Email Finder Tool',
    country: 'United Kingdom',
  },
  {
    type: 'quote',
    quote:
      "The one developer I always come back to. He responds fast, ships fast, and doesn't over-promise.",
    author: 'Toufik Wyn',
    country: 'United States',
  },
  {
    type: 'quote',
    quote:
      "I don't speak developer. Mehedi speaks business. That's why our project actually shipped.",
    author: 'Salman',
    role: 'Founder, DBSEE',
  },
  // Add screenshot testimonials by dropping images into /public/testimonials/
  // and uncommenting:
  // {
  //   type: 'screenshot',
  //   image: 'brian-appreciation.png',
  //   author: 'Brian Caceres',
  //   role: 'Founder, VTR Synergy',
  //   alt: 'Message from Brian appreciating the delivered work',
  // },
];
