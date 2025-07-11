import { useAuthContext } from "../../contexts";

export function useHasPermission(permission: string) {
  const { permissions } = useAuthContext();
  return permissions?.includes(permission);
}