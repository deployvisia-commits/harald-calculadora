import React from "react";
import { Link, useLocation } from "react-router";
import { Logo } from "./Logo";
import { Calculator, Thermometer, BookOpen, Home } from "lucide-react";
import { motion } from "motion/react";

const navItems = [
  { path: "/", label: "Início", icon: Home },
  { path: "/calculadora", label: "Calculadora", icon: Calculator },
  { path: "/temperagem", label: "Temperagem", icon: Thermometer },
  { path: "/catalogo", label: "Catálogo", icon: BookOpen },
];

export function Navigation() {
  const location = useLocation();

  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="fixed top-0 left-0 right-0 z-50"
    >
      <div className="absolute inset-0 bg-white/80 backdrop-blur-xl border-b border-[#abb8c3]/40" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <Link to="/" className="flex items-center gap-3 group">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.2 }}
            >
              <Logo className="h-12 w-auto" />
            </motion.div>
            <div className="hidden sm:block">
              <span className="text-xl font-semibold text-[#cf2e2e]">
                Assistente Harald
              </span>
              <p className="text-xs text-[#757575] font-medium">Ferramenta Profissional</p>
            </div>
          </Link>

          <div className="flex gap-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className="relative"
                >
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className={`
                      flex items-center gap-2 px-4 py-2.5 rounded-2xl transition-all duration-300
                      ${isActive
                        ? "text-white shadow-lg shadow-[#cf2e2e]/30"
                        : "text-[#757575] hover:text-[#757575] hover:bg-[#abb8c3]/10"
                      }
                    `}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="activeTab"
                        className="absolute inset-0 bg-[#cf2e2e] rounded-2xl"
                        initial={false}
                        transition={{
                          type: "spring",
                          stiffness: 500,
                          damping: 30,
                        }}
                      />
                    )}
                    <Icon className="h-4 w-4 relative z-10" />
                    <span className="hidden sm:inline relative z-10 font-medium">
                      {item.label}
                    </span>
                  </motion.div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </motion.nav>
  );
}