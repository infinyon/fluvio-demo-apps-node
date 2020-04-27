import { execShellCommand, checkError, arrayToJson } from "./execShell";

const TOPIC_NAME_PREPEND = "nca";

export const createTopicIfNotDefined = async (name: string, partitions: number, replication: number) => {
    let found = await hasTopic(name);
    if (found) {
        console.log(`Topic '${name}' exists`);
        return false;
    }

    return await createTopic(name, partitions, replication);
}

export const deleteTopicIfDefined = async (name: string) => {
    let found = await hasTopic(name);
    if (!found) {
        console.log(`Topic '${name}' found`);
        return false;
    }

    await deleteTopic(name);
    return true;
}
export const createTopic = async (name: string, partitions: number, replication: number) => {
    let cmd = `fluvio topic create -t ${name} -r ${replication} -p ${partitions}`;
    let cmdRes = await execShellCommand(cmd) as string;

    let err = checkError(cmdRes);
    if (err) {
        throw new Error(err);
    }

    console.log(`Topic '${name}' created`);
    return true;
}

export const hasTopic = async (name: string) => {
    let cmd = `fluvio topic describe -t ${name}`;
    let cmdRes = await execShellCommand(cmd) as string;

    if (cmdRes.indexOf("error:") >= 0) {
        return false;
    }

    return true;
}

/*
 * Topic Format
 *  {
 *      "name": string,
 *      "topic": {
 *          "type_computed": boolean,
 *          "partitions": number,
 *          "replication_factor": number,
 *          "ignore_rack_assignment": boolean,
 *          "status": enum,
 *          "reason": string,
 *          "partition_map": [{
 *              "id": number,
 *              "leader": number,
 *              "replicas": [
 *                  number, ...
 *               ],
 *              "live_replicas": [
 *                  number, ...
 *              ]
 *          }]
 *      }
 * }
 */
export const getTopic = async (name: string) => {
    let cmd = `fluvio topic describe -t ${name} -O json`;
    let cmdRes = await execShellCommand(cmd) as string;

    let err = checkError(cmdRes);
    if (err) {
        throw new Error(err);
    }

    let topic = arrayToJson(cmdRes);
    if (!topic) {
        throw new Error('Cannot parse topic response');
    }

    return topic;
}

export const deleteTopic = async (name: string) => {
    let cmd = `fluvio topic delete -t ${name}`;
    let cmdRes = await execShellCommand(cmd) as string;

    let err = checkError(cmdRes);
    if (err) {
        throw new Error(err);
    }

    console.log(`Topic '${name}' deleted`);
}

export const toTopicName = (name: string) => {
    return `${TOPIC_NAME_PREPEND}-${name}`;
}
