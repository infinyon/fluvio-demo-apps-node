# Node API examples for Fluvio Streaming Platform

You must have a Fluvio Cluster for your Node App can connect to. If you don't have a cluster installed, create one on [Fluvio Cloud](https://fluvio.io/docs/getting-started/quick-start/#create-a-fluvio-cloud-account).

## Installation

Fluvio node requires Rust to compile. Please follow the directions at [@fluvio/client](https://www.npmjs.com/package/@fluvio/client) to configure the environment.

After the environment is setup, install:

```
npm install
```

## Download fluvio CLI and add Topic

Download Fluvio cli from

* [CLI binaries](https://github.com/infinyon/fluvio/releases)

Move to bin directory and make executable.

Add a topic

```
$ fluvio topic create -t "my-topic" -r 2 -p 2
topic 'my-topic' created successfully
```

## Start Producer

```
node src/produce.js --topic my-topic --partition 0
```

## Start Consumer

Start consumer command requires a topic and a partition. 

```
node src/consume.js --topic my-topic --partition 0
```