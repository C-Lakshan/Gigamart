import { jwtDecode } from "jwt-decode";

export const isTokenValid = ()=>{
    const token = localStorage.getItem('authToken');
    if (!token) return false;

    try {
        const decoded = jwtDecode(token);
        const currentTime = Date.now() / 1000; // Current time in seconds

        // Check if the token is expired
        return decoded.exp > currentTime;
    } catch (error) {
        console.error("Invalid token", error);
        return false;
    }
}

export const saveToken = (token) =>{
    localStorage.setItem('authToken',token);
}

export const logOut = ()=>{
    localStorage.removeItem('authToken');
    // window.location.reload();

    const clearAllCookies = () => {
        const cookies = document.cookie.split(";"); // Get all cookies
        cookies.forEach((cookie) => {
          const eqPos = cookie.indexOf("=");
          const name = eqPos > -1 ? cookie.substr(0, eqPos).trim() : cookie.trim();
          document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;`;
        });
      };
      
      const clearDriftData = () => {
        // Clear only Drift-related local storage items
        Object.keys(localStorage).forEach((key) => {
          if (key.includes("drift") || key.includes("driftt")) {
            localStorage.removeItem(key);
          }
        });
      
        // Clear only Drift-related session storage items
        Object.keys(sessionStorage).forEach((key) => {
          if (key.includes("drift") || key.includes("driftt")) {
            sessionStorage.removeItem(key);
          }
        });
      
        // Clear Drift-related cookies
        clearAllCookies();
      };
      
      // Clear Drift-related cache and initialize Drift script
      clearDriftData();
}

export const getToken = ()=>{
    return localStorage.getItem('authToken');
}