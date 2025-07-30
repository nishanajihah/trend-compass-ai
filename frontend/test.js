/**
 * Simple Test Script for Browser Console
 * Copy and paste this in your browser console (F12) to test if everything works
 */

console.log('🧪 TREND COMPASS - Quick Test');
console.log('===============================');

// Test 1: Check if page loaded correctly
console.log('📄 Page Test:');
if (document.getElementById('trendForm')) {
    console.log('✅ Trend form found');
} else {
    console.log('❌ Trend form missing');
}

if (document.getElementById('audienceForm')) {
    console.log('✅ Audience form found');
} else {
    console.log('❌ Audience form missing');
}

// Test 2: Check backend connection
console.log('\n🌐 Backend Test:');
fetch('http://localhost:8000/api/status')
    .then(response => {
        if (response.ok) {
            console.log('✅ Backend server is running');
            return response.json();
        } else {
            console.log('❌ Backend server error:', response.status);
        }
    })
    .then(data => {
        if (data) {
            console.log('✅ API status:', data.status);
        }
    })
    .catch(error => {
        console.log('❌ Cannot connect to backend - make sure server is running');
        console.log('💡 Run: cd backend && python -m uvicorn main:app --reload');
    });

// Test 3: Quick form submission test
console.log('\n📝 Form Test:');
console.log('💡 Fill out a form and press submit to test');
console.log('💡 You should see loading spinner → results appear → export buttons');

console.log('\n🎯 Everything working? Your submit buttons should work now!');
