import { useEffect } from 'react';

export function useClickOutside(
  ref: React.RefObject<HTMLElement>,
  onClickOutside: (event: MouseEvent) => void,
  ignoredRef?: React.RefObject<HTMLElement>,
) {
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        ref.current &&
        !ref.current.contains(event.target as Node) &&
        (!ignoredRef?.current || !ignoredRef.current.contains(event.target as Node))
      ) {
        onClickOutside(event);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClickOutside, ref, ignoredRef]);
}
