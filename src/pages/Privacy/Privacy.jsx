export default function Privacy() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 lg:px-8">
      <h1 className="font-display text-5xl tracking-[0.12em]">Privacy Policy</h1>
      <div className="mt-8 space-y-4 text-sm leading-7 text-stone">
        <p>
          GEN Z WEAR uses this website to display products and collect purchase enquiries. We do not take card payments
          in this version of the site.
        </p>
        <p>
          If you send a WhatsApp enquiry, the message is delivered through WhatsApp using the details you choose to
          share. We do not store customer passwords. Admin access is handled with Firebase Authentication in a later
          phase.
        </p>
        <p>
          Product images may be stored with Cloudinary after image upload is enabled. Store catalogue data will be stored
          in Firebase Firestore.
        </p>
      </div>
    </div>
  )
}
