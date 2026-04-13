import React, { useState } from 'react';
import {
    View, Text, TextInput,
    TouchableOpacity, Alert, StyleSheet
} from 'react-native';
import { useRouter } from 'expo-router';
import api from './api';
import products from './products'

export default function LoginScreen() {
    const router                      = useRouter();
    const [email, setEmail]           = useState<string>('');
    const [password, setPassword]     = useState<string>('');
    const [loading, setLoading]       = useState<boolean>(false);

    const handleLogin = async (): Promise<void> => {
        if (!email || !password) {
            Alert.alert('Error', 'Email dan password wajib diisi');
            return;
        }
        try {
            setLoading(true);
            const response = await api.post('/login', { email, password });
            Alert.alert('Berhasil', `Selamat datang, ${response.data.name}!`);
            router.replace('/products');
        } catch (error: any) {
            Alert.alert('Gagal', error.response?.data?.msg || 'Login gagal');
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Login</Text>
            <TextInput
                style={styles.input}
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
            />
            <TextInput
                style={styles.input}
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
            />
            <TouchableOpacity
                style={[styles.button, loading && styles.buttonDisabled]}
                onPress={handleLogin}
                disabled={loading}
            >
                <Text style={styles.buttonText}>
                    {loading ? 'Loading...' : 'Login'}
                </Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container      : { flex: 1, justifyContent: 'center', padding: 20 },
    title          : { fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
    input          : { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 10, marginBottom: 15 },
    button         : { backgroundColor: '#3498db', padding: 15, borderRadius: 8, alignItems: 'center' },
    buttonDisabled : { backgroundColor: '#aaa' },
    buttonText     : { color: 'white', fontWeight: 'bold', fontSize: 16 }
});