import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X, LogOut, User } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile.tsx";
import { Link } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import logoImage from "@assets/image_1752117480535.png";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const isMobile = useIsMobile();
  const { user, isAuthenticated, logout, isLoggingOut } = useAuth();

  const publicNavItems = [
    { label: "About OAuth 3", href: "/about", isRoute: true },
    { label: "Technology", href: "/technology", isRoute: true },
    { label: "Services", href: "/services", isRoute: true },
    { label: "Docs", href: "/resources", isRoute: true },
    { label: "Contact Us", href: "/contact", isRoute: true },
  ];

  const authenticatedNavItems = [
    { label: "Dashboard", href: "/dashboard", isRoute: true },
    { label: "About OAuth 3", href: "/about", isRoute: true },
    { label: "Technology", href: "/technology", isRoute: true },
    { label: "Services", href: "/services", isRoute: true },
    { label: "Docs", href: "/resources", isRoute: true },
    { label: "Contact Us", href: "/contact", isRoute: true },
  ];

  const navItems = isAuthenticated ? authenticatedNavItems : publicNavItems;

  const handleNavClick = (href: string, isRoute: boolean) => {
    if (isRoute) {
      setIsMenuOpen(false);
      return;
    }
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
      setIsMenuOpen(false);
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 bg-background/80 backdrop-blur-md border-b border-border z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center space-x-3">
            <img src={logoImage} alt="OAuth 3 Logo" className="h-8 w-8" />
            <span className="text-2xl font-bold text-primary clean-logo">OAuth 3</span>
          </Link>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              item.isRoute ? (
                <Link
                  key={item.label}
                  href={item.href}
                  className="text-foreground hover:text-primary transition-colors duration-200 font-medium"
                >
                  {item.label}
                </Link>
              ) : (
                <button
                  key={item.label}
                  onClick={() => handleNavClick(item.href, item.isRoute)}
                  className="text-foreground hover:text-primary transition-colors duration-200 font-medium"
                >
                  {item.label}
                </button>
              )
            ))}
            
            {/* Authentication Buttons */}
            <div className="flex items-center space-x-4">
              {isAuthenticated ? (
                <div className="flex items-center space-x-3">
                  <div className="flex items-center space-x-2">
                    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                      <User size={14} className="text-white" />
                    </div>
                    <span className="text-sm font-medium text-foreground">{user?.name || user?.email || 'User'}</span>
                  </div>
                  <Button 
                    size="sm"
                    onClick={logout}
                    disabled={isLoggingOut}
                    className="bg-black/20 hover:bg-black/30 dark:bg-white/20 dark:hover:bg-white/30 backdrop-blur-sm border border-white/30 text-white dark:text-black font-semibold"
                  >
                    {isLoggingOut ? "Signing Out..." : "Sign Out"}
                  </Button>
                </div>
              ) : (
                <div className="flex items-center space-x-3">
                  <Link href="/login">
                    <Button variant="ghost" size="sm" className="bg-black/10 hover:bg-black/20 dark:bg-white/10 dark:hover:bg-white/20 backdrop-blur-sm border border-white/20 text-foreground">
                      Sign In
                    </Button>
                  </Link>
                  <Link href="/register">
                    <Button variant="default" size="sm" className="bg-black/20 hover:bg-black/30 dark:bg-white/20 dark:hover:bg-white/30 backdrop-blur-sm border border-white/30 text-white dark:text-black">
                      Sign Up
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-foreground hover:text-primary"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && isMobile && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-background/90 backdrop-blur-md border-t border-border">
              {navItems.map((item) => (
                item.isRoute ? (
                  <Link
                    key={item.label}
                    href={item.href}
                    className="block w-full text-left px-3 py-2 text-foreground hover:text-primary hover:bg-muted transition-colors duration-200"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.label}
                  </Link>
                ) : (
                  <button
                    key={item.label}
                    onClick={() => handleNavClick(item.href, item.isRoute)}
                    className="block w-full text-left px-3 py-2 text-foreground hover:text-primary hover:bg-muted transition-colors duration-200"
                  >
                    {item.label}
                  </button>
                )
              ))}
              
              {/* Mobile Authentication Section */}
              <div className="border-t border-border pt-3 mt-3">
                {isAuthenticated ? (
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2 px-3 py-2">
                      <div className="w-6 h-6 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                        <User size={14} className="text-white" />
                      </div>
                      <span className="text-sm font-medium text-foreground">{user?.name || user?.email || 'User'}</span>
                    </div>
                    <Button 
                      size="sm"
                      onClick={() => {
                        logout();
                        setIsMenuOpen(false);
                      }}
                      disabled={isLoggingOut}
                      className="w-full bg-black/20 hover:bg-black/30 dark:bg-white/20 dark:hover:bg-white/30 backdrop-blur-sm border border-white/30 text-white dark:text-black font-semibold mx-3"
                      style={{ width: 'calc(100% - 1.5rem)' }}
                    >
                      {isLoggingOut ? "Signing Out..." : "Sign Out"}
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-2 px-3">
                    <Link href="/login">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="w-full bg-black/10 hover:bg-black/20 dark:bg-white/10 dark:hover:bg-white/20 backdrop-blur-sm border border-white/20 text-foreground"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        Sign In
                      </Button>
                    </Link>
                    <Link href="/register">
                      <Button 
                        variant="default" 
                        size="sm" 
                        className="w-full bg-black/20 hover:bg-black/30 dark:bg-white/20 dark:hover:bg-white/30 backdrop-blur-sm border border-white/30 text-white dark:text-black"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        Sign Up
                      </Button>
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
