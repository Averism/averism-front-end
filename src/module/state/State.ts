export abstract class State {
    name: string;
    abstract save(): Promise<void>;
    abstract set(key: string, value: any): Promise<void>;
    abstract get(key: string): Promise<any>;
}