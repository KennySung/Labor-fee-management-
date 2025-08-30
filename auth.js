// Firebase 設定金鑰
const firebaseConfig = {
  apiKey: "AIzaSyCMrhWYCupWav7PHkjofEE_4qkSiVryXkI",
  authDomain: "laborfee-51d5a.firebaseapp.com",
  projectId: "laborfee-51d5a",
  storageBucket: "laborfee-51d5a.firebasestorage.app",
  messagingSenderId: "876711879676",
  appId: "1:876711879676:web:60e298e0c1676618e10879",
  measurementId: "G-JFSNQHPREJ"
};

// 初始化 Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

// DOM 元素
const authSection = document.getElementById('auth-section');
const appSection = document.getElementById('app-section');
const loginForm = document.getElementById('login-form');
const registerForm = document.getElementById('register-form');
const toggleRegisterBtn = document.getElementById('toggle-register');
const toggleLoginBtn = document.getElementById('toggle-login');
const logoutBtn = document.getElementById('logout-btn');
const forgotPasswordBtn = document.getElementById('forgot-password');
const userNameSpan = document.getElementById('user-name');
const authTitle = document.getElementById('auth-title');

// 監聽會員狀態變化
auth.onAuthStateChanged(async (user) => {
    if (user) {
        // 使用者已登入
        authSection.style.display = 'none';
        appSection.style.display = 'block';

        // 從 Firestore 取得使用者額外資料
        const docRef = db.collection('users').doc(user.uid);
        const doc = await docRef.get();
        if (doc.exists) {
            const userData = doc.data();
            userNameSpan.textContent = userData.name || userData.email;
        } else {
            // 如果 Firestore 找不到資料，顯示 email
            userNameSpan.textContent = user.email;
        }
    } else {
        // 使用者已登出
        authSection.style.display = 'block';
        appSection.style.display = 'none';
    }
});

// 登入功能
loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    try {
        await auth.signInWithEmailAndPassword(email, password);
        alert('登入成功！');
    } catch (error) {
        alert('登入失敗：' + error.message);
    }
});

// 註冊功能
registerForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = document.getElementById('reg-name').value;
    const nickname = document.getElementById('reg-nickname').value;
    const phone = document.getElementById('reg-phone').value;
    const email = document.getElementById('reg-email').value;
    const password = document.getElementById('reg-password').value;

    try {
        // 使用 Firebase Auth 註冊新使用者
        const userCredential = await auth.createUserWithEmailAndPassword(email, password);
        const user = userCredential.user;

        // 將額外資料存入 Firestore
        await db.collection('users').doc(user.uid).set({
            name: name,
            nickname: nickname,
            phone: phone,
            email: email,
            createdAt: firebase.firestore.FieldValue.serverTimestamp()
        });
        
        alert('註冊成功！您已自動登入。');
    } catch (error) {
        alert('註冊失敗：' + error.message);
    }
});

// 登出功能
logoutBtn.addEventListener('click', async () => {
    try {
        await auth.signOut();
        alert('登出成功！');
    } catch (error) {
        alert('登出失敗：' + error.message);
    }
});

// 忘記密碼功能
forgotPasswordBtn.addEventListener('click', async () => {
    const email = prompt("請輸入您的電子郵件地址以重設密碼：");
    if (email) {
        try {
            await auth.sendPasswordResetEmail(email);
            alert('密碼重設郵件已發送到您的電子郵件地址，請檢查信箱。');
        } catch (error) {
            alert('發送失敗：' + error.message);
        }
    }
});

// 切換表單功能
toggleRegisterBtn.addEventListener('click', () => {
    loginForm.style.display = 'none';
    registerForm.style.display = 'block';
    authTitle.textContent = '註冊新帳號';
});

toggleLoginBtn.addEventListener('click', () => {
    loginForm.style.display = 'block';
    registerForm.style.display = 'none';
    authTitle.textContent = '請登入';
});

