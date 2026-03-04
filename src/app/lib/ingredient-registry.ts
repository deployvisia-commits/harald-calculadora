// Cadastro de ingredientes livre — persistido em localStorage
// Cada ingrediente tem tamanho do pacote e preço real de compra

const STORAGE_KEY = "harald-ingredientes-cadastro";

export type CategoriaIngrediente =
  | "chocolate"
  | "inclusao"
  | "recheio"
  | "embalagem"
  | "outros";

export interface IngredienteCadastrado {
  id: string;
  nome: string;
  categoria: CategoriaIngrediente;
  tamanhoPacote: number; // tamanho numérico
  unidadePacote: "g" | "kg" | "ml" | "L" | "un";
  precoPacote: number; // R$ por pacote
}

// Preço por kg calculado
export function precoPorKg(ing: IngredienteCadastrado): number {
  if (ing.unidadePacote === "un") {
    // Para unitários (ex: embalagem), preço/un = precoPacote
    return ing.precoPacote;
  }
  const pesoEmG = toGramas(ing.tamanhoPacote, ing.unidadePacote);
  if (pesoEmG <= 0) return 0;
  return (ing.precoPacote / pesoEmG) * 1000;
}

// Converte para gramas
export function toGramas(
  valor: number,
  unidade: "g" | "kg" | "ml" | "L" | "un"
): number {
  switch (unidade) {
    case "kg":
    case "L":
      return valor * 1000;
    case "g":
    case "ml":
      return valor;
    case "un":
      return valor; // 1 unidade = "1"
    default:
      return valor;
  }
}

// Quantos pacotes comprar para atingir X gramas
export function pacotesNecessarios(
  ing: IngredienteCadastrado,
  quantidadeG: number
): {
  pacotes: number;
  custoTotal: number;
  sobraG: number;
} {
  if (ing.unidadePacote === "un") {
    // Para unitários, quantidadeG = quantidade de unidades
    const pacotes = Math.ceil(quantidadeG);
    return {
      pacotes,
      custoTotal: pacotes * ing.precoPacote,
      sobraG: 0,
    };
  }
  const tamG = toGramas(ing.tamanhoPacote, ing.unidadePacote);
  if (tamG <= 0) return { pacotes: 0, custoTotal: 0, sobraG: 0 };
  const pacotes = Math.ceil(quantidadeG / tamG);
  const totalCompradoG = pacotes * tamG;
  return {
    pacotes,
    custoTotal: pacotes * ing.precoPacote,
    sobraG: Math.max(0, totalCompradoG - quantidadeG),
  };
}

// ─── Ingredientes pré-cadastrados ────────────────────────────────────────
export const INGREDIENTES_DEFAULT: IngredienteCadastrado[] = [
  // Chocolate Harald
  {
    id: "melken-ao-leite",
    nome: "Melken Ao Leite",
    categoria: "chocolate",
    tamanhoPacote: 2.05,
    unidadePacote: "kg",
    precoPacote: 87.95,
  },
  {
    id: "melken-meio-amargo",
    nome: "Melken Meio Amargo",
    categoria: "chocolate",
    tamanhoPacote: 2.05,
    unidadePacote: "kg",
    precoPacote: 87.95,
  },
  {
    id: "melken-branco",
    nome: "Melken Branco",
    categoria: "chocolate",
    tamanhoPacote: 2.05,
    unidadePacote: "kg",
    precoPacote: 87.95,
  },
  {
    id: "top-ao-leite",
    nome: "Top Ao Leite",
    categoria: "chocolate",
    tamanhoPacote: 2.05,
    unidadePacote: "kg",
    precoPacote: 59.25,
  },
  {
    id: "top-meio-amargo",
    nome: "Top Meio Amargo",
    categoria: "chocolate",
    tamanhoPacote: 2.05,
    unidadePacote: "kg",
    precoPacote: 59.25,
  },
  {
    id: "top-branco",
    nome: "Top Branco",
    categoria: "chocolate",
    tamanhoPacote: 2.05,
    unidadePacote: "kg",
    precoPacote: 59.25,
  },
  {
    id: "top-blend",
    nome: "Top Blend",
    categoria: "chocolate",
    tamanhoPacote: 2.05,
    unidadePacote: "kg",
    precoPacote: 59.25,
  },
  // Inclusões
  {
    id: "castanha-caju",
    nome: "Castanha de caju",
    categoria: "inclusao",
    tamanhoPacote: 500,
    unidadePacote: "g",
    precoPacote: 44.95,
  },
  {
    id: "amendoim-torrado",
    nome: "Amendoim torrado",
    categoria: "inclusao",
    tamanhoPacote: 500,
    unidadePacote: "g",
    precoPacote: 12.45,
  },
  {
    id: "biscoito-triturado",
    nome: "Biscoito triturado",
    categoria: "inclusao",
    tamanhoPacote: 400,
    unidadePacote: "g",
    precoPacote: 7.49,
  },
  {
    id: "nibs-cacau",
    nome: "Nibs de cacau",
    categoria: "inclusao",
    tamanhoPacote: 200,
    unidadePacote: "g",
    precoPacote: 13.90,
  },
  {
    id: "coco-ralado",
    nome: "Coco ralado",
    categoria: "inclusao",
    tamanhoPacote: 500,
    unidadePacote: "g",
    precoPacote: 14.90,
  },
  // Recheio
  {
    id: "creme-leite-fresco",
    nome: "Creme de leite fresco",
    categoria: "recheio",
    tamanhoPacote: 200,
    unidadePacote: "g",
    precoPacote: 6.49,
  },
  {
    id: "leite-condensado",
    nome: "Leite condensado",
    categoria: "recheio",
    tamanhoPacote: 395,
    unidadePacote: "g",
    precoPacote: 7.49,
  },
  {
    id: "manteiga-sem-sal",
    nome: "Manteiga sem sal",
    categoria: "recheio",
    tamanhoPacote: 200,
    unidadePacote: "g",
    precoPacote: 10.99,
  },
  {
    id: "acucar",
    nome: "Açúcar",
    categoria: "recheio",
    tamanhoPacote: 1,
    unidadePacote: "kg",
    precoPacote: 5.90,
  },
  {
    id: "doce-de-leite",
    nome: "Doce de leite",
    categoria: "recheio",
    tamanhoPacote: 400,
    unidadePacote: "g",
    precoPacote: 11.49,
  },
  {
    id: "cacau-em-po",
    nome: "Cacau em pó",
    categoria: "recheio",
    tamanhoPacote: 200,
    unidadePacote: "g",
    precoPacote: 14.90,
  },
  // Embalagem
  {
    id: "embalagem-padrao",
    nome: "Embalagem (unidade)",
    categoria: "embalagem",
    tamanhoPacote: 1,
    unidadePacote: "un",
    precoPacote: 2.50,
  },
];

// ─── CRUD com localStorage ───────────────────────────────────────────────

export function getIngredientes(): IngredienteCadastrado[] {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch { }
  return [...INGREDIENTES_DEFAULT];
}

export function salvarIngredientes(ingredientes: IngredienteCadastrado[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(ingredientes));
}

export function addIngrediente(
  ingredientes: IngredienteCadastrado[],
  novo: Omit<IngredienteCadastrado, "id">
): IngredienteCadastrado[] {
  const updated = [
    ...ingredientes,
    { ...novo, id: `custom-${Date.now()}` },
  ];
  salvarIngredientes(updated);
  return updated;
}

export function updateIngrediente(
  ingredientes: IngredienteCadastrado[],
  id: string,
  changes: Partial<IngredienteCadastrado>
): IngredienteCadastrado[] {
  const updated = ingredientes.map((ing) =>
    ing.id === id ? { ...ing, ...changes } : ing
  );
  salvarIngredientes(updated);
  return updated;
}

export function removeIngrediente(
  ingredientes: IngredienteCadastrado[],
  id: string
): IngredienteCadastrado[] {
  const updated = ingredientes.filter((ing) => ing.id !== id);
  salvarIngredientes(updated);
  return updated;
}

export function resetIngredientes(): IngredienteCadastrado[] {
  const defaults = [...INGREDIENTES_DEFAULT];
  salvarIngredientes(defaults);
  return defaults;
}

// ─── Labels ──────────────────────────────────────────────────────────────
export const CATEGORIA_LABELS: Record<
  CategoriaIngrediente,
  { label: string; emoji: string; cor: string }
> = {
  chocolate: { label: "Chocolate", emoji: "🍫", cor: "bg-[#cf2e2e] text-white" },
  inclusao: { label: "Inclusão", emoji: "🥜", cor: "bg-amber-100 text-amber-800" },
  recheio: { label: "Recheio", emoji: "🍯", cor: "bg-blue-100 text-blue-800" },
  embalagem: { label: "Embalagem", emoji: "📦", cor: "bg-purple-100 text-purple-800" },
  outros: { label: "Outros", emoji: "📋", cor: "bg-gray-100 text-gray-800" },
};

export const UNIDADES: { value: IngredienteCadastrado["unidadePacote"]; label: string }[] = [
  { value: "g", label: "g" },
  { value: "kg", label: "kg" },
  { value: "ml", label: "ml" },
  { value: "L", label: "L" },
  { value: "un", label: "un" },
];
