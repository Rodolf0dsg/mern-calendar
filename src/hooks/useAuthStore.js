import { useDispatch, useSelector } from "react-redux";
import {calendarApi} from '../api'
import { clearErrorMessage, onChecking, onLogin, onLogout } from "../store/auth/authSlice";
import { onLogoutCalendar } from "../store/calendar/calendarSlice";

export const useAuthStore = () => {

    const dispatch = useDispatch();
    const { status, user, errorMessage } = useSelector( state => state.auth );

    const startLogin = async({email, password}) => {

        dispatch( onChecking() );

        try {            
            const {data} = await calendarApi.post('/auth', {email, password})
            localStorage.setItem('token', data.token);
            localStorage.setItem('token-init-date', new Date().getTime() );
            dispatch( onLogin({ name: data.name, uid: data.uid }) )
            
        } catch (error) {
            console.log(error);
            dispatch( onLogout('credenciales incorrectas') )
            setTimeout(() => {
                dispatch( clearErrorMessage() )
            }, 10);
        }
    }
    
    const startRegister = async({registerName, registerEmail, registerPassword}) => {

        console.log({registerName, registerEmail, registerPassword});
        
        dispatch( onChecking() );

        try {

            const {data} = await calendarApi.post('/auth/new', {name: registerName, email: registerEmail, password: registerPassword})
            console.log(data);
            
            localStorage.setItem('token', data.token);
            localStorage.setItem('token-init-date', new Date().getTime() );
            dispatch( onLogin({ name: data.name, uid: data.uid }) )

        } catch (error) {
            dispatch( onLogout(error.response.data?.msg || 'Error en el registro') )
            setTimeout(() => {
                dispatch( clearErrorMessage() )
            }, 10); 
        }
    }

    const checkAuthToken = async() => {
        const token = localStorage.getItem('token');
        if(!token) return dispatch( onLogout() );

        try {
            const { data } = await calendarApi.get('auth/renew');
            localStorage.setItem('token', data.token);
            localStorage.setItem('token-init-date', new Date().getTime() );
            dispatch( onLogin({ name: data.name, uid: data.uid }) );
        } catch (error) {
            localStorage.clear();
            dispatch( onLogout() );
        }

    }

    const startLogOut = () => {
        localStorage.clear();
        dispatch( onLogout() );
        dispatch( onLogoutCalendar() );
    }

    return {
        //properties
        status, user, errorMessage,

        //functions
        startLogin,
        startRegister,
        checkAuthToken,
        startLogOut,
    }
}