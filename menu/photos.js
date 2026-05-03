
    const homeScreen = document.querySelector('.photos-home-container');
    const manageScreen = document.getElementById('manage-center');
    const manageBtn = document.getElementById('open-manage');
    const homeBtn = document.getElementById('back-home');

    // Open Manage Center
    manageBtn.addEventListener('click', () => {
        homeScreen.classList.add('hidden');
        manageScreen.style.display = 'flex'; // Shows the manage center
    });

    // Go back to Home
    homeBtn.addEventListener('click', () => {
        manageScreen.style.display = 'none';
        homeScreen.classList.remove('hidden');
    });