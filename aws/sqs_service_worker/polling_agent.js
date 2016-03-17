/**
 * Created by Muhammad AbdulMoiz on 3/15/2016.
 */
var aws = require('aws-sdk');
var Q   = require('q');
var config = require('./config');//contains configuration for aws-sdk and aws queue url

var sqs = new aws.SQS({
    region: config.AWS.region,
    accessKeyId: config.AWS.accessKeyId,
    secretAccessKey: config.AWS.secretAccessKey,

    params: {
        QueueUrl: config.AWS.queueUrl
    }
});

var receiveMessage = Q.nbind( sqs.receiveMessage, sqs );
var deleteMessage = Q.nbind( sqs.deleteMessage, sqs );


(function pollQueueForMessages() {

    console.log("***Starting long-poll operation.***" );

    receiveMessage({
        WaitTimeSeconds: 5, // Enable long-polling (5-seconds).
        VisibilityTimeout: 60 // queue changes visibility 10 seconds
    })
        .then(
        function handleMessageResolve( data ) {

            // If there are no message, throw an error so that we can bypass the
            // subsequent resolution handler that is expecting to have a message
            // delete confirmation.
            if ( ! data.Messages ) {

                throw(
                    workflowError(
                        "EmptyQueue",
                        new Error( "There are no messages to process." )
                    )
                );

            }

            // ---
            // TODO: Actually process the message in some way :P
            // ---

            //Delete Message from queue so it does'nt polls again
            deleteMessage({
                ReceiptHandle: message.ReceiptHandle
            });
            return;

        }
    )
        .then(
        function handleDeleteResolve( data ) {

            console.log(  "Message Deleted!" );

        }
    )

        // Catch any error (or rejection) that took place during processing.
        .catch(
        function handleError( error ) {

            // The error could have occurred for both known (ex, business logic) and
            // unknown reasons (ex, HTTP error, AWS error).
            switch ( error.type ) {
                case "EmptyQueue":
                    console.log( "Expected Error:", error.message );
                    break;
                default:
                    console.log( "Unexpected Error:", error.message );
                    break;
            }

        }
    )

        // When the promise chain completes, either in success of in error, let's kick the
        // long-poll operation back up and look for moar messages.
        .finally( pollQueueForMessages );

})();

// When processing the SQS message, we will use errors to help control the flow of the
// resolution and rejection. We can then use the error "type" to determine how to
// process the error object.
function workflowError( type, error ) {

    error.type = type;

    return( error );

}