export const formatCurrency = (amount: number) => {
  return amount.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
  });
};

export const calculateTotalBalance = (accounts: { balance: number }[]) => {
  return accounts.reduce((sum, account) => sum + account.balance, 0);
};

export const calculateAccountTypeBreakdown = (accounts: { type: string; balance: number }[]) => {
  return accounts.reduce(
    (acc, account) => {
      acc[account.type] = (acc[account.type] || 0) + account.balance;
      return acc;
    },
    {} as Record<string, number>
  );
};

export const getTypePercentage = (typeBalance: number, totalBalance: number) => {
  return (typeBalance / totalBalance) * 100;
};
