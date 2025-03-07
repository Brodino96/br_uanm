import UI from "./ui"

const ui = new UI()

class Main {
    private mutedList: Array<number> = []

    constructor() {
        onNet("br_uanm:openMenu", () => { ui.openMenu() })
        onNet("br_uanm:updateMuteStatus", (adminId: number, playerList: Array<number>) => { this.updateMuteStatus(adminId, playerList) })
        onNet("br_uanm:unmuteMaster", (adminId: number) => { this.unmuteMaster(adminId) })
    }

    private updateMuteStatus(adminId: number, playerList: Array<number>) {
        const myId = GetPlayerServerId(NetworkGetPlayerIndexFromPed(PlayerPedId()))
        if (playerList.includes(myId)) {
            this.unmuteMaster(adminId)
        } else {
            this.muteMaster(adminId)
        }
    }

    private muteMaster(id: number) {
        if (this.mutedList.includes(id)) { return }

        this.mutedList.push(id)
        exports["pma-voice"].toggleMutePlayer(id)
        console.log("mute")
    }

    private unmuteMaster(id: number) {
        if (!this.mutedList.includes(id)) { return }

        const index = this.mutedList.indexOf(id)
        this.mutedList.splice(index, 1)
        exports["pma-voice"].toggleMutePlayer(id)
        console.log("unmute")
    }
}

new Main()