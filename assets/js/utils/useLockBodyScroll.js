import { useEffect } from 'react';

export default function useLockBodyScroll(ref, active, redirect = false) {
  useEffect(() => {
    if ((ref.current && active) || redirect) {
      document.body.classList.add('sidebar-open');
    } else {
      document.body.classList.remove('sidebar-open');
    }
  }, [ref, active, redirect]);
}
