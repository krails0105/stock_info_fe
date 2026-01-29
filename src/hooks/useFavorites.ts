// src/hooks/useFavorites.ts
// 즐겨찾기 훅 - LocalStorage 기반 즐겨찾기 관리

import { useCallback } from 'react';
import useLocalStorage from './useLocalStorage';

// 저장 형식
interface FavoritesData {
  updatedAt: string;
  items: string[]; // 종목 코드 배열
}

const STORAGE_KEY = 'stockinfo:favorites:v1';
const MAX_FAVORITES = 50; // 최대 즐겨찾기 개수

const initialData: FavoritesData = {
  updatedAt: new Date().toISOString(),
  items: [],
};

/**
 * 즐겨찾기 관리 훅
 *
 * @returns { favorites, isFavorite, toggle, add, remove }
 */
function useFavorites() {
  const [data, setData] = useLocalStorage<FavoritesData>(STORAGE_KEY, initialData);

  // 즐겨찾기 여부 확인
  const isFavorite = useCallback(
    (code: string) => data.items.includes(code),
    [data.items]
  );

  // 즐겨찾기 추가
  const add = useCallback(
    (code: string) => {
      setData((prev) => {
        if (prev.items.includes(code)) return prev;
        if (prev.items.length >= MAX_FAVORITES) {
          // 최대 개수 초과 시 가장 오래된 것 제거
          return {
            updatedAt: new Date().toISOString(),
            items: [...prev.items.slice(1), code],
          };
        }
        return {
          updatedAt: new Date().toISOString(),
          items: [...prev.items, code],
        };
      });
    },
    [setData]
  );

  // 즐겨찾기 제거
  const remove = useCallback(
    (code: string) => {
      setData((prev) => ({
        updatedAt: new Date().toISOString(),
        items: prev.items.filter((c) => c !== code),
      }));
    },
    [setData]
  );

  // 토글 (있으면 제거, 없으면 추가)
  const toggle = useCallback(
    (code: string) => {
      if (isFavorite(code)) {
        remove(code);
      } else {
        add(code);
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

export default useFavorites;
