import { Config } from "../shared/config"
import Ui from "./ui"

class Main {
    private mutedList: Array<number> = []
    private ui = new Ui()

    constructor() {
        onNet("br_uanm:muteMaster", (id: number) => { this.muteMaster(id) })
        onNet("br_uanm:unmuteMaster", (id: number) => { this.unmuteMaster(id) })
        onNet("br_uanm:openUi", () => { this.ui.open() })
    }

    private muteMaster(id: number) {
        if (this.mutedList.includes(id)) {
            return
        }
        this.mutedList.push(id)
        exports["pma-voice"].toggleMutePlayer(id)
    }

    private unmuteMaster(id: number) {
        if (!this.mutedList.includes(id)) {
            return
        }
        const index = this.mutedList.indexOf(id)
        this.mutedList.splice(index, 1)
        exports["pma-voice"].toggleMutePlayer(id)
    }
}

new Main()