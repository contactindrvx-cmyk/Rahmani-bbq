// ===== Global WhatsApp Number =====
const GLOBAL_WHATSAPP_NUMBER = "923137521000";

// ===== DOM Elements =====
const header = document.getElementById('header');
const logoFull = document.getElementById('logo-full');
const logoCompact = document.getElementById('logo-compact');
const tabs = document.querySelectorAll('.tab');
const menuCards = document.querySelectorAll('.menu-card');
const whatsappFloat = document.getElementById('whatsapp-float');
const starRating = document.getElementById('star-rating');
const ratingValue = document.getElementById('rating-value');
const reviewForm = document.getElementById('review-form');
const formSuccess = document.getElementById('form-success');

// ===== Header Scroll Behavior =====
let lastScrollY = 0;

window.addEventListener('scroll', () => {
  const currentScrollY = window.scrollY;
  
  // Add scrolled class for styling
  if (currentScrollY > 50) {
    header.classList.add('scrolled');
    logoFull.classList.add('hidden');
    logoCompact.classList.remove('hidden');
  } else {
    header.classList.remove('scrolled');
    logoFull.classList.remove('hidden');
    logoCompact.classList.add('hidden');
  }
  
  lastScrollY = currentScrollY;
});

// ===== Tab Filtering =====
tabs.forEach(tab => {
  tab.addEventListener('click', () => {
    // Remove active class from all tabs
    tabs.forEach(t => t.classList.remove('active'));
    // Add active class to clicked tab
    tab.classList.add('active');
    
    const category = tab.dataset.category;
    
    // Filter menu cards
    menuCards.forEach(card => {
      if (category === 'all' || card.dataset.category === category) {
        card.classList.remove('hidden');
      } else {
        card.classList.add('hidden');
      }
    });
  });
});

// ===== Quantity Selector =====
function changeQty(button, delta) {
  const container = button.closest('.quantity-selector');
  const qtyValue = container.querySelector('.qty-value');
  let currentQty = parseInt(qtyValue.textContent);
  
  currentQty += delta;
  
  // Ensure minimum quantity of 1
  if (currentQty < 1) currentQty = 1;
  // Maximum quantity of 20
  if (currentQty > 20) currentQty = 20;
  
  qtyValue.textContent = currentQty;
}

// ===== Order Functions =====

// Order Deal (fixed price)
function orderDeal(name, price) {
  const message = encodeURIComponent(
    `Hello Rehmani BBQ, I want to order 1 x ${name}. Total: Rs. ${price.toLocaleString()}`
  );
  const url = `https://wa.me/${GLOBAL_WHATSAPP_NUMBER}?text=${message}`;
  window.open(url, '_blank');
}

// Order Karahi (with Half/Full selection)
function orderKarahi(button, name) {
  const card = button.closest('.menu-card');
  const selectedOption = card.querySelector('input[type="radio"]:checked');
  
  if (!selectedOption) {
    alert('Please select Half or Full portion');
    return;
  }
  
  const variation = selectedOption.value.charAt(0).toUpperCase() + selectedOption.value.slice(1);
  const price = parseInt(selectedOption.dataset.price);
  
  const message = encodeURIComponent(
    `Hello Rehmani BBQ, I want to order 1 x ${name} (${variation}). Total: Rs. ${price.toLocaleString()}`
  );
  const url = `https://wa.me/${GLOBAL_WHATSAPP_NUMBER}?text=${message}`;
  window.open(url, '_blank');
}

// Order BBQ/Fish (with quantity)
function orderBBQ(button, name, unitPrice) {
  const card = button.closest('.menu-card');
  const qtyValue = card.querySelector('.qty-value');
  const quantity = parseInt(qtyValue.textContent);
  const total = quantity * unitPrice;
  
  const message = encodeURIComponent(
    `Hello Rehmani BBQ, I want to order ${quantity} x ${name}. Total: Rs. ${total.toLocaleString()}`
  );
  const url = `https://wa.me/${GLOBAL_WHATSAPP_NUMBER}?text=${message}`;
  window.open(url, '_blank');
}

// ===== Floating WhatsApp Button =====
whatsappFloat.addEventListener('click', (e) => {
  e.preventDefault();
  const message = encodeURIComponent('Hello Rehmani BBQ, I would like to place an order.');
  const url = `https://wa.me/${GLOBAL_WHATSAPP_NUMBER}?text=${message}`;
  window.open(url, '_blank');
});

// ===== Star Rating =====
const ratingStars = starRating.querySelectorAll('.rating-star');

ratingStars.forEach(star => {
  star.addEventListener('click', () => {
    const value = parseInt(star.dataset.value);
    ratingValue.value = value;
    
    // Update star visuals
    ratingStars.forEach(s => {
      if (parseInt(s.dataset.value) <= value) {
        s.classList.add('active');
      } else {
        s.classList.remove('active');
      }
    });
  });
  
  // Hover effect
  star.addEventListener('mouseenter', () => {
    const value = parseInt(star.dataset.value);
    ratingStars.forEach(s => {
      if (parseInt(s.dataset.value) <= value) {
        s.style.color = '#f59e0b';
      } else {
        s.style.color = '';
      }
    });
  });
  
  star.addEventListener('mouseleave', () => {
    ratingStars.forEach(s => {
      if (!s.classList.contains('active')) {
        s.style.color = '';
      } else {
        s.style.color = '#f59e0b';
      }
    });
  });
});

// ===== Review Form Submission =====
reviewForm.addEventListener('submit', (e) => {
  e.preventDefault();
  
  // Get form values
  const name = document.getElementById('reviewer-name').value;
  const rating = ratingValue.value;
  const review = document.getElementById('review-text').value;
  const photo = document.getElementById('review-photo').files[0];
  
  // Validate rating
  if (rating === '0') {
    alert('Please select a rating');
    return;
  }
  
  // In a real app, you would send this data to a server
  console.log('Review submitted:', { name, rating, review, photo });
  
  // Show success message
  reviewForm.classList.add('hidden');
  formSuccess.classList.remove('hidden');
  
  // Reset form after 3 seconds
  setTimeout(() => {
    reviewForm.reset();
    ratingStars.forEach(s => s.classList.remove('active'));
    ratingValue.value = '0';
    formSuccess.classList.add('hidden');
    reviewForm.classList.remove('hidden');
  }, 3000);
});

// ===== File Upload Label Update =====
const photoInput = document.getElementById('review-photo');
const fileUploadLabel = document.querySelector('.file-upload-label span');

photoInput.addEventListener('change', () => {
  if (photoInput.files.length > 0) {
    fileUploadLabel.textContent = photoInput.files[0].name;
  } else {
    fileUploadLabel.textContent = 'Choose a file or drag it here';
  }
});

// ===== Initialize =====
document.addEventListener('DOMContentLoaded', () => {
  // Ensure all cards are visible initially
  menuCards.forEach(card => card.classList.remove('hidden'));
  
  // Set first tab as active
  if (tabs.length > 0) {
    tabs[0].classList.add('active');
  }
});
