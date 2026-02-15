//
//  app/lib/admin.ts
//  TradeFlex - Admin Configuration
//

const ADMIN_EMAILS = [
  'alice0130@gmail.com',
];

export function isAdmin(email: string | undefined): boolean {
  if (!email) return false;
  return ADMIN_EMAILS.includes(email.toLowerCase());
}
