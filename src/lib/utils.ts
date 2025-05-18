import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Combina classes do Tailwind de forma mais eficiente
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Formata uma data para exibição
 */
export function formatDate(date: Date | string): string {
  if (!date) return "";
  
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

/**
 * Formata uma data com hora para exibição
 */
export function formatDateTime(date: Date | string): string {
  if (!date) return "";
  
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

/**
 * Trunca um texto com um número máximo de caracteres
 */
export function truncateText(text: string, maxLength: number): string {
  if (!text) return "";
  if (text.length <= maxLength) return text;
  
  return text.slice(0, maxLength) + "...";
}

/**
 * Gera um ID único
 */
export function generateId(): string {
  return Math.random().toString(36).substring(2, 9);
}

/**
 * Seleciona aleatoriamente um elemento de um array
 * Útil para a funcionalidade da "Caixa de Pandora"
 */
export function getRandomItem<T>(array: T[]): T | undefined {
  if (!array || array.length === 0) return undefined;
  const randomIndex = Math.floor(Math.random() * array.length);
  return array[randomIndex];
}

/**
 * Remove acentos de uma string
 */
export function removeAccents(str: string): string {
  return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

/**
 * Função para pesquisa simplificada
 */
export function searchInArray<T>(
  array: T[],
  searchTerm: string,
  fields: (keyof T)[]
): T[] {
  if (!searchTerm || !array) return array;
  
  const normalizedTerm = removeAccents(searchTerm.toLowerCase());
  
  return array.filter((item) => {
    return fields.some((field) => {
      const value = item[field];
      if (typeof value === "string") {
        return removeAccents(value.toLowerCase()).includes(normalizedTerm);
      }
      return false;
    });
  });
}