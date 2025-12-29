import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useLocation } from "wouter";

const NAV_ITEMS = [
  { label: "サービス", href: "#services" },
  { label: "不動産査定", href: "#assessment" },
  { label: "強み・特徴", href: "#features" },
  { label: "実績", href: "#achievements" },
  { label: "お客様の声", href: "#testimonials" },
  { label: "よくある質問", href: "#faq" },
];

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [location] = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? "bg-white/95 backdrop-blur-md shadow-sm py-3" : "bg-transparent py-5"
      }`}
    >
      <div className="container flex items-center justify-between">
        {/* Logo */}
        <Link href="/">
          <a className="flex items-center gap-2 group">
            <img 
              src="/images/logo_new.svg" 
              alt="HY Consulting" 
              className="h-10 w-auto transition-transform duration-300 group-hover:scale-105"
            />
          </a>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-8">
          {NAV_ITEMS.map((item) => (
            <a
              key={item.href}
              href={item.href}
              onClick={(e) => scrollToSection(e, item.href)}
              className={`text-sm font-bold transition-colors hover:text-primary ${
                isScrolled ? "text-slate-600" : "text-slate-800"
              }`}
            >
              {item.label}
            </a>
          ))}
          <Button 
            className="bg-primary hover:bg-primary/90 text-white font-bold shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5 rounded-full px-6"
            onClick={(e) => {
              e.preventDefault();
              document.querySelector("#contact")?.scrollIntoView({ behavior: "smooth" });
            }}
          >
            無料相談を予約する
          </Button>
        </nav>

        {/* Mobile Navigation */}
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="lg:hidden text-primary">
              <Menu className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[300px] sm:w-[400px]">
            <nav className="flex flex-col gap-6 mt-10">
              {NAV_ITEMS.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={(e) => {
                    scrollToSection(e, item.href);
                  }}
                  className="text-lg font-medium text-slate-800 hover:text-primary transition-colors"
                >
                  {item.label}
                </a>
              ))}
              <Button 
                className="w-full bg-primary hover:bg-primary/90 text-white font-bold mt-4 rounded-full"
                onClick={(e) => {
                  e.preventDefault();
                  document.querySelector("#contact")?.scrollIntoView({ behavior: "smooth" });
                }}
              >
                無料相談を予約する
              </Button>
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
