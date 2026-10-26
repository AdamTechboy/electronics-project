export default function AdminAuditLogPage() {
  return <div className="admin-panel"><h1 style={{fontSize:"2rem"}}>Audit log</h1><p>Audit-event schema and server helper are provided. A production UI must read records through a permission-checked server query and avoid exposing sensitive payloads.</p></div>;
}
