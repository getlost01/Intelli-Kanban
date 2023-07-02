import { useState, useRef } from 'react';
// @mui
import { styled, alpha } from '@mui/material/styles';
import { Stack, Drawer, Avatar, Tooltip, Divider, TextField, Box, MenuItem, Paper, Button, InputBase, IconButton } from '@mui/material';
// @types
import { IKanbanCard } from '../../../@types/kanban';
// components
import Iconify from '../../iconify';
//
import KanbanInputName from '../KanbanInputName';
import KanbanDetailsToolbar from './KanbanDetailsToolbar';
import KanbanContactsDialog from '../KanbanContactsDialog';
import KanbanDetailsPrioritizes from './KanbanDetailsPrioritizes';
import MenuPopover from '../../menu-popover';
// redux
import { useDispatch, useSelector } from '../../../redux/store';
import { marksAsComplete , updateCard } from '../../../redux/slices/kanban';

// ----------------------------------------------------------------------

const StyledLabel = styled('span')(({ theme }) => ({
  ...theme.typography.caption,
  width: 120,
  flexShrink: 0,
  color: theme.palette.text.secondary,
}));

// ----------------------------------------------------------------------

type Props = {
  card: IKanbanCard;
  openDetails: boolean;
  onCloseDetails: VoidFunction;
  onDeleteTask: VoidFunction;
};

export default function KanbanDetails({ card, openDetails, onCloseDetails, onDeleteTask }: Props) {
  const dispatch = useDispatch();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [liked, setLiked] = useState(false);

  const [prioritize, setPrioritize] = useState('low');

  const [taskName, setTaskName] = useState(card.name);

  const [openContacts, setOpenContacts] = useState(false);

  const [completed, setCompleted] = useState(card.completed);

  const [taskDescription, setTaskDescription] = useState(card.description);

  const [taskBreakdown, setTaskBreakdown] = useState(card.taskBreakdown);

  const [taskPropmt, setTaskPropmt] = useState('');

  const [openPopover, setOpenPopover] = useState<HTMLElement | null>(null);

  const handleClosePopover = () => {
    setOpenPopover(null);
  };

  const handleOpenPopover = (event: React.MouseEvent<HTMLElement>) => {
    setOpenPopover(event.currentTarget);
  };

  const handleLiked = () => {
    setLiked(!liked);
  };

  const handleCompleted = () => {
    dispatch(marksAsComplete({card}));
    setCompleted(!completed);
  };

  const handleOpenContacts = () => {
    setOpenContacts(true);
  };

  const handleCloseContacts = () => {
    setOpenContacts(false);
  };

  const handleClickAttach = () => {
    fileInputRef.current?.click();
  };

  const handleChangeTaskName = (event: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(updateCard({card, taskName: event.target.value}));
    setTaskName(event.target.value);
  };

  const handleChangeTaskDescription = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTaskDescription(event.target.value);
  };

  const handleChangeTaskBreakdown = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTaskBreakdown(event.target.value);
  };

  const handleChangeTaskPropmt = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTaskPropmt(event.target.value);
  };

  const handleClickIdea = (value: string) => {
    setTaskPropmt(value);
    handleClosePopover();
  };

  const handleChangePrioritize = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPrioritize((event.target as HTMLInputElement).value);
  };

  return (
    <Drawer
      open={openDetails}
      onClose={onCloseDetails}
      anchor="right"
      PaperProps={{
        sx: {
          width: {
            xs: 1,
            sm: 480,
          },
        },
      }}
    >
      <KanbanDetailsToolbar
        taskName={card.name}
        fileInputRef={fileInputRef}
        liked={liked}
        completed={completed}
        onLike={handleLiked}
        onAttach={handleClickAttach}
        onDelete={onDeleteTask}
        onCompleted={handleCompleted}
        onCloseDetails={onCloseDetails}
      />

      <Divider />

        <Stack spacing={3} sx={{ px: 2.5, pt: 3, pb: 5 }}>
          {/* Task name */}
          <KanbanInputName
            placeholder="Task name"
            value={taskName}
            onChange={handleChangeTaskName}
          />

          {/* Assignee */}
          <Stack direction="row">
            <StyledLabel sx={{ height: 40, lineHeight: '40px', my: 0.5 }}>Assignee</StyledLabel>

            <Stack direction="row" flexWrap="wrap" alignItems="center">
              {card.assignee.map((user) => (
                <Avatar key={user.id} alt={user.name} src={user.avatar} sx={{ m: 0.5 }} />
              ))}

              <Tooltip title="Add assignee">
                <IconButton
                  onClick={handleOpenContacts}
                  sx={{
                    p: 1,
                    ml: 0.5,
                    bgcolor: (theme) => alpha(theme.palette.grey[500], 0.08),
                    border: (theme) => `dashed 1px ${theme.palette.divider}`,
                  }}
                >
                  <Iconify icon="eva:plus-fill" />
                </IconButton>
              </Tooltip>

              <KanbanContactsDialog
                assignee={card.assignee}
                open={openContacts}
                onClose={handleCloseContacts}
              />
            </Stack>
          </Stack>

          {/* Prioritize */}
          <Stack direction="row" alignItems="center">
            <StyledLabel>Prioritize</StyledLabel>

            <KanbanDetailsPrioritizes
              prioritize={prioritize}
              onChangePrioritize={handleChangePrioritize}
            />
          </Stack>

          {/* Description */}
          <Stack direction="row">
            <StyledLabel> Description </StyledLabel>

            <TextField
              fullWidth
              multiline
              size="small"
              value={taskDescription}
              onChange={handleChangeTaskDescription}
              InputProps={{
                sx: { typography: 'body2' },
              }}
            />
          </Stack>
        
          {/* GPT Generate */}
          <Stack direction="row">
            <StyledLabel> Task Breakdown </StyledLabel>

            <TextField
              fullWidth
              multiline
              size="small"
              value={taskBreakdown}
              onChange={handleChangeTaskBreakdown}
              InputProps={{
                sx: { typography: 'body2' },
              }}
            />
          </Stack>

          <Divider />
          <Stack direction="row" spacing={2} sx={{ py: 1, px: 2.5 }}>

            <Paper variant="outlined" sx={{ p: 1, flexGrow: 1 }}>
              <InputBase fullWidth multiline rows={2} 
                value={taskPropmt}
               onChange={handleChangeTaskPropmt}
               placeholder="Write custom prompt" 
               sx={{ px: 1 }} />

              <Stack direction="row" alignItems="center">
                <Stack direction="row" flexGrow={1}>
                  <Tooltip title="Quick Prompts">
                  <IconButton
                      size="small"
                      color={openPopover ? 'inherit' : 'default'}
                      onClick={handleOpenPopover}
                    >
                      <Iconify icon="tabler:bulb-filled" />
                    </IconButton>
                  </Tooltip>

                  <MenuPopover open={openPopover} onClose={handleClosePopover} sx={{ mt: 0, ml: 1.25 }}>
                    <MenuItem onClick={() => handleClickIdea('Write documentation for this')}>
                      <Iconify icon="simple-line-icons:docs" />
                        Write documentation for this
                    </MenuItem>
                    <MenuItem onClick={() => handleClickIdea('Explain this in brief')}>
                      <Iconify icon="material-symbols:waves" />
                        Explain this in brief
                    </MenuItem>
                    <MenuItem onClick={() => handleClickIdea('Steps require for this')}>
                      <Iconify icon="ri:list-unordered" />
                        Steps require for this
                    </MenuItem>
                    <MenuItem onClick={() => handleClickIdea('Determine the subtasks for this')}>
                      <Iconify icon="vaadin:split" />
                        Determine the subtasks for this
                    </MenuItem>
                </MenuPopover>

                </Stack>

                <Button variant="contained">Generate</Button>
              </Stack>
            </Paper>
            </Stack>

  
        </Stack>
    </Drawer>
  );
}
