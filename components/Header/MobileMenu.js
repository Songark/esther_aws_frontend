import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import SwipeableDrawer from '@material-ui/core/SwipeableDrawer';
import Divider from '@material-ui/core/Divider';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import { withTranslation } from '~/i18n';
import routeLink from '~/public/text/link';
import useStyles from './header-style';
import navMenu from './menu';
import { useAppContext } from '../../libs/contextLib';

function MobileMenu(props) {
  const {currUserRole, cognitoUser, setNewUser} = useAppContext();
  const classes = useStyles();
  const { toggleDrawer, open, t } = props;
  const SideList = () => (
    <div
      className={classes.mobileNav}
      role="presentation"
      onClick={toggleDrawer}
      onKeyDown={toggleDrawer}
    >
      <div className={clsx(classes.menu, open && classes.menuOpen)}>
        <List component="nav">
          {currUserRole.indexOf('Admin') == -1 && navMenu.map((item, index) => (
            <ListItem
              button
              component="a"
              href={`/#${item}`}
              key={index.toString()}
              style={{ animationDuration: index * 0.15 + 's' }}
            >
              <ListItemText primary={t('common:saas-landing.header_' + item)} className={classes.menuList} />
            </ListItem>
          ))}
          {cognitoUser == null && <ListItem
            button
            component="a"
            href={routeLink.saas.contact}
            style={{ animationDuration: navMenu.length * 0.15 + 's' }}
          >
            <ListItemText primary={t('common:saas-landing.header_contact')} className={classes.menuList} />
          </ListItem>}

          {cognitoUser && currUserRole != 'Trainer' && <ListItem
            button
            component="a"
            href={routeLink.saas.chatbot}
            style={{ animationDuration: navMenu.length * 0.15 + 's' }}
          >
            <ListItemText primary={t('common:saas-landing.header_chatbot')} className={classes.menuList} />
          </ListItem>}
          {cognitoUser && currUserRole != 'Trainer' && <ListItem
            button
            component="a"
            href={routeLink.saas.upload}
            style={{ animationDuration: navMenu.length * 0.15 + 's' }}
          >
            <ListItemText primary={t('common:saas-landing.header_upload')} className={classes.menuList} />
          </ListItem>}
          {cognitoUser && currUserRole != 'User' && <ListItem
            button
            component="a"
            href={routeLink.saas.training}
            style={{ animationDuration: navMenu.length * 0.15 + 's' }}
          >
            <ListItemText primary={t('common:saas-landing.header_training')} className={classes.menuList} />
          </ListItem>}
          {cognitoUser && currUserRole != 'User' && <ListItem
            button
            component="a"
            href={routeLink.saas.capture}
            style={{ animationDuration: navMenu.length * 0.15 + 's' }}
          >
            <ListItemText primary={t('common:saas-landing.header_script')} className={classes.menuList} />
          </ListItem>}
          
          
          <Divider className={classes.dividerSidebar} />
          {cognitoUser == null && ['login', 'register'].map((item, index) => (
            <ListItem
              button
              component="a"
              href={routeLink.saas[item]}
              key={index.toString()}
              style={{ animationDuration: navMenu.length * 0.15 + 's' }}
            >
              <ListItemText primary={t('common:saas-landing.header_' + item)} className={classes.menuList} />
            </ListItem>
          ))}
          {cognitoUser && ['logout'].map((item, index) => (
            <ListItem
              button
              component="a"
              href={routeLink.saas[item]}
              key={index.toString()}
              style={{ animationDuration: navMenu.length * 0.15 + 's' }}
            >
              <ListItemText primary='Log out' className={classes.menuList} />
            </ListItem>
          ))}          
        </List>
      </div>
    </div>
  );

  return (
    <SwipeableDrawer
      open={open}
      onClose={toggleDrawer}
      onOpen={toggleDrawer}
      classes={{
        paper: classes.paperNav
      }}
    >
      <SideList />
    </SwipeableDrawer>
  );
}


MobileMenu.propTypes = {
  toggleDrawer: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  t: PropTypes.func.isRequired,
};

export default withTranslation(['saas-landing'])(MobileMenu);
