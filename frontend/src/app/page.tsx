'use client';

import { useState } from 'react'
import { useRouter } from 'next/navigation';
import { Typography, Button } from '@mui/material';
import { AddCircle as AddIcon } from '@mui/icons-material';
import FlagCard from '@/components/FlagCard'
import Loading from '@/components/Loading';
import { changeStateFlag, deleteFlag, getFlags } from '@/common/requests';
import { FeatureFlags } from '@/models/feature_flags';
import useInfiniteScroll from '@/hooks/InfiniteScroll';
import styles from './page.module.css'

export default function Home() {
  const take = 2;
  const [ skip, setSkip ] = useState(0);
  const [ hasMore, setHasMore ] = useState(true);
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
  const loadFlags = () => {
    if (hasMore) {
      setLoading(true);

      getFlags({ skip, take })
        .then((response) => {
          setFlags([...flags, ...response]);
          setSkip(skip + take);
          setHasMore(response.length === take);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }
  const setTarget = useInfiniteScroll({ loadMore: loadFlags });
  const router = useRouter()
  

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
        <div ref={setTarget} style={{ height: '10px' }}></div>
      </div>
    </main>
  )
}
