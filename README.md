# 🛡️ PhishEyeX

**PhishEyeX** is a high-fidelity email threat analyzer designed for SOC analysts. It leverages Gemini 3 to provide deep header parsing, URL/IP intelligence, behavioral analysis, and automated incident response playbooks.

![FootprintX Hero Screenshot](https://github.com/SuperMag99/PhishEyeX/blob/main/Screenshots/1.png)
![FootprintX Hero Screenshot](https://github.com/SuperMag99/PhishEyeX/blob/main/Screenshots/2.png)

## 🚀 Features

- **Email Intake & Normalization:** Handles raw .eml, manual header pastes, and forwarded content.
- **Header Analysis:** Visual reconstruction of the Received chain and authentication (SPF/DKIM/DMARC) results.
- **Infrastructure Intel:** IP-to-ASN mapping, hosting provider detection, and geolocation anomalies.
- **Forensic URL Inspection:** Decodes obfuscated/shortened links and assesses domain reputation.
- **IOC Collection:** Aggregates all IPs, URLs, domains, and file hashes into copy-ready tables.
- **IR Playbooks:** Generates tailored remediation steps based on the identified attack type.

## ▶️ Run Locally

### 1. Prerequisites
- **Node.js**: Version 18.x or higher.
- **npm**: Version 9.x or higher.
- **Modern Browser**: Chrome, Firefox, or Edge.

### 2. Setup
```bash
# Clone the repository
git clone https://github.com/SuperMag99/phisheyex.git

# Navigate to the project directory
cd phisheyex

# Install dependencies
npm install
```

### 3. Environment Configuration (Detailed)
The application requires a Google Gemini API Key. Browsers cannot read `.env` files natively, so you must use one of the two methods below to provide your key.

**Step 1: Obtain an API Key**
1. Visit [Google AI Studio](https://aistudio.google.com/app/apikey).
2. Click **"Create API key"** and copy the string.

**Step 2: Choose your setup method**

#### Option A: Using Vite (Recommended for Developers)
Vite handles the environment variables for you and provides hot-reloading.
1. Create a file named `.env` in the root folder.
2. Add the following line: `API_KEY=your_copied_key_here`
3. Run the development server:
   ```bash
   npm run dev
   ```
4. Open the URL provided in your terminal (usually `http://localhost:5173`).

#### Option B: The "No-Build" Quick Fix (If running index.html directly)
If you prefer not to use Vite and just want to run the app as-is:
1. Open your terminal in the project folder and run: `npx serve .`
2. Open the URL provided (e.g., `http://localhost:3000`).
3. Press **F12** to open Developer Tools.
4. In the **Console** tab, paste this exactly (replace with your key):
   `window.process = { env: { API_KEY: 'YOUR_KEY_HERE' } };`
5. You can now use the "Engage Analyzer" button without refreshing.

## 🧪 Safe Usage Notice

- **Do not** analyze live malware on production systems.
- Use sanitized email samples whenever possible.
- Perform sandbox testing only in isolated environments.
- This tool does not execute attachments; it analyzes metadata and hashes.

## 📦 Repository Hygiene

- Sensitive files are excluded via `.gitignore`.
- Email samples used for testing should be sanitized of PII.
- No malware binaries are stored in this repository.

## 🧠 Intellectual Property Notice

All trademarks, platform names (e.g., VirusTotal, AbuseIPDB), and service names are the property of their respective owners. Their use is for identification and educational purposes only.

## 📄 Disclaimer

This project is provided "as is" without warranty. The authors are not responsible for misuse or damages. Intended for defensive cybersecurity purposes only.

## 📌 Project Status
🚧 **Active Development**  
Features and detection logic evolve as threat landscapes change.

## 🧭 Support

- **Issues:** Use [GitHub Issues](https://github.com/SuperMag99/phisheyex/issues).
- **Security:** Refer to [SECURITY.md](./SECURITY.md).

## ⭐ Support the Project
If this project helps your SOC team, consider giving it a ⭐.

## License Summary

This project is licensed under a **Non-Commercial Attribution License**. Key points:

1. ✅ **Free to use for personal, educational, and research purposes.**
2. ✅ **Any modification or derivative work must credit to the author.
3. ❌ **Commercial use, sale, licensing, or any use intended to generate revenue is strictly prohibited without prior written permission.**
4. ⚠️ **No warranty**: Use at your own risk.
5. ⚖️ **Legal protection**: Unauthorized commercial use or failure to credit the author may result in legal action.

For full license details, see the `LICENSE` file. [LICENSE](./LICENSE).

---

**Contact the author for commercial licensing or permissions:** 

## 👤 Maintainer
- **🔗 GitHub:** [SuperMag99](https://github.com/SuperMag99)
- **🔗 LinkedIn:** [mag99](https://www.linkedin.com/in/mag99/)
