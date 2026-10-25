// Server-side hooks for payment provider integration. No provider is falsely marked as connected.
// Deploy with Firebase Functions only after enabling billing and choosing an eligible merchant gateway.
const {onCall,HttpsError}=require('firebase-functions/v2/https');
const {onDocumentCreated}=require('firebase-functions/v2/firestore');
const {defineSecret}=require('firebase-functions/params');
const {initializeApp}=require('firebase-admin/app');
const {getFirestore,FieldValue}=require('firebase-admin/firestore');
initializeApp();const db=getFirestore();
const PAYMENT_PROVIDER=process.env.PAYMENT_PROVIDER||'disabled';
// Add provider-specific secrets with defineSecret after selecting a provider; never expose them to the browser.
exports.createPaymentSession=onCall(async request=>{
 if(!request.auth)throw new HttpsError('unauthenticated','Sign in before starting payment.');
 const {invoiceId}=request.data||{};if(typeof invoiceId!=='string'||!invoiceId)throw new HttpsError('invalid-argument','invoiceId is required.');
 const ref=db.collection('invoices').doc(invoiceId);const snap=await ref.get();if(!snap.exists)throw new HttpsError('not-found','Invoice not found.');const invoice=snap.data();
 if(invoice.clientUid!==request.auth.uid)throw new HttpsError('permission-denied','You can only pay your own invoice.');
 if(['paid','cancelled'].includes(invoice.status))throw new HttpsError('failed-precondition','This invoice is not payable.');
 if(PAYMENT_PROVIDER==='disabled')throw new HttpsError('failed-precondition','Online payments are not configured. Use the published manual payment instructions or contact support.');
 // Intentionally fail closed: insert a provider-specific checkout implementation here only after merchant API docs/credentials are confirmed.
 throw new HttpsError('failed-precondition',`Provider adapter for ${PAYMENT_PROVIDER} is not implemented. Do not collect payments until its signed webhook and server verification are implemented and tested.`);
});
exports.paymentWebhookPlaceholder=onCall(async()=>{throw new HttpsError('failed-precondition','A real HTTPS webhook endpoint and signature verification must be implemented for your selected merchant provider. This placeholder is not a payment webhook.');});


// Server-side notifications to owners when a visitor/client submits a request.
async function notifyOwners(title,message,targetType,targetId){
 const settings=await db.doc('settings/ownerAccess').get();
 const ownerUids=settings.exists && Array.isArray(settings.data().ownerUids)?settings.data().ownerUids:[];
 if(!ownerUids.length)return;
 const batch=db.batch();
 for(const uid of ownerUids){const ref=db.collection('notifications').doc();batch.set(ref,{uid,title,message,targetType,targetId,read:false,createdAt:FieldValue.serverTimestamp()});}
 await batch.commit();
}
exports.projectRequestNotification=onDocumentCreated('orders/{id}',async event=>{const d=event.data?.data();if(!d)return;await notifyOwners('New project request',`${d.clientEmail||'A client'} submitted ${d.title||'a project request'}.`,'orders',event.params.id)});
exports.supportRequestNotification=onDocumentCreated('supportTickets/{id}',async event=>{const d=event.data?.data();if(!d)return;await notifyOwners('New support request',`${d.clientEmail||'A client'}: ${d.subject||'Support request'}`,'supportTickets',event.params.id)});
exports.bookingRequestNotification=onDocumentCreated('bookings/{id}',async event=>{const d=event.data?.data();if(!d)return;await notifyOwners('Consultation requested',`${d.clientEmail||'A client'} requested ${d.date||''} ${d.time||''}.`,'bookings',event.params.id)});
exports.contactInquiryNotification=onDocumentCreated('inquiries/{id}',async event=>{const d=event.data?.data();if(!d)return;await notifyOwners('New website inquiry',`${d.name||'Visitor'} (${d.email||'no email'}): ${(d.message||'').slice(0,180)}`,'inquiries',event.params.id)});
