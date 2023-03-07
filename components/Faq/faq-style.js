import { makeStyles } from '@material-ui/core/styles';

const faqStyles = makeStyles(theme => ({
  root: {
    position: 'relative'
  },
  text: {
    position: 'relative',
    zIndex: 20
  },
  figure: {
    transformStyle: 'preserve-3d',
    overflow: 'hidden',
    boxShadow: theme.shadows[2],
    borderRadius: theme.rounded.medium,
    background: theme.palette.common.white,
    padding: theme.spacing(1),
    paddingTop: theme.spacing(3),
    margin: theme.spacing(3),
    '& img': {
      width: '100%',
    },
  },
  illustration: {
    position: 'relative',
    margin: theme.spacing(6, 6, 0),
    '& img': {
      display: 'block',
      width: 280,
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
  accordion: {
    position: 'relative',
  },
  item: {
    marginBottom: theme.spacing(3),
  },
  paper: {
    borderRadius: `${theme.rounded.medium} !important`,
    overflow: 'hidden',
  },
  heading: {
    fontWeight: theme.typography.fontWeightMedium,
    padding: theme.spacing(1, 2, 1, 0),
    fontSize: 18,
    [theme.breakpoints.down('xs')]: {
      fontSize: 16,
    }
  },
  content: {
    '& $icon': {
      position: 'absolute',
      top: theme.spacing(2.5),
      right: theme.spacing(2)
    }
  },
  expanded: {
    background: theme.palette.type === 'dark' ? '#023b55' : '#2088e9',
    '& $heading': {
      color: theme.palette.common.white,
      paddingTop: 0,
      paddingBottom: 0
    },
    '& $icon': {
      color: theme.palette.common.white,
      transform: 'rotate(180deg)'
    }
  },
  detail: {
    background: theme.palette.background.paper,
    paddingTop: theme.spacing(3),
    '& p': {
      fontSize: 18,
      [theme.breakpoints.down('xs')]: {
        fontSize: 16,
      }
    }
  },
  icon: {
    color: theme.palette.type === 'dark' ? theme.palette.primary.light : theme.palette.primary.main
  }
}));

export default faqStyles;
