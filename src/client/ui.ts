import Config from "../shared/config"
import T from "../shared/locales"
import { registerMenu, showMenu, triggerServerCallback } from "@overextended/ox_lib/client"

export default class UI {
    private readonly selectedPlayers: Set<number> = new Set()
    private selectedRange: number = 10
    private stringRanges: Array<string> = []

    constructor() {
        for (const range of Config.ranges) {
            this.stringRanges.push(`${range}m`)        
        }
    }

    private async getNearbyPlayers(range: number): Promise<Array<{ id: number, name: string }>> {
        const pCoords = GetEntityCoords(PlayerPedId(), false)
        let nearbyPlayers: Array<number> = []

        for (const player of GetActivePlayers()) {
            const targetPed = GetPlayerPed(player)
            const targetCoords = GetEntityCoords(targetPed, false)
            const distance = Vdist(pCoords[0], pCoords[1], pCoords[2], targetCoords[0], targetCoords[1], targetCoords[2])
            if (distance <= range) {
                nearbyPlayers.push(GetPlayerServerId(NetworkGetPlayerIndexFromPed(targetPed)))
            }
        }

        const playerList = await triggerServerCallback("br_uanm:getPlayersNames", null, nearbyPlayers) as Array<{ id: number, name: string }>
        return playerList
    }

    public openMenu() {
        registerMenu({
            id: "range_selection",
            title: T("select_range_title"),
            position: "bottom-right",
            options: [{
                label: T("range"),
                values: this.stringRanges,
                defaultIndex: 1,
            }, {
                label: T("confirm"),
                close: true,
            }],

            onSideScroll: (selected: number, index: number | undefined) => {
                if (!index) { return }
                if (!(selected === 0)) { return }

                this.selectedRange = Config.ranges[index]
            },
        }, (selected: number) => {
            if (selected !== 2) { return }
            this.createPlayerMenu()
        })

        showMenu("range_selection")
    }

    private async createPlayerMenu() {
        const nearbyPlayers = await this.getNearbyPlayers(this.selectedRange)

        const menuOptions = nearbyPlayers.map((player) => ({
            label: player.name,
            checked: this.selectedPlayers.has(player.id),
            args: { playerId: player.id }
        }))

        menuOptions.push({
            label: T("confirm"),
            close: true,
            // @ts-ignore
            args: { confirm: true }
        })

        menuOptions.push({
            label: T("reset"),
            close: true,
            // @ts-ignore
            args: { reset: true }
        })
        
        registerMenu({
            id: "player_selection",
            title: T("select_players"),
            position: "bottom-right",
            options: menuOptions,
            onCheck: (selected, checked, args) => {
                if (checked) {
                    this.selectedPlayers.add(args.playerId)
                } else {
                    this.selectedPlayers.delete(args.playerId)
                }
            },
        }, (selected, index, args) => {
            if (args.confirm) {
                emitNet("br_uanm:updatePlayerList", Array.from(this.selectedPlayers))
            } else if (args.reset) {
                emitNet("br_uanm:resetMuted")
            }
            
        })

        showMenu("player_selection")
    }
}