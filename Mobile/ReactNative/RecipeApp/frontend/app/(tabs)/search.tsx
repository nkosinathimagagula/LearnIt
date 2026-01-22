import { searchStyles } from '@/assets/styles/search.styles';
import { COLORS } from '@/constants/colors';
import { useDebounce } from '@/hooks/useDebounce';
import { MealAPI } from '@/services/meal-api';
import { Ionicons } from '@expo/vector-icons';
import { use, useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList } from 'react-native';
import RecipeCard from '../components/RecipeCard';
import { TransformedMealType } from '@/types/recipes';
import NoResultsFound from '../components/NoResultsFound';
import LoadingSpinner from '../components/LoadingSplinner';

export default function SearchScreen() {
    const [searchQuery, setSearchQuery] = useState("");
    const [recipes, setRecipes] = useState<TransformedMealType[]>([]);
    const [loading, setLoading] = useState(false);
    const [initialLoading, setInitialLoading] = useState(true);

    const debouncedSearchQuery = useDebounce(searchQuery, 300);

    const performSearch = async (query: string) => {
        // if there's no search query
        if (!query.trim()) {
            const randomMeals = await MealAPI.getRandomMeals(12);
            return randomMeals.map((meal) => MealAPI.transformMealData(meal)).filter((meal) => !!meal);
        }

        const nameResults = await MealAPI.searchMealByName(query);
        let results = nameResults;

        if (!results.length) {
            const ingredientResults = await MealAPI.filterByIngredient(query);
            results = ingredientResults;
        }

        return results.slice(0, 12).map((meal: any) => MealAPI.transformMealData(meal)).filter((meal: any) => !!meal);
    }

    const loadInitialData = async () => {
        try {
            const results = await performSearch("");
            setRecipes(results);
        } catch (error) {
            console.error("Error loading initial data: ", error);
        } finally {
            setInitialLoading(false);
        }
    }

    const handleSearch = async () => {
        setLoading(true);

        try {
            const results = await performSearch(debouncedSearchQuery);
            setRecipes(results);
        } catch (error) {
            console.error("Error performing search: ", error);
            setRecipes([]);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        if (initialLoading) return

        handleSearch();
    }, [debouncedSearchQuery, initialLoading])

    useEffect(() => {
        loadInitialData();
    }, []);

    if (initialLoading) return <LoadingSpinner message='Loading recipes...' />

    return (
        <View
            style={searchStyles.container}
        >
            <View style={searchStyles.searchSection}>
                <View style={searchStyles.searchContainer}>
                    <Ionicons
                        name="search"
                        size={20}
                        color={COLORS.textLight}
                        style={searchStyles.searchIcon}
                    />
                    <TextInput
                        style={searchStyles.searchInput}
                        placeholder='Search recipes, ingredients ...'
                        placeholderTextColor={COLORS.textLight}
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                        returnKeyType='search'
                    />

                    {
                        searchQuery.length && (
                            <TouchableOpacity
                                style={searchStyles.clearButton}
                                onPress={() => setSearchQuery("")}
                            >
                                <Ionicons
                                    name="close-circle"
                                    size={30}
                                    color={COLORS.textLight}
                                />
                            </TouchableOpacity>
                        )
                    }
                </View>
            </View>

            <View style={searchStyles.resultsSection}>
                <View style={searchStyles.resultsHeader}>
                    <Text style={searchStyles.resultsTitle}>
                        {searchQuery ? `Results for "${searchQuery}"` : "Popular Recipes"}
                    </Text>
                    <Text style={searchStyles.resultsCount}>
                        {recipes.length} found
                    </Text>
                </View>

                {
                    loading ? (
                        <View style={searchStyles.loadingContainer}>
                            <LoadingSpinner message='Searching recipes...' size="small" />
                        </View>
                    ) : (
                        <FlatList
                            data={recipes}
                            renderItem={({ item }) => <RecipeCard recipe={item} />}
                            keyExtractor={(item) => item?.id.toString()}
                            numColumns={2}
                            columnWrapperStyle={searchStyles.row}
                            contentContainerStyle={searchStyles.recipesGrid}
                            showsVerticalScrollIndicator={false}
                            ListEmptyComponent={
                                <NoResultsFound />
                            }
                        />
                    )
                }
            </View>
        </View>
    );
}