import { green, orange, red } from '@material-ui/core/colors';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import MenuItem from '@material-ui/core/MenuItem';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import ClearIcon from '@material-ui/icons/Clear';
import get from 'lodash-es/get';
import * as React from 'react';
import { RouteComponentProps } from 'react-router-dom';

import { Page } from 'src/domains/@common/Page';
import { IUser } from 'src/store/users';
import Select from './Select';

const src =
  'https://cache.harvestapp.com/assets/onboarding/landing-projects@2x-e00081706c6ce0b93cf18c21c6e488f1fc913045992fc34dd18e5e290bc971cb.png';

export interface IUsersProps {
  classes: any;
  deleteUser: any;
  findUserById: (id: number) => IUser;
  fetchUsers: any;
  patchUser: (data: { user: IUser; role: string }) => void;
  userList: IUser[];
}

export class Users extends React.Component<RouteComponentProps<{}> & IUsersProps, {}> {
  public componentDidMount() {
    this.props.fetchUsers();
  }

  // TODO: cover with tests!!!
  public handleRowClick = (id: number | undefined) => (event: React.MouseEvent) => {
    const isOpener = get(event, 'target.dataset.role') === 'opener';
    const isChangeRole = get(event, 'target.value');
    if (isOpener) {
      return;
    }
    if (isChangeRole && typeof id === 'number') {
      const user = this.props.findUserById(id);
      if (!user) {
        throw new Error(`Пользователь с id ${id} не был найден`);
      }
      this.props.patchUser({ user, role: get(event, 'target.value') });
      return;
    }
    console.log('press by row', id, event.target);
  };

  public handleRemoveClick = (id: number | undefined) => (e: any) => {
    e.stopPropagation();
    this.props.deleteUser(id);
  };

  public render() {
    const { classes, userList } = this.props;
    return (
      <Page>
        {userList && userList.length ? (
          <Table className={classes.table}>
            <TableHead>
              <TableRow>
                <TableCell>Email</TableCell>
                <TableCell>Телефон</TableCell>
                <TableCell numeric>Статус</TableCell>
                <TableCell className={classes.cell} numeric>
                  Способ получения средств
                </TableCell>
                <TableCell className={classes.cell}>Роль</TableCell>
                <TableCell style={{ width: 42 }} />
              </TableRow>
            </TableHead>
            <TableBody>
              {userList.map(({ id, email, tel, status, paymentMethod, role }) => {
                return (
                  <TableRow className={classes.row} key={id} hover onClick={this.handleRowClick(id)}>
                    <TableCell component="th" scope="row">
                      {email}
                    </TableCell>
                    <TableCell>{tel}</TableCell>
                    <TableCell numeric>{status}</TableCell>
                    <TableCell className={classes.cell} numeric>
                      {paymentMethod}
                    </TableCell>
                    <TableCell className={classes.cell}>
                      <Select
                        autoWidth
                        renderValue={this.renderSelectValue}
                        IconComponent={this.renderEmpty}
                        value={role}
                      >
                        <MenuItem value={'user'}>User</MenuItem>
                        <MenuItem value={'admin'}>Admin</MenuItem>
                        <MenuItem value={'super-admin'}>Super-Admin</MenuItem>
                      </Select>
                    </TableCell>
                    <TableCell>
                      <IconButton onClick={this.handleRemoveClick(id)}>
                        <ClearIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        ) : (
          <Grid item xs={12}>
            <img src={src} />
          </Grid>
        )}
      </Page>
    );
  }

  private renderEmpty() {
    return null;
  }

  private renderSelectValue(value: string) {
    const colors = {
      admin: orange['500'],
      user: green['500'],
      ['super-admin']: red.A700,
    };
    return (
      <div data-role={'opener'} style={{ backgroundColor: colors[value] }}>
        {value}
      </div>
    );
  }
}
