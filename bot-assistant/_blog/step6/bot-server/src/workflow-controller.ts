import {
    SID,
    ResponseMessage,
    ChoiceResponse,
    UserText,
    buildRequest,
} from "./messages";
import { StateMachine, State } from "./state-machine";
import { WsProxy, wsProxyEvents } from "./ws-proxy";

export class WorkflowController {
    private static _stateMachine: StateMachine;
    private static _initState: string;
    private _wsProxy: WsProxy;

    init(stateMachine: StateMachine, wsProxy: WsProxy) {
        this._wsProxy = wsProxy;

        this.listenForEvents();

        WorkflowController._stateMachine = stateMachine;
        WorkflowController._initState = stateMachine.keys().next().value;
    }

    processNewConnection(sid: SID) {
        const nextStates = this.getInit();

        nextStates.forEach(state => {
            if (state.sendRequest) {
                const request = buildRequest(sid, state.sendRequest);
                const message = JSON.stringify(request.payload?.message);
                this._wsProxy.sendMessage(sid, message);
            }
        })
    }

    processClientMessage(sid: SID, clientMsg: string) {
        const message: ResponseMessage = JSON.parse(clientMsg);

        const nextStates = this.getNext(message);
        nextStates.forEach(state => {
            if (state.sendRequest) {
                const request = buildRequest(sid, state.sendRequest);
                const message = JSON.stringify(request.payload?.message);
                this._wsProxy.sendMessage(sid, message);
            }
        });
    }

    private getInit() {
        return this.processNext(WorkflowController._initState);
    }

    private getNext(response: ResponseMessage) {
        var state: string = this.getState(response);

        return this.processNext(state);
    }

    private getState(response: ResponseMessage) {
        switch (response.kind) {
            case "ChoiceResponse": {
                return this.getChoiceResponseState(response);
            }
            case "UserText": {
                return this.getUserTextState(response);
            }
        }
    }

    private processNext(startState: string) {
        var nextStates: State[] = [];

        var state = WorkflowController._stateMachine.get(startState);
        while (state) {
            nextStates.push(state);

            const next = state.next || "";
            state = WorkflowController._stateMachine.get(next);
            if (next.length > 0 && !state) {
                console.error(`Error: Cannot find next state: ${next}`);
            }
        }

        return nextStates;
    }

    private getChoiceResponseState(choiceResponse: ChoiceResponse) {
        for (let [key, state] of WorkflowController._stateMachine.entries()) {
            if (state.matchResponse &&
                state.matchResponse.kind == choiceResponse.kind &&
                state.matchResponse.groupId == choiceResponse.groupId &&
                state.matchResponse.itemId == choiceResponse.itemId) {
                return key;
            }
        }

        console.error(`Error: cannot find choice ${JSON.stringify(choiceResponse)}`);
        return WorkflowController._initState;
    }

    private getUserTextState(userText: UserText) {
        for (let [key, state] of WorkflowController._stateMachine.entries()) {
            if (state.matchResponse &&
                state.matchResponse.kind == "UserText" &&
                state.matchResponse.sessionId == userText.sessionId) {
                return key;
            }
        }

        console.error(`Error: cannot find user session ${JSON.stringify(userText)}`);
        return WorkflowController._initState;
    }

    private listenForEvents() {
        wsProxyEvents.on(
            wsProxyEvents.CONNECTION,
            (sid: SID) => {
                this.processNewConnection(sid);
            }
        );

        wsProxyEvents.on(
            wsProxyEvents.MESSAGE,
            async (sid: SID, clientMsg: string) => {
                this.processClientMessage(sid, clientMsg);
            }
        );
    }
}