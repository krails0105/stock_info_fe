// src/hooks/useDebounce.ts
// Debounce 훅 - 값이 변경된 후 일정 시간이 지나야 반환

import { useState, useEffect } from 'react';

/**
 * 값이 변경된 후 delay만큼 기다린 후에 반환
 * 타이핑 중에는 계속 업데이트되지 않고, 멈춘 후에만 업데이트됨
 *
 * @param value - 디바운스할 값
 * @param delay - 지연 시간 (ms)
 * @returns 디바운스된 값
 */
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    // delay 후에 값을 업데이트하는 타이머 설정
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // 값이 변경되면 이전 타이머 취소
    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
}

export default useDebounce;
