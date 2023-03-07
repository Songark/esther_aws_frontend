import React, { Fragment, useEffect } from 'react';
import Head from 'next/head';
import brand from '../public/text/brand';
import ChatFrame from '../components/Forms/ChatFrame';
import Header from '../components/Header';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { useTheme } from '@material-ui/core/styles';
import PropTypes from 'prop-types';

function Chatbot(props) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { onToggleDark, onToggleDir } = props;

  return (
    <Fragment>
      <Head>
        <title>
          { brand.saas.name }
          &nbsp; - Chatbot
        </title>
      </Head>
      <div>
        {isMobile && <Header onToggleDark={onToggleDark} onToggleDir={onToggleDir}/>}
        <ChatFrame/>
      </div>
    </Fragment>
  );
}

Chatbot.getInitialProps = async () => ({
  namespacesRequired: ['common', 'saas-landing'],
});

Chatbot.propTypes = {
  onToggleDark: PropTypes.func.isRequired,
  onToggleDir: PropTypes.func.isRequired,
};

export default Chatbot;
