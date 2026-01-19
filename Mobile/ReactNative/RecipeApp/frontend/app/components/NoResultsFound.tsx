import { searchStyles } from "@/assets/styles/search.styles"
import { COLORS } from "@/constants/colors"
import { Ionicons } from "@expo/vector-icons"
import { View, Text } from "react-native"

const NoResultsFound = () => {
    return (
        <View style={searchStyles.emptyState}>
            <Ionicons
                name="search-outline"
                size={64}
                color={COLORS.textLight}
            />
            <Text style={searchStyles.emptyTitle}>
                No recipes found
            </Text>
            <Text style={searchStyles.emptyDescription}>
                Try adjusting your search or try different keywords
            </Text>
        </View>
    )
}

export default NoResultsFound;
