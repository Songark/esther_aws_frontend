import React, { Fragment, useEffect } from 'react';
import Head from 'next/head';
import brand from '../public/text/brand';
import CaptureFrame from '../components/Forms/Capture';
import Header from '../components/Header';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { useTheme } from '@material-ui/core/styles';
import PropTypes from 'prop-types';

function Capture(props) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { onToggleDark, onToggleDir } = props;

  return (
    <Fragment>
      <Head>
        <title>
          { brand.saas.name }
          &nbsp; - Capture
        </title>
      </Head>
      <div>
        {isMobile && <Header onToggleDark={onToggleDark} onToggleDir={onToggleDir}/>}
        <CaptureFrame/>
      </div>
    </Fragment>
  );
}

Capture.getInitialProps = async () => ({
  namespacesRequired: ['common', 'saas-landing'],
});

Capture.propTypes = {
  onToggleDark: PropTypes.func.isRequired,
  onToggleDir: PropTypes.func.isRequired,
};

export default Capture;
