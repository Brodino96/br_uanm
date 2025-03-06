import { Config } from "../shared/config"

class Main {
    private readonly mutedPlayers: Record<number, Set<number>> = {} // { masterId: Set<mutedPlayerIds> }

    constructor() {
        onNet("br_uanm:mutePlayer", (targetId: number) => {
            this.mutePlayer(targetId)
        })

        onNet("br_uanm:unmutePlayer", (targetId: number) => {
            this.unmutePlayer(targetId)
        })
    }

    private mutePlayer(targetId: number) {
        const adminId = source

        if (!this.mutedPlayers[adminId]) {
            this.mutedPlayers[adminId] = new Set()
        }

        if (this.mutedPlayers[adminId].has(targetId)) {
            return // alredy muted
        }

        this.mutedPlayers[adminId].add(targetId)
        emitNet("br_uanm:muteMaster", targetId, adminId)
    }

    private unmutePlayer(targetId: number) {
        const adminId = source

        if (!this.mutedPlayers[adminId]) {
            return // theres no list
        }

        if (this.mutedPlayers[adminId].has(targetId)) {
            this.mutedPlayers[adminId].delete(targetId)
            emitNet("br_uanm:unmuteMaster", targetId, adminId)
        }
    }
}
