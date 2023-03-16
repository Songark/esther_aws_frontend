import { makeStyles } from '@material-ui/core/styles';
import { fade, darken } from '@material-ui/core/styles/colorManipulator';

const contactStyles = makeStyles(theme => ({
  title: {},
  pageWrap: {
    textAlign: 'center',
    background: theme.palette.primary.dark,
    minHeight: '100%',
    position: 'relative',
    width: '100%',
    alignItems: 'center',
    padding: theme.spacing(10, 5),
    [theme.breakpoints.up('md')]: {
      display: 'flex',
    },
    [theme.breakpoints.down('sm')]: {
      padding: theme.spacing(5, 0)
    },
    '& $title': {
      color: theme.palette.type === 'light' ? theme.palette.common.main : theme.palette.common.white
    },
    '& a': {
      color: theme.palette.type === 'light' ? theme.palette.primary.dark : theme.palette.primary.light,
      textTransform: 'none',
      fontSize: 16,
      textDecoration: 'none',
      fontWeight: theme.typography.fontWeightRegular,
      [theme.breakpoints.down('xs')]: {
        fontSize: 14
      },
    }
  },
  pageWrapLight: {
    textAlign: 'center',
    background: theme.palette.primary.light,
    minHeight: '100%',
    position: 'relative',
    width: '100%',
    alignItems: 'center',
    padding: theme.spacing(10, 5),
    [theme.breakpoints.up('md')]: {
      display: 'flex',
    },
    [theme.breakpoints.down('sm')]: {
      padding: theme.spacing(5, 0)
    },
    '& $title': {
      color: theme.palette.type === 'light' ? theme.palette.common.main : theme.palette.common.white
    },
    '& a': {
      color: theme.palette.type === 'light' ? theme.palette.primary.dark : theme.palette.primary.light,
      textTransform: 'none',
      fontSize: 16,
      textDecoration: 'none',
      fontWeight: theme.typography.fontWeightRegular,
      [theme.breakpoints.down('xs')]: {
        fontSize: 14
      },
    }
  },
  innerWrap: {
    textAlign: 'left',
  },
  fullFromWrap: {
    color: theme.palette.common.white,
    paddingTop: theme.spacing(8),
    [theme.breakpoints.down('xs')]: {
      paddingTop: theme.spacing(4)
    }
  },
  formBox: {
    borderRadius: 40,
    overflow: 'hidden',
    background: 'transparent',
    boxShadow: '0 1.5px 12px 2px rgba(0, 0, 0, 0.28)',
    [theme.breakpoints.down('xs')]: {
      boxShadow: 'none'
    },
    [theme.breakpoints.down('sm')]: {      
      marginTop: theme.spacing(4)  
    }
  },
  desc: {
    color: theme.palette.common.white,
    textAlign: 'center',
    padding: theme.spacing(0, 10),
    [theme.breakpoints.down('xs')]: {
      padding: theme.spacing(0, 2),
    }
  },
  title2: {
    color: theme.palette.common.white,
    textAlign: 'left',
    padding: theme.spacing(0, 10),
    [theme.breakpoints.down('xs')]: {
      padding: theme.spacing(0, 2),
    }
  },
  title2_dark: {
    color: theme.palette.primary.main,
    textAlign: 'left',
    padding: theme.spacing(0, 7),
    [theme.breakpoints.down('xs')]: {
      padding: theme.spacing(0, 2),
    }
  },
  label_dark: {
    color: theme.palette.primary.main,
    textAlign: 'left',
    padding: theme.spacing(0, 0),
    [theme.breakpoints.down('xs')]: {
      padding: theme.spacing(0, 1),
    }
  },
  profile_dark: {
    color: theme.palette.primary.main,
    textAlign: 'left',
    padding: theme.spacing(1, 0),
  },
  light: {},
  country: {
    width: '100%',
    height: 50,
    border: `1px solid ${fade(theme.palette.text.primary, 0.25)}`,
    overflow: 'hidden',
    paddingLeft: theme.spacing(2),
    borderRadius: 15,
    fontSize: 18,
    color: theme.palette.common.country,
  },
  select: {
    width: '100%',       
  },
  userrole: {
    width: '100%',
    height: 40,
    border: `1px solid ${fade(theme.palette.text.primary, 0.25)}`,
    overflow: 'hidden',
    paddingLeft: theme.spacing(2),
    borderRadius: 12,
    fontSize: 18,
    color: theme.palette.common.country,
  },
  input: {
    width: '100%',
    '& label': {
      left: theme.spacing(0.5),
    },    
    '& > div': {
      border: `1px solid ${fade(theme.palette.text.primary, 0.25)}`,
      background: 'none',
      overflow: 'hidden',
      '& input': {
        paddingLeft: theme.spacing(2),
        '&:focus': {
          background: fade(theme.palette.background.paper, 0.7)
        },
        '&:hover': {
          background: fade(theme.palette.background.paper, 0.7)
        }
      }
    },
    '&$light': {
      '& label': {
        color: theme.palette.common.white,
      },
      '& > div': {
        border: `1px solid ${fade(theme.palette.primary.light, 0.5)}`,
        '& input': {
          color: theme.palette.common.white,
          '&:focus': {
            background: fade(theme.palette.text.hint, 0.2)
          },
          '&:hover': {
            background: fade(theme.palette.text.hint, 0.2)
          }
        },
      }
    }
  },
  form: {
    textAlign: 'left',
    position: 'relative',
    marginTop: theme.spacing(8),
    padding: theme.spacing(0, 15, 10),
    [theme.breakpoints.down('sm')]: {
      padding: theme.spacing(0, 4, 10)
    },
    [theme.breakpoints.down('xs')]: {
      padding: theme.spacing(2, 1),
      marginTop: theme.spacing(2),
    },
  },
  formHelper: {
    display: 'flex',
    marginTop: theme.spacing(),
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    [theme.breakpoints.down('xs')]: {
      flexDirection: 'column',
      alignItems: 'center',
    }
  },
  flex: {},
  btnArea: {
    justifyContent: 'space-between',
    [theme.breakpoints.up('sm')]: {
      marginTop: theme.spacing(4),
      marginBottom: theme.spacing(3),
      display: 'flex',
    },
    [theme.breakpoints.down('sm')]: {
      '& button': {
        marginTop: theme.spacing(4),
        width: '100%'
      }
    },
    [theme.breakpoints.down('xs')]: {
      marginTop: theme.spacing(1),
      marginBottom: theme.spacing(1),
      '& button': {
        marginTop: theme.spacing(0),
        width: '100%'
      }
    },
    '& button': {
      minHeight: 48,
      minWidth: 180
    },
    '& span': {
      '& a': {
        textDecoration: 'none !important',
        color: theme.palette.secondary.main,
      }
    },
    '&$flex': {
      display: 'flex',
      justifyContent: 'space-between',
      [theme.breakpoints.down('sm')]: {
        display: 'block'
      }
    },
  },
  btnAreaLight: {
    justifyContent: 'space-between',
    [theme.breakpoints.up('sm')]: {
      marginTop: theme.spacing(5),
      marginBottom: theme.spacing(3),
      display: 'flex',
    },
    [theme.breakpoints.down('sm')]: {
      '& button': {
        marginTop: theme.spacing(4),
        width: '100%'
      }
    },
    [theme.breakpoints.down('xs')]: {
      marginTop: theme.spacing(1),
      marginBottom: theme.spacing(1)
    },
    '& button': {
      marginTop: theme.spacing(2),
      minHeight: 48,
      minWidth: 180,
      color: theme.palette.primary.light,
    },
    '& span': {
      color: theme.palette.primary.light,
      '& a': {
        textDecoration: 'none !important',        
      }
    },
    '&$flex': {
      display: 'flex',
      justifyContent: 'space-between',
      [theme.breakpoints.down('sm')]: {
        display: 'block'
      }
    },
  },
  btnLineArea: {
    justifyContent: 'space-between',
    [theme.breakpoints.up('sm')]: {
      marginTop: theme.spacing(1),
      display: 'flex',
    },
    [theme.breakpoints.down('sm')]: {
      '& button': {
        width: '100%'
      }
    },
    [theme.breakpoints.down('xs')]: {
      marginBottom: theme.spacing(1)
    },
    '& button': {
      minHeight: 48,
      minWidth: 180
    },
    '& span': {
      height: 36,      
      '& a': {
        textDecoration: 'none !important',
        color: theme.palette.secondary.main,
      }
    },
    '&$flex': {
      display: 'flex',
      justifyContent: 'space-between',
      [theme.breakpoints.down('sm')]: {
        display: 'block'
      }
    },
  },
  inputLabel: {
    justifyContent: 'space-between',
    [theme.breakpoints.up('sm')]: {
      marginTop: theme.spacing(2),
      display: 'flex',
    },    
    [theme.breakpoints.down('xs')]: {
      marginBottom: theme.spacing(1),
      marginLeft: theme.spacing(2),
    }
  },
  primary: {
    background: theme.palette.primary.main,
    position: 'absolute',
    opacity: 0.08,
    transform: 'rotate(45deg)',
  },
  secondary: {
    background: theme.palette.secondary.main,
    position: 'absolute',
    opacity: 0.1,
    transform: 'rotate(45deg)',
  },
  decoTop: {
    '& $primary': {
      borderRadius: 80,
      width: 405,
      height: 405,
      top: -200,
      right: -50,
    },
    '& $secondary': {
      borderRadius: 40,
      width: 205,
      height: 205,
      top: 24,
      right: -100,
    }
  },
  decoBottom: {
    '& $primary': {
      borderRadius: 40,
      width: 205,
      height: 205,
      bottom: 180,
      left: -110,
    },
    '& $secondary': {
      borderRadius: 80,
      width: 405,
      height: 405,
      bottom: -100,
      left: -100,
    }
  },
  rightIcon: {
    marginLeft: theme.spacing()
  },
  backtohome: {
    width: 80,
    height: 80,
    position: 'absolute',
    marginTop: 20,
    marginLeft: 20,
    zIndex: 20,
    [theme.breakpoints.down('sm')]: {
      left: 'calc(50% - 40px)',
      top: 40,
      margin: 0,
    },
    [theme.breakpoints.up('md')]: {
      marginTop: 20,
      marginLeft: 20,
    },
    [theme.breakpoints.down('sm')]: {
      display: 'none'
    },
    '& i': {
      fontSize: 32,
      color: fade(theme.palette.background.paper, 0.54)
    },
    '& > span i:first-child': {
      opacity: 1,
      transition: 'opacity 0.3s ease'
    },
    '& > span i:last-child': {
      position: 'absolute',
      right: 0,
      opacity: 0,
      transition: 'all 0.3s ease'
    },
    '&:hover': {
      '& > span i:first-child': {
        opacity: 0,
      },
      '& > span i:last-child': {
        right: 30,
        opacity: 1,
      },
    }
  },
    
  backtohomelight: {
    width: 80,
    height: 80,
    zIndex: 20,
    marginTop: 10,
    [theme.breakpoints.down('sm')]: {
      left: 'calc(50% - 40px)',
      top: 40,
      margin: 0,
    },
    [theme.breakpoints.up('md')]: {
      marginLeft: 40,
    },
    [theme.breakpoints.down('sm')]: {
      //display: 'none'
      marginTop: 0,
      width: 40,
      height: 40,
    },
    '& i': {
      fontSize: 40,
      color: fade(theme.palette.primary.dark, 0.54)
    },
    '& > span i:first-child': {
      opacity: 1,
      transition: 'opacity 0.3s ease'
    },
    '& > span i:last-child': {
      position: 'absolute',
      right: 0,
      opacity: 0,
      transition: 'all 0.3s ease'
    },
    '&:hover': {
      '& > span i:first-child': {
        opacity: 0,
      },
      '& > span i:last-child': {
        right: 30,
        opacity: 1,
      },
    }
  },
  logoutlight: {
    width: 80,
    height: 80,    
    zIndex: 20,
    marginTop: 10,
    [theme.breakpoints.down('sm')]: {
      left: 'calc(50% - 40px)',
      top: 40,
      margin: 0,
    },
    [theme.breakpoints.down('sm')]: {
      display: 'none'
    },
    '& i': {
      fontSize: 40,
      color: fade(theme.palette.primary.dark, 0.54)
    },
    '& > span i:first-child': {
      opacity: 1,
      transition: 'opacity 0.3s ease'
    },
    '& > span i:last-child': {
      position: 'absolute',
      right: 0,
      opacity: 0,
      transition: 'all 0.3s ease'
    },
    '&:hover': {
      '& > span i:first-child': {
        opacity: 0,
      },
      '& > span i:last-child': {
        right: 30,
        opacity: 1,
      },
    }
  },

  check: {
    '& svg': {
      fill: theme.palette.secondary.main
    }
  },
  decoration: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    top: 0,
    left: 0,
    overflow: 'hidden',
    clip: 'rect(0, auto, auto, 0)',
    '& svg': {
      fill: theme.palette.secondary.main,
      opacity: 0.2,
      position: 'fixed',
      top: 0,
    }
  },
  leftDeco: {
    left: theme.direction === 'rtl' ? 'auto' : -400,
    right: theme.direction === 'rtl' ? '-50%' : 'auto',
    width: 1200,
    height: 1500,
    transformOrigin: 'top left',
    [theme.breakpoints.up('md')]: {
      transform: 'scale(0.8)',
    }
  },
  rightDeco: {
    left: theme.direction === 'rtl' ? -150 : 'auto',
    right: theme.direction === 'rtl' ? 'auto' : 0,
    height: 1500,
    transformOrigin: 'top right',
    [theme.breakpoints.up('md')]: {
      transform: 'scale(0.8)',
    }
  },
  authFrame: {
    [theme.breakpoints.down('sm')]: {
      background: theme.palette.common.white      
    },
    display: 'block',
    position: 'relative'
  },
  authFramePad: {    
    [theme.breakpoints.down('sm')]: {
      background: theme.palette.common.white      
    },
    position: 'relative',
    padding: theme.spacing(2),
    [theme.breakpoints.up('sm')]: {
      padding: theme.spacing(5)
    },
    [theme.breakpoints.up('lg')]: {
      padding: theme.spacing(8),
      paddingTop: theme.spacing(2)
    }
  },
  greeting: {
    display: 'flex',
    paddingTop: theme.spacing(16),
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'flex-start',
    height: '100%',
    textAlign: 'center',
    color: theme.palette.common.white,
    '& h6': {
      fontWeight: theme.typography.fontWeightRegular
    }
  },
  framehead: {
    display: 'flex',    
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'flex-start',
    height: '100%',
    textAlign: 'center',
    color: theme.palette.common.white,
    '& h6': {
      fontWeight: theme.typography.fontWeightRegular
    }
  },
  framemenu: {
    [theme.breakpoints.down('sm')]: {
      background: theme.palette.common.white,
      paddingTop: theme.spacing(1)  
    }
  },
  chatbox: {
    display: 'flex',
    paddingTop: theme.spacing(6),
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'flex-start',
    height: '100%',
    textAlign: 'center',
    color: theme.palette.common.white,
    '& h6': {
      fontWeight: theme.typography.fontWeightRegular
    }
  },
  logoHeader: {},
  logo: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: theme.spacing(3),
    '&$logoHeader': {
      flexDirection: 'column',
      alignItems: 'center',
      position: 'relative',
      zIndex: 10
    },
    '& img': {
      width: 64,
    },
    '& p, span': {
      display: 'block',
      paddingBottom: 4,
      color: theme.palette.common.white,
    }
  },
  head: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    '& a': {
      marginTop: theme.spacing(2),
    },
    [theme.breakpoints.down('sm')]: {
      marginTop: theme.spacing(2),
      justifyContent: 'center',
      '& a': {
        display: 'none'
      }
    }
  },
  signArrow: {},
  formWrap: {
    background: theme.palette.background.paper,
    position: 'relative',
    padding: theme.spacing(2),
    [theme.breakpoints.up('sm')]: {
      padding: theme.spacing(4)
    },
    [theme.breakpoints.up('lg')]: {
      padding: theme.spacing(6)
    }
  },
  socmedSideLogin: {
    display: 'flex',
    justifyContent: 'space-around',
    [theme.breakpoints.down('md')]: {
      justifyContent: 'center',
    },
    [theme.breakpoints.down('xs')]: {
      justifyContent: 'center',
      display: 'block'
    },
    '& > *': {
      color: theme.palette.common.white,
      width: 160,
      padding: theme.spacing(),
      [theme.breakpoints.down('md')]: {
        margin: theme.spacing(0, 0.5)
      },
      [theme.breakpoints.down('xs')]: {
        marginBottom: theme.spacing(2),
        width: '100%',
      }
    },
    '& i': {
      color: theme.palette.common.white,
      marginRight: theme.spacing()
    }
  },
  blueBtn: {
    background: '#28aae1',
    '&:hover': {
      background: darken('#28aae1', 0.2),
    }
  },
  naviBtn: {
    background: '#3b579d',
    '&:hover': {
      background: darken('#3b579d', 0.2),
    }
  },
  redBtn: {
    background: '#dd493c',
    '&:hover': {
      background: darken('#dd493c', 0.2),
    }
  },
  separator: {
    margin: `${theme.spacing(5)}px auto`,
    maxWidth: 300,
    minWidth: 200,
    textAlign: 'center',
    position: 'relative',
    '& p': {
      [theme.breakpoints.down('xs')]: {
        fontSize: 12
      },
    },
    '&:before, &:after': {
      content: '""',
      borderTop: `1px solid ${theme.palette.text.hint}`,
      top: '50%',
      position: 'absolute',
      width: '20%'
    },
    '&:before': {
      left: 0,
    },
    '&:after': {
      right: 0,
    }
  },
  screen: {
    position: 'relative',
    '& img': {
      width: '90%',
      display: 'block'
    }
  },
  illustrationCenter: {
    '& $screen': {
      display: 'block',
      textAlign: 'center',
      marginTop: -50,
      maxWidth: 700,
      margin: '0 auto',
      transform: 'rotateY( 0 ) rotateX(25deg) rotateZ(0deg)',
      '& img': {
        margin: '0 auto',
        width: '100%'
      }
    },
  },
}));

export default contactStyles;
