export type id = string;

export interface IFileHandler{
    saveFile:   
        (file:File, path:string, writeover: boolean | undefined)
                                =>  Promise<string>;
    getFile:    (path:string)   =>  Promise<File>;
}


export interface IDatabase<T>{
    getAll:(tahle:string)                       =>  Array<T>;
    getById:(id:id, table:string)               =>  T | undefined;
    getByFeature:(elem:Partial<T>, table:string)=>  T | undefined;
    setEntry:(elem:Partial<T>, table:string)    =>  id;
}