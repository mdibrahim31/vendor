// Supabase Configuration (login.js এর মতো একই URL ও Key বসাবেন)
const SUPABASE_URL = 'https://kdqyompkfmnocpihfzdj.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtkcXlvbXBrZm1ub2NwaWhmemRqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODkzMDkxOTIsImV4cCI6MjEwNDg4NTE5Mn0.4gmwMruyf54ZdXAADEAa9noLZD5JMFyLOzrszUIMVns';

const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const vendorId = localStorage.getItem('vendor_id');

// Jodi vendor login na kore direct home.html-e ashe, tahole login page-e pathiye dibe
if (!vendorId) {
    window.location.href = 'index.html';
}

// Page load hole vendor er data fetch kora
async function loadVendorData() {
    const { data, error } = await supabase
        .from('vendors')
        .select('*')
        .eq('id', vendorId)
        .single();

    if (data) {
        document.getElementById('displayName').textContent = data.name;
        document.getElementById('displayPhone').textContent = data.phone;
        
        // Status toggle set kora
        const statusToggle = document.getElementById('statusToggle');
        statusToggle.checked = data.status;
        document.getElementById('statusText').textContent = data.status ? 'Open' : 'Closed';

        // Time set kora
        if (data.opening_time) document.getElementById('openingTime').value = data.opening_time;
        if (data.closing_time) document.getElementById('closingTime').value = data.closing_time;
    }
}

loadVendorData();

// Status Change (Open/Close) handler
document.getElementById('statusToggle').addEventListener('change', async (e) => {
    const newStatus = e.target.checked;
    document.getElementById('statusText').textContent = newStatus ? 'Open' : 'Closed';

    await supabase
        .from('vendors')
        .update({ status: newStatus })
        .eq('id', vendorId);
});

// Time Update handler
document.getElementById('timeForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const opening_time = document.getElementById('openingTime').value;
    const closing_time = document.getElementById('closingTime').value;

    const { error } = await supabase
        .from('vendors')
        .update({ opening_time, closing_time })
        .eq('id', vendorId);

    if (error) {
        alert('Failed to update time!');
    } else {
        alert('Time updated successfully!');
    }
});

// Menu Item Upload handler (Note: इसके jonno database-e menu table thakte hobe)
document.getElementById('menuForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = document.getElementById('itemName').value;
    const price = document.getElementById('itemPrice').value;
    const image_url = document.getElementById('itemImage').value;

    // Udahoron sorup amra menu_items table use korte pari (jodi na thake table create kore niben)
    const { error } = await supabase
        .from('menu_items')
        .insert([{ vendor_id: vendorId, name, price, image_url }]);

    if (error) {
        alert('Error adding item! (Make sure menu_items table exists in supabase)');
    } else {
        alert('Item added successfully!');
        document.getElementById('menuForm').reset();
    }
});

// Logout handler
document.getElementById('logoutBtn').addEventListener('click', () => {
    localStorage.clear();
    window.location.href = 'index.html';
});

