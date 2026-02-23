// Dados técnicos oficiais Harald para cálculos de produção

export interface PesosTecnicos {
  ovo_100g: number;
  ovo_250g: number;
  ovo_500g: number;
  trufa_30g: number;
  bombom_15g: number;
}

export interface LinhaProducao {
  nome: string;
  tipo: "Nobre" | "Cobertura";
  embalagens: number[]; // Em kg
  pesos_tecnicos: PesosTecnicos;
  sabores: string[];
}

export const CONFIG_HARALD = {
  linhas: [
    {
      nome: "Melken",
      tipo: "Nobre" as const,
      embalagens: [2.05, 1.01],
      pesos_tecnicos: {
        ovo_100g: 45,
        ovo_250g: 100,
        ovo_500g: 200,
        trufa_30g: 12,
        bombom_15g: 7,
      },
      sabores: ["Ao Leite", "Meio Amargo", "Branco"],
    },
    {
      nome: "Top",
      tipo: "Cobertura" as const,
      embalagens: [2.05, 1.01, 0.40],
      pesos_tecnicos: {
        ovo_100g: 38,
        ovo_250g: 85,
        ovo_500g: 175,
        trufa_30g: 10,
        bombom_15g: 6,
      },
      sabores: ["Ao Leite", "Meio Amargo", "Branco", "Blend"],
    },
  ] as LinhaProducao[],
};

export type TipoProduto = keyof PesosTecnicos;

export const TIPOS_PRODUTOS: { value: TipoProduto; label: string }[] = [
  { value: "ovo_100g", label: "Ovo de Páscoa 100g" },
  { value: "ovo_250g", label: "Ovo de Páscoa 250g" },
  { value: "ovo_500g", label: "Ovo de Páscoa 500g" },
  { value: "trufa_30g", label: "Trufa 30g" },
  { value: "bombom_15g", label: "Bombom 15g" },
];

export function getLinha(nome: string): LinhaProducao | undefined {
  return CONFIG_HARALD.linhas.find((l) => l.nome === nome);
}

export function getPesoTecnico(linha: string, tipo: TipoProduto): number {
  const linhaData = getLinha(linha);
  return linhaData?.pesos_tecnicos[tipo] || 0;
}

// Calcula a melhor combinação de embalagens para uma quantidade de kg
export function calcularEmbalagens(kg: number, embalagens: number[]): {
  total: number;
  detalhes: { tamanho: number; quantidade: number }[];
  sobra: number;
} {
  // Ordena embalagens da maior para menor
  const sorted = [...embalagens].sort((a, b) => b - a);
  const detalhes: { tamanho: number; quantidade: number }[] = [];
  let restante = kg;

  for (const embalagem of sorted) {
    const quantidade = Math.floor(restante / embalagem);
    if (quantidade > 0) {
      detalhes.push({ tamanho: embalagem, quantidade });
      restante = restante - quantidade * embalagem;
    }
  }

  // Se ainda sobra, adiciona mais uma embalagem da menor disponível
  if (restante > 0.001) {
    const menorEmbalagem = sorted[sorted.length - 1];
    const existente = detalhes.find((d) => d.tamanho === menorEmbalagem);
    if (existente) {
      existente.quantidade += 1;
    } else {
      detalhes.push({ tamanho: menorEmbalagem, quantidade: 1 });
    }
    const totalKg = detalhes.reduce((sum, d) => sum + d.tamanho * d.quantidade, 0);
    restante = totalKg - kg;
  }

  const total = detalhes.reduce((sum, d) => sum + d.tamanho * d.quantidade, 0);

  return { total, detalhes, sobra: Math.max(0, restante) };
}

// ─── Preços por kg (referência editável pelo usuário) ────────────────────
export const PRECOS_REFERENCIA: Record<string, number> = {
  Melken: 42.90,
  Top: 28.90,
};

export function getPrecosPorKg(): Record<string, number> {
  try {
    const saved = localStorage.getItem("harald-precos");
    if (saved) return { ...PRECOS_REFERENCIA, ...JSON.parse(saved) };
  } catch {}
  return { ...PRECOS_REFERENCIA };
}

export function setPrecosPorKg(precos: Record<string, number>) {
  localStorage.setItem("harald-precos", JSON.stringify(precos));
}

// ─── Helper para mapear linha+sabor → ID de produto na Temperagem ────────
export function getTemperingProductId(linha: string, sabor: string): string {
  return `${linha.toLowerCase()}-${sabor.toLowerCase().replace(/ /g, "-")}`;
}