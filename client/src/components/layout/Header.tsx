import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Menu, X, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const navItems = [
  { label: "ホーム", href: "/" },
  { label: "サービス", href: "#services" },
  { label: "無料査定", href: "#assessment" },
  { label: "強み", href: "#features" },
  { label: "実績", href: "#achievements" },
  { label: "よくある質問", href: "#faq" },
];

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

  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href.startsWith("#")) {
      e.preventDefault();
      const element = document.querySelector(href);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
        setIsMobileMenuOpen(false);
      }
    }
  };

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b border-transparent",
        isScrolled ? "bg-white/95 backdrop-blur-md py-2 shadow-md border-slate-100" : "bg-white py-4 shadow-sm"
      )}
    >
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group bg-transparent">
            <img 
              src="https://private-us-east-1.manuscdn.com/users/310519663091040948/uploads/EvoszQPn6sM5lVEeWfNc4H_na1fn_dW5uYW1lZA.jpg?Policy=eyJTdGF0ZW1lbnQiOlt7IlJlc291cmNlIjoiaHR0cHM6Ly9wcml2YXRlLXVzLWVhc3QtMS5tYW51c2Nkbi5jb20vdXNlcnMvMzEwNTE5NjYzMDkxMDQwOTQ4L3VwbG9hZHMvRXZvc3pRUG42c001bFZFZVdmTmM0SF9uYTFmbl9kVzV1WVcxbFpBLmpwZyIsIkNvbmRpdGlvbiI6eyJEYXRlTGVzc1RoYW4iOnsiQVdTOkVwb2NoVGltZSI6MTc5ODc2MTYwMH19fV19&Key-Pair-Id=K2HSFNDJXOU9YS&Signature=m4E5vBMGFdEIkvk~6jS37NhCS0HxM4OwAo5jYTIEdBAli-7~zu83hd2FRVWg6ORraShhJAQZz3o6hp5I0aIS59R622mCr7vniVyrR6Ebc~YfXAkpscxIuJwzREa-7lg7JqIr76V9kDbsn0WvGLZbEscAqOE78pvb970KVqQnmwKT1M0pZ5C9fz5xKgnfDbm6sCyyn2zLEMj8UPLH~4dq5xSP87ZJl4DkgshqNAHATrZ6ICWuekGc8U5oIdP68HBy9tmf8MipnARQCr3bcxPBhR-ipJBqCcdp~9U0UvfwvWSUfwPIxLa5d5nq7ckpM0mO1ay0-z6zKNHBFDFIyjfmYw__" 
              alt="HY Consulting" 
              className="h-8 lg:h-10 w-auto object-contain"
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8">
            {navItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                onClick={(e) => scrollToSection(e, item.href)}
                className="text-base font-bold text-primary hover:text-accent transition-colors relative group py-2"
              >
                {item.label}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-accent transition-all duration-300 group-hover:w-full" />
              </a>
            ))}
            <Button 
              className="bg-secondary hover:bg-secondary/90 text-white font-bold tracking-wide rounded-md px-6 shadow-md hover:shadow-lg transition-all"
              onClick={() => window.open('https://hyconsulting.jp/contact', '_blank')}
            >
              <Mail className="w-4 h-4 mr-2" />
              お問い合わせ
            </Button>
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden p-2 rounded-md text-primary hover:bg-slate-100 transition-colors"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="w-8 h-8" /> : <Menu className="w-8 h-8" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Overlay */}
      <div
        className={cn(
          "fixed inset-0 bg-white z-40 lg:hidden transition-all duration-300 flex flex-col pt-24 px-6",
          isMobileMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        )}
      >
        <nav className="flex flex-col gap-6">
          {navItems.map((item) => (
            <a
              key={item.label}
              href={item.href}
              onClick={(e) => scrollToSection(e, item.href)}
              className="text-xl font-bold text-primary border-b border-slate-100 pb-4 flex justify-between items-center"
            >
              {item.label}
              <span className="text-accent">›</span>
            </a>
          ))}
          <Button 
            className="w-full bg-secondary text-white hover:bg-secondary/90 font-bold py-6 text-lg rounded-md mt-4 shadow-lg"
            onClick={() => {
              setIsMobileMenuOpen(false);
              window.open('https://hyconsulting.jp/contact', '_blank');
            }}
          >
            <Mail className="w-5 h-5 mr-2" />
            お問い合わせ
          </Button>
        </nav>
      </div>
    </header>
  );
}
