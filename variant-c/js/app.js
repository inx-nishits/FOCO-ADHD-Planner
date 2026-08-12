/**
 * FOCO App - Basic View Router
 * Handles smooth transitions between UI states for the prototype.
 */

document.addEventListener('DOMContentLoaded', () => {
  const views = document.querySelectorAll('.app-view');
  
  // Helper to switch views with animation
  window.navigateTo = function(targetViewId) {
    views.forEach(view => {
      if (view.id === targetViewId) {
        view.style.display = 'flex';
        view.classList.remove('view-exit', 'view-enter');
        // Force reflow so animation restarts smoothly
        void view.offsetWidth;
        view.classList.add('view-enter');
      } else if (view.style.display !== 'none') {
        view.classList.remove('view-enter');
        view.style.display = 'none';
      }
    });
  };

  // Initially show splash screen
  views.forEach(view => {
    if (view.id !== 'view-splash') {
      view.style.display = 'none';
    } else {
      view.classList.add('view-enter');
    }
  });

  // Auto transition from splash to onboarding after 5 seconds
  setTimeout(() => {
    navigateTo('view-onboarding-1');
  }, 5000);
});
