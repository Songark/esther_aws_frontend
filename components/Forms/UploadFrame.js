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
import { Box, Typography, Button, IconButton, ListItem, withStyles, Select, FormControl, MenuItem} from '@material-ui/core';
import config from "../../config";
import { s3UploadDocument, updateDocument, getUserRole, getDocumentsByUser, getCurrentWebsite} from "../../libs/awsLib";
import { Auth } from 'aws-amplify';
import MessageBox from '../Notification/MessageBox';
import PcMenu from './PcMenu';
import { GotoRoute } from "../../libs/baseLib";

function UploadFrame(props) {
  const file = useRef(null);  
  const classes = useStyles();
  const text = useText();
  const { t } = props;
  const title = "Manage Document"; // t('common:manage_document');
  const subtitle = t('common:login_subtitle');
  
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const [msgBox, showMsgBox] = useState(false);
  const [msgTitle, setMsgTitle] = useState("");
  const [msgContent, setMsgContent] = useState("");
  const [cognitoUser, setNewUser] = useState(null);
  const [userRole, setUserRole] = useState('');
  const [fileName, setFileName] = useState('No File Selected');
  const [newproject, setNewProject] = useState("");
  const [themeDesc, setThemeDesc] = useState("");
  const [projects, setProjects] = useState([]);  
  const [curproject, setCurProject] = useState("");
  const [documents, setDocuments] = useState(null);  
  const [deldocument, setDelDocument] = useState("");
  const [isMaxFileContent, setIsMaxFileContent] = useState(false);  
  const [isLoading, setIsLoading] = useState(false);
  const [uploadDocBucket, setUploadDocBucket] = useState("");
  const [uploadDocKey, setUploadDocKey] = useState("");
  const [oldContent, setOldContent] = useState("");
  const [reviewContent, setReviewContent] = useState("");
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

  function isAdminUser(currRole)
  {
    if (currRole) {
      if (currRole.toLowerCase() == 'super admin' || currRole.toLowerCase() == 'admin')
        return true;
    }
    return false;
  }

  async function getProjectsFromServer(currUser) {
    if (currUser) {
      const getUser = s => s.includes('@') && s.substr(s.lastIndexOf('@') + 1).split(' ')[0]      
      const bucketname = getUser(currUser['attributes']['email']);
      const destbucket = bucketname + "documentbucket2";   
      const s3params = {
        Bucket: destbucket,
        MaxKeys: 20,
        Delimiter: '/',
        Prefix: 'public/'
      };
      const data = await s3.listObjectsV2(s3params).promise();
      if (data && data.CommonPrefixes.length > 0) {        
        var currentProjects = [];
        data.CommonPrefixes.forEach(oneproject => {
          currentProjects.push(oneproject.Prefix);
        });
        if (currentProjects.length > 0)
          setCurProject(getOnlyProject(currentProjects[0]));
        setProjects(currentProjects);
      }
    }    
  };

  async function getDocumentsFromServer(currUser, currRole) {
    if (currUser && isAdminUser(currRole)) {
      const data = await getDocumentsByUser(currUser);      
      if (data && data.length > 0) {
        data.sort();
        setDocuments(data);          
        setDelDocument(data[0]);
        var result = await updateDocument(currUser, getUserIdFromData(data[0]), 'content_d', getProjectFromData(data[0]), getDocumentFromData(data[0]), '');
        setOldContent(result);
      }
      else {
        setDocuments(null);          
        setDelDocument("");
        setOldContent("");
        setReviewContent("");
      }
    }    
  };

  const handleChangeProject = event => {
    setNewProject(event.target.value);                                                        
  };                                                        

  const handleChangeTheme = event => {
    setThemeDesc(event.target.value);
  };

  const handleChangeReviewContent = event => {
    setReviewContent(event.target.value);
  };

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

  function handleOpenDocument() {
    if (typeof window !== "undefined" && uploadDocBucket.length > 0 && uploadDocKey.length > 0) {
      const s3Params = {
        Bucket: uploadDocBucket,
        Key: uploadDocKey + ''
      };
      s3.getSignedUrl('getObject', s3Params, (err, data) => {
        if (err) {
          console.log(err);
          return;
        }
        window.open(data, '_blank')
      });
    }
  }  

  async function handleCreateSubmit(event) {
    event.preventDefault();    
    if (cognitoUser && newproject.length > 0) {
      var currentProjects = projects;
      var newvalue = 'public/' + newproject + '/';
      currentProjects.push(newvalue);
      setCurProject(newproject);      
      setProjects(currentProjects);      
    }    
  }

  async function handleDeleteDocument() {
    if (cognitoUser) {
      if (userRole == 'User') {
        showMessageBox("Alarm", "You don't have privilege for deleting document.");
      }
      else {
        var result = await updateDocument(cognitoUser, getUserIdFromData(deldocument), 'delete_d', getProjectFromData(deldocument), getDocumentFromData(deldocument), '');
        showMessageBox("Alarm", result);
        getDocumentsFromServer(cognitoUser, userRole);  
      }
    }    
  }

  async function handleReviewDocument() {
    if (cognitoUser) {
      if (userRole == 'User') {
        showMessageBox("Alarm", "You don't have privilege for updating document.");
      }
      else {
        var result = await updateDocument(cognitoUser, getUserIdFromData(deldocument), 'update_d', getProjectFromData(deldocument), getDocumentFromData(deldocument), reviewContent);
        if (result.indexOf('success') >= 0) {
          setOldContent(reviewContent);  
        }      
        showMessageBox("Alarm", result);              
      }
    } 
  }

  async function handleUploadSubmit(event) {    
    event.preventDefault();
    setIsLoading(true);
    if (cognitoUser && file.current) {            
      const getUser = s => s.includes('@') && s.substr(s.lastIndexOf('@') + 1).split(' ')[0]      
      const bucketname = getUser(cognitoUser['attributes']['email']);
      const userid = cognitoUser['attributes']['sub'];
      const destbucket = bucketname + "documentbucket2";            
    
      try {
        let isExistSameFile = false;

        if (documents != null) {
          for (var i = 0; i < documents.length; i++) {
            let doc_entry = documents[i];
            if (file.current.name == getDocumentFromData(doc_entry)) {
              isExistSameFile = true;
              break;
            }
          }            
        }

        if (isExistSameFile) {
          showMessageBox("Alarm", "Please upload the file with different name.");
        }
        else {
          const filename = await s3UploadDocument(file.current.type == 'application/pdf' ? config.s3.UPPDFBUCKET : config.s3.UPIMGBUCKET, file.current, 
            curproject, userid, destbucket, themeDesc);  
                  
          showMessageBox("Success", "Uploaded on the server successfully.");
          setUploadDocBucket(destbucket);
          setUploadDocKey('public/' + curproject + '/' + filename);
          setTimeout(()=>{
            getDocumentsFromServer(cognitoUser, userRole);
          }, 3000);    
        }            
      } catch (e) {
        showMessageBox("Error", "Failed to upload on the server.");
        console.log(e);
      } 
      setIsLoading(false);  
    }
  }

  function changeProject(event)
  {    
    setCurProject(document.getElementById('select-project').value);
  }

  async function changeDeleteDocument(event)
  {    
    const selectedDocument = event.target.value;
    setDelDocument(selectedDocument);
    if (cognitoUser) {
      var result = await updateDocument(cognitoUser, getUserIdFromData(selectedDocument), 'content_d', getProjectFromData(selectedDocument), getDocumentFromData(selectedDocument), '');
      setOldContent(result);  
    }
  }

  async function clickUpdate(event) {
    setIsLoading(true);
    getDocumentsFromServer(cognitoUser, userRole);
    setIsLoading(false);
  }


  function getOnlyProject(fullproject)
  {
    var fields = fullproject.split("/");
    if (fields.length > 1)
      return fields[1];
    return "";
  }  

  function getDocumentFromData(fulldoc)
  {
    var fields = fulldoc.split("#$");
    if (fields.length > 1)
      return fields[1];
    return "";
  }  

  function getProjectFromData(fulldoc)
  {
    var fields = fulldoc.split("#$");
    if (fields.length > 1)
      return fields[0];
    return "";
  }  
  
  function getUserIdFromData(fulldoc)
  {
    var fields = fulldoc.split("#$");
    if (fields.length > 2)
      return fields[2];
    return "";
  }  

  function handleFileChange(event) {
    file.current = event.target.files[0];   
    if (file.current != null)
      setFileName(file.current.name);
    else
      setFileName('No File Selected');
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
      await Auth.currentSession();      
      const currUser = await Auth.currentUserPoolUser();      
      var currUrl = await getCurrentWebsite(currUser);
      setSelectedUrl(currUrl);
      setNewUser(currUser);     
      const currRole = await getUserRole(currUser);
      setUserRole(currRole);      
      getProjectsFromServer(currUser);
      getDocumentsFromServer(currUser, currRole);      
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
            <PcMenu parent='upload' userr={userRole}/>
          </div>
          <div className={classes.authFramePad}>            
            <ValidatorForm
              onError={errors => console.log(errors)}
              onSubmit={handleCreateSubmit}
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
                  Website For Testing : 
                  </Typography>         
                </Grid>
                <Grid item md={9} xs={12}>
                  <Typography variant="h5" className={classes.label_dark}>
                  {selectedUrl.length == 0 ? 'No selected, check on Profile page' : selectedUrl}
                  </Typography>                                         
                </Grid>        */}
                <Grid item xs={12}>
                  <TextValidator
                    variant="filled"
                    className={classes.input}
                    // label={t('common:project_name')}                  
                    label="Project Name"
                    name="projectname"   
                    value={newproject}                                 
                    onChange={handleChangeProject}
                  />
                </Grid>            
                <Grid item xs={12}>
                  <div className={classes.btnLineArea}>
                    <Button variant="contained" fullWidth type="submit" color="secondary" size="large" disabled={isLoading || newproject.length == 0}>
                      {/* {t('common:create_project')}                       */}
                      Create Project
                    </Button>
                  </div>
                </Grid>  
              </Grid>          
            </ValidatorForm>
            <ValidatorForm
              onError={errors => console.log(errors)}
              onSubmit={handleUploadSubmit}
            >
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <Typography gutterBottom variant="h5" className={classes.label_dark}>
                    {/* {t('common:select_upload')}                        */}
                    Select Project and Upload Document
                  </Typography>    
                  <select className = {classes.country} id="select-project" onChange={changeProject} value={curproject}>
                    {projects && projects.map((proj) => (
                      <option value={getOnlyProject(proj)} key={getOnlyProject(proj)}>
                        {getOnlyProject(proj)}
                      </option>
                    ))}
                  </select>                                    
                </Grid>      
                <Grid item md={4} xs={12}>  
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
                    {/* {t('common:choose_file')}   */}
                    Choose File (*.pdf|*.png|*.jpeg)
                  </Button>
                </label>
                </Grid>
                <Grid item md={4} xs={12}>  
                  <Typography gutterBottom className={classes.btnLineArea}>
                    {fileName}
                  </Typography>                
                </Grid>
                <Grid item md={4} xs={12}> 
                  <TextValidator
                    variant="filled"
                    className={classes.input}
                    label='Website Url'                  
                    name="theme"
                    value={themeDesc}                                    
                    onChange={handleChangeTheme}
                  />
                </Grid>  
                <Grid item md={6} xs={12}>   
                  <Button variant="contained" fullWidth type="submit" color="secondary" size="large" 
                    disabled={isLoading || !file.current || themeDesc.length == 0}>
                    {/* {t('common:upload_document')}   */}
                    Upload Document
                  </Button>
                </Grid>
                <Grid item md={6} xs={12}>                  
                  <Button variant="contained" fullWidth color="secondary" size="large" onClick={() => {handleOpenDocument();}} 
                    disabled={isLoading || !file.current || uploadDocBucket.length == 0}>                    
                    {/* {t('common:open_new_tab')}   */}
                    Open in New Tab
                  </Button>
                </Grid>

                {isAdminUser(userRole) &&
                  <Grid item xs={12}>
                  <Typography gutterBottom variant="h5" className={classes.label_dark}>
                    {/* {t('common:uploaded_document')}                        */}
                    Uploaded Document
                  </Typography>    
                  <FormControl variant="outlined" className={classes.select}>
                    <Select
                      labelId="demo-simple-select-outlined-label"
                      id="select_question"
                      value={deldocument}
                      onChange={changeDeleteDocument}
                    >
                      <MenuItem value="" onClick={clickUpdate}>
                        <em>** Update Documents **</em>
                      </MenuItem>
                      {documents && documents.map((doc) => (
                        <MenuItem value={doc}>{getDocumentFromData(doc) + '    (Website: ' + getProjectFromData(doc) + ')'}</MenuItem>
                      ))}                      
                    </Select>
                  </FormControl>
                </Grid>                   
                }

                {isAdminUser(userRole) &&      
                  <Grid item md={6} xs={12}>   
                    <TextValidator
                      variant="filled"
                      multiline 
                      rows={7}
                      rowsMax={7}
                      className={classes.input}
                      label='Current Content'                  
                      name="oldContent"
                      value={oldContent}                                    
                    />
                  </Grid>    
                }           

                {isAdminUser(userRole) &&      
                  <Grid item md={6} xs={12}>   
                    <TextValidator
                      variant="filled"
                      multiline 
                      rows={7}
                      rowsMax={7}
                      className={classes.input}
                      label='Review Content'                  
                      name="reviewContent"
                      value={reviewContent}      
                      onChange={handleChangeReviewContent}                              
                    />
                  </Grid>       
                }   
                
                {isAdminUser(userRole) &&
                  <Grid item md={6} xs={12}>   
                    <Button variant="contained" fullWidth color="secondary" size="large"  onClick={() => {handleDeleteDocument();}}
                      disabled={isLoading || deldocument.length == 0 || userRole == 'User'}>
                      {/* {t('common:delete_document')}   */}
                      Delete Document
                    </Button>
                  </Grid>
                }

                {isAdminUser(userRole) &&
                  <Grid item md={6} xs={12}>
                    <Button variant="contained" fullWidth color="secondary" size="large" onClick={() => {handleReviewDocument();}}
                      disabled={isLoading || deldocument.length == 0 || userRole == 'User'}>
                      {/* {t('common:update_document')} */}
                      Update Document
                    </Button>
                  </Grid>         
                }
              </Grid>
            </ValidatorForm>            
          </div>
        </Paper>
      </Container>
    </div>
  );
}

UploadFrame.propTypes = {
  t: PropTypes.func.isRequired
};

export default withTranslation(['common'])(UploadFrame);
