import { whatsappLink } from "@/lib/utils";
import { Facebook, Linkedin, MessageCircle } from "lucide-react";
import Link from "next/link";

const whatsapp = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER;
const socialLinks = [
  {
    label: "Facebook",
    href: "https://www.facebook.com/skmehedihasansumu",
    icon: Facebook,
  },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/mehedishopnil",
    icon: Linkedin,
  },
  {
    label: "WhatsApp",
    href: whatsapp ? whatsappLink(whatsapp) : "/contact",
    icon: MessageCircle,
  },
];

export function SiteFooter() {
  return (
    <footer className="border-t border-app mt-24">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 md:grid-cols-3 md:px-6">
        <div>
          <div className="flex items-center gap-2 font-semibold">
            <span className="grid h-8 w-8 place-items-center rounded-lg gradient-brand text-sm font-bold text-white">
              M
            </span>
            Mehedi Hasan
          </div>
          <p className="mt-3 max-w-sm text-sm text-muted">
            Freelance full-stack developer building SaaS, travel platforms, and
            business tools with Next.js, TypeScript, and modern web tech.
          </p>
        </div>
        <div>
          <div className="text-xs font-semibold uppercase tracking-wider text-subtle">
            Explore
          </div>
          <ul className="mt-3 space-y-2 text-sm text-muted">
            <li>
              <Link href="/work" className="hover:text-body">
                Work
              </Link>
            </li>
            <li>
              <Link href="/services" className="hover:text-body">
                Services
              </Link>
            </li>
            <li>
              <Link href="/about" className="hover:text-body">
                About
              </Link>
            </li>
            <li>
              <Link href="/contact" className="hover:text-body">
                Contact
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <div className="text-xs font-semibold uppercase tracking-wider text-subtle">
            Get in touch
          </div>
          <ul className="mt-3 space-y-2 text-sm text-muted">
            <li>skmehedihasan.jr1@gmail.com</li>
            <li>Remote collaboration worldwide</li>
            <li>
              <Link href="/start-project" className="hover:text-body">
                Start a project →
              </Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-2 px-4 pb-8 md:px-6">
        {socialLinks.map(({ label, href, icon: Icon }) => (
          <a
            key={label}
            href={href}
            target={href.startsWith("http") ? "_blank" : undefined}
            rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
            aria-label={label}
            title={label}
            className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-app px-3 text-sm text-muted transition-colors hover:border-strong hover:text-body"
          >
            <Icon className="h-4 w-4" />
            {label}
          </a>
        ))}
      </div>
      <div className="border-t border-app py-6 text-center text-xs text-subtle">
        © {new Date().getFullYear()} Mehedi Hasan. Built with Next.js.
      </div>
    </footer>
  );
}
