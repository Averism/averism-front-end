import {localStorageStateInstance} from '../module/state';

document.addEventListener("DOMContentLoaded", async () => {
    let hash = window.location.hash;
    if (hash && hash.length > 0) {
        let params = hash.split("&");
        for(let param of params){
            let [key, value] = param.split("=");
            await localStorageStateInstance.set(key, value);
        }
        if(await localStorageStateInstance.get("redirect")){
            window.location.href = await localStorageStateInstance.get("redirect");
        } else {
            window.location.href = "/";
        }
    }
});