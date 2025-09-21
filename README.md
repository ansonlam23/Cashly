# 💸 Cashly

## 🌟 Inspiration
Have you ever tried to manage your money as a student but felt completely overwhelmed? Tracking spending, setting goals, and planning investments feels complicated, and most finance apps are either dry, robotic, or demand manual entry.  

**Cashly** solves this by combining **secure, real-time bank integration through Plaid** with **LLaMA AI**, delivering personalized, humorous, and student-friendly financial advice.  

It provides a holistic view of your finances, spending, goals, and investments, all in one place. Plaid makes money management effortless, insightful, and even a little fun.

---

## What it Does
**Cashly** is a personal finance platform designed specifically for students, making money management simple, insightful, and even fun.  

- **Automatic tracking** of spending, income, and investments  
- **Smart categorization** of transactions (food, entertainment, transportation, etc.)  
- **Trends & insights** that highlight habits and savings opportunities  
- **Goal setting** (laptop, emergency fund, travel, etc.) with visual progress tracking  
- **Investment monitoring** to help students learn the basics of investing  
- **AI-powered financial advice** that’s **personalized, humorous, and practical**  

By transforming financial management from stressful and confusing into effortless and enjoyable, Cashly empowers students to make smarter financial decisions and achieve their goals.

---

## How We Built It
**Frontend:**  
- React + TypeScript  
- Tailwind CSS (styling)  
- Recharts (charts)  
- Framer Motion (animations)  
- Radix UI (accessible components)  

**Backend:**  
- Convex (real-time updates, authentication)  
- Python services (PDF parsing via PDFPlumber + AI insights with LLaMA through Ollama)  

**Integrations:**  
- Plaid (secure live bank data)  
- Alpha Vantage (real-time stock prices)  

**Data Flow:**  
Bank accounts / PDFs / manual input → transactions categorized → AI analyzes patterns → dashboards, goals, and investments update instantly  

**Key Features:**  
Real-time updates  
Scalable microservices  
Responsive design  
Secure data handling  
Student-focused usability  

---

## Challenges We Ran Into
- **PDF Processing:** Bank statements vary in format — solved with PDFPlumber in Python.  
- **Local Development:** Used **ngrok** to securely expose local services for testing AI + PDF.  
- **Bank Integration:** Securely handling **Plaid OAuth flows** and real-time updates.  
- **Data Accuracy:** Validating PDF uploads and ensuring AI categorizations were correct.  

---

## Accomplishments
- **Seamless Bank Integration:** Connected real student bank accounts securely via Plaid.  
- **Intelligent AI Insights:** LLaMA delivers actionable, funny financial advice.  
- **Reliable PDF Processing:** Robust transaction extraction from varied statement formats.  
- **Scalable Architecture:** Modular, microservices-based stack handles real-time AI + integrations.  

---

## What We Learned
- **AI Prompt Engineering:** Balancing humor and actionable advice in LLaMA prompts.  
- **PDF Variability:** Parsing diverse bank statement formats with PDFPlumber.  
- **Secure Integrations:** Handling Plaid OAuth + banking data securely.  
- **Local Dev Tools:** Leveraging ngrok for smooth AI/PDF service testing.  

---

## What’s Next for Cashly
- Smarter, **predictive AI insights**  
- **Credit score monitoring** & **bill reminders**  
- **Group budgeting features**  
- Support for **crypto & retirement planning**  
- Enhanced **mobile functionality**  
- Improved **PDF processing**  
- **Gamification** to boost engagement  
- Scaling to support more users and banking systems with modular microservices

*Cashly turns finance from overwhelming to empowering — giving students the tools, insights, and motivation to take control of their money.*  

