import React, { useState, useEffect, useMemo, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Badge } from "../ui/badge";
import { RecipeBuilder, ReceitaLivre } from "./RecipeBuilder";
import { IngredientRegistry } from "./IngredientRegistry";
import { FreeShoppingList, ItemCompraLivre } from "./FreeShoppingList";
import { BusinessBox } from "./BusinessBox";
import {
  IngredienteCadastrado,
  getIngredientes,
  salvarIngredientes,
  addIngrediente,
  updateIngrediente,
  removeIngrediente,
  resetIngredientes,
  precoPorKg,
  toGramas,
  pacotesNecessarios,
} from "../../lib/ingredient-registry";
import { formatCurrency, formatNumber } from "../../lib/utils";
import {
  ChevronLeft,
  Package,
  Calculator,
  Lightbulb,
  Save,
  FolderOpen,
  Trash2,
  RotateCcw,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

const STORAGE_KEY_RECEITA = "harald-receita-livre";
const STORAGE_KEY_QTD = "harald-receita-qtd";
const STORAGE_KEY_MARGEM = "harald-receita-margem";
const STORAGE_KEY_SAVED = "harald-receitas-salvas";

interface FreeCalculatorProps {
  onBack: () => void;
}

interface ReceitaSalva {
  id: string;
  nome: string;
  receita: ReceitaLivre;
  dataSalva: string;
}

export function FreeCalculator({ onBack }: FreeCalculatorProps) {
  // ─── Ingredientes cadastrados ──────────────────────────────────────
  const [ingredientes, setIngredientes] = useState<IngredienteCadastrado[]>(
    () => getIngredientes()
  );

  // ─── Receita atual ─────────────────────────────────────────────────
  const [receita, setReceita] = useState<ReceitaLivre>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_RECEITA);
      if (saved) return JSON.parse(saved);
    } catch { }
    return { nome: "", ingredientes: [] };
  });

  const [quantidade, setQuantidade] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_QTD);
      if (saved) return parseInt(saved) || 100;
    } catch { }
    return 100;
  });

  const [margemSeguranca, setMargemSeguranca] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_MARGEM);
      if (saved) return parseInt(saved) || 5;
    } catch { }
    return 5;
  });

  // ─── Receitas salvas ───────────────────────────────────────────────
  const [receitasSalvas, setReceitasSalvas] = useState<ReceitaSalva[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_SAVED);
      if (saved) return JSON.parse(saved);
    } catch { }
    return [];
  });

  const [showSaved, setShowSaved] = useState(false);

  // ─── Ref para scroll ──────────────────────────────────────────────
  const registryRef = useRef<HTMLDivElement>(null);

  // ─── Persistência ──────────────────────────────────────────────────
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_RECEITA, JSON.stringify(receita));
  }, [receita]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_QTD, String(quantidade));
  }, [quantidade]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_MARGEM, String(margemSeguranca));
  }, [margemSeguranca]);

  // ─── Handlers do cadastro ──────────────────────────────────────────
  const handleAddIng = (novo: Omit<IngredienteCadastrado, "id">) => {
    setIngredientes(addIngrediente(ingredientes, novo));
  };

  const handleUpdateIng = (id: string, changes: Partial<IngredienteCadastrado>) => {
    setIngredientes(updateIngrediente(ingredientes, id, changes));
  };

  const handleRemoveIng = (id: string) => {
    setIngredientes(removeIngrediente(ingredientes, id));
  };

  const handleResetIng = () => {
    setIngredientes(resetIngredientes());
  };

  const scrollToRegistry = () => {
    registryRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // ─── Salvar / Carregar receita ─────────────────────────────────────
  const salvarReceita = () => {
    if (!receita.nome.trim()) return;
    const nova: ReceitaSalva = {
      id: `r-${Date.now()}`,
      nome: receita.nome,
      receita: { ...receita },
      dataSalva: new Date().toLocaleDateString("pt-BR"),
    };
    const updated = [...receitasSalvas, nova];
    setReceitasSalvas(updated);
    localStorage.setItem(STORAGE_KEY_SAVED, JSON.stringify(updated));
  };

  const carregarReceita = (saved: ReceitaSalva) => {
    setReceita(saved.receita);
    setShowSaved(false);
  };

  const deletarReceitaSalva = (id: string) => {
    const updated = receitasSalvas.filter((r) => r.id !== id);
    setReceitasSalvas(updated);
    localStorage.setItem(STORAGE_KEY_SAVED, JSON.stringify(updated));
  };

  // ─── Cálculos ──────────────────────────────────────────────────────
  const calculos = useMemo(() => {
    if (receita.ingredientes.length === 0 || quantidade <= 0) {
      return { itensCompra: [], custoTotal: 0, custoPorUnidade: 0 };
    }

    const margemMult = 1 + margemSeguranca / 100;

    const itensCompra: ItemCompraLivre[] = receita.ingredientes
      .map((ri) => {
        const ing = ingredientes.find((i) => i.id === ri.ingredienteId);
        if (!ing) return null;
        const totalG = ri.quantidadePorUnidade * quantidade * margemMult;
        return { ingrediente: ing, quantidadeTotalG: totalG };
      })
      .filter(Boolean) as ItemCompraLivre[];

    // Custo total = soma dos pacotes necessários × preço pacote
    let custoTotal = 0;
    itensCompra.forEach((item) => {
      const calc = pacotesNecessarios(item.ingrediente, item.quantidadeTotalG);
      custoTotal += calc.custoTotal;
    });

    return {
      itensCompra,
      custoTotal,
      custoPorUnidade: custoTotal / quantidade,
    };
  }, [receita, quantidade, margemSeguranca, ingredientes]);

  // ─── Render ────────────────────────────────────────────────────────
  return (
    <div>
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <Button variant="ghost" size="sm" onClick={onBack} className="gap-1">
          <ChevronLeft className="h-4 w-4" />
          Trocar modo
        </Button>
        <div className="flex-1" />
        {receita.nome.trim() && receita.ingredientes.length > 0 && (
          <Button
            variant="outline"
            size="sm"
            onClick={salvarReceita}
            className="gap-1 text-green-700 border-green-300 hover:bg-green-50"
          >
            <Save className="h-4 w-4" />
            Salvar Receita
          </Button>
        )}
        {receitasSalvas.length > 0 && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowSaved(!showSaved)}
            className="gap-1"
          >
            <FolderOpen className="h-4 w-4" />
            Minhas Receitas ({receitasSalvas.length})
          </Button>
        )}
      </div>

      {/* Título */}
      <div className="mb-6">
        <h1 className="text-3xl mb-2 text-[#757575]">Modo Livre</h1>
        <p className="text-gray-600">
          Crie sua receita, cadastre seus ingredientes com preços reais e calcule o custo exato
        </p>
      </div>

      {/* Modal de receitas salvas */}
      <AnimatePresence>
        {showSaved && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-6"
          >
            <Card className="border-2 border-blue-200 bg-blue-50/30">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-blue-800 text-base">
                  <FolderOpen className="h-4 w-4" />
                  Receitas Salvas
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {receitasSalvas.map((saved) => (
                  <div
                    key={saved.id}
                    className="flex items-center justify-between p-3 rounded-lg bg-white border border-blue-100"
                  >
                    <div>
                      <p className="text-sm text-gray-800">{saved.nome}</p>
                      <p className="text-xs text-gray-400">
                        {saved.receita.ingredientes.length} ingredientes •{" "}
                        {saved.dataSalva}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => carregarReceita(saved)}
                        className="h-7 text-xs"
                      >
                        Carregar
                      </Button>
                      <button
                        onClick={() => deletarReceitaSalva(saved.id)}
                        className="p-1 rounded hover:bg-red-50 text-gray-400 hover:text-red-600 cursor-pointer"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* ═══ Coluna esquerda: Receita + Cadastro ═══ */}
        <div className="lg:col-span-2 space-y-6">
          {/* Recipe Builder */}
          <RecipeBuilder
            receita={receita}
            onUpdate={setReceita}
            ingredientesCadastro={ingredientes}
            onAddIngredienteToCadastro={scrollToRegistry}
          />

          {/* Produção */}
          <Card className="border-2 border-gray-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-[#757575]">
                <Calculator className="h-5 w-5 text-[#cf2e2e]" />
                Produção
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Quantidade a produzir</Label>
                  <Input
                    type="number"
                    min="1"
                    value={quantidade}
                    onChange={(e) =>
                      setQuantidade(Math.max(1, parseInt(e.target.value) || 1))
                    }
                    className="text-lg h-12"
                  />
                  <p className="text-xs text-muted-foreground">
                    Quantas unidades de{" "}
                    <strong>{receita.nome || "sua receita"}</strong> quer
                    produzir
                  </p>
                </div>

                <div className="space-y-2">
                  <Label>
                    Margem de Segurança: {margemSeguranca}%
                  </Label>
                  <input
                    type="range"
                    min="0"
                    max="20"
                    step="1"
                    value={margemSeguranca}
                    onChange={(e) =>
                      setMargemSeguranca(parseInt(e.target.value))
                    }
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#cf2e2e] mt-3"
                  />
                  <p className="text-xs text-muted-foreground">
                    Compensa quebras e perdas na produção
                  </p>
                </div>
              </div>

              {/* Resumo rápido */}
              {receita.ingredientes.length > 0 && quantidade > 0 && (
                <div className="grid grid-cols-3 gap-3 pt-2">
                  <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-center">
                    <p className="text-xs text-gray-500 mb-0.5">Produção</p>
                    <p className="text-lg text-[#757575]">{quantidade}</p>
                    <p className="text-[10px] text-gray-400">unidades</p>
                  </div>
                  <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-center">
                    <p className="text-xs text-gray-500 mb-0.5">Custo/un</p>
                    <p className="text-lg text-emerald-700">
                      {formatCurrency(calculos.custoPorUnidade)}
                    </p>
                    <p className="text-[10px] text-gray-400">ingredientes</p>
                  </div>
                  <div className="p-3 rounded-xl bg-blue-50 border border-blue-200 text-center">
                    <p className="text-xs text-gray-500 mb-0.5">Investimento</p>
                    <p className="text-lg text-blue-700">
                      {formatCurrency(calculos.custoTotal)}
                    </p>
                    <p className="text-[10px] text-gray-400">total</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Cadastro de ingredientes */}
          <div ref={registryRef}>
            <IngredientRegistry
              ingredientes={ingredientes}
              onAdd={handleAddIng}
              onUpdate={handleUpdateIng}
              onRemove={handleRemoveIng}
              onReset={handleResetIng}
            />
          </div>

          {/* Dica */}
          <div className="flex items-start gap-3 p-4 rounded-xl bg-amber-50/50 border border-amber-200">
            <Lightbulb className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-amber-900 space-y-1">
              <p>
                <strong>Como usar:</strong> 1) Cadastre seus ingredientes com o
                preço real que você paga. 2) Monte a receita definindo quanto de
                cada ingrediente vai em cada unidade. 3) Defina a quantidade e
                veja a lista de compras com os pacotes exatos.
              </p>
              <p className="text-xs text-amber-700">
                Os preços já vêm com valores médios de referência — ajuste
                conforme sua região no cadastro de ingredientes.
              </p>
            </div>
          </div>
        </div>

        {/* ═══ Coluna direita: Resultados ═══ */}
        <div className="lg:col-span-1 space-y-6">
          <div className="lg:sticky lg:top-24 space-y-6">
            {/* Shopping list */}
            <FreeShoppingList
              itens={calculos.itensCompra}
              quantidade={quantidade}
            />

            {/* Business Box */}
            {calculos.custoTotal > 0 && quantidade > 0 && (
              <BusinessBox
                custoTotalIngredientes={calculos.custoTotal}
                quantidade={quantidade}
                tipoProdutoLabel={receita.nome || "unidade"}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
