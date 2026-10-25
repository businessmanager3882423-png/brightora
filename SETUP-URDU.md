# Brightora Technologies — Firebase aur website setup (Roman Urdu)

Firebase Project ID: `brightora-a1154`

## A. Firebase project ki tasdeeq
1. https://console.firebase.google.com/ kholein aur `brightora-a1154` select karein.
2. Project settings (gear icon) → General → Your apps mein Web App config check karein. `js/firebase.js` pehle hi aapke diye hue config ke mutabiq update hai.
3. Service-account JSON ya private keys website files, GitHub ya chat mein kabhi upload na karein.

## B. Authentication
1. Build → Authentication → Get started (agar pehle se setup hai to dobara na karein).
2. Sign-in method mein Email/Password enable karke Save karein.
3. Google login chahiye to Google provider enable karke support email select/save karein.
4. Authentication → Users mein apna account kholein aur UID copy karein. UID ko notes mein rakhein.
5. Settings → Authorized domains mein deployment ke baad apna exact `*.vercel.app` domain add karein. Local testing ke liye localhost ko bhi check karein.

## C. Firestore owner access — rules publish karne se pehle
1. Build → Firestore Database → Data kholein.
2. Agar database bana hua hai to dobara create na karein. Nahi bana to Create database par click karein aur location soch samajh kar choose karein; location baad mein change karna mushkil hota hai.
3. Start collection: `settings`
4. Document ID: `ownerAccess`
5. Fields banayein:
   - `ownerUids` — type **array** — apne Authentication UID ko array item ke taur par add karein.
   - `staffUids` — type **array** — filhaal empty array `[]`.
   - `staffRoles` — type **map** — filhaal empty map `{}`.
6. Save karein. UID bilkul sahi hona chahiye. Customer UID ko ownerUids mein na daalein.

## D. Firestore Rules publish karein
1. Repository ke root mein `firestore.rules` file kholein.
2. Poora code copy karein.
3. Firebase Console → Firestore Database → Rules mein paste karein.
4. Publish karein.
5. Agar website par `Missing or insufficient permissions` aaye to public read/write rules lagane ke bajaye UID, document path aur rule match check karein.

## E. Website ko GitHub aur Vercel par deploy karein
1. ZIP extract karein.
2. Extracted folder ke **andar ki tamam files** GitHub repository ke root mein upload karein; `.firebaserc` hidden file ko bhi include karein.
3. Vercel → Add New → Project → apni GitHub repository import karein.
4. Framework Preset: `Other`; Build Command khaali; Output Directory `.`; deploy.
5. Vercel par milne wala exact domain Firebase → Authentication → Settings → Authorized domains mein add karein.

## F. Owner dashboard aur company settings
1. Website par apne owner account se sign in karein.
2. Dashboard khulna chahiye agar `settings/ownerAccess.ownerUids` mein UID sahi hai.
3. Settings panel mein company name, support email, currency `PKR`, consultation duration aur manual payment instructions set karke Save karein.
4. Manual payment proof aane par transaction ko khud provider/bank record se verify karein. Sirf screenshot ya form submit hone se invoice ko Paid na mark karein.

## G. Final testing checklist
- Email/password signup/login aur logout.
- Refresh ke baad session persistence.
- Owner UID se owner dashboard khulta hai.
- Normal customer owner dashboard/records ko access nahi kar sakta.
- Customer sirf apne projects, quotes, invoices, bookings aur support tickets dekhta hai.
- Owner services, project status, quotes, invoices, manual payment record aur settings manage kar sakta hai.
- Phone aur desktop dono par forms aur buttons test karein.

## Important
- Is package mein Firebase web config aapke naye project ke liye set hai, lekin production deployment aur live tests aapko karne honge.
- Manual payment hi configured workflow hai. JazzCash/Easypaisa automatic gateway abhi connected nahi.
- `settings/public` document manually banane ki zaroorat nahi; owner dashboard Settings mein Save karne se create/update hota hai.
- Cloud Functions optional hain, billing plan/requirements check kiye baghair deploy na karein.
