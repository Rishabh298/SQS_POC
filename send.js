const AWS = require('aws-sdk');
const client = require('./database');
const fs = require('fs');
const prompt = require('./prompt.js');

AWS.config.update({ region: 'REGION' });
const sqs = new AWS.SQS({ apiVersion: '2012-11-05' });



//function to convert text file into string and return an array
const convertTextFileToString = () => {
    try {
        let filePath = prompt('Please give the file path : ');
        const fileData = fs.readFileSync(filePath, "utf8");
        const dataArr = fileData.split('\\');
        if (dataArr.length === 3) {
            return dataArr
        } else {
            console.log('There is some problem in text file, seems data is not proper');
        }
    } catch (err) {
        console.log('Please check the given file path', err);
    }

};


// function to push data in database
const pushDataInDatabase = async (subject, body) => {
    try {
        const date = new Date();
        await client.connect();
        const result = await client.query(`insert into demoschema.email_details(subject, body, datetime)values($1, $2, $3)`, [subject, body, date]);
        console.log(result.rows);
        client.end();
    } catch (err) {
        if (err.code === '28P01') {
            console.log('Please enter the correct userName or password', err);
        } else if (err.code === 'ENOTFOUND') {
            console.log('Please check the host name properly', err);
        } else if (err.code === 'ECONNREFUSED') {
            console.log('there is some problem in connection please check the port number properly', err);
        } else {
            console.log('Getting error from Database', err);
        }
    }
};


//function to dump data in SQS
const sendUserDetails = () => {
    let queueUrl = prompt('Enter the queue url : ');
    const data = convertTextFileToString();
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
        MessageBody: "Email along with subject & body",
        QueueUrl: queueUrl
    }
    try {
        sqs.sendMessage(params, (err, data) => {
            if (!err) {
                console.log('SuccessQUEUE', data.MessageId);
                pushDataInDatabase(subject, body);
            }
            else if (err.code === 'UnknownEndpoint') {
                console.log('Seems queue url is wrong, please check it properly', err);
            } else {
                console.log('Queue Error', err);
            }
        })
    } catch (err) {
        console.log('There is some problem in SQS syncing or AWS configuration', err);
    }
};

sendUserDetails();