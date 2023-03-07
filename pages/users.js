import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import Head from 'next/head';
import brand from '../public/text/brand';
import ManageUsersFrom from '../components/Forms/ManageUsers';
import Header from '../components/Header';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { useTheme } from '@material-ui/core/styles';

function ManageUsers(props) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));  
  const { onToggleDark, onToggleDir } = props;

  return (
    <Fragment>
      <Head>
        <title>
          { brand.saas.name }
          &nbsp; - Manage Users
        </title>
      </Head>
      <div>
        {isMobile && <Header onToggleDark={onToggleDark} onToggleDir={onToggleDir}/>}
        <ManageUsersFrom />
      </div>
    </Fragment>
  );
}

ManageUsers.getInitialProps = async () => ({
  namespacesRequired: ['common', 'saas-landing'],
});

ManageUsers.propTypes = {
  onToggleDark: PropTypes.func.isRequired,
  onToggleDir: PropTypes.func.isRequired,
};

export default ManageUsers;
