import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Badge } from "../ui/badge";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import {
  Plus,
  Trash2,
  ChefHat,
  Sparkles,
  Info,
} from "lucide-react";
import {
  IngredienteCadastrado,
  precoPorKg,
  CATEGORIA_LABELS,
} from "../../lib/ingredient-registry";
import { formatCurrency, formatNumber } from "../../lib/utils";
import { motion, AnimatePresence } from "motion/react";

// ─── Tipos ───────────────────────────────────────────────────────────────
export interface ReceitaIngrediente {
  id: string;
  ingredienteId: string; // referência ao cadastro
  quantidadePorUnidade: number; // gramas por unidade produzida
}

export interface ReceitaLivre {
  nome: string;
  ingredientes: ReceitaIngrediente[];
}

interface RecipeBuilderProps {
  receita: ReceitaLivre;
  onUpdate: (receita: ReceitaLivre) => void;
  ingredientesCadastro: IngredienteCadastrado[];
  onAddIngredienteToCadastro: () => void; // callback para abrir o cadastro
}

export function RecipeBuilder({
  receita,
  onUpdate,
  ingredientesCadastro,
  onAddIngredienteToCadastro,
}: RecipeBuilderProps) {
  const [addingNew, setAddingNew] = useState(false);
  const [newIngId, setNewIngId] = useState("");
  const [newQtd, setNewQtd] = useState(0);

  // Helpers
  const getIngrediente = (id: string) =>
    ingredientesCadastro.find((i) => i.id === id);

  const custoPorUnidade = (ingredienteId: string, qtdG: number): number => {
    const ing = getIngrediente(ingredienteId);
    if (!ing) return 0;
    if (ing.unidadePacote === "un") {
      // Para unitários, qtdG = quantidade de unidades por produto
      return qtdG * ing.precoPacote;
    }
    const pKg = precoPorKg(ing);
    return (qtdG / 1000) * pKg;
  };

  const custoTotalPorUnidade = receita.ingredientes.reduce(
    (sum, ri) => sum + custoPorUnidade(ri.ingredienteId, ri.quantidadePorUnidade),
    0
  );

  const handleAdd = () => {
    if (!newIngId || newQtd <= 0) return;
    const updated: ReceitaLivre = {
      ...receita,
      ingredientes: [
        ...receita.ingredientes,
        {
          id: `ri-${Date.now()}`,
          ingredienteId: newIngId,
          quantidadePorUnidade: newQtd,
        },
      ],
    };
    onUpdate(updated);
    setNewIngId("");
    setNewQtd(0);
    setAddingNew(false);
  };

  const handleRemove = (id: string) => {
    onUpdate({
      ...receita,
      ingredientes: receita.ingredientes.filter((ri) => ri.id !== id),
    });
  };

  const handleUpdateQtd = (id: string, qtd: number) => {
    onUpdate({
      ...receita,
      ingredientes: receita.ingredientes.map((ri) =>
        ri.id === id ? { ...ri, quantidadePorUnidade: qtd } : ri
      ),
    });
  };

  const handleUpdateIng = (id: string, ingredienteId: string) => {
    onUpdate({
      ...receita,
      ingredientes: receita.ingredientes.map((ri) =>
        ri.id === id ? { ...ri, ingredienteId } : ri
      ),
    });
  };

  // Agrupa ingredientes do cadastro por categoria para o select
  const ingPorCategoria: Record<string, IngredienteCadastrado[]> = {};
  ingredientesCadastro.forEach((ing) => {
    if (!ingPorCategoria[ing.categoria]) ingPorCategoria[ing.categoria] = [];
    ingPorCategoria[ing.categoria].push(ing);
  });

  return (
    <Card className="border-2 border-[#cf2e2e]">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-[#757575]">
          <ChefHat className="h-5 w-5 text-[#cf2e2e]" />
          Minha Receita
        </CardTitle>
        <p className="text-sm text-gray-500">
          Defina os ingredientes para <strong>cada unidade</strong> do seu produto
        </p>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Nome da receita */}
        <div className="space-y-1.5">
          <Label className="text-xs text-gray-500">Nome da receita</Label>
          <Input
            placeholder="Ex: Trufa Gourmet, Ovo Recheado Premium..."
            value={receita.nome}
            onChange={(e) => onUpdate({ ...receita, nome: e.target.value })}
            className="text-sm"
          />
        </div>

        {/* Ingredientes por unidade */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label className="text-xs text-gray-500 uppercase tracking-wider">
              Ingredientes por unidade
            </Label>
            {custoTotalPorUnidade > 0 && (
              <Badge className="bg-emerald-100 text-emerald-800 text-xs">
                Custo/un: {formatCurrency(custoTotalPorUnidade)}
              </Badge>
            )}
          </div>

          {receita.ingredientes.length === 0 && !addingNew ? (
            <div className="text-center py-6 text-muted-foreground border-2 border-dashed border-gray-200 rounded-xl">
              <Sparkles className="h-8 w-8 mx-auto mb-2 opacity-30" />
              <p className="text-sm">Nenhum ingrediente adicionado</p>
              <p className="text-xs text-gray-400 mt-1">
                Adicione os ingredientes que cada unidade do seu produto precisa
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              <AnimatePresence>
                {receita.ingredientes.map((ri) => {
                  const ing = getIngrediente(ri.ingredienteId);
                  const custo = custoPorUnidade(
                    ri.ingredienteId,
                    ri.quantidadePorUnidade
                  );
                  const isUnitario = ing?.unidadePacote === "un";
                  const catInfo = ing
                    ? CATEGORIA_LABELS[ing.categoria]
                    : null;

                  return (
                    <motion.div
                      key={ri.id}
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -20, height: 0 }}
                      className="p-3 rounded-xl bg-[#abb8c3]/10 border border-gray-200 space-y-2"
                    >
                      <div className="flex items-center gap-2">
                        {/* Ingrediente select */}
                        <div className="flex-1 min-w-0">
                          <Select
                            value={ri.ingredienteId}
                            onValueChange={(v) => handleUpdateIng(ri.id, v)}
                          >
                            <SelectTrigger className="h-8 text-sm">
                              <SelectValue placeholder="Escolher ingrediente" />
                            </SelectTrigger>
                            <SelectContent>
                              {Object.entries(ingPorCategoria).map(
                                ([cat, itens]) => {
                                  const catL =
                                    CATEGORIA_LABELS[
                                    cat as keyof typeof CATEGORIA_LABELS
                                    ];
                                  return (
                                    <SelectGroup key={cat}>
                                      <SelectLabel className="px-2 py-1 text-[10px] text-gray-400 uppercase">
                                        {catL?.emoji} {catL?.label}
                                      </SelectLabel>
                                      {itens.map((i) => (
                                        <SelectItem key={i.id} value={i.id}>
                                          {i.nome}
                                        </SelectItem>
                                      ))}
                                    </SelectGroup>
                                  );
                                }
                              )}
                            </SelectContent>
                          </Select>
                        </div>

                        {/* Quantidade */}
                        <div className="flex items-center gap-1 w-28">
                          <Input
                            type="number"
                            min="0"
                            step={isUnitario ? "1" : "0.5"}
                            value={ri.quantidadePorUnidade || ""}
                            onChange={(e) =>
                              handleUpdateQtd(
                                ri.id,
                                parseFloat(e.target.value) || 0
                              )
                            }
                            className="h-8 text-sm text-right w-24"
                          />
                          <span className="text-xs text-gray-400 w-5">
                            {isUnitario ? "un" : "g"}
                          </span>
                        </div>

                        {/* Custo */}
                        <span className="text-sm text-emerald-700 w-16 text-right">
                          {formatCurrency(custo)}
                        </span>

                        {/* Delete */}
                        <button
                          onClick={() => handleRemove(ri.id)}
                          className="p-1 rounded hover:bg-red-50 text-gray-400 hover:text-red-600 cursor-pointer"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>

                      {/* Info do ingrediente */}
                      {ing && !isUnitario && (
                        <div className="flex items-center gap-2 text-[10px] text-gray-400 pl-1">
                          <span>
                            {formatNumber(ing.tamanhoPacote, ing.tamanhoPacote % 1 !== 0 ? 2 : 0)}
                            {ing.unidadePacote} por {formatCurrency(ing.precoPacote)}
                          </span>
                          <span>•</span>
                          <span>{formatCurrency(precoPorKg(ing))}/kg</span>
                        </div>
                      )}
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          )}

          {/* Adicionar ingrediente */}
          {addingNew ? (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="p-3 border-2 border-dashed border-[#cf2e2e] rounded-xl bg-amber-50/30 space-y-3"
            >
              <div className="flex items-center gap-2">
                <div className="flex-1">
                  <Select value={newIngId} onValueChange={setNewIngId}>
                    <SelectTrigger className="h-8 text-sm">
                      <SelectValue placeholder="Escolher ingrediente" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(ingPorCategoria).map(([cat, itens]) => {
                        const catL =
                          CATEGORIA_LABELS[cat as keyof typeof CATEGORIA_LABELS];
                        return (
                          <SelectGroup key={cat}>
                            <SelectLabel className="px-2 py-1 text-[10px] text-gray-400 uppercase">
                              {catL?.emoji} {catL?.label}
                            </SelectLabel>
                            {itens.map((i) => (
                              <SelectItem key={i.id} value={i.id}>
                                {i.nome}
                              </SelectItem>
                            ))}
                          </SelectGroup>
                        );
                      })}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center gap-1">
                  <Input
                    type="number"
                    min="0"
                    step="0.5"
                    placeholder="Qtd"
                    value={newQtd || ""}
                    onChange={(e) => setNewQtd(parseFloat(e.target.value) || 0)}
                    className="h-8 text-sm w-24 text-right"
                  />
                  <span className="text-xs text-gray-400">g</span>
                </div>
              </div>
              <div className="flex gap-2">
                <Button size="sm" onClick={handleAdd} className="flex-1 h-7 text-xs">
                  <Plus className="h-3 w-3 mr-1" />
                  Adicionar
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => {
                    setAddingNew(false);
                    setNewIngId("");
                    setNewQtd(0);
                  }}
                  className="h-7 text-xs"
                >
                  Cancelar
                </Button>
              </div>
              <button
                onClick={onAddIngredienteToCadastro}
                className="text-xs text-[#cf2e2e] hover:text-[#cf2e2e]/80 flex items-center gap-1 cursor-pointer"
              >
                <Info className="h-3 w-3" />
                Não encontrou? Cadastre um novo ingrediente abaixo
              </button>
            </motion.div>
          ) : (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setAddingNew(true)}
              className="w-full gap-1 border-dashed"
            >
              <Plus className="h-4 w-4" />
              Adicionar Ingrediente
            </Button>
          )}
        </div>

        {/* Resumo de custo por unidade */}
        {receita.ingredientes.length > 0 && (
          <div className="p-3 rounded-xl bg-[#7bdcb5]/20 border border-emerald-200">
            <div className="flex items-center justify-between">
              <span className="text-sm text-emerald-800">
                Custo por unidade
              </span>
              <span className="text-lg text-emerald-800">
                {formatCurrency(custoTotalPorUnidade)}
              </span>
            </div>
            <div className="text-xs text-emerald-600 mt-1">
              {receita.ingredientes.length} ingrediente
              {receita.ingredientes.length !== 1 ? "s" : ""} na receita
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}