import mongoose from 'mongoose';
import config from '../config/config';

export default {
    connect: async () => {
        const conn = await mongoose
            .connect(config.DATABASE_URL as string)
            .catch((err) => {
                throw err;
            });
        return conn;
    }
};
