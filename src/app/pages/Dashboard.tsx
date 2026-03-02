import React from "react";
import { Navigation } from "../components/Navigation";
import { Link } from "react-router";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Calculator, Thermometer, BookOpen, ArrowRight, Sparkles } from "lucide-react";
import { motion } from "motion/react";

const features = [
  {
    icon: Calculator,
    title: "Calculadora de Produção",
    description: "Planeje sua produção do zero: objetivo, chocolate, inclusões, recheio e lista de compras",
    gradient: "from-blue-500 to-cyan-500",
    path: "/calculadora",
    color: "blue",
  },
  {
    icon: Thermometer,
    title: "Assistente de Temperagem",
    description: "Guia passo a passo com temperaturas específicas por produto",
    gradient: "from-orange-500 to-red-500",
    path: "/temperagem",
    color: "orange",
  },
  {
    icon: BookOpen,
    title: "Catálogo Técnico",
    description: "Especificações completas de todas as linhas Harald",
    gradient: "from-purple-500 to-pink-500",
    path: "/catalogo",
    color: "purple",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.3,
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

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      <Navigation />

      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="pt-32 pb-20 px-4 sm:px-6 lg:px-8"
      >
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-[#FFD100]/20 to-[#FFD100]/10 border border-[#FFD100]/30 mb-6"
          >
            <Sparkles className="h-4 w-4 text-[#3D1E12]" />
            <span className="text-sm font-semibold text-[#3D1E12]">
              Assistente Profissional para Confeiteiros
            </span>
          </motion.div>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
            <span className="bg-gradient-to-br from-[#3D1E12] via-[#5D3E32] to-[#3D1E12] bg-clip-text text-transparent">
              Assistente Harald
            </span>
          </h1>

          <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto leading-relaxed">
            Ferramentas profissionais para otimizar seus processos, reduzir custos e
            alcançar resultados perfeitos com chocolates Harald
          </p>

          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-block"
          >
            <Link
              to="/calculadora"
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-[#FFD100] to-[#FFDD33] text-[#3D1E12] font-semibold rounded-2xl shadow-lg shadow-[#FFD100]/30 hover:shadow-xl hover:shadow-[#FFD100]/40 transition-all duration-300"
            >
              Começar Agora
              <ArrowRight className="h-5 w-5" />
            </Link>
          </motion.div>
        </div>
      </motion.section>

      {/* Features Grid */}
      <section className="px-4 sm:px-6 lg:px-8 pb-20">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="max-w-7xl mx-auto grid md:grid-cols-3 gap-6"
        >
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div key={feature.path} variants={itemVariants}>
                <Link to={feature.path} className="block group">
                  <Card className="h-full border-0 shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden relative bg-white/70 backdrop-blur-sm">
                    {/* Gradient overlay on hover */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500`} />

                    <CardHeader className="relative">
                      <motion.div
                        whileHover={{ rotate: 360 }}
                        transition={{ duration: 0.6 }}
                        className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-4 shadow-lg`}
                      >
                        <Icon className="h-7 w-7 text-white" />
                      </motion.div>

                      <CardTitle className="text-2xl mb-2 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:${feature.gradient} transition-all duration-300">
                        {feature.title}
                      </CardTitle>

                      <CardDescription className="text-base leading-relaxed">
                        {feature.description}
                      </CardDescription>
                    </CardHeader>

                    <CardContent>
                      <div className="flex items-center gap-2 text-sm font-semibold text-gray-600 group-hover:text-[#3D1E12] transition-colors duration-300">
                        Acessar
                        <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            );
          })}
        </motion.div>
      </section>

      {/* Info Section */}
      <motion.section
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="px-4 sm:px-6 lg:px-8 pb-20"
      >
        <div className="max-w-4xl mx-auto">
          <Card className="border-0 shadow-2xl bg-gradient-to-br from-[#3D1E12] to-[#5D3E32] text-white overflow-hidden relative">
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#FFD100] rounded-full blur-3xl opacity-20" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#FFD100] rounded-full blur-3xl opacity-10" />

            <CardHeader className="relative z-10">
              <CardTitle className="text-3xl mb-4">
                Por que usar o Assistente Harald?
              </CardTitle>
            </CardHeader>

            <CardContent className="relative z-10 space-y-6">
              <div className="grid sm:grid-cols-2 gap-6">
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-[#FFD100] flex items-center justify-center">
                    <span className="text-[#3D1E12] font-bold">1</span>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1 text-lg">Economia de Tempo</h3>
                    <p className="text-gray-300 text-sm leading-relaxed">
                      Cálculos automáticos e precisos em segundos
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-[#FFD100] flex items-center justify-center">
                    <span className="text-[#3D1E12] font-bold">2</span>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1 text-lg">Maior Lucro</h3>
                    <p className="text-gray-300 text-sm leading-relaxed">
                      Compare linhas e escolha a mais rentável
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-[#FFD100] flex items-center justify-center">
                    <span className="text-[#3D1E12] font-bold">3</span>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1 text-lg">Qualidade Garantida</h3>
                    <p className="text-gray-300 text-sm leading-relaxed">
                      Temperagem perfeita com instruções precisas
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-[#FFD100] flex items-center justify-center">
                    <span className="text-[#3D1E12] font-bold">4</span>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1 text-lg">Dados Salvos</h3>
                    <p className="text-gray-300 text-sm leading-relaxed">
                      Seus preços ficam salvos no navegador
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </motion.section>
    </div>
  );
}