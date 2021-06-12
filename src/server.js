import express from 'express';
import cors from 'cors';
import { post_participant } from './participants.js';

const app = express();
app.use(express.json());
app.use(cors());
const routes = {
    participants: '/participants',
    messages: '/messages',
    status: '/status'
}

let active_participants = [];
let messages = [];

app.post(routes.participants, (req, res) => {
    post_participant(req, res);
});

app.get(routes.participants, (req, res)=>{
    res.send(active_participants);
})



const port = 4000;
app.listen(port);
