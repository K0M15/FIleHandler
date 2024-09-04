# FileHandler

This is planed to replace the lengthy and cumbersom process of the file-api of Firebase, without risking to corrupt existing files.

## Usage
```
export interface IFileHandler{
    saveFile:   
        (file:File, path:string, writeover?: boolean)
                                =>  Promise<string | undefined>;
    getFile:    (path:string)   =>  File | undefined;
}
```
`import * as fh from "../src/FileHandler";`

## 


## Disclaimer

This works for the 2 functions, tested on Windows.

Things todo:
- [ ] Remove file
- [ ] Update file
- [ ] Append file