import express from 'express'
const app = express()

app.use(express.json())

const APP_PORT = 3000
app.listen(APP_PORT, () => {
    console.log(`Server is listening on ${APP_PORT}`);
})