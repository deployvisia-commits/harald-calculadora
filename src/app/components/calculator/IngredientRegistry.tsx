import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Badge } from "../ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import {
  ChevronDown,
  ChevronUp,
  Plus,
  Trash2,
  RotateCcw,
  Database,
  Pencil,
  Check,
  X,
} from "lucide-react";
import {
  IngredienteCadastrado,
  CategoriaIngrediente,
  precoPorKg,
  CATEGORIA_LABELS,
  UNIDADES,
} from "../../lib/ingredient-registry";
import { formatCurrency, formatNumber } from "../../lib/utils";
import { motion, AnimatePresence } from "motion/react";

interface IngredientRegistryProps {
  ingredientes: IngredienteCadastrado[];
  onAdd: (ing: Omit<IngredienteCadastrado, "id">) => void;
  onUpdate: (id: string, changes: Partial<IngredienteCadastrado>) => void;
  onRemove: (id: string) => void;
  onReset: () => void;
}

const EMPTY_NEW: Omit<IngredienteCadastrado, "id"> = {
  nome: "",
  categoria: "outros",
  tamanhoPacote: 0,
  unidadePacote: "g",
  precoPacote: 0,
};

export function IngredientRegistry({
  ingredientes,
  onAdd,
  onUpdate,
  onRemove,
  onReset,
}: IngredientRegistryProps) {
  const [expanded, setExpanded] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [novo, setNovo] = useState<Omit<IngredienteCadastrado, "id">>({ ...EMPTY_NEW });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editData, setEditData] = useState<Partial<IngredienteCadastrado>>({});
  const [filterCat, setFilterCat] = useState<CategoriaIngrediente | "todos">("todos");

  const handleAdd = () => {
    if (!novo.nome.trim() || novo.tamanhoPacote <= 0) return;
    onAdd(novo);
    setNovo({ ...EMPTY_NEW });
    setShowForm(false);
  };

  const startEdit = (ing: IngredienteCadastrado) => {
    setEditingId(ing.id);
    setEditData({
      tamanhoPacote: ing.tamanhoPacote,
      unidadePacote: ing.unidadePacote,
      precoPacote: ing.precoPacote,
    });
  };

  const saveEdit = () => {
    if (editingId) {
      onUpdate(editingId, editData);
      setEditingId(null);
      setEditData({});
    }
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditData({});
  };

  const filtrados =
    filterCat === "todos"
      ? ingredientes
      : ingredientes.filter((i) => i.categoria === filterCat);

  // Agrupa por categoria para exibição
  const porCategoria: Record<string, IngredienteCadastrado[]> = {};
  filtrados.forEach((ing) => {
    if (!porCategoria[ing.categoria]) porCategoria[ing.categoria] = [];
    porCategoria[ing.categoria].push(ing);
  });

  return (
    <Card className="border-2 border-gray-200">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-[#3D1E12]">
            <Database className="h-5 w-5 text-[#FFD100]" />
            Meus Ingredientes
            <Badge variant="secondary" className="text-xs">
              {ingredientes.length}
            </Badge>
          </CardTitle>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={onReset}
              className="text-xs text-gray-400 hover:text-gray-600 gap-1 h-7"
            >
              <RotateCcw className="h-3 w-3" />
            </Button>
            <button
              onClick={() => setExpanded(!expanded)}
              className="p-1.5 rounded-lg hover:bg-gray-100 cursor-pointer"
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
          Cadastre ingredientes com tamanho do pacote e preço real de compra
        </p>
      </CardHeader>

      {expanded && (
        <CardContent className="space-y-4">
          {/* Filtro por categoria */}
          <div className="flex flex-wrap gap-1.5">
            <button
              onClick={() => setFilterCat("todos")}
              className={`px-2.5 py-1 rounded-full text-xs transition-colors cursor-pointer ${
                filterCat === "todos"
                  ? "bg-[#FFD100] text-[#3D1E12]"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              Todos
            </button>
            {(Object.entries(CATEGORIA_LABELS) as [CategoriaIngrediente, typeof CATEGORIA_LABELS["chocolate"]][]).map(
              ([key, val]) => (
                <button
                  key={key}
                  onClick={() => setFilterCat(key)}
                  className={`px-2.5 py-1 rounded-full text-xs transition-colors cursor-pointer ${
                    filterCat === key
                      ? "bg-[#FFD100] text-[#3D1E12]"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {val.emoji} {val.label}
                </button>
              )
            )}
          </div>

          {/* Lista de ingredientes */}
          <div className="space-y-1">
            {Object.entries(porCategoria).map(([cat, itens]) => {
              const catInfo =
                CATEGORIA_LABELS[cat as CategoriaIngrediente] || CATEGORIA_LABELS.outros;
              return (
                <div key={cat} className="space-y-1">
                  <div className="flex items-center gap-2 pt-2 pb-1">
                    <span className="text-xs text-gray-400">{catInfo.emoji}</span>
                    <span className="text-xs text-gray-400 uppercase tracking-wider">
                      {catInfo.label}
                    </span>
                  </div>
                  <AnimatePresence>
                    {itens.map((ing) => {
                      const isEditing = editingId === ing.id;
                      const pKg = precoPorKg(ing);
                      const isUnitario = ing.unidadePacote === "un";

                      return (
                        <motion.div
                          key={ing.id}
                          initial={{ opacity: 0, y: -5 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, x: -10 }}
                          className="grid grid-cols-12 gap-1.5 items-center p-2 rounded-lg bg-gray-50 hover:bg-gray-100/80 transition-colors group"
                        >
                          {/* Nome */}
                          <div className="col-span-4 truncate text-sm text-gray-800">
                            {ing.nome}
                          </div>

                          {/* Pacote */}
                          <div className="col-span-3">
                            {isEditing ? (
                              <div className="flex items-center gap-0.5">
                                <Input
                                  type="number"
                                  min="0"
                                  step="0.01"
                                  value={editData.tamanhoPacote ?? ing.tamanhoPacote}
                                  onChange={(e) =>
                                    setEditData({
                                      ...editData,
                                      tamanhoPacote:
                                        parseFloat(e.target.value) || 0,
                                    })
                                  }
                                  className="h-6 text-xs w-14"
                                />
                                <select
                                  value={editData.unidadePacote ?? ing.unidadePacote}
                                  onChange={(e) =>
                                    setEditData({
                                      ...editData,
                                      unidadePacote: e.target.value as any,
                                    })
                                  }
                                  className="h-6 text-xs border rounded px-0.5 bg-white"
                                >
                                  {UNIDADES.map((u) => (
                                    <option key={u.value} value={u.value}>
                                      {u.label}
                                    </option>
                                  ))}
                                </select>
                              </div>
                            ) : (
                              <span className="text-xs text-gray-500">
                                {formatNumber(ing.tamanhoPacote, ing.tamanhoPacote % 1 !== 0 ? 2 : 0)}
                                {ing.unidadePacote}
                              </span>
                            )}
                          </div>

                          {/* Preço pacote */}
                          <div className="col-span-2">
                            {isEditing ? (
                              <Input
                                type="number"
                                min="0"
                                step="0.01"
                                value={editData.precoPacote ?? ing.precoPacote}
                                onChange={(e) =>
                                  setEditData({
                                    ...editData,
                                    precoPacote: parseFloat(e.target.value) || 0,
                                  })
                                }
                                className="h-6 text-xs w-full"
                              />
                            ) : (
                              <span className="text-xs text-gray-700">
                                {formatCurrency(ing.precoPacote)}
                              </span>
                            )}
                          </div>

                          {/* Preço/kg + ações */}
                          <div className="col-span-3 flex items-center justify-end gap-1">
                            {!isUnitario && (
                              <span className="text-[10px] text-gray-400">
                                {formatCurrency(pKg)}/kg
                              </span>
                            )}
                            {isEditing ? (
                              <>
                                <button
                                  onClick={saveEdit}
                                  className="p-0.5 rounded hover:bg-green-100 text-green-600 cursor-pointer"
                                >
                                  <Check className="h-3.5 w-3.5" />
                                </button>
                                <button
                                  onClick={cancelEdit}
                                  className="p-0.5 rounded hover:bg-red-100 text-red-500 cursor-pointer"
                                >
                                  <X className="h-3.5 w-3.5" />
                                </button>
                              </>
                            ) : (
                              <>
                                <button
                                  onClick={() => startEdit(ing)}
                                  className="p-0.5 rounded hover:bg-blue-100 text-gray-400 hover:text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                                >
                                  <Pencil className="h-3 w-3" />
                                </button>
                                <button
                                  onClick={() => onRemove(ing.id)}
                                  className="p-0.5 rounded hover:bg-red-100 text-gray-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                                >
                                  <Trash2 className="h-3 w-3" />
                                </button>
                              </>
                            )}
                          </div>
                        </motion.div>
                      );
                    })}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>

          {/* Formulário de novo ingrediente */}
          {showForm ? (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="p-3 border-2 border-dashed border-[#FFD100] rounded-xl bg-amber-50/30 space-y-3"
            >
              <p className="text-sm text-[#3D1E12]">Novo Ingrediente</p>
              <div className="grid grid-cols-2 gap-2">
                <Input
                  placeholder="Nome do ingrediente"
                  value={novo.nome}
                  onChange={(e) => setNovo({ ...novo, nome: e.target.value })}
                  className="col-span-2 h-8 text-sm"
                />
                <Select
                  value={novo.categoria}
                  onValueChange={(v) =>
                    setNovo({ ...novo, categoria: v as CategoriaIngrediente })
                  }
                >
                  <SelectTrigger className="h-8 text-xs">
                    <SelectValue placeholder="Categoria" />
                  </SelectTrigger>
                  <SelectContent>
                    {(Object.entries(CATEGORIA_LABELS) as [CategoriaIngrediente, typeof CATEGORIA_LABELS["chocolate"]][]).map(
                      ([key, val]) => (
                        <SelectItem key={key} value={key}>
                          {val.emoji} {val.label}
                        </SelectItem>
                      )
                    )}
                  </SelectContent>
                </Select>
                <div className="flex items-center gap-1">
                  <Input
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="Tamanho"
                    value={novo.tamanhoPacote || ""}
                    onChange={(e) =>
                      setNovo({
                        ...novo,
                        tamanhoPacote: parseFloat(e.target.value) || 0,
                      })
                    }
                    className="h-8 text-sm flex-1"
                  />
                  <select
                    value={novo.unidadePacote}
                    onChange={(e) =>
                      setNovo({
                        ...novo,
                        unidadePacote: e.target.value as any,
                      })
                    }
                    className="h-8 text-xs border rounded px-1 bg-white"
                  >
                    {UNIDADES.map((u) => (
                      <option key={u.value} value={u.value}>
                        {u.label}
                      </option>
                    ))}
                  </select>
                </div>
                <Input
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="Preço R$"
                  value={novo.precoPacote || ""}
                  onChange={(e) =>
                    setNovo({
                      ...novo,
                      precoPacote: parseFloat(e.target.value) || 0,
                    })
                  }
                  className="h-8 text-sm"
                />
              </div>
              <div className="flex gap-2">
                <Button size="sm" onClick={handleAdd} className="flex-1 h-8">
                  <Plus className="h-3.5 w-3.5 mr-1" />
                  Cadastrar
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => {
                    setShowForm(false);
                    setNovo({ ...EMPTY_NEW });
                  }}
                  className="h-8"
                >
                  Cancelar
                </Button>
              </div>
            </motion.div>
          ) : (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowForm(true)}
              className="w-full gap-1 border-dashed"
            >
              <Plus className="h-4 w-4" />
              Cadastrar Ingrediente
            </Button>
          )}
        </CardContent>
      )}
    </Card>
  );
}
