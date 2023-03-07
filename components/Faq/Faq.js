import React, { useState } from 'react';
import PropTypes from 'prop-types';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { useTheme } from '@material-ui/core/styles';
import clsx from 'clsx';
import Container from '@material-ui/core/Container';
import Hidden from '@material-ui/core/Hidden';
import Grid from '@material-ui/core/Grid';
import {Accordion, AccordionSummary, AccordionDetails} from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Typography from '@material-ui/core/Typography';
import { useText } from '~/theme/common';
import { withTranslation } from '~/i18n';
import ParallaxMedium from '../Parallax/Medium';
import illustration from '~/public/images/saas/ai_brain_4.png';
import Title from '../Title';
import useStyles from './faq-style';

const faqData = [
  {
    q: 'What is Artificial Intelligence?',
    a: 'Artificial Intelligence (AI) is an area of computer science that emphasizes the creation of intelligent machines that work and react like humans.” “The capability of a machine to imitate the intelligent human behavior.'
  },
  {
    q: 'Why is the ML so powerful?',
    a: 'ML can consume tons of complex information and find patterns that are predictive, and then alert you to those differences. '
  },
  {
    q: 'What can we do using AI testing?',
    a: 'With AI testing, "we want to make sure that the UI itself looks right to the user and that each UI element appears in the right color, shape, position, and size," Carmi said. "We also want to ensure that it does not hide or overlap any other UI elements.'
  },
  {
    q: 'How often do your tests fail due to developers making changes to your application?',
    a: 'This tool can use machine learning to automatically adjust to these changes. This makes tests more maintainable and reliable. For example, current AI/ML testing tools can start learning about your application, understanding relationships between the parts of the document object model, and learning about changes throughout time. '
  },
  {
    q: 'How long will it take me to test cases?',
    a: 'The recommended duration to complete this program is a few hours, however it is up to the individual to complete this program as per their own pace. '
  },
];

function Faq(props) {
  const classes = useStyles();
  const text = useText();
  const [expanded, setExpanded] = useState(0);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const { t } = props;
  const handleChange = panel => (event, newExpanded) => {
    setExpanded(newExpanded ? panel : false);
  };
  return (
    <div className={classes.root}>
      <Container fixed>
        <Grid container spacing={6}>
          <Grid item md={6}>
            <Title align={isMobile ? 'center' : 'left'}>
              <strong>
                Frequently Asked Questions
              </strong>
            </Title>
            <Typography className={clsx(classes.text, text.subtitle2)} align={isMobile ? 'center' : 'left'} component="p">
              {t('common:saas-landing.faq_subtitle')}
            </Typography>
            <Hidden smDown>
              <div className={classes.illustrationCenter}>
                <figure className={classes.figure}>
                  <img src={illustration} alt="screen" />
                </figure>                
              </div>
            </Hidden>
          </Grid>
          <Grid item md={6}>
            <div className={classes.accordion}>
              {faqData.map((item, index) => (
                <div className={classes.item} key={index.toString()}>
                  <Accordion
                    classes={{
                      root: classes.paper
                    }}
                    expanded={expanded === index}
                    onChange={handleChange(index)}
                  >
                    <AccordionSummary
                      classes={{
                        content: classes.content,
                        expanded: classes.expanded,
                      }}
                    >
                      <Typography className={classes.heading}>{item.q}</Typography>
                      <ExpandMoreIcon className={classes.icon} />
                    </AccordionSummary>
                    <AccordionDetails
                      classes={{
                        root: classes.detail,
                      }}
                    >
                      <Typography>
                        {item.a}
                      </Typography>
                    </AccordionDetails>
                  </Accordion>
                </div>
              ))}
            </div>
          </Grid>
        </Grid>
      </Container>
    </div>
  );
}

Faq.propTypes = {
  t: PropTypes.func.isRequired
};

export default withTranslation(['saas-landing'])(Faq);
