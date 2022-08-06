export interface Service {
    start(): Promise<void>;
    stop(): Promise<void>;
    call(method: string, ...args: any[]): Promise<any>;
    name(): string;
}