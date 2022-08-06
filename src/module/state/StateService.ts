import {State} from "./State";
import {Service} from "../servicemanager"

export class StateService implements Service {
    name(): string {
        return "state";
    }
    
    async start(): Promise<void> {
    }

    async stop(): Promise<void> {
    }

    async call(method: string, ...args: any[]): Promise<any> {
        switch (method) {
            case "save": return this.save();
            case "register": return this.registerState(args[0], args[1]);
            default: return Promise.reject(`Unknown method: ${method}`);
        }
    }

    states: { [key: string]: {state: State, order: number} } = {};

    async registerState(state: State, order?: number): Promise<void> {
        if (!order) {
            order = Math.max(...Object.values(this.states).map(x=>x.order)) + 1;
        }
        this.states[state.name] = {state, order};
    }

    async getState(name: string): Promise<State> {
        return this.states[name].state;
    }

    async save() {
        const states = Object.values(this.states).sort((a, b) => a.order - b.order);
        for(let state of states){
            await state.state.save();
        }
        return;
    }
}