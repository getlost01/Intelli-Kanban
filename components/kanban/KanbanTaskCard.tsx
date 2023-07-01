import { useState, ChangeEvent , useEffect } from 'react';
import { Draggable } from '@hello-pangea/dnd';
// @mui
import { Paper, Typography, Box, Checkbox } from '@mui/material';
// @types
import { IKanbanCard } from '../../@types/kanban';
// components
import Iconify from '../iconify';
//
import KanbanDetails from './details/KanbanDetails';
// redux
import { useDispatch, useSelector } from '../../redux/store';
import { marksAsComplete } from '../../redux/slices/kanban';

// ----------------------------------------------------------------------

type Props = {
  index: number;
  card: IKanbanCard;
  onDeleteTask: (id: string) => void;
};

export default function KanbanTaskCard({ card, onDeleteTask, index }: Props) {
  const dispatch = useDispatch();

  const [name, setName] = useState(card.name);

  const [completed, setCompleted] = useState(card.completed);

  const [openDetails, setOpenDetails] = useState(false);

  const handleOpenDetails = () => {
    setOpenDetails(true);
  };

  const handleCloseDetails = () => {
    setOpenDetails(false);
  };

  const handleChangeComplete = (event: ChangeEvent<HTMLInputElement>) => {
    dispatch(marksAsComplete({card}));
    setCompleted(event.target.checked);
  };

  useEffect(() => {
    setCompleted(card.completed);
    setName(card.name);
  }, [card]);

  return (
    <>
      <Draggable draggableId={card.id} index={index}>
        {(provided) => (
          <Paper
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            ref={provided.innerRef}
            sx={{
              width: 1,
              borderRadius: 1,
              overflow: 'hidden',
              position: 'relative',
              boxShadow: (theme) => theme.customShadows.z1,
              '&:hover': {
                boxShadow: (theme) => theme.customShadows.z20,
              },
            }}
          >
            <Box onClick={handleOpenDetails} sx={{ cursor: 'pointer' }}>

              <Typography
                noWrap
                variant="subtitle2"
                sx={{
                  pr: 1,
                  pl: 6,
                  height: 72,
                  lineHeight: '72px',
                  transition: (theme) =>
                    theme.transitions.create('opacity', {
                      duration: theme.transitions.duration.shortest,
                    }),
                  ...(completed && {
                    opacity: 0.48,
                  }),
                }}
              >
                {name}
              </Typography>
            </Box>

            <Checkbox
              disableRipple
              checked={completed}
              icon={<Iconify icon="eva:radio-button-off-outline" />}
              checkedIcon={<Iconify icon="eva:checkmark-circle-2-outline" />}
              onChange={handleChangeComplete}
              sx={{ position: 'absolute', bottom: 16, left: 8 }}
            />
          </Paper>
        )}
      </Draggable>

      <KanbanDetails
        card={card}
        openDetails={openDetails}
        onCloseDetails={handleCloseDetails}
        onDeleteTask={() => onDeleteTask(card.id)}
      />
    </>
  );
}
