#!/usr/bin/env node
const fs = require('fs');
const spawn = require('child_process').spawn;
const args = process.argv.slice(2);
const { exec } = require('node:child_process');


const app = {
    /**
     * Checks if a filename was passed as command
     * line arguments.
     */
    init: function(){
        that = this;
        if (args[0] === undefined || args[0] === "") {
            console.error("Error: No filename passed, exiting...");
            return;
        }
        const file_name = './' + args[0];
        that.watch_file(file_name);
        exec(`${file_name}`);
    },
    /**
     * Watches .cpp file for changes.
     */
    watch_file:function(file_name){
        let fswait = false;
        console.log(`Watching process started for file ${file_name}`);
        let ext = args[0].length - 4;
        let output_file = args[0].substring(0, ext);
        fs.watch(file_name, (event, filename) => {
            if (filename) {
                if (fswait) return;
                fswait = setTimeout(() => {
                    fswait = false;
                }, 100);
                console.log(`${file_name} file was changed`);
                const compile_file = spawn('g++', ["-o", output_file, file_name]);
                exec(`.// ${output_file}`, (error, stdout, stderr) => {
                  if (error) {
                    console.error(`exec error: ${error}`);
                    return;
                  }
                  console.log(`stdout: ${stdout}`);
                  console.error(`stderr: ${stderr}`);
                });

                compile_file.stdout.on('data', function(data){
                    console.log(`stdout: ${data}`)
                    console.log(`${output_file} object file successfully generated`);
                })

                compile_file.stderr.on('data', function(data){
                    console.log(`stderr: ${data}`)
                })               
            }
        });
    }
}
//Starts the application
app.init();

module.exports = app;
