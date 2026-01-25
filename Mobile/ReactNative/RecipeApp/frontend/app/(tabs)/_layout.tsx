import { COLORS } from "@/constants/colors"
import { useAuth } from "@clerk/clerk-expo"
import { Ionicons } from "@expo/vector-icons"
import { Redirect, Tabs } from "expo-router"

const TabsLayout = () => {
    const { isSignedIn, isLoaded } = useAuth()

    if (!isLoaded) return;

    if (!isSignedIn) return <Redirect href={"/(auth)/sign-in"} />

    return (
        <Tabs
            screenOptions={{
                headerShown: false,
                tabBarActiveTintColor: COLORS.primary,
                tabBarInactiveTintColor: COLORS.textLight,
                tabBarStyle: {
                    backgroundColor: COLORS.white,
                    borderTopColor: COLORS.textLight,
                    borderTopWidth: 1,
                    paddingBottom: 8,
                    paddingTop: 8,
                    height: 80,
                },
                tabBarLabelStyle: {
                    fontSize: 12,
                    fontWeight: "600",
                },
            }}
        >
            <Tabs.Screen
                name="index"
                options={{
                    title: "Recipes",
                    tabBarIcon: ({ color, size }: { color: string, size: number }) => <Ionicons name="restaurant" size={size} color={color} />
                }}
            />

            <Tabs.Screen
                name="search"
                options={{
                    title: "Search",
                    tabBarIcon: ({ color, size }: { color: string, size: number }) => <Ionicons name="search" size={size} color={color} />
                }}
            />

            <Tabs.Screen
                name="favourites"
                options={{
                    title: "Favourites",
                    tabBarIcon: ({ color, size }: { color: string, size: number }) => <Ionicons name="heart" size={size} color={color} />
                }}
            />
        </Tabs>
    )
}

export default TabsLayout