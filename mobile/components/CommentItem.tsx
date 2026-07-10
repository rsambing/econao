import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useBumbarTheme } from '../hooks/useBumbarTheme';
import { useAuth } from '../contexts/AuthContext';
import Avatar from './Avatar';

interface CommentAuthor {
  id?: number;
  name?: string;
  avatarUrl?: string | null;
}

interface CommentItemProps {
  item: { id: number; body: string; author?: CommentAuthor };
  onSave: (id: number, body: string) => Promise<any>;
  onDelete: (id: number) => Promise<any>;
}

export default function CommentItem({ item, onSave, onDelete }: CommentItemProps) {
  const { colors } = useBumbarTheme();
  const { user } = useAuth();
  const router = useRouter();
  const [editing, setEditing] = useState(false);
  const [body, setBody] = useState(item.body);
  const [busy, setBusy] = useState(false);

  const canManage = !!user && (user.id === item.author?.id || user.role === 'ADMIN');

  const handleSave = async () => {
    if (!body.trim()) return;
    setBusy(true);
    try {
      await onSave(item.id, body);
      setEditing(false);
    } catch (err: any) {
      Alert.alert('Erro', err.message || 'Não foi possível guardar o comentário.');
    } finally {
      setBusy(false);
    }
  };

  const handleDelete = () => {
    Alert.alert('Eliminar comentário', 'Tens a certeza que queres eliminar este comentário?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Eliminar',
        style: 'destructive',
        onPress: async () => {
          setBusy(true);
          try {
            await onDelete(item.id);
          } catch (err: any) {
            Alert.alert('Erro', err.message || 'Não foi possível eliminar o comentário.');
            setBusy(false);
          }
        },
      },
    ]);
  };

  return (
    <View style={[styles.comment, { borderColor: colors.border }]}>
      <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 10 }}>
        <TouchableOpacity disabled={!item.author?.id} onPress={() => router.push(`/user/${item.author?.id}`)}>
          <Avatar name={item.author?.name} url={item.author?.avatarUrl} size={28} />
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            <TouchableOpacity disabled={!item.author?.id} onPress={() => router.push(`/user/${item.author?.id}`)}>
              <Text style={{ fontWeight: '700', color: colors.text }}>{item.author?.name}</Text>
            </TouchableOpacity>
            {canManage && !editing && (
              <View style={{ flexDirection: 'row', gap: 14 }}>
                <TouchableOpacity onPress={() => { setBody(item.body); setEditing(true); }}>
                  <Ionicons name="pencil-outline" size={16} color={colors.textSecondary} />
                </TouchableOpacity>
                <TouchableOpacity onPress={handleDelete} disabled={busy}>
                  <Ionicons name="trash-outline" size={16} color="#e03131" />
                </TouchableOpacity>
              </View>
            )}
          </View>

          {!editing ? (
            <Text style={{ color: colors.text, marginTop: 2 }}>{item.body}</Text>
          ) : (
            <View style={{ marginTop: 6 }}>
              <TextInput
                style={[styles.input, { borderColor: colors.border, color: colors.text }]}
                value={body}
                onChangeText={setBody}
                multiline
              />
              <View style={{ flexDirection: 'row', gap: 8, marginTop: 6 }}>
                <TouchableOpacity
                  onPress={handleSave}
                  disabled={busy || !body.trim()}
                  style={[styles.actionBtn, { backgroundColor: colors.primary, opacity: busy || !body.trim() ? 0.6 : 1 }]}
                >
                  <Text style={{ color: '#fff', fontWeight: '600', fontSize: 13 }}>
                    {busy ? 'A guardar...' : 'Guardar'}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => setEditing(false)}
                  disabled={busy}
                  style={[styles.actionBtn, { borderWidth: 1, borderColor: colors.border }]}
                >
                  <Text style={{ color: colors.text, fontWeight: '600', fontSize: 13 }}>Cancelar</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  comment: { borderTopWidth: 1, paddingVertical: 10 },
  input: { borderWidth: 1, borderRadius: 8, padding: 8, minHeight: 60, textAlignVertical: 'top', fontSize: 14 },
  actionBtn: { paddingHorizontal: 14, paddingVertical: 6, borderRadius: 8 },
});
