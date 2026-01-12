import * as React from 'react'
import { Alert, KeyboardAvoidingView, Platform, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native'
import { useSignUp } from '@clerk/clerk-expo'
import { Link, useRouter } from 'expo-router'
import { authStyles } from '@/assets/styles/auth,styles'
import { Image } from 'expo-image'
import { COLORS } from '@/constants/colors'
import { Ionicons } from '@expo/vector-icons'
import VerifyEmail from './verify-email'

export default function SignUpScreen() {
    const { isLoaded, signUp } = useSignUp()
    const router = useRouter()

    const [emailAddress, setEmailAddress] = React.useState('')
    const [password, setPassword] = React.useState('')
    const [showPassword, setShowPassword] = React.useState(false)
    const [loading, setLoading] = React.useState(false)
    const [pendingVerification, setPendingVerification] = React.useState(false)

    // Handle submission of sign-up form
    const onSignUpPress = async () => {
        if (!emailAddress || !password) {
            return Alert.alert('Error', 'Please fill in all fields.')
        }

        if (password.length < 8) {
            return Alert.alert('Error', 'Password must be at least 8 characters long.')
        }

        if (!isLoaded) return

        setLoading(true)

        // Start sign-up process using email and password provided
        try {
            await signUp.create({
                emailAddress,
                password,
            })

            // Send user an email with verification code
            await signUp.prepareEmailAddressVerification({ strategy: 'email_code' })

            // Set 'pendingVerification' to true to display second form
            // and capture OTP code
            setPendingVerification(true)
        } catch (err: any) {
            Alert.alert('Error', err.errors[0].message || 'Failed to create account.')
            // See https://clerk.com/docs/custom-flows/error-handling
            // for more info on error handling
            console.error(JSON.stringify(err, null, 2))
        } finally {
            setLoading(false)
        }
    }

    if (pendingVerification) {
        return (
            <VerifyEmail
                email={emailAddress}
                onBack={() => {
                    setPendingVerification(false)
                    router.back()
                }}
            />
        )
    }

    return (
        <View style={authStyles.container}>
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
                            source={require('@/assets/images/i2.png')}
                            style={authStyles.image}
                            contentFit="contain"
                        />
                    </View>

                    <Text
                        style={authStyles.title}
                    >
                        Create an Account
                    </Text>

                    <View
                        style={authStyles.formContainer}
                    >
                        <View
                            style={authStyles.inputContainer}
                        >
                            <TextInput
                                style={authStyles.textInput}
                                placeholder='Enter email'
                                placeholderTextColor={COLORS.textLight}
                                value={emailAddress}
                                onChangeText={setEmailAddress}
                                keyboardType='email-address'
                                autoCapitalize='none'
                            />
                        </View>

                        <View
                            style={authStyles.inputContainer}
                        >
                            <TextInput
                                style={authStyles.textInput}
                                placeholder='Enter password'
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
                            onPress={onSignUpPress}
                            disabled={loading}
                            activeOpacity={0.8}
                        >
                            <Text
                                style={authStyles.buttonText}
                            >
                                {loading ? 'Creating Account...' : 'Sign Up'}
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={authStyles.linkContainer}
                            onPress={() => router.back()}
                        >
                            <Text
                                style={authStyles.linkText}
                            >
                                Already have an account?&nbsp;
                                <Text style={authStyles.link}>Sign In</Text>
                            </Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </View>
    )
}