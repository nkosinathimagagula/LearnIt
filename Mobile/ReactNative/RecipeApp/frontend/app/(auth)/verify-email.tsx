import { Alert, KeyboardAvoidingView, Platform, ScrollView, View, Text, TextInput, Touchable, TouchableOpacity } from "react-native";
import { authStyles } from "@/assets/styles/auth,styles";
import { useSignUp } from "@clerk/clerk-expo";
import { Image } from "expo-image";
import React from "react";
import { COLORS } from "@/constants/colors";

export default function VerifyEmail({ email, onBack }: { email: string; onBack: () => void }) {
    const { isLoaded, signUp, setActive } = useSignUp();

    const [code, setCode] = React.useState('');
    const [loading, setLoading] = React.useState(false);

    const onVerifyPress = async () => {
        if (!code) {
            return Alert.alert("Error", "Please enter a verification code.");
        }

        if (!isLoaded) return;

        setLoading(true);
        try {
            const signupAttempt = await signUp.attemptEmailAddressVerification({ code });

            if (signupAttempt.status === 'complete') {
                await setActive({ session: signupAttempt.createdSessionId });
            } else {
                Alert.alert("Error", "Verification failed. Please try again.");
                console.error(JSON.stringify(signupAttempt, null, 2));
            }
        } catch (err: any) {
            Alert.alert("Error", err.errors[0].message || "Verification failed.");
            console.error(JSON.stringify(err, null, 2));
        } finally {
            setLoading(false);
        }
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
                            source={require('@/assets/images/i3.png')}
                            style={authStyles.image}
                            contentFit="contain"
                        />
                    </View>

                    <Text
                        style={authStyles.title}
                    >
                        Verify Your Email
                    </Text>
                    <Text
                        style={authStyles.subtitle}
                    >
                        We&apos;ve sent a verification code to {"\n" + email}
                    </Text>

                    <View style={authStyles.formContainer}>
                        <View style={authStyles.inputContainer}>
                            <TextInput
                                style={authStyles.textInput}
                                placeholder="Enter verification code"
                                placeholderTextColor={COLORS.textLight}
                                value={code}
                                onChangeText={setCode}
                                keyboardType="number-pad"
                                autoCapitalize="none"
                            />
                        </View>

                        <TouchableOpacity
                            style={[authStyles.authButton, loading && authStyles.buttonDisabled]}
                            onPress={onVerifyPress}
                            disabled={loading}
                            activeOpacity={0.8}
                        >
                            <Text
                                style={authStyles.buttonText}
                            >
                                {loading ? 'Verifying...' : 'Verify Email'}
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={authStyles.linkContainer}
                            onPress={onBack}
                        >
                            <Text
                                style={authStyles.linkText}
                            >
                                <Text style={authStyles.link}>Back to Sign Up</Text>
                            </Text>

                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </View>
    )
}