// src/utils/navigationUtils.js

/**
 * Navigates to a target path and passes a 'scrollToId' in the location state.
 * If already on the target path, it attempts to scroll to the element directly.
 * @param {string} targetPath - The path to navigate to (e.g., '/').
 * @param {string} targetId - The ID of the element to scroll to.
 * @param {function} navigate - The navigate function from useNavigate().
 * @param {object} location - The location object from useLocation().
 */
export const navigateAndScrollWithState = (targetPath, targetId, navigate, location) => {
    const scrollToElement = (id) => {
      // Use a timeout to ensure the element is rendered, especially after navigation.
      setTimeout(() => {
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        } else {
          console.warn(`[navigationUtils] Element with ID "${id}" not found for scrolling.`);
        }
      }, 100); // Adjust timeout if needed; 0 might work sometimes.
    };
  
    if (location.pathname === targetPath) {
      // Already on the target page, just scroll
      scrollToElement(targetId);
    } else {
      // Navigate to the target page, passing the ID of the element to scroll to in state
      navigate(targetPath, { state: { scrollToId: targetId } });
    }
  };