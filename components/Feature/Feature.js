import React, { Fragment, useState } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { Parallax, ParallaxProvider } from 'react-scroll-parallax';
import Container from '@material-ui/core/Container';
import Hidden from '@material-ui/core/Hidden';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { useTheme } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import ReactWOW from 'react-wow';
import Grid from '@material-ui/core/Grid';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import { withTranslation } from '~/i18n';
import { useTextAlign, useText } from '~/theme/common';
import imgAPI from '~/public/images/imgAPI';
import ParallaxMedium from '../Parallax/Medium';
import ParallaxLarge from '../Parallax/Large';
import Title from '../Title';
import useStyles from './feature-style';

function Feature(props) {
  const classes = useStyles();
  const text = useText();
  const align = useTextAlign();
  const theme = useTheme();

  const [value, setValue] = useState(0);
  const { t } = props;
  const isDesktop = useMediaQuery(theme.breakpoints.up('lg'));
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <div className={classes.root}>
      <div className={classes.decoration}>
        <svg
          className={classes.wave}
        >
          <use xlinkHref="/images/saas/deco-bg.svg#main" />
        </svg>
      </div>
      <Container fixed={isDesktop}>
        <ParallaxProvider>
          <div className={classes.item}>
            <Grid container direction={isMobile ? 'column-reverse' : 'row'}>
              <Grid item md={4} xs={12}>
                <ReactWOW animation="fadeInLeftShort" offset={-100} delay="0.2s" duration="0.4s">
                    <div>
                      <Title align={isMobile ? 'center' : 'left'}>
                        {t('common:saas-landing.feature_title1')}
                        &nbsp;
                        <strong>
                          {t('common:saas-landing.feature_titlestrong1')}
                        </strong>
                      </Title>
                      <Typography display="block" component="h6" className={text.subtitle2} align={isMobile ? 'center' : 'left'}>
                        {t('common:saas-landing.feature_desc1')}
                      </Typography>
                      {/* <div className={isMobile ? align.textCenter : align.textLeft}>
                        <Button variant="contained" color="primary" size="large" className={classes.btn}>
                          {t('common:saas-landing.see_detail')}
                        </Button>
                      </div> */}
                    </div>
                  </ReactWOW>
              </Grid>
              <Grid item md={4} xs={12}>
                <ReactWOW animation="fadeInLeftShort" offset={-100} delay="0.2s" duration="0.4s">
                  <div>
                    <Title align={isMobile ? 'center' : 'left'}>
                      {t('common:saas-landing.feature_title2')}                      
                      &nbsp;
                      <strong>
                        {t('common:saas-landing.feature_titlestrong2')}
                      </strong>
                    </Title>
                    <Typography display="block" component="h6" className={text.subtitle2} align={isMobile ? 'center' : 'left'}>
                      {t('common:saas-landing.feature_desc2')}                      
                    </Typography>
                    {/* <div className={isMobile ? align.textCenter : align.textLeft}>
                      <Button variant="contained" color="primary" size="large" className={classes.btn}>
                        {t('common:saas-landing.see_detail')}
                      </Button>
                    </div> */}
                  </div>
                </ReactWOW>
              </Grid>
              <Grid item md={4} xs={12}>
                <ReactWOW animation="fadeInLeftShort" offset={-100} delay="0.2s" duration="0.4s">
                  <div>
                    <Title align={isMobile ? 'center' : 'left'}>
                      {t('common:saas-landing.feature_title3')}                      
                      &nbsp;
                      <strong>
                        {t('common:saas-landing.feature_titlestrong3')}
                      </strong>
                    </Title>
                    <Typography display="block" component="h6" className={text.subtitle2} align={isMobile ? 'center' : 'left'}>
                      {t('common:saas-landing.feature_desc3')}                      
                    </Typography>
                    {/* <div className={isMobile ? align.textCenter : align.textLeft}>
                      <Button variant="contained" color="primary" size="large" className={classes.btn}>
                        {t('common:saas-landing.see_detail')}
                      </Button>
                    </div> */}
                  </div>
                </ReactWOW>
              </Grid>
            </Grid>
          </div>
          <div className={classes.item}>
            <Grid container>
              <Grid item md={4} xs={12}>
                <ReactWOW animation="fadeInRightShort" offset={-100} delay="0.2s" duration="0.4s">
                  <div>
                    <Title align={isMobile ? 'center' : 'left'}>
                      {t('common:saas-landing.feature_title4')}                      
                      &nbsp;
                      <strong>
                        {t('common:saas-landing.feature_titlestrong4')}
                      </strong>
                    </Title>
                    <Typography display="block" component="h6" className={text.subtitle2} align={isMobile ? 'center' : 'left'}>
                      {t('common:saas-landing.feature_desc4')}                      
                    </Typography>
                    {/* <div className={isMobile ? align.textCenter : align.textLeft}>
                      <Button variant="contained" color="primary" size="large" className={classes.btn}>
                        {t('common:saas-landing.see_detail')}
                      </Button>
                    </div> */}
                  </div>
                </ReactWOW>
              </Grid>
              <Grid item md={4} xs={12}>
                <ReactWOW animation="fadeInRightShort" offset={-100} delay="0.2s" duration="0.4s">
                  <div>
                    <Title align={isMobile ? 'center' : 'left'}>
                      {t('common:saas-landing.feature_title5')}                      
                      &nbsp;
                      <strong>
                        {t('common:saas-landing.feature_titlestrong5')}
                      </strong>
                    </Title>
                    <Typography display="block" component="h6" className={text.subtitle2} align={isMobile ? 'center' : 'left'}>
                      {t('common:saas-landing.feature_desc5')}                      
                    </Typography>
                    {/* <div className={isMobile ? align.textCenter : align.textLeft}>
                      <Button variant="contained" color="primary" size="large" className={classes.btn}>
                        {t('common:saas-landing.see_detail')}
                      </Button>
                    </div> */}
                  </div>
                </ReactWOW>
              </Grid>
              <Grid item md={4} xs={12}>
                <ReactWOW animation="fadeInRightShort" offset={-100} delay="0.2s" duration="0.4s">
                  <div>
                    <Title align={isMobile ? 'center' : 'left'}>
                      {t('common:saas-landing.feature_title6')}                      
                      &nbsp;
                      <strong>
                        {t('common:saas-landing.feature_titlestrong6')}
                      </strong>
                    </Title>
                    <Typography display="block" component="h6" className={text.subtitle2} align={isMobile ? 'center' : 'left'}>
                      {t('common:saas-landing.feature_desc6')}                      
                    </Typography>
                    {/* <div className={isMobile ? align.textCenter : align.textLeft}>
                      <Button variant="contained" color="primary" size="large" className={classes.btn}>
                        {t('common:saas-landing.see_detail')}
                      </Button>
                    </div> */}
                  </div>
                </ReactWOW>
              </Grid>              
            </Grid>
          </div>
          <div className={clsx(classes.item, classes.last)}>
            <Title align="center">
              {t('common:saas-landing.feature_others')}
              &nbsp;
            </Title>
            <div className={classes.tab}>
              <Grid container spacing={6}>
                {!isMobile && <Grid item md={1} xs={12} />}
                <Grid item md={10} xs={12}>
                  <Tabs
                    value={value}
                    onChange={handleChange}
                    indicatorColor="primary"
                    textColor="primary"
                    centered
                  >                    
                    <Tab classes={{ root: classes.tabLabel, selected: classes.selected }} label="Valuable" />
                    <Tab classes={{ root: classes.tabLabel, selected: classes.selected }} label="Support" />
                  </Tabs>
                  <div className={classes.tabContent}>                    
                    {value === 0 && (
                      <Fragment>
                        <section>
                          <Typography component="h6" display="block" align="center" className={text.subtitle2}>
                            {t('common:saas-landing.feature_desc8')}
                          </Typography>
                          <div className={classes.illustrationCenter}>
                            <figure className={clsx(classes.figure, classes.screen)}>
                              <img src={imgAPI.saas[1]} alt="screen" />
                            </figure>
                          </div>
                        </section>
                      </Fragment>
                    )}
                    {value === 1 && (
                      <Fragment>
                        <section>
                          <Typography component="h6" display="block" align="center" className={text.subtitle2}>
                            {t('common:saas-landing.feature_desc9')}
                          </Typography>
                          <div className={classes.illustrationCenter}>
                            <figure className={clsx(classes.figure, classes.screen)}>
                              <img src={imgAPI.saas[2]} alt="screen" />
                            </figure>
                          </div>
                        </section>
                      </Fragment>
                    )}                    
                  </div>
                </Grid>
              </Grid>
            </div>
          </div>
        </ParallaxProvider>
      </Container>
    </div>
  );
}

Feature.propTypes = {
  t: PropTypes.func.isRequired
};

export default withTranslation(['saas-landing'])(Feature);
