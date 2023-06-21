import {
  INVALID_TOKEN,
  LOGIN_ERROR_HANDLER,
  LOGIN_FAILED,
  LOGIN_SUCCESS,
  LOGOUT,
  SIGNUP_ERROR_HANDLER,
  SIGNUP_FAILED,
  SIGNUP_SUCCESS,
  USER_LOADED_FAILED,
  USER_LOADED_SUCCESS,
  UPDATE_OPEN,
  SET_LOADING,
  LOGIN_ERROR_RESET,
  SIGNUP_ERROR_RESET,
} from "../actions/Types";
import { AuthState } from "../types";
import { AnyAction } from "redux";

const initialState: AuthState = {
  access: localStorage.getItem("access"),
  authenticated: false,
  user: null,
  loginerror: null,
  signuperror: null,
  signupmessage: null,
  isopen: false,
  loading: true
};

export default function(state = initialState, action: AnyAction) {
  const { type, payload } = action;

  switch (type) {
    case LOGIN_SUCCESS:
      localStorage.setItem("access", payload.access);
      return {
        ...state,
        access: payload.access,

        authenticated: true,
      };

    case USER_LOADED_SUCCESS:
      return {
        ...state,
        authenticated: true,
        user: payload.newuser,
      };

    case USER_LOADED_FAILED:
      localStorage.removeItem("access");
      return {
        ...state,
        user: null,
      };
    case INVALID_TOKEN:
      return {
        ...state,
        access: null,
      };

    case LOGIN_FAILED:
    case LOGIN_ERROR_HANDLER:
      return {
        ...state,
        loginerror: payload.message,
      };

    case SIGNUP_FAILED:
    case SIGNUP_ERROR_HANDLER:
      return {
        ...state,
        signuperror: payload.message,
      };

    case SIGNUP_SUCCESS:
      return {
        ...state,
        signuperror: payload.message,
      };
    case LOGOUT:
      localStorage.removeItem("access");
      return {
        ...state,
        authenticated: false,
        access: null,
        user: null
      };

    case UPDATE_OPEN:
      return {
        ...state,
        isopen: !state.isopen,
      };
    case SET_LOADING: 
      return {
        ...state, 
        loading: payload.loading
      }
    
    case LOGIN_ERROR_RESET: 
      return {
        ...state, 
        loginerror: null, 
      }
    case SIGNUP_ERROR_RESET: 
      return {
        ...state, 
        signuperror: null
      }
    default:
      return state;
  }
}
