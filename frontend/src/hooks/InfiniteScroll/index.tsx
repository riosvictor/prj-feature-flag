import { useEffect, useRef } from 'react';

interface IProps {
  fetchData: () => void;
}
const useInfiniteScroll = ({ fetchData }: IProps) => {
  const target = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      const target = entries[0];
      if (target.isIntersecting) {
        fetchData();
      }
    });

    if (target.current) {
      observer.observe(target.current);
    }

    return () => {
      if (target.current) {
        observer.unobserve(target.current);
      }
    };
  }, [fetchData]);

  return target;
};

export default useInfiniteScroll;
