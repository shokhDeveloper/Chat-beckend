import os from "os";
export let IP = '';
 
try{
    const networkInterface = os.networkInterfaces();
    if(networkInterface["Беспроводная сеть 3"]){
        IP += networkInterface["Беспроводная сеть 3"].find((network) => network.family == "IPv4").address
    }
}catch(error){
    console.log(error)
}