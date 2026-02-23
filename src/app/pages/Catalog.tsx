import React from "react";
import { Navigation } from "../components/Navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { haraldCatalog } from "../data/harald-products";
import { Thermometer, Droplets, TrendingUp, Info } from "lucide-react";
import { motion } from "motion/react";

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  show: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 10,
    },
  },
};

export default function Catalog() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      <Navigation />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-12 text-center"
        >
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-[#3D1E12] via-[#5D3E32] to-[#3D1E12] bg-clip-text text-transparent">
            Catálogo Técnico Harald
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Especificações completas de temperatura, fluidez e rendimento de cada linha
          </p>
        </motion.div>

        <div className="space-y-16">
          {haraldCatalog.linhas.map((linha, linhaIndex) => (
            <motion.div
              key={linha.nome}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: linhaIndex * 0.1 }}
            >
              <div className="mb-6">
                <h2 className="text-3xl font-bold text-[#3D1E12] mb-2">{linha.nome}</h2>
                <p className="text-base text-gray-600">{linha.tipo}</p>
                {linha.instrucoes && (
                  <motion.div
                    initial={{ scale: 0.95, opacity: 0 }}
                    whileInView={{ scale: 1, opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 }}
                    className="mt-4 p-4 bg-gradient-to-r from-[#FFD100]/10 to-[#FFD100]/5 border-2 border-[#FFD100]/30 rounded-2xl inline-block backdrop-blur-sm"
                  >
                    <p className="text-sm text-[#3D1E12] font-medium flex items-center gap-2">
                      <span className="text-xl">💡</span>
                      {linha.instrucoes}
                    </p>
                  </motion.div>
                )}
              </div>

              <motion.div
                variants={containerVariants}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, margin: "-50px" }}
                className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {linha.produtos.map((produto) => (
                  <motion.div key={produto.id} variants={itemVariants}>
                    <Card className="h-full hover:shadow-2xl transition-all duration-500 border-0 overflow-hidden group bg-white/70 backdrop-blur-sm">
                      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-[#FFD100]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                      
                      <CardHeader className="relative">
                        <CardTitle className="text-xl font-bold text-[#3D1E12]">
                          {produto.sabor}
                        </CardTitle>
                        <CardDescription className="flex items-center gap-2 mt-3 text-base">
                          <Droplets className="h-5 w-5 text-blue-500" />
                          <span className="font-medium">Fluidez: {produto.fluidez}</span>
                        </CardDescription>
                      </CardHeader>
                      
                      <CardContent className="space-y-4 relative">
                        {/* Temperature Curves */}
                        <div className="space-y-3">
                          <motion.div
                            whileHover={{ scale: 1.02 }}
                            className="flex items-start gap-3 p-4 bg-gradient-to-br from-orange-50 to-orange-100/50 rounded-2xl border border-orange-200/50"
                          >
                            <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center shadow-lg">
                              <Thermometer className="h-5 w-5 text-white" />
                            </div>
                            <div className="flex-1">
                              <p className="text-xs font-semibold text-orange-900 mb-1 uppercase tracking-wide">
                                Derretimento
                              </p>
                              <p className="text-base font-bold text-orange-800">
                                {produto.curva_temperatura.derretimento.min}°C - {produto.curva_temperatura.derretimento.max}°C
                              </p>
                            </div>
                          </motion.div>

                          {produto.curva_temperatura.tempera && (
                            <motion.div
                              whileHover={{ scale: 1.02 }}
                              className="flex items-start gap-3 p-4 bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-2xl border border-blue-200/50"
                            >
                              <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow-lg">
                                <Thermometer className="h-5 w-5 text-white" />
                              </div>
                              <div className="flex-1">
                                <p className="text-xs font-semibold text-blue-900 mb-1 uppercase tracking-wide">
                                  Têmpera
                                </p>
                                <p className="text-base font-bold text-blue-800">
                                  {produto.curva_temperatura.tempera.alvo
                                    ? `${produto.curva_temperatura.tempera.alvo}°C`
                                    : `${produto.curva_temperatura.tempera.min}°C - ${produto.curva_temperatura.tempera.max}°C`}
                                </p>
                              </div>
                            </motion.div>
                          )}

                          <motion.div
                            whileHover={{ scale: 1.02 }}
                            className="flex items-start gap-3 p-4 bg-gradient-to-br from-green-50 to-green-100/50 rounded-2xl border border-green-200/50"
                          >
                            <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center shadow-lg">
                              <Thermometer className="h-5 w-5 text-white" />
                            </div>
                            <div className="flex-1">
                              <p className="text-xs font-semibold text-green-900 mb-1 uppercase tracking-wide">
                                Trabalho
                              </p>
                              <p className="text-base font-bold text-green-800">
                                {produto.curva_temperatura.trabalho.alvo
                                  ? `${produto.curva_temperatura.trabalho.alvo}°C`
                                  : `${produto.curva_temperatura.trabalho.min}°C - ${produto.curva_temperatura.trabalho.max}°C`}
                              </p>
                            </div>
                          </motion.div>
                        </div>

                        {/* Yield Factor */}
                        <motion.div
                          whileHover={{ scale: 1.02 }}
                          className="flex items-start gap-3 p-4 bg-gradient-to-br from-purple-50 to-purple-100/50 rounded-2xl border border-purple-200/50"
                        >
                          <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-lg">
                            <TrendingUp className="h-5 w-5 text-white" />
                          </div>
                          <div className="flex-1">
                            <p className="text-xs font-semibold text-purple-900 mb-1 uppercase tracking-wide">
                              Fator de Rendimento
                            </p>
                            <p className="text-base font-bold text-purple-800">
                              {produto.fator_rendimento_banho}x{" "}
                              {produto.fator_rendimento_banho > 1 && (
                                <span className="text-sm font-normal text-purple-700">
                                  (+{((produto.fator_rendimento_banho - 1) * 100).toFixed(0)}% em banhos)
                                </span>
                              )}
                            </p>
                          </div>
                        </motion.div>

                        {/* Commercial Note */}
                        {produto.nota_comercial && (
                          <motion.div
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            className="flex items-start gap-3 p-4 bg-gradient-to-br from-yellow-50 to-amber-100/50 rounded-2xl border-2 border-yellow-300/50"
                          >
                            <Info className="h-5 w-5 text-yellow-600 mt-0.5 shrink-0" />
                            <p className="text-sm text-yellow-900 font-medium leading-relaxed">
                              {produto.nota_comercial}
                            </p>
                          </motion.div>
                        )}
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
          ))}
        </div>

        {/* Info Cards */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mt-20 grid md:grid-cols-2 gap-8"
        >
          <Card className="border-0 shadow-2xl bg-gradient-to-br from-blue-500 to-cyan-500 text-white overflow-hidden relative">
            <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full blur-3xl" />
            <CardHeader className="relative">
              <CardTitle className="text-2xl">Entendendo a Fluidez</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm relative">
              {[
                { nivel: "Muito Alta", desc: "Ideal para banhos e coberturas finas" },
                { nivel: "Alta", desc: "Ótima para moldagem e cobertura" },
                { nivel: "Média-Alta", desc: "Versátil para diversas aplicações" },
                { nivel: "Média", desc: "Ideal para recheios e moldagem" },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ x: -20, opacity: 0 }}
                  whileInView={{ x: 0, opacity: 1 }}
                  transition={{ delay: i * 0.1 }}
                  className="flex justify-between items-center p-3 bg-white/20 backdrop-blur-sm rounded-xl"
                >
                  <span className="font-semibold">{item.nivel}</span>
                  <span className="text-blue-100 text-right">{item.desc}</span>
                </motion.div>
              ))}
            </CardContent>
          </Card>

          <Card className="border-0 shadow-2xl bg-gradient-to-br from-purple-500 to-pink-500 text-white overflow-hidden relative">
            <div className="absolute bottom-0 left-0 w-40 h-40 bg-white/10 rounded-full blur-3xl" />
            <CardHeader className="relative">
              <CardTitle className="text-2xl">Métodos de Resfriamento</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm relative">
              {haraldCatalog.metodos_resfriamento.map((method, index) => (
                <motion.div
                  key={index}
                  initial={{ x: 20, opacity: 0 }}
                  whileInView={{ x: 0, opacity: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className="p-4 bg-white/20 backdrop-blur-sm rounded-xl border border-white/30"
                >
                  <p className="leading-relaxed font-medium">{method}</p>
                </motion.div>
              ))}
              <p className="text-xs text-purple-100 mt-4 p-3 bg-white/10 rounded-xl">
                * Não se aplica a coberturas fracionadas (Top e Inovare), que dispensam temperagem
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </main>
    </div>
  );
}