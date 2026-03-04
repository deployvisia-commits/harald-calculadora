import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../ui/card";
import { Badge } from "../ui/badge";
import {
  ShoppingCart,
  Package,
  TrendingUp,
  AlertCircle,
  Sparkles,
} from "lucide-react";
import {
  IngredienteCadastrado,
  pacotesNecessarios,
  toGramas,
  CATEGORIA_LABELS,
  CategoriaIngrediente,
} from "../../lib/ingredient-registry";
import { formatCurrency, formatNumber } from "../../lib/utils";
import { motion } from "motion/react";

export interface ItemCompraLivre {
  ingrediente: IngredienteCadastrado;
  quantidadeTotalG: number; // total em gramas necessário
}

interface FreeShoppingListProps {
  itens: ItemCompraLivre[];
  quantidade: number;
}

export function FreeShoppingList({ itens, quantidade }: FreeShoppingListProps) {
  if (itens.length === 0 || quantidade <= 0) {
    return (
      <Card className="border-2 border-dashed border-gray-300">
        <CardContent className="pt-6">
          <div className="text-center py-6 text-muted-foreground">
            <ShoppingCart className="h-12 w-12 mx-auto mb-3 opacity-20" />
            <p className="text-sm">Lista de Compras Vazia</p>
            <p className="text-xs">Monte sua receita e defina a quantidade</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Calcula pacotes para cada item
  const compras = itens.map((item) => {
    const calc = pacotesNecessarios(item.ingrediente, item.quantidadeTotalG);
    return {
      ...item,
      ...calc,
    };
  });

  const custoTotal = compras.reduce((s, c) => s + c.custoTotal, 0);

  // Agrupa por categoria
  const porCategoria: Record<string, typeof compras> = {};
  compras.forEach((c) => {
    const cat = c.ingrediente.categoria;
    if (!porCategoria[cat]) porCategoria[cat] = [];
    porCategoria[cat].push(c);
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <Card className="border-2 border-green-500">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-green-700">
            <ShoppingCart className="h-5 w-5" />
            Lista de Compras
          </CardTitle>
          <CardDescription>
            Pacotes exatos para {quantidade} unidades
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          {Object.entries(porCategoria).map(([cat, items]) => {
            const catInfo =
              CATEGORIA_LABELS[cat as CategoriaIngrediente] ||
              CATEGORIA_LABELS.outros;
            const subtotal = items.reduce((s, i) => s + i.custoTotal, 0);

            return (
              <div key={cat} className="space-y-2">
                <div className="flex items-center justify-between pb-1.5 border-b border-gray-200">
                  <div className="flex items-center gap-2">
                    <span className="text-sm">{catInfo.emoji}</span>
                    <span className="text-sm text-[#757575]">{catInfo.label}</span>
                  </div>
                  <span className="text-xs text-gray-500">
                    {formatCurrency(subtotal)}
                  </span>
                </div>

                {items.map((item, idx) => {
                  const ing = item.ingrediente;
                  const isUn = ing.unidadePacote === "un";
                  const tamG = toGramas(ing.tamanhoPacote, ing.unidadePacote);

                  return (
                    <div
                      key={`${cat}-${idx}`}
                      className="p-2.5 rounded-lg bg-gray-50 space-y-1.5"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-gray-800 truncate">
                            {ing.nome}
                          </p>
                          <p className="text-xs text-gray-400">
                            Precisa:{" "}
                            {isUn
                              ? `${formatNumber(item.quantidadeTotalG, 0)} un`
                              : item.quantidadeTotalG >= 1000
                                ? `${formatNumber(item.quantidadeTotalG / 1000, 2)} kg`
                                : `${formatNumber(item.quantidadeTotalG, 0)} g`}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-[#757575]">
                            {formatCurrency(item.custoTotal)}
                          </p>
                        </div>
                      </div>

                      {/* Detalhes de pacotes */}
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-500">
                          {item.pacotes}×{" "}
                          {isUn
                            ? `${formatNumber(ing.tamanhoPacote, 0)} un`
                            : `${formatNumber(ing.tamanhoPacote, ing.tamanhoPacote % 1 !== 0 ? 2 : 0)}${ing.unidadePacote}`}
                          {" "}(
                          {formatCurrency(ing.precoPacote)} cada)
                        </span>
                        {item.sobraG > 0.5 && !isUn && (
                          <span className="text-green-600 flex items-center gap-0.5">
                            <TrendingUp className="h-3 w-3" />
                            +{item.sobraG >= 1000
                              ? `${formatNumber(item.sobraG / 1000, 2)}kg`
                              : `${formatNumber(item.sobraG, 0)}g`}
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            );
          })}

          {/* Total geral */}
          <div className="pt-3 border-t-2 border-[#7bdcb5] mt-4">
            <div className="flex items-center justify-between p-3 rounded-xl bg-[#7bdcb5] text-white">
              <span className="font-semibold text-gray-800">Total da Compra</span>
              <span className="text-xl font-bold text-gray-800">{formatCurrency(custoTotal)}</span>
            </div>
            <div className="flex items-center justify-between mt-2 px-1">
              <span className="text-xs text-gray-500">Custo por unidade</span>
              <span className="text-sm text-emerald-700">
                {formatCurrency(custoTotal / quantidade)}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
