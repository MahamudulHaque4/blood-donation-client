import React, { useEffect, useState } from 'react'
import { AuthContext } from './AuthContext';
import { 
    createUserWithEmailAndPassword, 
    onAuthStateChanged,
    signInWithEmailAndPassword,
    signInWithPopup,
    signOut,
    updateProfile,
    GoogleAuthProvider

} from "firebase/auth";
import { auth } from '../firebase/firebase.config';

const googleProvider = new GoogleAuthProvider();


const AuthProvider = ({children}) => {
    const [user,setUser] = useState(null);
    const [loading,setLoading] = useState(true);

    const createUser = (email,password) => {
        setLoading (true);
        return createUserWithEmailAndPassword(auth, email, password);
    }

    const signInUser = (email, password) => {
        setLoading(true);
        return signInWithEmailAndPassword(auth, email, password);
    }

    const logOut = async () => {
        setLoading(true);
        return signOut(auth);
    }

    const updateUserProfile = (name, photo) => {
        return updateProfile(auth.currentUser, {
            displayName: name,
            photoURL: photo
        });
    }

    const signInGoogle = () => {
        setLoading (true);
        return signInWithPopup(auth, googleProvider)
    }
    // On Auth satate change
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, currentUser => {
            setUser(currentUser);
            setLoading(false);
        })
        return () => {
            return unsubscribe ()
        }
    }, [])

    const authInfo = {
        user,
        loading,
        setUser,
        setLoading,
        createUser,
        signInUser,
        logOut,
        updateUserProfile,
        signInGoogle
    }

  return (
    <AuthContext.Provider value={authInfo}>
        {children}
    </AuthContext.Provider>
  )
}

export default AuthProvider
