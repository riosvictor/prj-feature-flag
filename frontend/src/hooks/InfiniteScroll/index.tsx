import { useState, useEffect } from 'react';

interface IProps {
  loadMore: () => void;
}
const useInfiniteScroll = ({ loadMore }: IProps) => {
  const [target, setTarget] = useState<HTMLElement|null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          loadMore();
        }
      },
      { threshold: 0.8 }
    );

    if (target) {
      observer.observe(target);
    }

    return () => {
      if (target) {
        observer.disconnect();
      }
    };
  }, [target, loadMore]);

  return setTarget;
};

export default useInfiniteScroll;
