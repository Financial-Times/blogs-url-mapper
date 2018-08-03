const handler = require('./handler.js');

const context = {
  awsRequestId: '123'
}

const event = '';
// require('test-event.json');

console.log('EVENT:', event);

handler.map(event, context, (error, response) => {
  console.log('TEST RESPONSE:', response);
  // process.exit();
})