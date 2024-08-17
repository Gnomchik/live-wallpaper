// firebase-auth-middleware.ts
import { Request, Response, NextFunction } from 'express';
import admin from '../firebase-admin-config';

export const authenticateFirebaseToken = async (req: Request, res: Response, next: NextFunction) => {
    let token = '';
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
        token = req.headers.authorization.split(' ')[1];
    }
    console.log('Received token:', token);

    try {
        const decodedToken = await admin.auth().verifyIdToken(token);
        req.user = decodedToken;
        console.log('Token verified successfully:', decodedToken);
        next();
    } catch (error) {
        console.error('Error verifying Firebase ID token:', error);
        return res.status(401).json({ message: 'Unauthorized: Invalid token', error });
    }
};
