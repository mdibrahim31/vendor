// Supabase Configuration
const SUPABASE_URL = 'https://kdqyompkfmnocpihfzdj.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtkcXlvbXBrZm1ub2NwaWhmemRqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODkzMDkxOTIsImV4cCI6MjEwNDg4NTE5Mn0.4gmwMruyf54ZdXAADEAa9noLZD5JMFyLOzrszUIMVns';
const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// Login Function
async function handleLogin() {
    const phone = document.getElementById('loginPhone').value.trim();
    const password = document.getElementById('loginPassword').value.trim();

    if (!phone || !password) {
        alert("Doyakore mobile number ebong password din!");
        return;
    }

    try {
        // Database theke check korbe phone ebong password mile kina
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
            const vendor = data[0]; // Ei vendor-er data pawa gelo
            
            // Browser localStorage-e vendor data save kore rakha holo
            localStorage.setItem('currentVendor', JSON.stringify(vendor));
            
            alert("Login successful!");
            // Barabar home.html page-e chole jabe
            window.location.href = "home.html";
        } else {
            alert("Vul mobile number ba password! Athoba Supabase database-e data thik ache kina check korun.");
        }
    } catch (err) {
        console.error("Unexpected error:", err);
        alert("Kono ekta somossa hoyeche, console check korun.");
    }
}
