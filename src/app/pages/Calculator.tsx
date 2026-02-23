import React, { useState } from "react";
import { Navigation } from "../components/Navigation";
import { ModeSelector } from "../components/calculator/ModeSelector";
import { GuidedWizard } from "../components/calculator/GuidedWizard";
import { FreeCalculator } from "../components/calculator/FreeCalculator";
import { motion, AnimatePresence } from "motion/react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import {
  listarProjetos,
  salvarProjeto,
  excluirProjeto,
  ProjetoProd,
} from "../lib/projects";
import {
  FolderOpen,
  Save,
  Trash2,
  X,
  Clock,
  FileText,
} from "lucide-react";

type Mode = "select" | "guided" | "free";

export default function Calculator() {
  const [mode, setMode] = useState<Mode>(() => {
    const saved = localStorage.getItem("calculatorMode");
    if (saved === "guided" || saved === "free") return saved;
    return "select";
  });
  const [guidedInitialData, setGuidedInitialData] = useState<any>(null);

  // Project management
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [showLoadDialog, setShowLoadDialog] = useState(false);
  const [projectName, setProjectName] = useState("");
  const [pendingSaveData, setPendingSaveData] = useState<any>(null);
  const [projetos, setProjetos] = useState<ProjetoProd[]>(() => listarProjetos());

  const refreshProjetos = () => setProjetos(listarProjetos());

  const handleSelectMode = (selected: "guided" | "free") => {
    localStorage.setItem("calculatorMode", selected);
    setGuidedInitialData(null);
    setMode(selected);
  };

  const handleBack = () => {
    localStorage.removeItem("calculatorMode");
    setGuidedInitialData(null);
    setMode("select");
  };

  // Save project
  const handleSaveRequest = (dados: any) => {
    setPendingSaveData(dados);
    setProjectName("");
    setShowSaveDialog(true);
  };

  const handleConfirmSave = () => {
    if (!projectName.trim() || !pendingSaveData) return;
    salvarProjeto({
      nome: projectName.trim(),
      modo: mode as "guided" | "free",
      dados: pendingSaveData,
    });
    refreshProjetos();
    setShowSaveDialog(false);
    setPendingSaveData(null);
    setProjectName("");
  };

  // Load project
  const handleLoadProject = (projeto: ProjetoProd) => {
    setShowLoadDialog(false);
    if (projeto.modo === "guided") {
      localStorage.setItem("calculatorMode", "guided");
      setGuidedInitialData(projeto.dados);
      setMode("guided");
    } else {
      localStorage.setItem("calculatorMode", "free");
      localStorage.setItem("productionCalculator", JSON.stringify(projeto.dados));
      setGuidedInitialData(null);
      setMode("free");
    }
  };

  // Delete project
  const handleDeleteProject = (id: string) => {
    excluirProjeto(id);
    refreshProjetos();
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-amber-50/30">
      <Navigation />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-12">
        {/* Project bar - show on mode select */}
        {mode === "select" && projetos.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 flex justify-end"
          >
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                refreshProjetos();
                setShowLoadDialog(true);
              }}
              className="gap-2"
            >
              <FolderOpen className="h-4 w-4" />
              Meus Projetos ({projetos.length})
            </Button>
          </motion.div>
        )}

        <AnimatePresence mode="wait">
          {mode === "select" && (
            <motion.div
              key="select"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
            >
              <ModeSelector onSelectMode={handleSelectMode} />
            </motion.div>
          )}

          {mode === "guided" && (
            <motion.div
              key="guided"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
            >
              <GuidedWizard
                onBack={handleBack}
                onSave={handleSaveRequest}
                initialData={guidedInitialData}
              />
            </motion.div>
          )}

          {mode === "free" && (
            <motion.div
              key="free"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
            >
              <FreeCalculator onBack={handleBack} />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Save Dialog */}
      <AnimatePresence>
        {showSaveDialog && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowSaveDialog(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <Card className="w-full max-w-md shadow-2xl">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <Save className="h-5 w-5 text-green-600" />
                      Salvar Projeto
                    </CardTitle>
                    <button
                      onClick={() => setShowSaveDialog(false)}
                      className="p-1 rounded-lg hover:bg-gray-100 cursor-pointer"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm text-gray-600">Nome do projeto</label>
                    <Input
                      placeholder="Ex: Páscoa 2026 - Lote 1"
                      value={projectName}
                      onChange={(e) => setProjectName(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleConfirmSave()}
                      autoFocus
                    />
                  </div>
                  <div className="flex gap-3">
                    <Button
                      variant="outline"
                      className="flex-1"
                      onClick={() => setShowSaveDialog(false)}
                    >
                      Cancelar
                    </Button>
                    <Button
                      className="flex-1 bg-green-600 text-white hover:bg-green-700"
                      onClick={handleConfirmSave}
                      disabled={!projectName.trim()}
                    >
                      <Save className="h-4 w-4 mr-1" />
                      Salvar
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Load Dialog */}
      <AnimatePresence>
        {showLoadDialog && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowLoadDialog(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-lg"
            >
              <Card className="shadow-2xl max-h-[80vh] flex flex-col">
                <CardHeader className="flex-shrink-0">
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <FolderOpen className="h-5 w-5 text-[#FFD100]" />
                      Meus Projetos
                    </CardTitle>
                    <button
                      onClick={() => setShowLoadDialog(false)}
                      className="p-1 rounded-lg hover:bg-gray-100 cursor-pointer"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3 overflow-y-auto flex-1">
                  {projetos.length === 0 ? (
                    <div className="text-center py-8 text-gray-400">
                      <FileText className="h-12 w-12 mx-auto mb-3 opacity-30" />
                      <p>Nenhum projeto salvo</p>
                      <p className="text-sm mt-1">
                        Use o modo guiado ou livre e clique em "Salvar Projeto"
                      </p>
                    </div>
                  ) : (
                    projetos.map((projeto) => (
                      <motion.div
                        key={projeto.id}
                        whileHover={{ scale: 1.01 }}
                        className="p-4 rounded-xl border-2 border-gray-200 hover:border-[#FFD100] transition-all cursor-pointer group"
                        onClick={() => handleLoadProject(projeto)}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-[#3D1E12] truncate">
                                {projeto.nome}
                              </span>
                              <span
                                className={`text-xs px-2 py-0.5 rounded-full ${
                                  projeto.modo === "guided"
                                    ? "bg-[#FFD100]/20 text-[#3D1E12]"
                                    : "bg-gray-200 text-gray-700"
                                }`}
                              >
                                {projeto.modo === "guided" ? "Guiado" : "Livre"}
                              </span>
                            </div>
                            <div className="flex items-center gap-1 text-xs text-gray-400">
                              <Clock className="h-3 w-3" />
                              {formatDate(projeto.dataAtualizacao)}
                            </div>
                          </div>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteProject(projeto.id);
                            }}
                            className="p-2 rounded-lg opacity-0 group-hover:opacity-100 hover:bg-red-50 text-red-400 hover:text-red-600 transition-all cursor-pointer"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </motion.div>
                    ))
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
