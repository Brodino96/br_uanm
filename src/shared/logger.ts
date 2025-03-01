import { Config } from "./config"

export class Logger {
    public async error(txt: string, bypass?: boolean) {
        if (Config.debugMode || bypass) {
            console.log(`[ERROR] ${txt}`)
        }
    }
    public async success(txt: string, bypass?: boolean) {
        if (Config.debugMode || bypass) {
            console.log(`[SUCCESS] ${txt}`)
        }
    }
    public async info(txt: string, bypass?: boolean) {
        if (Config.debugMode || bypass) {
            console.log(`[INFO] ${txt}`)
        }
    }
}