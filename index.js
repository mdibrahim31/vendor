// Supabase Configuration (Apnar Supabase project er URL and Anon Key ekhane din)
const SUPABASE_URL = 'YOUR_SUPABASE_URL_HERE';
const SUPABASE_ANON_KEY = 'YOUR_SUPABASE_ANON_KEY_HERE';

const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const phone = document.getElementById('phone').value.trim();
    const password = document.getElementById('password').value.trim();
    const errorMsg = document.getElementById('errorMsg');
    const loginBtn = document.getElementById('loginBtn');

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
