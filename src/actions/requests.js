import {http} from "../libs/http";

export const getSuggestionsRequest = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            const result_data = await http.post("/suggestion", data)
            resolve(result_data.data)
        } catch(e) {
            reject(`Error request data: ${e.getMessage} `)
        }
    })
}