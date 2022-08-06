import {State} from "./State";
import {Service, serviceManagerInstance} from "../servicemanager"

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
            case "get": return this.getState(args[0], args[1]);
            case "set": return this.setState(args[0], args[1], args[2]);
            default: return Promise.reject(`Unknown method: ${method}`);
        }
    }

    states: { [key: string]: {state: State, order: number} } = {};

    async registerState(state: State, order?: number): Promise<void> {
        if (!order) {
            order = Math.max(...Object.values(this.states).map(x=>x.order)) + 1;
        }
        this.states[state.name()] = {state, order};
    }

    async getState(name: string, key: string): Promise<any> {
        return this.states[name].state.get(key);
    }

    async setState(name: string, key: string, value: any): Promise<void> {
        return this.states[name].state.set(key, value);
    }

    async save() {
        const states = Object.values(this.states).sort((a, b) => a.order - b.order);
        for(let state of states){
            await state.state.save();
        }
        return;
    }
}

export const stateServiceInstance = new StateService();
serviceManagerInstance.registerService(stateServiceInstance);