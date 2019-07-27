import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import React, { useCallback, useState } from 'react';
import Popover from 'react-popover';
import { WrappedFieldProps } from 'redux-form';

// import { ListBox } from 'liw-components/ListBox';
import { useStyles } from './styles';

import { IUser } from '@types';

export interface IPerformerFieldProps extends WrappedFieldProps {
  patchProjectTask: any;
  taskId: number;
  projectMembers: IUser[];
  children?: (count: number, onClick: () => void) => React.ReactNode;
}

export default function PerformerFieldTsx({ children, input, patchProjectTask, projectMembers }) {
  const [isOpen, setIsOpen] = useState(false);
  const handleOnClick = useCallback(() => setIsOpen(open => !open), [setIsOpen]);

  const classes = useStyles();

  const length = input.value.length || '0';

  return (
    <Popover
      preferPlace="below"
      isOpen={isOpen}
      onOuterAction={handleOnClick}
      className={classes.popover}
      enterExitTransitionDurationMs={400}
      body={<Paper className={classes.body}>test</Paper>}
    >
      {children ? children(length, handleOnClick) : <Button onClick={handleOnClick}>{length}</Button>}
    </Popover>
  );
}