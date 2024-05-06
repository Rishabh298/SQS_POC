const AWS = require('aws-sdk');
const client = require('./database');
const fs = require('fs');

AWS.config.update({region: 'REGION'});
const sqs = new AWS.SQS({apiVersion: '2012-11-05'});

const fileName = './emailBody.txt'


//function to convert text file into string and return an array
const convertTextFileToString = (fileName)=> {
    const fileData = fs.readFileSync(fileName, "utf8");
    const dataArr = fileData.split('\\');
    return dataArr
};


// function to push data in database
const pushDataInDatabase = async (subject, body) => {
try {
    const date = new Date();
    await client.connect();
    const result = await client.query(`insert into demoschema.email_details(email_id, subject, body, datetime)values($1, $2, $3, $4)`,[2, subject, body, date]);
    console.log(result.rows);    
    client.end();
} catch (err) {
    console.log('ERROR>>>>>>', err);
}
};


//function to dump data in SQS
const sendUserDetails = () => {
    const data = convertTextFileToString(fileName);
    const subject = data[0];
    const body = data[2].replace(/\s{2,}/g, ' ');
    const params = {
        MessageAttributes: {
            "Subject": {
                DataType: "String",
                StringValue: subject,
            },
            "Content": {
                DataType: "String",
                StringValue: body,
            }
        },
        MessageBody: "Email along with subject & body 2",
        QueueUrl: ""
    }
    sqs.sendMessage(params, (err, data)=> {
if (err) {
    console.log('ERROR', err);
} 
else {
    console.log('SuccessQUEUE', data.MessageId);
    pushDataInDatabase(subject, body);
}
    })
};

sendUserDetails();
