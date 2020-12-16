const initialProps = {
    stateModalForm: false
}

export  default function (state = initialProps, action) {
    switch (action.type) {
        case "STATE_MODAL_FORM":
            return {
                ...state,
                stateModalForm: action.payload
            }
        default:
            return state
    }
}