import {
  Card, CardContent, CardActions, Typography, Button, Switch
} from '@mui/material';
import { 
  Delete as DeleteIcon, Edit as EditIcon
} from '@mui/icons-material';

interface IProps {
  name: string;
  description: string;
  onEdit: () => void;
  onDelete: () => void;
  onState: () => void;
  isOn: boolean;
}

const FlagCard = ({ name, description, onEdit, onDelete, isOn, onState }: IProps) => {
  return (
    <Card 
      variant='outlined'
    >
      <CardContent>
        <Typography 
          sx={{ fontSize: 14 }} 
          color="text.secondary" 
          gutterBottom
        >
          {name}
        </Typography>
        <Typography 
          variant='body2'
        >
          {description}
        </Typography>
      </CardContent>

      <CardActions>
        <Button 
          size='small' 
          onClick={onEdit} 
          color="primary"
        >
          <EditIcon />
        </Button>
        <Button 
          size='small' 
          onClick={onDelete} 
          color="error"
        >
          <DeleteIcon />
        </Button>
        <Switch
          checked={isOn}
          onChange={onState}
        />
      </CardActions>
    </Card>
  );
};

export default FlagCard;
