        
    function sendShard(recipientEmail, shardName, shard, tripleBracketTest ) {
    console.log("i'm in sendShard!!");
    var template_params = {
        "recipient": recipientEmail,
        "shardName": shardName,
        "shard": shard,
        "tripleBracketTest": shard
    }
    var service_id = "deathsafe_emailjs";
    var template_id = "sendshard";
    //emailjs.send(service_id, template_id, template_params);
    //emailjs.sendForm('deathsafe_emailjs', 'sendshard', this);
};

