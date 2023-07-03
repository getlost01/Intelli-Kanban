import omit from 'lodash/omit';
import keyBy from 'lodash/keyBy';
import { createSlice, Dispatch } from '@reduxjs/toolkit';
import { useRouter } from 'next/router';
// utils
import axios from '../../src/utils/axios';
// @types
import { IKanbanState, IKanbanCard, IKanbanColumn } from '../../@types/kanban';

// ----------------------------------------------------------------------

const initialState: IKanbanState = {
  isLoading: false,
  error: null,
  boardId: null,
  board: {
    cards: {},
    columns: {},
    columnOrder: [],
  },
};

const slice = createSlice({
  name: 'kanban',
  initialState,
  reducers: {
    // START LOADING
    startLoading(state) {
      state.isLoading = true;
    },

    setBoardId(state, action) {
      state.boardId = action.payload;
    },

    stopLoading(state) {
      state.isLoading = false;
    },


    // HAS ERROR
    hasError(state, action) {
      state.isLoading = false;
      state.error = action.payload;
    },

    // GET BOARD
    getBoardSuccess(state, action) {
      state.isLoading = false;
      const board = action.payload;
      const cards = keyBy(board.cards, 'id');
      const columns = keyBy(board.columns, 'id');
      const { columnOrder } = board;

      state.board = {
        cards,
        columns,
        columnOrder,
      };
    },

    // CREATE NEW COLUMN
    createColumnSuccess(state, action) {
      const newColumn = action.payload;
      state.isLoading = false;
      state.board.columns = {
        ...state.board.columns,
        [newColumn.id]: newColumn,
      };
      state.board.columnOrder.push(newColumn.id);
      axios.post('/api/board/update', { id: state.boardId, board: state.board  });
    },

    persistCard(state, action) {
      const columns = action.payload;
      state.board.columns = columns;
      axios.post('/api/board/update', { id: state.boardId, board: state.board  });
    },

    persistColumn(state, action) {
      state.board.columnOrder = action.payload;
      axios.post('/api/board/update', { id: state.boardId, board: state.board  });
    },

    addTask(state, action) {
      const { card, columnId } = action.payload;

      state.board.cards[card.id] = card;
      state.board.columns[columnId].cardIds.push(card.id);
      axios.post('/api/board/update', { id: state.boardId, board: state.board  });
    },

    deleteTask(state, action) {
      const { cardId, columnId } = action.payload;

      state.board.columns[columnId].cardIds = state.board.columns[columnId].cardIds.filter(
        (id) => id !== cardId
      );

      state.board.cards = omit(state.board.cards, [cardId]);
      axios.post('/api/board/update', { id: state.boardId, board: state.board  });
    },

    // UPDATE COLUMN
    updateColumnSuccess(state, action) {
      const column = action.payload;

      state.isLoading = false;
      state.board.columns[column.id] = column;
      axios.post('/api/board/update', { id: state.boardId, board: state.board  });
    },

    // DELETE COLUMN
    deleteColumnSuccess(state, action) {
      const { columnId } = action.payload;
      const deletedColumn = state.board.columns[columnId];

      state.isLoading = false;
      state.board.columns = omit(state.board.columns, [columnId]);
      state.board.cards = omit(state.board.cards, [...deletedColumn.cardIds]);
      state.board.columnOrder = state.board.columnOrder.filter((c) => c !== columnId);
      axios.post('/api/board/update', { id: state.boardId, board: state.board  });
    },
    
      // MARK AS COMPLETED
      marksAsComplete(state, action) {
        var { card } = action.payload;
        state.board.cards[card.id].completed = !card.completed;
        axios.post('/api/board/update', { id: state.boardId, board: state.board  });
      },

      // Update Task
      updateTask(state, action) {
          var { card, name, description, assignee, taskBreakdown, completed, priority} = action.payload;
          state.board.cards[card.id].description = description;
          state.board.cards[card.id].name = name;
          state.board.cards[card.id].assignee = assignee;
          state.board.cards[card.id].taskBreakdown = taskBreakdown;
          state.board.cards[card.id].completed = completed;
          state.board.cards[card.id].priority = priority;
          axios.post('/api/board/update', { id: state.boardId, board: state.board  });
      },

      // Update Card
      updateCard(state, action) {
        var { card , taskName } = action.payload;
        state.board.cards[card.id].name = taskName;
        axios.post('/api/board/update', { id: state.boardId, board: state.board  });
      },

      // Update Card
      updateColumnName(state, action) {
          var { columnId , newName } = action.payload;
          state.board.columns[columnId].name = newName;
          console.log(newName);
          axios.post('/api/board/update', { id: state.boardId, board: state.board  });
      },

  },
});

// Reducer
export default slice.reducer;

export const { actions } = slice;

// ----------------------------------------------------------------------

export function getBoard(kanbanId: string) {;
  return async (dispatch: Dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get(`api/board/${kanbanId}`);
      dispatch(slice.actions.getBoardSuccess(response.data.boarddata.board));
      dispatch(slice.actions.setBoardId(response.data.boarddata.id));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    } finally {
      dispatch(slice.actions.stopLoading());
    }
  };
}

// ----------------------------------------------------------------------

export function createColumn(newColumn: { name: string }) {
  return async (dispatch: Dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.post('/api/column/create', newColumn);
      dispatch(slice.actions.createColumnSuccess(response.data.column));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

// ----------------------------------------------------------------------

export function updateColumn(columnId: string, column: IKanbanColumn) {
  return async (dispatch: Dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.post('/api/kanban/columns/update', {
        columnId,
        column,
      });
      dispatch(slice.actions.updateColumnSuccess(response.data.column));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

// ----------------------------------------------------------------------

export function deleteColumn(columnId: string) {
  return async (dispatch: Dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      dispatch(slice.actions.deleteColumnSuccess({ columnId }));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

// ----------------------------------------------------------------------

export function persistColumn(newColumnOrder: string[]) {
  return (dispatch: Dispatch) => {
    dispatch(slice.actions.persistColumn(newColumnOrder));
  };
}

// ----------------------------------------------------------------------

export function persistCard(columns: Record<string, IKanbanColumn>) {
  return (dispatch: Dispatch) => {
    dispatch(slice.actions.persistCard(columns));
  };
}

// ----------------------------------------------------------------------

export function addTask({ card, columnId }: { card: Partial<IKanbanCard>; columnId: string }) {
  return (dispatch: Dispatch) => {
    dispatch(slice.actions.addTask({ card, columnId }));
  };
}

// ----------------------------------------------------------------------

export function deleteTask({ cardId, columnId }: { cardId: string; columnId: string }) {
  return (dispatch: Dispatch) => {
    dispatch(slice.actions.deleteTask({ cardId, columnId }));
  };
}

// ----------------------------------------------------------------------

export function marksAsComplete({ card }: { card: Partial<IKanbanCard> }) {
  return (dispatch: Dispatch) => {
    dispatch(slice.actions.marksAsComplete({ card }));
  };
}

// ----------------------------------------------------------------------
export function updateTask({ card, name, description, assignee, taskBreakdown, completed, priority }: { card: Partial<IKanbanCard>; name: string; description: any; assignee: any; taskBreakdown: string; completed: boolean; priority: string }) {
  return (dispatch: Dispatch) => {
    dispatch(slice.actions.updateTask({ card, name, description, assignee, taskBreakdown, completed, priority }));
  };
}

// ----------------------------------------------------------------------

export function updateCard({ card , taskName }: { card: Partial<IKanbanCard>; taskName: string }) {
  return (dispatch: Dispatch) => {
    dispatch(slice.actions.updateCard({ card ,taskName }));
  };
}

// ----------------------------------------------------------------------

export function updateColumnName({ columnId , newName }: { columnId: string; newName: string }) {
  return (dispatch: Dispatch) => {
    dispatch(slice.actions.updateColumnName({ columnId ,newName }));
  };
}