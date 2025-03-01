import type { ConfigType } from "../types"

//@ts-ignore
const jsonData = LoadResourceFile(GetCurrentResourceName(), "../config.json")
export const Config: ConfigType = JSON.parse(jsonData)