import * as child_process from "child_process";

export const execShellCommand = async function (cmd: string) {
    return new Promise((resolve, reject) => {
        child_process.exec(cmd, (error: any, stdout: any, stderr: any) => {
            if (error) {
                console.warn(error);
            }
            resolve(stdout ? stdout : stderr);
        });
    });
}

export const checkError = function (response: string) {
    if (response.startsWith("error:")) {
        const err = response.substring(6).trim();
        return err;
    }
    return undefined;
}

export const arrayToJson = function (response: string) {
    try {
        let jsonResponse = JSON.parse(response)
        if (jsonResponse.isArray() && jsonResponse[0]) {
            return jsonResponse[0];
        }
        return undefined;
    } catch (err) {
        return undefined;
    }
}