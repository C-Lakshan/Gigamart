import React, { useEffect } from 'react';

const DriftWidget = () => {
  useEffect(() => {
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
    
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.async = true;
    script.crossOrigin = 'anonymous';
    script.innerHTML = `
      "use strict";
      !function() {
        var t = window.driftt = window.drift = window.driftt || [];
        if (!t.init) {
          if (t.invoked) return void (window.console && console.error && console.error("Drift snippet included twice."));
          t.invoked = !0, t.methods = [ "identify", "config", "track", "reset", "debug", "show", "ping", "page", "hide", "off", "on" ], 
          t.factory = function(e) {
            return function() {
              var n = Array.prototype.slice.call(arguments);
              return n.unshift(e), t.push(n), t;
            };
          }, t.methods.forEach(function(e) {
            t[e] = t.factory(e);
          }), t.load = function(t) {
            var e = 3e5, n = Math.ceil(new Date() / e) * e, o = document.createElement("script");
            o.type = "text/javascript", o.async = !0, o.crossorigin = "anonymous", o.src = "https://js.driftt.com/include/" + n + "/" + t + ".js";
            var i = document.getElementsByTagName("script")[0];
            i.parentNode.insertBefore(o, i);
          };
        }
      }();
      drift.SNIPPET_VERSION = '0.3.1';
      drift.load('x85w8e33szsg'); // Drift ID
    `;

    // Clear session data before initializing Drift
    localStorage.removeItem("drift_conversation");
    localStorage.removeItem("driftt_sid");
    document.cookie = "driftt_aid=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    document.cookie = "driftt_sid=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";

    document.body.appendChild(script);
    script.onload = () => {
      if (window.drift) {
        // Reset the Drift session to avoid showing previous chat messages
        window.drift.reset();
      }
    };
    return () => {
      document.body.removeChild(script);
    };
  }, []);
  return null;
};

export default DriftWidget;