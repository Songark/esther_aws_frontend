import React, { useState, useEffect, Fragment } from 'react';
import PropTypes from 'prop-types';
import AppBar from '@material-ui/core/AppBar';
import Hidden from '@material-ui/core/Hidden';
import clsx from 'clsx';
import Button from '@material-ui/core/Button';
import Link from 'next/link';
import IconButton from '@material-ui/core/IconButton';
import Container from '@material-ui/core/Container';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { useTheme } from '@material-ui/core/styles';
import AnchorLink from 'react-anchor-link-smooth-scroll';
import Scrollspy from 'react-scrollspy';
import Settings from './Settings';
import MobileMenu from './MobileMenu';
import logo from '~/public/images/saas-logo.png';
import brand from '~/public/text/brand';
import link from '~/public/text/link';
import { withTranslation } from '~/i18n';
import useStyles from './header-style';
import navMenu from './menu';
import '~/vendors/hamburger-menu.css';

import { useAppContext } from '../../libs/contextLib';

let counter = 0;
function createData(name, url, offset) {
  counter += 1;
  return {
    id: counter,
    name,
    url,
    offset,
  };
}

const LinkBtn = React.forwardRef(function LinkBtn(props, ref) { // eslint-disable-line
  return <AnchorLink to={props.to} {...props} innerRef={ref} />; // eslint-disable-line
});

function Header(props) {
  const {currUserRole, cognitoUser, setNewUser} = useAppContext();

  const [fixed, setFixed] = useState(false);
  let flagFixed = false;
  
  const handleScroll = () => {
    const doc = document.documentElement;
    const scroll = (window.pageYOffset || doc.scrollTop) - (doc.clientTop || 0);
    const newFlagFixed = (scroll > 100);
    if (flagFixed !== newFlagFixed) {
      setFixed(newFlagFixed);
      flagFixed = newFlagFixed;
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
  }, []);
  
  const classes = useStyles();
  const theme = useTheme();
  const {
    onToggleDark,
    onToggleDir,
    invert,
    t
  } = props;
  const isDesktop = useMediaQuery(theme.breakpoints.up('lg'));
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [menuList] = useState([
    createData(navMenu[0], '#' + navMenu[0]),
    // createData(navMenu[1], '#' + navMenu[1])
  ]);
  const [openDrawer, setOpenDrawer] = useState(false);
  const handleOpenDrawer = () => {
    setOpenDrawer(!openDrawer);
  };

   return (
    <Fragment>
      { isMobile && (<MobileMenu open={openDrawer} toggleDrawer={handleOpenDrawer} />) }
      <AppBar
        component="header"
        position="relative"
        id="header"
        className={clsx(
          classes.header,
          fixed && classes.fixed,
          invert && classes.invert,
          openDrawer && classes.openDrawer
        )}
      >
        <Container fixed={isDesktop}>
          <div className={classes.headerContent}>
            <nav className={classes.navMenu}>
              { isMobile && (
                <IconButton
                  onClick={handleOpenDrawer}
                  className={clsx('hamburger hamburger--spin', classes.mobileMenu, openDrawer && 'is-active')}
                >
                  <span className="hamburger-box">
                    <span className={clsx(classes.bar, 'hamburger-inner')} />
                  </span>
                </IconButton>
              )}
              <div className={classes.logo}>
                {invert ? (
                  <Link href={link.saas.home}>
                    <a>
                      <img src={logo} alt="logo" />                      
                    </a>
                  </Link>
                ) : (
                  <Link href="/">
                    <a>
                      <img src={logo} alt="logo" />                                            
                    </a>
                  </Link>
                )} 
              </div>                  
              {isDesktop && (
                <Scrollspy
                  items={navMenu}
                  currentClassName="active"
                >
                  {currUserRole.indexOf('Admin') == -1 && menuList.map(item => (
                    <li key={item.id.toString()}>
                      {invert ? (
                        // eslint-disable-next-line
                        <Button offset={item.offset || 0} href={'/' + item.url}>
                          {t('common:saas-landing.header_' + item.name)}
                        </Button>
                      ) : (
                        <Button component={AnchorLink} offset={item.offset || 0} href={item.url}>
                          {t('common:saas-landing.header_' + item.name)}
                        </Button>
                      )}
                    </li>
                  ))}
                  {cognitoUser && currUserRole != 'Trainer' && (
                    <li>
                      <Button href={link.saas.chatbot}>
                        {t('common:saas-landing.header_chatbot')}
                      </Button>
                    </li>                    
                  )}
                  {cognitoUser && currUserRole != 'Trainer' && (
                    <li>
                      <Button href={link.saas.upload}>
                        {t('common:saas-landing.header_upload')}
                      </Button>
                    </li>
                  )}
                  {cognitoUser && (currUserRole == 'Trainer' || currUserRole.indexOf('Admin') >= 0) && (
                    <li>
                      <Button href={link.saas.training}>
                        {t('common:saas-landing.header_training')}
                      </Button>
                    </li>
                  )}   
                  {cognitoUser && (currUserRole == 'Trainer' || currUserRole.indexOf('Admin') >= 0) && (
                    <li>
                      <Button href={link.saas.capture}>
                        {t('common:saas-landing.header_script')}
                      </Button>
                    </li>
                  )}   
                  {cognitoUser == null && (
                    <li>
                      <Button href={link.saas.contact}>
                        {t('common:saas-landing.header_contact')}
                      </Button>
                    </li>
                  )}                
                </Scrollspy>
              )}
            </nav>
            <nav className={classes.navMenu}>
              <Hidden xsDown>
                {cognitoUser == null && (
                  <Button href={link.saas.login} className={classes.textBtn}>
                    {t('common:saas-landing.header_login')}
                  </Button>
                )}
                {cognitoUser == null && (
                  <Button href={link.saas.register} variant="contained" color="secondary" className={classes.button}>
                    {t('common:saas-landing.header_register')}
                  </Button>
                )}
                {cognitoUser != null && (
                  <Button href={link.saas.logout} variant="contained" color="secondary" className={classes.button}>
                    {t('common:saas-landing.header_logout')}
                    {/* Log Out */}
                  </Button>
                )}
              </Hidden>
              <Settings toggleDark={onToggleDark} toggleDir={onToggleDir} invert={invert} authUser={cognitoUser}/>
            </nav>
          </div>
        </Container>
      </AppBar>
    </Fragment>
  );
}

Header.propTypes = {
  onToggleDark: PropTypes.func.isRequired,
  onToggleDir: PropTypes.func.isRequired,
  invert: PropTypes.bool,
  t: PropTypes.func.isRequired,
};

Header.defaultProps = {
  sticky: false,
  invert: false
};

export default withTranslation(['saas-landing'])(Header);
