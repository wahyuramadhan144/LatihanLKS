# Project Latihan LKS

Ini adalah project latihan dengan struktur **Backend** dan **Frontend**.  
Berikut panduan untuk menyiapkan project agar bisa dijalankan.

---

##  Dependensi yang harus diinstall

Pastikan kamu sudah menginstall beberapa tools berikut:

1. **Node.js & NPM**
   - Install Node.js dari [https://nodejs.org/](https://nodejs.org/)  
   - Setelah install, cek versi:
     ```bash
     node -v
     npm -v
     ```
   - Install semua dependensi project:
     ```bash
     npm install
     ```

2. **Ngrok**
   - Digunakan untuk membuat tunnel ke localhost.  
   - Install dengan perintah:
     ```bash
     npm install -g ngrok
     ```
   - Cek versi:
     ```bash
     ngrok --version
     ```

3. **Expo Go (untuk frontend mobile)**
   - Install Expo CLI:
     ```bash
     npm install -g expo-cli
     ```
   - Install aplikasi **Expo Go** di smartphone dari Play Store / App Store.

4. **Database**
   - Siapkan database yang akan digunakan (misal MySQL, PostgreSQL, atau MongoDB sesuai kebutuhan project).  
   - Pastikan konfigurasi koneksi database sudah sesuai di file backend (misal `.env` atau `config.js`).

---

##  Cara menjalankan project

### 1. Jalankan Backend
Masuk ke folder backend dan jalankan:

```bash
cd Backend
node app.js

## 2. Jalankan Frontend
Masuk ke folder Frontend dan jalankan:

```bash
cd frontend
npx expo start --tunnel
