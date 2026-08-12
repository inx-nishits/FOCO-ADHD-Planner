// Application State
let currentView = 'splash-screen';
let currentOnboardingStep = 1;

// Initialize App
document.addEventListener('DOMContentLoaded', () => {
    console.log('FOCO App Initialized');
    
    // Simulate Splash Screen delay then move to onboarding
    setTimeout(() => {
        appNavigate('onboarding-screen');
    }, 4000);

    // Bind Onboarding events
    document.getElementById('btn-ob-next').addEventListener('click', handleOnboardingNext);
    document.getElementById('btn-ob-skip').addEventListener('click', () => {
        appNavigate('auth-screen');
        toggleAuth('create');
    });

    // Bind Onboarding dots
    for (let i = 1; i <= 3; i++) {
        document.getElementById(`dot-${i}`).addEventListener('click', () => {
            onboardingGoToStep(i);
        });
    }
});

// View Navigation
function appNavigate(viewId) {
    // Hide all views
    document.querySelectorAll('.view').forEach(view => {
        view.classList.remove('active');
    });
    
    // Show target view
    const target = document.getElementById(viewId);
    if(target) {
        target.classList.add('active');
        currentView = viewId;
    }
}

// Auth Subview Navigation
window.toggleAuth = function(authStep) {
    // Hide all auth subviews
    document.querySelectorAll('.auth-subview').forEach(subview => {
        subview.classList.remove('active');
    });
    
    // Show target subview
    const target = document.getElementById(`auth-${authStep}`);
    if(target) {
        target.classList.add('active');
    }
};

// Onboarding Logic
window.onboardingGoToStep = function(step) {
    if (step === currentOnboardingStep) return;
    
    // Hide current step
    document.getElementById(`ob-${currentOnboardingStep}`).style.display = 'none';
    document.getElementById(`dot-${currentOnboardingStep}`).classList.remove('active');
    
    currentOnboardingStep = step;
    
    // Show next step
    document.getElementById(`ob-${currentOnboardingStep}`).style.display = 'flex';
    document.getElementById(`dot-${currentOnboardingStep}`).classList.add('active');
    
    // Change button text based on step
    const btnNext = document.getElementById('btn-ob-next');
    if (currentOnboardingStep === 3) {
        btnNext.innerText = 'Get Started';
        btnNext.style.width = 'auto';
        btnNext.style.padding = '0 24px';
        btnNext.style.borderRadius = '28px';
    } else {
        btnNext.innerHTML = '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg>';
        btnNext.style.width = '56px';
        btnNext.style.padding = '0';
        btnNext.style.borderRadius = '50%';
    }
};

function handleOnboardingNext() {
    if (currentOnboardingStep < 3) {
        onboardingGoToStep(currentOnboardingStep + 1);
    } else {
        // Finished onboarding
        appNavigate('auth-screen');
        toggleAuth('create');
    }
}
