import Config from "../shared/config"

//@ts-ignore
const jsonData = LoadResourceFile(GetCurrentResourceName(), `/locales/${Config.locale}.json`)
const Locale = JSON.parse(jsonData)

export default function T(index: string): string {
    return Locale[index]
}