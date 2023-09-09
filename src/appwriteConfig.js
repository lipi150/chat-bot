import { Client, Databases, Account } from 'appwrite';

export const PROJECT_ID = import.meta.env.VITE_APP_PROJECT_ID
export const DATABASE_ID = import.meta.env.VITE_APP_DATABASE_ID
export const COLLECTION_ID_MESSAGES = import.meta.env.VITE_APP_COLLECTION_ID

const client = new Client();


client
    .setEndpoint('https://cloud.appwrite.io/v1')
    .setProject(PROJECT_ID);

export const databases = new Databases(client);
export const account = new Account(client);
export default client;

