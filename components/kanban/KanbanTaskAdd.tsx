import { useState } from 'react';
// @mui
import {
  Box,
  Paper,
  Stack,
  Tooltip,
  Checkbox,
  IconButton,
  InputBase,
  ClickAwayListener,
} from '@mui/material';
// utils
import uuidv4 from '../../src/utils/uuidv4';
// @types
import { IKanbanCard } from '../../@types/kanban';
// components
import Iconify from '../iconify';
//
import KanbanContactsDialog from './KanbanContactsDialog';

// ----------------------------------------------------------------------

const defaultTask = {
  attachments: [],
  comments: [],
  description: '',
  assignee: [],
};

type Props = {
  onAddTask: (task: IKanbanCard) => void;
  onCloseAddTask: VoidFunction;
};

export default function KanbanTaskAdd({ onAddTask, onCloseAddTask }: Props) {
  const [name, setName] = useState('');

  const [completed, setCompleted] = useState(false);

  const [openContacts, setOpenContacts] = useState(false);

  const handleOpenContacts = () => {
    setOpenContacts(true);
  };

  const handleCloseContacts = () => {
    setOpenContacts(false);
  };

  const handleKeyUpAddTask = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      if (name.trim() !== '') {
        onAddTask({
          ...defaultTask,
          id: uuidv4(),
          name,
          completed,
        });
      }
    }
  };

  const handleClickAddTask = () => {
    if (name) {
      onAddTask({
        ...defaultTask,
        id: uuidv4(),
        name,
        completed,
      });
    } else {
      onCloseAddTask();
    }
  };

  const handleChangeCompleted = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCompleted(event.target.checked);
  };

  return (
    <ClickAwayListener onClickAway={handleClickAddTask}>
      <div>
        <Paper variant="outlined">
          <InputBase
            multiline
            fullWidth
            placeholder="Task name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            onKeyUp={handleKeyUpAddTask}
            sx={{ px: 2, pt: 2 }}
          />

          <Stack direction="row" justifyContent="space-between" sx={{ pl: 1, pr: 1.5, pb: 2 }}>
            <Tooltip title="Mark complete">
              <Checkbox
                disableRipple
                checked={completed}
                onChange={handleChangeCompleted}
                icon={<Iconify icon="eva:radio-button-off-outline" />}
                checkedIcon={<Iconify icon="eva:checkmark-circle-2-outline" />}
              />
            </Tooltip>

            <Stack direction="row" spacing={1.5} alignItems="center">
              <Tooltip title="Assign" onClick={handleOpenContacts}>
                <IconButton size="small">
                  <Iconify icon="eva:people-fill" />
                </IconButton>
              </Tooltip>

            </Stack>
          </Stack>
        </Paper>

        <KanbanContactsDialog open={openContacts} onClose={handleCloseContacts} />

      </div>
    </ClickAwayListener>
  );
}
