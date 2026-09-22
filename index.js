// Supabase Configuration (Apnar project er URL ebong Anon Key ekhane boshaben)
const SUPABASE_URL = 'https://kdqyompkfmnocpihfzdj.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtkcXlvbXBrZm1ub2NwaWhmemRqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODkzMDkxOTIsImV4cCI6MjEwNDg4NTE5Mn0.4gmwMruyf54ZdXAADEAa9noLZD5JMFyLOzrszUIMVns';

const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const loginForm = document.getElementById('loginForm');
const errorMsg = document.getElementById('error-msg');
const loginBtn = document.getElementById('loginBtn');

loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const phone = document.getElementById('phone').value.trim();
    const password = document.getElementById('password').value.trim();

    loginBtn.textContent = 'Logging in...';
    loginBtn.disabled = true;
    errorMsg.style.display = 'none';

    // Supabase theke data match korar query
    const { data, error } = await supabase
        .from('vendors')
        .select('*')
        .eq('phone', phone)
        .eq('password', password)
        .single();

    if (error || !data) {
        // Jodi match na kore
        errorMsg.style.display = 'block';
        loginBtn.textContent = 'Login to Dashboard';
        loginBtn.disabled = false;
    } else {
        // Jodi login successful hoy
        localStorage.setItem('vendor_id', data.id);
        localStorage.setItem('vendor_name', data.name);

        // Home page-e redirect kora
        window.location.href = 'home.html';
    }
});
