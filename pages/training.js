import React, { Fragment, useEffect } from 'react';
import Head from 'next/head';
import brand from '../public/text/brand';
import TrainingFrame from '../components/Forms/TrainingFrame';
import Header from '../components/Header';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { useTheme } from '@material-ui/core/styles';
import PropTypes from 'prop-types';

function Training(props) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { onToggleDark, onToggleDir } = props;

  return (
    <Fragment>
      <Head>
        <title>
          { brand.saas.name }
          &nbsp; - Training
        </title>
      </Head>
      <div>
        {isMobile && <Header onToggleDark={onToggleDark} onToggleDir={onToggleDir}/>}
        <TrainingFrame/>
      </div>
    </Fragment>
  );
}

Training.getInitialProps = async () => ({
  namespacesRequired: ['common', 'saas-landing'],
});

Training.propTypes = {
  onToggleDark: PropTypes.func.isRequired,
  onToggleDir: PropTypes.func.isRequired,
};

export default Training;
