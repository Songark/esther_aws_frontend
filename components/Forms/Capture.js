import React, { useRef, useState, useEffect } from "react";
import AWS from 'aws-sdk';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import Paper from '@material-ui/core/Paper';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import routerLink from '~/public/text/link';
import { useText } from '~/theme/common';
import useStyles from './form-style';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { useTheme } from '@material-ui/core/styles';
import { withTranslation } from '~/i18n';
import { AmplifyTheme } from 'aws-amplify-react';
import { ValidatorForm, TextValidator } from 'react-material-ui-form-validator';
import { Typography, Button, IconButton, withStyles, FormControlLabel, FormControl} from '@material-ui/core';
import config from "../../config";
import { getUserRole, s3DownloadDocument, s3UploadScript } from "../../libs/awsLib";
import { Auth } from 'aws-amplify';
import MessageBox from '../Notification/MessageBox'
import { GotoRoute } from "../../libs/baseLib";
import Iframe from 'react-iframe';
import { useTracking } from 'react-tracking';
import YouTube from 'react-youtube';
import yt from '~/youtube';
import PcMenu from './PcMenu';
var path = require('path');

function Capture(props) {
  const file = useRef(null);  
  const [fileName, setFileName] = useState('No File Selected');
  const classes = useStyles();
  const { t } = props;
  const title = "Training Answers"; // t('common:manage_document');
  const subtitle = t('common:login_subtitle');
  const text = useText();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [isLoading, setIsLoading] = useState(false);
  const [msgBox, showMsgBox] = useState(false);
  const [msgTitle, setMsgTitle] = useState("");
  const [msgContent, setMsgContent] = useState("");
  const [cognitoUser, setNewUser] = useState(null);
  const [userRole, setUserRole] = useState('');

  const [player, setPlayer] = useState([]);
  const opts = {
    height: '420',
    width: '100%',
    playerVars: { // https://developers.google.com/youtube/player_parameters
      autoplay: 0,
      controls: 1,
      rel: 0,
      showinfo: 1,
      mute: 0,
      origin: 'https://localhost:3002'
    }
  };

  const s3 = new AWS.S3 ({
    accessKeyId: config.security.ACCESS_KEY,
    secretAccessKey: config.security.SECRET_KEY,
    region: config.s3.REGION
  });

  AWS.config.update({
    accessKeyId: config.security.ACCESS_KEY,
    secretAccessKey: config.security.SECRET_KEY,
    region: config.s3.REGION
  });

  const dynamodb = new AWS.DynamoDB.DocumentClient();

  function isAdminUser(currRole)
  {
    if (currRole) {
      if (currRole.toLowerCase() == 'super admin' || currRole.toLowerCase() == 'admin')
        return true;
    }
    return false;
  }

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

  async function handleDownloadExt(event) {
    setIsLoading(true);
    await s3DownloadDocument(config.s3.TOOLBUCKET, "user_record.zip");
    setIsLoading(false);
  }

  async function handleCaptureSubmit(event) {
    setIsLoading(true);
    if (file.current != null) {
      await s3UploadScript(config.s3.SCRIPTBUCKET, file.current);
    }
    showMessageBox("Success", "Uploaded on the server successfully.");
    setIsLoading(false);
  }

  function handleFileChange(event) {
    file.current = event.target.files[0];   
    if (file.current != null) {
      const _ext = path.extname(file.current.name);
      if (_ext == ".side" || _ext == ".zip") {
        setFileName(file.current.name);
      }
      else {
        showMessageBox("Alarm", "Please choose zip or side file.");
      }
    }
    else
      setFileName('No File Selected');
  }

  const _onReady = event => {
    player.push(event.target);
    setPlayer(player);
  };


  async function onLoad() {    
    try {
      setIsLoading(true);
      const currUser = await Auth.currentUserPoolUser();      
      setNewUser(currUser);     
      const currRole = await getUserRole(currUser);
      setUserRole(currRole);       
      setIsLoading(false);
    }
    catch(e) {   
      console.log(e);   
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
            <PcMenu parent='capture' userr={userRole}/>
          </div>     
          <div className={classes.authFramePad}>    
            <ValidatorForm
              onError={errors => console.log(errors)}
              onSubmit={handleCaptureSubmit}
            >
              <Grid container spacing={3}>   
                <Grid item xs={12}>
                  <div className={classes.framehead}>
                    <Typography gutterBottom variant="h4" className={classes.label_dark}>
                      Upload the SIDE Scripts for AI
                    </Typography>   
                  </div>                  
                </Grid>      
                <Grid item md={3} xs={12}>
                <div className={classes.btnLineArea}>
                    <Button variant="contained" fullWidth color="secondary" size="large" onClick={() => {handleDownloadExt();}}
                      disabled={isLoading}>                      
                      Download Extension
                    </Button>
                  </div>
                </Grid>                
                <Grid item md={3} xs={12}>  
                <label htmlFor="btn-upload">
                  <input
                    id="btn-upload"
                    name="btn-upload"
                    style={{ display: 'none' }}
                    type="file"
                    onChange={handleFileChange} />
                  <Button
                    className={classes.btnLineArea}
                    variant="outlined"
                    fullWidth
                    component="span" >                    
                    Choose Scripts (*.side|*.zip)
                  </Button>
                </label>
                </Grid>
                <Grid item md={3} xs={12}>  
                  <Typography gutterBottom className={classes.inputLabel} style={{ fontWeight: 600 }}>
                    {fileName}
                  </Typography>                
                </Grid>      
                <Grid item md={3} xs={12}>
                  <div className={classes.btnLineArea}>
                    <Button variant="contained" fullWidth type="submit" color="secondary" size="large" 
                      disabled={isLoading || !file.current}>                      
                      Upload Scripts
                    </Button>
                  </div>
                </Grid>                    
                <Grid item xs={12}>
                  {yt.use && (
                    <YouTube
                      videoId="bN0EhBA1rkM"
                      onReady={_onReady}
                      opts={opts}
                    />
                  )}
                </Grid>                             
              </Grid>
            </ValidatorForm>                    
          </div>   
        </Paper>
      </Container>
    </div>
  );
}

Capture.propTypes = {
  t: PropTypes.func.isRequired
};

export default withTranslation(['common'])(Capture);
