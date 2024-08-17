// firebase-admin-config.ts
import * as admin from 'firebase-admin';
import * as serviceAccount from '../live-wallpaper-2eb55-firebase-adminsdk-wyhew-33d092aaf0.json';

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
});

export default admin;
