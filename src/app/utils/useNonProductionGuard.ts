import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export function useNonProductionGuard(): boolean {
  const router = useRouter();
  const isDisallowed = process.env.VERCEL_ENV !== 'development';

  useEffect(() => {
    if (isDisallowed) {
      router.replace('/');
    }
  }, [isDisallowed, router]);

  return !isDisallowed;
}
