import React, { useEffect, useState } from 'react';
import AWS from 'aws-sdk';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import Hidden from '@material-ui/core/Hidden';
import Button from '@material-ui/core/Button';
import { Alert } from '@material-ui/lab';
import { Grid, Paper, ListItem, LinearProgress, Typography, Container, Link } from '@material-ui/core';
import brand from '~/public/text/brand';
import routerLink from '~/public/text/link';
import logo from '~/public/images/saas-logo.png';
import { useText } from '~/theme/common';
import useStyles from './form-style';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { useTheme } from '@material-ui/core/styles';
import { withTranslation } from '~/i18n';
import { ChatBotPc } from  "./ChatBotPc";
import { ChatBotMobile } from  "./ChatBotMobile";
import { AmplifyTheme } from 'aws-amplify-react';
import { useAppContext } from '../../libs/contextLib';
import routeLink from '~/public/text/link';
import "./ChatFrame.css";
import config from "../../config";
import { GotoRoute } from "../../libs/baseLib";
import { getUserRole, getChatData, setChatData, getWebTestProgress } from "../../libs/awsLib";
import { Auth } from 'aws-amplify';
import PcMenu from './PcMenu';
import MessageBox from '../Notification/MessageBox'
import IconButton from '@material-ui/core/IconButton';
import CancelIcon from '@material-ui/icons/Cancel';
import CheckCircleOutlineIcon from '@material-ui/icons/CheckCircleOutline';
import AutorenewIcon from '@material-ui/icons/Autorenew';

const myTheme = {
  ...AmplifyTheme,
  container:{ ...AmplifyTheme.container },
  formSection: { ...AmplifyTheme.formSection, width: '100%' },
  sectionHeader: { ...AmplifyTheme.sectionHeader, backgroundColor: '#e7e7e7', color: 'black' },
  sectionBody: { ...AmplifyTheme.sectionBody, fontSize: '14px', color: 'blue', 
    chatbubble: {
      borderRadius: 30,
      padding: 5
    }
  },
  sectionFooter: {padding: '.5% 1%',backgroundColor: '#e7e7e7',color: '#FB2700',fontSize: '120%',bottom: '0',height: '5%',button: 'blue'}
};

const myMobileTheme = {
  ...AmplifyTheme,
  container:{ ...AmplifyTheme.container },
  formSection: { ...AmplifyTheme.formSection, width: '100%' },
  sectionHeader: { ...AmplifyTheme.sectionHeader, backgroundColor: '#e7e7e7', color: 'black' },
  sectionBody: { ...AmplifyTheme.sectionBody, fontSize: '14px', color: 'blue', 
    chatbubble: {
      borderRadius: 30,
      padding: 5
    }
  },
  sectionFooter: {padding: '.5% 1%',backgroundColor: '#e7e7e7',color: '#FB2700',fontSize: '120%',bottom: '0',height: '5%',button: 'blue'}
};


const customVoiceConfig = {
  silenceDetectionConfig: {
      time: 4000,
      amplitude: 0.2
  }   
}

const s3 = new AWS.S3 ({
  accessKeyId: config.security.ACCESS_KEY,
  secretAccessKey: config.security.SECRET_KEY,
  region: config.s3.REGION
});

function ChatFrame(props) {
  const [isValid, setIsValid] = useState(false);
  const [alertMsg, setAlertMsg] = useState("");
  const [messageGreet, setMsgGreet] = useState(null);
  const classes = useStyles();
  const text = useText();
  const { t } = props;
  const title = 'Welcome To Chatbot'; //t('common:welcome_chatbot');
  const subtitle = t('common:login_subtitle');

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));  
  const [cognitoUser, setCognitoUser] = useState(null);
  const [userRole, setUserRole] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [testProgress, setTestProgress] = useState([]);
  const [msgBox, showMsgBox] = useState(false);
  const [msgTitle, setMsgTitle] = useState("");
  const [msgContent, setMsgContent] = useState("");

  const polly = new AWS.Polly({
    accessKeyId: config.security.ACCESS_KEY,
    secretAccessKey: config.security.SECRET_KEY,
    region: config.s3.REGION
  });

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

  function welcomeToSpeech(text, chats, speakable) {
    if (cognitoUser && text) {
      var pollyLang = cognitoUser['attributes']['custom:pollylang'];
      var voiceId = cognitoUser['attributes']['custom:pollyvoice'];
      if (pollyLang == null || voiceId == null) {
        switch (cognitoUser['attributes']['custom:country']) {
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
      }
      let params = {
        Text: text,
        OutputFormat: 'mp3',
        VoiceId: voiceId,
        LanguageCode: pollyLang,
      };
    
      polly.synthesizeSpeech(params, (err, data) => {
        if (err) {
          console.log(err);
        } else if (data) {
          const uInt8Array = new Uint8Array(data.AudioStream);
          const arrayBuffer = uInt8Array.buffer;
          const blob = new Blob([arrayBuffer], { type: 'audio/mpeg' });          
          const url = URL.createObjectURL(blob);
          let audio = new Audio(url);

          if (speakable) audio.play();
          if (chats.length > 1) setChatData(chats);     
        }
      });
    }
  }

  function handleComplete(err, confirmation) {
    console.log('Chatbot: handleComplete');
    if (err) {
      console.log(err);
      return;
    }    
    return;
  }
  
  async function onWebsiteMonitor()
  {
    console.log('onWebsiteMonitor');        
    if (cognitoUser) {
      let reqUrls = '';
      for (var i = 0; i < testProgress.length; i++) {
        reqUrls += (testProgress[i].url + ',');      
      }
      if (reqUrls.length > 0) {
        reqUrls = reqUrls.slice(0, reqUrls.length - 1);
      }
      console.log('websites: ' + reqUrls);
      if (reqUrls.length > 0) {
        const testProg = await getWebTestProgress(cognitoUser, reqUrls);;
        console.log(testProg);  
        if (testProg.length > 0) {
          setTestProgress(testProg);
        }        
      }      
    }
  }

  async function onChangedWebsites(website) 
  {    
    const curProgress = testProgress;
    var existFlag = false;
    for (var i = 0; i < testProgress.length; i++) {
      if (testProgress[i].url == website) {
        existFlag = true;
        break;
      }
    }
    if (existFlag == false) {
      curProgress.push({url: website, value: 0, report: '', end: false});
    }
    setTestProgress(curProgress);
  }

  function openSignedReportLink(event) 
  {
    let uploadDocBucket = 'faceapp2.report';
    let uploadDocKey = '';    
    if (event.target != null) {
      uploadDocKey = event.target.getAttribute('report');
    }
    if (uploadDocBucket.length > 0 && uploadDocKey.length > 0) {
      const s3Params = {
        Bucket: uploadDocBucket,
        Key: uploadDocKey + ''
      };
      s3.getSignedUrl('getObject', s3Params, (err, data) => {
        if (err) {
          console.log(err);
        }        
        else {
          window.open(data, '_blank');
        }
      });
    }
  }  

  async function onLoad() {    
    try {
      const currUser = await Auth.currentUserPoolUser(); 
      setCognitoUser(currUser);     
      const chatHistory = getChatData();
      setChatHistory(chatHistory);   
      const currRole = await getUserRole(currUser);
      setUserRole(currRole);   

      var hours = new Date().getHours(); 
      var timeGreet = ""; 
      if (hours >= 12 && hours < 18) {
        timeGreet = "Afternoon";
      }
      else if (hours >= 18 && hours < 24) {
        timeGreet = "Evening";
      }
      else if (hours >= 0 && hours < 6) {
        timeGreet = "Night";
      }
      else {
        timeGreet = "Morning";
      }

      var greetMsg = "Good " + timeGreet + ", " + currUser['attributes']['custom:Firstname'] + ". ";
      console.log(greetMsg);
      setMsgGreet(greetMsg); 
    }
    catch(e) {   
      console.log(e);   
      if (e !== undefined) {  
        if (e !== 'No current user') {
          if (typeof e === 'string')
            showMessageBox('Alarm', e);
          else
            showMessageBox('Alarm', e.message);
        } 
        setChatData(null);
        GotoRoute(routeLink.saas.login);
      }    
    }
  }
    
  useEffect(() => {        
    onLoad();
  }, []);


  return (
    <div className={classes.pageWrapLight}>      
      {msgBox && <MessageBox title={msgTitle} message={msgContent} onClose={handleCloseMessageBox}/>}
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
            <PcMenu parent='chatbot' userr={userRole}/>
          </div>
          <div className={classes.authFramePad}>   
            <Grid container spacing={1}>              
              <Grid item xs={12}>
                <div className={isMobile ? classes.framehead : classes.framehead}>                   
                  {cognitoUser && messageGreet && isMobile && <ChatBotMobile
                    title="Esther"
                    theme={isMobile ? myMobileTheme : myTheme}
                    botName="MyBot"
                    welcomeMessage={messageGreet}
                    onComplete={handleComplete}          
                    clearOnComplete={false}
                    conversationModeOn={true}
                    initHistory={chatHistory}
                    funcTextToSpeech={welcomeToSpeech}
                    voiceEnabled={true}          
                    voiceConfig={customVoiceConfig}/>
                  } 
                  {cognitoUser && messageGreet && !isMobile && <ChatBotPc
                    title="Esther"
                    onChangedWebsites={onChangedWebsites}
                    theme={isMobile ? myMobileTheme : myTheme}
                    botName="MyBot"
                    welcomeMessage={messageGreet}
                    onComplete={handleComplete}          
                    clearOnComplete={false}
                    conversationModeOn={true}
                    initHistory={chatHistory}
                    funcTextToSpeech={welcomeToSpeech}
                    voiceEnabled={true}          
                    voiceConfig={customVoiceConfig}/>
                  }              
                </div>
              </Grid>  
              <Grid item md={3} xs={12}>
                  <Button variant="contained" color="secondary" onClick={onWebsiteMonitor}>                      
                    Refresh Progress
                  </Button>
                </Grid>
              <Grid item md={9} xs={12}></Grid>
              <Grid item xs={12}></Grid>
              {testProgress.map((oneProgress) => (
                <Grid key={oneProgress.url} container spacing={1}>                  
                  <Grid item md={5} xs={12}>  
                    <Typography>
                      Testing in Progress: {oneProgress.url}
                    </Typography>    
                  </Grid>
                  <Grid item md={6} xs={12}>  
                    {oneProgress.end == false && <LinearProgress variant="determinate" value={oneProgress.value}/>}
                    {oneProgress.end == true && <Typography>
                      <Link report={oneProgress.report} onClick={openSignedReportLink.bind(this)}>
                        Click for Report Page
                      </Link>
                    </Typography>}
                  </Grid>                     
                  <Grid container justify="flex-end" item md={1} xs={12}>
                    {oneProgress.end == true && <CheckCircleOutlineIcon/>}
                    {oneProgress.end == false && <AutorenewIcon/>}
                  </Grid>                    
                  <Grid item xs={12}></Grid>
                </Grid>
              ))}                                   
            </Grid>
          </div>
        </Paper>
      </Container>
    </div>
  );
}

ChatFrame.propTypes = {
  t: PropTypes.func.isRequired
};

export default withTranslation(['common'])(ChatFrame);
