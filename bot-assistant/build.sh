# Install Bot Client Dependencies
# Build dist/ files
pushd bot-client
npm install
popd

# Install Bot Server Dependencies
pushd bot-server
npm install
popd
