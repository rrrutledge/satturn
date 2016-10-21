/*********************************************************************
||  Import required modules
*********************************************************************/
import {fromJS, Map, findKey} from 'immutable'
import {hashHistory} from 'react-router'

/*********************************************************************
||  Define the state tree
*********************************************************************/
export const INITIAL_STATE = fromJS({
  tree: {},
  current: {
    path: '',
    data: ''
  }
})
const API_HOST = process.env.API_HOST || window.location.origin + window.location.pathname + '/test-data/'


/*********************************************************************
||  The reducer
*********************************************************************/
export default function(state = INITIAL_STATE, action) {
  switch (action.type) {
    case "setTree" :
      return state.set('tree', action.tree)
    case "setCurrentFile" :
      return state.set('current', fromJS({'data': action.data, path: action.path}) )
    case "saveCurrent":
      return state.setIn(['current', 'data'], action.data)
    
  }
  return state;
}

/*********************************************************************
||  Actions
*********************************************************************/

export function setTree(tree) {
  return (dispatch, getState) => {
    return dispatch({type: "setTree", tree: tree})
  }
}
export function setCurrentFile(path, data) {
  return (dispatch, getState) => {
    return dispatch({type: "setCurrentFile", path: path, data: data})
  }
}

// this is currently only saving to the state tree. 
// we would make this function async to send a call to an actual api
export function saveCurrentFile(data) {
  return (dispatch, getState) => {
    return dispatch({type: "saveCurrent", data: data})
  }
}

/*********************************************************************
||  Async Actions
*********************************************************************/
export function getTree() {
  return (dispatch, getState) => {
    fetch( API_HOST + 'index', {
      method: 'GET',
    })
    .then( response => {
      if (!response.ok) {throw response}

      return response.json()
    })
    .then( json => {
      dispatch(setTree(fromJS(json)))
    })
    .catch( err => {
      console.log(err)
      err.text().then( msg => {
        console.error(msg)
      })
    })
  }
}


export function getFile(path) {  
  return (dispatch, getState) => {
    fetch(API_HOST + 'files/' + path, {
      method: 'GET'
    })
    .then( response => {
      if (!response.ok) {throw response}
      return response.text()
    })
    .then( text => {
      dispatch(setCurrentFile(path, text))
    })
    .catch( err => {
      console.log(err)
      err.text().then( msg => {
        console.error(msg)
      })
    })
  }
}
