
import { Stack } from 'expo-router';

export default function RootLayout() {
  return <Stack>
    <Stack.Screen name="index" options={{ headerShown: false }} />
    <Stack.Screen name="products" options={{ title: 'Daftar Produk'}} />
    <Stack.Screen name='order' options={{ title: 'Buat Order'}} />
    <Stack.Screen name='invoice' options={{ title: 'Invoice'}} />
    </Stack>;
}