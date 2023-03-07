const proxy_cors = 'https://corsanywhere.returnmoneyonline.com/';

const config = {
  s3: {
    REGION: "us-east-1",
    SIGNINBUCKET: "faceapp2.signinbucket",    
    SIGNUPBUCKET: "faceapp2.signupbucket",
    UPPDFBUCKET: "faceapp2.documentbucket",
    UPIMGBUCKET: "faceapp2.imagebucket",
    TOOLBUCKET: "esthertool",
    SCRIPTBUCKET: "seleniumscripts"
  },

  cognito: {
    ACCOUNT_ID: "108224000581",
    REGION: "us-east-1",
    USER_POOL_ID: "us-east-1_kdkxsmbNN",
    APP_CLIENT_ID: "245ct6vmlhofkmmurf4jdk5148",
    IDENTITY_POOL_ID: "us-east-1:dc1447c5-a33b-49b1-a2a9-210ed242427b"
  },

  security: {
    ACCESS_KEY: "AKIARSMVHGJCTY6TSYRG",
    SECRET_KEY: "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"
  },  
  
  createbucket: {
    POST_URL: proxy_cors + "https://ek1xlxcw86.execute-api.us-east-1.amazonaws.com/prod/mycreateBucket"
  },

  getdocumentsbucket: {
    POST_URL: proxy_cors + "https://rtkimvw8t1.execute-api.us-east-1.amazonaws.com/default/getUploadedDocuments"
  },

  updatedocumentsbucket: {
    POST_URL: proxy_cors + "https://3fhagcj01k.execute-api.us-east-1.amazonaws.com/default/updateUploadedDocument"
  }
}

export default {
  // Add common config values here
  MAX_ATTACHMENT_SIZE: 5000000,
  ...config
};
