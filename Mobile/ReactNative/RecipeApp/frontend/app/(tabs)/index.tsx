import { homeStyles } from "@/assets/styles/home.styles";
import { COLORS } from "@/constants/colors";
import { MealAPI } from "@/services/meal-api";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, FlatList, RefreshControl } from "react-native";
import CategoryFilter from "../components/CategoryFilter";
import { TransformedMealType } from "@/types/recipes";
import RecipeCard from "../components/RecipeCard";

const HomeScreen = () => {
    const router = useRouter();
    const [selectedCategory, setSelectedCategory] = useState<string>();
    const [recipes, setRecipes] = useState<(TransformedMealType | undefined)[]>([]);
    const [categories, setCategories] = useState([]);
    const [featuredRecipe, setFeaturedRecipe] = useState<any>();
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const loadData = async () => {
        try {
            setLoading(true);

            const [apiCategories, randomMeals, featuredMeal] = await Promise.all([
                MealAPI.getCategories(),
                MealAPI.getRandomMeals(),
                MealAPI.getRandomMeal(),
            ])

            const transformedCategories = apiCategories.map((category: any, index: number) => ({
                id: index + 1,
                name: category.strCategory,
                image: category.strCategoryThumb,
                description: category.strCategoryDescription
            }))

            const transformedMeals: (TransformedMealType | undefined)[] = randomMeals
                .map((meal: any): TransformedMealType | undefined => MealAPI.transformMealData(meal))
                .filter((meal: any) => !!meal);

            const transformedFeaturedMeal = MealAPI.transformMealData(featuredMeal);

            setCategories(transformedCategories);
            setRecipes(transformedMeals);
            setFeaturedRecipe(transformedFeaturedMeal);

            if (!selectedCategory) setSelectedCategory(transformedCategories[0].name)
        } catch (error) {
            console.error("Error loading data:", error);
        } finally {
            setLoading(false);
        }
    }

    const loadCategoryData = async (category: string) => {
        try {
            const meals = await MealAPI.filterByCategory(category);
            const transformedMeals = meals.map((meal: any) => MealAPI.transformMealData(meal)).filter((meal: any) => !!meal);
            setRecipes(transformedMeals);
        } catch (error) {
            console.error("Error loading category data:", error);
            setRecipes([]);
        }
    }

    const handleCategorySelect = async (category: string) => {
        setSelectedCategory(category);
        await loadCategoryData(category);
    }

    const onRefresh = async () => {
        setRefreshing(true);
        await loadData();
        setRefreshing(false);
    }

    useEffect(() => {
        loadData();
    }, [])

    return (
        <View
            style={homeStyles.container}
        >
            <ScrollView
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        tintColor={COLORS.primary}
                    />
                }
                style={homeStyles.scrollContent}
            >
                <View
                    style={homeStyles.welcomeSection}
                >
                    <Image
                        source={require("@/assets/images/lamb.png")}
                        style={{ width: 100, height: 100 }}
                    />
                    <Image
                        source={require("@/assets/images/chicken.png")}
                        style={{ width: 100, height: 100 }}
                    />
                    <Image
                        source={require("@/assets/images/pork.png")}
                        style={{ width: 100, height: 100 }}
                    />
                </View>

                {
                    featuredRecipe && (
                        <View
                            style={homeStyles.featuredSection}
                        >
                            <TouchableOpacity
                                style={homeStyles.featuredCard}
                                activeOpacity={0.9}
                            // TODO: Enable navigation to recipe details
                            // onPress={() => router.push(`/recipe/${featuredRecipe.id}`)}
                            >
                                <View
                                    style={homeStyles.featuredImageContainer}
                                >
                                    <Image
                                        source={{ uri: featuredRecipe.image }}
                                        style={homeStyles.featuredImage}
                                        contentFit="cover"
                                        transition={500}
                                    />

                                    <View
                                        style={homeStyles.featuredOverlay}
                                    >
                                        <View
                                            style={homeStyles.featuredBadge}
                                        >
                                            <Text style={homeStyles.featuredBadgeText}>Featured</Text>
                                        </View>

                                        <View
                                            style={homeStyles.featuredContent}
                                        >
                                            <Text
                                                style={homeStyles.featuredTitle}
                                                numberOfLines={2}
                                            >
                                                {featuredRecipe.title}
                                            </Text>

                                            <View
                                                style={homeStyles.featuredMeta}
                                            >
                                                <View
                                                    style={homeStyles.metaItem}
                                                >
                                                    <Ionicons name="time-outline" size={16} color={COLORS.white} />
                                                    <Text style={homeStyles.metaText}>{featuredRecipe.cookTime}</Text>
                                                </View>
                                                <View
                                                    style={homeStyles.metaItem}
                                                >
                                                    <Ionicons name="people-outline" size={16} color={COLORS.white} />
                                                    <Text style={homeStyles.metaText}>{featuredRecipe.servings}</Text>
                                                </View>
                                                {
                                                    featuredRecipe.area && (
                                                        <View
                                                            style={homeStyles.metaItem}
                                                        >
                                                            <Ionicons name="location-outline" size={16} color={COLORS.white} />
                                                            <Text style={homeStyles.metaText}>{featuredRecipe.area}</Text>
                                                        </View>
                                                    )
                                                }
                                            </View>
                                        </View>
                                    </View>
                                </View>
                            </TouchableOpacity>
                        </View>
                    )
                }

                {
                    categories.length && (
                        <CategoryFilter
                            categories={categories}
                            selectedCategory={selectedCategory}
                            onSelectCategory={handleCategorySelect}
                        />
                    )
                }

                <View
                    style={homeStyles.recipesSection}
                >
                    <View
                        style={homeStyles.sectionHeader}
                    >
                        <Text style={homeStyles.sectionTitle}>
                            {selectedCategory}
                        </Text>
                    </View>

                    {
                        recipes.length && (
                            <FlatList
                                data={recipes}
                                renderItem={({ item }) => <RecipeCard recipe={item} />}
                                keyExtractor={(item, index) => item?.id.toString() || (index + 1).toString()}
                                numColumns={2}
                                columnWrapperStyle={homeStyles.row}
                                contentContainerStyle={homeStyles.recipesGrid}
                                scrollEnabled={false}
                                ListEmptyComponent={
                                    <View
                                        style={homeStyles.emptyState}
                                    >
                                        <Ionicons name="restaurant-outline" size={64} color={COLORS.textLight} />
                                        <Text style={homeStyles.emptyTitle}>No recipes found</Text>
                                        <Text style={homeStyles.emptyDescription}>Try a different category</Text>
                                    </View>
                                }
                            />
                        )
                    }
                </View>
            </ScrollView>
        </View>
    )
}

export default HomeScreen;
