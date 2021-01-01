# Install Chat Client Dependencies
pushd chat-client
npm install
npm run build:dev
popd

# Install Chat Server Dependencies
pushd chat-server
npm install
popd