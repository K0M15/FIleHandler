
import { test_handler } from "./file_hander";

new test_handler().runTest().then((result) => {
    if(result.amount == result.passed)
        console.log("Passed Filehandlertests: 100%")
    else
        console.error("Not passed Filehandlertests: %d of %d", result.passed-result.amount, result.amount);
});
