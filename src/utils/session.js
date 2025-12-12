// Session management utility
// Generates and stores a unique sessionId for cart persistence

export const getSessionId = () => {
  let sessionId = localStorage.getItem('cava_session_id');
  
  if (!sessionId) {
    // Generate a unique session ID
    sessionId = `session_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
    localStorage.setItem('cava_session_id', sessionId);
  }
  
  return sessionId;
};

export const clearSessionId = () => {
  localStorage.removeItem('cava_session_id');
};
