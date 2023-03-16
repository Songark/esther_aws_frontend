import React, { useRef, useState, useEffect } from "react";
import AWS from 'aws-sdk';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import Hidden from '@material-ui/core/Hidden';
import Paper from '@material-ui/core/Paper';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import brand from '~/public/text/brand';
import routerLink from '~/public/text/link';
import logo from '~/public/images/saas-logo.png';
import { useText } from '~/theme/common';
import useStyles from './form-style';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { useTheme } from '@material-ui/core/styles';
import { withTranslation } from '~/i18n';
import { AmplifyTheme } from 'aws-amplify-react';
import { ValidatorForm, TextValidator } from 'react-material-ui-form-validator';
import { Box, Typography, Button, IconButton, ListItem, withStyles, FormControlLabel, Checkbox, Select, FormControl, MenuItem} from '@material-ui/core';
import config from "../../config";
import { getQuestions, setQuestionAnswer, getUserRole, getCurrentWebsite } from "../../libs/awsLib";
import { Auth } from 'aws-amplify';
import MessageBox from '../Notification/MessageBox'
import { GotoRoute } from "../../libs/baseLib";
import PcMenu from './PcMenu';

function TrainingFrame(props) {
  const file = useRef(null);  
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
  const [questions, setQuestions] = useState([]);  
  const [curQuestion, setCurQuestion] = useState("");
  const [oldAnswer, setOldAnswer] = useState("");
  const [newAnswer, setNewAnswer] = useState("");
  const [checkCorrect, setCheck] = useState(false);
  const [selectedUrl, setSelectedUrl] = useState("");

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

  async function handleTrainSubmit(event) {
    event.preventDefault();    
    if (curQuestion.length > 0 && newAnswer.length > 0) {
      const result = await setQuestionAnswer(getOnlyUserId(curQuestion), getOnlyQuestion(curQuestion), newAnswer);
      if (result.length > 0) {        
        showMessageBox("Alarm", result);
        if (result.indexOf('success') >= 0) {
          updateQuestions(cognitoUser);
        }
      }
    }    
  }

  async function changeQuestion(event) {
    const selectedQuestion = event.target.value;
    if (selectedQuestion.length > 0) {
      setCurQuestion(selectedQuestion);
      setOldAnswer(getOnlyOldAnswer(selectedQuestion));    
      setNewAnswer(getOnlyNewAnswer(selectedQuestion));
      if (getOnlyIncorrect(selectedQuestion) == 'yes') {
        setCheck(true);
      }
      else {
        setCheck(false);
      }      
    }
  }

  async function clickUpdate(event) {
    setIsLoading(true);
    updateQuestions(cognitoUser);
    setIsLoading(false);
  }

  const handleChangeNewAnswer = event => {
    setNewAnswer(event.target.value);                                                        
  };  

  const handleCheck = event => {
    setCheck(event.target.checked);
  };

  async function updateQuestions(currUser)
  {
    const data = await getQuestions(currUser);      
    if (data && data.length > 0) {
      data.sort();
      setQuestions(data);     
      setCurQuestion(data[0]);
      setOldAnswer(getOnlyOldAnswer(data[0]));  
      setNewAnswer(getOnlyNewAnswer(data[0]));    
      if (getOnlyIncorrect(data[0]) == 'yes') {
        setCheck(true);
      }
      else {
        setCheck(false);
      }       
    }
    else {
      setQuestions(null);  
      setNewAnswer('');            
    }
  }

  function changeTestUrl(event)
  {
    for (let node of event.target.children) {
      if (node.value === event.target.value) {        
        
        return;
      }
    }
  }
  
  async function onLoad() {    
    try {
      setIsLoading(true);
      const currUser = await Auth.currentUserPoolUser();      
      setNewUser(currUser);     
      var currUrl = await getCurrentWebsite(currUser);
      setSelectedUrl(currUrl);
      const currRole = await getUserRole(currUser);
      setUserRole(currRole);       
      updateQuestions(currUser);   
      setIsLoading(false);
    }
    catch(e) {   
      console.log(e);   
    }
  }

  useEffect(() => {        
    onLoad();
  }, []);

  function getOnlyQuestion(fullquestion)
  {
    var fields = fullquestion.split("#$");
    if (fields.length > 4)
      return fields[0];
    return "";
  }  

  function getOnlyOldAnswer(fullquestion)
  {
    var fields = fullquestion.split("#$");
    if (fields.length > 4)
      return fields[1];
    return "";
  }  

  function getOnlyNewAnswer(fullquestion)
  {
    var fields = fullquestion.split("#$");
    if (fields.length > 4)
      return fields[2];
    return "";
  }  

  function getOnlyIncorrect(fullquestion)
  {
    var fields = fullquestion.split("#$");
    if (fields.length > 4)
      return fields[3];
    return "";
  }  

  function getOnlyUserId(fullquestion)
  {
    var fields = fullquestion.split("#$");
    if (fields.length > 4)
      return fields[4];
    return "";
  }  

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
            <PcMenu parent='training' userr={userRole}/>
          </div>     
          <div className={classes.authFramePad}>                   
            <ValidatorForm
              onError={errors => console.log(errors)}
              onSubmit={handleTrainSubmit}
            >
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <div className={classes.framehead}>                   
                    <Typography gutterBottom variant="h4" className={classes.label_dark}>
                      { title }
                    </Typography>                    
                  </div>
                </Grid>
                {/* <Grid item md={3} xs={12}>
                  <Typography gutterBottom variant="h5" className={classes.label_dark}>
                  Website For Testing
                  </Typography>         
                </Grid>
                <Grid item md={9} xs={12}>
                  <Typography variant="h5" className={classes.label_dark}>
                  {selectedUrl.length == 0 ? 'No selected, check on Profile page' : selectedUrl}
                  </Typography>                                         
                </Grid>        */}
                <Grid item xs={12}>
                  <Typography gutterBottom variant="h5" className={classes.label_dark}>                    
                    Select Question
                  </Typography>    
                  <FormControl variant="outlined" className={classes.select}>
                    <Select
                      labelId="demo-simple-select-outlined-label"
                      id="select_question"
                      value={curQuestion}
                      onChange={changeQuestion}
                    >
                      <MenuItem value="" onClick={clickUpdate}>
                        <em>** Update Questions **</em>
                      </MenuItem>
                      {questions && questions.map((question) => (
                        <MenuItem value={question}>{getOnlyQuestion(question)}</MenuItem>
                      ))}                      
                    </Select>
                  </FormControl>
                </Grid>      
                <Grid item xs={12}>
                  <Typography gutterBottom variant="h5" className={classes.label_dark}>                    
                    Old Answer
                  </Typography>    
                  <FormControlLabel
                    control={(
                      <Checkbox
                        checked={checkCorrect}
                        onChange={(e) => handleCheck(e)}
                        color="secondary"
                        value={checkCorrect}                          
                        className={classes.check}
                      />
                    )}
                    label={(
                      <span className={text.caption}>
                        Incorrect
                      </span>
                    )}
                  />     
                  <TextValidator
                    variant="filled"
                    multiline
                    rows={4}
                    rowsMax={4}
                    className={classes.input}                    
                    label="Old Answer"
                    name="oldanswer"   
                    value={oldAnswer}                                                     
                  />
                </Grid>
                <Grid item xs={12}>
                    <Typography gutterBottom variant="h5" className={classes.label_dark}>                    
                      New Answer
                    </Typography>                                         
                    <TextValidator
                      variant="filled"
                      multiline
                      rows={4}
                      rowsMax={4}
                      className={classes.input}                    
                      label="New Answer"
                      name="newanswer"   
                      value={newAnswer}  
                      onChange={handleChangeNewAnswer}                                                   
                    />
                </Grid>  
                <Grid item md={4} xs={12}>   
                </Grid>
                <Grid item md={4} xs={12}>   
                  <Button variant="contained" fullWidth type="submit" color="secondary" size="large" 
                    disabled={isLoading}>                    
                    Update New Answer
                  </Button>
                </Grid>
                <Grid item md={4} xs={12}>   
                </Grid>        
              </Grid>
            </ValidatorForm>
          </div>   
        </Paper>
      </Container>
    </div>
  );
}

TrainingFrame.propTypes = {
  t: PropTypes.func.isRequired
};

export default withTranslation(['common'])(TrainingFrame);
