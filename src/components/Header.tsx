"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Menu, X, Instagram } from "lucide-react"; // Removed Globe, not used
import { useTranslation } from "react-i18next";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ContactDetails } from "@/types/strapi";

// 1. Import the specific flags you need (3x2 aspect ratio looks best for headers)
import { GB, FR, DE } from 'country-flag-icons/react/3x2';
import { ENABLED_LOCALES } from '@/config/i18n.config';

const WhatsAppIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    width="24"
    height="24"
  >
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.008-.57-.008-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
);

interface HeaderProps {
  lang?: string;
  contactDetails?: ContactDetails | null;
}

// 2. Update object to use the imported Component (Flag) instead of a string
const allLanguages = [
  { code: "en", label: "English", Flag: GB },
  { code: "fr", label: "Français", Flag: FR },
  { code: "de", label: "Deutsch", Flag: DE },
];
// Only show enabled locales in the switcher
const languages = allLanguages.filter((l) => ENABLED_LOCALES.includes(l.code as typeof ENABLED_LOCALES[number]));

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();
  const pathname = usePathname();

  const handleLanguageChange = (newLang: string) => {
    // eslint-disable-next-line react-hooks/immutability
    document.cookie = `NEXT_LOCALE=${newLang}; path=/; max-age=31536000; SameSite=Lax`;
    const segments = pathname.split('/');
    if (segments.length > 1) {
      segments[1] = newLang;
    } else {
      segments.splice(1, 0, newLang);
    }
    const newPath = segments.join('/');
    // eslint-disable-next-line react-hooks/immutability
    window.location.href = newPath;
  };

  const currentLangCode = i18n.language?.split("-")[0];
  const currentLang = languages.find((l) => l.code === currentLangCode) || languages[0];

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="flex items-center gap-2">
          {/* 3. Render the Flag component */}
          <currentLang.Flag className="w-5 h-4 rounded-sm" />
          <span className="uppercase hidden sm:inline">{currentLangCode}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {languages.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => handleLanguageChange(lang.code)}
            className={`cursor-pointer ${i18n.language === lang.code ? "bg-accent" : ""}`}
          >
            {/* 4. Render the Flag component in the list */}
            <lang.Flag className="w-5 h-4 mr-2 rounded-sm" />
            {lang.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

const Header = ({ lang, contactDetails }: HeaderProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { t } = useTranslation();

  const navLinks = [
    { label: t("nav.home"), href: `/${lang}` },
    { label: t("nav.services"), href: `/${lang}/services` },
    { label: t("nav.activities"), href: `/${lang}/activities` },
    { label: t("nav.about"), href: `/${lang}/about` },
    { label: t("nav.contact"), href: `/${lang}/contact` },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#faf0e6] backdrop-blur-md border-b border-border/50">
      <div className="container mx-auto px-4">
        <div className="flex items-center h-16 md:h-20">
          {/* Logo */}
          <Link href={lang ? `/${lang}` : "/"} className="flex items-center shrink-0">
            <Image
              src="/allez-moris-logo-light-text.svg"
              alt="Allez Moris Logo"
              width={160}
              height={80}
              className="w-32 h-16 md:w-40 md:h-20 object-contain"
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8 mx-auto">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="text-foreground hover:text-primary transition-colors font-medium"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="hidden md:flex items-center gap-4">
            <div className="flex items-center gap-1">
              <Button variant="ghost" size="icon" asChild className="text-foreground hover:text-green-500 transition-colors">
                <Link href={contactDetails?.whatsappUrl || "https://wa.me/"} target="_blank" aria-label="WhatsApp">
                  <WhatsAppIcon className="w-5 h-5" />
                </Link>
              </Button>
              <Button variant="ghost" size="icon" asChild className="text-foreground hover:text-pink-500 transition-colors">
                <Link href={contactDetails?.instagramUrl || "https://instagram.com/"} target="_blank" aria-label="Instagram">
                  <Instagram className="w-5 h-5" />
                </Link>
              </Button>
            </div>

            {/* Language switcher */}
            <LanguageSwitcher />

            <Link href={`/${lang}/subscribe`}>
              <Button variant="default" size="lg">
                {t("nav.subscribe")}
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Toggle */}
          <div className="flex items-center gap-1 md:hidden ml-auto">
            {/* Keep your mobile icons here */}
            <Button variant="ghost" size="icon" asChild className="w-8 h-8 text-foreground hover:text-green-500 transition-colors">
              <Link href={contactDetails?.whatsappUrl || "https://wa.me/"} target="_blank" aria-label="WhatsApp">
                <WhatsAppIcon className="w-4 h-4" />
              </Link>
            </Button>
            <Button variant="ghost" size="icon" asChild className="w-8 h-8 text-foreground hover:text-pink-500 transition-colors">
              <Link href={contactDetails?.instagramUrl || "https://instagram.com/"} target="_blank" aria-label="Instagram">
                <Instagram className="w-4 h-4" />
              </Link>
            </Button>

            <LanguageSwitcher />

            <button
              className="p-2"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMenuOpen ? (
                <X className="w-6 h-6 text-foreground" />
              ) : (
                <Menu className="w-6 h-6 text-foreground" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-border">
            <nav className="flex flex-col gap-4">
              {navLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="text-foreground hover:text-primary transition-colors font-medium py-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              <Link href={`/${lang}/subscribe`} onClick={() => setIsMenuOpen(false)}>
                <Button variant="default" className="mt-2 w-full">
                  {t("nav.subscribe")}
                </Button>
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;