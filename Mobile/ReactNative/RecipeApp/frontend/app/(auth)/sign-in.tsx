import { useSignIn } from '@clerk/clerk-expo'
import { Link, useRouter } from 'expo-router'
import { Alert, KeyboardAvoidingView, Platform, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native'
import { authStyles } from '@/assets/styles/auth,styles'
import { Image } from 'expo-image';
import React from 'react';
import { COLORS } from '@/constants/colors';
import { Ionicons } from '@expo/vector-icons';

export default function Page() {
    const { signIn, setActive, isLoaded } = useSignIn()
    const router = useRouter()

    const [emailAddress, setEmailAddress] = React.useState('')
    const [password, setPassword] = React.useState('')
    const [showPassword, setShowPassword] = React.useState(false)
    const [loading, setLoading] = React.useState(false);

    // Handle the submission of the sign-in form
    const onSignInPress = async () => {

        if (!emailAddress || !password) {
            Alert.alert('Error', 'Please fill in all fields.')
            return
        }
        if (!isLoaded) return

        // Start the sign-in process using the email and password provided
        try {
            setLoading(true);
            const signInAttempt = await signIn.create({
                identifier: emailAddress,
                password,
            })

            // If sign-in process is complete, set the created session as active
            // and redirect the user
            if (signInAttempt.status === 'complete') {
                await setActive({ session: signInAttempt.createdSessionId })
                router.replace('/')
            } else {
                Alert.alert("Error", "Sign in failed. Please try again.")
                // If the status isn't complete, check why. User might need to
                // complete further steps.
                console.error(JSON.stringify(signInAttempt, null, 2))
            }
        } catch (err: any) {
            Alert.alert("Error", err.errors[0].message || "Sign in failed.")
            // See https://clerk.com/docs/custom-flows/error-handling
            // for more info on error handling
            console.error(JSON.stringify(err, null, 2))
        } finally {
            setLoading(false);
        }
    }

    return (
        <View
            style={authStyles.container}
        >
            <KeyboardAvoidingView
                style={authStyles.keyboardView}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
            >
                <ScrollView
                    style={authStyles.scrollContent}
                    showsVerticalScrollIndicator={false}
                >
                    <View
                        style={authStyles.imageContainer}
                    >
                        <Image
                            style={authStyles.image}
                            source={require('@/assets/images/i1.png')}
                            contentFit='contain'
                        />
                    </View>

                    <Text
                        style={authStyles.title}
                    >
                        Welcome Back
                    </Text>

                    {/* FORM CONTAINER*/}
                    <View
                        style={authStyles.formContainer}
                    >
                        <View style={authStyles.inputContainer}>
                            <TextInput
                                style={authStyles.textInput}
                                placeholder="Enter email"
                                placeholderTextColor={COLORS.textLight}
                                value={emailAddress}
                                onChangeText={setEmailAddress}
                                keyboardType="email-address"
                                autoCapitalize='none'
                            />
                        </View>

                        <View style={authStyles.inputContainer}>
                            <TextInput
                                style={authStyles.textInput}
                                placeholder="Enter password"
                                placeholderTextColor={COLORS.textLight}
                                value={password}
                                onChangeText={setPassword}
                                secureTextEntry={!showPassword}
                                autoCapitalize='none'
                            />
                            <TouchableOpacity
                                style={authStyles.eyeButton}
                                onPress={() => setShowPassword(!showPassword)}
                            >
                                <Ionicons
                                    name={showPassword ? 'eye-outline' : 'eye-off-outline'}
                                    size={20}
                                    color={COLORS.textLight}
                                />
                            </TouchableOpacity>
                        </View>

                        <TouchableOpacity
                            style={[authStyles.authButton, loading && authStyles.buttonDisabled]}
                            onPress={onSignInPress}
                            disabled={loading}
                            activeOpacity={0.8}
                        >
                            <Text
                                style={authStyles.buttonText}
                            >
                                {loading ? 'Signing In...' : 'Sign In'}
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={authStyles.linkContainer}
                            onPress={() => router.push("/(auth)/sign-up")}
                        >
                            <Text
                                style={authStyles.linkText}
                            >
                                Don&apos;t have an account?&nbsp;
                                <Text style={authStyles.link}>Sign Up</Text>
                            </Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </View>
    )
}
