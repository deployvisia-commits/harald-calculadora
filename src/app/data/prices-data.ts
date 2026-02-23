// Base de preços médios por kg — editáveis pelo usuário via localStorage
// Valores de referência de mercado varejista (Brasil, 2026)

const STORAGE_KEY = "harald-precos-todos";

export const PRECOS_DEFAULT: Record<string, number> = {
  // ─── Chocolate Harald (por kg) ──────────────────────────────────────
  Melken: 42.90,
  Top: 28.90,

  // ─── Inclusões (por kg) ─────────────────────────────────────────────
  "Castanha de caju triturada": 89.90,
  "Amendoim torrado triturado": 24.90,
  "Biscoito triturado": 18.90,
  "Cereal crocante": 15.90,
  "Frutas secas picadas": 45.90,
  "Nibs de cacau": 65.90,
  "Coco ralado torrado": 29.90,
  "Granola crocante": 22.90,

  // ─── Ingredientes de Recheio (por kg) ───────────────────────────────
  "Creme de leite fresco": 32.90,
  "Creme de leite": 26.90,
  "Leite condensado": 18.90,
  "Manteiga sem sal": 54.90,
  "Claras de ovo": 24.90,
  "Açúcar": 5.90,
  "Doce de leite": 28.90,

  // Chocolate genérico no recheio → usa preço da linha selecionada
  // Esses são apenas fallback se não encontrar a linha
  Chocolate: 42.90,
  "Chocolate meio amargo": 42.90,
  "Chocolate branco": 42.90,

  // ─── Embalagem (por unidade) ────────────────────────────────────────
  _embalagem: 2.50,
};

export interface CustoIngrediente {
  nome: string;
  quantidadeG: number; // gramas
  precoPorKg: number;
  custoTotal: number;
  categoria: "chocolate" | "inclusao" | "recheio" | "embalagem";
}

/**
 * Retorna todos os preços (default + edições do usuário)
 */
export function getTodosPrecos(): Record<string, number> {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return { ...PRECOS_DEFAULT, ...JSON.parse(saved) };
  } catch {}
  return { ...PRECOS_DEFAULT };
}

/**
 * Salva preços editados pelo usuário
 */
export function salvarPrecos(precos: Record<string, number>): void {
  // Só salva diff do default para economizar storage
  const diff: Record<string, number> = {};
  for (const [key, value] of Object.entries(precos)) {
    if (PRECOS_DEFAULT[key] !== value) {
      diff[key] = value;
    }
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(diff));
}

/**
 * Obtém preço de um ingrediente específico
 */
export function getPreco(nome: string, todosPrecos?: Record<string, number>): number {
  const precos = todosPrecos || getTodosPrecos();
  return precos[nome] ?? 0;
}

/**
 * Preço por kg de um ingrediente de recheio.
 * Se for ingrediente marcado como isChocolate, usa o preço da linha selecionada.
 */
export function getPrecoRecheioIngrediente(
  nomeIngrediente: string,
  isChocolate: boolean,
  linhaHarald: string,
  todosPrecos: Record<string, number>
): number {
  if (isChocolate) {
    return todosPrecos[linhaHarald] ?? todosPrecos["Chocolate"] ?? 42.90;
  }
  return todosPrecos[nomeIngrediente] ?? 0;
}

/**
 * Margem de lucro salva pelo usuário
 */
export function getMargemLucro(): number {
  try {
    const saved = localStorage.getItem("harald-margem-lucro");
    if (saved) return parseFloat(saved);
  } catch {}
  return 100; // default 100% = markup 2x
}

export function salvarMargemLucro(margem: number): void {
  localStorage.setItem("harald-margem-lucro", String(margem));
}

/**
 * Custo de embalagem por unidade salvo pelo usuário
 */
export function getCustoEmbalagem(): number {
  try {
    const saved = localStorage.getItem("harald-custo-embalagem");
    if (saved) return parseFloat(saved);
  } catch {}
  return PRECOS_DEFAULT._embalagem;
}

export function salvarCustoEmbalagem(custo: number): void {
  localStorage.setItem("harald-custo-embalagem", String(custo));
}
