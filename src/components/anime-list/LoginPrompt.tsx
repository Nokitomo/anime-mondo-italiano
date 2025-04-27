
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export function LoginPrompt() {
  return (
    <div className="container py-8 text-center">
      <h1 className="text-3xl font-bold mb-6">Le mie liste</h1>
      <p className="text-lg mb-4">Accedi per visualizzare e gestire le tue liste anime.</p>
      <Button asChild>
        <Link to="/login">Accedi</Link>
      </Button>
    </div>
  );
}
