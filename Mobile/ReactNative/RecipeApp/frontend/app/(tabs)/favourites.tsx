import { favouritesStyles } from "@/assets/styles/favourites.styles";
import { COLORS } from "@/constants/colors";
import { API_URL } from "@/constants/api";
import { useClerk, useUser } from "@clerk/clerk-expo";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { View, Text, Alert, ScrollView, TouchableOpacity, FlatList } from "react-native";
import RecipeCard from "../components/RecipeCard";
import { TransformedMealType } from "@/types/recipes";
import NoFavoritesFound from "../components/NoFavouritesFound";
import LoadingSpinner from "../components/LoadingSplinner";

export default function FavouritesScreen() {
    const { signOut } = useClerk();
    const { user } = useUser();
    const [favouriteRecipes, setFavouriteRecipes] = useState<TransformedMealType[]>([]);
    const [loading, setLoading] = useState(true);

    const loadFavourites = async () => {
        try {
            const response = await fetch(`${API_URL}/api/favourites/${user?.id}`);

            if (!response.ok) {
                throw new Error(`failed to fetch favourites`);
            }

            const favourites = await response.json();

            const transformedFavourites = favourites.map((favourite: any) => ({
                ...favourite,
                id: favourite.recipe_id,
            }));

            setFavouriteRecipes(transformedFavourites)
        } catch (error) {
            console.error("Error fetching favourites:", error);
            // Alert.alert("Failed to fetch favourites")
        } finally {
            setLoading(false)
        }
    }

    const handleSignOut = () => {
        Alert.alert("Logout", "Are you sure you want to logout?", [
            { "text": "Cancel", "style": "cancel" },
            { "text": "Logout", "style": "destructive", onPress: () => signOut() }
        ]);
    }

    useEffect(() => {
        loadFavourites();
    }, [user?.id]);

    if (loading) return <LoadingSpinner message="Loading your favourites" />

    return (
        <View
            style={favouritesStyles.container}
        >
            <ScrollView
                showsVerticalScrollIndicator={false}
            >
                <View style={favouritesStyles.header}>
                    <Text style={favouritesStyles.title}>Favourites</Text>
                    <TouchableOpacity
                        style={favouritesStyles.logoutButton}
                        onPress={handleSignOut}
                    >
                        <Ionicons
                            name="log-out-outline"
                            size={22}
                            color={COLORS.text}
                        />
                    </TouchableOpacity>
                </View>

                <View style={favouritesStyles.recipesSection}>
                    <FlatList
                        data={favouriteRecipes}
                        renderItem={({ item }) => <RecipeCard recipe={item} />}
                        keyExtractor={(item) => item.id.toString()}
                        numColumns={2}
                        columnWrapperStyle={favouritesStyles.row}
                        contentContainerStyle={favouritesStyles.recipesGrid}
                        scrollEnabled={false}
                        ListEmptyComponent={<NoFavoritesFound />}
                    />
                </View>
            </ScrollView>

        </View>
    );
}