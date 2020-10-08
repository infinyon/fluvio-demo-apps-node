#  Server Operations

Server ops directory has a series of convenience commands wrapped around *curl*.

## Authorization Tokens

Chat Server use a simple alphanumeric token to get the user identify and authorize commands.

# System Initialization

Once the server is up and running, you need to provision the following:
* Admin User
* User Event Stream
* Channel Event Stream
* Default Channel

The scripts below cache Admin & Create user tokens in the local directory. If you prefer to save the tokens on your own, remove pipe to **jq**.

## Create Admin User

The system generates an authorization token when you create an admin user. The sample app only supports one admin user. The **admin** is **required** to initialize Chat server.

To create the admin user and cache the token, run the following command:

```
> ./users/createAdminUser admin | jq -r .token > _adminToken
```

For convenience, the token is saved into the _adminToken file in your current directory.

```
> cat _adminToken 
kd6mccx8
```

Keep this token safe at the sample App does not provide a recovery mechanism.


## Create Channel and User Streams

Use the authorization token and create Channel and User Streams

```
> ./eventStreams/adminCreateEventStreams `cat _adminToken`
{"result":"ok"}
```

## Create Default Channel

Create the default channel:

```
> ./channels/adminCreateDefaultChannel `cat _adminToken`
{"result":"ok"}
```

The system is provisioned and ready for use

# Other Commands

The commands below are available to unprivileged users. To run commands as **normal** user, register a new user.

## User Commands

### Register User

Requires:
 - no token

```
> ./users/registerUser alice
{"token":"3dofu3k3"}

```

### Get Users

Requires:
 - user token

```
./users/getUsers 3dofu3k3 | jq
[
  {
    "name": "alice",
    "online": true
  },
  {
    "name": "joe",
    "online": true
  }
]
```

### Unregister Users

Users can unregister themselves if they want to be removed from the system. User identify is identified from token.

Requires:
 - user token

```
./users/unregisterUser 3dofu3k3 
{"result":"ok"}
```

## Event Stream Command

### Get Event Streams

Requires:
 - user token

```
> ./eventStreams/getEventStreams 3dofu3k3 | jq
[
  {
    "name": "user-events",
    "topic": "nca-user-events",
    "created": "2020-04-10 16:03:09"
  },
  {
    "name": "channel-events",
    "topic": "nca-channel-events",
    "created": "2020-04-10 16:03:09"
  }
]
```


## Channel Commands

### Create Channel

The user that creates the channel is the channel owner. Only channel owners can delete the channel.

Requires:
 - user token


```
> ./channels/createChannel new 3dofu3k3
{"result":"ok"}
```

### Join Channel

Any user can join any channel. The user is identified by token. Join channel command returns all members currently in the channel.

Requires:
 - user token


```
> ./channels/joinChannel new 3dofu3k3 | jq
[
  {
    "channelName":"new",
    "userName":"alice",
    "joined":"2020-04-11 07:41:59"
    }
]
```

### Leave Channel

The user is identified by token.

Requires:
 - user token


```
> ./channels/leaveChannel new 3dofu3k3
{"result":"ok"}
```

### Get Channels

The user is identified by token.

Requires:
 - user token

```
> ./channels/getChannels `cat _token` | jq
[
  {
    "name": "default",
    "owner": "s",
    "topic": "nca-default",
    "created": "2020-04-10 16:19:58"
  },
  {
    "name": "new",
    "owner": "alice",
    "topic": "nca-new",
    "created": "2020-04-11 07:41:36"
  }
]
```

### Delete Channel

The user is identified by token. You may only delete channels you own.

Requires:
 - user token


```
> ./channels/deleteChannel new 3dofu3k3
{"result":"ok"}
```
