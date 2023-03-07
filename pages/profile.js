import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import Head from 'next/head';
import brand from '../public/text/brand';
import ProfileForm from '../components/Forms/Profile';
import Header from '../components/Header';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { useTheme } from '@material-ui/core/styles';

function Profile(props) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));  
  const { onToggleDark, onToggleDir } = props;

  return (
    <Fragment>
      <Head>
        <title>
          { brand.saas.name }
          &nbsp; - Profile
        </title>
      </Head>
      <div>
        {isMobile && <Header onToggleDark={onToggleDark} onToggleDir={onToggleDir}/>}
        <ProfileForm />
      </div>
    </Fragment>
  );
}

Profile.getInitialProps = async () => ({
  namespacesRequired: ['common', 'saas-landing'],
});

Profile.propTypes = {
  onToggleDark: PropTypes.func.isRequired,
  onToggleDir: PropTypes.func.isRequired,
};

export default Profile;
