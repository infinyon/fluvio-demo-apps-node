
# Install Chat Client Dependencies
# Build dist/ files
pushd chat-client
npm install && npm run build
popd

# Install Chat Server Dependencies
pushd chat-server
npm install
popd

# Install Cypress Test Dependencies
npm install
