export function isMessage(message) {
    const to = message.to.trim();
    const text = message.text.trim();
    if(to.length === 0 || text.length === 0){
        return false;
    }
    const status_available = ["message", "private_message"];
    if(!status_available.includes(message.type)){
        return false;
    }
    return true;
}
export function isValidSender(userName, participants){
    const validSender = participants.find( user =>{
        if(user.name === userName){
            return true;
        }
        return false;
    });
    if(!validSender){
        return false;
    }
    return true;
}

export function formatedTime(timestrap){
    const date = new Date(timestrap);
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();
    const strHours = parseInt(hours) > 9 ? hours : '0' + hours;
    const strMinutes = parseInt(minutes) > 9 ? minutes : '0' + minutes;
    const strSeconds = parseInt(seconds) > 9 ? seconds : '0' + seconds;

    const formated = `${strHours}:${strMinutes}:${strSeconds}`;
    return formated;
}

export function updateTimeUser(participants, userName){
    participants = participants.map(user => {
        if(user.name === userName){
            user.lastStatus = Date.now();
        }
        return user;
    });
}

export function checkActiveParticipants(participants, messagesArray){
    const max_time = 10000;
    let exiting_Users = [];
    for(let i = 0; i < participants.length; i++){
        if(Date.now() - participants[i].lastStatus > max_time){
            exiting_Users.push(participants[i].name);
            participants.splice(i, 1);
            continue;
        }
    }
    exiting_Users.forEach( userName =>{
        addExitMessage(messagesArray, userName);
    });
}

function addExitMessage(messagesArray, userName){
    const newMessage = {
        from: userName,
        to: 'Todos',
        text: 'sai da sala...',
        type: 'status',
        time: formatedTime(Date.now())
    }
    messagesArray.push(newMessage);
}
