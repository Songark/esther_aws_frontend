import React, { Fragment, useEffect } from 'react';
import PropTypes from 'prop-types';
import Head from 'next/head';
import brand from '../public/text/brand';
import LoginForm from '../components/Forms/Login';
import Header from '../components/Header';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { useTheme } from '@material-ui/core/styles';

function Login(props) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { onToggleDark, onToggleDir } = props;

  return (
    <Fragment>
      <Head>
        <title>
          { brand.saas.name }
          &nbsp; - Login
        </title>
      </Head>
      <div>
        {isMobile && <Header onToggleDark={onToggleDark} onToggleDir={onToggleDir}/>}
        <LoginForm />
      </div>
    </Fragment>
  );
}

Login.getInitialProps = async () => ({
  namespacesRequired: ['common', 'saas-landing'],
});

Login.propTypes = {
  onToggleDark: PropTypes.func.isRequired,
  onToggleDir: PropTypes.func.isRequired,
};

export default Login;
