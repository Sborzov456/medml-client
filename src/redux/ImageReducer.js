const defaultState = {
    image: '',
    image_id: null,
    viewer: null,
    segments: []
}

const imageReducer = (state=defaultState, action) => {
    switch (action.type) {
        case 'UPDATE_IMAGE':
            return {...state, image: action.payload}
        case 'UPDATE_IMAGE_ID':
            return {...state, image_id: action.payload}
        case 'SET_VIEWER':
            return {...state, viewer: action.payload}
        case 'UPDATE_SEGMENTS':
            return {...state, segments: action.payload}
        default:
            return state
    }
}

export default imageReducer