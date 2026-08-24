import { Client, Databases, Account } from 'appwrite';


export const API_ENDPOINT = import.meta.env.VITE_API_ENDPOINT
export const PROJECT_ID = import.meta.env.VITE_PROJECT_ID
export const DATABASE_ID = import.meta.env.VITE_DATABASE_ID
export const COLLECTION_ID_MESSAGES = import.meta.env.VITE_COLLECTION_ID_MESSAGES
export const APPWRITE_DATABASE_CONFIGURED = Boolean(
    PROJECT_ID && DATABASE_ID && COLLECTION_ID_MESSAGES
)

const client = new Client().setEndpoint(
    API_ENDPOINT || 'https://cloud.appwrite.io/v1'
);

if (PROJECT_ID) {
    client.setProject(PROJECT_ID);
}

export const databases = new Databases(client);
export const account = new Account(client);



export default client;

 