import { useMemo, useState } from "react";
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
import { Plus, Sparkles } from "lucide-react";

interface StockItemInput {
  product: string;
  quantity: string;
  unit: string;
}

interface StockEntry {
  id: string;
  reference: string;
  createdAt: Date;
  author: string;
  items: StockItemInput[];
}

const INITIAL_ENTRIES: StockEntry[] = [
  {
    id: "ent-001",
    reference: "Semana Retro 32",
    createdAt: new Date("2025-03-02T09:30:00"),
    author: "Junior Pamplona",
    items: [
      { product: "Café Premium", quantity: "18", unit: "KG" },
      { product: "Manteiga Artesanal", quantity: "32", unit: "UN" },
    ],
  },
  {
    id: "ent-002",
    reference: "Reabastecimento Fev",
    createdAt: new Date("2025-02-25T17:15:00"),
    author: "Aurora Bot",
    items: [
      { product: "Farinha de Trigo", quantity: "42", unit: "KG" },
      { product: "Ovos Caipiras", quantity: "18", unit: "DZ" },
      { product: "Ervas Finas", quantity: "12", unit: "PCT" },
    ],
  },
];

const DEFAULT_PRODUCTS = [
  "Café Premium",
  "Manteiga Artesanal",
  "Farinha de Trigo",
  "Ovos Caipiras",
  "Ervas Finas",
  "Azeite Italiano",
];

export default function Stock() {
  const [entries, setEntries] = useState<StockEntry[]>(INITIAL_ENTRIES);
  const [draftItems, setDraftItems] = useState<StockItemInput[]>([
    { product: "", quantity: "", unit: "KG" },
  ]);
  const [reference, setReference] = useState("Lançamento semanal");
  const [author, setAuthor] = useState("Aurora Bot");
  const [showModal, setShowModal] = useState(false);

  const summary = useMemo(() => {
    const totalItems = entries.reduce((acc, entry) => acc + entry.items.length, 0);
    const lastEntry = entries[0];
    return {
      totalEntries: entries.length,
      totalItems,
      lastReference: lastEntry?.reference ?? "—",
      lastDate: lastEntry
        ? new Intl.DateTimeFormat("pt-BR", {
            day: "2-digit",
            month: "long",
            hour: "2-digit",
            minute: "2-digit",
          }).format(lastEntry.createdAt)
        : "—",
    };
  }, [entries]);

  const handleAddDraftRow = () => {
    setDraftItems((items) => [...items, { product: "", quantity: "", unit: "UN" }]);
  };

  const handleUpdateDraft = (index: number, field: keyof StockItemInput, value: string) => {
    setDraftItems((items) => {
      const updated = [...items];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const resetDraft = () => {
    setReference("Lançamento semanal");
    setAuthor("Aurora Bot");
    setDraftItems([{ product: "", quantity: "", unit: "KG" }]);
  };

  const handleSubmit = () => {
    const sanitized = draftItems.filter((item) => item.product.trim() && item.quantity.trim());
    if (!sanitized.length) {
      toast.error("Informe pelo menos um item com produto e quantidade.");
      return false;
    }

    const entry: StockEntry = {
      id: crypto.randomUUID(),
      reference,
      author,
      createdAt: new Date(),
      items: sanitized,
    };

    setEntries((prev) => [entry, ...prev]);
    toast.success("Lançamento registrado com sucesso!");
    resetDraft();
    setShowModal(false);
    return true;
  };

  return (
    <DashboardLayout
      title="Lançamentos de Estoque"
      description="Controle todos os ajustes de estoque com registros organizados por período, referência e responsável."
      action={
        <Dialog open={showModal} onOpenChange={(open) => {
          setShowModal(open);
          if (!open) {
            resetDraft();
          }
        }}>
          <DialogTrigger asChild>
            <Button
              className="gap-2 rounded-full bg-secondary text-secondary-foreground shadow-md shadow-secondary/30"
              onClick={() => setShowModal(true)}
            >
              <Plus className="h-4 w-4" /> Novo lançamento
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Registrar novo lançamento</DialogTitle>
            </DialogHeader>

            <div className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="text-xs font-semibold uppercase tracking-[0.25em] text-muted-foreground">
                    Referência
                  </label>
                  <Input
                    value={reference}
                    onChange={(event) => setReference(event.target.value)}
                    className="mt-2 rounded-xl border-border"
                    placeholder="Ex: Estoque semanal"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold uppercase tracking-[0.25em] text-muted-foreground">
                    Responsável
                  </label>
                  <Input
                    value={author}
                    onChange={(event) => setAuthor(event.target.value)}
                    className="mt-2 rounded-xl border-border"
                    placeholder="Nome do responsável"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold uppercase tracking-[0.25em] text-muted-foreground">
                    Itens neste lançamento
                  </p>
                  <Button variant="ghost" className="gap-2 text-secondary" onClick={handleAddDraftRow}>
                    <Plus className="h-4 w-4" /> adicionar item
                  </Button>
                </div>

                <div className="space-y-3">
                  {draftItems.map((item, index) => (
                    <div
                      key={index}
                      className="grid gap-3 rounded-2xl border border-border bg-card/70 p-4 md:grid-cols-[1.5fr_0.7fr_0.7fr]"
                    >
                      <div>
                        <label className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                          Produto
                        </label>
                        <Input
                          value={item.product}
                          onChange={(event) => handleUpdateDraft(index, "product", event.target.value)}
                          list="stock-products"
                          placeholder="Ex: Café Premium"
                          className="mt-2 rounded-xl border-border"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                          Quantidade atual
                        </label>
                        <Input
                          value={item.quantity}
                          onChange={(event) => handleUpdateDraft(index, "quantity", event.target.value)}
                          placeholder="Ex: 12"
                          className="mt-2 rounded-xl border-border"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                          Unidade
                        </label>
                        <Input
                          value={item.unit}
                          onChange={(event) => handleUpdateDraft(index, "unit", event.target.value)}
                          placeholder="KG, UN, CX..."
                          className="mt-2 rounded-xl border-border"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button variant="ghost" onClick={resetDraft}>
                Limpar
              </Button>
              <Button onClick={handleSubmit}>Salvar lançamento</Button>
            </DialogFooter>

            <datalist id="stock-products">
              {DEFAULT_PRODUCTS.map((product) => (
                <option key={product} value={product} />
              ))}
            </datalist>
          </DialogContent>
        </Dialog>
      }
    >
      <section className="grid gap-6 md:grid-cols-3">
        <SummaryCard title="Total de lançamentos" value={summary.totalEntries.toString()} highlight="+3 esta semana" />
        <SummaryCard title="Produtos atualizados" value={summary.totalItems.toString()} highlight="Cobertura de 92%" />
        <SummaryCard title="Último lançamento" value={summary.lastReference} highlight={summary.lastDate} />
      </section>

      <section className="grid gap-4 rounded-3xl border border-border bg-card/70 p-6">
        <header className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-semibold">Histórico recente</h3>
            <p className="text-sm text-muted-foreground">Visualize quem ajustou o estoque e quais produtos foram lançados.</p>
          </div>
          <Badge className="gap-1 rounded-full bg-primary/15 text-primary">Atualizado a cada 30 minutos</Badge>
        </header>

        <div className="space-y-4">
          {entries.map((entry) => (
            <article key={entry.id} className="rounded-2xl border border-border/70 bg-background/80 p-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h4 className="text-md font-semibold">{entry.reference}</h4>
                  <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">{entry.author}</p>
                </div>
                <span className="rounded-full bg-muted px-4 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                  {new Intl.DateTimeFormat("pt-BR", {
                    day: "2-digit",
                    month: "long",
                    hour: "2-digit",
                    minute: "2-digit",
                  }).format(entry.createdAt)}
                </span>
              </div>

              <div className="mt-4 grid gap-3 md:grid-cols-3">
                {entry.items.map((item, index) => (
                  <div key={index} className="rounded-xl border border-border/60 bg-card/80 p-4">
                    <p className="text-sm font-semibold">{item.product}</p>
                    <p className="text-xs text-muted-foreground">Quantidade atual: {item.quantity} {item.unit}</p>
                  </div>
                ))}
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="rounded-3xl border border-dashed border-secondary/60 bg-secondary/10 p-6 text-secondary">
        <div className="flex flex-wrap items-center gap-4">
          <Sparkles className="h-10 w-10" />
          <div>
            <h3 className="text-lg font-semibold">Sugerido pela IA</h3>
            <p className="text-sm text-secondary-foreground/80">
              Agende um lembrete para revisar o estoque antes do final de semana e evitar rupturas nos produtos de maior giro.
            </p>
          </div>
        </div>
      </section>
    </DashboardLayout>
  );
}

function SummaryCard({ title, value, highlight }: { title: string; value: string; highlight: string }) {
  return (
    <div className="rounded-3xl border border-border/70 bg-card/80 p-6 shadow-inner shadow-primary/10">
      <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">{title}</p>
      <p className="mt-3 text-3xl font-semibold">{value}</p>
      <p className="mt-3 text-sm text-secondary">{highlight}</p>
    </div>
  );
}
