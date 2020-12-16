import { View, ActivityIndicator, AsyncStorage } from 'react-native'

const makeType = mod => type => `${mod}/${type}`
const t = makeType('todos')

// makeActionCreator
const mac = (type, ...argNames) => (...args) => {
      const action = { type }
      argNames.forEach((arg, index) => {
          action[argNames[index]] = args[index]
      })
      return action
  }

// createReducer
const createReducer = (IS, handlers) => 
  (state = IS, action) => {
        if(handlers.hasOwnProperty(action.type)) {
              return handlers[action.type](state, action)
        } else {
              return state
        }
  }


const initialState = [
      { id: 1, desc: 'todo 1', completed: false},
      { id: 2, desc: 'todo 2', completed: false},
]

const COMPLETE = t('COMPLETE')
const START_SUBMIT = t('START_SUBMIT')
const SUCCESS_SUBMIT = t('SUCCESS_SUBMIT')
const ERROR_SUBMIT = t('ERROR_SUBMIT')


// // actionCreator
export const complete = mac(COMPLETE, 'payload')
const startSubmit = mac(START_SUBMIT)
const successSubmit = mac(SUCCESS_SUBMIT, 'payload')
const errorSubmit = mac(ERROR_SUBMIT, 'error') 

// reducer
export default createReducer(initialState, {
      [COMPLETE]: (state, action) => (state.map(x => x.id === action.payload ? ({...x, completed: !x.completed}) : x)),
      [SUCCESS_SUBMIT]: (state, action) => ([action.payload].concat(state))
})


export const saveTodo = (text) => async (dispatch, getState) => {
      dispatch(startSubmit())
      try {
            // throw new Error('MyError')
            const todo = {
                  desc: text,
                  completed: false,
            }
            //agrega un nuevo elemento de un total de 200
            const response = await fetch('https://jsonplaceholder.typicode.com/todos', {
                  method: 'POST',
                  body: JSON.stringify(todo)
            })
            

            // await fetch('https://jsonplaceholder.typicode.com/todos')
            //                         .then(response => response.json())
            //                         .then(json => console.log('DATA',json))

            // const _token = await AsyncStorage.getItem('token')
            // console.log('ASYNCSTORAGE.GETITEM', _token)
            
            
            AsyncStorage.getItem('token')
            .then(async token => {
                  console.log('TOKEN', token)
                  const userResp = await fetch('https://salsantiago-api.jhoncarrasco.vercel.app/api/auth/me', {
                        headers: {
                              'authorization': token,
                        }
                        })
                  const userJson = await userResp.json()
                  console.log('USUARIO', userJson)
            })
            

            const id = await response.json()
            // console.log('TODO', todo)
            // console.log('ID', id)
            dispatch(successSubmit({ 
                  ...todo, 
                  ...id }))
      } catch (e) {
            dispatch(errorSubmit(e))
      }
}