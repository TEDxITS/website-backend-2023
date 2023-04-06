import crypto from 'crypto';

export const GenerateRandomToken = (): string => {
    return crypto.randomBytes(16).toString('hex');
}
