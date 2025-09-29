import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Plus, Rows3, View } from "lucide-react";

interface Category {
  id: string;
  name: string;
  description: string;
  products: number;
  lowStock: number;
  color: string;
}

const INITIAL: Category[] = [
  {
    id: "cat-01",
    name: "Bebidas",
    description: "Cafés, chás e bebidas especiais da casa.",
    products: 12,
    lowStock: 2,
    color: "bg-gradient-to-br from-primary/30 via-primary/10 to-transparent",
  },
  {
    id: "cat-02",
    name: "Laticínios",
    description: "Laticínios artesanais e queijos curados.",
    products: 8,
    lowStock: 1,
    color: "bg-gradient-to-br from-secondary/30 via-secondary/10 to-transparent",
  },
  {
    id: "cat-03",
    name: "Temperos",
    description: "Ervas, especiarias e misturas exclusivas.",
    products: 18,
    lowStock: 4,
    color: "bg-gradient-to-br from-accent/30 via-accent/10 to-transparent",
  },
];

export default function Categories() {
  const [categories, setCategories] = useState<Category[]>(INITIAL);
  const [modalOpen, setModalOpen] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = () => {
    if (!name.trim()) {
      toast.error("Informe o nome da categoria.");
      return;
    }

    const category: Category = {
      id: crypto.randomUUID(),
      name: name.trim(),
      description: description.trim() || "",
      products: 0,
      lowStock: 0,
      color: "bg-gradient-to-br from-primary/20 via-secondary/10 to-transparent",
    };

    setCategories((prev) => [category, ...prev]);
    toast.success("Categoria criada!");
    setModalOpen(false);
    setName("");
    setDescription("");
  };

  const totalProducts = categories.reduce((acc, category) => acc + category.products, 0);
  const totalAlerts = categories.reduce((acc, category) => acc + category.lowStock, 0);

  return (
    <DashboardLayout
      title="Categorias"
      description="Organize o estoque por família de produtos e encontre rápido os itens críticos."
      action={
        <Dialog open={modalOpen} onOpenChange={setModalOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2 rounded-full bg-accent text-accent-foreground shadow-md shadow-accent/30" onClick={() => setModalOpen(true)}>
              <Plus className="h-4 w-4" /> Nova categoria
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-xl">
            <DialogHeader>
              <DialogTitle>Criar categoria</DialogTitle>
            </DialogHeader>
            <div className="space-y-5">
              <div>
                <label className="text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground">
                  Nome da categoria
                </label>
                <Input
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  className="mt-2 rounded-xl border-border"
                  placeholder="Ex: Hortifruti"
                />
              </div>
              <div>
                <label className="text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground">
                  Descrição
                </label>
                <Input
                  value={description}
                  onChange={(event) => setDescription(event.target.value)}
                  className="mt-2 rounded-xl border-border"
                  placeholder="Resumo da utilização"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="ghost" onClick={() => setModalOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleSubmit}>Criar categoria</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      }
    >
      <section className="grid gap-6 md:grid-cols-3">
        <StatCard title="Categorias ativas" value={categories.length.toString()} subtitle="Coleção retrô" icon={<Rows3 className="h-5 w-5" />} />
        <StatCard title="Produtos mapeados" value={totalProducts.toString()} subtitle="Inventário total" icon={<View className="h-5 w-5" />} />
        <StatCard title="Alertas" value={totalAlerts.toString()} subtitle="Abaixo da meta" icon={<View className="h-5 w-5" />} variant="accent" />
      </section>

      <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {categories.map((category) => (
          <article
            key={category.id}
            className={`relative overflow-hidden rounded-3xl border border-border bg-card/80 p-6 shadow-inner shadow-primary/10 ${category.color}`}
          >
            <div className="relative space-y-4">
              <Badge className="rounded-full bg-background/80 text-xs uppercase tracking-[0.3em] text-muted-foreground">
                {category.id.slice(0, 6).toUpperCase()}
              </Badge>
              <div>
                <h3 className="text-xl font-semibold">{category.name}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{category.description || "Categoria recém-criada, adicione produtos em breve."}</p>
              </div>
            </div>
            <div className="mt-6 grid grid-cols-2 gap-3 text-sm">
              <div className="rounded-2xl border border-border/70 bg-background/80 p-4">
                <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Produtos</p>
                <p className="mt-2 text-2xl font-semibold">{category.products}</p>
              </div>
              <div className="rounded-2xl border border-border/70 bg-background/80 p-4">
                <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Alertas</p>
                <p className="mt-2 text-2xl font-semibold text-destructive">{category.lowStock}</p>
              </div>
            </div>
          </article>
        ))}
      </section>
    </DashboardLayout>
  );
}

function StatCard({
  title,
  value,
  subtitle,
  icon,
  variant = "default",
}: {
  title: string;
  value: string;
  subtitle: string;
  icon: React.ReactNode;
  variant?: "default" | "accent";
}) {
  const bg = variant === "accent" ? "bg-accent/20" : "bg-primary/10";
  return (
    <div className="rounded-3xl border border-border/70 bg-card/80 p-6">
      <div className={`mb-4 inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] ${bg}`}>
        {icon}
        <span>{title}</span>
      </div>
      <p className="text-3xl font-semibold">{value}</p>
      <p className="mt-2 text-sm text-muted-foreground">{subtitle}</p>
    </div>
  );
}
