import * as T from "../Components/DragLoader/types"
import { normalize } from "./utils"

type SubstractionStructure = {
  value: number,
  profile: string,
  vehicle: string | null,
}

export type SubstractionKinds = {
  width: (SubstractionStructure | null)[],
  shaft: (SubstractionStructure | null)[],
  bogie: (SubstractionStructure | null)[],
  vehicle: (SubstractionStructure | null)[],
  unit?: (SubstractionStructure | null)[],
}

interface ISubstraction {
  (data: T.IRawParsedData) : SubstractionKinds
}

const substraction = (data: string[], profiles: string[], step: number, vehicles?: string[]) => {
  let adaptedVehicles: string[] = []
  vehicles?.forEach(item => {
    for (let index = 0; index < data.length / vehicles.length; index++) {
      adaptedVehicles.push(item)
    }
  })
  return (
    data.map(
      (_, index, arr) => {
        if (index % step === 0) {
          const dataArr = arr.slice(index, index + step).map(val => normalize(val))
          const rawSubstraction = Math.max.apply(null, dataArr) - Math.min.apply(null, dataArr)
          return ({
            value: Math.abs(Math.round(rawSubstraction * 100) / 100),
            profile: profiles[index],
            vehicle: vehicles ? adaptedVehicles[index] : null
          })
        } else { return (null) }
      }
    ).filter(val => val !== null)
  )}

export const getSubstractions: ISubstraction = (data) => (
  {
    width: substraction(data.widths, data.profiles, 2),
    shaft: substraction(data.diameters, data.profiles, 2, data.vehicles),
    bogie: substraction(data.diameters, data.profiles, 4, data.vehicles),
    vehicle: substraction(data.diameters, data.profiles, 8, data.vehicles),
  }
)
