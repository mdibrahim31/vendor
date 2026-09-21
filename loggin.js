// Supabase Configuration
const SUPABASE_URL = 'https://kdqyompkfmnocpihfzdj.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtkcXlvbXBrZm1ub2NwaWhmemRqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODkzMDkxOTIsImV4cCI6MjEwNDg4NTE5Mn0.4gmwMruyf54ZdXAADEAa9noLZD5JMFyLOzrszUIMVns';
const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// 1. Registration Function
async function handleRegister() {
    const name = document.getElementById('regName').value.trim();
    const phone = document.getElementById('regPhone').value.trim();
    const password = document.getElementById('regPassword').value.trim();

    if (!name || !phone || !password) {
        alert("Shob gulo field puron korun!");
        return;
    }

    // Prothome check korbo ei number diye age kono vendor ache kina
    const { data: existing } = await supabaseClient
        .from('vendors')
        .select('*')
        .eq('phone', phone);

    if (existing && existing.length > 0) {
        alert("Ei mobile number-ti diye already ekta account ache! Doyakore login korun.");
        return;
    }

    // Database-e data insert kora (vendors table)
    const { error } = await supabaseClient.from('vendors').insert([
        { name: name, phone: phone, password: password }
    ]);

    if (error) {
        alert("Registration failed: " + error.message);
    } else {
        alert("Registration successful! Eibar login korun.");
        // Auto switch to login tab
        document.getElementById('tab-login').checked = true;
    }
}

// 2. Login Function
async function handleLogin() {
    const phone = document.getElementById('loginPhone').value.trim();
    const password = document.getElementById('loginPassword').value.trim();

    if (!phone || !password) {
        alert("Mobile number ebong password din!");
        return;
    }

    // Database theke check kora phone & password mile kina
    const { data, error } = await supabaseClient
        .from('vendors')
        .select('*')
        .eq('phone', phone)
        .eq('password', password);

    if (error) {
        alert("Login error: " + error.message);
        return;
    }

    if (data && data.length > 0) {
        // Success! Vendor info browser-er localStorage-e save kore rakha jete pare
        localStorage.setItem('currentVendor', JSON.stringify(data[0]));
        
        alert("Login successful!");
        // Home page-e redirect kora
        window.location.href = "home.html";
    } else {
        alert("Vul mobile number ba password! Doyakore thik kore din.");
    }
}

