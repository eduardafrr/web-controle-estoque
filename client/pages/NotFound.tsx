import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname,
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/15 via-accent/10 to-secondary/10">
      <div className="mx-auto flex min-h-screen max-w-4xl flex-col items-center justify-center gap-8 px-6 text-center">
        <p className="text-xs uppercase tracking-[0.4em] text-muted-foreground">Página não encontrada</p>
        <div className="space-y-4">
          <h1 className="text-6xl font-bold text-primary">404</h1>
          <p className="text-lg text-muted-foreground">
            A rota que você buscou ficou no passado. Volte ao painel Vita60 para continuar a jornada.
          </p>
        </div>
        <Button asChild className="rounded-full bg-primary text-primary-foreground px-8">
          <Link to="/">Retornar ao login</Link>
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
