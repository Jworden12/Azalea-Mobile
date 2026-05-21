// Package pricing
const packages = {
    'A': { name: 'Package A - Quick Detail', price: 70 },
    'B': { name: 'Package B - Premium Detail', price: 155 },
    'C': { name: 'Package C - Premium Plus', price: 200 }
};

// Select package function
function selectPackage(packageId, price) {
    const packageSelect = document.getElementById('package');
    packageSelect.value = packageId;
    updateOrderSummary();
    // Scroll to booking form
    document.getElementById('booking').scrollIntoView({ behavior: 'smooth' });
}

// Update order summary
function updateOrderSummary() {
    const packageSelect = document.getElementById('package');
    const selectedPackageId = packageSelect.value;

    if (selectedPackageId) {
        const packageInfo = packages[selectedPackageId];
        document.getElementById('summaryPackage').textContent = packageInfo.name;
        document.getElementById('summaryPrice').textContent = '$' + packageInfo.price;
        document.getElementById('summaryTotal').textContent = '$' + packageInfo.price;
    } else {
        document.getElementById('summaryPackage').textContent = '-';
        document.getElementById('summaryPrice').textContent = '-';
        document.getElementById('summaryTotal').textContent = '$0';
    }
}

// Format phone number
function formatPhoneNumber(value) {
    const phoneNumber = value.replace(/\D/g, '');
    if (phoneNumber.length <= 3) {
        return phoneNumber;
    } else if (phoneNumber.length <= 6) {
        return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3)}`;
    } else {
        return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3, 6)}-${phoneNumber.slice(6, 10)}`;
    }
}

// Set minimum date to today
function setMinDate() {
    const dateInput = document.getElementById('date');
    const today = new Date().toISOString().split('T')[0];
    dateInput.min = today;
}

// Form submission
document.getElementById('bookingForm').addEventListener('submit', function(e) {
    e.preventDefault();

    // Get form data
    const formData = {
        package: document.getElementById('package').value,
        name: document.getElementById('name').value,
        phone: document.getElementById('phone').value,
        email: document.getElementById('email').value,
        date: document.getElementById('date').value,
        time: document.getElementById('time').value,
        location: document.getElementById('location').value,
        notes: document.getElementById('notes').value
    };

    // Validate form
    if (!formData.package || !formData.name || !formData.phone || !formData.date || !formData.time || !formData.location) {
        alert('Please fill in all required fields');
        return;
    }

    // Create booking summary
    const packageInfo = packages[formData.package];
    const bookingSummary = `
Booking Confirmation
====================
Package: ${packageInfo.name}
Price: $${packageInfo.price}

Customer Information:
Name: ${formData.name}
Phone: ${formData.phone}
Email: ${formData.email || 'Not provided'}

Service Details:
Date: ${formData.date}
Time: ${formData.time}
Location: ${formData.location}

Additional Notes: ${formData.notes || 'None'}

Total Amount: $${packageInfo.price}
    `;

    // Show confirmation
    alert('Booking Submitted!\n' + bookingSummary + '\n\nWe will contact you shortly to confirm your appointment.');

    // Log booking data (for demonstration)
    console.log('Booking Data:', formData);

    // Reset form
    this.reset();
    updateOrderSummary();
});

// Phone number input formatting
document.getElementById('phone').addEventListener('input', function(e) {
    e.target.value = formatPhoneNumber(e.target.value);
});

// Package selection change
document.getElementById('package').addEventListener('change', updateOrderSummary);

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth'
            });
        }
    });
});

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    setMinDate();
    updateOrderSummary();

    // Add scroll animation
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe service cards
    document.querySelectorAll('.service-card').forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(card);
    });
});