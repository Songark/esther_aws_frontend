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
import routerLink from '~/public/text/link';
import { useText } from '~/theme/common';
import Title from '../Title/TitleSecondary';
import AuthFrame from './AuthFrame';
import useStyles from './form-style';
import { CountryDropdown, RegionDropdown, CountryRegionData } from 'react-country-region-selector';
import { Auth } from 'aws-amplify';
import config from "../../config";
import { getUserRole, getWebsiteUrls, setCurrentWebsite, getCurrentWebsite } from "../../libs/awsLib";
import { GotoRoute } from "../../libs/baseLib";
import MessageBox from '../Notification/MessageBox'
import CreatableSelect from 'react-select/creatable';

function Profile(props) {
  const [newUser, setNewUser] = useState(null);
  const [userRole, setUserRole] = useState('');
  const [confirmSignup, setConfirmSignup] = useState(null);
  const file = useRef(null);
  const [fileName, setFileName] = useState('No File Selected');
  const [isMaxFileContent, setIsMaxFileContent] = useState(false);
  const [isValid, setIsValid] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const classes = useStyles();
  const text = useText();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));  
  const { t } = props;
  const [msgBox, showMsgBox] = useState(false);
  const [msgTitle, setMsgTitle] = useState("");
  const [msgContent, setMsgContent] = useState("");

  const [selectedUrl, setSelectedUrl] = useState(null);

  function showMessageBox(title, message)
  {
    setMsgTitle(title);
    setMsgContent(message);
    showMsgBox(true);
  }

  function handleCloseMessageBox()
  {
    showMsgBox(false);
    setMsgTitle("");
    setMsgContent("");
  }

  const polly_voices = [
    {voicename: 'Select Voice and Language', voiceid: '', pollylang: ''},
    {voicename: 'English, United Status: Salli, Female', voiceid: 'Salli', pollylang: 'en-US'},
    {voicename: 'English, United Status: Joanna, Female', voiceid: 'Joanna', pollylang: 'en-US'},
    {voicename: 'English, United Status: Ivy, Female', voiceid: 'Ivy', pollylang: 'en-US'},
    {voicename: 'English, United Status: Kendra, Female', voiceid: 'Kendra', pollylang: 'en-US'},
    {voicename: 'English, United Status: Kimberly, Female', voiceid: 'Kimberly', pollylang: 'en-US'},
    {voicename: 'English, United Status: Matthew, Male', voiceid: 'Matthew', pollylang: 'en-US'},
    {voicename: 'English, United Status: Justin, Male', voiceid: 'Justin', pollylang: 'en-US'},
    {voicename: 'English, United Status: Joey, Male', voiceid: 'Joey', pollylang: 'en-US'},

    {voicename: 'English, Britsh: Amy, Female', voiceid: 'Amy', pollylang: 'en-GB'},
    {voicename: 'English, Britsh: Emma, Female', voiceid: 'Emma', pollylang: 'en-GB'},
    {voicename: 'English, Britsh: Brian, Male', voiceid: 'Brian', pollylang: 'en-GB'},
    
    {voicename: 'English, Australian: Nicole, Female', voiceid: 'Nicole', pollylang: 'en-AU'},
    {voicename: 'English, Australian: Olivia, Female', voiceid: 'Olivia', pollylang: 'en-AU'},
    {voicename: 'English, Australian: Russell, Male', voiceid: 'Russell', pollylang: 'en-AU'},

    {voicename: 'English, Indian: Raveena, Female', voiceid: 'Raveena', pollylang: 'en-IN'},
    {voicename: 'English, Indian: Aditi, Female', voiceid: 'Aditi', pollylang: 'en-IN'}

  ];
    
  const [values, setValues] = useState({
    firstname: '',
    lastname: '',    
    role: '',    
    organization: '',
    country: '',  
    pollyvoice: '',  
    pollylang: '',
    address: '',
    birthdate: '',
    gender: '',
    phonenumber: '',
    picture: ''
  });

  const [webUrls, setWebUrls] = useState([]);

  const createWebsiteUrl = (label) => ({
    label,
    value: label,
  });

  function validateForm() {
    return (
      values.firstname.length> 0 && 
      values.lastname.length> 0 &&       
      values.country.length > 0 &&
      values.organization.length > 0 &&
      values.pollyvoice.length > 0 &&
      values.pollylang.length > 0
    );
  }

  function isPossibleManageUsers()
  {
    if (values.role.toLowerCase() == 'super admin' || values.role.toLowerCase() == 'admin')
      return true;

    return false;
  }

  const handleChange = name => event => {
    setValues({ ...values, [name]: event.target.value });
  };

  function getWebsiteurlsFromArray()
  {
    var result = "";
    webUrls.forEach(oneurl => {
      if (oneurl.label.length > 0)
        result += (oneurl.label + ';');
    });
    return result;
  }

  async function handleSubmit(event) {
    event.preventDefault();

    setIsLoading(true);   
    try {
      await Auth.updateUserAttributes(newUser, 
        { 
          'custom:Firstname': values['firstname'],
          'custom:Lastname': values['lastname'],
          'custom:organisation': values['organization'],
          'custom:country': values['country'],
          'custom:pollyvoice': values['pollyvoice'],
          'custom:pollylang': values['pollylang'],
          'custom:address': values['address'],
          'custom:birthdate': values['birthdate'],
          'custom:phonenumber': values['phonenumber'],
          'custom:website': getWebsiteurlsFromArray()
        }
      );      

      if (selectedUrl != null) {        
        await setCurrentWebsite(newUser, selectedUrl.value);
      }

      showMessageBox("Success", "Your profile is updated successfully.");
    } catch (e) {            
      showMessageBox("Error", e['message']);
    }
    setIsLoading(false);
  }

  function changePollyVoice(event)
  {
    for (let node of event.target.children) {
      if (node.value === event.target.value) {        
        setValues({ ...values, 
          ['pollyvoice']: node.value,
          ['pollylang']: node.getAttribute('pollylang')
        });
        return;
      }
    }
  }

  const handleItemChange = (newValue, actionMeta) => {
    setSelectedUrl(newValue);
  };

  const handleItemCreate = (inputValue) => {
    setSelectedUrl(createWebsiteUrl(inputValue));
    if (inputValue.length > 0) {
      var currentUrls = webUrls;
      webUrls.forEach(oneurl => {
        if (oneurl.label == inputValue)
          return;
      });
      
      currentUrls.push(createWebsiteUrl(inputValue));
      setWebUrls(currentUrls);
    }
  };

  const handleItemDelete = () => {
    if (selectedUrl != null) {
      const index = webUrls.indexOf(selectedUrl);
      if (index > -1) {
        webUrls.splice(index, 1);
        if (webUrls.length > 0)  {
          setSelectedUrl(webUrls[0]);
        }
        else {
          setSelectedUrl(null);
        }
      }
    }
  };

  async function onLoad() {    
    try {
      await Auth.currentSession();      
      const currUser = await Auth.currentUserPoolUser();      
      const roleUser = await getUserRole(currUser);  
      var currUrl = await getCurrentWebsite(currUser);
      setSelectedUrl({value: currUrl, label: currUrl});    

      setNewUser(currUser); 
      setUserRole(roleUser);
      setValues({ ...values, 
        ['firstname']: currUser['attributes']['custom:Firstname'],
        ['lastname']: currUser['attributes']['custom:Lastname'],
        ['organization']: currUser['attributes']['custom:organisation'],
        ['country']: currUser['attributes']['custom:country'],
        ['address']: currUser['attributes']['custom:address'] != null ? currUser['attributes']['custom:address'] : '',
        ['birthdate']: currUser['attributes']['custom:birthdate'] != null ? currUser['attributes']['custom:birthdate'] : '',
        ['phonenumber']: currUser['attributes']['custom:phonenumber'] != null ? currUser['attributes']['custom:phonenumber'] : '',        
        ['pollyvoice']: currUser['attributes']['custom:pollyvoice'] != null ? currUser['attributes']['custom:pollyvoice'] : '',
        ['pollylang']: currUser['attributes']['custom:pollylang'] != null ? currUser['attributes']['custom:pollylang'] : '',
        ['role']: roleUser,
       }); 
       
       var urls = getWebsiteUrls(currUser);
       setWebUrls(urls);
    }
    catch(e) {   
    }
  }
  
  useEffect(() => {        
    onLoad();
  }, []);

  function renderForm() {
    return (      
      <div>
        {msgBox && <MessageBox title={msgTitle} message={msgContent} onClose={handleCloseMessageBox}/>}
        <div className={classes.head}>
          <Title align={isMobile ? 'center' : 'left'}>{t('common:profile')}</Title>          
        </div>
        <ValidatorForm
          onError={errors => console.log(errors)}
          onSubmit={handleSubmit}
        >
          <Grid container spacing={3}>                                         
            <Grid item md={4} xs={12}>  
              <TextValidator
                variant="filled"
                className={classes.input}
                label={t('common:register_name')}
                onChange={handleChange('firstname')}
                name="name"
                value={values.firstname}
                validators={['required']}
                errorMessages={['This field is required']}
              />
            </Grid>
            <Grid item md={4} xs={12}>
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
            <Grid item md={4} xs={12}>
              <TextValidator
                variant="filled"
                className={classes.input}
                label={t('common:register_role')}
                name="role"
                value={values.role}
              />
            </Grid>
            <Grid item xs={12}>
              <TextValidator
                variant="filled"
                className={classes.input}
                label={t('common:profile_address')}
                onChange={handleChange('address')}
                name="address"
                value={values.address}
              />
            </Grid>
            <Grid item md={6} xs={12}>
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
            <Grid item md={6} xs={12}>
              <TextValidator
                variant="filled"
                className={classes.input}
                label={t('common:profile_birthdate')}
                onChange={handleChange('birthdate')}
                name="birthdate"
                value={values.birthdate}
              />
            </Grid>
            <Grid item md={6} xs={12}>
              <TextValidator
                variant="filled"
                className={classes.input}
                label={t('common:profile_phonenumber')}
                onChange={handleChange('phonenumber')}
                name="phonenumber"
                value={values.phonenumber}
              />
            </Grid>
            <Grid item md={6} xs={12}>
              <TextValidator
                variant="filled"
                className={classes.input}
                label="Fax"                
                name="fax"
              />
            </Grid>
            <Grid item md={3} xs={12}>
              <Typography className={classes.profile_dark}>
              {t('common:register_country')}
              </Typography>         
            </Grid>
            <Grid item md={9} xs={12}>
              <CountryDropdown
                className = {classes.country}                
                onChange={(val) => setValues({ ...values, 'country': val })}
                name="country"
                value={values.country}
                validators={['required']}                
              />
            </Grid>  
            <Grid item md={3} xs={12}>
              <Typography className={classes.profile_dark}>
              {t('common:profile_pollyvoice')}
              </Typography>         
            </Grid>
            <Grid item md={9} xs={12}>
              <select className = {classes.country} id="select-voice" onChange={changePollyVoice.bind(this)}>
                {polly_voices.map((polly_voice) => (
                  <option key={polly_voice.voiceid} value={polly_voice.voiceid} pollylang={polly_voice.pollylang} selected={polly_voice.voiceid == values['pollyvoice']}>
                    {polly_voice.voicename}
                  </option>
                ))}
              </select>                                    
            </Grid>      
            <Grid item md={3} xs={12}>
              <Typography className={classes.profile_dark}>
              Test Websites
              </Typography>         
            </Grid>
            <Grid item md={6} xs={12}>
              <CreatableSelect
                isClearable
                isDisabled={isLoading}
                isLoading={isLoading}
                onChange={handleItemChange}
                onCreateOption={handleItemCreate}
                options={webUrls}
                value={selectedUrl}
              />
            </Grid>      
            <Grid item md={3} xs={12}>
              <Button variant="contained" fullWidth color="secondary" size="large" onClick={handleItemDelete} 
              disabled={isLoading}>                  
                Remove
              </Button>
            </Grid> 
            {isPossibleManageUsers() && <Grid item md={6} xs={12}>
              <Button variant="contained" fullWidth color="secondary" size="large" onClick={() => {GotoRoute(routerLink.saas.users);}} 
              disabled={isLoading}>                  
                {t('common:manage_users')}                            
              </Button>
            </Grid>}          
            <Grid item md={isPossibleManageUsers() ? 6 : 12} xs={12}>
              <Button variant="contained" fullWidth type="submit" color="secondary" size="large" disabled={isLoading || !validateForm()}>
                {isLoading && <CircularProgress size={16}/>}
                {!isLoading && t('common:save_register')}                            
              </Button>
            </Grid>
          </Grid>          
        </ValidatorForm>
      </div>    
    );
  }

  return (
    <AuthFrame title={t('common:profile_title')} subtitle={t('common:profile_subtitle')} userr={userRole}>
      {renderForm()}
    </AuthFrame>
  );
}


Profile.propTypes = {
  t: PropTypes.func.isRequired
};

export default withTranslation(['common'])(Profile);
