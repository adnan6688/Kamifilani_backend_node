/* eslint-disable no-console */
import admin from "firebase-admin";
import { envVars } from "./env";

const serviceAccount = {
    type: envVars.TYPE,
    project_id: envVars.PROJECT_ID,
    private_key_id: envVars.PRIVATE_KEY_ID,
    private_key: envVars.PRIVATE_KEY?.replace(/\\n/g, "\n"),
    client_email: envVars.CLIENT_EMAIL,
    client_id: envVars.CLIENT_ID,
    auth_uri: envVars.AUTH_URI,
    token_uri: envVars.TOKEN_URI,
    auth_provider_x509_cert_url: envVars.AUTH_PROVIDER_X509_CART_URL,
    client_x509_cert_url: envVars.CLIENT_X509_CERT_URL,
    universe_domain: envVars.UNIVERSE_DOMAIN,
};

if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount as any),
    });

    console.log("Firebase initialized");
}
export const TOPIC = "breaking_news";
export default admin;
