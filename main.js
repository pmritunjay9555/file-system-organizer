let inputArr = process.argv.slice(2);
let fs = require("fs");
let path = require("path");
console.log(inputArr);
//node main.js tree  "directoryPath"
//node main.js organize "directoryPath"
//node main.js help
let command = inputArr[0];
let types = {
    media: ["mp4", "mkv","mp3"],
    archives: ['zip', '7z', 'rar', 'tar', 'gz', 'ar', 'iso', "xz"],
    documents: ['docx', 'doc', 'pdf', 'xlsx', 'xls', 'odt', 'ods', 'odp', 'odg', 'odf', 'txt', 'ps', 'tex'],
    app: ['exe', 'dmg', 'pkg', "deb"]
}
switch(command){
    case "tree":
        treeFn(inputArr[1]);
        break;
    case "organize":
        organizeFn(inputArr[1]);
        break;
    case "help":
        helpFn(inputArr[1]);
        break;
    default:
        console.log("🙏 input right command");
        break;
}

function treeFn(dirPath){
    console.log("Tree command implemented for", dirPath);
}
function organizeFn(dirPath){
    // console.log("organize command implemented for", dirPath);
    // 1. input -> directory path given 
    let destPath;
    if(dirPath == undefined){
        console.log("Kindly enter the path");
    }
    else{
        let doesExist = fs.existsSync(dirPath);
        if(doesExist){
            // 2. create -> organized_files -> directory
            destPath = path.join(dirPath,"organized_files");
            if(fs.existsSync(destPath) == false){

                fs.mkdirSync(destPath);
            };
        }
        else{
            console.log("Kindly enter the path");
            return;
        }
    }
    organizeHelper(dirPath, destPath);
    
    
}
function organizeHelper(src,dest){
    // 3. identify categories of all the files present  in that input directory ->
    let childNames = fs.readdirSync(src);
    // console.log(childName);
    for(let i = 0; i < childNames.length; i++){
        let childAddress = path.join(src,childNames[i]);
        let isFile = fs.lstatSync(childAddress).isFile();
        if(isFile){
            // console.log(childNames[i]);
            let category = getCategory(childNames[i]);
            console.log(childNames[i], "belong to", category);
            // 4. copy/cut files to that organized directory inside of any of category folder 
            sendFiles(childAddress, dest,category);
        }
    }
}
function sendFiles(srcFilePath, dest, category){
    let categoryPath = path.join(dest,category);
    if(fs.existsSync(categoryPath) == false){
        fs.mkdirSync(categoryPath)
    }
    let fileName = path.basename(srcFilePath);
    let destFilePath = path.join(categoryPath, fileName);
    fs.copyFileSync(srcFilePath,destFilePath);
    fs.unlinkSync(srcFilePath);
}
function getCategory(name){
    let ext = path.extname(name);
    ext = ext.slice(1);
    for(let type in types){
        let cTypeArr = types[type];
        for(let i = 0; i < cTypeArr.length; i++){
            if(ext == cTypeArr[i] ){
                return type;
            }
        }
    }
    return "others";
}
function helpFn(dirPath){
    console.log(`
        List of all the commands:
        node main.js tree  "directoryPath"
        node main.js organize "directoryPath"
        node main.js help
        `);
}