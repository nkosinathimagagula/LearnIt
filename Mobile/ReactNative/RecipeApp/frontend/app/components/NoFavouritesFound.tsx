import { favouritesStyles } from "@/assets/styles/favourites.styles"
import { COLORS } from "@/constants/colors"
import { Ionicons } from "@expo/vector-icons"
import { router } from "expo-router"
import { View, Text, TouchableOpacity } from "react-native"

const NoFavoritesFound = () => {
    return (
        <View style={favouritesStyles.emptyState}>
            <View style={favouritesStyles.emptyIconContainer}>
                <Ionicons
                    name="search-outline"
                    size={64}
                    color={COLORS.textLight}
                />

            </View>
            <Text style={favouritesStyles.emptyTitle}>
                No favourites yet
            </Text>
            <TouchableOpacity
                style={favouritesStyles.exploreButton}
                onPress={() => router.push("/")}
            >
                <Ionicons
                    name="search"
                    size={18}
                    color={COLORS.white}
                />
                <Text style={favouritesStyles.exploreButtonText}>
                    Explore recipes
                </Text>
            </TouchableOpacity>
        </View>
    )
}

export default NoFavoritesFound;
