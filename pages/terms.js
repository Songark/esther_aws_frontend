import React, { Fragment } from 'react';
import Head from 'next/head';
import brand from '../public/text/brand';
import TermsFrm from '../components/Forms/Terms';
import Header from '../components/Header';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { useTheme } from '@material-ui/core/styles';
import PropTypes from 'prop-types';

function Terms(props) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));  
  const { onToggleDark, onToggleDir } = props;

  return (
    <Fragment>
      <Head>
        <title>
          { brand.saas.name }
          &nbsp; - Terms
        </title>
      </Head>
      <div>
        {isMobile && <Header onToggleDark={onToggleDark} onToggleDir={onToggleDir}/>}
        <TermsFrm />
      </div>
    </Fragment>
  );
}

Terms.getInitialProps = async () => ({
  namespacesRequired: ['common', 'saas-landing'],
});

Terms.propTypes = {
  onToggleDark: PropTypes.func.isRequired,
  onToggleDir: PropTypes.func.isRequired,
};

export default Terms;
