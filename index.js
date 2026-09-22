document.addEventListener('DOMContentLoaded', () => {
    // Supabase Configuration with your provided credentials
    const SUPABASE_URL = 'https://kdqyompkfmnocpihfzdj.supabase.co';
    const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtkcXlvbXBrZm1ub2NwaWhmemRqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODkzMDkxOTIsImV4cCI6MjEwNDg4NTE5Mn0.4gmwMruyf54ZdXAADEAa9noLZD5JMFyLOzrszUIMVns';

    // Check if Supabase is loaded
    if (!window.supabase) {
        console.error("Supabase library not loaded!");
        return;
    }

    const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    const loginForm = document.getElementById('loginForm');

    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault(); // পেজ রিলোড বা ক্লিয়ার হওয়া আটকাবে
            
            const phoneInput = document.getElementById('phone');
            const passwordInput = document.getElementById('password');
            const errorMsg = document.getElementById('errorMsg');
            const loginBtn = document.getElementById('loginBtn');

            if (!phoneInput || !passwordInput) return;

            const phone = phoneInput.value.trim();
            const password = passwordInput.value.trim();

            errorMsg.style.display = 'none';
            loginBtn.textContent = 'Logging in...';
            loginBtn.disabled = true;

            try {
                // Database theke phone ebong password match koranor query
                const { data, error } = await supabase
                    .from('vendors')
                    .select('*')
                    .eq('phone', phone)
                    .eq('password', password);

                console.log("Response Data:", data);
                console.log("Response Error:", error);

                if (error || !data || data.length === 0) {
                    errorMsg.style.display = 'block';
                    loginBtn.textContent = 'Login to Dashboard';
                    loginBtn.disabled = false;
                } else {
                    // Login successful
                    const vendor = data[0];
                    localStorage.setItem('vendor_id', vendor.id);
                    localStorage.setItem('vendor_name', vendor.name);

                    // Redirect to home page
                    window.location.href = 'home.html';
                }
            } catch (err) {
                console.error("Catch Error:", err);
                errorMsg.style.display = 'block';
                loginBtn.textContent = 'Login to Dashboard';
                loginBtn.disabled = false;
            }
        });
    }
});
