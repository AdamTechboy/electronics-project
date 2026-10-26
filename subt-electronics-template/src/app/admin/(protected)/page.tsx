export default function AdminOverview() {
  return <div className="admin-panel"><p className="eyebrow">Store administration</p><h1 style={{fontSize:"2.2rem"}}>Admin overview</h1><p>This is the protected admin shell. Database-backed metrics and workflows must be connected before operational use.</p><div className="notice">No production admin account is created by this scaffold. Implement and test secure invitation redemption before onboarding the first administrator.</div></div>;
}
