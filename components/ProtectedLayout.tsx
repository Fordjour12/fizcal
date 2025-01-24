import { useAuth } from "@/contexts/auth";
import { Redirect } from "expo-router";
import { ActivityIndicator, View } from "react-native";

export function ProtectedLayout({ children }: { children: React.ReactNode }) {
	const { user, isAuthenticated, loading } = useAuth();

	console.log(user);

	if (loading) {
		return (
			<View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
				<ActivityIndicator size="large" color="#8B5CF6" />
			</View>
		);
	}

	if (!isAuthenticated) {
		return <Redirect href="/boarding/userSetup" />;
	}

	return <>{children}</>;
}
