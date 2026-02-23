import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { ShoppingCart, Package, TrendingUp, AlertCircle, Printer, DollarSign } from "lucide-react";
import { getLinha } from "../../data/production-data";
import { formatNumber, formatCurrency } from "../../lib/utils";

interface PlanoCompra {
  [linha: string]: {
    kgNecessarios: number;
    kgTotal: number;
    embalagens: { tamanho: number; quantidade: number }[];
    sobra: number;
  };
}

interface ShoppingListProps {
  planoCompra: PlanoCompra;
  totalKgNecessarios: number;
  totalKgComprar: number;
  totalSobra: number;
  itensCount: number;
  ingredientesExtras?: { nome: string; quantidade: string }[];
  precos?: Record<string, number>;
}

export function ShoppingList({
  planoCompra,
  totalKgNecessarios,
  totalKgComprar,
  totalSobra,
  itensCount,
  ingredientesExtras,
  precos,
}: ShoppingListProps) {
  const temDados = totalKgNecessarios > 0;

  // Cálculo de custo total
  const custosPorLinha: { linha: string; kg: number; preco: number; total: number }[] = [];
  let custoTotal = 0;
  if (precos && temDados) {
    Object.entries(planoCompra).forEach(([linha, plano]) => {
      const precoKg = precos[linha] || 0;
      const total = plano.kgTotal * precoKg;
      custosPorLinha.push({ linha, kg: plano.kgTotal, preco: precoKg, total });
      custoTotal += total;
    });
  }
  const temPrecos = custosPorLinha.some((c) => c.preco > 0);

  return (
    <div className="space-y-6">
      {/* Dashboard de Resumo */}
      <Card className="border-2 border-[#FFD100] bg-gradient-to-br from-white to-amber-50/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5 text-[#FFD100]" />
            Resumo da Produção
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex justify-between items-center p-3 bg-white rounded-lg">
            <span className="text-sm text-gray-600">Itens na Grade</span>
            <span>{itensCount}</span>
          </div>
          <div className="flex justify-between items-center p-3 bg-white rounded-lg">
            <span className="text-sm text-gray-600">Total Necessário</span>
            <span className="text-[#3D1E12]">
              {formatNumber(totalKgNecessarios, 2)} kg
            </span>
          </div>
          <div className="flex justify-between items-center p-3 bg-[#3D1E12] text-white rounded-lg">
            <span>Total a Comprar</span>
            <span className="text-lg">{formatNumber(totalKgComprar, 2)} kg</span>
          </div>
          {totalSobra > 0 && (
            <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg">
              <TrendingUp className="h-4 w-4 text-green-600" />
              <span className="text-sm text-green-900">
                Sobra de estoque: <strong>{formatNumber(totalSobra, 2)} kg</strong>
              </span>
            </div>
          )}

          {/* Custo estimado */}
          {temPrecos && (
            <div className="p-3 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-300 rounded-lg space-y-2">
              <div className="flex items-center gap-2 text-green-800">
                <DollarSign className="h-4 w-4" />
                <span className="text-sm">Custo Estimado</span>
              </div>
              {custosPorLinha
                .filter((c) => c.preco > 0)
                .map((c) => (
                  <div key={c.linha} className="flex justify-between items-center text-sm text-green-900 px-1">
                    <span>
                      {c.linha} ({formatNumber(c.kg, 2)} kg × {formatCurrency(c.preco)})
                    </span>
                    <span>{formatCurrency(c.total)}</span>
                  </div>
                ))}
              <div className="pt-1 border-t border-green-300 flex justify-between items-center">
                <span className="text-green-900">Total Chocolate</span>
                <span className="text-lg text-green-800">{formatCurrency(custoTotal)}</span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Lista de Compras Detalhada */}
      {temDados ? (
        <Card className="border-2 border-green-500">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-green-700">
                <ShoppingCart className="h-5 w-5" />
                Lista de Compras
              </CardTitle>
              <Button size="sm" variant="outline" onClick={() => window.print()}>
                <Printer className="h-4 w-4" />
              </Button>
            </div>
            <CardDescription>SKU Optimizer - Embalagens exatas Harald</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {Object.entries(planoCompra).map(([linha, plano]) => {
              const linhaData = getLinha(linha);
              const precoKg = precos?.[linha] || 0;
              return (
                <div key={linha} className="space-y-3">
                  <div className="flex items-center justify-between pb-2 border-b-2 border-[#FFD100]">
                    <div>
                      <h3 className="text-[#3D1E12]">{linha}</h3>
                      <p className="text-xs text-gray-600">{linhaData?.tipo}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-600">Total</p>
                      <p className="text-[#3D1E12]">
                        {formatNumber(plano.kgTotal, 2)} kg
                      </p>
                      {precoKg > 0 && (
                        <p className="text-xs text-green-700">
                          {formatCurrency(plano.kgTotal * precoKg)}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    {plano.embalagens.map((emb, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between p-2 bg-gray-50 rounded"
                      >
                        <span className="text-sm">
                          Barra de {formatNumber(emb.tamanho, 2)} kg
                        </span>
                        <div className="text-right">
                          <span className="text-[#3D1E12]">{emb.quantidade}x</span>
                          {precoKg > 0 && (
                            <span className="text-xs text-gray-500 ml-2">
                              ({formatCurrency(emb.tamanho * emb.quantidade * precoKg)})
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  {plano.sobra > 0.01 && (
                    <div className="flex items-center gap-2 p-2 bg-green-50 border border-green-200 rounded text-xs">
                      <AlertCircle className="h-3 w-3 text-green-600" />
                      <span className="text-green-700">
                        Sobra: {formatNumber(plano.sobra * 1000, 0)}g para estoque
                      </span>
                    </div>
                  )}
                </div>
              );
            })}

            {/* Ingredientes extras (inclusões, recheio) */}
            {ingredientesExtras && ingredientesExtras.length > 0 && (
              <div className="space-y-3 pt-2">
                <div className="pb-2 border-b-2 border-amber-300">
                  <h3 className="text-[#3D1E12]">Outros Ingredientes</h3>
                  <p className="text-xs text-gray-600">Inclusões e recheio</p>
                </div>
                <div className="space-y-2">
                  {ingredientesExtras.map((ing, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-2 bg-amber-50 rounded"
                    >
                      <span className="text-sm">{ing.nome}</span>
                      <span className="text-sm text-[#3D1E12]">{ing.quantidade}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      ) : (
        <Card className="border-2 border-dashed border-gray-300">
          <CardContent className="pt-6">
            <div className="text-center py-8 text-muted-foreground">
              <ShoppingCart className="h-16 w-16 mx-auto mb-4 opacity-20" />
              <p className="mb-1">Lista de Compras Vazia</p>
              <p className="text-sm">Complete os passos para gerar a lista</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
