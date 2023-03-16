import React, { useState } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import Hidden from '@material-ui/core/Hidden';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { useTheme } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Paper from '@material-ui/core/Paper';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Snackbar from '@material-ui/core/Snackbar';
import { ValidatorForm, TextValidator } from 'react-material-ui-form-validator';
import brand from '~/public/text/brand';
import logo from '~/public/images/saas-logo.png';
import routeLink from '~/public/text/link';
import { withTranslation } from '~/i18n';
import { useText } from '~/theme/common';
import useStyles from './form-style';

function Privacy(props) {
  const classes = useStyles();
  const text = useText();
  const { t } = props;
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [openNotif, setNotif] = useState(false);
  const handleSubmit = () => {
    setNotif(true);
  };

  const handleClose = () => {
    setNotif(false);
  };

  return (
    <div className={classes.pageWrap}>
      <Snackbar
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        key="top right"
        open={openNotif}
        autoHideDuration={4000}
        onClose={handleClose}
        ContentProps={{
          'aria-describedby': 'message-id',
        }}
        message={<span id="message-id">Message Sent</span>}
      />
      <Hidden mdUp>
        <div className={clsx(classes.logo, classes.logoHeader)}>
          {/* <a href={routeLink.saas.home}>
            <img src={logo} alt="logo" />
            <Typography component="span" className={text.title}>
              {brand.saas.projectName}
            </Typography>
          </a> */}
        </div>
      </Hidden>
      <Container maxWidth="md" className={classes.innerWrap}>
        <IconButton href={routeLink.saas.home} className={classes.backtohome}>
          <i className="ion-ios-home-outline" />
          <i className="ion-ios-arrow-thin-left" />
        </IconButton>
        <div className={classes.decoration}>
          <svg
            className={classes.leftDeco}
          >
            <use xlinkHref="/images/saas/deco-bg-left.svg#main" />
          </svg>
          <svg
            className={classes.rightDeco}
          >
            <use xlinkHref="/images/saas/deco-bg-right.svg#main" />
          </svg>
        </div>
        <Paper className={clsx(classes.formBox, 'fragment-fadeUp')}>
          <div className={classes.fullFromWrap}>
            <Typography
              variant="h3"
              align="center"
              className={clsx(classes.title, text.title)}
              gutterBottom
            >
              {t('common:privacy_title')}              
            </Typography>

            <Grid container spacing={6}>
              <Grid item xs={12}>
                <Typography
                  variant="h5"
                  align="left"
                  className={clsx(classes.title2, text.subtitle)}
                  gutterBottom
                >
                  {t('common:privacy_introduce')}                  
                </Typography>
                <Typography className={clsx(classes.title2, text.subtitle2)}>
                  {t('common:privacy_introduce_desc')}                  
                </Typography>     
              </Grid>
              <Grid item xs={12}>
                <Typography
                  variant="h5"
                  align="left"
                  className={clsx(classes.title2, text.subtitle)}
                  gutterBottom
                >
                  {t('common:privacy_personaldata')}                  
                </Typography>
                <Typography className={clsx(classes.title2, text.subtitle2)}>
                  {t('common:privacy_personaldata_desc')}                  
                </Typography>        
              </Grid>
              <Grid item xs={12}>
                <Typography
                  variant="h5"
                  align="left"
                  className={clsx(classes.title2, text.subtitle)}
                  gutterBottom
                >
                  {t('common:privacy_usernavigation')}                  
                </Typography>
                <Typography className={clsx(classes.title2, text.subtitle2)}>
                  {t('common:privacy_usernavigation_desc')}                  
                </Typography>        
              </Grid>
              <Grid item xs={12}>
                <Typography
                  variant="h5"
                  align="left"
                  className={clsx(classes.title2, text.subtitle)}
                  gutterBottom
                >
                  {t('common:privacy_cookies')}                  
                </Typography>
                <Typography className={clsx(classes.title2, text.subtitle2)}>
                  {t('common:privacy_cookies_desc')}                  
                </Typography>        
              </Grid>
              <Grid item xs={12}>
                <Typography
                  variant="h5"
                  align="left"
                  className={clsx(classes.title2, text.subtitle)}
                  gutterBottom
                >
                  {t('common:privacy_why_cookies')}                  
                </Typography>
                <Typography className={clsx(classes.title2, text.subtitle2)}>
                  {t('common:privacy_why_cookies_desc')}                  
                </Typography>        
              </Grid>
              <Grid item xs={12}>
                <Typography
                  variant="h5"
                  align="left"
                  className={clsx(classes.title2, text.subtitle)}
                  gutterBottom
                >
                  {t('common:privacy_when_cookies')}                  
                </Typography>
                <Typography className={clsx(classes.title2, text.subtitle2)}>
                  {t('common:privacy_when_cookies_desc')}                  
                </Typography>        
              </Grid>
              <Grid item xs={12}>
                <Typography
                  variant="h5"
                  align="left"
                  className={clsx(classes.title2, text.subtitle)}
                  gutterBottom
                >
                  {t('common:privacy_other_website')}                  
                </Typography>
                <Typography className={clsx(classes.title2, text.subtitle2)}>
                  {t('common:privacy_other_website_desc')}                  
                </Typography>        
              </Grid>
              <Grid item xs={12}>
                <Typography
                  variant="h5"
                  align="left"
                  className={clsx(classes.title2, text.subtitle)}
                  gutterBottom
                >
                  {t('common:privacy_amendments')}                  
                </Typography>
                <Typography className={clsx(classes.title2, text.subtitle2)}>
                  {t('common:privacy_amendments_desc')}                  
                </Typography>        
              </Grid>
              <Grid item xs={12}>
                <Typography className={clsx(classes.title2, text.subtitle2)}>
                  Copyright © 2019-{new Date().getFullYear()} {t('common:privacy_copyright')}                                    
                </Typography>
              </Grid>
              <Grid item xs={12}>

              </Grid>
            </Grid>            
          </div>
        </Paper>
      </Container>
    </div>
  );
}


Privacy.propTypes = {
  t: PropTypes.func.isRequired
};

export default withTranslation(['common'])(Privacy);
