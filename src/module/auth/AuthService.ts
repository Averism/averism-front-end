import { Service, serviceManagerInstance } from "../servicemanager";

export class AuthService implements Service {
    cognitoUrl: string = 'https://averism.auth.ap-southeast-1.amazoncognito.com/';
    clientId: string = '73g7s1vkbgf7vgknimupgaghsn';

    constructor(cognitoUrl?: string, clientId?: string) {
        console.log(cognitoUrl, clientId);
        if (cognitoUrl) {this.cognitoUrl = cognitoUrl;}
        if (clientId) {this.clientId = clientId;}
        console.log(this);
    }

    async start(): Promise<void> {
    }

    async stop(): Promise<void> {
    }

    async call(method: string, ...args: any[]): Promise<any> {
        switch (method) {
            case "login": return this.login();
            default: return Promise.reject(`Unknown method: ${method}`);
        }
    }

    name(): string {
        return "auth";
    }

    async login() {
        await serviceManagerInstance.callAll("state", "save");
        let redirect = 'https://www.averism.com';
        let loginUrl = this.cognitoUrl + 'login?response_type=token&client_id=' + this.clientId + '&redirect_uri=' + redirect;
        window.location.href = loginUrl;
    }
}