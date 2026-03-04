import React from "react";
import { motion } from "motion/react";
import { Wand2, SlidersHorizontal, ChevronRight, Sparkles } from "lucide-react";

interface ModeSelectorProps {
  onSelectMode: (mode: "guided" | "free") => void;
}

export function ModeSelector({ onSelectMode }: ModeSelectorProps) {
  return (
    <div className="max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-10"
      >
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#cf2e2e]/10 border border-[#cf2e2e]/30 mb-6">
          <Sparkles className="h-4 w-4 text-[#cf2e2e]" />
          <span className="text-sm text-[#cf2e2e]">
            Como deseja planejar sua produção?
          </span>
        </div>
        <h1 className="text-4xl mb-3 text-[#757575]">Calculadora de Produção</h1>
        <p className="text-[#757575] text-lg max-w-2xl mx-auto">
          Escolha o modo que melhor se encaixa no seu momento. O modo guiado é
          ideal para quem quer planejar do zero.
        </p>
      </motion.div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Modo Guiado */}
        <motion.button
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          whileHover={{ scale: 1.02, y: -4 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onSelectMode("guided")}
          className="group relative overflow-hidden rounded-3xl border-2 border-[#cf2e2e]/50 bg-white p-8 text-left shadow-lg hover:shadow-2xl hover:shadow-[#cf2e2e]/20 transition-all duration-500 cursor-pointer"
        >
          <div className="absolute top-0 right-0 w-40 h-40 bg-[#cf2e2e] rounded-full blur-3xl opacity-10 group-hover:opacity-25 transition-opacity duration-500" />

          <div className="relative z-10">
            <div className="w-16 h-16 rounded-2xl bg-[#cf2e2e] flex items-center justify-center mb-5 shadow-lg shadow-[#cf2e2e]/30">
              <Wand2 className="h-8 w-8 text-white" />
            </div>

            <h2 className="text-2xl mb-2 text-[#757575]">Modo Guiado</h2>
            <p className="text-[#757575] mb-6 leading-relaxed">
              Defina seu objetivo e o Assistente te guia passo a passo: escolha do
              chocolate, inclusões, recheio e lista de compras automática.
            </p>

            <div className="space-y-2 mb-6">
              {[
                "Recomendações inteligentes de chocolate",
                "Receitas de recheio pré-configuradas",
                "Lista de compras otimizada",
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-2 text-sm text-[#757575]">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#cf2e2e]" />
                  {item}
                </div>
              ))}
            </div>

            <div className="flex items-center gap-2 text-[#cf2e2e] group-hover:gap-3 transition-all duration-300">
              <span>Começar planejamento</span>
              <ChevronRight className="h-5 w-5" />
            </div>
          </div>

          {/* Recommended badge */}
          <div className="absolute top-4 right-4 px-3 py-1 bg-[#cf2e2e] rounded-full text-xs text-white">
            Recomendado
          </div>
        </motion.button>

        {/* Modo Livre */}
        <motion.button
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          whileHover={{ scale: 1.02, y: -4 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onSelectMode("free")}
          className="group relative overflow-hidden rounded-3xl border-2 border-[#abb8c3]/40 bg-white p-8 text-left shadow-lg hover:shadow-2xl hover:border-[#abb8c3]/80 transition-all duration-500 cursor-pointer"
        >
          <div className="absolute top-0 right-0 w-40 h-40 bg-[#abb8c3] rounded-full blur-3xl opacity-5 group-hover:opacity-10 transition-opacity duration-500" />

          <div className="relative z-10">
            <div className="w-16 h-16 rounded-2xl bg-[#abb8c3]/20 flex items-center justify-center mb-5 shadow-lg">
              <SlidersHorizontal className="h-8 w-8 text-[#757575]" />
            </div>

            <h2 className="text-2xl mb-2 text-[#757575]">Modo Livre</h2>
            <p className="text-[#757575] mb-6 leading-relaxed">
              Crie sua própria receita do zero. Cadastre ingredientes com preços
              reais de compra e calcule custo exato de produção e preço de venda.
            </p>

            <div className="space-y-2 mb-6">
              {[
                "Cadastro livre de ingredientes com preço real",
                "Receitas personalizadas com custo por unidade",
                "Simulador de negócio e preço de venda",
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-2 text-sm text-[#757575]">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#abb8c3]" />
                  {item}
                </div>
              ))}
            </div>

            <div className="flex items-center gap-2 text-[#757575] group-hover:gap-3 transition-all duration-300">
              <span>Abrir calculadora</span>
              <ChevronRight className="h-5 w-5" />
            </div>
          </div>
        </motion.button>
      </div>
    </div>
  );
}