'use client';

import { useCallback, useState } from 'react'
import { useRouter } from 'next/navigation';
import { Typography, Button } from '@mui/material';
import { AddCircle as AddIcon } from '@mui/icons-material';
import FlagCard from '@/components/FlagCard'
import Loading from '@/components/Loading';
import { changeStateFlag, deleteFlag, getFlags } from '@/common/requests';
import { FeatureFlags } from '@/models/feature_flags';
import styles from './page.module.css'
import useInfiniteScroll from '../hooks/InfiniteScroll';

export default function Home() {
  const take = 2;
  const [ skip, setSkip ] = useState(0);
  const [ isLoading, setLoading ] = useState(false);
  const [ blockNewFlagBtn, setBlockNewFlagBtn ] = useState(false);
  const [flags, setFlags] = useState<FeatureFlags[]>([])
  
  
  const handleDelete = (id: string) => {
    deleteFlag(id).then(
      () => {
        setFlags((flags) => flags.filter((f) => f.id !== id));
      }
    );
  };
  const handleState = ({ id, state }: FeatureFlags) => {
    changeStateFlag(id, state).then(
      () => {
        setFlags((flags) => flags.map((f) => {
          if (f.id === id) {
            f.state = !state;
          }
          return f;
        }));
      }
    );
    ;
  };
  const handleNewFlag = () => {
    setBlockNewFlagBtn(true);
    try {
      router.push('/flags/new')
    } finally{
      setBlockNewFlagBtn(false);
    }
  }
  const fetchData = useCallback(async () => {
    if (isLoading) return;

    setLoading(true);
    getFlags({ skip, take })
      .then((res) => {
        setFlags([...flags, ...res]);
        setSkip(skip + take);
      })
      .catch((err) => console.log(err));
    
    setLoading(false);
  }, [isLoading, skip, take])
  
  const router = useRouter()
  const scrollObserver = useInfiniteScroll({ fetchData });

  //
  if (isLoading) {
    return <Loading />;
  }
  //
  return (
    <main className={styles.main}>
      <div className={styles.header}>
        <Typography variant="h2" gutterBottom>
          Feature Flags
        </Typography>
        <Button 
          variant="contained" 
          endIcon={<AddIcon />}
          onClick={handleNewFlag}
          disabled={blockNewFlagBtn}
        >
          Novo
        </Button>
      </div>
      
      <div 
        className={styles.center}
      >
        {flags?.map((f) => (
          <FlagCard
            key={f.id}
            name={f.name}
            description={f.description}
            onEdit={ () => { router.push(`/flags/${f.id}`) }}
            onDelete={ () => { handleDelete(f.id) }}
            onState={ () => { handleState(f) }}
            isOn={f.state}
          />
        ))}
        <div ref={scrollObserver}></div>
      </div>
    </main>
  )
}
