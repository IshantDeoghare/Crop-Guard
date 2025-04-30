// src/contexts/AuthContext.js
import React, { createContext, useState, useEffect, useContext } from 'react';
import {
    onAuthStateChanged,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    signInWithPopup, // Import signInWithPopup
    getIdToken
} from "firebase/auth";
import { auth, googleProvider } from '../firebaseConfig'; // Import auth and provider
import { getMyProfile } from '../services/api'; // Import API call
import LoadingSpinner from '../components/common/LoadingSpinner';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null); // Firebase user object
    const [userProfile, setUserProfile] = useState(null); // Backend profile data (_id, name, etc.)
    const [loading, setLoading] = useState(true);
    const [token, setToken] = useState(null);

    // --- Auth Actions ---
    const signup = (email, password) => {
        return createUserWithEmailAndPassword(auth, email, password);
        // User state update is handled by onAuthStateChanged
    };

    const login = (email, password) => {
        return signInWithEmailAndPassword(auth, email, password);
        // User state update is handled by onAuthStateChanged
    };

    const googleSignIn = () => {
        return signInWithPopup(auth, googleProvider);
         // User state update is handled by onAuthStateChanged
    };

    const logout = () => {
        localStorage.removeItem('authToken'); // Clear token immediately
        setUserProfile(null); // Clear profile immediately
        setToken(null);
        return signOut(auth);
    };

    useEffect(() => {
        // Listen for Firebase auth state changes
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            setCurrentUser(user); // Store Firebase user object
            if (user) {
                try {
                    // Get fresh token
                    const idToken = await getIdToken(user, true);
                    localStorage.setItem('authToken', idToken);
                    setToken(idToken);
                    // Fetch backend profile only if token is successfully retrieved
                    try {
                       const profile = await getMyProfile(idToken); // Pass token directly
                       setUserProfile(profile);
                    } catch (profileError) {
                       console.error("Failed to fetch user profile from backend:", profileError);
                       // Decide how to handle: logout? show error? proceed without profile?
                       // For now, we proceed but userProfile remains null/stale
                       setUserProfile(null); // Ensure profile is cleared on error
                    }
                } catch (tokenError) {
                    console.error("Error getting ID token:", tokenError);
                    localStorage.removeItem('authToken');
                    setUserProfile(null);
                    setToken(null);
                    // Optional: Force logout if token fails
                    // await signOut(auth);
                }
            } else {
                // User is signed out
                localStorage.removeItem('authToken');
                setUserProfile(null);
                setToken(null);
            }
            setLoading(false);
        });

        // Cleanup subscription on unmount
        return unsubscribe;
    }, []);

    const value = {
        currentUser, // Firebase user object (contains email, uid)
        userProfile, // Backend profile object (contains _id, name etc.)
        token,       // Current ID Token
        loading,
        signup,
        login,
        logout,
        googleSignIn
    };

    // Show loading spinner while checking auth state initially
    return (
        <AuthContext.Provider value={value}>
            {loading ? <LoadingSpinner fullscreen={true} /> : children}
        </AuthContext.Provider>
    );
};

// Custom hook to use the auth context
export const useAuth = () => {
    return useContext(AuthContext);
};