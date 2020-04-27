# Server Backend for Chat App

Server backend is the resource coordinator for the Chat App.

## Server Components

### Event Streams

Event streams are notification data streams. There are 2 event stream:
* **channel-events**
* **user-events**

Channel event stream receives the following event types
* CHANNEL_CREATED
* CHANNEL_DELETED

User event stream receives the following event types:
* USER_REGISTERED
* USER_UNREGISTERED
* USER_ONLINE
* USER_OFFLINE

When client join the ChatApp, the servers receive a registration request. Only registered clients are allowed to communicate on the server. 

### Users

Each user is associated with a Chat client. When a new chat client connects to the server, it must register the user.
The server keeps track of all registered user and their online/offline status.

### Channels

Channels are communication streams shared by users to exchange messages. A user can join multiple channels. Once joined it can publish messages to the channels and it gets notifications when new messages are published.

The server creates a **default** channel during initialization. All other channels are created by Users. 
When a user creates a channel, it is the owner of the channel. Users can only delete channels they own.

## Fluvio Data Streams

Fluvio data streaming handles all real-time communications between services:
* clients and servers (notification channels)
* among clients (chat channels)

Each event stream is mapped to a **Fluvio topic/partition**:

* channel-events => **nca-channel-events/0**
* user-events => **nca-user-events/0**

Each channel is also mapped to a **Fluvio topic/partition**:

* "default" channel => **nca-default/0**
* "&lt;name&gt;" channel => **nca-&lt;name&gt;/0**


## Initialization

Start the server and provision the following components:
* Admin User
* Event Streams (Channel & User)
* Default Channel

#### Start Server
```
> npm run start:dev
```

During initialization, the server connects to Fluvio to create topics for event streams
and default channel. The server exits on any error during initialization.

## Fluvio Topics

Chat servers created the following topics:

```
> fluvio topic list
 NAME                TYPE      PARTITIONS  REPLICAS  IGNORE-RACK  STATUS       REASON  
 nca-channel-events  computed      1          3           -       provisioned   
 nca-default         computed      2          3           -       provisioned   
 nca-user-events     computed      1          3           -       provisioned  
 ```

All topics are prepended with nca which stands for "node chat app". Event topics have **1 partition** whereas channel topics have **2**.

### Channel Partitions

The partitions in the channel topic provide a clean separation between **event** and **messages**:
* **partition 0** is used for events, such as membership information.
* **partition 1** is used for chat messages.

When a new channel is added, the server creates a new topic. When channels are deleted the topics are removed.