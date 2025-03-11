import { useEffect, useState } from "react";

export const useAuth = (asyncFunction: any, dependencies = []) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let isMounted = true;

    const executeAsync = async () => {
      try {
        const result = await asyncFunction();
        if (isMounted) {
          setData(result);
        }
      } catch (e) {
        if (isMounted) {
          setError(e as unknown as Error);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    executeAsync();

    return () => {
      isMounted = false;
    };
  }, dependencies);

  return { data, loading, error };
};
