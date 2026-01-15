type RoleGateProps = {
  allowedRoles: string[];
  userRole: string | null | undefined;
  children: React.ReactNode;
};

export default function RoleGate({
  allowedRoles,
  userRole,
  children,
}: RoleGateProps) {
  if (!userRole || !allowedRoles.includes(userRole)) {
    return null;
  }

  return <>{children}</>;
}
