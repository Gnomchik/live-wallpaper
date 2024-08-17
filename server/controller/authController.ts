import { Request, Response, RequestHandler } from 'express';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';
import { hashPassword, comparePassword } from '../helper/passwordUtils';
import multer from 'multer';
import path from 'path';

const prisma = new PrismaClient();

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const destinationPath = 'data/image/';
        cb(null, destinationPath);
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage });

export const uploadMiddleware = upload.single('photo');

export const registerUser: RequestHandler = async (req, res) => {
    const { username, email, password } = req.body;
    const photo = req.file?.path;

    if (!username || !email || !password) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    try {
        const hashedPassword = await hashPassword(password);

        const newUser = await prisma.user.create({
            data: {
                name: username,
                email,
                password: hashedPassword,
                photo: photo ? photo.replace('data/image/', '') : null,
            },
        });

        const token = jwt.sign({ userId: newUser.id }, process.env.JWT_SECRET!, {
            expiresIn: '1h',
        });

        res.status(201).json({ message: 'User registered successfully', user: newUser, token });
    } catch (error) {
        console.error('Error registering user:', error);
        res.status(500).json({ error: 'Failed to register user' });
    }
};

export const loginUser: RequestHandler = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await prisma.user.findUnique({ where: { email } });

        if (!user) {
            return res.status(401).json({ message: 'Incorrect username or password' });
        }

        const isPasswordValid = await comparePassword(password, user.password);

        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Incorrect username or password' });
        }

        const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET!, { expiresIn: '1h' });

        res.status(200).json({ message: 'Login successful', token, user });
    } catch (error) {
        console.error('Error logging in user:', error);
        res.status(500).json({ error: 'Failed to login user' });
    }
};

export const getUserInfo: RequestHandler = async (req, res) => {
    const userId = parseInt(req.params.userId, 10);
    console.log(userId);
    
    try {
        const user = await prisma.user.findUnique({
            where: { id: userId },
        });

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.status(200).json({ user });
    } catch (error) {
        console.error('Error getting user info:', error);
        res.status(500).json({ error: 'Failed to get user info' });
    }
};

export const updateUser: RequestHandler = async (req, res) => {
    const userId = parseInt(req.params.userId, 10);
    const { username, password } = req.body;
    const photo = req.file?.path;

    try {
        const user = await prisma.user.findUnique({ where: { id: userId } });

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const updateData: any = {};

        if (username) updateData.name = username;
        if (password) updateData.password = await hashPassword(password);
        if (photo) updateData.photo = photo.replace('data/image/', '');

        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: updateData,
        });

        res.status(200).json({ message: 'User updated successfully', user: updatedUser });
    } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).json({ error: 'Failed to update user' });
    }
};

export const returnUserVideos: RequestHandler = async (req, res) => {
    const userId = parseInt(req.params.userId, 10);
    console.log(userId);

    try {
        const userVideos = await prisma.video.findMany({
            where: {
                authorId: userId,
            },
            include: {
                
                categories: { select: { category: true } },
                quality: true,

            },
        });

        res.status(200).json({ userVideos });
    } catch (error) {
        console.error('Error fetching user videos:', error);
        res.status(500).json({ error: 'Failed to fetch user videos' });

    }
};
