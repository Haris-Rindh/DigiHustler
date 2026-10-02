const fs = require('fs');
let content = fs.readFileSync('src/context/AppContext.tsx', 'utf8');

const timeoutEffect = `
  // Inactivity Timeout Logout (30 minutes)
  useEffect(() => {
    if (!isAuthenticated) return;
    
    let timeoutId: number;
    const TIMEOUT_MS = 30 * 60 * 1000; // 30 minutes
    
    const resetTimer = () => {
      window.clearTimeout(timeoutId);
      timeoutId = window.setTimeout(() => {
        // Log out on timeout
        setIsAuthenticated(false);
        localStorage.setItem('digihust_portal_is_authenticated', JSON.stringify(false));
        alert('You have been logged out due to 30 minutes of inactivity.');
        window.location.href = '/portal/login';
      }, TIMEOUT_MS);
    };

    resetTimer();
    
    const events = ['mousemove', 'mousedown', 'keypress', 'DOMMouseScroll', 'mousewheel', 'touchmove', 'MSPointerMove', 'scroll'];
    events.forEach(e => window.addEventListener(e, resetTimer, { passive: true }));
    
    return () => {
      window.clearTimeout(timeoutId);
      events.forEach(e => window.removeEventListener(e, resetTimer));
    };
  }, [isAuthenticated]);
`;

content = content.replace(/const logout = \(\) => \{/, timeoutEffect + "\n\n  const logout = () => {");

fs.writeFileSync('src/context/AppContext.tsx', content);
