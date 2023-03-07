import React, { Fragment } from 'react';
import Head from 'next/head';
import brand from '../public/text/brand';
import PrivacyFrm from '../components/Forms/Privacy';
import PropTypes from 'prop-types';
import Header from '../components/Header';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { useTheme } from '@material-ui/core/styles';

function Privacy(props) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));  
  const { onToggleDark, onToggleDir } = props;

  return (
    <Fragment>
      <Head>
        <title>
          { brand.saas.name }
          &nbsp; - Privacy
        </title>
      </Head>
      <div>
        {isMobile && <Header onToggleDark={onToggleDark} onToggleDir={onToggleDir}/>}
        <PrivacyFrm />
      </div>
    </Fragment>
  );
}

Privacy.getInitialProps = async () => ({
  namespacesRequired: ['common', 'saas-landing'],
});

Privacy.propTypes = {
  onToggleDark: PropTypes.func.isRequired,
  onToggleDir: PropTypes.func.isRequired,
};

export default Privacy;
