import { DynamoDB } from 'aws-sdk';
import { v4 as uuid } from 'uuid';
import wrapLambda from '../helpers/wrap-lambda';

const dynamodb = new DynamoDB();

const handler: LambdaHandler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 404 };
  }
  const sessionId = uuid();

  await dynamodb
    .putItem({
      TableName: 'longtweet-login',
      Item: {
        session_id: {
          S: sessionId,
        },
        exp: {
          N: Math.floor((Date.now() + 2 * 1000 * 60) / 1000).toString(),
        },
      },
    })
    .promise();

  return {
    statusCode: 200,
    body: JSON.stringify({ sessionId }),
  };
};

const wrapped = wrapLambda(handler);
export { wrapped as handler };
