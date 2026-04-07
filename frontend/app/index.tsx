import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Button, FlatList, StyleSheet,
  Text, TextInput,
  View
} from 'react-native';

const API_URL = 'https://unskilfully-easier-drema.ngrok-free.dev';

type Item = {
  id: number;
  nama: string;
};

export default function App() {
  const [nama, setNama]       = useState('');
  const [items, setItems]     = useState<Item[]>([]);
  const [loading, setLoading] = useState(false);
  const [editId, setEditId]   = useState<number | null>(null);

  const loadData = async () => {
    setLoading(true);
    try {
      const res  = await fetch(`${API_URL}/items`);
      const data = await res.json();
      setItems(data);
    } catch (e) {
      Alert.alert('Error', 'Gagal mengambil data!');
    } finally {
      setLoading(false);
    }
  };

  const tambahData = async () => {
    if (!nama.trim()) {
      Alert.alert('Peringatan', 'Nama tidak boleh kosong!');
      return;
    }
    await fetch(`${API_URL}/items`, {
      method  : 'POST',
      headers : { 'Content-Type': 'application/json' },
      body    : JSON.stringify({ nama }),
    });
    setNama('');
    loadData();
  };

  const updateData = async () => {
    if (!nama.trim()) {
      Alert.alert('Peringatan', 'Nama tidak boleh kosong!');
      return;
    }
    await fetch(`${API_URL}/items/${editId}`, {
      method  : 'PUT',
      headers : { 'Content-Type': 'application/json' },
      body    : JSON.stringify({ nama }),
    });
    setNama('');
    setEditId(null);
    loadData();
  };

  const mulaiEdit = (item: Item) => {
    setEditId(item.id);
    setNama(item.nama);
  };

  const batalEdit = () => {
    setEditId(null);
    setNama('wahyu');
  };

  const hapusData = async (id: number) => {
    Alert.alert('Konfirmasi', 'Yakin ingin menghapus?', [
      { text: 'Batal', style: 'cancel' },
      {
        text: 'Hapus',
        style: 'destructive',
        onPress: async () => {
          await fetch(`${API_URL}/items/${id}`, { method: 'DELETE' });
          loadData();
        },
      },
    ]);
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.judul}> Latihan</Text>

      <TextInput
        placeholder="Nama item..."
        value={nama}
        onChangeText={setNama}
        style={styles.input}
      />

      {editId === null ? (
        <Button title=" Tambah" onPress={tambahData} color="#2196F3" />
      ) : (
        <View style={styles.row}>
          <View style={{ flex: 1 }}>
            <Button title=" Simpan" onPress={updateData} color="#4CAF50" />
          </View>
          <View style={{ width: 8 }} />
          <View style={{ flex: 1 }}>
            <Button title="✖ Batal" onPress={batalEdit} color="#9E9E9E" />
          </View>
        </View>
      )}

      {loading ? (
        <ActivityIndicator style={{ marginTop: 20 }} size="large" />
      ) : (
        <FlatList
          data={items}
          keyExtractor={(item) => item.id.toString()}
          style={{ marginTop: 16 }}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Text style={styles.namaItem}>{item.nama}</Text>
              <View style={styles.row}>
                <Button title="Edit" onPress={() => mulaiEdit(item)} color="#FF9800" />
                <View style={{ width: 8 }} />
                <Button title="Hapus" onPress={() => hapusData(item.id)} color="#F44336" />
              </View>
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container : { flex: 1, padding: 20, paddingTop: 60, backgroundColor: '#F5F5F5' },
  judul     : { fontSize: 26, fontWeight: 'bold', marginBottom: 16 },
  input     : { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 10, backgroundColor: '#fff', marginBottom: 10 },
  card      : { backgroundColor: '#fff', borderRadius: 10, padding: 14, marginBottom: 10, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  namaItem  : { fontSize: 16, flex: 1, marginRight: 10 },
  row       : { flexDirection: 'row' },
});