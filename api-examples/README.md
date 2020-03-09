# Node API examples for Fluvio Streaming Platform

## Installation

Fluvio node requires Rust to compile. Please follow the directions at [@fluvio/client](https://www.npmjs.com/package/@fluvio/client) to configure the environment.

After the environment is setup, install:

```
npm install
```


## Start Producer

Start producer command requires a topic and a partition.  Server address defaults to '0.0.0.0:9003'.

```
node src/produce.js --topic my-topic-1 --partition 0
```

## Start Consumer

Start consumer command requires a topic and a partition. 

```
node src/consume.js --topic my-topic-1 --partition 0
```