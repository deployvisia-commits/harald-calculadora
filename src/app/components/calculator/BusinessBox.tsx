import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import {
  TrendingUp,
  DollarSign,
  Package,
  BarChart3,
  Lightbulb,
} from "lucide-react";
import { formatCurrency, formatNumber } from "../../lib/utils";
import {
  getMargemLucro,
  salvarMargemLucro,
  getCustoEmbalagem,
  salvarCustoEmbalagem,
} from "../../data/prices-data";
import { motion } from "motion/react";

interface BusinessBoxProps {
  custoTotalIngredientes: number;
  quantidade: number;
  tipoProdutoLabel: string;
}

export function BusinessBox({
  custoTotalIngredientes,
  quantidade,
  tipoProdutoLabel,
}: BusinessBoxProps) {
  const [margem, setMargem] = useState(() => getMargemLucro());
  const [custoEmbalagem, setCustoEmbalagem] = useState(() => getCustoEmbalagem());

  const handleMargemChange = (valor: number) => {
    setMargem(valor);
    salvarMargemLucro(valor);
  };

  const handleEmbalagemChange = (valor: number) => {
    setCustoEmbalagem(valor);
    salvarCustoEmbalagem(valor);
  };

  if (quantidade <= 0 || custoTotalIngredientes <= 0) return null;

  // Cálculos
  const custoEmbalagemTotal = custoEmbalagem * quantidade;
  const custoTotalProd = custoTotalIngredientes + custoEmbalagemTotal;
  const custoPorUnidade = custoTotalProd / quantidade;
  const precoVenda = custoPorUnidade * (1 + margem / 100);
  const lucroPorUnidade = precoVenda - custoPorUnidade;
  const faturamentoTotal = precoVenda * quantidade;
  const lucroTotal = lucroPorUnidade * quantidade;
  const margemReal = ((lucroPorUnidade / precoVenda) * 100);

  // Faixas de margem para cor
  const getMargemColor = () => {
    if (margem < 50) return "text-red-600";
    if (margem < 100) return "text-amber-600";
    return "text-green-600";
  };

  const getMargemLabel = () => {
    if (margem < 50) return "Margem baixa";
    if (margem < 100) return "Margem moderada";
    if (margem < 150) return "Margem saudável";
    return "Margem premium";
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <Card className="border-2 border-[#7bdcb5] bg-[#7bdcb5]/10 overflow-hidden relative">
        <div className="absolute top-0 right-0 w-48 h-48 bg-[#7bdcb5]/20 rounded-full blur-3xl" />

        <CardHeader className="relative z-10">
          <CardTitle className="flex items-center gap-2 text-[#757575]">
            <BarChart3 className="h-5 w-5" />
            Simulador de Negócio
          </CardTitle>
          <p className="text-sm text-emerald-700/70">
            Calcule o preço ideal de venda para {quantidade}x {tipoProdutoLabel}
          </p>
        </CardHeader>

        <CardContent className="space-y-5 relative z-10">
          {/* Custo por unidade */}
          <div className="p-4 rounded-xl bg-white/80 border border-emerald-200">
            <div className="flex items-center gap-2 mb-3">
              <Package className="h-4 w-4 text-[#757575]" />
              <span className="text-sm text-[#757575]">Custo por Unidade</span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className="text-xs text-gray-500 mb-0.5">Ingredientes</p>
                <p className="text-sm text-[#757575]">
                  {formatCurrency(custoTotalIngredientes / quantidade)}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-0.5">Embalagem</p>
                <div className="flex items-center gap-1">
                  <span className="text-xs text-gray-400">R$</span>
                  <Input
                    type="number"
                    min="0"
                    step="0.50"
                    value={custoEmbalagem || ""}
                    onChange={(e) =>
                      handleEmbalagemChange(parseFloat(e.target.value) || 0)
                    }
                    className="h-7 w-20 text-right text-sm"
                  />
                </div>
              </div>
            </div>
            <div className="mt-3 pt-3 border-t border-emerald-200 flex justify-between items-center">
              <span className="text-sm text-[#757575]">Custo Total / un.</span>
              <span className="text-lg text-[#cf2e2e]">
                {formatCurrency(custoPorUnidade)}
              </span>
            </div>
          </div>

          {/* Margem de lucro */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-sm text-[#757575]">Margem de Lucro</Label>
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  min="10"
                  max="500"
                  value={margem}
                  onChange={(e) =>
                    handleMargemChange(Math.max(10, parseInt(e.target.value) || 100))
                  }
                  className="h-7 w-24 text-right text-sm"
                />
                <span className="text-sm text-gray-500">%</span>
              </div>
            </div>
            <input
              type="range"
              min="30"
              max="300"
              step="5"
              value={margem}
              onChange={(e) => handleMargemChange(parseInt(e.target.value))}
              className="w-full h-2 bg-[#cf2e2e]/20 rounded-lg appearance-none cursor-pointer accent-[#cf2e2e]"
            />
            <div className="flex justify-between items-center">
              <span className={`text-xs ${getMargemColor()}`}>{getMargemLabel()}</span>
              <span className="text-xs text-gray-500">
                Margem real: {formatNumber(margemReal, 1)}% sobre o preço
              </span>
            </div>
          </div>

          {/* Preço de venda sugerido */}
          <div className="p-5 rounded-xl bg-[#7bdcb5] text-white">
            <div className="flex items-center gap-2 mb-1">
              <DollarSign className="h-5 w-5 text-emerald-200" />
              <span className="text-emerald-100 text-sm">Preço Sugerido de Venda</span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl">{formatCurrency(precoVenda)}</span>
              <span className="text-emerald-200 text-sm">/ un.</span>
            </div>
            <p className="text-emerald-200 text-xs mt-1">
              Lucro de {formatCurrency(lucroPorUnidade)} por unidade
            </p>
          </div>

          {/* Métricas do lote */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 rounded-xl bg-white/80 border border-emerald-200 text-center">
              <p className="text-xs text-gray-500 mb-1">Faturamento do Lote</p>
              <p className="text-lg text-[#757575]">
                {formatCurrency(faturamentoTotal)}
              </p>
              <p className="text-xs text-gray-400">
                {quantidade} un. × {formatCurrency(precoVenda)}
              </p>
            </div>
            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-300 text-center">
              <p className="text-xs text-emerald-700 mb-1">Lucro do Lote</p>
              <p className="text-lg text-emerald-700">
                {formatCurrency(lucroTotal)}
              </p>
              <p className="text-xs text-emerald-600">
                {formatNumber(margemReal, 1)}% de margem
              </p>
            </div>
          </div>

          {/* Investimento vs retorno */}
          <div className="p-3 rounded-lg bg-white/80 border border-emerald-200">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Investimento total</span>
              <span className="text-[#757575]">{formatCurrency(custoTotalProd)}</span>
            </div>
            <div className="flex items-center justify-between text-sm mt-1">
              <span className="text-gray-600">Retorno total</span>
              <span className="text-emerald-700">{formatCurrency(faturamentoTotal)}</span>
            </div>
            <div className="flex items-center justify-between text-sm mt-1 pt-1 border-t border-emerald-100">
              <span className="text-gray-600">ROI</span>
              <span className="text-emerald-700">
                {formatNumber(((faturamentoTotal - custoTotalProd) / custoTotalProd) * 100, 0)}%
              </span>
            </div>
          </div>

          {/* Dica */}
          <div className="flex items-start gap-2 p-3 rounded-lg bg-amber-50 border border-amber-200">
            <Lightbulb className="h-4 w-4 text-amber-600 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-amber-900">
              <strong>Dica:</strong> Considere custos extras como gás, energia, mão de obra e
              decoração. A embalagem pode variar bastante — ajuste o valor acima. Para produtos
              premium, margens de 150-200% são comuns no mercado artesanal.
            </p>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
