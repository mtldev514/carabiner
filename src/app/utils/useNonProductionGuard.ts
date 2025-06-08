import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export function useNonProductionGuard(): boolean {
  const router = useRouter();
  const isProd = process.env.VERCEL_ENV === 'production';

  useEffect(() => {
    if (isProd) {
      router.replace('/');
    }
  }, [isProd, router]);

  return !isProd;
}
