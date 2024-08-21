import { Client, Databases,Account } from 'appwrite';


export const PROJECT_ID = '66c06fe2002e7beb2af7'
export const DATABASE_ID = '66c0715b00232b82fe5d'
export const COLLECTION_ID_MESSAGES = '66c07178001e1f0a3d27'


const client = new Client();

client
    .setEndpoint('https://cloud.appwrite.io/v1')
    .setProject('66c06fe2002e7beb2af7');

export const databases = new Databases(client);   
export const account = new Account(client) 

export default client;   