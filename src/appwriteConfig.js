import { Client, Databases, Account } from 'appwrite';

export const PROJECT_ID ='64f355d5e133d96fb00b'
export const DATABASE_ID = '64f35964c09adc524abd'
export const COLLECTION_ID_MESSAGES = '64f3596f149cb916c93b'

const client = new Client();


client
    .setEndpoint('https://cloud.appwrite.io/v1')
    .setProject('64f355d5e133d96fb00b');

export const databases = new Databases(client);
export const account = new Account(client);
export default client;

