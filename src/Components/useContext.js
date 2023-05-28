import React, { useEffect, useState } from "react"
export const userContext = React.createContext()


export  const UserContextprovider = ({ children }) => {
  
       

    return <userContext.Provider value={"aggag"}>
        {children}
    </userContext.Provider>
}



