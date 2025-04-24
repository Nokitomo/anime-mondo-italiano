
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: Utente ha tentato di accedere a una pagina inesistente:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="container flex flex-col items-center justify-center min-h-[80vh] py-12 text-center">
      <h1 className="text-6xl font-bold text-anime-primary mb-4">404</h1>
      <p className="text-xl text-foreground mb-8">Oops! Pagina non trovata</p>
      <p className="text-muted-foreground max-w-md mb-8">
        La pagina che stai cercando non esiste o è stata spostata.
      </p>
      <Button asChild>
        <a href="/">Torna alla Home</a>
      </Button>
    </div>
  );
};

export default NotFound;
