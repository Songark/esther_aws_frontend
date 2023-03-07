import React, { Fragment } from 'react';
import Head from 'next/head';
import brand from '../public/text/brand';
import ContactFrm from '../components/Forms/Contact';
import Header from '../components/Header';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { useTheme } from '@material-ui/core/styles';
import PropTypes from 'prop-types';

function Contact(props) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { onToggleDark, onToggleDir } = props;

  return (
    <Fragment>
      <Head>
        <title>
          { brand.saas.name }
          &nbsp; - Contact
        </title>
      </Head>
      <div>
        {isMobile && <Header onToggleDark={onToggleDark} onToggleDir={onToggleDir}/>}
        <ContactFrm />
      </div>
    </Fragment>
  );
}

Contact.getInitialProps = async () => ({
  namespacesRequired: ['common', 'saas-landing'],
});

Contact.propTypes = {
  onToggleDark: PropTypes.func.isRequired,
  onToggleDir: PropTypes.func.isRequired,
};

export default Contact;
