const defaultState = {
    imageFileName: null,
    imageID: null,
    viewer: null, // Хранит объект OpenSeaDragon
    segments: [] // Хранит массив аннотаций
}

const imageReducer = (state=defaultState, action) => {
    switch (action.type) {
        case 'UPDATE_IMAGE_FILENAME':
            return {...state, imageFileName: action.payload}
        case 'UPDATE_IMAGE_ID':
            return {...state, imageID: action.payload}
        case 'SET_VIEWER':
            return {...state, viewer: action.payload}
        case 'UPDATE_SEGMENTS':
            return {...state, segments: action.payload}
        case 'SET_ANNOTATIONS':
            return {...state, annotations: action.payload}
        default:
            return state
    }
}

export default imageReducer