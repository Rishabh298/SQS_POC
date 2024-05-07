var AWS = require('aws-sdk');
const prompt = require('./prompt.js');

AWS.config.update({ region: 'REGION' });
var sqs = new AWS.SQS({ apiVersion: '2012-11-05' });

let readUserDetails = () => {
    let queueUrl = prompt('Enter the queue url : ');
    var params = {
        QueueUrl: queueUrl,
        MaxNumberOfMessages: 10,
    };
    try {
        sqs.receiveMessage(params, (err, data) => {
            if (!err) {
                data.Messages.forEach((msg) => {
                    console.log(msg);
                })
            } else {
                console.log('Error in receiving message', err);
            }
        })
    } catch (err) {
        console.log('There is some problem in SQS syncing or AWS configuration', err);
    }
}
readUserDetails();