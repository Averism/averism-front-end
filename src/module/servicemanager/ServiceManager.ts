import { Service } from "./Service";

export class ServiceManager{
    private services: { [key: string]: Service[] } = {};

    registerService(service: Service): void {
        this.services[service.name()] = this.services[service.name()] || [];
        this.services[service.name()].push(service);
    }

    get<T extends Service>(name: string): T[] {
        return this.services[name] as T[] || [];
    }

    async callOne(name: string, method: string, ...args: any[]): Promise<any> {
        const services = this.services[name];
        if (!services) throw new Error(`No service registered for ${name}`);
        let result = undefined;
        for(let service of this.services[name]){
            try{
                result = await service.call(method, ...args);
            }catch(e){}
            if(result !== null) return result;
        }
        return result;
    }

    async callAll(name: string, method: string, ...args: any[]): Promise<any[]> {
        const services = this.services[name];
        if (!services) throw new Error(`No service registered for ${name}`);
        const promises = services.map(service => service.call(method, ...args));
        let result = await Promise.all(promises).then(results => results.filter(x => x !== null));
        if (result.every(x => Array.isArray(x))) return result.flatMap(x => x);
        return result;
    }
}

export const serviceManagerInstance = new ServiceManager();