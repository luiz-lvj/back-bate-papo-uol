
export const post_participant = (req, res) => {
    const name = req.body.trim();
    if(name.length === 0){
        res.status(400);
        res.send();
        return;
    }

}