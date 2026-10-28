# 🚀 B2B Logistics Dashboard — ოპერაციული ლოჯისტიკისა და საწყობების მართვის სისტემა

🔗 **Live Demo:** ეშვება ლოკალურად (`http://localhost:5173`)  
📂 **კატეგორია:** ლოჯისტიკის პლატფორმა / B2B ინვენტარის მართვა  

---

## 📋 პროექტის შესახებ

**B2B Logistics Dashboard** არის React-ზე დაფუძნებული თანამედროვე ვებ-აპლიკაცია, რომელიც უზრუნველყოფს საწყობების, სატრანსპორტო ნაკადებისა და ფინანსური მონაცემების ცენტრალიზებულ და ინტერაქციულ მართვას (CRUD). აპლიკაცია შექმნილია ლოჯისტიკური კომპანიების ოპერაციული პროცესების დასაჩქარებლად, იცავს სისტემას მონაცემთა დაკარგვისგან გვერდის განახლებისას და უზრუნველყოფს უსაფრთხო, ტიპიზირებულ ფორმების ვალიდაციასა და ოფლაინ/ქეშირებულ რეჟიმში მუშაობას.

---

## ✨ ძირითადი ფუნქციონალი

- **მონაცემთა მართვა (CRUD & State):** გლობალური სთეით-მენეჯმენტი `Zustand`-ის გამოყენებით. მონაცემთა დამატება, რედაქტირება და წაშლა მყისიერად ასახავს ცვლილებებს მთელს აპლიკაციაში, ხოლო `persist` middleware ავტომატურად ასინქრონიზებს სთეითს `localStorage`-თან (`b2b-logistics-storage` გასაღებით).
- **ძიება და ფილტრაცია:** ოპტიმიზებული ცოცხალი ძიება `useDebounce` ჰუკით (სწრაფი ბეჭდვისას ზედმეტი გამოთვლების ასარიდებლად) და მემოიზებული ფილტრაცია `useMemo`-თი.
- **მოდალური ფანჯრები და ვალიდაცია:** `ReactDOM.createPortal` ტექნოლოგიით აწყობილი მოდალური ფანჯრები სწორი DOM სტრუქტურით და ფორმების მკაცრი ვალიდაცია `React Hook Form` + `Zod` (Fail-Fast პრინციპით).
- **მდგრადობა (Defensive Programming):** `React Error Boundary` კომპონენტი Runtime შეცდომებისა და „თეთრი ეკრანისგან“ დასაცავად (Retry მექანიზმით), `isSubmitting` ღილაკების ბლოკირება Double-Click-ის წინააღმდეგ და ავტომატური Offline/Demo Fallback რეჟიმი.
- **Responsive დიზაინი:** Mobile-First მიდგომა, CSS Grid/Flexbox ბადეები და ადაპტირებადი მობილური ჰამბურგერ-მენიუ 375px (მობილური), 768px (პლანშეტი) და 1440px (დესკტოპ) ეკრანებზე.

---

## 🛠️ ტექნოლოგიური სტეკი

| კატეგორია | გამოყენებული ტექნოლოგია |
| :--- | :--- |
| **Core** | React, Vite, JavaScript (ES6+) |
| **State Management** | Zustand (`persist` middleware) + LocalStorage |
| **Forms & Validation** | React Hook Form + Zod |
| **Error Handling & UI** | React Error Boundary, `ReactDOM.createPortal` Modals |
| **Performance Tools** | `useMemo`, `useCallback`, `React.memo`, `useDebounce`, WebP Media |
| **Styling & Responsive** | Custom CSS (Variables, Grid, Flexbox), Responsive Hamburger Menu |

---

## 📁 პროექტის სტრუქტურა

```text
src/
├── assets/        # ოპტიმიზებული WebP სურათები და გრაფიკული რესურსები (hero.webp)
├── components/    # ხელახლა გამოყენებადი UI კომპონენტები (StatCard, ItemForm, Modal, ErrorBoundary)
├── hooks/         # Custom ჰუკები (useModal.js, useDebounce.js)
├── store/         # გლობალური სთეით-მენეჯმენტი (useLogisticsStore.js)
├── App.jsx        # მთავარი აპლიკაციის კომპონენტი და როუტერ/ლეიაუტი
├── App.css        # გლობალური და კომპონენტური სტილები
└── main.jsx       # აპლიკაციის შესასვლელი წერტილი (Entry point)