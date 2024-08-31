import { parse } from "path";
import {
    IFileHandler,
    id
} from "../../common/types/types";

import * as fs from "fs/promises";

export interface IFileHandlerSettings{
    storage_directory:  string;
}

export function settingsFactory(){
    return {
        storage_directory:"",
    }
}

interface IFilePath{
    dirParts:           Array<string>;
    fileName:           string;
    StriptedfileName:   string;
    fileExtension:      string | undefined;
}

export function filePathFactory(path:string){
    let allElements = path.split('/');
    let fileName:string | undefined = '';
    while (fileName == '')
        fileName = allElements.pop();
    if(fileName === undefined)
        return undefined;
    let dirParts = allElements;
    let StriptedfileName = fileName.split('.')[0];
    let fileExtension = fileName.split('.')[1];
    return {
        dirParts,
        StriptedfileName,
        fileExtension,
        fileName,
    } as IFilePath;
}

export class FileHandler implements IFileHandler{
    private settings:IFileHandlerSettings
    constructor(settings:Partial<IFileHandlerSettings>){
        this.settings = settingsFactory();
        Object.assign(this.settings, settings);
    }

    async getFile(path: string){
        return new Promise(
            (res:(file:File)=>void, rej:(reason:any)=>void) => 
            {
                let result_file = undefined;
                let parsedPath = filePathFactory(path);
                fs.access(path, fs.constants.F_OK)
                    .then(() => {
                        fs.readFile(path).then((val) =>{
                            let blob = new File([val], (parsedPath as IFilePath).fileName);
                            res(blob);
                        }).catch(rej);
                    })
                    .catch(rej);
                return result_file;
            }
        )
    }

    saveFile(file: File, path:string, writeover = false){
        return new Promise(
            (res:(path:string)=>void, rej:(reason:any)=>void) => 
            {
                let parsedPath = filePathFactory(path);
                if (parsedPath == undefined)
                    rej("Path not parseable");
                file.arrayBuffer()
                    .then((arrBuff) => {
                        fs.writeFile(path, new DataView(arrBuff, 8, file.size))
                            .then(() => {res(path)})
                            .catch(rej);
                    }).catch(rej);
            }
        )
    };
}
