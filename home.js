const SUPABASE_URL = 'https://kdqyompkfmnocpihfzdj.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtkcXlvbXBrZm1ub2NwaWhmemRqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODkzMDkxOTIsImV4cCI6MjEwNDg4NTE5Mn0.4gmwMruyf54ZdXAADEAa9noLZD5JMFyLOzrszUIMVns';
const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// Check if vendor is logged in
const currentVendor = JSON.parse(localStorage.getItem('currentVendor'));
if (!currentVendor) {
    window.location.href = "index.html";
}

// Load Vendor Data on Page Load
window.addEventListener('DOMContentLoaded', () => {
    loadVendorData();
    loadVendorMenu();
});

async function loadVendorData() {
    try {
        const { data, error } = await supabaseClient
            .from('vendors')
            .select('*')
            .eq('id', currentVendor.id)
            .single();

        if (error) {
            console.error("Error loading vendor:", error.message);
            return;
        }

        if (data) {
            document.getElementById('shopName').value = data.name || '';
            document.getElementById('shopPhone').value = data.phone || '';
            document.getElementById('shopAddress').value = data.address || '';
            document.getElementById('shopTypes').value = data.types || '';
            document.getElementById('shopDiscount').value = data.discount || 0;
            document.getElementById('shopImage').value = data.profile_image_url || '';
            document.getElementById('shopLat').value = data.lat || '';
            document.getElementById('shopLong').value = data.long || '';

            // Toggles
            document.getElementById('shopStatusToggle').checked = data.status === 'active' || data.status === true;
            document.getElementById('shopBoostToggle').checked = data.boost || false;
        }
    } catch (err) {
        console.error("Unexpected error:", err);
    }
}

// Update Vendor Info
async function updateVendorInfo() {
    const name = document.getElementById('shopName').value.trim();
    const address = document.getElementById('shopAddress').value.trim();
    const types = document.getElementById('shopTypes').value.trim();
    const discount = parseFloat(document.getElementById('shopDiscount').value) || 0;
    const profile_image_url = document.getElementById('shopImage').value.trim();
    const lat = parseFloat(document.getElementById('shopLat').value) || null;
    const long = parseFloat(document.getElementById('shopLong').value) || null;
    const status = document.getElementById('shopStatusToggle').checked ? 'active' : 'inactive';
    const boost = document.getElementById('shopBoostToggle').checked;

    try {
        const { error } = await supabaseClient
            .from('vendors')
            .update({
                name,
                address,
                types,
                discount,
                profile_image_url,
                lat,
                long,
                status,
                boost
            })
            .eq('id', currentVendor.id);

        if (error) {
            alert("Update failed: " + error.message);
        } else {
            alert("Shop info updated successfully!");
            // Update localstorage name if changed
            currentVendor.name = name;
            localStorage.setItem('currentVendor', JSON.stringify(currentVendor));
        }
    } catch (err) {
        console.error("Error updating:", err);
    }
}

// Add Food Item to Menu (Assuming a 'menus' or 'food_items' table exists, or you can adjust table name)
async function addFoodItem() {
    alert("Menu upload feature ready! Please ensure you have a 'menu' table in Supabase to save food items.");
}

async function loadVendorMenu() {
    // Placeholder for loading menu items
    document.getElementById('menuListContainer').innerHTML = `<p class="text-gray-500 text-sm">No food items added yet.</p>`;
}

// Logout Function
function handleLogout() {
    localStorage.removeItem('currentVendor');
    window.location.href = "index.html";
}
