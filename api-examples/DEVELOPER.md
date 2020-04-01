## Link to Local Fluvio Client

Use **npm link** to create symbolic link into your local repository: <br/>
(**Note**: _fluvio_ project must be in parallel directory with _node-demo-apps_) 

```
cd ../../fluvio/src/client-node/
npm link
cd ../../../node-demo-apps/api-examples/
npm link "@fluvio/client"
```

A symbolic link to "@fluvio/client" was created, let's double check:

```
ls -l node_modules/@fluvio/client

lrwxr-xr-x  1 aj  staff  76 Mar  9 14:32 node_modules/@fluvio/client -> ../../../../../../.nvm/versions/node/v13.5.0/lib/node_modules/@fluvio/client
```

## Remove Link (and point back to npm repo)

```
npm unlink
npm install
```

The symbolic link has been replaced with the project loaded from npm:

```
ls -l node_modules/@fluvio/client

total 168
-rw-r--r--  1 aj  staff  47101 Mar  9 14:28 Cargo.lock
-rw-r--r--  1 aj  staff    629 Oct 26  1985 Cargo.toml
-rw-r--r--  1 aj  staff  11357 Oct 26  1985 LICENSE-APACHE
-rw-r--r--  1 aj  staff    218 Oct 26  1985 Makefile
-rw-r--r--  1 aj  staff   1028 Oct 26  1985 README.md
-rw-r--r--  1 aj  staff    129 Oct 26  1985 build.rs
drwxr-xr-x  3 aj  staff     96 Mar  9 14:29 dist
-rw-r--r--  1 aj  staff   1429 Mar  9 14:28 package.json
drwxr-xr-x  7 aj  staff    224 Mar  9 14:28 src
drwxr-xr-x  4 aj  staff    128 Mar  9 14:29 target
-rw-r--r--  1 aj  staff    615 Oct 26  1985 test.js
```
