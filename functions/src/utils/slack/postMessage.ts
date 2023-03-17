import { WebClient } from '@slack/web-api';
import { logger } from 'firebase-functions/v1';

export const postMessage = async (
  token: string, // Note: OAuth bot token
  text: string,
  channel: string // Example: "#channel_name"
) => {
  logger.debug({ text, channel });
  const client = new WebClient(token);
  const response = await client.chat.postMessage({ channel, text });
  logger.debug({ response });
  return response;
};
