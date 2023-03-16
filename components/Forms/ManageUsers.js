import React, { useRef, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { lighten, makeStyles } from '@material-ui/core/styles';
import { Grid, CircularProgress, Button, Typography, useMediaQuery, useTheme, FormControlLabel, Checkbox} from '@material-ui/core';
import { Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, TableSortLabel, Toolbar, IconButton, Paper, Tooltip, Switch } from '@material-ui/core'
import Icon from '@material-ui/core/Icon';
import clsx from 'clsx';
import { ValidatorForm, TextValidator } from 'react-material-ui-form-validator';
import { withTranslation } from '~/i18n';
import routeLink from '~/public/text/link';
import SocialAuth from './SocialAuth';
import Title from '../Title/TitleSecondary';
import AuthFrame from './AuthFrame';
import useStyles from './form-style';
import imgAPI from '~/public/images/imgAPI';
import { CountryDropdown, RegionDropdown, CountryRegionData } from 'react-country-region-selector';
import { Auth } from 'aws-amplify';
import config from "../../config";
import { getUserRole, getUsersList, updateUserRole } from "../../libs/awsLib";
import { GotoRoute } from "../../libs/baseLib";
import MessageBox from '../Notification/MessageBox'
import { GestureOutlined } from '@material-ui/icons';
import DeleteIcon from '@material-ui/icons/Delete';
import FilterListIcon from '@material-ui/icons/FilterList';

const table_rows = [];
function createData(userid, email, name, role) {
  table_rows.push({ userid, email, name, role });
}

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

const headCells = [  
  { id: 'email', numeric: false, disablePadding: true, label: 'Email' },
  { id: 'name', numeric: false, disablePadding: false, label: 'User Name' },
  { id: 'role', numeric: false, disablePadding: false, label: 'Role' },
];

function EnhancedTableHead(props) {
  const { classes, order, orderBy, numSelected, rowCount, onRequestSort } = props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        <TableCell padding="checkbox">
          <Checkbox
            indeterminate={numSelected > 0 && numSelected < rowCount}
            checked={rowCount > 0 && numSelected === rowCount}
            inputProps={{ 'aria-label': 'select all desserts' }}
          />
        </TableCell>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? 'right' : 'left'}
            padding={headCell.disablePadding ? 'none' : 'default'}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : 'asc'}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <span className={classes.visuallyHidden}>
                  {/* {order === 'desc' ? 'sorted descending' : 'sorted ascending'} */}
                </span>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

EnhancedTableHead.propTypes = {
  classes: PropTypes.object.isRequired,
  numSelected: PropTypes.number.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  order: PropTypes.oneOf(['asc', 'desc']).isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired,
};

const useToolbarStyles = makeStyles((theme) => ({
  root: {
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(1),
  },
  highlight:
    theme.palette.type === 'light'
      ? {
          color: theme.palette.secondary.main,
          backgroundColor: lighten(theme.palette.secondary.light, 0.85),
        }
      : {
          color: theme.palette.text.primary,
          backgroundColor: theme.palette.secondary.dark,
        },
  title: {
    flex: '1 1 100%',
  },
}));

const EnhancedTableToolbar = (props) => {
  const classes = useToolbarStyles();
  const { numSelected } = props;

  return (
    <Toolbar
      className={clsx(classes.root, {
        [classes.highlight]: numSelected > 0,
      })}
    >
      {numSelected > 0 ? (
        <Typography className={classes.title} color="inherit" variant="subtitle1" component="div">
          Users List ({numSelected} selected)
        </Typography>
      ) : (
        <Typography className={classes.title} variant="h6" id="tableTitle" component="div">
          Users List
        </Typography>
      )}      
    </Toolbar>
  );
};

EnhancedTableToolbar.propTypes = {
  numSelected: PropTypes.number.isRequired,
};

const user_roles = ['Super Admin', 'Admin', 'Trainer', 'User'];

function ManageUsers(props) {
  const [cognitoUser, setNewUser] = useState(null);
  const [userRole, setUserRole] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const classes = useStyles();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));  
  const {t} = props;
  const [msgBox, showMsgBox] = useState(false);
  const [msgTitle, setMsgTitle] = useState("");
  const [msgContent, setMsgContent] = useState("");

  const [order, setOrder] = React.useState('asc');
  const [orderBy, setOrderBy] = React.useState('calories');
  const [selected, setSelected] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [dense, setDense] = React.useState(false);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [tablerows, setTableRows] = useState([]);

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleClick = (event, name) => {    
    const selectedIndex = selected.indexOf(name);
    let newSelected = [];
    newSelected.push(name);
    setSelected(newSelected);    
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleChangeDense = (event) => {
    setDense(event.target.checked);
  };

  const isSelected = (name) => selected.indexOf(name) !== -1;

  const emptyRows = rowsPerPage - Math.min(rowsPerPage, tablerows.length - page * rowsPerPage);


  function showMessageBox(title, message)
  {
    setMsgTitle(title);
    setMsgContent(message);
    showMsgBox(true);
  }

  function handleCloseMessageBox()
  {
    showMsgBox(false);
    setMsgTitle("");
    setMsgContent("");
  }

  async function handleUpdateRole()
  {    
    if (cognitoUser && selected.length > 0) {      
      var user_email = selected[0];
      var user_id = '';
      var user_role = document.getElementById('select-role').value;      
      for (var i = 0; i < table_rows.length; i++) {        
        if (table_rows[i].email == user_email) {
          user_id = table_rows[i].userid;
          var message = await updateUserRole(cognitoUser, user_id, user_role);
          showMessageBox('Alert', message);
          if (message.toLocaleLowerCase().indexOf('success') >= 0) {
            tablerows.forEach(onerow => {
              if (onerow.userid == user_id) {
                onerow.role = user_role;
              }
            });
          }          
          break;
        }
      }  
    }
  }

  function validateForm() {
    return true;
  }

  function isPossibleManageUsers()
  {
    if (userRole.toLowerCase() == 'superadmin' || userRole.toLowerCase() == 'admin')
      return true;

    return false;
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setIsLoading(true);   
    setIsLoading(false);
  }

  async function updateUsersList(currUser)
  {
    table_rows.length = 0;
    var recv_users = await getUsersList(currUser);
    for (var i = 0; i < recv_users.length; i++) {
      if (recv_users[i].length >= 4)
        createData(recv_users[i][0], recv_users[i][1], recv_users[i][2], recv_users[i][3]);
    }
    setTableRows(table_rows);
  }

  async function onLoad() {    
    try {
      await Auth.currentSession();      
      const currUser = await Auth.currentUserPoolUser();
      const roleUser = await getUserRole(currUser);      
      setNewUser(currUser); 
      setUserRole(roleUser);
      updateUsersList(currUser);
    }
    catch(e) {   
      console.log(e);
    }
  }
  
  useEffect(() => {        
    onLoad();
  }, []);
  
  function renderForm() {
    return (      
      <div>
        {msgBox && <MessageBox title={msgTitle} message={msgContent} onClose={handleCloseMessageBox}/>}
        <div className={classes.head}>
          <Title align={isMobile ? 'center' : 'left'}>{t('common:manage_users')}</Title>          
        </div>
        <Paper className={classes.paper}>
          <EnhancedTableToolbar numSelected={selected.length} />
          <TableContainer>
            <Table
              className={classes.table}
              aria-labelledby="tableTitle"
              size={dense ? 'small' : 'medium'}
              aria-label="enhanced table"
            >
              <EnhancedTableHead
                classes={classes}
                numSelected={selected.length}
                order={order}
                orderBy={orderBy}
                onRequestSort={handleRequestSort}
                rowCount={tablerows.length}
              />
              <TableBody>
                {stableSort(tablerows, getComparator(order, orderBy))
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row, index) => {
                    const isItemSelected = isSelected(row.email);
                    const labelId = `enhanced-table-checkbox-${index}`;
                    return (
                      <TableRow
                        hover
                        onClick={(event) => handleClick(event, row.email)}
                        role="checkbox"
                        aria-checked={isItemSelected}
                        tabIndex={-1}
                        key={row.email}
                        selected={isItemSelected}
                      >
                        <TableCell padding="checkbox">
                          <Checkbox
                            checked={isItemSelected}
                            inputProps={{ 'aria-labelledby': labelId }}
                          />
                        </TableCell>
                        <TableCell component="th" id={labelId} scope="row" padding="none">
                          {row.email}
                        </TableCell>
                        <TableCell align="left">{row.name}</TableCell>
                        <TableCell align="left">{row.role}</TableCell>
                      </TableRow>
                    );
                  })}
                {emptyRows > 0 && (
                  <TableRow style={{ height: (dense ? 33 : 53) * emptyRows }}>
                    <TableCell colSpan={6} />
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={tablerows.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onChangePage={handleChangePage}
            onChangeRowsPerPage={handleChangeRowsPerPage}
          />    
        </Paper>        
        <Grid container spacing={3}>
          <Grid item xs={12}>
          </Grid>
          <Grid item md={3} xs={12}>  
            <Typography className={classes.profile_dark}>
              New Role
            </Typography>   
          </Grid>
          <Grid item md={4} xs={12}>  
            <select className = {classes.userrole} id="select-role">    
              {user_roles.map((user_role) => (
                <option key={user_role} value={user_role}>
                  {user_role}
                </option>
              ))}          
            </select> 
          </Grid>
          <Grid item md={5} xs={12}>  
            <Button variant="contained" fullWidth color="secondary" size="large" onClick={() => {handleUpdateRole();}} 
              disabled={selected.length == 0}>                  
              Update Role                            
            </Button>
          </Grid>
        </Grid>
      </div>    
    );
  }

  return (
    <AuthFrame title={t('common:manageusers_title')} subtitle={t('common:manageusers_subtitle')}  userr={userRole}>
      {renderForm()}
    </AuthFrame>
  );
}


ManageUsers.propTypes = {
  t: PropTypes.func.isRequired
};

export default withTranslation(['common'])(ManageUsers);
