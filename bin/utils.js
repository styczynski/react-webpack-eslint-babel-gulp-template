const spawnProcess = require('child_process').spawn;

export function execCommand(commandString, callback, options) {

    console.log(" > "+commandString);

    let command = null;

    if(!options) {
        command = spawnProcess(commandString, {
            shell: true
        });
    } else {
        console.log(" > options: "+JSON.stringify(options));
        command = spawnProcess(commandString, [], options);
    }

    command.stdout.on('data', function (data) {
        process.stdout.write(data);
    });

    command.stderr.on('data', function (data) {
        process.stdout.write(data);
    });

    command.on('error', (err) => {
        console.log("Command failed during execution");
    console.log(err);
    setTimeout(function(){
        throw err;
    }, 0);
});

    command.on('exit', function (code) {
        console.log("Command exited with code "+code.toString());
        if(code != 0) {
            console.log("Non-zero command exit code!");
            setTimeout(function(){
                throw "Non-zero command exit code!";
            }, 0);
        } else {
            callback();
        }
    });

};