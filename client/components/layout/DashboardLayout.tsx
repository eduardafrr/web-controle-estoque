import { ReactNode, useMemo } from "react";
import { NavLink } from "react-router-dom";
import { BarChart3, Box, Layers, LogOut, PackageSearch } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { to: "/estoque", label: "Lançamentos", icon: Layers },
  { to: "/produtos", label: "Produtos", icon: PackageSearch },
  { to: "/categorias", label: "Categorias", icon: Box },
  { to: "/relatorios", label: "Relatórios", icon: BarChart3 },
];

type DashboardLayoutProps = {
  title: string;
  description?: string;
  action?: ReactNode;
  children: ReactNode;
};

export function DashboardLayout({ title, description, action, children }: DashboardLayoutProps) {
  const today = useMemo(
    () =>
      new Intl.DateTimeFormat("pt-BR", {
        weekday: "long",
        day: "2-digit",
        month: "long",
        year: "numeric",
      }).format(new Date()),
    [],
  );

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="grid min-h-screen grid-cols-[260px_1fr]">
        <aside className="flex flex-col border-r border-border bg-gradient-to-b from-primary/15 via-secondary/10 to-card p-6">
          <div className="space-y-8">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-secondary-foreground/80">Estoque+</p>
              <h1 className="mt-2 text-2xl font-bold">Restaurante Aurora</h1>
              <p className="mt-1 text-sm text-muted-foreground">Gestão de compras e estoque retrô</p>
            </div>

            <nav className="space-y-2">
              {NAV_ITEMS.map(({ to, label, icon: Icon }) => (
                <NavLink
                  key={to}
                  to={to}
                  className={({ isActive }) =>
                    cn(
                      "flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition",
                      "hover:bg-primary/10 hover:text-primary",
                      isActive
                        ? "bg-primary text-primary-foreground shadow-sm"
                        : "text-foreground/70",
                    )
                  }
                >
                  <Icon className="h-5 w-5" />
                  {label}
                </NavLink>
              ))}
            </nav>
          </div>

          <div className="mt-auto flex flex-col gap-4 rounded-2xl border border-border bg-card/80 p-4 text-sm">
            <div>
              <p className="font-semibold">Dica da IA</p>
              <p className="mt-1 text-muted-foreground">
                Revise os lançamentos semanais para manter o controle de desperdícios e otimizar compras.
              </p>
            </div>
            <Button
              variant="outline"
              className="justify-center gap-2 border-border text-secondary-foreground"
              onClick={() => {
                window.location.href = "https://localhost:44322/auth/logout";
              }}
            >
              <LogOut className="h-4 w-4" /> Sair
            </Button>
          </div>
        </aside>

        <main className="flex flex-col overflow-hidden">
          <header className="border-b border-border bg-card/70 backdrop-blur px-8 py-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.4em] text-muted-foreground">Painel</p>
                <h2 className="mt-1 text-3xl font-semibold">{title}</h2>
                {description ? <p className="mt-2 max-w-2xl text-sm text-muted-foreground">{description}</p> : null}
              </div>
              <div className="flex flex-col items-end gap-3 text-right">
                <span className="text-xs font-medium uppercase tracking-wide text-secondary">{today}</span>
                {action}
              </div>
            </div>
          </header>

          <div className="flex-1 overflow-y-auto px-8 py-6">
            <div className="mx-auto max-w-6xl space-y-6">{children}</div>
          </div>
        </main>
      </div>
    </div>
  );
}
