// src/hooks/useLocalStorage.ts
// LocalStorage 훅 - 브라우저 로컬 스토리지에 데이터를 저장하고 읽음

import { useState, useCallback } from 'react';

/**
 * LocalStorage에 데이터를 저장하고 읽는 훅
 *
 * @param key - 저장할 키 이름
 * @param initialValue - 초기값 (저장된 값이 없을 때 사용)
 * @returns [저장된 값, 값 설정 함수]
 */
function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T | ((prev: T) => T)) => void] {
  // 초기값 설정: localStorage에서 읽거나 initialValue 사용
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.warn(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  // 값 설정 함수
  const setValue = useCallback(
    (value: T | ((prev: T) => T)) => {
      try {
        // 함수면 이전 값을 전달하여 실행
        const valueToStore =
          value instanceof Function ? value(storedValue) : value;

        setStoredValue(valueToStore);

        // localStorage에 저장
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      } catch (error) {
        console.warn(`Error setting localStorage key "${key}":`, error);
      }
    },
    [key, storedValue]
  );

  return [storedValue, setValue];
}

export default useLocalStorage;
