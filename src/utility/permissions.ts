import type { ProviderStaff } from "../types/user";
import { GrantStatus } from "../types/grantProgram";

export const isManager = (providerStaff?: ProviderStaff | null): boolean =>
  !!providerStaff && (providerStaff.role || "").toString().toUpperCase() === "MANAGER";

export const isEditor = (providerStaff?: ProviderStaff | null): boolean =>
  !!providerStaff &&
  ["MANAGER", "ADMINISTRATOR"].includes((providerStaff.role || "").toString().toUpperCase());

export const canEditGrant = (providerStaff?: ProviderStaff | null, grantProgram?: { status?: string } | null): boolean => {
  if (!isEditor(providerStaff)) return false;
  if (!grantProgram) return false;
  return grantProgram.status === GrantStatus.DRAFT;
};