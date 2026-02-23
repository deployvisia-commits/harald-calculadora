import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import {
  DollarSign,
  ChevronDown,
  ChevronUp,
  RotateCcw,
} from "lucide-react";
import { formatCurrency, formatNumber } from "../../lib/utils";
import { CustoIngrediente, PRECOS_DEFAULT } from "../../data/prices-data";

interface CostEditorProps {
  custos: CustoIngrediente[];
  precos: Record<string, number>;
  onUpdatePreco: (nome: string, valor: number) => void;
  onResetPrecos: () => void;
}

export function CostEditor({
  custos,
  precos,
  onUpdatePreco,
  onResetPrecos,
}: CostEditorProps) {
  const [expanded, setExpanded] = useState(true);

  // Agrupa por categoria
  const porCategoria = custos.reduce(
    (acc, c) => {
      if (!acc[c.categoria]) acc[c.categoria] = [];
      acc[c.categoria].push(c);
      return acc;
    },
    {} as Record<string, CustoIngrediente[]>
  );

  const categoriaLabels: Record<string, { label: string; color: string }> = {
    chocolate: { label: "Chocolate", color: "bg-[#3D1E12] text-white" },
    inclusao: { label: "Inclusões", color: "bg-amber-100 text-amber-800" },
    recheio: { label: "Recheio", color: "bg-blue-100 text-blue-800" },
  };

  const custoTotal = custos.reduce((sum, c) => sum + c.custoTotal, 0);

  // Checa se algum preço foi editado
  const temEdicao = Object.entries(precos).some(
    ([key, val]) => PRECOS_DEFAULT[key] !== undefined && PRECOS_DEFAULT[key] !== val
  );

  return (
    <Card className="border-2 border-[#FFD100]/50">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-[#3D1E12]">
            <DollarSign className="h-5 w-5 text-[#FFD100]" />
            Custos de Ingredientes
          </CardTitle>
          <div className="flex items-center gap-2">
            {temEdicao && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onResetPrecos}
                className="text-xs text-gray-400 hover:text-gray-600 gap-1"
              >
                <RotateCcw className="h-3 w-3" />
                Resetar
              </Button>
            )}
            <button
              onClick={() => setExpanded(!expanded)}
              className="p-1 rounded-lg hover:bg-gray-100 cursor-pointer"
            >
              {expanded ? (
                <ChevronUp className="h-4 w-4 text-gray-400" />
              ) : (
                <ChevronDown className="h-4 w-4 text-gray-400" />
              )}
            </button>
          </div>
        </div>
        <p className="text-xs text-gray-500">
          Preços médios de mercado — ajuste conforme sua região
        </p>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Total geral sempre visível */}
        <div className="flex items-center justify-between p-3 rounded-xl bg-gradient-to-r from-[#FFD100]/10 to-amber-50 border border-[#FFD100]/30">
          <span className="text-sm text-[#3D1E12]">Custo Total dos Ingredientes</span>
          <span className="text-xl text-[#3D1E12]">
            {formatCurrency(custoTotal)}
          </span>
        </div>

        {/* Detalhamento editável */}
        {expanded && (
          <div className="space-y-4">
            {Object.entries(porCategoria).map(([cat, itens]) => {
              const catInfo = categoriaLabels[cat] || {
                label: cat,
                color: "bg-gray-100 text-gray-800",
              };
              const subtotal = itens.reduce((s, i) => s + i.custoTotal, 0);

              return (
                <div key={cat} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Badge className={`${catInfo.color} text-xs`}>
                      {catInfo.label}
                    </Badge>
                    <span className="text-xs text-gray-500">
                      Subtotal: {formatCurrency(subtotal)}
                    </span>
                  </div>

                  <div className="space-y-1.5">
                    {itens.map((item, idx) => {
                      const qtdKg = item.quantidadeG / 1000;
                      const isEditado =
                        PRECOS_DEFAULT[item.nome] !== undefined &&
                        precos[item.nome] !== PRECOS_DEFAULT[item.nome];

                      return (
                        <div
                          key={`${cat}-${idx}`}
                          className="grid grid-cols-12 gap-2 items-center p-2 rounded-lg bg-gray-50/80 hover:bg-gray-100/80 transition-colors"
                        >
                          {/* Nome + quantidade */}
                          <div className="col-span-5 min-w-0">
                            <p className="text-sm text-gray-800 truncate">
                              {item.nome}
                            </p>
                            <p className="text-xs text-gray-400">
                              {qtdKg >= 1
                                ? `${formatNumber(qtdKg, 2)} kg`
                                : `${formatNumber(item.quantidadeG, 0)} g`}
                            </p>
                          </div>

                          {/* Preço/kg editável */}
                          <div className="col-span-3">
                            <div className="flex items-center gap-0.5">
                              <span className="text-xs text-gray-400">R$</span>
                              <Input
                                type="number"
                                min="0"
                                step="0.50"
                                value={item.precoPorKg || ""}
                                onChange={(e) =>
                                  onUpdatePreco(
                                    item.nome,
                                    parseFloat(e.target.value) || 0
                                  )
                                }
                                className={`h-7 text-right text-xs ${
                                  isEditado ? "border-amber-300 bg-amber-50" : ""
                                }`}
                              />
                            </div>
                            <p className="text-[10px] text-gray-400 text-right mt-0.5">
                              /kg
                            </p>
                          </div>

                          {/* Subtotal */}
                          <div className="col-span-4 text-right">
                            <span className="text-sm text-[#3D1E12]">
                              {formatCurrency(item.custoTotal)}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
