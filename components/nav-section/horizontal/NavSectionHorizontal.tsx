import { memo } from 'react';
// @mui
import { Stack } from '@mui/material';
//
import { NavSectionProps, NavListProps } from '../types';
import NavList from './NavList';

export const hideScrollbarY = {
  msOverflowStyle: 'none',
  scrollbarWidth: 'none',
  overflowY: 'scroll',
  '&::-webkit-scrollbar': {
    display: 'none',
  },
} as const;

// ----------------------------------------------------------------------

function NavSectionHorizontal({ data, sx, ...other }: NavSectionProps) {
  return (
    <Stack
      direction="row"
      spacing={1}
      sx={{
        p: 2,
        mx: 'auto',
        ...hideScrollbarY,
        ...sx,
      }}
      {...other}
    >
      {data.map((group) => (
        <Items key={group.subheader} items={group.items} />
      ))}
    </Stack>
  );
}

export default memo(NavSectionHorizontal);

// ----------------------------------------------------------------------

type ItemsProps = {
  items: NavListProps[];
};

function Items({ items }: ItemsProps) {
  return (
    <>
      {items.map((list) => (
        <NavList key={list.title + list.path} data={list} depth={1} hasChild={!!list.children} />
      ))}
    </>
  );
}
