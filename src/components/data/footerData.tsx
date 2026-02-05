"use client";

import {
  Facebook,
  Instagram,
  Twitter,
  Linkedin,
  MapPin,
  Phone,
  Mail,
} from "lucide-react";

// Generic footer data - customize for your application
export const footerData = {
  companyInfo: {
    name: "Your Company",
    description:
      "Your company description goes here. \nReplace this with your own branding and messaging.",
  },
  sections: [
    {
      title: "Quick Links",
      links: [
        { label: "Home", href: "/" },
        { label: "Features", href: "/features" },
        { label: "Pricing", href: "/pricing" },
        { label: "About", href: "/about" },
      ],
    },
  ],
  contactInfo: [
    {
      type: "address",
      value: "123 Your Street\nYour City, Your State 12345",
      icon: MapPin,
    },
    {
      type: "phone",
      value: "(123) 456-7890",
      href: "tel:+11234567890",
      icon: Phone,
    },
    {
      type: "email",
      value: "hello@example.com",
      href: "mailto:hello@example.com",
      icon: Mail,
    },
  ],
  socialLinks: [
    { name: "Facebook", href: "#", icon: Facebook },
    { name: "Instagram", href: "#", icon: Instagram },
    { name: "Twitter", href: "#", icon: Twitter },
    { name: "LinkedIn", href: "#", icon: Linkedin },
  ],
  bottomLinks: [
    { label: "Privacy Policy", href: "/privacy-policy" },
    { label: "Terms of Service", href: "/terms-of-service" },
    { label: "Cookie Policy", href: "/cookie-policy" },
  ],
  copyright: "© 2025 Your Company. All rights reserved.",
};
