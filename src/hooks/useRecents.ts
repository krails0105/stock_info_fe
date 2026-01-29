// src/hooks/useRecents.ts
// 최근 본 종목 훅 - LocalStorage 기반 최근 본 종목 관리

import { useCallback } from 'react';
import useLocalStorage from './useLocalStorage';

// 최근 본 항목 타입
interface RecentItem {
  code: string;
  name: string;
  viewedAt: string;
}

// 저장 형식
interface RecentsData {
  updatedAt: string;
  items: RecentItem[];
}

const STORAGE_KEY = 'stockinfo:recents:v1';
const MAX_RECENTS = 10; // 최대 최근 본 개수

const initialData: RecentsData = {
  updatedAt: new Date().toISOString(),
  items: [],
};

/**
 * 최근 본 종목 관리 훅
 *
 * @returns { recents, addRecent, clearRecents }
 */
function useRecents() {
  const [data, setData] = useLocalStorage<RecentsData>(STORAGE_KEY, initialData);

  // 최근 본 종목 추가
  const addRecent = useCallback(
    (code: string, name: string) => {
      setData((prev) => {
        // 기존에 있으면 제거 (중복 방지)
        const filtered = prev.items.filter((item) => item.code !== code);

        // 맨 앞에 추가
        const newItem: RecentItem = {
          code,
          name,
          viewedAt: new Date().toISOString(),
        };

        // 최대 개수 유지
        const newItems = [newItem, ...filtered].slice(0, MAX_RECENTS);

        return {
          updatedAt: new Date().toISOString(),
          items: newItems,
        };
      });
    },
    [setData]
  );

  // 전체 삭제
  const clearRecents = useCallback(() => {
    setData(initialData);
  }, [setData]);

  return {
    recents: data.items,
    addRecent,
    clearRecents,
  };
}

export default useRecents;
