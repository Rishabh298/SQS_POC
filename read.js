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
    sqs.receiveMessage(params, (err, data) => {
        if (err) {
            console.log('Error in receiveing message', err);
        } else if (data.Messages) {
            data.Messages.forEach((msg) => {
                console.log(msg);
            })
        }
    })
}
readUserDetails();