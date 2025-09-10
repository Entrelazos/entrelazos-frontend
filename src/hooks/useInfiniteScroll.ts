import { useEffect, useCallback, useRef } from 'react';

interface UseInfiniteScrollOptions {
  hasMorePages: boolean;
  loading: boolean;
  onLoadMore: () => void;
  threshold?: number;
}

export const useInfiniteScroll = ({
  hasMorePages,
  loading,
  onLoadMore,
  threshold = 200,
}: UseInfiniteScrollOptions) => {
  const observer = useRef<IntersectionObserver | null>(null);

  const lastElementRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();
      
      observer.current = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting && hasMorePages && !loading) {
            onLoadMore();
          }
        },
        {
          rootMargin: `${threshold}px`,
        }
      );
      
      if (node) observer.current.observe(node);
    },
    [loading, hasMorePages, onLoadMore, threshold]
  );

  useEffect(() => {
    return () => {
      if (observer.current) {
        observer.current.disconnect();
      }
    };
  }, []);

  return { lastElementRef };
};