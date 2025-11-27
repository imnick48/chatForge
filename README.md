Here’s a clean, professional **README.md** for your project **chatForge**:

---

# **chatForge**

An advanced AI-powered chatbot system that seamlessly switches between **OpenRouter’s Llama 3.3 Instruct 70B** model and a **local fallback chat engine**. All conversations are **saved**, and once a chat ends, the system performs a powerful **sentiment and trend analysis** using a **custom LSTM model trained on 60,000+ samples**.
The frontend displays a **dashboard** showing:

* Overall chat sentiment
* Message-level sentiment
* Trend charts
* Conversation analysis summaries

---

## 🚀 **Features**

### 🔹 **Hybrid Chat Engine**

* **Primary**: OpenRouter with Llama 3.3 Instruct 70B
* **Fallback**: Local rule-based / offline chat mode when API unavailable

### 🔹 **Chat History Storage**

* Every message is saved
* History is used for analysis after session ends

### 🔹 **AI-Powered Analysis Dashboard**

Using a **custom LSTM sentiment classifier** trained on **60K+ real samples**, the system computes:

* Message-level sentiment
* Overall chat mood
* Conversation trend charts
* Sentiment summary visualization

### 🔹 **Modern Frontend**

* Built with React + Tailwind
* Clean dashboard UI
* Chat mode switcher (Auto / Local / OpenRouter)

---


## ⚙️ **Setup & Installation**

### **1. Backend Setup**

```bash
cd backend
python3 -m venv venv
venv\Scripts\activate      # (Linux: source venv/bin/activate)
pip install -r requirements.txt
```

### **2. Add Your API Key**

Create a `.env` file in the backend directory:

```
OPENROUTER_API_KEY=your_api_key_here
```

### **3. Run Backend Server**

```bash
python run.py
```

The backend will start on `http://127.0.0.1:5000`

---

## 🎨 **Frontend Setup**

In another terminal:

```bash
npm install
npm run dev
```

The frontend will start on `http://localhost:5173` (or as shown in terminal).

---

## 📊 **How It Works**

### **Chat Flow**

1. User sends message → Frontend
2. Mode selected:

   * **Auto** = try OpenRouter → fallback to Local
   * **Local** = use offline model
   * **AI (OpenRouter)** = force remote API
3. Backend stores all messages
4. On “End Chat”:

   * Entire conversation is fed to the **LSTM sentiment model**
   * Model returns:

     * Per-message sentiment
     * Overall conversation polarity
     * Trend sequence
5. Dashboard UI visualizes all results

---

## 🧠 **Tech Stack**

### **Backend**

* Python (Flask)
* Custom LSTM Model (TensorFlow)
* OpenRouter API

### **Frontend**

* React
* TailwindCSS
* Lucide Icons

