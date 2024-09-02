import { parse } from "path";
import {
    IFileHandler,
    id
} from "../../common/types/types";

import * as fs from "fs";

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
        if(!fs.existsSync(this.settings.storage_directory)){
            fs.mkdirSync(this.settings.storage_directory, {recursive:true});
        }
    }
    
    getFile(path: string){
        {
            let parsedPath = filePathFactory(path);
            if( parsedPath != undefined && fs.existsSync(`${this.settings.storage_directory}/${path}`)){
                let buffer = fs.readFileSync(`${this.settings.storage_directory}/${path}`);
                let blob = new File([buffer], (parsedPath as IFilePath).fileName);
                return blob;
            }
            return undefined;
        }
    }

    async saveFile(file: File, path:string, writeover = false): Promise<string | undefined>{
        let parsedPath = filePathFactory(path);
        if (parsedPath == undefined)
            return undefined;
        let bufferView = new DataView(await file.arrayBuffer()); 
        fs.writeFileSync(`${this.settings.storage_directory}/${path}`, bufferView);
        return path;
    };
}
