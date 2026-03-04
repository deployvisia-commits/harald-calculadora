import React, { useState, useEffect } from "react";
import { Navigation } from "../components/Navigation";
import { useSearchParams } from "react-router";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "../components/ui/select";
import { Progress } from "../components/ui/progress";
import { haraldCatalog, getProductById, getProductLine, isCobertura } from "../data/harald-products";
import { AlertCircle, CheckCircle2, Play, Pause, RotateCcw, ThermometerSnowflake, Flame, HandMetal } from "lucide-react";

type TemperingStep = "environment" | "method" | "melting" | "cooling" | "working" | "test" | "complete";

export default function Tempering() {
  const [searchParams] = useSearchParams();
  const [productId, setProductId] = useState(() => {
    return searchParams.get("produto") || "";
  });
  const [currentStep, setCurrentStep] = useState<TemperingStep>("environment");
  const [coolingMethod, setCoolingMethod] = useState("");
  const [timer, setTimer] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  useEffect(() => {
    let interval: number | undefined;
    if (isTimerRunning) {
      interval = window.setInterval(() => {
        setTimer((prev) => prev + 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isTimerRunning]);

  const selectedProduct = productId ? getProductById(productId) : null;
  const selectedLine = productId ? getProductLine(productId) : null;
  const isCoberturaProduct = productId ? isCobertura(productId) : false;

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const resetTimer = () => {
    setTimer(0);
    setIsTimerRunning(false);
  };

  const getStepNumber = (step: TemperingStep): number => {
    const steps: TemperingStep[] = isCoberturaProduct
      ? ["environment", "melting", "working", "test", "complete"]
      : ["environment", "method", "melting", "cooling", "working", "test", "complete"];
    return steps.indexOf(step) + 1;
  };

  const getTotalSteps = (): number => {
    return isCoberturaProduct ? 5 : 7;
  };

  const getProgressPercentage = (): number => {
    return (getStepNumber(currentStep) / getTotalSteps()) * 100;
  };

  const nextStep = () => {
    const steps: TemperingStep[] = isCoberturaProduct
      ? ["environment", "melting", "working", "test", "complete"]
      : ["environment", "method", "melting", "cooling", "working", "test", "complete"];
    const currentIndex = steps.indexOf(currentStep);
    if (currentIndex < steps.length - 1) {
      setCurrentStep(steps[currentIndex + 1]);
      resetTimer();
    }
  };

  const previousStep = () => {
    const steps: TemperingStep[] = isCoberturaProduct
      ? ["environment", "melting", "working", "test", "complete"]
      : ["environment", "method", "melting", "cooling", "working", "test", "complete"];
    const currentIndex = steps.indexOf(currentStep);
    if (currentIndex > 0) {
      setCurrentStep(steps[currentIndex - 1]);
      resetTimer();
    }
  };

  const restart = () => {
    setCurrentStep("environment");
    setProductId("");
    setCoolingMethod("");
    resetTimer();
  };

  const renderStepContent = () => {
    if (!selectedProduct) {
      return (
        <Card>
          <CardHeader>
            <CardTitle>Selecione um Produto</CardTitle>
            <CardDescription>Escolha o chocolate Harald que você vai temperar</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Select value={productId} onValueChange={setProductId}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione um produto Harald" />
              </SelectTrigger>
              <SelectContent>
                {haraldCatalog.linhas.map((linha) => (
                  <SelectGroup key={linha.nome}>
                    <SelectLabel className="text-[#757575]">
                      {linha.nome} - {linha.tipo}
                    </SelectLabel>
                    {linha.produtos.map((produto) => (
                      <SelectItem key={produto.id} value={produto.id}>
                        {produto.sabor}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                ))}
              </SelectContent>
            </Select>

            {productId && (
              <Button onClick={nextStep} className="w-full">
                Iniciar Assistente
              </Button>
            )}
          </CardContent>
        </Card>
      );
    }

    switch (currentStep) {
      case "environment":
        return (
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                  <AlertCircle className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <CardTitle>Check de Ambiente</CardTitle>
                  <CardDescription>Etapa 1 de {getTotalSteps()}</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-blue-50 border-2 border-blue-200 rounded-lg">
                <h3 className="mb-3 text-blue-900">
                  ⚠️ Condições Essenciais para Temperagem
                </h3>
                <ul className="space-y-2 text-sm text-blue-900">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 shrink-0 mt-0.5" />
                    <span>
                      <strong>Temperatura ambiente:</strong> Entre 20°C e 25°C. Ambientes muito quentes ou frios comprometem o processo.
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 shrink-0 mt-0.5" />
                    <span>
                      <strong>Utensílios secos:</strong> Nada de água ou umidade. Uma gota pode estragar todo o chocolate.
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 shrink-0 mt-0.5" />
                    <span>
                      <strong>Termômetro culinário:</strong> Fundamental para acompanhar as temperaturas com precisão.
                    </span>
                  </li>
                </ul>
              </div>

              <div className="p-4 bg-[#cf2e2e]/10 border-2 border-[#cf2e2e]/30 rounded-lg">
                <p className="text-sm text-[#757575]">
                  <strong>Produto Selecionado:</strong> {selectedProduct.sabor} - {selectedLine?.nome}
                </p>
                {isCoberturaProduct && (
                  <p className="text-sm text-green-700 mt-2">
                    ✨ <strong>Boa notícia!</strong> Este produto dispensa temperagem. Você só precisa derreter e usar!
                  </p>
                )}
              </div>

              <Button onClick={nextStep} className="w-full">
                Ambiente OK, Continuar
              </Button>
            </CardContent>
          </Card>
        );

      case "method":
        return (
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center">
                  <HandMetal className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <CardTitle>Escolha o Método de Resfriamento</CardTitle>
                  <CardDescription>Etapa 2 de {getTotalSteps()}</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Selecione como você vai resfriar o chocolate após derreter:
              </p>

              <div className="space-y-3">
                {haraldCatalog.metodos_resfriamento.map((method) => (
                  <button
                    key={method}
                    onClick={() => setCoolingMethod(method)}
                    className={`w-full p-4 text-left rounded-lg border-2 transition-all ${coolingMethod === method
                        ? "border-[#cf2e2e] bg-[#cf2e2e]/10"
                        : "border-[#abb8c3]/40 hover:border-[#cf2e2e]/50"
                      }`}
                  >
                    <div className="flex items-center gap-3">
                      {coolingMethod === method && (
                        <CheckCircle2 className="h-5 w-5 text-[#cf2e2e]" />
                      )}
                      <span className="">{method}</span>
                    </div>
                  </button>
                ))}
              </div>

              <div className="flex gap-3">
                <Button variant="outline" onClick={previousStep} className="flex-1">
                  Voltar
                </Button>
                <Button onClick={nextStep} disabled={!coolingMethod} className="flex-1">
                  Continuar
                </Button>
              </div>
            </CardContent>
          </Card>
        );

      case "melting":
        return (
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center">
                  <Flame className="h-6 w-6 text-orange-600" />
                </div>
                <div>
                  <CardTitle>Derretimento</CardTitle>
                  <CardDescription>
                    Etapa {getStepNumber("melting")} de {getTotalSteps()}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-6 bg-[#fcb900]/10 border-2 border-[#fcb900]/30 rounded-lg">
                <div className="text-center mb-4">
                  <div className="text-4xl mb-2">
                    {selectedProduct.curva_temperatura.derretimento.min}°C - {selectedProduct.curva_temperatura.derretimento.max}°C
                  </div>
                  <p className="text-sm text-orange-900">Temperatura Alvo</p>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="text-sm">Instruções:</h4>
                <ol className="space-y-2 text-sm text-muted-foreground list-decimal list-inside">
                  <li>Pique o chocolate em pedaços pequenos e uniformes</li>
                  <li>Coloque no micro-ondas em potência média (50%)</li>
                  <li>Aqueça de 30 em 30 segundos, mexendo entre cada intervalo</li>
                  <li>
                    Continue até atingir {selectedProduct.curva_temperatura.derretimento.min}°C - {selectedProduct.curva_temperatura.derretimento.max}°C
                  </li>
                  <li>Use um termômetro para verificar a temperatura</li>
                </ol>
              </div>

              <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-sm text-yellow-900">
                  ⏱️ <strong>Timer de Controle:</strong> {formatTime(timer)}
                </p>
                <div className="flex gap-2 mt-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setIsTimerRunning(!isTimerRunning)}
                  >
                    {isTimerRunning ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                  </Button>
                  <Button size="sm" variant="outline" onClick={resetTimer}>
                    <RotateCcw className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="flex gap-3">
                <Button variant="outline" onClick={previousStep} className="flex-1">
                  Voltar
                </Button>
                <Button onClick={nextStep} className="flex-1">
                  Temperatura Atingida
                </Button>
              </div>
            </CardContent>
          </Card>
        );

      case "cooling":
        return (
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                  <ThermometerSnowflake className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <CardTitle>Resfriamento (Têmpera)</CardTitle>
                  <CardDescription>
                    Etapa {getStepNumber("cooling")} de {getTotalSteps()}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-6 bg-[#8ed1fc]/10 border-2 border-[#8ed1fc]/30 rounded-lg">
                <div className="text-center mb-4">
                  <div className="text-4xl mb-2">
                    {selectedProduct.curva_temperatura.tempera?.alvo
                      ? `${selectedProduct.curva_temperatura.tempera.alvo}°C`
                      : `${selectedProduct.curva_temperatura.tempera?.min}°C - ${selectedProduct.curva_temperatura.tempera?.max}°C`}
                  </div>
                  <p className="text-sm text-blue-900">Temperatura de Têmpera</p>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="text-sm">Método Selecionado: <strong>{coolingMethod}</strong></h4>

                {coolingMethod.includes("Tablagem") && (
                  <ol className="space-y-2 text-sm text-muted-foreground list-decimal list-inside">
                    <li>Despeje 2/3 do chocolate derretido sobre uma superfície de mármore limpa e seca</li>
                    <li>Movimente com espátula em movimentos amplos até resfriar</li>
                    <li>Retorne o chocolate à tigela com o 1/3 restante (ainda quente)</li>
                    <li>Mexa até atingir a temperatura de têmpera</li>
                  </ol>
                )}

                {coolingMethod.includes("Adição") && (
                  <ol className="space-y-2 text-sm text-muted-foreground list-decimal list-inside">
                    <li>Derreta apenas 2/3 do chocolate total</li>
                    <li>Adicione o 1/3 restante em gotas (chocolate frio picado)</li>
                    <li>Mexa continuamente até as gotas derreterem</li>
                    <li>Continue mexendo até atingir a temperatura de têmpera</li>
                  </ol>
                )}

                {coolingMethod.includes("Banho-maria") && (
                  <ol className="space-y-2 text-sm text-muted-foreground list-decimal list-inside">
                    <li>Prepare uma tigela maior com água gelada e gelo</li>
                    <li>Coloque a tigela com chocolate derretido sobre o banho de gelo</li>
                    <li>Mexa constantemente sem parar</li>
                    <li>Retire do gelo quando atingir a temperatura de têmpera</li>
                  </ol>
                )}
              </div>

              <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-900">
                  ⏱️ <strong>Tempo de movimentação:</strong> {formatTime(timer)}
                </p>
                <p className="text-xs text-blue-700 mt-1">
                  Mexa continuamente por cerca de 3-5 minutos
                </p>
                <div className="flex gap-2 mt-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setIsTimerRunning(!isTimerRunning)}
                  >
                    {isTimerRunning ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                  </Button>
                  <Button size="sm" variant="outline" onClick={resetTimer}>
                    <RotateCcw className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="flex gap-3">
                <Button variant="outline" onClick={previousStep} className="flex-1">
                  Voltar
                </Button>
                <Button onClick={nextStep} className="flex-1">
                  Temperatura Atingida
                </Button>
              </div>
            </CardContent>
          </Card>
        );

      case "working":
        return (
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                  <HandMetal className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <CardTitle>Temperatura de Trabalho</CardTitle>
                  <CardDescription>
                    Etapa {getStepNumber("working")} de {getTotalSteps()}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-6 bg-[#7bdcb5]/10 border-2 border-[#7bdcb5]/30 rounded-lg">
                <div className="text-center mb-4">
                  <div className="text-4xl mb-2">
                    {selectedProduct.curva_temperatura.trabalho?.alvo
                      ? `${selectedProduct.curva_temperatura.trabalho.alvo}°C`
                      : `${selectedProduct.curva_temperatura.trabalho.min}°C - ${selectedProduct.curva_temperatura.trabalho.max}°C`}
                  </div>
                  <p className="text-sm text-green-900">Temperatura Ideal para Moldagem</p>
                </div>
              </div>

              {!isCoberturaProduct && (
                <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
                  <h4 className="text-sm mb-2">💡 Dica Profissional:</h4>
                  <p className="text-sm text-purple-900">
                    Se o chocolate estiver muito denso, aqueça por 5 segundos no micro-ondas para elevar
                    {selectedProduct.curva_temperatura.trabalho.min && selectedProduct.curva_temperatura.trabalho.max &&
                      ` até ${selectedProduct.curva_temperatura.trabalho.max}°C`}.
                    Isso dará mais fluidez e brilho ao produto final.
                  </p>
                </div>
              )}

              <div className="space-y-2">
                <h4 className="text-sm">Agora você pode:</h4>
                <ul className="space-y-2 text-sm text-muted-foreground list-disc list-inside">
                  <li>Despejar em formas e moldes</li>
                  <li>Fazer cobertura de bombons</li>
                  <li>Criar cascas de ovos de páscoa</li>
                  <li>Aplicar em bolos e doces</li>
                </ul>
              </div>

              <div className="flex gap-3">
                <Button variant="outline" onClick={previousStep} className="flex-1">
                  Voltar
                </Button>
                <Button onClick={nextStep} className="flex-1">
                  Fazer Teste de Secagem
                </Button>
              </div>
            </CardContent>
          </Card>
        );

      case "test":
        return (
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-12 h-12 rounded-full bg-yellow-100 flex items-center justify-center">
                  <CheckCircle2 className="h-6 w-6 text-yellow-600" />
                </div>
                <div>
                  <CardTitle>Teste de Secagem</CardTitle>
                  <CardDescription>
                    Etapa {getStepNumber("test")} de {getTotalSteps()}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm">
                Antes de começar a produção, faça este teste rápido para garantir que a temperagem está perfeita:
              </p>

              <div className="p-4 bg-yellow-50 border-2 border-yellow-200 rounded-lg space-y-3">
                <h4 className="text-sm">Como fazer o teste:</h4>
                <ol className="space-y-2 text-sm text-yellow-900 list-decimal list-inside">
                  <li>Coloque uma pequena quantidade de chocolate na ponta de uma espátula ou faca</li>
                  <li>Leve à geladeira por 3 minutos</li>
                  <li>Retire e observe o resultado</li>
                </ol>
              </div>

              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <h4 className="text-sm mb-2 text-green-900">✅ Temperagem Correta:</h4>
                <ul className="space-y-1 text-sm text-green-800 list-disc list-inside">
                  <li>Chocolate sai seco e brilhante</li>
                  <li>Solta facilmente da espátula</li>
                  <li>Superfície lisa e uniforme</li>
                  <li>Som de "estalo" ao quebrar</li>
                </ul>
              </div>

              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <h4 className="text-sm mb-2 text-red-900">❌ Temperagem Incorreta:</h4>
                <ul className="space-y-1 text-sm text-red-800 list-disc list-inside">
                  <li>Chocolate sai manchado ou fosco</li>
                  <li>Gruda na espátula</li>
                  <li>Aparência esbranquiçada</li>
                  <li>Textura gordurosa ao toque</li>
                </ul>
                <p className="text-xs mt-2 text-red-700">
                  Se isso acontecer, repita o processo desde o derretimento
                </p>
              </div>

              <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-900">
                  ⏱️ <strong>Timer de teste:</strong> {formatTime(timer)}
                </p>
                <div className="flex gap-2 mt-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      resetTimer();
                      setIsTimerRunning(true);
                    }}
                  >
                    Iniciar Timer (3 min)
                  </Button>
                </div>
              </div>

              <div className="flex gap-3">
                <Button variant="outline" onClick={previousStep} className="flex-1">
                  Voltar
                </Button>
                <Button onClick={nextStep} className="flex-1">
                  Teste OK, Finalizar
                </Button>
              </div>
            </CardContent>
          </Card>
        );

      case "complete":
        return (
          <Card className="border-2 border-green-500">
            <CardHeader>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-12 h-12 rounded-full bg-green-500 flex items-center justify-center">
                  <CheckCircle2 className="h-6 w-6 text-white" />
                </div>
                <div>
                  <CardTitle>Temperagem Concluída!</CardTitle>
                  <CardDescription>Seu chocolate está pronto para uso</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-6 bg-green-50 border border-green-200 rounded-lg text-center">
                <div className="text-6xl mb-4">🎉</div>
                <h3 className="text-xl mb-2 text-green-900">Parabéns!</h3>
                <p className="text-sm text-green-800">
                  Você concluiu o processo de temperagem do {selectedProduct.sabor} - {selectedLine?.nome}
                </p>
              </div>

              <div className="p-4 bg-[#cf2e2e]/10 border border-[#cf2e2e]/30 rounded-lg">
                <h4 className="text-sm mb-2">💡 Lembre-se:</h4>
                <ul className="space-y-1 text-sm list-disc list-inside">
                  <li>Mantenha o chocolate na temperatura de trabalho enquanto usa</li>
                  <li>Se esfriar demais, aqueça levemente (não passe da temperatura)</li>
                  <li>Trabalhe rapidamente para aproveitar a têmpera perfeita</li>
                  <li>Armazene produtos acabados em local fresco e seco</li>
                </ul>
              </div>

              <div className="flex gap-3">
                <Button variant="outline" onClick={restart} className="flex-1">
                  Fazer Nova Temperagem
                </Button>
                <Button onClick={() => window.location.href = "/"} className="flex-1">
                  Voltar ao Início
                </Button>
              </div>
            </CardContent>
          </Card>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-[#abb8c3]/10">
      <Navigation />

      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-12">
        <div className="mb-8">
          <h1 className="text-3xl mb-2 text-[#757575]">Assistente de Temperagem</h1>
          <p className="text-[#757575]">Guia passo a passo com temperaturas precisas</p>
        </div>

        {selectedProduct && currentStep !== "environment" && (
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm">
                Etapa {getStepNumber(currentStep)} de {getTotalSteps()}
              </span>
              <span className="text-sm">{Math.round(getProgressPercentage())}%</span>
            </div>
            <Progress value={getProgressPercentage()} className="h-2" />
          </div>
        )}

        {renderStepContent()}
      </main>
    </div>
  );
}