import type { ConfigType } from "../types"

//@ts-ignore
const jsonData = LoadResourceFile(GetCurrentResourceName(), "../config.json")
const Config: ConfigType = JSON.parse(jsonData)
export default Config