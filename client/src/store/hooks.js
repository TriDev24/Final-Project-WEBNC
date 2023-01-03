import { useContext } from 'react'
import Context from './Context.js'

export const useStore = ()=>{
    const [state,dispatch] = useContext(Context)

    return [state,dispatch]
}