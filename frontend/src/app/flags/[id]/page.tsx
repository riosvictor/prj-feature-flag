'use client';

import { Fragment, useEffect, useState } from 'react';
import { 
  Button, 
  FormControl, 
  FormControlLabel, 
  FormHelperText, 
  IconButton, 
  InputLabel, 
  OutlinedInput, 
  Snackbar, 
  Switch, 
  Typography
} from '@mui/material';
import { ArrowBack as BackIcon, Close as CloseIcon } from "@mui/icons-material";
import styles from './page.module.css'
import { FeatureFlagStateEnum } from '@/models/feature_flags';
import { getFlag, updateFlag } from '@/common/requests';
import { useRouter } from 'next/navigation';

interface IProps {
  params: {
    id: string
  }
}

export default function EditFlag({ params }: IProps ) {
  const { id } = params;
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [state, setState] = useState<FeatureFlagStateEnum>(
    FeatureFlagStateEnum.OFF
  );
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setSubmitting] = useState(false);
  const [snackOpen, setSnackOpen] = useState(false);
  const [snackMessage, setSnackMessage] = useState('');

  useEffect(() => {
    getFlag(id).then((flag) => {
      setName(flag.name);
      setDescription(flag.description);
      setState(flag.state);
    });
  }, [id]);

  const makeRequest = () => {
    setSubmitting(true);
    updateFlag(id, {name, description, state })
      .then(() => {
        setName('');
        setDescription('');
        setState(FeatureFlagStateEnum.OFF);
        setSnackMessage('Feature Flag alterada com sucesso!');
        setSnackOpen(true);
      })
      .finally(() => {
        setSubmitting(false);
      });
  }
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const newErrors: { [key: string]: string } = {};
    
    if (!name.trim()) {
      newErrors.name = 'O nome é obrigatório';
    }
    if (!description.trim()) {
      newErrors.description = 'A descrição é obrigatório';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    makeRequest()
  };
  const snackHandleClose = (event: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }

    setSnackOpen(false);
  };
  const snackAction = (
    <Fragment>
      <IconButton
        size="small"
        aria-label="close"
        color="inherit"
        onClick={snackHandleClose}
      >
        <CloseIcon fontSize="small" />
      </IconButton>
    </Fragment>
  );
  const router = useRouter()


  return (
    <main className={styles.main}>
      <div className={styles.header}>
        <Typography variant="h2" gutterBottom>
            Editar Feature Flag
        </Typography>
        <Button 
          variant="contained" 
          startIcon={<BackIcon />}
          onClick={() => router.push('/')}
        >
          Voltar
        </Button>
      </div>

      <div className={styles.container}>
        <form onSubmit={handleSubmit} >
          <FormControl error={!!errors.name}>
            <InputLabel htmlFor="name">Nome</InputLabel>
            <OutlinedInput
              id="name"
              value={name}
              label="Nome"
              onChange={(e) => setName(e.target.value)}
            />
            <FormHelperText>{errors.name}</FormHelperText>
          </FormControl>

          <FormControl error={!!errors.description}>
            <InputLabel htmlFor="description">Descrição</InputLabel>
            <OutlinedInput
              id="description"
              value={description}
              label="Descrição"
              onChange={(e) => setDescription(e.target.value)}
            />
            <FormHelperText>{errors.description}</FormHelperText>
          </FormControl>

          <FormControlLabel
            control={
              <Switch 
                checked={state === 'ON'} 
                onChange={(e) => setState(
                  e.target.checked ? 
                    FeatureFlagStateEnum.ON : 
                    FeatureFlagStateEnum.OFF
                )}
              />
            }
            label="Ativo"
          />
          
          <Button 
            type="submit" 
            variant="contained" 
            color="primary"
            disabled={isSubmitting}
          >
            Alterar
          </Button>
        </form>
      </div>

      <Snackbar
        open={snackOpen}
        autoHideDuration={6000}
        onClose={snackHandleClose}
        message={snackMessage}
        action={snackAction}
      />
    </main>
  );
};
