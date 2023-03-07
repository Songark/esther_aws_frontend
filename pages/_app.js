import React, { useState, useEffect } from 'react';
import App from 'next/app';
import PropTypes from 'prop-types';
import {
  ThemeProvider ,
  createMuiTheme,
  StylesProvider,
  jssPreset
} from '@material-ui/core/styles';
import { create } from 'jss';
import { PageTransition } from 'next-page-transitions';
import rtl from 'jss-rtl';
import CssBaseline from '@material-ui/core/CssBaseline';
import LoadingBar from 'react-top-loading-bar';
import { i18n, appWithTranslation } from '../i18n';
import appTheme from '../theme/appTheme';
/* import css vendors */
import '../node_modules/animate.css/animate.css';
import '../vendors/animate-extends.css';
import '../vendors/top-loading-bar.css';
import '../vendors/page-transition.css';
import '../vendors/slick/slick.css';
import '../vendors/slick/slick-theme.css';
import routeLink from '~/public/text/link';
import MessageBox from '../components/Notification/MessageBox'
import { Auth } from 'aws-amplify';
import { AppContext } from "../libs/contextLib";
import { onError } from "../libs/errorLib";
import { GotoRoute } from "../libs/baseLib";
import { configureAmplify } from "../libs/configure";
import { Redirect } from 'react-router';
import { getUserRole, setChatData } from "../libs/awsLib";

if (typeof window !== "undefined") {
  // window.LOG_LEVEL='DEBUG';
}

let themeType = 'light';
if (typeof Storage !== 'undefined') { // eslint-disable-line
  themeType = localStorage.getItem('luxiTheme') || 'light';
}

function MyApp(props) {
  configureAmplify();
  const [isAuthenticating, setIsAuthenticating] = useState(true);
  const [currUserRole, setUserRole] = useState("User");
  const [cognitoUser, setNewUser] = useState(null);
  const [loading, setLoading] = useState(0);
  
  const [msgBox, showMsgBox] = useState(false);
  const [msgTitle, setMsgTitle] = useState("");
  const [msgContent, setMsgContent] = useState("");

  const [theme, setTheme] = useState({
    ...appTheme('deepBlue', themeType),
    direction: i18n.language === 'ar' ? 'rtl' : 'ltr'
  });

  useEffect(() => {
    // Set layout direction
    document.dir = i18n.language === 'ar' ? 'rtl' : 'ltr';

    // Remove preloader
    const preloader = document.getElementById('preloader');
    if (preloader !== null || undefined) {
      preloader.remove();
    }

    // Remove loading bar
    // setLoading(0);
    // setTimeout(() => { setLoading(100); }, 2000);
    setLoading(100);

    // Refresh JSS in SSR
    const jssStyles = document.querySelector('#jss-server-side');
    if (jssStyles) {
      jssStyles.parentNode.removeChild(jssStyles);
    }

    onLoad();
  }, []);

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

  async function onLoad() {
    try {
      await Auth.currentSession();      
      const currUser = await Auth.currentUserPoolUser();
      setNewUser(currUser); 
      const currRole = await getUserRole(currUser);
      setUserRole(currRole);   
    }
    catch(e) {      
      if (e !== undefined) {  
        if (e !== 'No current user') {
          if (typeof e === 'string')
            showMessageBox('Alarm', e);
          else
            showMessageBox('Alarm', e.message);
        } 
        setChatData(null);
        if (router.route == routeLink.saas.chatbot || 
            router.route + '/' == routeLink.saas.chatbot || 
            router.route == routeLink.saas.upload || 
            router.route + '/' == routeLink.saas.upload ||
            router.route == routeLink.saas.profile || 
            router.route + '/' == routeLink.saas.profile ||
            router.route == routeLink.saas.users || 
            router.route + '/' == routeLink.saas.users || 
            router.route == routeLink.saas.training || 
            router.route + '/' == routeLink.saas.training ||
            router.route == routeLink.saas.capture || 
            router.route + '/' == routeLink.saas.capture) {
          GotoRoute(routeLink.saas.login);
        }                
      }      
    }
    setIsAuthenticating(false);
  }

  const toggleDarkTheme = () => {
    const newPaletteType = theme.palette.type === 'light' ? 'dark' : 'light';
    localStorage.setItem('luxiTheme', theme.palette.type === 'light' ? 'dark' : 'light');
    setTheme({
      ...appTheme('violeta', newPaletteType),
      direction: theme.direction,
    });
  };

  const toggleDirection = dir => {
    document.dir = dir;
    setTheme({
      ...theme,
      direction: dir,
      palette: {
        ...theme.palette
      }
    });
  };

  const muiTheme = createMuiTheme(theme);
  const { Component, pageProps, router } = props; // eslint-disable-line
  const jss = create({ plugins: [...jssPreset().plugins, rtl()] });
  
  return (    
    <div>
      <AppContext.Provider value={{currUserRole, cognitoUser, setNewUser}}>
        <StylesProvider jss={jss}>
          <ThemeProvider theme={muiTheme}>
            <CssBaseline />
            <LoadingBar
              height={0}
              color={theme.palette.primary.light}
              progress={loading}
              className="top-loading-bar"
            />
            <div id="main-wrap">
              {msgBox && <MessageBox title={msgTitle} message={msgContent} onClose={handleCloseMessageBox}/>}
              <PageTransition timeout={300} classNames="page-fade-transition">
                <Component
                  {...pageProps}
                  onToggleDark={toggleDarkTheme}
                  onToggleDir={toggleDirection}
                  key={router.route}                                    
                />
              </PageTransition>
            </div>
          </ThemeProvider>
        </StylesProvider>
      </AppContext.Provider>
    </div>
  );
}

MyApp.propTypes = {
  Component: PropTypes.elementType.isRequired,
  pageProps: PropTypes.object.isRequired
};

MyApp.getInitialProps = async (appContext) => ({...await App.getInitialProps(appContext) })

export default appWithTranslation(MyApp);
