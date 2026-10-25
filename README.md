# Brightora Technologies — final project base

Brand: **Brightora Technologies** · Tagline: **Ideas Engineered Into Reality.**
Stack: HTML/CSS/JavaScript modules, Firebase Authentication, Cloud Firestore, GitHub and Vercel.

## Included in this code package
- Responsive dark navy / electric blue / violet public website.
- Email/password and Google authentication, persistent browser session, password reset.
- Client portal: profile, project requests/tracking, quotations, invoices, consultation bookings, notifications and support tickets.
- Owner UI: project/status management, quote creation, invoice creation, payment records, support replies, CMS content, services, staff records, settings, CSV reports and activity log.
- Firestore Rules based on `settings/ownerAccess.ownerUids`; staff IDs/roles are separate.
- Vercel headers and privacy/terms templates.
- Cloud Functions triggers for owner notifications on project/support/booking/contact submissions, plus a fail-closed payment adapter scaffold. It is **not a live gateway**.

## Important implementation limits (do not skip)
1. Firebase web configuration is set for project `brightora-a1154`; if you create a different Firebase project later, replace it with that project’s Web App config; private service-account credentials must never go into the browser.
2. The owner authorization rule reads `settings/ownerAccess.ownerUids`, matching your requested existing approach. Ensure your owner UID is in this array before publishing the rules.
3. The staff panel writes a staff directory record, but Firestore authorization must also be updated in `settings/ownerAccess.staffUids` and `staffRoles`. Do that only as owner in Firebase Console. Do not give staff broad owner permissions.
4. The UI supports quote/invoice creation and manually recorded verified payments. A payment status must only be marked paid after checking the real transaction.
5. **Online payments are not connected.** Pakistan provider eligibility depends on a merchant account and current provider requirements. JazzCash/Easypaisa merchant APIs, or another eligible provider, require official API documentation, credentials, signed webhook/callback validation and server-side amount/order verification. The included Functions adapter deliberately refuses to pretend payments work until provider-specific code is added.
6. Email notifications currently mean in-app Firestore notifications. Email delivery requires a trusted mail provider (for example a verified SMTP/API service) and a server-side trigger; do not put email API keys in front-end code. In-app owner notifications from new requests require the Cloud Functions triggers in `functions/index.js` to be deployed.
7. Audit events initiated by the browser are useful operational records, but they are not tamper-proof security logs. For regulated audit needs, move logging to trusted Cloud Functions and retain server timestamps.
8. Privacy/terms are starter templates and need business-specific legal review.

## Firebase setup (project `brightora-a1154`)

1. Firebase Console → select `brightora-a1154` → Project settings → General. Confirm the Web App config matches `js/firebase.js`. Never add service-account keys to this static website.
2. Authentication → Sign-in method: enable Email/Password; enable Google only if you want Google sign-in.
3. Authentication → Settings → Authorized domains: keep localhost if you test locally, and add the exact Vercel domain after deployment.
4. Authentication → Users: create your owner login account if you have not already. Open that user and copy the UID.
5. Firestore Database → Data: create collection `settings`, document ID `ownerAccess`, with these fields: `ownerUids` (array containing your exact owner UID), `staffUids` (empty array), `staffRoles` (empty map). Create this document in the Firebase Console before publishing rules, otherwise nobody will match the owner rule. Never place a customer UID in `ownerUids`.
6. Firestore Database → Rules: paste the project `firestore.rules` contents and click Publish. Do not use public test rules. Verify the owner UID is correct before proceeding.
7. Open the website and sign in with the owner account. In the owner dashboard → Settings, save the company name, support email, PKR currency, consultation duration and manual payment instructions. This creates `settings/public` using the exact field names expected by the app.
8. Create a GitHub repository and upload the contents of this folder (including hidden `.firebaserc`). Import that repository into Vercel. Use Framework Preset `Other`, Root Directory `.`, no build command, and Output Directory `.`. Deploy.
9. Add the exact Vercel domain under Firebase Authentication → Settings → Authorized domains. Test signup/login/logout, owner dashboard, customer account isolation, project requests, quotes, invoices, support and bookings.
10. Optional Cloud Functions: review billing requirements first. From the project root install Firebase CLI, then run `firebase use brightora-a1154`, `cd functions`, `npm install`, return to project root and run `firebase deploy --only functions`. Functions and email delivery are not required for the static website to load; payment adapter is intentionally not a live gateway.

### Firestore ownerAccess document shape

Document path: `settings/ownerAccess`

- `ownerUids`: array, e.g. `[[0m"PASTE_YOUR_AUTH_UID_HERE"]` (replace with your actual UID).
- `staffUids`: empty array `[]` initially.
- `staffRoles`: empty map `{}` initially.

Do not paste the example placeholder as a real UID. Keep the ownerAccess document writable only by the owner, as enforced by the rules.

## Indexes and collections
Collections used: `users`, `services`, `siteContent`, `orders`, `quotes`, `invoices`, `supportTickets`, `bookings`, `notifications`, `inquiries`, `staff`, `activityLogs`, `settings`.
The code attempts simple queries and falls back to unordered reads where a composite index is absent. For larger datasets, add indexes and implement cursor pagination.

## Online payment integration — next step after merchant eligibility
Do not put merchant secrets in `js/firebase.js` or Firestore public settings. First choose a provider and obtain an approved merchant account. Then implement its documented server-side checkout/session endpoint, verify webhook signature and transaction status server-side, validate invoice ID/currency/amount against Firestore, and update invoice status only after trusted verification. Test success, failure, cancellation, replay attacks, mismatched amounts and duplicate webhooks in sandbox before production. The current `functions/index.js` is only a secure fail-closed scaffold.

## Final checklist
- [ ] Replace Firebase config placeholders.
- [ ] Create ownerAccess document and add the correct owner UID.
- [ ] Publish/test rules: client A cannot read client B; non-owner cannot edit project status, quotes, invoices, services or CMS.
- [ ] Test signup/login, Google sign-in, reset password, logout and persistence after refresh.
- [ ] Test public inquiry, project request, profile, support and consultation booking.
- [ ] Test owner CRUD, quote acceptance, invoice creation, payment recording, reports, CMS and settings.
- [ ] Confirm all interactive controls work on phone, tablet and desktop.
- [ ] Configure real email delivery if desired.
- [ ] Choose an eligible payment provider and complete server/webhook integration before accepting online payments.
- [ ] Replace legal templates and demo portfolio concepts; add a verified business email.

## Deploy Cloud Functions (optional, requires billing)

From the project root, install Firebase CLI and run `firebase init functions` only if your existing project does not already have a Functions setup. Keep the provided `functions/package.json` and `functions/index.js`; set project `brightora-a1154`, run `npm install` inside `functions`, then deploy with `firebase deploy --only functions`. Review Firebase billing/Blaze requirements before enabling functions. The payment functions deliberately return “not configured” until a real provider adapter and signed webhook are added.
