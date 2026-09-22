// Supabase Configuration (Apnar Supabase URL ebong Anon Key ekhane din)
const SUPABASE_URL = 'https://kdqyompkfmnocpihfzdj.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtkcXlvbXBrZm1ub2NwaWhmemRqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODkzMDkxOTIsImV4cCI6MjEwNDg4NTE5Mn0.4gmwMruyf54ZdXAADEAa9noLZD5JMFyLOzrszUIMVns';

const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const vendorId = localStorage.getItem('vendor_id');

// Jodi vendor login na kore thake, tahole index.html (login page) e pathiye dibe
if (!vendorId) {
    window.location.href = 'index.html';
}

// Vendor er data load kora
async function loadVendorData() {
    const { data, error } = await supabase
        .from('vendors')
        .select('*')
        .eq('id', vendorId)
        .single();

    if (data) {
        document.getElementById('displayName').textContent = data.name || 'N/A';
        document.getElementById('displayPhone').textContent = data.phone || 'N/A';
        
        // Status Toggle set kora
        const statusToggle = document.getElementById('statusToggle');
        const statusText = document.getElementById('statusText');
        
        // Database-e status 'active' ba boolean thakte pare. Ekhane boolean dhore kora holo:
        const isOpen = data.status === 'active' || data.status === true;
        statusToggle.checked = isOpen;
        statusText.textContent = isOpen ? 'Open' : 'Closed';
        statusText.style.color = isOpen ? '#28a745' : '#ff3333';

        // Time set kora
        if (data.opening_time) document.getElementById('openingTime').value = data.opening_time;
        if (data.closing_time) document.getElementById('closingTime').value = data.closing_time;
    }
}

loadVendorData();

// Status Change (Open/Closed) Handler
document.getElementById('statusToggle').addEventListener('change', async (e) => {
    const isChecked = e.target.checked;
    const statusText = document.getElementById('statusText');
    
    statusText.textContent = isChecked ? 'Open' : 'Closed';
    statusText.style.color = isChecked ? '#28a745' : '#ff3333';

    await supabase
        .from('vendors')
        .update({ status: isChecked ? 'active' : 'closed' })
        .eq('id', vendorId);
});

// Time Update Handler
document.getElementById('timeForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const opening_time = document.getElementById('openingTime').value;
    const closing_time = document.getElementById('closingTime').value;

    const { error } = await supabase
        .from('vendors')
        .update({ opening_time, closing_time })
        .eq('id', vendorId);

    if (error) {
        alert('Failed to update timing!');
    } else {
        alert('Timing updated successfully!');
    }
});

// Menu Item Upload Handler (Make sure you have a `menu_items` table in Supabase)
document.getElementById('menuForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = document.getElementById('itemName').value;
    const price = document.getElementById('itemPrice').value;
    const image_url = document.getElementById('itemImage').value;

    const { error } = await supabase
        .from('menu_items')
        .insert([{ vendor_id: vendorId, name, price, image_url }]);

    if (error) {
        alert('Error adding item! (Check if menu_items table exists)');
        console.error(error);
    } else {
        alert('Menu item added successfully!');
        document.getElementById('menuForm').reset();
    }
});

// Logout Handler
document.getElementById('logoutBtn').addEventListener('click', () => {
    localStorage.clear();
    window.location.href = 'index.html';
});
