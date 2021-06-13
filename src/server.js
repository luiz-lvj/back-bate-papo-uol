import express, { json } from 'express';
import cors from 'cors';
import { checkActiveParticipants, formatedTime, isMessage, isValidSender, updateTimeUser } from './utils.js';
import { stripHtml } from 'string-strip-html';

const app = express();
const port = 4000;

app.use(cors())
app.use(json());

const routes = {
    participants: '/participants',
    messages: '/messages',
    status: '/status'
}

let active_participants = [];
let messages = [];

setTimeout(()=>{
    setInterval(() => {
        checkActiveParticipants(active_participants, messages);
        
    }, 15000);
}, 15000);


app.post(routes.participants, (req, res) => {
    if(!req.body.name || typeof(req.body.name)!== 'string'){
        res.status(400);
        res.send();
        return;
    }
    const name = stripHtml(req.body.name.trim()).result;
    const usersAlreadySet = active_participants.filter( user => user.name === name );
    if(name.length === 0 || usersAlreadySet.length > 0){
        res.status(400);
        res.send();
        return;
    }
    const elemParticipant = {
        name: name,
        lastStatus: Date.now()
    }
    const elemMessage = {
        from: name,
        to: 'Todos',
        text: 'entra na sala...',
        type: 'status',
        time: formatedTime(Date.now())
    }
    active_participants.push(elemParticipant);
    messages.push(elemMessage);
    res.status(200);
    res.send();
});

app.get(routes.participants, (req, res)=>{
    res.status(200);
    res.send(active_participants);
});

app.post(routes.messages, (req, res) =>{
    const message = req.body;
    if(!(message.to && message.text && message.type)){
        res.status(400);
        res.send();
        return;
    }
    if(!isMessage(message)){
        res.status(400);
        res.send();
        return;
    }
    const user = req.headers.user ? req.headers.user : null;
    
    if(!user || !isValidSender(user, active_participants)){
        res.status(400);
        res.send();
        return;
    }
    const elemMessage = {
        from: user,
        to: message.to,
        text: message.text,
        type: message.type,
        time: formatedTime(Date.now())
    }
    messages.push(elemMessage);
    res.status(200);
    res.send();
});

app.get(routes.messages, (req, res)=>{
    const limit = req.query.limit ? parseInt(req.query.limit) : null;
    let messagesToSend = (limit && messages.length > limit) ? messages.slice(messages.lenght - limit, messages.length) : messages;
    const user = req.headers.user ? req.headers.user : null;
    if(!user){
        res.status(400);
        res.send();
        return;
    }
    messagesToSend = messagesToSend.filter(message => {
        const isValidMessage = message.to === 'Todos' || message.to === user || message.from === user;
        return isValidMessage;
    });
    res.status(200);
    res.send(messagesToSend);
});

app.post(routes.status, (req, res) =>{
    const user = req.headers.user ? req.headers.user : null;
    if(!user || !isValidSender(user, active_participants)){
        res.status(400);
        res.send();
        return;
    }
    updateTimeUser(active_participants, user);
    res.status(200);
    res.send();
});

app.listen(port);



 