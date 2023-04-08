var PythonShell = require('python-shell').PythonShell;

let options = {
    args: ['images/B.png']
};
  
PythonShell.run('shell.py', options).then(messages=>{
    console.log(messages[2]);
});