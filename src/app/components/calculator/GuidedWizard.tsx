import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Link } from "react-router";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Badge } from "../ui/badge";
import { ShoppingList } from "./ShoppingList";
import { CostEditor } from "./CostEditor";
import { BusinessBox } from "./BusinessBox";
import {
  CONFIG_HARALD,
  TIPOS_PRODUTOS,
  TipoProduto,
  getPesoTecnico,
  calcularEmbalagens,
  getLinha,
  getTemperingProductId,
} from "../../data/production-data";
import {
  PRODUTO_CATEGORIAS,
  INCLUSAO_PRESETS,
  RECHEIO_TEMPLATES,
  RECOMENDACOES,
  InclusaoPreset,
} from "../../data/recipes-data";
import {
  getTodosPrecos,
  salvarPrecos,
  getPrecoRecheioIngrediente,
  PRECOS_DEFAULT,
  CustoIngrediente,
} from "../../data/prices-data";
import { formatNumber, formatCurrency } from "../../lib/utils";
import {
  ChevronLeft,
  ChevronRight,
  Check,
  Target,
  Cookie,
  CakeSlice,
  ShoppingCart,
  Sparkles,
  Star,
  DollarSign,
  Plus,
  Trash2,
  Info,
  X,
  Lightbulb,
  Thermometer,
  Save,
} from "lucide-react";

// ─── Types ───────────────────────────────────────────────────────────────
interface InclusaoItem {
  id: string;
  nome: string;
  percentual: number;
}

interface IngredienteCustom {
  id: string;
  nome: string;
  quantidade: number;
  unidade: string;
}

interface GuidedState {
  // Step 1
  tipoProduto: TipoProduto | null;
  quantidade: number;
  // Step 2
  linhaHarald: string;
  sabor: string;
  // Step 3
  inclusoes: InclusaoItem[];
  // Step 4
  tipoRecheio: "sem" | "sugerido" | "livre";
  recheioSelecionado: string | null;
  ingredientesLivres: IngredienteCustom[];
  volumeRecheioPorUnidade: number;
  proporcaoChocolateRecheio: number;
  // Config
  margemSeguranca: number;
}

const INITIAL_STATE: GuidedState = {
  tipoProduto: null,
  quantidade: 50,
  linhaHarald: "Melken",
  sabor: "Ao Leite",
  inclusoes: [],
  tipoRecheio: "sem",
  recheioSelecionado: null,
  ingredientesLivres: [],
  volumeRecheioPorUnidade: 0,
  proporcaoChocolateRecheio: 50,
  margemSeguranca: 5,
};

const STEPS = [
  { id: 1, label: "Objetivo", icon: Target },
  { id: 2, label: "Chocolate", icon: Cookie },
  { id: 3, label: "Inclusões", icon: Sparkles },
  { id: 4, label: "Recheio", icon: CakeSlice },
  { id: 5, label: "Resultado", icon: ShoppingCart },
];

interface GuidedWizardProps {
  onBack: () => void;
  onSave?: (dados: any) => void;
  initialData?: any;
}

export function GuidedWizard({ onBack, onSave, initialData }: GuidedWizardProps) {
  const [step, setStep] = useState(1);
  const [state, setState] = useState<GuidedState>(() => {
    if (initialData) return { ...INITIAL_STATE, ...initialData };
    const saved = localStorage.getItem("guidedWizard");
    if (saved) {
      try {
        return { ...INITIAL_STATE, ...JSON.parse(saved) };
      } catch {
        return INITIAL_STATE;
      }
    }
    return INITIAL_STATE;
  });

  useEffect(() => {
    localStorage.setItem("guidedWizard", JSON.stringify(state));
  }, [state]);

  const update = (partial: Partial<GuidedState>) =>
    setState((prev) => ({ ...prev, ...partial }));

  const canAdvance = (): boolean => {
    switch (step) {
      case 1:
        return state.tipoProduto !== null && state.quantidade > 0;
      case 2:
        return state.linhaHarald !== "" && state.sabor !== "";
      case 3:
        return true; // optional
      case 4:
        return true; // optional
      default:
        return true;
    }
  };

  const next = () => {
    if (step < 5 && canAdvance()) setStep(step + 1);
  };
  const prev = () => {
    if (step > 1) setStep(step - 1);
  };

  // Auto-set recommendation when product changes
  useEffect(() => {
    if (state.tipoProduto) {
      const rec = RECOMENDACOES[state.tipoProduto];
      if (rec) {
        update({ linhaHarald: rec.recomendado });
      }
    }
  }, [state.tipoProduto]);

  // ─── Preços ──────────────────────────────────────────────────────────
  const [precos, setPrecos] = useState<Record<string, number>>(() => getTodosPrecos());

  const updatePreco = (nome: string, valor: number) => {
    const novos = { ...precos, [nome]: valor };
    setPrecos(novos);
    salvarPrecos(novos);
  };

  const resetPrecos = () => {
    setPrecos({ ...PRECOS_DEFAULT });
    salvarPrecos({ ...PRECOS_DEFAULT });
  };

  // ─── Calculations ─────────────────────────────────────────────────────
  const calculations = useMemo(() => {
    if (!state.tipoProduto || state.quantidade <= 0)
      return { planoCompra: {}, totalKg: 0, totalComprar: 0, totalSobra: 0, extras: [] };

    const totalInclusaoPercent = state.inclusoes.reduce((sum, inc) => sum + inc.percentual, 0);
    const pesoTecnico = getPesoTecnico(state.linhaHarald, state.tipoProduto);
    const pesoComInclusao = pesoTecnico * (1 - Math.min(totalInclusaoPercent, 50) / 100);
    let necessidadeKg = (pesoComInclusao * state.quantidade) / 1000;

    // Add filling chocolate
    let necessidadeRecheioKg = 0;
    if (state.tipoRecheio === "sugerido" && state.recheioSelecionado) {
      const template = RECHEIO_TEMPLATES.find((r) => r.id === state.recheioSelecionado);
      if (template && state.tipoProduto) {
        const gramasPorUn = template.gramasPorUnidade[state.tipoProduto];
        const totalRecheioG = gramasPorUn * state.quantidade;
        necessidadeRecheioKg = (totalRecheioG * template.proporcaoChocolate) / 100 / 1000;
      }
    } else if (state.tipoRecheio === "livre" && state.volumeRecheioPorUnidade > 0) {
      const totalRecheioG = state.volumeRecheioPorUnidade * state.quantidade;
      necessidadeRecheioKg = (totalRecheioG * state.proporcaoChocolateRecheio) / 100 / 1000;
    }

    necessidadeKg += necessidadeRecheioKg;

    // Margin
    necessidadeKg *= 1 + state.margemSeguranca / 100;

    const linhaData = getLinha(state.linhaHarald);
    const embalagens = linhaData ? calcularEmbalagens(necessidadeKg, linhaData.embalagens) : null;

    const planoCompra = embalagens
      ? {
        [state.linhaHarald]: {
          kgNecessarios: necessidadeKg,
          kgTotal: embalagens.total,
          embalagens: embalagens.detalhes,
          sobra: embalagens.sobra,
        },
      }
      : {};

    // Extra ingredients list
    const extras: { nome: string; quantidade: string }[] = [];

    // Inclusion ingredients
    if (state.inclusoes.length > 0) {
      state.inclusoes.forEach((inc) => {
        const pesoInclusaoG = pesoTecnico * (inc.percentual / 100) * state.quantidade;
        extras.push({
          nome: inc.nome,
          quantidade: `${formatNumber(pesoInclusaoG / 1000, 2)} kg`,
        });
      });
    }

    // Filling ingredients (non-chocolate)
    if (state.tipoRecheio === "sugerido" && state.recheioSelecionado) {
      const template = RECHEIO_TEMPLATES.find((r) => r.id === state.recheioSelecionado);
      if (template && state.tipoProduto) {
        const gramasPorUn = template.gramasPorUnidade[state.tipoProduto];
        const totalRecheioG = gramasPorUn * state.quantidade;
        template.ingredientes
          .filter((i) => !i.isChocolate)
          .forEach((ing) => {
            const qtd = (ing.quantidadePorKg / 1000) * totalRecheioG;
            extras.push({
              nome: `${ing.nome} (recheio)`,
              quantidade: qtd >= 1000 ? `${formatNumber(qtd / 1000, 2)} kg` : `${formatNumber(qtd, 0)} g`,
            });
          });
      }
    }

    return {
      planoCompra,
      totalKg: necessidadeKg,
      totalComprar: embalagens?.total || 0,
      totalSobra: embalagens?.sobra || 0,
      extras,
    };
  }, [state]);

  // ─── Renderers ─────────────────────────────────────────────────────────
  const renderStep1 = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl mb-1 text-[#3D1E12]">O que você vai produzir?</h2>
        <p className="text-gray-600">Escolha o tipo de produto e a quantidade desejada</p>
      </div>

      {PRODUTO_CATEGORIAS.map((cat) => (
        <div key={cat.categoria} className="space-y-3">
          <h3 className="text-sm text-gray-500 uppercase tracking-wider flex items-center gap-2">
            <span>{cat.icone}</span> {cat.categoria}
          </h3>
          <div className="grid sm:grid-cols-3 gap-3">
            {cat.produtos.map((prod) => {
              const isSelected = state.tipoProduto === prod.value;
              return (
                <motion.button
                  key={prod.value}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => update({ tipoProduto: prod.value })}
                  className={`p-4 rounded-2xl border-2 text-left transition-all duration-300 cursor-pointer ${isSelected
                      ? "border-[#FFD100] bg-gradient-to-br from-amber-50 to-[#FFD100]/10 shadow-lg shadow-[#FFD100]/20"
                      : "border-gray-200 bg-white hover:border-[#FFD100]/50 hover:bg-amber-50/30"
                    }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-lg">{prod.label}</span>
                    {isSelected && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="w-6 h-6 rounded-full bg-[#FFD100] flex items-center justify-center"
                      >
                        <Check className="h-4 w-4 text-[#3D1E12]" />
                      </motion.div>
                    )}
                  </div>
                  <p className="text-xs text-gray-500">{prod.descricao}</p>
                </motion.button>
              );
            })}
          </div>
        </div>
      ))}

      {state.tipoProduto && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-3"
        >
          <Label>Quantidade de unidades</Label>
          <div className="flex items-center gap-4">
            <Input
              type="number"
              min="1"
              max="10000"
              value={state.quantidade}
              onChange={(e) => update({ quantidade: parseInt(e.target.value) || 0 })}
              className="max-w-[200px] text-2xl text-center h-14"
            />
            <span className="text-gray-600">
              {TIPOS_PRODUTOS.find((t) => t.value === state.tipoProduto)?.label || "unidades"}
            </span>
          </div>
          <div className="flex gap-2">
            {[25, 50, 100, 200, 500].map((q) => (
              <button
                key={q}
                onClick={() => update({ quantidade: q })}
                className={`px-3 py-1 rounded-full text-sm border transition-all cursor-pointer ${state.quantidade === q
                    ? "bg-[#FFD100] border-[#FFD100] text-[#3D1E12]"
                    : "border-gray-200 text-gray-600 hover:border-[#FFD100]"
                  }`}
              >
                {q}
              </button>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );

  const renderStep2 = () => {
    const rec = state.tipoProduto ? RECOMENDACOES[state.tipoProduto] : null;
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl mb-1 text-[#3D1E12]">Escolha o Chocolate Base</h2>
          <p className="text-gray-600">
            Selecione a linha Harald ideal para sua produção
          </p>
        </div>

        <div className="space-y-3">
          {CONFIG_HARALD.linhas.map((linha) => {
            const isSelected = state.linhaHarald === linha.nome;
            const isRecomendado = rec?.recomendado === linha.nome;
            const isEconomico = rec?.economico === linha.nome && !isRecomendado;

            return (
              <motion.button
                key={linha.nome}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                onClick={() =>
                  update({ linhaHarald: linha.nome, sabor: linha.sabores[0] })
                }
                className={`w-full p-5 rounded-2xl border-2 text-left transition-all duration-300 cursor-pointer ${isSelected
                    ? "border-[#FFD100] bg-gradient-to-r from-amber-50 to-[#FFD100]/10 shadow-lg shadow-[#FFD100]/20"
                    : "border-gray-200 bg-white hover:border-gray-300"
                  }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-lg text-[#3D1E12]">{linha.nome}</span>
                      <Badge variant="secondary" className="text-xs">
                        {linha.tipo}
                      </Badge>
                      {isRecomendado && (
                        <Badge className="bg-[#FFD100] text-[#3D1E12] gap-1">
                          <Star className="h-3 w-3" />
                          Recomendado
                        </Badge>
                      )}
                      {isEconomico && (
                        <Badge variant="outline" className="gap-1 border-green-300 text-green-700">
                          <DollarSign className="h-3 w-3" />
                          Econômico
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-gray-500">
                      {isRecomendado && rec
                        ? rec.motivoRecomendado
                        : isEconomico && rec
                          ? rec.motivoEconomico
                          : `Sabores: ${linha.sabores.join(", ")}`}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      Embalagens: {linha.embalagens.map((e) => `${e}kg`).join(", ")} |{" "}
                      {state.tipoProduto
                        ? `${getPesoTecnico(linha.nome, state.tipoProduto)}g por unidade`
                        : ""}
                    </p>
                  </div>
                  {isSelected && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="w-8 h-8 rounded-full bg-[#FFD100] flex items-center justify-center flex-shrink-0 mt-1"
                    >
                      <Check className="h-5 w-5 text-[#3D1E12]" />
                    </motion.div>
                  )}
                </div>
              </motion.button>
            );
          })}
        </div>

        {/* Sabor selection */}
        {state.linhaHarald && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-3"
          >
            <Label>Sabor</Label>
            <div className="flex flex-wrap gap-2">
              {getLinha(state.linhaHarald)?.sabores.map((sabor) => (
                <button
                  key={sabor}
                  onClick={() => update({ sabor })}
                  className={`px-4 py-2 rounded-xl border-2 transition-all cursor-pointer ${state.sabor === sabor
                      ? "border-[#FFD100] bg-[#FFD100]/10 text-[#3D1E12]"
                      : "border-gray-200 text-gray-600 hover:border-[#FFD100]/50"
                    }`}
                >
                  {sabor}
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {/* Tempering info */}
        {state.linhaHarald && (
          <div
            className={`p-4 rounded-xl border ${getLinha(state.linhaHarald)?.tipo === "Nobre"
                ? "bg-amber-50 border-amber-200"
                : "bg-green-50 border-green-200"
              }`}
          >
            <div className="flex items-start gap-3">
              <Info className="h-5 w-5 flex-shrink-0 mt-0.5 text-gray-600" />
              <div className="text-sm flex-1">
                {getLinha(state.linhaHarald)?.tipo === "Nobre" ? (
                  <>
                    <p className="text-amber-900 mb-3">
                      <strong>{state.linhaHarald}</strong> requer temperagem.
                      Use o Assistente de Temperagem para curvas precisas.
                    </p>
                    <Link
                      to={`/temperagem?produto=${getTemperingProductId(state.linhaHarald, state.sabor)}`}
                    >
                      <Button variant="outline" size="sm" className="gap-2 border-amber-300 text-amber-900 hover:bg-amber-100">
                        <Thermometer className="h-4 w-4" />
                        Abrir Assistente de Temperagem
                      </Button>
                    </Link>
                  </>
                ) : (
                  <p className="text-green-900">
                    <strong>{state.linhaHarald}</strong> dispensa temperagem!
                    Basta derreter entre 45-50°C e usar entre 38-42°C.
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Preço por kg */}
        {state.linhaHarald && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 rounded-xl border border-green-200 bg-green-50/50"
          >
            <div className="flex items-center gap-3">
              <DollarSign className="h-5 w-5 text-green-600 flex-shrink-0" />
              <div className="flex-1">
                <Label className="text-sm text-green-900">
                  Preço por kg — {state.linhaHarald}
                </Label>
                <p className="text-xs text-green-700 mt-0.5">
                  Usado para calcular o custo total no resultado
                </p>
              </div>
              <div className="flex items-center gap-1">
                <span className="text-sm text-green-700">R$</span>
                <Input
                  type="number"
                  min="0"
                  step="0.50"
                  value={precos[state.linhaHarald] || ""}
                  onChange={(e) =>
                    updatePreco(state.linhaHarald, parseFloat(e.target.value) || 0)
                  }
                  className="w-24 h-9 text-right"
                />
              </div>
            </div>
          </motion.div>
        )}
      </div>
    );
  };

  const renderStep3 = () => {
    const totalPercent = state.inclusoes.reduce((s, i) => s + i.percentual, 0);

    const addInclusao = (preset: InclusaoPreset) => {
      if (state.inclusoes.find((i) => i.id === preset.id)) return;
      update({
        inclusoes: [
          ...state.inclusoes,
          { id: preset.id, nome: preset.nome, percentual: preset.percentualSugerido },
        ],
      });
    };

    const removeInclusao = (id: string) => {
      update({ inclusoes: state.inclusoes.filter((i) => i.id !== id) });
    };

    const updateInclusaoPercent = (id: string, percentual: number) => {
      update({
        inclusoes: state.inclusoes.map((i) =>
          i.id === id ? { ...i, percentual } : i
        ),
      });
    };

    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl mb-1 text-[#3D1E12]">Inclusões e Crocantes</h2>
          <p className="text-gray-600">
            Opcional: adicione ingredientes crocantes ao chocolate
          </p>
        </div>

        {state.inclusoes.length === 0 && (
          <div className="p-4 bg-gray-50 rounded-xl border border-gray-200 text-center">
            <p className="text-gray-500 text-sm mb-1">Nenhuma inclusão adicionada</p>
            <p className="text-xs text-gray-400">Selecione abaixo ou pule esta etapa</p>
          </div>
        )}

        {/* Active inclusions */}
        <AnimatePresence>
          {state.inclusoes.map((inc) => (
            <motion.div
              key={inc.id}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <div className="p-4 bg-amber-50 rounded-xl border border-amber-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-[#3D1E12]">{inc.nome}</span>
                  <button
                    onClick={() => removeInclusao(inc.id)}
                    className="p-1 rounded-lg hover:bg-red-100 text-red-400 hover:text-red-600 transition-colors cursor-pointer"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
                <div className="flex items-center gap-3">
                  <input
                    type="range"
                    min="5"
                    max="30"
                    step="1"
                    value={inc.percentual}
                    onChange={(e) => updateInclusaoPercent(inc.id, parseInt(e.target.value))}
                    className="flex-1 h-2 bg-amber-200 rounded-lg appearance-none cursor-pointer accent-[#FFD100]"
                  />
                  <span className="text-sm w-12 text-right text-[#3D1E12]">
                    {inc.percentual}%
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {totalPercent > 0 && (
          <div className={`p-3 rounded-lg text-sm ${totalPercent > 50 ? "bg-red-50 border border-red-200 text-red-800" : "bg-blue-50 border border-blue-200 text-blue-800"}`}>
            Total de inclusão: <strong>{totalPercent}%</strong>
            {totalPercent > 50 && " — Máximo recomendado é 50%!"}
            {totalPercent <= 50 && ` — Reduz ${totalPercent}% do chocolate necessário`}
          </div>
        )}

        {/* Presets grid */}
        <div>
          <Label className="mb-3 block">Ingredientes sugeridos</Label>
          <div className="grid grid-cols-2 gap-2">
            {INCLUSAO_PRESETS.map((preset) => {
              const isAdded = state.inclusoes.some((i) => i.id === preset.id);
              return (
                <button
                  key={preset.id}
                  onClick={() => (isAdded ? removeInclusao(preset.id) : addInclusao(preset))}
                  disabled={totalPercent >= 50 && !isAdded}
                  className={`p-3 rounded-xl border text-left text-sm transition-all cursor-pointer ${isAdded
                      ? "border-[#FFD100] bg-[#FFD100]/10"
                      : totalPercent >= 50
                        ? "border-gray-100 bg-gray-50 opacity-50 cursor-not-allowed"
                        : "border-gray-200 hover:border-[#FFD100]/50"
                    }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span>{preset.icone}</span>
                    <span className="text-[#3D1E12] truncate">{preset.nome}</span>
                    {isAdded && <Check className="h-3 w-3 text-green-600 flex-shrink-0 ml-auto" />}
                  </div>
                  <p className="text-xs text-gray-500 truncate">{preset.descricao}</p>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  const renderStep4 = () => {
    const selectedTemplate = RECHEIO_TEMPLATES.find((r) => r.id === state.recheioSelecionado);

    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl mb-1 text-[#3D1E12]">Recheio</h2>
          <p className="text-gray-600">
            Opcional: configure o recheio dos seus produtos
          </p>
        </div>

        {/* Tipo de recheio */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { value: "sem" as const, label: "Sem recheio", desc: "Apenas casca" },
            { value: "sugerido" as const, label: "Receita sugerida", desc: "Templates prontos" },
            { value: "livre" as const, label: "Receita livre", desc: "Seus ingredientes" },
          ].map((opt) => (
            <button
              key={opt.value}
              onClick={() => update({ tipoRecheio: opt.value, recheioSelecionado: null })}
              className={`p-3 rounded-xl border-2 text-center transition-all cursor-pointer ${state.tipoRecheio === opt.value
                  ? "border-[#FFD100] bg-[#FFD100]/10"
                  : "border-gray-200 hover:border-[#FFD100]/50"
                }`}
            >
              <p className="text-sm text-[#3D1E12]">{opt.label}</p>
              <p className="text-xs text-gray-500">{opt.desc}</p>
            </button>
          ))}
        </div>

        {/* Suggested recipes */}
        {state.tipoRecheio === "sugerido" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3">
            <Label>Escolha uma receita</Label>
            {RECHEIO_TEMPLATES.map((template) => {
              const isSelected = state.recheioSelecionado === template.id;
              const gramasPorUn = state.tipoProduto
                ? template.gramasPorUnidade[state.tipoProduto]
                : 0;
              const totalRecheioG = gramasPorUn * state.quantidade;

              return (
                <motion.button
                  key={template.id}
                  whileHover={{ scale: 1.01 }}
                  onClick={() => update({ recheioSelecionado: template.id })}
                  className={`w-full p-4 rounded-xl border-2 text-left transition-all cursor-pointer ${isSelected
                      ? "border-[#FFD100] bg-gradient-to-r from-amber-50 to-[#FFD100]/10 shadow-md"
                      : "border-gray-200 hover:border-gray-300"
                    }`}
                >
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">{template.icone}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-[#3D1E12]">{template.nome}</span>
                        {isSelected && (
                          <Check className="h-4 w-4 text-green-600 flex-shrink-0" />
                        )}
                      </div>
                      <p className="text-xs text-gray-500 mb-2">{template.descricao}</p>
                      <div className="flex flex-wrap gap-1">
                        {template.ingredientes.map((ing, i) => (
                          <span
                            key={i}
                            className={`text-xs px-2 py-0.5 rounded-full ${ing.isChocolate
                                ? "bg-[#3D1E12] text-[#FFD100]"
                                : "bg-gray-100 text-gray-600"
                              }`}
                          >
                            {ing.nome}
                          </span>
                        ))}
                      </div>
                      {gramasPorUn > 0 && (
                        <p className="text-xs text-gray-400 mt-2">
                          ~{gramasPorUn}g por unidade | Total: {formatNumber(totalRecheioG / 1000, 2)} kg
                        </p>
                      )}
                    </div>
                  </div>
                </motion.button>
              );
            })}

            {/* Recipe tip */}
            {selectedTemplate && (
              <motion.div
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3 bg-amber-50 border border-amber-200 rounded-xl"
              >
                <div className="flex items-start gap-2">
                  <Lightbulb className="h-4 w-4 text-amber-600 flex-shrink-0 mt-0.5" />
                  <p className="text-xs text-amber-800">{selectedTemplate.dica}</p>
                </div>
              </motion.div>
            )}
          </motion.div>
        )}

        {/* Free-form filling */}
        {state.tipoRecheio === "livre" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Recheio por unidade (g)</Label>
                <Input
                  type="number"
                  min="0"
                  placeholder="Ex: 50"
                  value={state.volumeRecheioPorUnidade || ""}
                  onChange={(e) =>
                    update({ volumeRecheioPorUnidade: parseInt(e.target.value) || 0 })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>% de chocolate no recheio: {state.proporcaoChocolateRecheio}%</Label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="5"
                  value={state.proporcaoChocolateRecheio}
                  onChange={(e) =>
                    update({ proporcaoChocolateRecheio: parseInt(e.target.value) })
                  }
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#FFD100]"
                />
              </div>
            </div>

            {/* Free ingredients list */}
            <div className="space-y-2">
              <Label>Ingredientes do recheio (para lista de compras)</Label>
              {state.ingredientesLivres.map((ing) => (
                <div key={ing.id} className="flex items-center gap-2">
                  <Input
                    placeholder="Ingrediente"
                    value={ing.nome}
                    onChange={(e) =>
                      update({
                        ingredientesLivres: state.ingredientesLivres.map((i) =>
                          i.id === ing.id ? { ...i, nome: e.target.value } : i
                        ),
                      })
                    }
                    className="flex-1"
                  />
                  <Input
                    type="number"
                    placeholder="Qtd"
                    value={ing.quantidade || ""}
                    onChange={(e) =>
                      update({
                        ingredientesLivres: state.ingredientesLivres.map((i) =>
                          i.id === ing.id
                            ? { ...i, quantidade: parseFloat(e.target.value) || 0 }
                            : i
                        ),
                      })
                    }
                    className="w-24"
                  />
                  <Input
                    placeholder="un"
                    value={ing.unidade}
                    onChange={(e) =>
                      update({
                        ingredientesLivres: state.ingredientesLivres.map((i) =>
                          i.id === ing.id ? { ...i, unidade: e.target.value } : i
                        ),
                      })
                    }
                    className="w-16"
                  />
                  <button
                    onClick={() =>
                      update({
                        ingredientesLivres: state.ingredientesLivres.filter(
                          (i) => i.id !== ing.id
                        ),
                      })
                    }
                    className="p-2 rounded-lg hover:bg-red-50 text-red-400 hover:text-red-600 cursor-pointer"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  update({
                    ingredientesLivres: [
                      ...state.ingredientesLivres,
                      { id: Date.now().toString(), nome: "", quantidade: 0, unidade: "g" },
                    ],
                  })
                }
              >
                <Plus className="h-4 w-4 mr-1" />
                Adicionar ingrediente
              </Button>
            </div>

            {state.volumeRecheioPorUnidade > 0 && (
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg text-sm text-blue-900">
                Total de recheio:{" "}
                <strong>
                  {formatNumber(
                    (state.volumeRecheioPorUnidade * state.quantidade) / 1000,
                    2
                  )}{" "}
                  kg
                </strong>{" "}
                | Chocolate do recheio:{" "}
                <strong>
                  {formatNumber(
                    (state.volumeRecheioPorUnidade *
                      state.quantidade *
                      state.proporcaoChocolateRecheio) /
                    100 /
                    1000,
                    2
                  )}{" "}
                  kg
                </strong>
              </div>
            )}
          </motion.div>
        )}
      </div>
    );
  };

  const renderStep5 = () => {
    const tipoLabel = TIPOS_PRODUTOS.find((t) => t.value === state.tipoProduto)?.label || "";
    const totalInclusao = state.inclusoes.reduce((s, i) => s + i.percentual, 0);
    const selectedTemplate = RECHEIO_TEMPLATES.find((r) => r.id === state.recheioSelecionado);

    // Extra ingredients for shopping list
    const allExtras = [...calculations.extras];
    if (state.tipoRecheio === "livre" && state.ingredientesLivres.length > 0) {
      state.ingredientesLivres
        .filter((i) => i.nome.trim() !== "")
        .forEach((ing) => {
          const totalQtd = ing.quantidade * state.quantidade;
          allExtras.push({
            nome: `${ing.nome} (recheio)`,
            quantidade:
              totalQtd >= 1000
                ? `${formatNumber(totalQtd / 1000, 2)} ${ing.unidade === "g" ? "kg" : ing.unidade}`
                : `${formatNumber(totalQtd, 0)} ${ing.unidade}`,
          });
        });
    }

    // ─── Compute structured costs ────────────────────────────────────
    const custoIngredientes: CustoIngrediente[] = [];

    // 1. Chocolate base
    if (calculations.totalComprar > 0) {
      const precoChoc = precos[state.linhaHarald] || 0;
      custoIngredientes.push({
        nome: state.linhaHarald,
        quantidadeG: calculations.totalComprar * 1000,
        precoPorKg: precoChoc,
        custoTotal: calculations.totalComprar * precoChoc,
        categoria: "chocolate",
      });
    }

    // 2. Inclusões
    if (state.inclusoes.length > 0 && state.tipoProduto) {
      const pesoTecnico = getPesoTecnico(state.linhaHarald, state.tipoProduto);
      state.inclusoes.forEach((inc) => {
        const pesoG = pesoTecnico * (inc.percentual / 100) * state.quantidade;
        const precoKg = precos[inc.nome] || 0;
        custoIngredientes.push({
          nome: inc.nome,
          quantidadeG: pesoG,
          precoPorKg: precoKg,
          custoTotal: (pesoG / 1000) * precoKg,
          categoria: "inclusao",
        });
      });
    }

    // 3. Recheio (sugerido)
    if (state.tipoRecheio === "sugerido" && selectedTemplate && state.tipoProduto) {
      const gramasPorUn = selectedTemplate.gramasPorUnidade[state.tipoProduto];
      const totalRecheioG = gramasPorUn * state.quantidade;
      selectedTemplate.ingredientes.forEach((ing) => {
        const qtdG = (ing.quantidadePorKg / 1000) * totalRecheioG;
        const precoKg = getPrecoRecheioIngrediente(
          ing.nome,
          !!ing.isChocolate,
          state.linhaHarald,
          precos
        );
        custoIngredientes.push({
          nome: ing.isChocolate ? `${ing.nome} (recheio)` : ing.nome,
          quantidadeG: qtdG,
          precoPorKg: precoKg,
          custoTotal: (qtdG / 1000) * precoKg,
          categoria: "recheio",
        });
      });
    }

    // 4. Recheio livre
    if (state.tipoRecheio === "livre" && state.ingredientesLivres.length > 0) {
      state.ingredientesLivres
        .filter((i) => i.nome.trim() !== "")
        .forEach((ing) => {
          const totalQtdG = ing.quantidade * state.quantidade;
          const precoKg = precos[ing.nome] || 0;
          custoIngredientes.push({
            nome: ing.nome,
            quantidadeG: totalQtdG,
            precoPorKg: precoKg,
            custoTotal: (totalQtdG / 1000) * precoKg,
            categoria: "recheio",
          });
        });
    }

    const custoTotalIngredientes = custoIngredientes.reduce((s, c) => s + c.custoTotal, 0);

    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl mb-1 text-[#3D1E12]">Seu Plano de Produção</h2>
          <p className="text-gray-600">Resumo completo e lista de compras otimizada</p>
        </div>

        {/* Production summary */}
        <Card className="border-2 border-[#3D1E12]/20 bg-gradient-to-br from-[#3D1E12] to-[#5D3E32] text-white overflow-hidden relative">
          <div className="absolute top-0 right-0 w-40 h-40 bg-[#FFD100] rounded-full blur-3xl opacity-15" />
          <CardContent className="pt-6 relative z-10">
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <p className="text-amber-200 text-xs uppercase tracking-wider mb-1">Produto</p>
                <p className="text-lg">{state.quantidade}x {tipoLabel}</p>
              </div>
              <div>
                <p className="text-amber-200 text-xs uppercase tracking-wider mb-1">Chocolate</p>
                <p className="text-lg">{state.linhaHarald} {state.sabor}</p>
              </div>
              {totalInclusao > 0 && (
                <div>
                  <p className="text-amber-200 text-xs uppercase tracking-wider mb-1">Inclusões</p>
                  <p className="text-sm">
                    {state.inclusoes.map((i) => `${i.nome} (${i.percentual}%)`).join(", ")}
                  </p>
                </div>
              )}
              {state.tipoRecheio !== "sem" && (
                <div>
                  <p className="text-amber-200 text-xs uppercase tracking-wider mb-1">Recheio</p>
                  <p className="text-sm">
                    {state.tipoRecheio === "sugerido" && selectedTemplate
                      ? selectedTemplate.nome
                      : "Receita personalizada"}
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Safety margin */}
        <div className="space-y-2">
          <Label>Margem de Segurança (Quebra): {state.margemSeguranca}%</Label>
          <input
            type="range"
            min="0"
            max="20"
            step="1"
            value={state.margemSeguranca}
            onChange={(e) => update({ margemSeguranca: parseInt(e.target.value) })}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#FFD100]"
          />
          <p className="text-xs text-muted-foreground">
            Adiciona uma margem extra para cobrir quebras e perdas durante a produção
          </p>
        </div>

        {/* Shopping list */}
        <ShoppingList
          planoCompra={calculations.planoCompra}
          totalKgNecessarios={calculations.totalKg}
          totalKgComprar={calculations.totalComprar}
          totalSobra={calculations.totalSobra}
          itensCount={1}
          ingredientesExtras={allExtras.length > 0 ? allExtras : undefined}
          precos={precos}
        />

        {/* Cost editor — editable prices per ingredient */}
        {custoIngredientes.length > 0 && (
          <CostEditor
            custos={custoIngredientes}
            precos={precos}
            onUpdatePreco={updatePreco}
            onResetPrecos={resetPrecos}
          />
        )}

        {/* Business simulator */}
        {custoTotalIngredientes > 0 && state.quantidade > 0 && (
          <BusinessBox
            custoTotalIngredientes={custoTotalIngredientes}
            quantidade={state.quantidade}
            tipoProdutoLabel={tipoLabel}
          />
        )}
      </div>
    );
  };

  const stepContent = [renderStep1, renderStep2, renderStep3, renderStep4, renderStep5];

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header with back */}
      <div className="flex items-center gap-3 mb-6">
        <Button variant="ghost" size="sm" onClick={onBack} className="gap-1">
          <ChevronLeft className="h-4 w-4" />
          Trocar modo
        </Button>
        <div className="flex-1" />
        {onSave && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => onSave(state)}
            className="gap-1 text-green-700 border-green-300 hover:bg-green-50"
          >
            <Save className="h-4 w-4" />
            Salvar Projeto
          </Button>
        )}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            setState(INITIAL_STATE);
            setStep(1);
          }}
          className="text-gray-400 hover:text-red-600"
        >
          Recomeçar
        </Button>
      </div>

      {/* Step indicator */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-3">
          {STEPS.map((s, index) => {
            const Icon = s.icon;
            const isActive = step === s.id;
            const isCompleted = step > s.id;
            return (
              <div key={s.id} className="contents">
                <button
                  onClick={() => {
                    if (isCompleted || isActive) setStep(s.id);
                  }}
                  className={`flex flex-col items-center gap-1 cursor-pointer transition-all ${isActive || isCompleted ? "opacity-100" : "opacity-40"
                    }`}
                >
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 ${isActive
                        ? "bg-[#FFD100] shadow-lg shadow-[#FFD100]/30"
                        : isCompleted
                          ? "bg-[#3D1E12]"
                          : "bg-gray-200"
                      }`}
                  >
                    {isCompleted ? (
                      <Check className="h-5 w-5 text-[#FFD100]" />
                    ) : (
                      <Icon
                        className={`h-5 w-5 ${isActive ? "text-[#3D1E12]" : "text-gray-400"
                          }`}
                      />
                    )}
                  </div>
                  <span
                    className={`text-xs hidden sm:block ${isActive ? "text-[#3D1E12]" : "text-gray-400"
                      }`}
                  >
                    {s.label}
                  </span>
                </button>
                {index < STEPS.length - 1 && (
                  <div
                    className={`flex-1 h-0.5 mx-2 rounded transition-colors duration-300 ${step > s.id ? "bg-[#3D1E12]" : "bg-gray-200"
                      }`}
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Step content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
        >
          {stepContent[step - 1]()}
        </motion.div>
      </AnimatePresence>

      {/* Navigation buttons */}
      <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-200">
        <Button
          variant="outline"
          onClick={prev}
          disabled={step === 1}
          className="gap-1"
        >
          <ChevronLeft className="h-4 w-4" />
          Voltar
        </Button>

        {step < 5 ? (
          <Button
            onClick={next}
            disabled={!canAdvance()}
            className="gap-1 bg-[#FFD100] text-[#3D1E12] hover:bg-[#FFDD33]"
          >
            {step === 3 || step === 4
              ? state.inclusoes.length === 0 && step === 3
                ? "Pular"
                : state.tipoRecheio === "sem" && step === 4
                  ? "Pular"
                  : "Próximo"
              : "Próximo"}
            <ChevronRight className="h-4 w-4" />
          </Button>
        ) : (
          <Button
            onClick={() => window.print()}
            className="gap-1 bg-green-600 text-white hover:bg-green-700"
          >
            Imprimir Lista
          </Button>
        )}
      </div>
    </div>
  );
}