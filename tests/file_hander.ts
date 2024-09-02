import {
    IFileHandler,
    id
} from "../../common/types/types";

import {} from "os";

import * as fs from "fs";
import * as fh from "../src/FileHandler";
import { ITest, ITestResult, test_array} from "./test";

type testFunction = () => false | true | Promise<false | true>;

function testFilePathFactory(path:string, result:Partial<ReturnType<typeof fh.filePathFactory>>)
{
    let t = fh.filePathFactory(path);
    if( t == undefined && result != undefined)
        return false;
    // let t = fh.filePathFactory(path) as {[key:string]:string | undefined | string[]} | undefined;
    if(result == undefined)
        return result == t;
    if (Object.entries(result as {[key:string]:string | string[] | undefined}).map((entrie, index) =>
    {
        if(Object.keys(t as unknown as {[key:string]:string | string[] | undefined}).indexOf(entrie[0]) == -1)
            return false;
        /*  @ts-expect-error */
        if(Array.isArray(result[entrie[0]]) && Array.isArray(t[entrie[0]])){
        /*  @ts-expect-error */
            let r = test_array(result[entrie[0]], t[entrie[0]])
            if(!r)
                console.error("Error %s does not equal its target", entrie[0])
            return r;
        }
        /*  @ts-expect-error */
        if(t[entrie[0]] != t[entrie[0]]){
        /*  @ts-expect-error */
            console.error("Error: %s does not equal %s", result[entrie[0]] as string, t[entrie[0]] as string );
            return false;
        }
        return true;
    }).includes(false))
        return false;
    return true;
}

let basicPath:testFunction = () => {
    return testFilePathFactory("../src/test/soemthing/file.ts", {
        dirParts:[ "..", "src", "test", "soemthing"],
        fileExtension: "ts",
        fileName:"file.ts",
        StriptedfileName:"file",
    })
}

let emptyPath:testFunction = () => {
    return testFilePathFactory("", undefined);
}

let dirPath:testFunction = () => {
    return testFilePathFactory("src/", {
        dirParts:[],
        fileExtension: undefined,
        fileName:"src",
        StriptedfileName:"src",
    });
}

function setupFileHandler(dir:string){
    let settings:fh.IFileHandlerSettings = {
        storage_directory:dir
    }
    let handler = new fh.FileHandler(settings);
    return handler;
}

let testNonExistantFile:testFunction = () =>{
    let handler = setupFileHandler('./temp/');
    let file = handler.getFile('test.ts');
    if (file == undefined)
        return true;
    return false;
}

let testExistingFile:testFunction = () =>{
    let handler = setupFileHandler(`${__dirname}`)
    let file = handler.getFile('main.ts');
    if( file != undefined )
        return true;
    return false;
}

let storeFile:testFunction = () => {
    let handler = setupFileHandler(`${__dirname}/temp`)
    let buffer = Buffer.alloc(11, "Somestring", "ascii");
    let file = new File([buffer], "testFile");
    let p = handler.saveFile(file, `testFile`)
    if(p != undefined)
        return true;
    return false;
}

let storeAndReciveFile:testFunction = async () => {
    let path = `testFile`
    let handler = setupFileHandler(`${__dirname}/temp`)
    let buffer = Buffer.alloc(11, "Somestring", "ascii");
    let file = new File([buffer], "testFile");
    let p = await handler.saveFile(file, path, true);
    if(p == undefined)
        return false;
    let f1 = await handler.getFile(path);
    let f2 = await handler.getFile(p);
    if(f1?.size == f2?.size)
        return true;
    return false;
}

export class test_handler implements ITest{
    test:Array<testFunction> = [
        basicPath,
        emptyPath,
        dirPath,
        testNonExistantFile,
        testExistingFile,
        storeFile,
        storeAndReciveFile,
    ];
    async runTest()
    {
        let result = {
            amount: this.test.length,
            passed: 0,
        } as ITestResult

        let i = 0;
        while ( i < result.amount){
            let val = await Promise.resolve(this.test[i]()?1:0);
            result.passed += val;
            i++;
        }
        return result;
    }
}