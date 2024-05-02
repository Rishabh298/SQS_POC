var AWS = require('aws-sdk');

AWS.config.update({region: 'REGION'});
var sqs = new AWS.SQS({apiVersion: '2012-11-05'});

let readUserDetails = () => {
    var params = {
        QueueUrl: "https://sqs.us-east-1.amazonaws.com/637423196416/demoQueue2",
        MaxNumberOfMessages: 10,
    };
    sqs.receiveMessage(params, (err, data)=> {
        if (err) {
            console.log('Error in receiveing message', err);
        } else if (data.Messages) {
            data.Messages.forEach((msg)=> {
                console.log(msg);
            })
        }
    })
}
readUserDetails();