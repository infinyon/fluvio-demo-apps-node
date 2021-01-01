build:
	make -C server build
	make -C client build

setup:
	fluvio topic create chat-app-users
	fluvio topic create chat-app-messages
	fluvio topic create chat-app-sessions

run-server:
	make -C server run

run-client:
	make -C client run