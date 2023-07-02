import { useEffect } from 'react';
// next
import Head from 'next/head';
// @mui
import { Container, Stack } from '@mui/material';
import { DragDropContext, Droppable, DropResult } from '@hello-pangea/dnd';
import { useRouter } from 'next/router';
// redux
import { useDispatch, useSelector } from '../../redux/store';
import { getBoard, persistColumn, persistCard } from '../../redux/slices/kanban';

import { Card, Toolbar } from '@mui/material';
import Iconify from '../../components/iconify';
import CustomBreadcrumbs from '../../components/custom-breadcrumbs';
import { SkeletonKanbanColumn } from '../../components/skeleton';
import { KanbanColumn, KanbanColumnAdd } from '../../components/kanban';
import Navbar from '../../components/nav-section/horizontal/NavSectionHorizontal';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
// utils
import axios from '../../src/utils/axios';

// ----------------------------------------------------------------------
// Custom CSS
const hideScrollbarX = {
  msOverflowStyle: 'none',
  scrollbarWidth: 'none',
  overflowX: 'scroll',
  '&::-webkit-scrollbar': {
    display: 'none',
  },
} as const;

// ----------------------------------------------------------------------

KanbanPage.getLayout = (page: React.ReactElement) => {page};

// ----------------------------------------------------------------------

export default function KanbanPage() {
  const dispatch = useDispatch();

  const router = useRouter();
  const { query } = router;
  const { board } = useSelector((state) => state.kanban);

  useEffect(() => {
    const { id } = query;

    if(!localStorage.getItem('userId'))
      router.push("/login");
    
    let kanbanId: any;

    if(!id || id === 'recent' || id === 'welcome'){
      kanbanId = localStorage.getItem('kanbanId');
    }else{
      kanbanId = id;
    }
    if(!kanbanId){
      router.push("/404");
    }
    console.log(kanbanId);
    dispatch(getBoard(kanbanId));
  }, [dispatch]);


  const onDragEnd = (result: DropResult) => {
    toast.success('Drag and Drop Success');
    const { destination, source, draggableId, type } = result;

    if (!destination) return;

    if (destination.droppableId === source.droppableId && destination.index === source.index)
      return;

    if (type === 'column') {
      const newColumnOrder: any = Array.from(board.columnOrder);

      newColumnOrder.splice(source.index, 1);

      newColumnOrder.splice(destination.index, 0, draggableId);

      dispatch(persistColumn(newColumnOrder));
      return;
    }

    const start = board.columns[source.droppableId];
    const finish = board.columns[destination.droppableId];

    if (start.id === finish.id) {
      const updatedCardIds = [...start.cardIds];

      updatedCardIds.splice(source.index, 1);

      updatedCardIds.splice(destination.index, 0, draggableId);

      const updatedColumn = {
        ...start,
        cardIds: updatedCardIds,
      };

      dispatch(
        persistCard({
          ...board.columns,
          [updatedColumn.id]: updatedColumn,
        })
      );
      return;
    }

    const startCardIds = [...start.cardIds];

    startCardIds.splice(source.index, 1);

    const updatedStart = {
      ...start,
      cardIds: startCardIds,
    };

    const finishCardIds = [...finish.cardIds];

    finishCardIds.splice(destination.index, 0, draggableId);

    const updatedFinish = {
      ...finish,
      cardIds: finishCardIds,
    };

    dispatch(
      persistCard({
        ...board.columns,
        [updatedStart.id]: updatedStart,
        [updatedFinish.id]: updatedFinish,
      })
    );
  };

  return (
    <>
      <Head>
        <title> | Intelli - Kanban </title>
      </Head>
      
      <ToastContainer />

      <Toolbar sx={{
        position: 'sticky',
        top: 0,
        backgroundColor: "white",
        boxShadow: "0 0 0.5rem #ddd",
      }}>
          <Navbar data={NAV_ITEMS} />
      </Toolbar>

      <Container maxWidth={false} sx={{ height: 1 }}>
        <CustomBreadcrumbs
          heading="Kanban"
          links={[
            {
              name: 'Home',
              href: '/',
            },
            { name: 'Kanban' },
          ]}
          sx = {{p:3}}
        />

        <ToastContainer />
        
        <Card sx={{p:3, boxShadow: "0 0 0.5rem #ddd"}}>
            <DragDropContext onDragEnd={onDragEnd}>
              <Droppable droppableId="all-columns" direction="horizontal" type="column">
                {(provided) => (
                  <Stack
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    spacing={3}
                    direction="row"
                    alignItems="flex-start"
                    sx={{
                      height: 1,
                      overflowY: 'hidden',
                      ...hideScrollbarX,
                    }}
                  >
                    {!board.columnOrder.length ? (
                      <SkeletonKanbanColumn />
                    ) : (
                      board.columnOrder.map((columnId: any, index: any) => (
                        <KanbanColumn
                          index={index}
                          key={columnId}
                          column={board.columns[columnId]}
                          cards={board.cards}
                        />
                      ))
                    )}

                    {provided.placeholder}
                    <KanbanColumnAdd />
                  </Stack>
                )}
              </Droppable>
            </DragDropContext>
        </Card>

      </Container>
    </>
  );
}

const NAV_ITEMS = [
  {
    subheader: 'Marketing',
    items: [
      {
        title: 'Github',
        path: '#',
        icon: <Iconify icon="bi:github" />,
      },
      {
        title: 'Linkedin',
        path: '#',
        icon: <Iconify icon="circum:linkedin" />,
      },
      {
        title: 'Case Studies',
        path: '#',
        icon: <Iconify icon="carbon:3d-cursor-alt" />,
        children: [
          { title: 'Case Studies', path: '#' },
          { title: 'Case Study', path: '#' },
        ],
      },
      {
        title: 'Blog',
        path: '#',
        icon: <Iconify icon="carbon:3d-mpr-toggle" />,
        children: [
          { title: 'Blog Posts', path: '#' },
          { title: 'Blog Post', path: '#' },
        ],
      },
      {
        title: 'About',
        path: '#',
        icon: <Iconify icon="carbon:airport-01" />,
      },
      {
        title: 'Contact',
        path: '#',
        icon: <Iconify icon="carbon:battery-full" />,
      },
      {
        title: 'Tours',
        path: '#',
        icon: <Iconify icon="carbon:basketball" />,
        children: [
          { title: 'Tours', path: '#' },
          { title: 'Tour', path: '#' },
        ],
      },
      {
        title: 'Checkout',
        path: '#',
        icon: <Iconify icon="carbon:area" />,
        children: [
          { title: 'Checkout', path: '#' },
          { title: 'Checkout Complete', path: '#' },
        ],
      },
    ],
  },
  {
    subheader: 'Travel',
    items: [
      {
        title: 'Level 1',
        path: '#',
        icon: <Iconify icon="carbon:play" />,
        children: [
          { title: 'Level 2.1', path: '#' },
          { title: 'Level 2.2', path: '#' },
          {
            title: 'Level 2.3',
            path: '#',
            children: [
              { title: 'Level 3.1', path: '#' },
              { title: 'Level 3.2', path: '#' },
            ],
          },
        ],
      },
    ],
  },
];
