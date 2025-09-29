import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Sparkles, Wand2 } from "lucide-react";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";

const trendData = [
  { month: "Jan", consumo: 320, reposicao: 280 },
  { month: "Fev", consumo: 340, reposicao: 300 },
  { month: "Mar", consumo: 360, reposicao: 320 },
  { month: "Abr", consumo: 390, reposicao: 350 },
  { month: "Mai", consumo: 420, reposicao: 360 },
  { month: "Jun", consumo: 450, reposicao: 400 },
];

const aiSuggestions = [
  {
    title: "Reposição imediata",
    detail: "Café Premium ficará abaixo de 10KG em 4 dias. Comprar 25KG agora evita ruptura e garante margem de 15%.",
    priority: "Alta",
  },
  {
    title: "Compra programada",
    detail: "Ervas Finas atingirão o mínimo em 9 dias. Sugestão de compra: 12 PCT para aproveitar lote promocional.",
    priority: "Média",
  },
  {
    title: "Margem segura",
    detail: "Laticínios apresentam sobra de 8%. Redirecione verba para proteínas frescas na próxima semana.",
    priority: "Baixa",
  },
];

const purchasePlan = [
  { produto: "Café Premium", status: "Urgente", quantidade: "25 KG", fornecedor: "Aurora", impacto: "+18% margem" },
  { produto: "Ervas Finas", status: "Programado", quantidade: "12 PCT", fornecedor: "Verde Vivo", impacto: "+9% giro" },
  { produto: "Filé Mignon", status: "Monitorar", quantidade: "18 KG", fornecedor: "Prime Carnes", impacto: "Estoque 5 dias" },
];

export default function Reports() {
  return (
    <DashboardLayout
      title="Relatórios & IA"
      description="Analise o consumo histórico, receba recomendações inteligentes e planeje suas compras com confiança retro futurista."
      action={
        <Button className="gap-2 rounded-full bg-secondary text-secondary-foreground shadow-secondary/30">
          <Wand2 className="h-4 w-4" /> Gerar relatório em PDF
        </Button>
      }
    >
      <section className="grid gap-6 md:grid-cols-2">
        <Card className="rounded-3xl border-border bg-card/80 shadow-inner shadow-primary/10">
          <CardContent className="space-y-4 p-6">
            <header className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Consumo vs Reposição</p>
                <h3 className="mt-2 text-xl font-semibold">Tendência de 6 meses</h3>
              </div>
              <Badge className="rounded-full bg-primary/15 text-primary">IA calibrada</Badge>
            </header>
            <ChartContainer
              config={{
                consumo: { label: "Consumo", color: "hsl(var(--primary))" },
                reposicao: { label: "Reposição", color: "hsl(var(--secondary))" },
              }}
              className="h-64"
            >
              <AreaChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsla(var(--border),0.8)" />
                <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={8} />
                <YAxis tickLine={false} axisLine={false} tickMargin={16} width={60} />
                <ChartTooltip content={<ChartTooltipContent />} cursor={{ stroke: "hsl(var(--border))" }} />
                <Area type="monotone" dataKey="consumo" stroke="hsl(var(--primary))" fill="hsl(var(--primary)/0.25)" strokeWidth={3} />
                <Area type="monotone" dataKey="reposicao" stroke="hsl(var(--secondary))" fill="hsl(var(--secondary)/0.2)" strokeWidth={3} />
                <ChartLegend content={<ChartLegendContent />} />
              </AreaChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card className="rounded-3xl border-border bg-card/80 shadow-inner shadow-secondary/10">
          <CardContent className="flex h-full flex-col gap-6 p-6">
            <header className="space-y-2">
              <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Assistente Aurora AI</p>
              <h3 className="text-xl font-semibold">Diagnóstico automático</h3>
              <p className="text-sm text-muted-foreground">
                A IA monitora entradas, saídas e sazonalidade para recomendar a próxima compra ideal.
              </p>
            </header>

            <div className="space-y-4">
              {aiSuggestions.map((suggestion) => (
                <div key={suggestion.title} className="rounded-2xl border border-border/60 bg-background/80 p-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-semibold">{suggestion.title}</h4>
                    <Badge className="rounded-full bg-secondary/15 text-secondary-foreground">
                      Prioridade {suggestion.priority}
                    </Badge>
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground">{suggestion.detail}</p>
                </div>
              ))}
            </div>

            <div className="rounded-2xl border border-dashed border-secondary/60 bg-secondary/10 p-4 text-secondary">
              <div className="flex items-center gap-3">
                <Sparkles className="h-5 w-5" />
                <p className="text-sm">
                  Conectado ao histórico de cotações — assim que novas respostas chegam, o plano se atualiza automaticamente.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      <section className="rounded-3xl border border-border bg-card/80 p-6">
        <header className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-semibold">Plano de compra recomendado</h3>
            <p className="text-sm text-muted-foreground">
              Ajustado pela IA com base no consumo projetado, margem desejada e criticidade de estoque.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Input placeholder="Buscar produto" className="h-10 rounded-xl border-border bg-background/70" />
            <Button variant="ghost" className="rounded-xl border border-border/70 bg-background/60 text-sm">
              Exportar CSV
            </Button>
          </div>
        </header>

        <div className="mt-6 overflow-hidden rounded-2xl border border-border/70">
          <table className="min-w-full divide-y divide-border/80 text-left text-sm">
            <thead className="bg-muted/50 text-xs uppercase tracking-[0.3em] text-muted-foreground">
              <tr>
                <th className="px-6 py-4">Produto</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Quantidade sugerida</th>
                <th className="px-6 py-4">Fornecedor indicado</th>
                <th className="px-6 py-4">Impacto</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60 bg-background/70">
              {purchasePlan.map((row) => (
                <tr key={row.produto}>
                  <td className="px-6 py-4 font-semibold">{row.produto}</td>
                  <td className="px-6 py-4">
                    <Badge className="rounded-full bg-primary/15 text-primary">{row.status}</Badge>
                  </td>
                  <td className="px-6 py-4">{row.quantidade}</td>
                  <td className="px-6 py-4">{row.fornecedor}</td>
                  <td className="px-6 py-4 text-secondary">{row.impacto}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </DashboardLayout>
  );
}
