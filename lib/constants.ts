// Shared option values used across onboarding, search filters and settings.
// These MUST match the values stored in the database so filtering works.

export const MARITAL_STATUS_OPTIONS = [
  'أعزب/عزباء',
  'متزوج/ـة',
  'مطلق/ـة',
  'أرمل/ـة',
  'عاقد القران',
] as const;

export const RELIGIOUS_COMMITMENT_OPTIONS = [
  'ملتزم جداً',
  'ملتزم',
  'متوسط',
  'غير ملتزم',
] as const;
