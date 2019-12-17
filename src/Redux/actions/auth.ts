import {SET_AUTH} from "./types";

export const set = (payload: any) => {
    return {
        type: SET_AUTH,
        payload
    }
};
