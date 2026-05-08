export const ADMIN_EMAILS = [
  'bbido761@gmail.com',
  'bbid761@gmail.com',
  'bodajava@gmail.com',
  'amr917151@gmail.com',
  'awm214365879@gmail.com'
];

export const isAdminEmail = (email?: string) => {
  if (!email) return false;
  return ADMIN_EMAILS.includes(email.toLowerCase().trim());
};
