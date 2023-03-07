import Amplify from '@aws-amplify/core';
import Storage from '@aws-amplify/storage';
import config from '../config';

export function configureAmplify() {
  Amplify.configure(
  {
   Auth: {
     identityPoolId: config.cognito.IDENTITY_POOL_ID,
     region: config.cognito.REGION,
     userPoolId: config.cognito.USER_POOL_ID,
     userPoolWebClientId: config.cognito.APP_CLIENT_ID
    },
  Storage: { 
     bucket: config.s3.BUCKET,
     region: config.s3.REGION,
     level: "private"         
    },
  Interactions: {
      bots: {
        "MyBot": {
          "name": "MyBot",
          "alias": "searchBot",
          "region": "us-east-1"
        },
      }
    }
  }
 );
}

//Configure Storage with S3 bucket information
export function SetS3Config(bucket, level){
   Storage.configure({ 
          bucket: bucket,
          level: level
       });
}