import { Storage } from 'aws-amplify';
import { configureAmplify, SetS3Config } from './configure';
import config from "../config";
import AWS from 'aws-sdk';

var crypto = require("crypto-js");
var strftime = require('strftime');

export async function s3Upload(bucket, file, level, email) {    
  SetS3Config(bucket, level);
  const filename = `${Date.now()}-${file.name}`;
    const stored = await Storage.put(filename, file, {
      contentType: file.type,
      metadata: {
        email: email
      }
    })
  return stored.key;  
}

export async function s3UploadDocument(bucket, file, project, userid, destbucket, theme) {    
  SetS3Config(bucket, project);
  var filename = file.name.replaceAll(" ", "_");
  filename = filename.replaceAll("-", "_");  
  const pathname = `${project}/${filename}`;
    const stored = await Storage.put(pathname, file, {
      contentType: file.type,
      metadata: {
        userid: userid,
        destbucket: destbucket,
        theme: theme
      }
    })
  return filename;
}

export async function s3UploadScript(bucket, file) {      
  var filename = file.name.replaceAll(" ", "_");
  filename = filename.replaceAll("-", "_");  
  SetS3Config(bucket, filename);
  const stored = await Storage.put(filename, file, {
    contentType: file.type
  })
  return filename;
}

export async function s3DownloadDocument(bucket, filename)
{
  SetS3Config(bucket, filename);      
  const stored = await Storage.get(filename, {download: true});  
  var url = URL.createObjectURL(stored.Body);
  var downloadLink = document.createElement("a");
  downloadLink.href = url;
  downloadLink.download = "user_record.zip";

  document.body.appendChild(downloadLink);
  downloadLink.click();
  document.body.removeChild(downloadLink);
}

function getSignatureKey(key, dateStamp, regionName, serviceName) {
  var kDate = crypto.HmacSHA256(dateStamp, "AWS4" + key);
  var kRegion = crypto.HmacSHA256(regionName, kDate);
  var kService = crypto.HmacSHA256(serviceName, kRegion);
  var kSigning = crypto.HmacSHA256("aws4_request", kService);
  return kSigning;
}

export async function updateDocument(sender, userid, reqtype, project, document, newcontent) {    
  var result = '';
  try {
    var today = new Date(new Date().toUTCString());
    today.setMinutes(today.getMinutes() + today.getTimezoneOffset());

    var amzdate1 = strftime('%Y%m%dT%H%M%SZ', today);
    var amzdate2 = strftime('%Y%m%d', today);
    const signstr = getSignatureKey(config.security.SECRET_KEY, amzdate1, config.s3.REGION, 'execute-api');        

    const reqBody = {
      type: reqtype,
      sender: sender.attributes.sub,
      user: userid,
      project: project,
      document: document,
      content: newcontent,
    };

    const requestOptions = {
      method: "POST",             
      headers: {
        'Authorization': 'AWS4-HMAC-SHA256 Credential=' + config.security.ACCESS_KEY + '/' + amzdate2 + '/' + config.s3.REGION + '/execute-api/aws4_request, SignedHeaders=host;x-amz-date, Signature=' + signstr,
        'X-Amz-Date': amzdate1
      },
      body: JSON.stringify(reqBody)
    };
    const response = await fetch(config.updatedocumentsbucket.POST_URL, requestOptions);
    const data = await response.text();
    if (data && data.length > 0) {
      result = data;
    }
  } catch (error) { 
    result = "Failed to delete documents";
    console.log(error);
  }  

  return result;
}

const createWebsiteUrl = (label) => ({
  label,
  value: label,
});

export function getWebsiteUrls(user) {
  var result_urls = [];
  if (user != null) {
    var urls = user['attributes']['custom:website'];
    if (urls != null && urls.length > 0) {
      var tmp_urls = urls.split(';');
      tmp_urls.forEach(oneorl => {
        if (oneorl.length > 0)
          result_urls.push(createWebsiteUrl(oneorl));
      });
    }      
  }
  return result_urls;
}

export async function getCurrentWebsite(user) {    
  var result = "";
  try {
    var today = new Date(new Date().toUTCString());
    today.setMinutes(today.getMinutes() + today.getTimezoneOffset());

    var amzdate1 = strftime('%Y%m%dT%H%M%SZ', today);
    var amzdate2 = strftime('%Y%m%d', today);
    const signstr = getSignatureKey(config.security.SECRET_KEY, amzdate1, config.s3.REGION, 'execute-api');        

    const reqBody = {
      type: 'get_w',
      user: user.attributes.sub
    };

    const requestOptions = {
      method: "POST",             
      headers: {
        'Authorization': 'AWS4-HMAC-SHA256 Credential=' + config.security.ACCESS_KEY + '/' + amzdate2 + '/' + config.s3.REGION + '/execute-api/aws4_request, SignedHeaders=host;x-amz-date, Signature=' + signstr,
        'X-Amz-Date': amzdate1
      },
      body: JSON.stringify(reqBody)
    };
    const response = await fetch(config.updatedocumentsbucket.POST_URL, requestOptions);    
    const data = await response.text();    
    if (data && data.length > 0) {
      result = data;
    }
  } catch (error) { 
    console.log(error);
  }  
  return result;
}


export async function setCurrentWebsite(user, website) {
  var result = "";
  try {
    var today = new Date(new Date().toUTCString());
    today.setMinutes(today.getMinutes() + today.getTimezoneOffset());

    var amzdate1 = strftime('%Y%m%dT%H%M%SZ', today);
    var amzdate2 = strftime('%Y%m%d', today);
    const signstr = getSignatureKey(config.security.SECRET_KEY, amzdate1, config.s3.REGION, 'execute-api');        

    const reqBody = {
      type: 'update_w',
      user: user.attributes.sub,
      website: website
    };

    const requestOptions = {
      method: "POST",             
      headers: {
        'Authorization': 'AWS4-HMAC-SHA256 Credential=' + config.security.ACCESS_KEY + '/' + amzdate2 + '/' + config.s3.REGION + '/execute-api/aws4_request, SignedHeaders=host;x-amz-date, Signature=' + signstr,
        'X-Amz-Date': amzdate1
      },
      body: JSON.stringify(reqBody)
    };
    const response = await fetch(config.updatedocumentsbucket.POST_URL, requestOptions);    
    const data = await response.text();    
    if (data && data.length > 0) {
      result = data;
    }
  } catch (error) { 
    console.log(error);
  }  
  return result;
}

export async function getUserRole(user) {    
  var result = 'User';
  try {
    var today = new Date(new Date().toUTCString());
    today.setMinutes(today.getMinutes() + today.getTimezoneOffset());

    var amzdate1 = strftime('%Y%m%dT%H%M%SZ', today);
    var amzdate2 = strftime('%Y%m%d', today);
    const signstr = getSignatureKey(config.security.SECRET_KEY, amzdate1, config.s3.REGION, 'execute-api');        

    const reqBody = {
      type: 'get_r',
      user: user.attributes.sub
    };

    const requestOptions = {
      method: "POST",             
      headers: {
        'Authorization': 'AWS4-HMAC-SHA256 Credential=' + config.security.ACCESS_KEY + '/' + amzdate2 + '/' + config.s3.REGION + '/execute-api/aws4_request, SignedHeaders=host;x-amz-date, Signature=' + signstr,
        'X-Amz-Date': amzdate1
      },
      body: JSON.stringify(reqBody)
    };
    const response = await fetch(config.updatedocumentsbucket.POST_URL, requestOptions);    
    const data = await response.text();    
    if (data && data.length > 0) {
      result = data;
    }
  } catch (error) { 
    console.log(error);
  }  
  return result;
}

export async function getUsersList(user) {    
  var result = [];

  try {
    var today = new Date(new Date().toUTCString());
    today.setMinutes(today.getMinutes() + today.getTimezoneOffset());

    var amzdate1 = strftime('%Y%m%dT%H%M%SZ', today);
    var amzdate2 = strftime('%Y%m%d', today);
    const signstr = getSignatureKey(config.security.SECRET_KEY, amzdate1, config.s3.REGION, 'execute-api');        

    const reqBody = {
      type: 'get_u',
      user: user.attributes.sub
    };

    const requestOptions = {
      method: "POST",             
      headers: {
        'Authorization': 'AWS4-HMAC-SHA256 Credential=' + config.security.ACCESS_KEY + '/' + amzdate2 + '/' + config.s3.REGION + '/execute-api/aws4_request, SignedHeaders=host;x-amz-date, Signature=' + signstr,
        'X-Amz-Date': amzdate1
      },
      body: JSON.stringify(reqBody)
    };
    const response = await fetch(config.updatedocumentsbucket.POST_URL, requestOptions);    
    const data = await response.text();    
    if (data && data.length > 0) {
      result = JSON.parse(data);
    }
  } catch (error) { 
    console.log(error);
  }  
  return result;
}

export async function updateUserRole(user, setuser, setrole) {    
  var result = '';

  try {
    var today = new Date(new Date().toUTCString());
    today.setMinutes(today.getMinutes() + today.getTimezoneOffset());

    var amzdate1 = strftime('%Y%m%dT%H%M%SZ', today);
    var amzdate2 = strftime('%Y%m%d', today);
    const signstr = getSignatureKey(config.security.SECRET_KEY, amzdate1, config.s3.REGION, 'execute-api');        

    const reqBody = {
      type: 'update_r',
      user: user.attributes.sub,
      setuser: setuser,
      setrole: setrole
    };

    const requestOptions = {
      method: "POST",             
      headers: {
        'Authorization': 'AWS4-HMAC-SHA256 Credential=' + config.security.ACCESS_KEY + '/' + amzdate2 + '/' + config.s3.REGION + '/execute-api/aws4_request, SignedHeaders=host;x-amz-date, Signature=' + signstr,
        'X-Amz-Date': amzdate1
      },
      body: JSON.stringify(reqBody)
    };
    const response = await fetch(config.updatedocumentsbucket.POST_URL, requestOptions);    
    const data = await response.text();    
    if (data && data.length > 0) {
      result = data;
    }
  } catch (error) { 
    console.log(error);
  }  
  return result;
}

export async function getDocumentsByUser(user) {
  const reqBody = {
    type: 'get_d',
    user: user.attributes.sub
  };

  try {
    const requestOptions = {
      method: "POST",
      body: JSON.stringify(reqBody)
    };

    const response = await fetch(config.getdocumentsbucket.POST_URL, requestOptions);
    const data = await response.json();
    return data;
  } catch (error) { 
    console.log(error);
  }
  return '';
};

export function getIdentityId(user) {
  var identityId = "";

  var params = {
    IdentityPoolId: config.cognito.IDENTITY_POOL_ID, /* required */
    AccountId: config.cognito.ACCOUNT_ID,
    Logins: {
      'cognito-idp.us-east-1.amazonaws.com/us-east-1_kdkxsmbNN': user.getSignInUserSession().getIdToken().getJwtToken()
    }
  };
  
  AWS.config.update({
    accessKeyId: config.security.ACCESS_KEY,
    secretAccessKey: config.security.SECRET_KEY,
    region: config.s3.REGION
  });

  var cognitoidentity = new AWS.CognitoIdentity();

  return new Promise((resolve, reject) => (
    cognitoidentity.getId(params, function(err, data) {
      if (err) 
        reject(err); // an error occurred
      else     
        resolve(data.IdentityId);           // successful response
    })
  )); 
}

export async function getChatHistory(identityId) {
  if (identityId.length > 0) {
    const reqBody = {
      type: 'get_ch',
      user: identityId
    };
  
    try {
      const requestOptions = {
        method: "POST",
        body: JSON.stringify(reqBody)
      };
  
      const response = await fetch(config.getdocumentsbucket.POST_URL, requestOptions);
      var data = await response.text();
      return JSON.parse(data);
    } catch (error) { 
      console.log(error);
    }  
  }
  return [];
};


export async function getQuestions(user) {
  if (user) {
    const reqBody = {
      type: 'get_q',
      user: user.attributes.sub
    };
  
    try {
      const requestOptions = {
        method: "POST",
        body: JSON.stringify(reqBody)
      };
  
      const response = await fetch(config.getdocumentsbucket.POST_URL, requestOptions);
      const data = await response.json();
      return data;
    } catch (error) { 
      console.log(error);
    }  
  }
  return '';
};

export async function setQuestionAnswer(user, question, answer) {
  const reqBody = {
    type: 'set_q',
    user: user,
    question: question,
    answer: answer
  };

  try {
    const requestOptions = {
      method: "POST",
      body: JSON.stringify(reqBody)
    };

    const response = await fetch(config.getdocumentsbucket.POST_URL, requestOptions);
    const data = await response.text();
    return data;
  } catch (error) { 
    console.log(error);
  }
  return '';
};
