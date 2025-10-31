import { useMemo, useState } from "react";
import { ENDPOINTS } from "@/config";
import { useEffect } from "react";
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
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Plus, ScissorsSquare } from "lucide-react";

interface ProductRow {
  id: string;
  name: string;
  category: string;
  unit: string;
  minQty: number;
  margin: number;
  active: boolean;
  currentStock: number;
}

const INITIAL_PRODUCTS: ProductRow[] = [
  {
    id: "prd-001",
    name: "Café Premium",
    category: "Bebidas",
    unit: "KG",
    minQty: 20,
    margin: 25,
    active: true,
    currentStock: 18,
  },
  {
    id: "prd-002",
    name: "Manteiga Artesanal",
    category: "Laticínios",
    unit: "UN",
    minQty: 30,
    margin: 15,
    active: true,
    currentStock: 44,
  },
  {
    id: "prd-003",
    name: "Ervas Finas",
    category: "Temperos",
    unit: "PCT",
    minQty: 18,
    margin: 35,
    active: false,
    currentStock: 6,
  },
];

const CATEGORIES = ["Bebidas", "Laticínios", "Temperos", "Proteínas", "Hortifruti"];
const UNITS = ["KG", "UN", "L", "PCT", "CX"];

export default function Products() {
  const [products, setProducts] = useState<ProductRow[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({
    name: "",
    category: "",
    unit: "UN",
    minQty: "10",
    margin: "15",
    active: true,
  });

    const [categories, setCategories] = useState<{ id: string; nome: string }[]>([]);

  useEffect(() => {
    fetch(ENDPOINTS.categorias, { credentials: "include" })
      .then((res) => res.json())
      .then((data) => {
        setCategories(Array.isArray(data) ? data.filter((cat) => cat.ativo).map((cat) => ({ id: cat.id, nome: cat.nome })) : []);
      });

  fetch(ENDPOINTS.produtos, { credentials: "include" })
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setProducts(
            data.map((prod) => ({
              id: prod.id,
              name: prod.nome,
              category: prod.categoriaId,
              unit: prod.unidadeMedida !== undefined ? Object.keys(UNIT_MAP)[prod.unidadeMedida] : "UN",
              minQty: prod.quantidadeMinima ?? 0,
              margin: prod.margem ?? 0,
              active: prod.ativo ?? true,
              currentStock: prod.quantidade ?? 0,
            }))
          );
        }
      });
  }, []);

  const criticalCount = useMemo(
    () =>
      products.filter((product) => product.currentStock < product.minQty && product.active).length,
    [products],
  );

  const UNIT_MAP: Record<string, number> = {
    UN: 0,
    KG: 1,
    L: 2,
    PCT: 3,
    CX: 4,
    M: 5,
  };

  

  const handleSubmit = async () => {
    if (!form.name.trim() || !form.category.trim()) {
      toast.error("Informe nome e categoria.");
      return;
    }

    const payload = {
      nome: form.name.trim(),
      descricao: "", 
      unidadeMedida: UNIT_MAP[form.unit] ?? 0,
      quantidade: 0,
      quantidadeMinima: Number(form.minQty) || 0,
      categoriaId: form.category,
    };

    try {
      const res = await fetch(ENDPOINTS.novoProduto, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        credentials: "include"
      });
      if (!res.ok) throw new Error("Erro ao cadastrar produto");
      toast.success("Produto cadastrado com sucesso!");
      setForm({ name: "", category: "", unit: "UN", minQty: "10", margin: "15", active: true });
      setModalOpen(false);
      // Atualiza lista de produtos após cadastro
      fetch(ENDPOINTS.produtos, { credentials: "include" })
        .then((res) => res.json())
        .then((data) => {
          if (Array.isArray(data)) {
            setProducts(
              data.map((prod) => ({
                id: prod.id,
                name: prod.nome,
                category: prod.categoriaId,
                unit: prod.unidadeMedida !== undefined ? Object.keys(UNIT_MAP)[prod.unidadeMedida] : "UN",
                minQty: prod.quantidadeMinima ?? 0,
                margin: prod.margem ?? 0,
                active: prod.ativo ?? true,
                currentStock: prod.quantidade ?? 0,
              }))
            );
          }
        });
    } catch (err) {
      toast.error("Erro ao cadastrar produto");
      categoriaId: form.category
    }
  };

  const toggleActive = (id: string, value: boolean) => {
    setProducts((prev) => prev.map((product) => (product.id === id ? { ...product, active: value } : product)));
  };

  return (
    <DashboardLayout
      title="Produtos"
      description="Gerencie o catálogo completo do restaurante: estoque mínimo, margem de segurança e disponibilidade."
      action={
        <Dialog open={modalOpen} onOpenChange={setModalOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2 rounded-full bg-primary text-primary-foreground shadow-lg shadow-primary/30" onClick={() => setModalOpen(true)}>
              <Plus className="h-4 w-4" /> Novo produto
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Cadastrar novo produto</DialogTitle>
            </DialogHeader>

            <div className="grid gap-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="text-xs font-semibold uppercase tracking-[0.25em] text-muted-foreground">
                    Nome do produto
                  </label>
                  <Input
                    value={form.name}
                    onChange={(event) => setForm((state) => ({ ...state, name: event.target.value }))}
                    className="mt-2 rounded-xl border-border"
                    placeholder="Ex: Café Premium"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold uppercase tracking-[0.25em] text-muted-foreground">
                    Categoria
                  </label>
                  <Select
                    value={form.category}
                    onValueChange={(value) => setForm((state) => ({ ...state, category: value }))}
                  >
                    <SelectTrigger className="mt-2 rounded-xl border-border">
                      <SelectValue placeholder="Escolha uma categoria" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.length === 0 ? (
                        <div className="px-4 py-2 text-muted-foreground">Nenhuma categoria cadastrada</div>
                      ) : (
                        categories.map((cat) => (
                          <SelectItem key={cat.id} value={cat.id}>
                            {cat.nome}
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                <div>
                  <label className="text-xs font-semibold uppercase tracking-[0.25em] text-muted-foreground">
                    Unidade
                  </label>
                  <Select value={form.unit} onValueChange={(value) => setForm((state) => ({ ...state, unit: value }))}>
                    <SelectTrigger className="mt-2 rounded-xl border-border">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {UNITS.map((unit) => (
                        <SelectItem key={unit} value={unit}>
                          {unit}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-xs font-semibold uppercase tracking-[0.25em] text-muted-foreground">
                    Estoque mínimo
                  </label>
                  <Input
                    value={form.minQty}
                    onChange={(event) => setForm((state) => ({ ...state, minQty: event.target.value }))}
                    className="mt-2 rounded-xl border-border"
                    placeholder="Ex: 25"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold uppercase tracking-[0.25em] text-muted-foreground">
                    Margem %
                  </label>
                  <Input
                    value={form.margin}
                    onChange={(event) => setForm((state) => ({ ...state, margin: event.target.value }))}
                    className="mt-2 rounded-xl border-border"
                    placeholder="Ex: 15"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between rounded-2xl border border-border bg-card/70 p-4">
                <div>
                  <p className="text-sm font-semibold">Ativar produto</p>
                  <p className="text-xs text-muted-foreground">Produtos desativados não aparecem nas análises de estoque.</p>
                </div>
                <Switch
                  checked={form.active}
                  onCheckedChange={(value) => setForm((state) => ({ ...state, active: value }))}
                />
              </div>
            </div>

            <DialogFooter>
              <Button variant="ghost" onClick={() => setModalOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleSubmit}>Salvar produto</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      }
    >
      <section className="grid gap-6 md:grid-cols-3">
        <SummaryCard title="Produtos ativos" value={products.filter((product) => product.active).length.toString()} highlight="Catálogo retro em dia" />
        <SummaryCard title="Estoques em alerta" value={criticalCount.toString()} highlight="Priorize estes itens" tone="warning" />
        <SummaryCard title="Margem média" value={averageMargin(products)} highlight="Meta 25%" tone="success" />
      </section>

      <section className="rounded-3xl border border-border bg-card/80 p-6">
        <header className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-semibold">Catálogo de produtos</h3>
            <p className="text-sm text-muted-foreground">Visualize rapidamente margem, estoque mínimo e status de ativação.</p>
          </div>
          <Badge className="gap-2 rounded-full bg-accent/20 text-accent-foreground">
            <ScissorsSquare className="h-4 w-4" /> Atualize os cortes de carne desta semana
          </Badge>
        </header>

        <div className="mt-6 overflow-hidden rounded-2xl border border-border/70">
          <table className="min-w-full divide-y divide-border/80 text-left text-sm">
            <thead className="bg-muted/50 text-xs uppercase tracking-[0.3em] text-muted-foreground">
              <tr>
                <th className="px-6 py-4">Produto</th>
                <th className="px-6 py-4">Categoria</th>
                <th className="px-6 py-4">Unidade</th>
                <th className="px-6 py-4">Qtd. mínima</th>
                <th className="px-6 py-4">Margem</th>
                <th className="px-6 py-4">Estoque atual</th>
                <th className="px-6 py-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60 bg-background/70">
              {products.map((product) => {
                const belowMinimum = product.currentStock < product.minQty && product.active;
                return (
                  <tr key={product.id} className={belowMinimum ? "bg-accent/10" : undefined}>
                    <td className="px-6 py-4">
                      <p className="font-semibold">{product.name}</p>
                      <p className="text-xs text-muted-foreground">ID {product.id.slice(0, 6).toUpperCase()}</p>
                    </td>
                      <td className="px-6 py-4">{categories.find(cat => cat.id === product.category)?.nome || product.category}</td>
                    <td className="px-6 py-4">{product.unit}</td>
                    <td className="px-6 py-4">{product.minQty}</td>
                    <td className="px-6 py-4">{product.margin}%</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <span>{product.currentStock}</span>
                        {belowMinimum ? (
                          <Badge className="bg-destructive/15 text-destructive border-destructive/30">Repor</Badge>
                        ) : null}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <Switch
                          checked={product.active}
                          onCheckedChange={(value) => toggleActive(product.id, value)}
                        />
                        <span className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                          {product.active ? "Ativo" : "Inativo"}
                        </span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>
    </DashboardLayout>
  );
}

function averageMargin(products: ProductRow[]) {
  if (!products.length) return "0%";
  const total = products.reduce((acc, product) => acc + product.margin, 0);
  const avg = Math.round((total / products.length) * 10) / 10;
  return `${avg}%`;
}

function SummaryCard({
  title,
  value,
  highlight,
  tone = "default",
}: {
  title: string;
  value: string;
  highlight: string;
  tone?: "default" | "warning" | "success";
}) {
  const toneClasses = {
    default: "text-secondary",
    warning: "text-accent-foreground",
    success: "text-secondary",
  };

  return (
    <div className="rounded-3xl border border-border/70 bg-card/80 p-6 shadow-inner shadow-primary/10">
      <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">{title}</p>
      <p className="mt-3 text-3xl font-semibold">{value}</p>
      <p className={"mt-3 text-sm " + toneClasses[tone]}>{highlight}</p>
    </div>
  );
}
