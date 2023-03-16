import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import Hidden from '@material-ui/core/Hidden';
import IconButton from '@material-ui/core/IconButton';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import brand from '~/public/text/brand';
import routerLink from '~/public/text/link';
import logo from '~/public/images/saas-logo.png';
import { useText } from '~/theme/common';
import useStyles from './form-style';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { useTheme } from '@material-ui/core/styles';
import PcMenu from './PcMenu';

function AuthFrame(props) {
  const classes = useStyles();
  const text = useText();
  const { children, title, subtitle, userr } = props;

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <div className={isMobile ? classes.pageWrap : classes.pageWrapLight}>
      <Hidden mdUp>
        <div className={clsx(classes.logo, classes.logoHeader)}>
          {/* <img src={logo} alt="logo" /> */}
          <Typography component="p" className={text.subtitle2}>
            {/* {brand.saas.projectName} */}
            <br></br><br></br>
          </Typography>         
        </div>
      </Hidden>
      <Container maxWidth="lg" className={classes.innerWrap}>
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
          <div className={classes.authFrame}>
            <PcMenu parent='auth' userr={userr}/>
          </div> 
          <div className={classes.authFramePad}>       
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <div className={classes.authFrame}>
                  <Grid container spacing={0}>
                    <Grid item md={5} xs={12}>
                      <Hidden smDown>
                        <div className={classes.greeting}>
                          {/* <div className={classes.logo}>
                            <img src={logo} alt="logo" />
                            <Typography className={text.subtitle2}>
                              {brand.saas.projectName}
                            </Typography>
                          </div> */}
                          <Typography gutterBottom variant="h4" className={classes.title2_dark}>
                            { title }
                          </Typography>
                          <Typography variant="h6" className={classes.title2_dark}>
                            { subtitle }
                          </Typography>
                        </div>
                      </Hidden>
                    </Grid>
                    <Grid item md={7} xs={12}>
                      <div className={classes.formWrap}>
                        {children}
                      </div>
                    </Grid>
                  </Grid>
                </div>
              </Grid>
            </Grid>      
          </div>    
        </Paper>
      </Container>
    </div>
  );
}

AuthFrame.propTypes = {
  children: PropTypes.node.isRequired,
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.string,
  userr: PropTypes.string.isRequired,
};

AuthFrame.defaultProps = {
  subtitle: '',
};

export default AuthFrame;
