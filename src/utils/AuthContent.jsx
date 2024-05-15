import { createContext, useState, useEffect, useContext } from "react";

import { useNavigate } from "react-router-dom";
import { Account, ID} from 'appwrite';
import { account } from "../AppWriteConfig";

const AuthContext = createContext()

export const AuthProvider = ({children}) => {
        const navigate = useNavigate()

        const [loading, setLoading] = useState(true)
        const [user, setUser] = useState(null)

        useEffect(() => {
            //setLoading(false)
            checkUserStatus()
         }, [])

         const loginUser = async (userInfo) => {
            setLoading(true)

            console.log('userInfo',userInfo)

            try{
                let response = await account.createEmailPasswordSession(userInfo.email, userInfo.password)
                
                let accountDetails = await account.get();
                setUser(accountDetails)
            }catch(error){
                console.error(error)
            }
            setLoading(false)
            
         }

         const logoutUser = async () => {
            await account.deleteSession('current');
            navigate("/login");
            setUser(null)
         }

         const signUpUser = async (userInfo) => {
            setLoading(true);

            try {
                let response = await account.create(ID.unique(), userInfo.email, userInfo.password, userInfo.name);
                console.log("User created successfully:", response);

                let accountDetails = await account.get();
                setUser(accountDetails);
            } catch(error) {
                console.error(error);
            }

            setLoading(false);    
         }


         const checkUserStatus = async () => {
            try{
                let accountDetails = await account.get();
                setUser(accountDetails)
            }catch(error){
                
            }
            setLoading(false)
         }

        const contextData = {
            user,
            loginUser,
            logoutUser,
            signUpUser
        }

    return(
        <AuthContext.Provider value={contextData}>
            {loading ? <p>Loading...</p> : children}
        </AuthContext.Provider>
    )
}

//Custom Hook
export const useAuth = ()=> {return useContext(AuthContext)}

export default AuthContext;