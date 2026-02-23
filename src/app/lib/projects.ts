// Gestão de projetos de produção (persistência em localStorage)

export interface ProjetoProd {
  id: string;
  nome: string;
  dataCriacao: string;
  dataAtualizacao: string;
  modo: "guided" | "free";
  dados: any;
}

const STORAGE_KEY = "harald-projetos";

export function listarProjetos(): ProjetoProd[] {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return JSON.parse(saved);
  } catch {}
  return [];
}

export function salvarProjeto(
  projeto: Omit<ProjetoProd, "id" | "dataCriacao" | "dataAtualizacao">
): ProjetoProd {
  const projetos = listarProjetos();
  const novo: ProjetoProd = {
    ...projeto,
    id: Date.now().toString(),
    dataCriacao: new Date().toISOString(),
    dataAtualizacao: new Date().toISOString(),
  };
  projetos.push(novo);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(projetos));
  return novo;
}

export function atualizarProjeto(id: string, dados: any): void {
  const projetos = listarProjetos();
  const index = projetos.findIndex((p) => p.id === id);
  if (index >= 0) {
    projetos[index].dados = dados;
    projetos[index].dataAtualizacao = new Date().toISOString();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(projetos));
  }
}

export function excluirProjeto(id: string): void {
  const projetos = listarProjetos().filter((p) => p.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(projetos));
}

export function carregarProjeto(id: string): ProjetoProd | undefined {
  return listarProjetos().find((p) => p.id === id);
}
