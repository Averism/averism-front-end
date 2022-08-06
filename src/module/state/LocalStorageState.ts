import { State } from "./State";
import {stateServiceInstance} from "./StateService";

export class LocalStorageState extends State {
    name(): string {
        return "localstorage";
    }
    async save(): Promise<void> {
    }
    async set(key: string, value: any): Promise<void> {
        window.localStorage.setItem(key, JSON.stringify(value));
    }
    get(key: string): Promise<any> {
        let str = window.localStorage.getItem(key);
        if (str) {
            return JSON.parse(str);
        }
    }
    
}

export const localStorageStateInstance = new LocalStorageState();
stateServiceInstance.registerState(localStorageStateInstance);