import { useState, useEffect } from "react"


export default function usePromise(promiseCreator, deps){
    const [Resolved, setResolved] = useState(null)
    const [Loading, setLoading] = useState(false)
    const [Error, setError] = useState(null)

    const process = async () => {
        setLoading(true);
        try{
            const result = await promiseCreator()
            setResolved(result)
        }catch(e){
            setError(e)
        }
        setLoading(false);
    }

    useEffect(()=>{
        process()
    }, deps)

    return [Loading, Resolved, Error]
}