const ps = require('prompt-sync');
const prompt = (string) => {
    let input = ps();
    let userInput = input(`${string} `)
    return userInput;
};

module.exports = prompt;