export const changeName = (name) => ({
    type: 'NAME_CHANGED',
    payload: name
})

export const changeId = (id) => ({
    type: 'ID_CHANGED',
    payload: id
})

export const changeHearthBeat = (hearthBeat) => ({
    type: 'HEARTH_BEAT_CHANGED',
    payload: hearthBeat
})

export const changeMiband = (miband) => ({
    type: 'MIBAND_CHANGED',
    payload: miband
})

export const changeBluetooth = (bluetooth) => ({
    type: 'BLUETOOTH_CHANGED',
    payload: bluetooth
})

export const changeDevice = (device) => ({
    type: 'DEVICE_CHANGED',
    payload: device
})

export const changeTreinoStatus = (treino) => ({
    type: 'TREINO_CHANGED',
    payload: treino
})

export const changeLoading = (loading) => ({
    type: 'LOADING_CHANGED',
    payload: loading
})
