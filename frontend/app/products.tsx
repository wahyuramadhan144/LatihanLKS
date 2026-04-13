import React, { useEffect, useState } from 'react';
import {
    View, Text, FlatList, TouchableOpacity,
    Alert, StyleSheet, ActivityIndicator
} from 'react-native';
import { useRouter } from 'expo-router';
import api from './api';

interface Product {
    id        : number;
    uuid      : string;
    name      : string;
    price     : number;
    role      : string;
    userName  : string;
    userEmail : string;
}

export default function ProductScreen() {
    const router                      = useRouter();
    const [products, setProducts]     = useState<Product[]>([]);
    const [loading, setLoading]       = useState<boolean>(true);

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async (): Promise<void> => {
        try {
            const response = await api.get<Product[]>('/products');
            setProducts(response.data);
        } catch (error: any) {
            Alert.alert('Error', error.response?.data?.msg || 'Gagal ambil produk');
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = async (): Promise<void> => {
        try {
            await api.delete('/logout');
            router.replace('/');
        } catch (error: any) {
            Alert.alert('Error', 'Gagal logout');
        }
    };

    if (loading) {
        return (
            <View style={styles.center}>
                <ActivityIndicator size="large" color="#3498db" />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Products</Text>
                <TouchableOpacity onPress={handleLogout}>
                    <Text style={styles.logout}>Logout</Text>
                </TouchableOpacity>
            </View>
            <FlatList
                data={products}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        style={styles.card}
                        onPress={() => router.push({
                            pathname: '/order',
                            params: {
                                id   : item.id,
                                name : item.name,
                                price: item.price
                            }
                        })}
                    >
                        <Text style={styles.productName}>{item.name}</Text>
                        <Text style={styles.productPrice}>
                            Rp {item.price.toLocaleString('id-ID')}
                        </Text>
                        <Text style={styles.productUser}>Oleh: {item.userName}</Text>
                    </TouchableOpacity>
                )}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    center       : { flex: 1, justifyContent: 'center', alignItems: 'center' },
    container    : { flex: 1, padding: 20, backgroundColor: '#f5f5f5' },
    header       : { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
    title        : { fontSize: 24, fontWeight: 'bold' },
    logout       : { color: 'red', fontWeight: 'bold' },
    card         : { backgroundColor: 'white', padding: 15, borderRadius: 8, marginBottom: 10, elevation: 2 },
    productName  : { fontSize: 16, fontWeight: 'bold' },
    productPrice : { color: '#27ae60', marginTop: 5 },
    productUser  : { color: '#888', fontSize: 12, marginTop: 3 }
});

