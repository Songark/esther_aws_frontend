import React from 'react';
import PropTypes from 'prop-types';
import { withTranslation } from '~/i18n';
import routerLink from '~/public/text/link';
import useStyles from './form-style';
import Grid from '@material-ui/core/Grid';
import { useTheme } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import HomeIcon from '@material-ui/icons/Home';
import AccountBoxIcon from '@material-ui/icons/AccountBox';
import PostAddIcon from '@material-ui/icons/PostAdd';
import BackupIcon from '@material-ui/icons/Backup';
import InsertPhotoIcon from '@material-ui/icons/InsertPhoto';
import ChatIcon from '@material-ui/icons/Chat';
import SpellcheckIcon from '@material-ui/icons/Spellcheck';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import LibraryAddCheckIcon from '@material-ui/icons/LibraryAddCheck';


function PcMenu(props) {
  const classes = useStyles();
  const { parent, userr } = props;

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  var nblank = 11;
  nblank--;
  if (parent != 'auth') nblank--;
  if (userr != '' && userr != 'Trainer' && parent != 'chatbot') nblank--;
  if (userr != '' && userr != 'Trainer' && parent != 'upload') nblank--;
  if (userr != '' && userr != 'User' && parent != 'capture') nblank--;
  if (userr != '' && userr != 'User' && parent != 'training') nblank--;

  function renderMobile() {
    return (  
      <Grid container spacing={0} >                  
        {<Grid item xs>                
          <div className={classes.framehead}>  
            <IconButton href={routerLink.saas.home} className={classes.backtohomelight}>
              <HomeIcon fontSize='small'/>
            </IconButton>                                                                      
          </div>                          
        </Grid>}             
        {parent != 'auth' && <Grid item xs>                
          <div className={classes.framehead}>  
            <IconButton href={routerLink.saas.profile} className={classes.backtohomelight}>
              <AccountBoxIcon fontSize='small'/>
            </IconButton>                                                                        
          </div>            
        </Grid>}  
        {userr != '' && userr != 'Trainer' && parent != 'chatbot' && <Grid item xs>                
          <div className={classes.framehead}>  
            <IconButton href={routerLink.saas.chatbot} className={classes.backtohomelight}>
              <ChatIcon fontSize='small'/>
            </IconButton>                                                                        
          </div>            
        </Grid>}  
        {userr != '' && userr != 'Trainer' && parent != 'upload' && <Grid item xs>                
          <div className={classes.framehead}>  
            <IconButton href={routerLink.saas.upload} className={classes.backtohomelight}>
              <BackupIcon fontSize='small'/>
            </IconButton>                                                                        
          </div>            
        </Grid>}   
        {userr != '' && userr != 'User' && parent != 'capture' && <Grid item xs>                
          <div className={classes.framehead}>  
            <IconButton href={routerLink.saas.capture} className={classes.backtohomelight}>
              <InsertPhotoIcon fontSize='small'/>                    
            </IconButton>                                                                      
          </div>            
        </Grid>}  
        {userr != '' && userr != 'User' && parent != 'training' && <Grid item xs>                
          <div className={classes.framehead}>  
            <IconButton href={routerLink.saas.training} className={classes.backtohomelight}>
              <LibraryAddCheckIcon fontSize='small'/>                    
            </IconButton>                                                                      
          </div>            
        </Grid>}           
        {userr != '' && <Grid item xs>                
          <div className={classes.framehead}>  
            <IconButton href={routerLink.saas.logout} className={classes.backtohomelight}>
              <ExitToAppIcon fontSize='small'/>
            </IconButton>                                                                      
          </div>            
        </Grid>}   
      </Grid>       
      );
  }

  function renderPC() {
    return (   
    <Grid container spacing={0}>         
      {<Grid item md={1} xs={12}>                
        <div className={classes.framehead}>  
          <IconButton href={routerLink.saas.home} className={classes.backtohomelight}>
            <HomeIcon fontSize='large'/>
          </IconButton>                                                                      
        </div>                          
      </Grid>}             
      {parent != 'auth' && <Grid item md={1} xs={12}>                
        <div className={classes.framehead}>  
          <IconButton href={routerLink.saas.profile} className={classes.backtohomelight}>
            <AccountBoxIcon fontSize='large'/>
          </IconButton>                                                                        
        </div>            
      </Grid>}  
      {userr != '' && userr != 'Trainer' && parent != 'chatbot' && <Grid item md={1} xs={12}>                
        <div className={classes.framehead}>  
          <IconButton href={routerLink.saas.chatbot} className={classes.backtohomelight}>
            <ChatIcon fontSize='large'/>
          </IconButton>                                                                        
        </div>            
      </Grid>}  
      {userr != '' && userr != 'Trainer' && parent != 'upload' && <Grid item md={1} xs={12}>                
        <div className={classes.framehead}>  
          <IconButton href={routerLink.saas.upload} className={classes.backtohomelight}>
            <BackupIcon fontSize='large'/>
          </IconButton>                                                                        
        </div>            
      </Grid>}   
      {userr != '' && userr != 'User' && parent != 'capture' && <Grid item md={1} xs={12}>                
        <div className={classes.framehead}>  
          <IconButton href={routerLink.saas.capture} className={classes.backtohomelight}>
            <InsertPhotoIcon fontSize='large'/>                    
          </IconButton>                                                                      
        </div>            
      </Grid>}  
      {userr != '' && userr != 'User' && parent != 'training' && <Grid item md={1} xs={12}>                
        <div className={classes.framehead}>  
          <IconButton href={routerLink.saas.training} className={classes.backtohomelight}>
            <LibraryAddCheckIcon fontSize='large'/>                    
          </IconButton>                                                                      
        </div>            
      </Grid>}           
      {<Grid item md={nblank} xs={12}></Grid>}
      {userr != '' && <Grid item md={1} xs={12}>                
        <div className={classes.framehead}>  
          <IconButton href={routerLink.saas.logout} className={classes.logoutlight}>
            <ExitToAppIcon fontSize='large'/>
          </IconButton>                                                                      
        </div>            
      </Grid>}   
    </Grid> 
    );
  }

  return (
    <div className={classes.framemenu}>
      {isMobile ? renderMobile() : renderPC() }
    </div>    
  );
}

PcMenu.propTypes = {  
  parent: PropTypes.string.isRequired,
  userr: PropTypes.string.isRequired,
};

export default PcMenu;
