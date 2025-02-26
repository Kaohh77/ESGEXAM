// 初始化EmailJS
(function() {
    emailjs.init("YOUR_USER_ID"); // 替換為你的User ID
})();

// 模擬CSV資料庫（使用localStorage）
let users = JSON.parse(localStorage.getItem('users')) || [];

// 登入表單處理
document.getElementById('loginForm')?.addEventListener('submit', function(e) {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    const user = users.find(u => u.email === email && u.password === password && u.verified);
    if (user) {
        localStorage.setItem('loggedInUser', email);
        window.location.href = 'ser1.html';
    } else {
        alert('帳號或密碼錯誤，或尚未驗證！');
    }
});

// 註冊表單處理
document.getElementById('registerForm')?.addEventListener('submit', function(e) {
    e.preventDefault();
    const email = document.getElementById('regEmail').value;
    const password = document.getElementById('regPassword').value;

    if (users.some(u => u.email === email)) {
        alert('此Gmail帳號已註冊！');
        return;
    }

    const user = {
        id: users.length + 1,
        email: email,
        password: password,
        registerTime: new Date().toISOString(),
        note: '等待驗證',
        verified: false
    };

    // 生成驗證連結（模擬，實際部署需後端處理）
    const verifyToken = btoa(email); // 簡單Base64編碼作為token
    const verifyLink = `${window.location.origin}/verify?token=${verifyToken}`;

    // 使用EmailJS發送驗證郵件
    const templateParams = {
        name: email.split('@')[0], // 使用郵件前綴作為名稱
        email: email,
        verify_link: verifyLink
    };

    emailjs.send('YOUR_SERVICE_ID', 'YOUR_TEMPLATE_ID', templateParams)
        .then(() => {
            users.push(user);
            localStorage.setItem('users', JSON.stringify(users));
            document.getElementById('message').textContent = '註冊成功！請檢查您的Gmail信箱進行驗證。';
        }, (error) => {
            document.getElementById('message').textContent = '郵件發送失敗，請稍後再試。';
            console.error('EmailJS Error:', error);
        });
});

// 驗證處理（假設用戶點擊驗證連結）
function verifyUser() {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    if (token) {
        const email = atob(token); // 解碼token獲得email
        const user = users.find(u => u.email === email);
        if (user && !user.verified) {
            user.verified = true;
            user.note = '已驗證';
            localStorage.setItem('users', JSON.stringify(users));
            alert('帳號已驗證，請登入！');
            window.location.href = 'index.html';
        }
    }
}

// 自動檢查驗證URL
if (window.location.pathname === '/' && window.location.search.includes('token')) {
    verifyUser();
}

// 登出功能
function logout() {
    localStorage.removeItem('loggedInUser');
    window.location.href = 'index.html';
}

// 檢查是否已登入
if (window.location.pathname.endsWith('ser1.html')) {
    if (!localStorage.getItem('loggedInUser')) {
        window.location.href = 'index.html';
    }
}

// 模擬CSV匯出
function exportToCSV() {
    const csv = users.map(u => `${u.id},${u.email},${u.password},${u.registerTime},${u.note}`).join('\n');
    console.log('CSV內容：\n編號,email,Password,註冊時間,備註\n' + csv);
    const blob = new Blob([csv], { type: 'text/csv' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'users.csv';
    link.click();
}