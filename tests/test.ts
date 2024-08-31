
export interface ITestResult{
    amount:number;
    passed:number;
}

export interface ITest{
    runTest:() => Promise<ITestResult>;
}

export function test_array(ar1:Array<any>, ar2:Array<any>)
{
    if (ar1.length != ar2.length)
        return false;
    ar1.map((val, index) =>
    {
        if(val != ar2[index])
            return false;
    })
    return true;
}