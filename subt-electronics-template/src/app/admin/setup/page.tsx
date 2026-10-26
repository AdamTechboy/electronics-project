export const metadata = { title: "Admin setup" };
export default function AdminSetupPage() {
  return <div className="container admin-shell"><div className="admin-panel"><p className="eyebrow">First administrator</p><h1 style={{fontSize:"2.2rem"}}>Secure invitation required</h1><p>First-admin setup must only be completed through a single-use, expiring invitation created by an authorised operator. No open self-registration or default credentials are provided.</p><div className="notice">Invitation creation and redemption endpoints are intentionally not enabled until a delivery channel, rate limits, token hashing, expiry, one-time redemption, and session storage are implemented and tested.</div></div></div>;
}
