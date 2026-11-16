// e.g. mongodb://<user>:<pass>@host:27017/node-social?authSource=admin
export const mongoUrl = process.env.MONGODB_URI ?? 'mongodb://127.0.0.1:27017/node-social';
