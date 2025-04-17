import { useEffect } from 'react';

export default function useClickOutside(ref, onClickOutside) {
  useEffect(() => {
    const handleClick = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        onClickOutside();
      }
    };

    document.addEventListener('mousedown', handleClick);
    return () => {
      document.removeEventListener('mousedown', handleClick);
    };
  }, [ref, onClickOutside]);
}