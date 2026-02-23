export interface TemperatureCurve {
  derretimento: { min: number; max: number };
  tempera?: { min?: number; max?: number; alvo?: number };
  trabalho: { min?: number; max?: number; alvo?: number };
}

export interface Product {
  id: string;
  sabor: string;
  curva_temperatura: TemperatureCurve;
  fluidez: string;
  fator_rendimento_banho: number;
  nota_comercial?: string;
}

export interface ProductLine {
  nome: string;
  tipo: string;
  instrucoes?: string;
  produtos: Product[];
}

export interface HaraldCatalog {
  marca: string;
  linhas: ProductLine[];
  metodos_resfriamento: string[];
}

export const haraldCatalog: HaraldCatalog = {
  marca: "Harald",
  linhas: [
    {
      nome: "Unique",
      tipo: "Chocolate Nobre",
      produtos: [
        {
          id: "unique-ao-leite",
          sabor: "Ao Leite 35%",
          curva_temperatura: {
            derretimento: { min: 45, max: 50 },
            tempera: { alvo: 28 },
            trabalho: { alvo: 32 },
          },
          fluidez: "Alta",
          fator_rendimento_banho: 1.0,
        },
        {
          id: "unique-meio-amargo-53",
          sabor: "Meio Amargo 53%",
          curva_temperatura: {
            derretimento: { min: 45, max: 50 },
            tempera: { alvo: 28 },
            trabalho: { alvo: 32 },
          },
          fluidez: "Alta",
          fator_rendimento_banho: 1.0,
        },
        {
          id: "unique-63",
          sabor: "63%",
          curva_temperatura: {
            derretimento: { min: 45, max: 50 },
            tempera: { alvo: 28 },
            trabalho: { alvo: 32 },
          },
          fluidez: "Alta",
          fator_rendimento_banho: 1.0,
        },
        {
          id: "unique-70",
          sabor: "70%",
          curva_temperatura: {
            derretimento: { min: 45, max: 50 },
            tempera: { alvo: 28 },
            trabalho: { alvo: 32 },
          },
          fluidez: "Alta",
          fator_rendimento_banho: 1.0,
        },
        {
          id: "unique-branco",
          sabor: "Branco",
          curva_temperatura: {
            derretimento: { min: 45, max: 50 },
            tempera: { alvo: 28 },
            trabalho: { alvo: 32 },
          },
          fluidez: "Alta",
          fator_rendimento_banho: 1.0,
        },
      ],
    },
    {
      nome: "Melken",
      tipo: "Chocolate Nobre",
      produtos: [
        {
          id: "melken-ao-leite",
          sabor: "Ao Leite",
          curva_temperatura: {
            derretimento: { min: 45, max: 50 },
            tempera: { min: 28, max: 29 },
            trabalho: { min: 30, max: 32 },
          },
          fluidez: "Média-Alta",
          fator_rendimento_banho: 1.0,
        },
        {
          id: "melken-blend",
          sabor: "Blend",
          curva_temperatura: {
            derretimento: { min: 45, max: 50 },
            tempera: { min: 28, max: 29 },
            trabalho: { min: 30, max: 32 },
          },
          fluidez: "Média-Alta",
          fator_rendimento_banho: 1.0,
        },
        {
          id: "melken-meio-amargo",
          sabor: "Meio Amargo",
          curva_temperatura: {
            derretimento: { min: 45, max: 50 },
            tempera: { min: 29, max: 30 },
            trabalho: { min: 30, max: 32 },
          },
          fluidez: "Média-Alta",
          fator_rendimento_banho: 1.0,
        },
        {
          id: "melken-branco",
          sabor: "Branco",
          curva_temperatura: {
            derretimento: { min: 40, max: 45 },
            tempera: { min: 27, max: 28 },
            trabalho: { min: 28, max: 29 },
          },
          fluidez: "Média",
          fator_rendimento_banho: 1.0,
        },
      ],
    },
    {
      nome: "Top",
      tipo: "Cobertura Fracionada",
      instrucoes: "Dispensa temperagem. Basta derreter e usar.",
      produtos: [
        {
          id: "top-ao-leite",
          sabor: "Ao Leite",
          curva_temperatura: {
            derretimento: { min: 45, max: 50 },
            trabalho: { min: 38, max: 42 },
          },
          fluidez: "Muito Alta",
          fator_rendimento_banho: 2.0,
          nota_comercial: "Rende até 2x mais que o chocolate nobre em banhos.",
        },
        {
          id: "top-meio-amargo",
          sabor: "Meio Amargo",
          curva_temperatura: {
            derretimento: { min: 45, max: 50 },
            trabalho: { min: 38, max: 42 },
          },
          fluidez: "Muito Alta",
          fator_rendimento_banho: 2.0,
          nota_comercial: "Rende até 2x mais que o chocolate nobre em banhos.",
        },
        {
          id: "top-blend",
          sabor: "Blend",
          curva_temperatura: {
            derretimento: { min: 45, max: 50 },
            trabalho: { min: 38, max: 42 },
          },
          fluidez: "Muito Alta",
          fator_rendimento_banho: 2.0,
          nota_comercial: "Rende até 2x mais que o chocolate nobre em banhos.",
        },
        {
          id: "top-branco",
          sabor: "Branco",
          curva_temperatura: {
            derretimento: { min: 45, max: 50 },
            trabalho: { min: 38, max: 42 },
          },
          fluidez: "Muito Alta",
          fator_rendimento_banho: 2.0,
          nota_comercial: "Rende até 2x mais que o chocolate nobre em banhos.",
        },
        {
          id: "top-avela",
          sabor: "Avelã",
          curva_temperatura: {
            derretimento: { min: 45, max: 50 },
            trabalho: { min: 38, max: 42 },
          },
          fluidez: "Muito Alta",
          fator_rendimento_banho: 2.0,
          nota_comercial: "Rende até 2x mais que o chocolate nobre em banhos.",
        },
      ],
    },
    {
      nome: "Inovare",
      tipo: "Cobertura Fracionada",
      instrucoes: "Dispensa temperagem. Basta derreter e usar.",
      produtos: [
        {
          id: "inovare-ao-leite",
          sabor: "Ao Leite",
          curva_temperatura: {
            derretimento: { min: 45, max: 50 },
            trabalho: { min: 38, max: 42 },
          },
          fluidez: "Muito Alta",
          fator_rendimento_banho: 1.8,
        },
        {
          id: "inovare-branco",
          sabor: "Branco",
          curva_temperatura: {
            derretimento: { min: 45, max: 50 },
            trabalho: { min: 38, max: 42 },
          },
          fluidez: "Muito Alta",
          fator_rendimento_banho: 1.8,
        },
      ],
    },
    {
      nome: "Confeiteiro",
      tipo: "Chocolate Nobre",
      produtos: [
        {
          id: "confeiteiro-ao-leite",
          sabor: "Ao Leite",
          curva_temperatura: {
            derretimento: { min: 45, max: 50 },
            tempera: { min: 28, max: 29 },
            trabalho: { min: 30, max: 32 },
          },
          fluidez: "Média",
          fator_rendimento_banho: 1.0,
        },
        {
          id: "confeiteiro-branco",
          sabor: "Branco",
          curva_temperatura: {
            derretimento: { min: 40, max: 45 },
            tempera: { min: 27, max: 28 },
            trabalho: { min: 28, max: 29 },
          },
          fluidez: "Média",
          fator_rendimento_banho: 1.0,
        },
      ],
    },
  ],
  metodos_resfriamento: [
    "Tablagem (Mármore)",
    "Adição (2/3 derrete, 1/3 gotas frias)",
    "Banho-maria Invertido (Gelo)",
  ],
};

// Helper functions
export function getAllProducts(): Product[] {
  return haraldCatalog.linhas.flatMap((linha) => linha.produtos);
}

export function getProductById(id: string): Product | undefined {
  return getAllProducts().find((p) => p.id === id);
}

export function getProductLine(productId: string): ProductLine | undefined {
  return haraldCatalog.linhas.find((linha) =>
    linha.produtos.some((p) => p.id === productId)
  );
}

export function isCobertura(productId: string): boolean {
  const linha = getProductLine(productId);
  return linha?.tipo === "Cobertura Fracionada";
}
