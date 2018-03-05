module.exports = {
    'googleAuth' : {
        'clientID'      : process.env.clientID,
        'clientSecret'  : process.env.clientSecret,
        'callbackURL'   : 'http://localhost:3000/auth/google/callback'
    }
};
