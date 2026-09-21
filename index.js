// Supabase Configuration
const SUPABASE_URL = 'https://kdqyompkfmnocpihfzdj.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtkcXlvbXBrZm1ub2NwaWhmemRqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODkzMDkxOTIsImV4cCI6MjEwNDg4NTE5Mn0.4gmwMruyf54ZdXAADEAa9noLZD5JMFyLOzrszUIMVns';
const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// Toggle between Register and Login forms smoothly
function switchTab(tab) {
    if (tab === 'login') {
        document.getElementById('registerSection').classList.add('hidden');
        document.getElementById('loginSection').classList.remove('hidden');
    } else {
        document.getElementById('loginSection').classList.add('hidden');
        document.getElementById('registerSection').classList.remove('hidden');
    }
}

// 1. Registration Function
async function handleRegister() {
    const name = document.getElementById('regName').value.trim();
    const phone = document.getElementById('regPhone').value.trim();
    const password = document.getElementById('regPassword').value.trim();

    if (!name || !phone || !password) {
        alert("Doyakore shob gulo field puron korun!");
        return;
    }

    // Check if phone number already exists
    const { data: existing, error: checkError } = await supabaseClient
        .from('vendors')
        .select('*')
        .eq('phone', phone);

    if (existing && existing.length > 0) {
        alert("Ei mobile number-ti diye already ekta account ache! Doyakore login korun.");
        return;
    }

    // Insert data into 'vendors' table. Supabase will automatically generate a unique ID.
    const { error } = await supabaseClient.from('vendors').insert([
        { 
            name: name, 
            phone: phone, 
            password: password 
        }
    ]);

    if (error) {
        alert("Registration failed: " + error.message);
    } else {
        alert("Registration successful! Eibar apnar phone and password diye login korun.");
        document.getElementById('regName').value = '';
        document.getElementById('regPhone').value = '';
        document.getElementById('regPassword').value = '';
        switchTab('login');
    }
}

// 2. Login Function
async function handleLogin() {
    const phone = document.getElementById('loginPhone').value.trim();
    const password = document.getElementById('loginPassword').value.trim();

    if (!phone || !password) {
        alert("Doyakore mobile number ebong password din!");
        return;
    }

    // Query database to check if phone and password match
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
        const vendor = data[0]; // Gets the specific vendor record including their unique ID
        
        // Save vendor details in browser localStorage so home.html can use it
        localStorage.setItem('currentVendor', JSON.stringify(vendor));
        
        alert("Login successful!");
        // Redirect to vendor home/dashboard page
        window.location.href = "home.html";
    } else {
        alert("Vul mobile number ba password! Doyakore thik kore abar chesta korun.");
    }
}
