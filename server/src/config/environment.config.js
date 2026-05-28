import 'dotenv/config'

export const env = {
    APP_PORT: process.env.PORT || 5000,
    TMDB_ACCESS_TOKEN: process.env.TMDB_ACCESS_TOKEN,
    TMDB_BASE_URL: process.env.TMDB_BASE_URL,
    DATABASE_URL: process.env.DATABASE_URL,
    SESSION_SECRET: process.env.SESSION_SECRET || 'phai_thay_doi_key_nay_de_bao_mat_session',
    CLIENT_URL: process.env.CLIENT_URL || 'http://localhost:5173'
}
