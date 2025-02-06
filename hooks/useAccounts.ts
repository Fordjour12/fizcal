import { useAuth } from "@/contexts/auth";
import * as schema from "@/services/db/schemas";
import { eq } from "drizzle-orm";
import { drizzle, } from "drizzle-orm/expo-sqlite";
import { router } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";
import { useCallback, useState } from "react";
import type { Account } from "../app";

export const useAccounts = () => {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const { user } = useAuth();
  const sqlite = useSQLiteContext();
  const db = drizzle(sqlite, { schema });

  const loadAccounts = useCallback(async () => {
    if (!user?.id) return;
    const results = await db.query.accounts.findMany({
      where: (accounts, { eq }) => eq(accounts.userId, user.id),
    });
    setAccounts(results as Account[]);
  }, [user?.id, db]);

  const handleDeleteAccount = async (accountId: string) => {
    try {
      await db
        .delete(schema.accounts)
        .where(eq(schema.accounts.id, accountId));
      await loadAccounts();
    } catch (error) {
      console.error("Error deleting account:", error);
    }
  };

  const openEditModal = (account: Account) => {
    router.push({
      pathname: "/accounts/update",
      params: { id: account.id },
    });
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadAccounts();
    setRefreshing(false);
  }, [loadAccounts]);

  return {
    accounts,
    refreshing,
    loadAccounts,
    handleDeleteAccount,
    openEditModal,
    onRefresh,
  };
};
