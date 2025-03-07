import Config from "../shared/config"
import { Server as ESXServer } from "esx.js"
import { onClientCallback } from "@overextended/ox_lib/server"

class Main {
    private readonly adminListeners: Map<number, Array<number>> = new Map()
    private ESX: ESXServer

    constructor() {
        this.ESX = exports["es_extended"].getSharedObject()
        
        onNet("br_uanm:updatePlayerList", (allowedPlayers: Array<number>) => {
            this.updateList(allowedPlayers, source)
        })

        onNet("br_uanm:resetMuted", () => {
            emitNet("br_uanm:unmuteMaster", -1, source)
        })
        
        onClientCallback("br_uanm:getPlayersNames", (_playerId: number, playerList: Array<number>) => {
            return this.getPlayersNames(playerList)
        })
        
        on("playerDropped", () => {
            if (!this.adminListeners.has(source)) { return }
            emitNet("br_uanm:unmuteMaster", -1, source)
        })
        
        RegisterCommand("uanm", (source: number) => {
            if (!this.isAllowed(source)) { return }
            emitNet("br_uanm:openMenu", source)
        }, false)
    }

    private isAllowed(id: number): boolean {
        if (Config.permission.type == "ace") {
            return IsPlayerAceAllowed(id.toString(), Config.permission.value)
        } else if (Config.permission.type == "esx") {
            return this.ESX.GetPlayerFromId(id).getGroup() === Config.permission.value
        }
        return true
    }

    private updateList(allowedPlayers: Array<number>, adminId: number) {
        this.adminListeners.set(adminId, allowedPlayers)
        emitNet("br_uanm:updateMuteStatus", -1, adminId, this.adminListeners.get(adminId))
    }

    private getPlayersNames(playerList: Array<number>): Array<{ id: number, name: string}> {
        let arrayToReturn = []

        for (const player of playerList) {
            arrayToReturn.push({ id: player, name: this.ESX.GetPlayerFromId(player).getName() })
        }

        return arrayToReturn
    }
}

new Main()