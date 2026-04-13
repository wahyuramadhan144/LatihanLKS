import React, { useEffect, useState } from 'react';
import {
    View, Text, FlatList,
    StyleSheet, ActivityIndicator, Alert
} from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import api from './api';

interface InvoiceItem {
    namaProduk   : string;
    hargaSatuan  : number;
    qty          : number;
    totalPerItem : number;
}

interface OrderDetail {
    invoice: {
        id      : number;
        uuid    : string;
        tanggal : string;
        kasir   : string;
        email   : string;
    };
    items      : InvoiceItem[];
    grandTotal : number;
}

export default function InvoiceScreen() {
    const { orderId }           = useLocalSearchParams<{ orderId: string }>();
    const [order, setOrder]     = useState<OrderDetail | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        fetchInvoice();
    }, []);

    const fetchInvoice = async (): Promise<void> => {
        try {
            const response = await api.get<OrderDetail>(`/orders/${orderId}`);
            setOrder(response.data);
        } catch (error: any) {
            Alert.alert('Error', error.response?.data?.msg || 'Gagal ambil invoice');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <View style={styles.center}>
                <ActivityIndicator size="large" color="#3498db" />
            </View>
        );
    }

    if (!order) return null;

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Invoice #{order.invoice.id}</Text>

            <View style={styles.card}>
                <Text style={styles.label}>Kasir</Text>
                <Text style={styles.value}>{order.invoice.kasir}</Text>
                <Text style={styles.label}>Email</Text>
                <Text style={styles.value}>{order.invoice.email}</Text>
                <Text style={styles.label}>Tanggal</Text>
                <Text style={styles.value}>
                    {new Date(order.invoice.tanggal).toLocaleString('id-ID')}
                </Text>
            </View>

            <Text style={styles.sectionTitle}>Detail Produk</Text>
            <FlatList
                data={order.items}
                keyExtractor={(_, index) => index.toString()}
                renderItem={({ item }) => (
                    <View style={styles.itemCard}>
                        <Text style={styles.itemName}>{item.namaProduk}</Text>
                        <View style={styles.itemRow}>
                            <Text style={styles.itemDetail}>
                                Rp {item.hargaSatuan.toLocaleString('id-ID')} x {item.qty}
                            </Text>
                            <Text style={styles.itemSubtotal}>
                                Rp {item.totalPerItem.toLocaleString('id-ID')}
                            </Text>
                        </View>
                    </View>
                )}
            />

            <View style={styles.totalBox}>
                <Text style={styles.totalLabel}>Grand Total</Text>
                <Text style={styles.totalValue}>
                    Rp {order.grandTotal.toLocaleString('id-ID')}
                </Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    center       : { flex: 1, justifyContent: 'center', alignItems: 'center' },
    container    : { flex: 1, padding: 20, backgroundColor: '#f5f5f5' },
    title        : { fontSize: 22, fontWeight: 'bold', marginBottom: 15 },
    card         : { backgroundColor: 'white', padding: 15, borderRadius: 8, marginBottom: 15, elevation: 2 },
    label        : { color: '#888', fontSize: 12, marginTop: 8 },
    value        : { fontSize: 15, fontWeight: '600' },
    sectionTitle : { fontSize: 16, fontWeight: 'bold', marginBottom: 10 },
    itemCard     : { backgroundColor: 'white', padding: 12, borderRadius: 8, marginBottom: 8, elevation: 1 },
    itemName     : { fontSize: 15, fontWeight: 'bold' },
    itemRow      : { flexDirection: 'row', justifyContent: 'space-between', marginTop: 5 },
    itemDetail   : { color: '#888' },
    itemSubtotal : { fontWeight: 'bold', color: '#27ae60' },
    totalBox     : { backgroundColor: '#2c3e50', padding: 15, borderRadius: 8, flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 },
    totalLabel   : { color: 'white', fontSize: 16, fontWeight: 'bold' },
    totalValue   : { color: '#2ecc71', fontSize: 16, fontWeight: 'bold' }
});