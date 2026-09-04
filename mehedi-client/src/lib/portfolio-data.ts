// Static portfolio content shown on the home + work pages.
// Later this can be pulled from the admin CMS (projects with
// publishedToPortfolio=true); for now it's curated here so the site
// looks alive from day one.

import type { StaticImageData } from 'next/image';
import coredenzImg from '@/assets/images/coredenz-ecommerce.png';
import dbseeImg from '@/assets/images/dbsee-site-screenshot.png';
import platinumClubImg from '@/assets/images/platinum-club.png';
import vtrCaceresImg from '@/assets/images/vtrcaseares.png';
import intervalImg from '@/assets/images/interval-app.png';
import rewardsImg from '@/assets/images/rewards.png';

export type FeaturedProject = {
  slug: string;
  title: string;
  clientName: string;
  category: string;
  problem: string;
  outcome: string;
  image: StaticImageData;
  liveUrl: string;
};

export const FEATURED_PROJECTS: FeaturedProject[] = [
  {
    slug: 'coredenz',
    title: 'Coredenz — Tech Gadgets Store',
    clientName: 'Coredenz',
    category: 'E-commerce',
    problem: 'Needed a fast, trustworthy online store to sell tech gadgets directly to customers.',
    outcome: 'Launched a modern storefront built to turn browsers into buyers.',
    image: coredenzImg,
    liveUrl: 'https://coredenz.vercel.app',
  },
  {
    slug: 'dbsee-agency',
    title: 'DBSEE Marketing Agency',
    clientName: 'Salman',
    category: 'Marketing / Agency',
    problem: 'Agency was hidden online — no site to actually sell their services.',
    outcome: '15+ pages, fully responsive, live in three weeks.',
    image: dbseeImg,
    liveUrl: 'https://dbsee-agency.vercel.app',
  },
  {
    slug: 'platinum-club',
    title: 'Platinum Club — Members-Only Travel',
    clientName: 'Brian Caceres',
    category: 'Travel & Booking',
    problem: 'Needed a premium members-only booking flow that felt as high-end as the destinations.',
    outcome: 'Launched a fast, polished platform. Members book in under 90 seconds.',
    image: platinumClubImg,
    liveUrl: 'https://www.travelleisure.vip',
  },
  {
    slug: 'vtr-caceres-capital',
    title: 'VTR Caceres Capital',
    clientName: 'Brian Caceres',
    category: 'Finance / Investment',
    problem: 'Needed a capital & investment site that builds instant credibility with investors.',
    outcome: 'Delivered a clean, professional site that presents the firm with confidence.',
    image: vtrCaceresImg,
    liveUrl: 'https://www.vtrcacerescapital.com',
  },
  {
    slug: 'interval',
    title: 'Interval — Resort Exchange Platform',
    clientName: 'Karen',
    category: 'Travel & Booking',
    problem: 'Needed an Interval-style resort exchange platform built from the ground up.',
    outcome: 'Shipped a full booking platform members browse and reserve through.',
    image: intervalImg,
    liveUrl: 'https://interval-client.vercel.app',
  },
  {
    slug: 'ihg-rewards',
    title: 'Rewards Redemption Center',
    clientName: 'Brian Caceres',
    category: 'Travel & Rewards',
    problem: 'Members needed a self-serve way to redeem reward points for stays.',
    outcome: 'Built a redemption portal — members redeem points in a few clicks.',
    image: rewardsImg,
    liveUrl: 'https://ihgrewards-redemption.vercel.app',
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
