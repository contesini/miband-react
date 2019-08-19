import { combineReducers } from 'redux'

const INITIAL_STATE = {
    id: undefined,
    name: undefined,
    hearthBeat: 0,
    bluetooth: null,
    device: null,
    miband: null,
    isTreinoStarted: false,
}

export const userReducer = (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case 'ID_CHANGED':
            return { ...state, id: action.payload }
        case 'NAME_CHANGED':
            return { ...state, name: action.payload }
        case 'HEARTH_BEAT_CHANGED':
            return { ...state, hearthBeat: action.payload }
        case 'MIBAND_CHANGED':
            return { ...state, miband: action.payload }
        case 'BLUETOOTH_CHANGED':
            return { ...state, bluetooth: action.payload }
        case 'DEVICE_CHANGED':
            return { ...state, device: action.payload }
        case 'TREINO_CHANGED':
            return { ...state, isTreinoStarted: action.payload }
        default:
            return { ...state }
    }
}

const rootReducer = combineReducers({
    user: userReducer
})

export default rootReducer