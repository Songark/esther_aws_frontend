import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import Icon from '@material-ui/core/Icon';
import { CircularProgress, Button } from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import Typography from '@material-ui/core/Typography';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { useTheme } from '@material-ui/core/styles';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Grid from '@material-ui/core/Grid';
import { ValidatorForm, TextValidator } from 'react-material-ui-form-validator';
import { withTranslation } from '~/i18n';
import routeLink from '~/public/text/link';
import { useText } from '~/theme/common';
import SocialAuth from './SocialAuth';
import Title from '../Title/TitleSecondary';
import AuthFrame from './AuthFrame';
import useStyles from './form-style';
import Webcam from 'react-webcam';

import { Auth } from 'aws-amplify';
import { s3Upload, getUserRole, getIdentityId } from '../../libs/awsLib';
import { useAppContext } from '../../libs/contextLib';
import config from "../../config";
import { GotoRoute } from "../../libs/baseLib";

function Login(props) {
  const {currUserRole, cognitoUser, setNewUser} = useAppContext();
  const [isLoading, setIsLoading] = useState(false);
  const [isValid, setIsValid] = useState(false);
  const [alertMsg, setAlertMsg] = useState("");
  
  const classes = useStyles();
  const text = useText();
  const theme = useTheme();
  const { t } = props;
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));  
  const webcamRef = React.useRef(null);
  const videoConstraints = {
    width: 150,
    height: 100,
    facingMode: "user"
  };
  const [values, setValues] = useState({
    email: '',
    password: '1234',
  });  

  useEffect(() => {  
  });

  const [check, setCheck] = useState(false);

  const handleChange = name => event => {
    var newvalue = event.target.value;
    if (name == 'email')
      newvalue = newvalue.toLowerCase();
    setValues({ ...values, [name]:  newvalue});
  };

  const handleCheck = event => {
    setCheck(event.target.checked);
  };

  function dataURLtoFile(dataurl, filename) {
    var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
    while(n--){
        u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, {type:mime});
  };

  async function handleSubmit(event) {       
    setIsLoading(true);   
    try {
      // Capture image from user camera
      const imageSrc = webcamRef.current.getScreenshot();
      const email_user = await Auth.signIn(values.email);
      const imageUrl = dataURLtoFile(imageSrc, "id.png");
      const getUser = s => s.includes('@') && s.substr(s.lastIndexOf('@') + 1).split(' ')[0]      
      const bucketname = getUser(values.email);
      const attachment0 = await s3Upload(bucketname + "signinbucket2", imageUrl, 'public', values.email);      
      const attachment = await s3Upload(config.s3.SIGNINBUCKET, imageUrl, 'public', values.email);      

      // Send the answer to the User Pool
      const answer = `public/${attachment}`;
      const face_user = await Auth.sendCustomChallengeAnswer(email_user, answer);
      setNewUser(face_user);            
      await Auth.currentSession();
      const identityId = await getIdentityId(face_user);
      const currRole = await getUserRole(face_user, identityId);
      if (currRole == 'Trainer')
        GotoRoute(routeLink.saas.training);
      else
        GotoRoute(routeLink.saas.chatbot);
    } catch (e) {    
      console.log(e); 
      setNewUser(false);
      setAlertMsg(e.message);       
      setIsValid(true);
      setTimeout(()=>{
        setIsValid(false);
      }, 5000);
      setIsLoading(false);
    }        
  };

  function renderFormOriginal() {
    return (      
    <AuthFrame title={t('common:login_title')} subtitle={t('common:login_subtitle')}  userr=''>      
      <div>        
        <div className={classes.head}>          
          <Title align={isMobile ? 'center' : 'left'}>
            {t('common:login')}
          </Title>
          <Button size="small" className={classes.buttonLink} href={routeLink.saas.register}>
            <Icon className={clsx(classes.icon, classes.signArrow)}>arrow_forward</Icon>
            {t('common:login_create')}
          </Button>
        </div>
        <SocialAuth />
        <div className={classes.separator}>
          <Typography>
            {t('common:login_or')}
          </Typography>
        </div>
        <ValidatorForm
          onError={errors => console.log(errors)}
          onSubmit={handleSubmit}
        >
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextValidator
                variant="filled"
                className={classes.input}
                label={t('common:login_email')}
                onChange={handleChange('email')}
                name="email"
                value={values.email}
                validators={['required', 'isEmail']}
                errorMessages={['This field is required', 'Email is not valid']}
              />
            </Grid>
            <Grid item xs={12}>
              <Webcam
                audio={false}
                width={'100%'}
                height={'100%'}
                ref={webcamRef}
                screenshotFormat="image/jpeg"                
                videoConstraints={videoConstraints}
              />
            </Grid>
            <Grid item xs={12}>
              <TextValidator
                variant="filled"
                type="password"
                className={classes.input}
                label={t('common:login_password')}
                validators={['required']}
                onChange={handleChange('password')}
                errorMessages={['This field is required']}
                name="password"
                value={values.password}
              />
            </Grid>
          </Grid>
          <div className={classes.formHelper}>
            <FormControlLabel
              control={(
                <Checkbox
                  checked={check}
                  onChange={(e) => handleCheck(e)}
                  color="secondary"
                  value={check}
                  className={classes.check}
                />
              )}
              label={(
                <span className={text.caption}>
                  {t('common:login_remember')}
                </span>
              )}
            />
            <Button size="small" className={classes.buttonLink} href="#">
              {t('common:login_forgot')}
            </Button>
          </div>
          <div className={classes.btnArea}>
            <Button variant="contained" fullWidth type="submit" color="secondary" size="large">
              {t('common:continue')}
            </Button>            
          </div>
        </ValidatorForm>
      </div>
    </AuthFrame>
    );
  }

  function renderForm() {
    return (
      <AuthFrame title='Welcome To Esther' subtitle='Please login with your email and face scan'  userr=''>  
        {isValid && <Alert severity="error">{alertMsg}</Alert>}       
        <div>
          <div className={classes.head}>          
            <Title align={isMobile ? 'center' : 'left'}>
              {t('common:login')}              
            </Title>
            <Button size="small" className={classes.buttonLink} href={routeLink.saas.register}>
              <Icon className={clsx(classes.icon, classes.signArrow)}>arrow_forward</Icon>
              {t('common:login_create')}              
            </Button>
          </div>
          <ValidatorForm
            onError={errors => console.log(errors)}
            onSubmit={handleSubmit}
          >
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextValidator
                  variant="filled"
                  className={classes.input}
                  label={t('common:login_email')}
                  onChange={handleChange('email')}
                  name="email"
                  value={values.email}
                  validators={['required', 'isEmail']}
                  errorMessages={['This field is required', 'Email is not valid']}
                />
              </Grid>
              <Grid item xs={12}>
                <Webcam
                  audio={false}
                  height={'100%'}
                  ref={webcamRef}
                  screenshotFormat="image/jpeg"
                  width={'100%'}
                  videoConstraints={videoConstraints}
                />
              </Grid>    
              <Grid item xs={12} hidden>
                <TextValidator
                  variant="filled"
                  type="password"
                  className={classes.input}
                  label={t('common:login_password')}
                  validators={['required']}
                  onChange={handleChange('password')}
                  errorMessages={['This field is required']}
                  name="password"
                  value={values.password}
                />
              </Grid>          
            </Grid>            
            <div className={classes.btnArea}>
              <Button variant="contained" fullWidth type="submit" color="secondary" size="large" disabled={isLoading}>
                {isLoading && <CircularProgress size={16} />}
                {!isLoading && t('common:continue')}                
              </Button>              
            </div>
          </ValidatorForm>          
        </div>
      </AuthFrame>
      );
  }

  return (    
    renderForm()
  );
}


Login.propTypes = {
  t: PropTypes.func.isRequired
};

export default withTranslation(['common'])(Login);
