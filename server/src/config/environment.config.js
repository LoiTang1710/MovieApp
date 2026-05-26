import 'dotenv/config'

export const env = {
    APP_PORT: process.env.APP_PORT,
    JWT_SECRET: process.env.JWT_SECRET,
    TMDB_ACCESS_TOKEN: process.env.TMDB_ACCESS_TOKEN,
    TMDB_BASE_URL: process.env.TMDB_BASE_URL,
    DATABASE_URL: process.env.DATABASE_URL
}
