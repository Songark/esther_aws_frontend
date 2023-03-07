import React, { Fragment } from 'react';
import Head from 'next/head';
import brand from '../public/text/brand';
import RegisterForm from '../components/Forms/Register';
import Header from '../components/Header';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { useTheme } from '@material-ui/core/styles';
import PropTypes from 'prop-types';

function Register(props) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));  
  const { onToggleDark, onToggleDir } = props;

  return (
    <Fragment>
      <Head>
        <title>
          { brand.saas.name }
          &nbsp; - Register
        </title>
      </Head>
      <div>
      {isMobile && <Header onToggleDark={onToggleDark} onToggleDir={onToggleDir}/>}
        <RegisterForm />
      </div>
    </Fragment>
  );
}

Register.getInitialProps = async () => ({
  namespacesRequired: ['common', 'saas-landing'],
});

Register.propTypes = {
  onToggleDark: PropTypes.func.isRequired,
  onToggleDir: PropTypes.func.isRequired,
};

export default Register;
