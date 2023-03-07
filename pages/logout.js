import React, { Fragment, useEffect } from 'react';
import Head from 'next/head';
import brand from '../public/text/brand';
import Header from '../components/Header';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { useTheme } from '@material-ui/core/styles';
import { GotoRoute } from "../libs/baseLib";
import { Auth } from "aws-amplify";
import routeLink from '~/public/text/link';

function Logout() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm')); 

  useEffect(() => {
    onLoad();
  }, []);

  async function onLoad() {
    try {      
      await Auth.signOut();
    }
    catch(e) {      
    }
    GotoRoute(routeLink.saas.home);
  }  
  
  return (
    <Fragment>
      <Head>
        <title>
          { brand.saas.name }
          &nbsp; - Logout
        </title>
      </Head>
      <div>
        {isMobile && <Header/>}
      </div>
    </Fragment>
  );
}

Logout.getInitialProps = async () => ({
  namespacesRequired: ['common', 'saas-landing'],
});

export default Logout;
