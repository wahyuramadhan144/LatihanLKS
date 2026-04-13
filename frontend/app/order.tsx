import React, { useState } from 'react';
import {
    View, Text, TextInput,
    TouchableOpacity, Alert, StyleSheet
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import api from './api';

export default function OrderScreen() {
    const router                      = useRouter();
    const { id, name, price }         = useLocalSearchParams<{
        id: string; name: string; price: string;
    }>();
    const [quantity, setQuantity]     = useState<string>('1');
    const [loading, setLoading]       = useState<boolean>(false);

    const total = Number(price) * (parseInt(quantity) || 0);

    const handleOrder = async (): Promise<void> => {
        if (!quantity || parseInt(quantity) <= 0) {
            Alert.alert('Error', 'Jumlah harus lebih dari 0');
            return;
        }
        try {
            setLoading(true);
            const response = await api.post('/orders', {
                items: [{ productId: Number(id), quantity: parseInt(quantity) }]
            });
            Alert.alert(
                'Order Berhasil!',
                `ID Order: ${response.data.orderId}`,
                [
                    {
                        text: 'Lihat Invoice',
                        onPress: () => router.push({
                            pathname: '/invoice',
                            params  : { orderId: response.data.orderId }
                        })
                    },
                    { text: 'OK', onPress: () => router.back() }
                ]
            );
        } catch (error: any) {
            Alert.alert('Gagal', error.response?.data?.msg || 'Order gagal');
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Buat Order</Text>
            <View style={styles.card}>
                <Text style={styles.label}>Produk</Text>
                <Text style={styles.value}>{name}</Text>
                <Text style={styles.label}>Harga Satuan</Text>
                <Text style={styles.value}>Rp {Number(price).toLocaleString('id-ID')}</Text>
            </View>
            <Text style={styles.label}>Jumlah</Text>
            <TextInput
                style={styles.input}
                value={quantity}
                onChangeText={setQuantity}
                keyboardType="numeric"
            />
            <Text style={styles.total}>
                Total: Rp {total.toLocaleString('id-ID')}
            </Text>
            <TouchableOpacity
                style={[styles.button, loading && styles.buttonDisabled]}
                onPress={handleOrder}
                disabled={loading}
            >
                <Text style={styles.buttonText}>
                    {loading ? 'Loading...' : 'Buat Order'}
                </Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container      : { flex: 1, padding: 20 },
    title          : { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
    card           : { backgroundColor: '#f5f5f5', padding: 15, borderRadius: 8, marginBottom: 20 },
    label          : { color: '#888', fontSize: 12, marginTop: 10 },
    value          : { fontSize: 16, fontWeight: 'bold' },
    input          : { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 10, marginBottom: 15 },
    total          : { fontSize: 18, fontWeight: 'bold', color: '#27ae60', marginBottom: 20 },
    button         : { backgroundColor: '#3498db', padding: 15, borderRadius: 8, alignItems: 'center' },
    buttonDisabled : { backgroundColor: '#aaa' },
    buttonText     : { color: 'white', fontWeight: 'bold', fontSize: 16 }
});