import mongoose from 'mongoose';

mongoose.connection.on('error', (...args) => {
  console.error('MongoDB connection error:', ...args);
});

export const connectDb = async (uri: string, user: string, pass: string, options?: { [key: string]: string }): Promise<void> => {
  console.info('Connecting to the database...');
  const readyState = mongoose.STATES[mongoose.connection.readyState];
  if (readyState !== 'disconnected') {
    console.info('Already connected.');
    return;
  }

  try {
    console.info('Config URI: ', uri);
    await mongoose.connect(uri, { ...options, user, pass });
    console.info('Connected to the database.');
  } catch (error) {
    console.error('Error connecting to the database', error);
  }
};

export const disconnectDb = async (): Promise<void> => {
  await mongoose.disconnect();
  console.info('Disconnected from the database.');
};