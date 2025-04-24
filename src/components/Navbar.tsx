
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Button } from "@/components/ui/button";
import { Menu, LogIn, User, Search } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

export function Navbar() {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  
  const navItems = [
    { name: "Home", path: "/" },
    { name: "Esplora", path: "/esplora" },
    { name: "Le mie liste", path: "/liste" },
  ];
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-6 md:gap-8">
          <Link to="/" className="flex items-center space-x-2">
            <span className="text-xl font-bold text-anime-primary">AnimeIT</span>
          </Link>
          <nav className="hidden md:flex gap-6">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  isActive(item.path) ? "text-primary font-semibold" : "text-muted-foreground"
                }`}
              >
                {item.name}
              </Link>
            ))}
          </nav>
        </div>
        
        <div className="flex items-center gap-2">
          <Link to="/ricerca" className="hidden sm:flex">
            <Button variant="ghost" size="icon">
              <Search className="h-5 w-5" />
            </Button>
          </Link>
          <ThemeToggle />
          <Link to="/login">
            <Button variant="ghost" size="icon" className="hidden sm:flex">
              <LogIn className="h-5 w-5" />
            </Button>
          </Link>
          
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left">
              <div className="grid gap-4 py-4">
                <Link 
                  to="/" 
                  className="text-xl font-bold text-primary mb-4"
                  onClick={() => setIsOpen(false)}
                >
                  AnimeIT
                </Link>
                {navItems.map((item) => (
                  <Link
                    key={item.name}
                    to={item.path}
                    className={`text-sm font-medium transition-colors hover:text-primary ${
                      isActive(item.path) ? "text-primary font-semibold" : "text-muted-foreground"
                    }`}
                    onClick={() => setIsOpen(false)}
                  >
                    {item.name}
                  </Link>
                ))}
                <div className="border-t my-2"></div>
                <Link
                  to="/ricerca"
                  className="flex items-center gap-2 text-sm font-medium"
                  onClick={() => setIsOpen(false)}
                >
                  <Search className="h-4 w-4" />
                  <span>Ricerca</span>
                </Link>
                <Link
                  to="/login"
                  className="flex items-center gap-2 text-sm font-medium"
                  onClick={() => setIsOpen(false)}
                >
                  <LogIn className="h-4 w-4" />
                  <span>Accedi</span>
                </Link>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
