import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export default function Login() {
  // const navigate = useNavigate();

  const handleGoogleLogin = () => {
    window.location.href = "https://localhost:44322/auth/login";
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background text-foreground">
      <div className="grid w-full max-w-5xl grid-cols-1 gap-12 px-8 py-16 md:grid-cols-[1.15fr_0.85fr] md:px-12">
        <section className="space-y-6">
          <div className="inline-flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-border bg-card text-2xl font-black text-primary">
              V
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.5em] text-muted-foreground">Sistema Retro AI</p>
              <h1 className="text-4xl font-bold tracking-tight text-primary md:text-5xl">Vita60</h1>
            </div>
          </div>
          <p className="max-w-md text-base text-muted-foreground">
            Gestão de estoque com praticidade, inteligência artificial e foco total na sua produtividade.
          </p>
          <div className="grid gap-4 rounded-3xl border border-border bg-card/60 p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.4em] text-muted-foreground">Destaques</p>
            <ul className="space-y-2 text-sm text-muted-foreground/90">
              <li>• Alertas inteligentes de ruptura com antecedência retro futurista</li>
              <li>• Planejamento automático de compras baseado no histórico</li>
              <li>• Painéis vibrantes que respeitam a identidade do seu restaurante</li>
            </ul>
          </div>
        </section>

        <section className="space-y-8">
          <div className="space-y-2">
            <p className="text-xs uppercase tracking-[0.4em] text-muted-foreground">Acesse com o Google</p>
            <h2 className="text-3xl font-semibold">Seu negócio conectado em segundos</h2>
          </div>

          <Button
            onClick={handleGoogleLogin}
            className="flex h-14 w-full items-center justify-center gap-4 rounded-full border border-border bg-background text-base font-semibold shadow-lg shadow-primary/20 transition hover:bg-card"
          >
            <GoogleGlyph />
            <span className="text-blue-600">Entrar com Google</span>
          </Button>

          <div className="rounded-3xl border border-dashed border-secondary/50 bg-secondary/10 p-6 text-secondary">
            <p className="text-sm font-semibold">Novidade Vita60</p>
            <p className="mt-2 text-sm">
              Conecte sua conta e receba recomendações de compra personalizadas direto no painel.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span>Suporte 24/7</span>
            <span className="h-1 w-1 rounded-full bg-muted-foreground/60" />
            <span>Dados seguros com autenticação Google</span>
          </div>
        </section>
      </div>
    </div>
  );
}

function GoogleGlyph() {
  return (
    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white shadow-inner">
      <svg viewBox="0 0 48 48" className="h-5 w-5" aria-hidden>
        <path fill="#EA4335" d="M24 9.5c3.5 0 6 1.5 7.3 2.7l5.4-5.3C33.6 3.9 29.3 2 24 2 14.7 2 6.7 7.8 3.2 16l6.9 5.3C11.8 15.3 17.3 9.5 24 9.5z" />
        <path fill="#4285F4" d="M46.1 24.5c0-1.6-.1-2.8-.4-4.1H24v7.6h12.6c-.3 2.4-1.9 6-5.4 8.4l6.4 4.9c3.7-3.4 5.5-8.4 5.5-16.8z" />
        <path fill="#FBBC05" d="M10.1 28.7c-.5-1.4-.8-2.8-.8-4.2s.3-2.8.8-4.2l-6.9-5.3C1.1 17.8 0 21 0 24.5s1.1 6.7 3.2 9.5l6.9-5.3z" />
        <path fill="#34A853" d="M24 48c6.5 0 11.9-2.1 15.8-5.7l-6.4-4.9c-1.8 1.2-4.3 2-7.4 2-6.7 0-12.3-4.5-14.3-10.7l-7 5.4C6.7 40.2 14.7 48 24 48z" />
      </svg>
    </span>
  );
}
