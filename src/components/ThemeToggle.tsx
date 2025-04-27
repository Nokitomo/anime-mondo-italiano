
import { useEffect, useState } from "react";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { Moon, Sun } from "lucide-react";

export const ThemeToggle = () => {
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const { toast } = useToast();
  
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") as "light" | "dark" | null;
    if (savedTheme) {
      setTheme(savedTheme);
      document.documentElement.classList.toggle("dark", savedTheme === "dark");
    } else if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
      setTheme("dark");
      document.documentElement.classList.add("dark");
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    document.documentElement.classList.toggle("dark", newTheme === "dark");
    localStorage.setItem("theme", newTheme);
    
    toast({
      title: newTheme === "dark" ? "Modalità scura attivata" : "Modalità chiara attivata",
      duration: 1500,
    });
  };

  return (
    <div className="flex items-center gap-2">
      <Sun className="h-4 w-4 text-muted-foreground" />
      <Switch 
        checked={theme === "dark"}
        onCheckedChange={toggleTheme}
        aria-label="Cambia tema" 
      />
      <Moon className="h-4 w-4 text-muted-foreground" />
    </div>
  );
};
