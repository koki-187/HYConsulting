import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Menu, X, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [location] = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    { label: "ホーム", href: "/" },
    { label: "サービス", href: "#services" },
    { label: "不動産査定", href: "#assessment" },
    { label: "強み・特徴", href: "#features" },
    { label: "実績紹介", href: "#achievements" },
    { label: "よくある質問", href: "#faq" },
  ];

  const handleNavClick = (href: string) => {
    setIsMobileMenuOpen(false);
    if (href.startsWith("#")) {
      const element = document.querySelector(href);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b border-transparent",
        isScrolled ? "bg-white/95 backdrop-blur-md shadow-sm py-3 border-slate-100" : "bg-transparent py-5"
      )}
    >
      <div className="container mx-auto px-4 flex items-center justify-between">
        <Link href="/">
          <a className="flex items-center gap-2 group">
            <img 
              src="/images/logo_new.svg" 
              alt="HY Consulting" 
              className={cn(
                "transition-all duration-300",
                isScrolled ? "h-8" : "h-10 brightness-0 invert"
              )} 
            />
          </a>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-8">
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              onClick={(e) => {
                e.preventDefault();
                handleNavClick(item.href);
              }}
              className={cn(
                "text-sm font-medium transition-colors relative py-1 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-primary after:transition-all after:duration-300 hover:after:w-full",
                isScrolled ? "text-slate-600 hover:text-primary" : "text-white/90 hover:text-white"
              )}
            >
              {item.label}
            </a>
          ))}
          <Button 
            className={cn(
              "font-bold rounded-sm shadow-md transition-all duration-300",
              isScrolled 
                ? "bg-primary hover:bg-primary/90 text-white" 
                : "bg-white text-primary hover:bg-slate-100"
            )}
            onClick={() => handleNavClick("#contact")}
          >
            <Phone className="w-4 h-4 mr-2" />
            お問い合わせ
          </Button>
        </nav>

        {/* Mobile Menu Button */}
        <button
          className={cn(
            "lg:hidden p-2 rounded-sm transition-colors",
            isScrolled ? "text-slate-900 hover:bg-slate-100" : "text-white hover:bg-white/10"
          )}
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="absolute top-full left-0 right-0 bg-white border-t border-slate-100 shadow-xl lg:hidden animate-in slide-in-from-top-5">
          <div className="container mx-auto px-4 py-6 flex flex-col gap-4">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={(e) => {
                  e.preventDefault();
                  handleNavClick(item.href);
                }}
                className="text-slate-600 hover:text-primary font-medium py-2 border-b border-slate-50 last:border-0"
              >
                {item.label}
              </a>
            ))}
            <Button 
              className="w-full mt-4 bg-primary hover:bg-primary/90 text-white font-bold rounded-sm"
              onClick={() => handleNavClick("#contact")}
            >
              <Phone className="w-4 h-4 mr-2" />
              お問い合わせ
            </Button>
          </div>
        </div>
      )}
    </header>
  );
}
