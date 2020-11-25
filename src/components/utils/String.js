export const convertToS3EP = (path) =>{
    if(path)
        return path.substring(0, 27)+path.substring(42, path.length)
    else
        return null
}

export const convertToLocal = (path) => {
    if(path)
    {
        return "http://localhost:8000" + path
    }
    else
        return null
}