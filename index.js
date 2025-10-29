(async()=>{
    "use strict";

    // Dependencies
    const simpleAES256 = require("simple-aes-256")
    const hashJS = require("hash.js")
    const ky = require("ky").default
    const fs = require("fs")

    // Variables
    const args = process.argv.slice(2)

    // Functions
    const getData = async(secret)=>{
        const response = await ky.post("https://www.codedpad.com/module.php", {
            headers: {
                "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
                "referer": "https://www.codedpad.com/",
                "user-agent": "x",
                "x-requested-with": "XMLHttpRequest"
            },
            body: `module_act=open&pad_code=${secret}&padlock_code=&v=A.1.16`
        })
        return response.json()
    }

    const updateData = async(secret, data)=>{
        const response = await ky.post("https://www.codedpad.com/module.php", {
            headers: {
                "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
                "referer": "https://www.codedpad.com/",
                "user-agent": "x",
                "x-requested-with": "XMLHttpRequest"
            },
            body: `module_act=save&pad_code=${secret}&pad_content=${data}&padlock_code=&prune=noprune&pruneid=&v=A.1.16`
        })
        return response.text()
    }

    // Main
    if(!args.length){
        console.log("Usage: node index.js <input/output> <core-phrase> <secret>")
        process.exit()
    }

    const command = args[0]
    const corePhrase = hashJS.sha512().update(args[1]).digest("hex")
    var secret = hashJS.sha256().update(args.slice(2).join(" ")).digest("hex")
    secret = `${corePhrase}-${secret}-${corePhrase.slice(0, corePhrase.length/0.5)}${secret.slice(0, secret.length/0.5)}`
    console.log(`Secret: ${secret}\n`)
    
    if(command === "input"){
        const inputData = fs.readFileSync("./input.txt", "utf8")
        if(!inputData.length){
            console.log("Input file is empty. Please ensure it contains a data.")
            process.exit()
        }

        const result = await updateData(secret, simpleAES256.encrypt(corePhrase, inputData).toString("hex"))
        result.match("datasaved") ? console.log("Successfully updated.") : console.log("Failed to update.")
    }else if(command === "output"){
        const result = await getData(secret)
        
        if(result.pad_content){
            console.log(simpleAES256.decrypt(corePhrase, Buffer.from(result.pad_content, "hex")).toString("utf8"))
        }else{
            console.log("The note is empty.")
        }
    }else{
        console.log("Invalid command (input/output).")
    }
})()