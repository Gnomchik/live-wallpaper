import bcrypt from 'bcrypt';

const saltRounds = 10;

export const hashPassword = async (password: string): Promise<string> => {
    if (!password) {
        throw new Error('Password is required');
    }

    try {
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        return hashedPassword;
    } catch (error) {
        console.error('Error hashing password:', error);
        throw new Error('Error hashing password');
    }
};

export const comparePassword = async (password: string, hashedPassword: string): Promise<boolean> => {
    try {
        const match = await bcrypt.compare(password, hashedPassword);
        return match;
    } catch (error) {
        console.error('Error comparing passwords:', error);
        throw new Error('Error comparing passwords');
    }
};
