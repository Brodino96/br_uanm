import { triggerServerCallback } from "@overextended/ox_lib/client"

export default class Ui {
    constructor() {
    }
    
    public async open() {
        let closePlayers: Array<number> = []
        GetActivePlayers().forEach((player: number) => {
            closePlayers.push(GetPlayerServerId(NetworkGetPlayerIndexFromPed(GetPlayerPed(player))))
        })
        const playerNames = await triggerServerCallback("br_uanm:getPlayerNames", null, closePlayers)
    }
}