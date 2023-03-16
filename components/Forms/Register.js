import React, { useRef, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { CircularProgress, Button } from '@material-ui/core';
import Icon from '@material-ui/core/Icon';
import clsx from 'clsx';
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
import imgAPI from '~/public/images/imgAPI';
import { CountryDropdown, RegionDropdown, CountryRegionData } from 'react-country-region-selector';
import { Auth } from 'aws-amplify';
import config from "../../config";
import { s3Upload } from "../../libs/awsLib";
import { GotoRoute } from "../../libs/baseLib";

function Register(props) {
  const [newUser, setNewUser] = useState(null);
  const [confirmSignup, setConfirmSignup] = useState(null);
  const file = useRef(null);
  const [fileName, setFileName] = useState('No File Selected');
  const [isMaxFileContent, setIsMaxFileContent] = useState(false);
  const [isInvalid, setIsinvalid] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const classes = useStyles();
  const text = useText();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));  
  const { t } = props;
  const [values, setValues] = useState({
    name: '',
    lastname: '',
    email: '',
    organization: '',
    country: '',
    password: '',
    confirmPassword: '',
    confirmationCode: ''
  });

  function validateForm() {
    return (
      values.name.length> 0 && 
      values.lastname.length> 0 && 
      values.email.length > 0 &&
      values.password.length > 0 &&
      values.country.length > 0 &&
      values.organization.length > 0 &&
      values.password.length >= 8 &&
      values.password === values.confirmPassword
    );
  }

  function validateConfirmForm() {
    return (
      values.confirmationCode.length >= 6 && file.current
    );
  }  

  useEffect(() => {
    ValidatorForm.addValidationRule('isPasswordMatch', (value) => {
      if (value !== values.password) {
        return false;
      }
      return true;
    });
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

  async function handleSubmit(event) {
    event.preventDefault();
    
    setIsLoading(true);   
    try {

      var pollyLang = 'en-US';
      var voiceId = 'Joanna';
      switch (values.country) {
        case 'India':
          pollyLang = 'en-IN';
          voiceId = 'Raveena';
          break;
        case 'United Kingdom':
          pollyLang = 'en-GB';
          voiceId = 'Amy';
          break;
        case 'Australia':
          pollyLang = 'en-AU';
          voiceId = 'Nicole';
          break;
        default:
          pollyLang = 'en-US';
          voiceId = 'Joanna';
          break;
      }
      
      const newUser = await Auth.signUp({
        username: values.email,
        password: values.password,
        attributes: {
          name: values.name + " " + values.lastname,
          "custom:country": values.country,
          "custom:organisation": values.organization,
          "custom:Firstname": values.name,
          "custom:Lastname": values.lastname,
          "custom:pollyvoice": voiceId,
          "custom:pollylang": pollyLang
        }
      });      
      setNewUser(newUser);
    } catch (e) {      
      console.log(e);
      setIsinvalid(true);
      setConfirmSignup(true);      
    }
    setIsLoading(false);
  }

  async function handleConfirmationSubmit(event) {
    event.preventDefault();

    if (file.current && file.current.size > config.MAX_ATTACHMENT_SIZE) {
      setIsMaxFileContent(true);
      setConfirmSignup(true);
      return;
    }
    setIsLoading(true);

    try {
     const getUser = s => s.includes('@') && s.substr(s.lastIndexOf('@') + 1).split(' ')[0]      
     const bucketname = getUser(values.email);
     const items = ["document", "signin", "signup", "theme"];
     for (var i in items) {   
       const reqbody = bucketname + items[i] + "bucket2";
       fetch(config.createbucket.POST_URL, {
         method: 'POST',
         mode: 'no-cors',
         body: reqbody,
       }).then(response => {
       });
     }

     const attachment = file.current ? await s3Upload(config.s3.SIGNUPBUCKET, file.current, 'private', values.email) : null;
     const attachment0 = file.current ? await s3Upload(bucketname + items[2] + "bucket2", file.current, 'private', values.email) : null;
     console.log("Signup/s3Upload: " + attachment);

     await Auth.confirmSignUp(values.email, values.confirmationCode);
     setConfirmSignup(true)
    } catch (e) {
      console.log(e);
      setIsinvalid(true);         
      setIsLoading(false);
      setConfirmSignup(true);
    }
  }

  async function handleSuccess(event) {
    GotoRoute(routeLink.saas.login);
  }

  function handleFileChange(event) {
    file.current = event.target.files[0];   
    setFileName(file.current.name);
  }

  function renderForm() {
    return (      
      <div>
        <div className={classes.head}>
          <Title align={isMobile ? 'center' : 'left'}>{t('common:register')}</Title>
          <Button size="small" className={classes.buttonLink} href={routeLink.saas.login}>
            <Icon className={clsx(classes.icon, classes.signArrow)}>arrow_forward</Icon>
            {t('common:register_already')}
          </Button>
        </div>
        <ValidatorForm
          onError={errors => console.log(errors)}
          onSubmit={handleSubmit}
        >
          <Grid container spacing={3}>
            <Grid item md={6} xs={12}>
              <TextValidator
                variant="filled"
                className={classes.input}
                label={t('common:register_name')}
                onChange={handleChange('name')}
                name="name"
                value={values.name}
                validators={['required']}
                errorMessages={['This field is required']}
              />
            </Grid>
            <Grid item md={6} xs={12}>
              <TextValidator
                variant="filled"
                className={classes.input}
                label={t('common:register_lastname')}
                onChange={handleChange('lastname')}
                name="lastname"
                value={values.lastname}
                validators={['required']}
                errorMessages={['This field is required']}
              />
            </Grid>
            <Grid item xs={12}>
              <TextValidator
                variant="filled"
                className={classes.input}
                label={t('common:register_email')}
                onChange={handleChange('email')}
                name="email"
                value={values.email}
                validators={['required', 'isEmail']}
                errorMessages={['This field is required', 'Email is not valid']}
              />
            </Grid>
            <Grid item xs={12}>
              <TextValidator
                variant="filled"
                className={classes.input}
                label={t('common:register_organization')}
                onChange={handleChange('organization')}
                name="organization"
                value={values.organization}
                validators={['required']}
                errorMessages={['This field is required']}
              />
            </Grid>
            <Grid item xs={12}>
              <CountryDropdown
                className = {classes.country}
                label={t('common:register_country')}
                onChange={(val) => setValues({ ...values, 'country': val })}
                name="country"
                value={values.country}
                validators={['required']}                
              />
            </Grid>
            <Grid item md={6} xs={12}>
              <TextValidator
                variant="filled"
                type="password"
                className={classes.input}
                label={t('common:register_password')}
                validators={['required']}
                onChange={handleChange('password')}
                errorMessages={['This field is required']}
                name="password"
                value={values.password}
              />
            </Grid>
            <Grid item md={6} xs={12}>
              <TextValidator
                variant="filled"
                type="password"
                className={classes.input}
                label={t('common:register_confirm')}
                validators={['isPasswordMatch', 'required']}
                errorMessages={['Password mismatch', 'this field is required']}
                onChange={handleChange('confirmPassword')}
                name="confirm"
                value={values.confirmPassword}
              />
            </Grid>
          </Grid>
          <div className={classes.btnArea}>
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
                  {t('common:form_terms')}
                  &nbsp;
                  <a href="#">
                    {t('common:form_privacy')}
                  </a>
                </span>
              )}
            />            
          </div>
          <div className={classes.btnArea}>
            <Button variant="contained" fullWidth type="submit" color="secondary" size="large" disabled={isLoading || !validateForm() || !check}>
              {isLoading && <CircularProgress size={16}/>}
              {!isLoading && t('common:register')}                            
            </Button>
          </div>
        </ValidatorForm>
      </div>    
    );
  }

  function renderConfirmationForm() {
    return (
      <div>
        <div className={classes.head}>
          <Title align={isMobile ? 'center' : 'left'}>{t('common:register')}</Title>          
        </div>
        <ValidatorForm
          onError={errors => console.log(errors)}
          onSubmit={handleConfirmationSubmit}
        >
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography className={classes.btnLineArea}>
                Confirmation Code
              </Typography>   
            </Grid> 
            <Grid item xs={12}>
              <TextValidator
                variant="filled"
                className={classes.input}
                label='Please enter code from your email'                
                name="code"                
                validators={['required']}
                errorMessages={['This field is required']}
                value={values.confirmationCode}
                onChange={handleChange('confirmationCode')}
              />
            </Grid> 
            <Grid item xs={12}>
              <Typography className={classes.btnLineArea}>
                Please upload your face photo
              </Typography>   
            </Grid> 
            <Grid item xs={12}>  
              <label htmlFor="btn-upload">
                <input
                  id="btn-upload"
                  name="btn-upload"
                  style={{ display: 'none' }}
                  type="file"
                  onChange={handleFileChange} />
                <Button
                  className={classes.btnLine}
                  variant="outlined"
                  fullWidth
                  component="span" >
                  Choose Photo (*.png | *.jpeg)
                </Button>
              </label>
              </Grid>
              <Grid item xs={12}>  
                <Typography className={classes.btnLineArea}>
                  {fileName}
                </Typography>                
              </Grid>           
              {!isMobile && <Grid item xs={12}></Grid>}
              {!isMobile && <Grid item xs={12}></Grid>}
              {!isMobile && <Grid item xs={12}></Grid>}
          </Grid>
          <div className={classes.btnArea}>
            <Button variant="contained" fullWidth type="submit" color="secondary" size="large" disabled={isLoading || !validateConfirmForm()}>
              {isLoading && <CircularProgress size={16}/>}
              {!isLoading && 'Verify'}                            
            </Button>
          </div>
        </ValidatorForm>
      </div>    
    );
  }

  function confirmSuccess() {
    const timer = setTimeout(() => {
      GotoRoute(routeLink.saas.login);
    }, 5000);
    
    return (
      <div>
        <div className={classes.head}>
          {isInvalid && <Title align={isMobile ? 'center' : 'left'}>Invalid Registered</Title>}
          {isMaxFileContent && <Title align={isMobile ? 'center' : 'left'}>Photo Size is too big</Title>}
          {!isMaxFileContent && !isInvalid && <Title align={isMobile ? 'center' : 'left'}>Successfully Registered</Title>}
        </div>
        <ValidatorForm
          onError={errors => console.log(errors)}     
          onSubmit={handleSuccess} 
        >
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <div className={classes.illustrationCenter}>
                <figure className={clsx(classes.figure, classes.screen)}>
                  <img src={imgAPI.saas[2]} alt="screen" />
                </figure>
              </div>
            </Grid> 
            <Grid item xs={12}>
              {isInvalid && <Typography className={classes.btnLineArea}>
                Sorry, but please check your confirmation code and face photo again.
              </Typography>}
              {isMaxFileContent && <Typography className={classes.btnLineArea}>
                Sorry, but please confirm whether the face photo's size is bigger than 5MB.
              </Typography>}
              {!isMaxFileContent && !isInvalid && <Typography className={classes.btnLineArea}>
                Congratulation, you can login with the registered email and your face camera.
              </Typography>}
            </Grid>                     
            {!isMobile && <Grid item xs={12}></Grid>}
            {!isMobile && <Grid item xs={12}></Grid>}
            {!isMobile && <Grid item xs={12}></Grid>}
          </Grid>
          <div className={classes.btnAreaLight}>
            <Button variant="contained" fullWidth color="secondary" size="large" href={routeLink.saas.login}>              
              Goto Login
            </Button>
          </div>
        </ValidatorForm>
      </div>    
    )
  }

  return (
    <AuthFrame title={t('common:register_title')} subtitle={t('common:register_subtitle')} userr=''>
      {newUser == null ? renderForm() : (confirmSignup === null ? renderConfirmationForm() : confirmSuccess())}
    </AuthFrame>
  );
}


Register.propTypes = {
  t: PropTypes.func.isRequired
};

export default withTranslation(['common'])(Register);
