const { text } = require('express');
const moment = require('moment');

function formatUserId(username,userId){
    return{
        username,
        userId,
    };
}

module.exports = formatUserId;