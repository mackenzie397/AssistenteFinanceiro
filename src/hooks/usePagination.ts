import { useMemo, useState, useCallback } from 'react';

export interface PaginationOptions {
  initialPage?: number;
  pageSize?: number;
  totalItems: number;
  maxPagesToShow?: number;
}

export interface PaginationResult {
  page: number;
  pageSize: number;
  totalPages: number;
  totalItems: number;
  
  // Valores calculados
  startItem: number;
  endItem: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  pages: number[];
  
  // Métodos
  setPage: (page: number) => void;
  nextPage: () => void;
  prevPage: () => void;
  setPageSize: (size: number) => void;
  goToFirstPage: () => void;
  goToLastPage: () => void;
}

/**
 * Hook para gerenciar paginação de dados
 */
export function usePagination({
  initialPage = 1,
  pageSize: initialPageSize = 10,
  totalItems,
  maxPagesToShow = 5
}: PaginationOptions): PaginationResult {
  const [page, setPageState] = useState(initialPage);
  const [pageSize, setPageSize] = useState(initialPageSize);
  
  // Calcular o número total de páginas
  const totalPages = useMemo(() => {
    return Math.max(1, Math.ceil(totalItems / pageSize));
  }, [totalItems, pageSize]);
  
  // Garantir que a página atual seja válida
  const currentPage = useMemo(() => {
    return Math.min(Math.max(1, page), totalPages);
  }, [page, totalPages]);
  
  // Se a página atual mudou devido a restrições, atualizar o estado
  if (page !== currentPage) {
    setPageState(currentPage);
  }
  
  // Função para mudar de página com validação
  const setPage = useCallback((newPage: number) => {
    setPageState(Math.min(Math.max(1, newPage), totalPages));
  }, [totalPages]);
  
  // Ir para próxima página
  const nextPage = useCallback(() => {
    if (currentPage < totalPages) {
      setPageState(currentPage + 1);
    }
  }, [currentPage, totalPages]);
  
  // Ir para página anterior
  const prevPage = useCallback(() => {
    if (currentPage > 1) {
      setPageState(currentPage - 1);
    }
  }, [currentPage]);
  
  // Ir para primeira página
  const goToFirstPage = useCallback(() => {
    setPageState(1);
  }, []);
  
  // Ir para última página
  const goToLastPage = useCallback(() => {
    setPageState(totalPages);
  }, [totalPages]);
  
  // Calcular os itens exibidos atualmente
  const startItem = useMemo(() => {
    return totalItems === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  }, [currentPage, pageSize, totalItems]);
  
  const endItem = useMemo(() => {
    return Math.min(startItem + pageSize - 1, totalItems);
  }, [startItem, pageSize, totalItems]);
  
  // Calcular array de páginas para navegação
  const pages = useMemo(() => {
    // Se temos menos páginas que o máximo a mostrar, mostrar todas
    if (totalPages <= maxPagesToShow) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    
    // Caso contrário, calcular um subconjunto
    let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
    const endPage = Math.min(startPage + maxPagesToShow - 1, totalPages);
    
    // Ajustar startPage se estamos perto do fim
    if (endPage - startPage + 1 < maxPagesToShow) {
      startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }
    
    return Array.from(
      { length: endPage - startPage + 1 },
      (_, i) => startPage + i
    );
  }, [currentPage, totalPages, maxPagesToShow]);
  
  return {
    page: currentPage,
    pageSize,
    totalPages,
    totalItems,
    startItem,
    endItem,
    hasNextPage: currentPage < totalPages,
    hasPrevPage: currentPage > 1,
    pages,
    setPage,
    nextPage,
    prevPage,
    setPageSize,
    goToFirstPage,
    goToLastPage
  };
} 