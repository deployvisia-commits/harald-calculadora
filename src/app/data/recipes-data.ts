// Dados de receitas, inclusões e recomendações para o modo guiado

import { TipoProduto } from "./production-data";

// ─── Inclusões (add-ins crocantes) ───────────────────────────────────────
export interface InclusaoPreset {
  id: string;
  nome: string;
  percentualSugerido: number;
  descricao: string;
  icone: string;
}

export const INCLUSAO_PRESETS: InclusaoPreset[] = [
  {
    id: "castanha-caju",
    nome: "Castanha de caju triturada",
    percentualSugerido: 20,
    descricao: "Crocância premium, combina com todos os sabores",
    icone: "🥜",
  },
  {
    id: "amendoim",
    nome: "Amendoim torrado triturado",
    percentualSugerido: 15,
    descricao: "Clássico, ótimo custo-benefício",
    icone: "🥜",
  },
  {
    id: "biscoito",
    nome: "Biscoito triturado",
    percentualSugerido: 20,
    descricao: "Textura tipo cookies & cream",
    icone: "🍪",
  },
  {
    id: "cereal",
    nome: "Cereal crocante",
    percentualSugerido: 15,
    descricao: "Leveza e crocância, popular com crianças",
    icone: "🥣",
  },
  {
    id: "frutas-secas",
    nome: "Frutas secas picadas",
    percentualSugerido: 15,
    descricao: "Damascos, cranberries, uvas-passas",
    icone: "🍇",
  },
  {
    id: "nibs",
    nome: "Nibs de cacau",
    percentualSugerido: 10,
    descricao: "Intensidade e textura, para paladares sofisticados",
    icone: "🫘",
  },
  {
    id: "coco",
    nome: "Coco ralado torrado",
    percentualSugerido: 15,
    descricao: "Tropical, combina muito com chocolate branco",
    icone: "🥥",
  },
  {
    id: "granola",
    nome: "Granola crocante",
    percentualSugerido: 18,
    descricao: "Mix de cereais e castanhas, sabor integral",
    icone: "🌾",
  },
];

// ─── Receitas de Recheio ─────────────────────────────────────────────────
export interface IngredienteRecheio {
  nome: string;
  quantidadePorKg: number; // gramas por kg de recheio total
  unidade: string;
  isChocolate?: boolean;
}

export interface RecheioTemplate {
  id: string;
  nome: string;
  descricao: string;
  icone: string;
  ingredientes: IngredienteRecheio[];
  proporcaoChocolate: number; // % do peso total que é chocolate
  gramasPorUnidade: {
    ovo_100g: number;
    ovo_250g: number;
    ovo_500g: number;
    trufa_30g: number;
    bombom_15g: number;
  };
  dica: string;
}

export const RECHEIO_TEMPLATES: RecheioTemplate[] = [
  {
    id: "ganache-classico",
    nome: "Ganache Clássico",
    descricao: "Cremoso e versátil, base de creme de leite e chocolate",
    icone: "🍫",
    ingredientes: [
      { nome: "Chocolate", quantidadePorKg: 500, unidade: "g", isChocolate: true },
      { nome: "Creme de leite fresco", quantidadePorKg: 500, unidade: "g" },
    ],
    proporcaoChocolate: 50,
    gramasPorUnidade: { ovo_100g: 20, ovo_250g: 50, ovo_500g: 100, trufa_30g: 18, bombom_15g: 8 },
    dica: "Use creme de leite fresco (não o de caixinha) para melhor resultado.",
  },
  {
    id: "ganache-meio-amargo",
    nome: "Ganache Meio Amargo Intenso",
    descricao: "Proporção 2:1 chocolate/creme para mais intensidade",
    icone: "🖤",
    ingredientes: [
      { nome: "Chocolate meio amargo", quantidadePorKg: 667, unidade: "g", isChocolate: true },
      { nome: "Creme de leite fresco", quantidadePorKg: 333, unidade: "g" },
    ],
    proporcaoChocolate: 67,
    gramasPorUnidade: { ovo_100g: 20, ovo_250g: 50, ovo_500g: 100, trufa_30g: 18, bombom_15g: 8 },
    dica: "Ideal para Melken Meio Amargo. Firme o suficiente para trufas e bombons.",
  },
  {
    id: "brigadeiro-gourmet",
    nome: "Brigadeiro Gourmet",
    descricao: "Tradicional brasileiro com chocolate nobre",
    icone: "🟤",
    ingredientes: [
      { nome: "Chocolate", quantidadePorKg: 240, unidade: "g", isChocolate: true },
      { nome: "Leite condensado", quantidadePorKg: 475, unidade: "g" },
      { nome: "Creme de leite", quantidadePorKg: 240, unidade: "g" },
      { nome: "Manteiga sem sal", quantidadePorKg: 45, unidade: "g" },
    ],
    proporcaoChocolate: 24,
    gramasPorUnidade: { ovo_100g: 25, ovo_250g: 60, ovo_500g: 120, trufa_30g: 18, bombom_15g: 8 },
    dica: "Leve ao fogo baixo mexendo sempre até desgrudar da panela.",
  },
  {
    id: "mousse",
    nome: "Mousse de Chocolate",
    descricao: "Aerado e delicado, perfeito para ovos recheados",
    icone: "☁️",
    ingredientes: [
      { nome: "Chocolate", quantidadePorKg: 300, unidade: "g", isChocolate: true },
      { nome: "Creme de leite fresco", quantidadePorKg: 500, unidade: "g" },
      { nome: "Claras de ovo", quantidadePorKg: 150, unidade: "g" },
      { nome: "Açúcar", quantidadePorKg: 50, unidade: "g" },
    ],
    proporcaoChocolate: 30,
    gramasPorUnidade: { ovo_100g: 20, ovo_250g: 50, ovo_500g: 100, trufa_30g: 0, bombom_15g: 0 },
    dica: "Bata as claras em neve firme e incorpore delicadamente ao chocolate.",
  },
  {
    id: "doce-de-leite",
    nome: "Doce de Leite com Chocolate",
    descricao: "Combinação irresistível para o paladar brasileiro",
    icone: "🍯",
    ingredientes: [
      { nome: "Chocolate branco", quantidadePorKg: 300, unidade: "g", isChocolate: true },
      { nome: "Doce de leite", quantidadePorKg: 600, unidade: "g" },
      { nome: "Creme de leite", quantidadePorKg: 100, unidade: "g" },
    ],
    proporcaoChocolate: 30,
    gramasPorUnidade: { ovo_100g: 25, ovo_250g: 55, ovo_500g: 110, trufa_30g: 18, bombom_15g: 8 },
    dica: "Combine com chocolate branco Melken para um sabor mais refinado.",
  },
];

// ─── Recomendações de Chocolate por tipo de produto ──────────────────────
export interface RecomendacaoChocolate {
  recomendado: string;
  economico: string;
  motivoRecomendado: string;
  motivoEconomico: string;
}

export const RECOMENDACOES: Record<TipoProduto, RecomendacaoChocolate> = {
  ovo_100g: {
    recomendado: "Melken",
    economico: "Top",
    motivoRecomendado: "Ovos menores pedem sabor nobre — maior valor percebido pelo cliente",
    motivoEconomico: "Cobertura com alto rendimento para produções grandes",
  },
  ovo_250g: {
    recomendado: "Melken",
    economico: "Top",
    motivoRecomendado: "Equilíbrio ideal entre sabor nobre e volume de produção",
    motivoEconomico: "Rende até 2x mais em banhos, excelente custo-benefício",
  },
  ovo_500g: {
    recomendado: "Top",
    economico: "Top",
    motivoRecomendado: "Volume grande — Top tem ótimo rendimento e dispensa temperagem",
    motivoEconomico: "Melhor custo-benefício para produção de alto volume",
  },
  trufa_30g: {
    recomendado: "Melken",
    economico: "Top",
    motivoRecomendado: "Trufas premium pedem a complexidade do chocolate nobre",
    motivoEconomico: "Banho externo em Top e ganache com Melken é uma boa combinação",
  },
  bombom_15g: {
    recomendado: "Top",
    economico: "Top",
    motivoRecomendado: "Bombons de volume — Top tem fluidez muito alta, ideal para moldes",
    motivoEconomico: "Dispensa temperagem, muito prático para grandes quantidades",
  },
};

// ─── Labels e helpers ────────────────────────────────────────────────────
export const PRODUTO_ICONS: Record<TipoProduto, string> = {
  ovo_100g: "🥚",
  ovo_250g: "🥚",
  ovo_500g: "🥚",
  trufa_30g: "🍬",
  bombom_15g: "🍫",
};

export const PRODUTO_CATEGORIAS = [
  {
    categoria: "Ovos de Páscoa",
    icone: "🥚",
    produtos: [
      { value: "ovo_100g" as TipoProduto, label: "Ovo 100g", descricao: "Pequeno, ideal para presentes" },
      { value: "ovo_250g" as TipoProduto, label: "Ovo 250g", descricao: "Tamanho clássico, o mais vendido" },
      { value: "ovo_500g" as TipoProduto, label: "Ovo 500g", descricao: "Grande, para presente especial" },
    ],
  },
  {
    categoria: "Doces Finos",
    icone: "🍬",
    produtos: [
      { value: "trufa_30g" as TipoProduto, label: "Trufa 30g", descricao: "Clássica, para caixas e vitrines" },
      { value: "bombom_15g" as TipoProduto, label: "Bombom 15g", descricao: "Perfeito para caixinhas e kits" },
    ],
  },
];
