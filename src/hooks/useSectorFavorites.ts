// src/hooks/useSectorFavorites.ts
// 섹터 즐겨찾기 훅 - LocalStorage 기반 섹터 즐겨찾기 관리

import { useCallback } from 'react';
import useLocalStorage from './useLocalStorage';

// 저장 형식
interface SectorFavoritesData {
  updatedAt: string;
  items: string[]; // 섹터명 배열
}

const STORAGE_KEY = 'stockinfo:favoriteSectors:v1';
const MAX_FAVORITES = 20; // 최대 즐겨찾기 개수

const initialData: SectorFavoritesData = {
  updatedAt: new Date().toISOString(),
  items: [],
};

/**
 * 섹터 즐겨찾기 관리 훅
 *
 * @returns { favorites, isFavorite, toggle, add, remove }
 */
function useSectorFavorites() {
  const [data, setData] = useLocalStorage<SectorFavoritesData>(STORAGE_KEY, initialData);

  // 즐겨찾기 여부 확인
  const isFavorite = useCallback(
    (sectorName: string) => data.items.includes(sectorName),
    [data.items]
  );

  // 즐겨찾기 추가
  const add = useCallback(
    (sectorName: string) => {
      setData((prev) => {
        if (prev.items.includes(sectorName)) return prev;
        if (prev.items.length >= MAX_FAVORITES) {
          // 최대 개수 초과 시 가장 오래된 것 제거
          return {
            updatedAt: new Date().toISOString(),
            items: [...prev.items.slice(1), sectorName],
          };
        }
        return {
          updatedAt: new Date().toISOString(),
          items: [...prev.items, sectorName],
        };
      });
    },
    [setData]
  );

  // 즐겨찾기 제거
  const remove = useCallback(
    (sectorName: string) => {
      setData((prev) => ({
        updatedAt: new Date().toISOString(),
        items: prev.items.filter((s) => s !== sectorName),
      }));
    },
    [setData]
  );

  // 토글 (있으면 제거, 없으면 추가)
  const toggle = useCallback(
    (sectorName: string) => {
      if (isFavorite(sectorName)) {
        remove(sectorName);
      } else {
        add(sectorName);
      }
    },
    [isFavorite, add, remove]
  );

  return {
    favorites: data.items,
    isFavorite,
    toggle,
    add,
    remove,
  };
}

export default useSectorFavorites;
