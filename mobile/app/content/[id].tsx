import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TextInput, Image, Linking, TouchableOpacity, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { VideoView, useVideoPlayer } from 'expo-video';
import { useAudioPlayer, useAudioPlayerStatus } from 'expo-audio';
import { useBumbarTheme } from '../../hooks/useBumbarTheme';
import { useAuth } from '../../contexts/AuthContext';
import { getContent, createComment, updateComment, deleteComment } from '../../services/content';
import { BumbarButton } from '../../components';
import KeyboardDismissView from '../../components/KeyboardDismissView';
import { Typography } from '../../constants/Typography';
import CommentItem from '../../components/CommentItem';
import { DetailSkeleton } from '../../components/Skeleton';

const TYPE_LABEL: Record<string, string> = { VIDEO: 'Vídeo', TEXT: 'Texto', PODCAST: 'Podcast' };

function VideoPlayer({ url }: { url: string }) {
  const player = useVideoPlayer(url, (p) => {
    p.loop = false;
  });
  return <VideoView style={styles.media} player={player} allowsFullscreen allowsPictureInPicture nativeControls />;
}

function formatTime(seconds: number) {
  if (!isFinite(seconds) || seconds < 0) return '0:00';
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
}

function AudioPlayer({ url, primary }: { url: string; primary: string }) {
  const { colors } = useBumbarTheme();
  const player = useAudioPlayer(url);
  const status = useAudioPlayerStatus(player);
  const [trackWidth, setTrackWidth] = useState(0);

  const duration = status.duration || 0;
  const progress = duration > 0 ? Math.min(status.currentTime / duration, 1) : 0;

  const seekFromX = (x: number) => {
    if (!duration || trackWidth <= 0) return;
    const ratio = Math.max(0, Math.min(x / trackWidth, 1));
    player.seekTo(ratio * duration);
  };

  return (
    <View style={[styles.audioCard, { borderColor: colors.border, backgroundColor: colors.card }]}>
      <TouchableOpacity onPress={() => (status.playing ? player.pause() : player.play())}>
        <Ionicons name={status.playing ? 'pause-circle' : 'play-circle'} size={40} color={primary} />
      </TouchableOpacity>
      <View style={{ flex: 1, marginLeft: 12 }}>
        <Pressable
          onLayout={(e) => setTrackWidth(e.nativeEvent.layout.width)}
          onPress={(e) => seekFromX(e.nativeEvent.locationX)}
          style={[styles.audioTrack, { backgroundColor: colors.border }]}
        >
          <View style={[styles.audioTrackFill, { width: `${progress * 100}%`, backgroundColor: primary }]} />
        </Pressable>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 4 }}>
          <Text style={{ fontSize: 12, color: colors.textSecondary }}>{formatTime(status.currentTime)}</Text>
          <Text style={{ fontSize: 12, color: colors.textSecondary }}>{formatTime(duration)}</Text>
        </View>
      </View>
    </View>
  );
}

function ContentMedia({ type, url, primary }: { type: string; url: string; primary: string }) {
  const ext = (url.split('.').pop() || '').toLowerCase();
  const isImage = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'avif'].includes(ext);

  if (isImage && type !== 'VIDEO' && type !== 'PODCAST') {
    return <Image source={{ uri: url }} style={styles.media} resizeMode="cover" />;
  }
  if (type === 'VIDEO') {
    return <VideoPlayer url={url} />;
  }
  if (type === 'PODCAST') {
    return <AudioPlayer url={url} primary={primary} />;
  }

  return (
    <TouchableOpacity
      onPress={() => Linking.openURL(url)}
      style={[styles.mediaLink, { borderColor: primary, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 }]}
    >
      <Ionicons name="open-outline" size={18} color={primary} />
      <Text style={{ color: primary, fontWeight: '600' }}>Abrir media</Text>
    </TouchableOpacity>
  );
}

export default function ContentDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { colors } = useBumbarTheme();
  const { user } = useAuth();
  const router = useRouter();
  const [content, setContent] = useState<any>(null);
  const [commentBody, setCommentBody] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const load = useCallback(() => {
    getContent(Number(id)).then(setContent);
  }, [id]);

  useEffect(() => { load(); }, [load]);

  const handleComment = async () => {
    if (!commentBody.trim()) return;
    setSubmitting(true);
    try {
      await createComment(Number(id), commentBody);
      setCommentBody('');
      load();
    } finally {
      setSubmitting(false);
    }
  };

  if (!content) {
    return (
      <ScrollView style={{ backgroundColor: colors.background }}>
        <DetailSkeleton />
      </ScrollView>
    );
  }

  return (
    <KeyboardDismissView style={{ backgroundColor: colors.background }}>
    <ScrollView style={{ backgroundColor: colors.background }} contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
      <Text style={[styles.badge, { color: colors.primary, backgroundColor: colors.primary + '20' }]}>
        {TYPE_LABEL[content.type] || content.type}
      </Text>
      <Text style={[styles.title, { color: colors.text }]}>{content.title}</Text>
      <Text style={{ color: colors.textSecondary, marginBottom: 16 }}>
        {content.theme}{content.region ? ` · ${content.region}` : ''}
      </Text>
      {content.locked ? (
        <View style={[styles.lockCard, { borderColor: colors.border, backgroundColor: colors.card }]}>
          <Ionicons name="lock-closed" size={28} color="#e8590c" />
          <Text style={[styles.lockTitle, { color: colors.text }]}>Conteúdo Jindungo</Text>
          <Text style={{ color: colors.textSecondary, textAlign: 'center', marginTop: 4 }}>
            Este conteúdo é exclusivo para utilizadores com conta. Entra ou regista-te para ver tudo.
          </Text>
          <View style={{ height: 14 }} />
          <BumbarButton title="Entrar" onPress={() => router.push('/login')} variant="primary" fullWidth />
          <View style={{ height: 10 }} />
          <BumbarButton title="Criar conta" onPress={() => router.push('/register')} variant="secondary" fullWidth />
        </View>
      ) : (
        <>
          {content.mediaUrl && <ContentMedia type={content.type} url={content.mediaUrl} primary={colors.primary} />}
          <Text style={[styles.body, { color: colors.text }]}>{content.body}</Text>

          <Text style={[styles.sectionTitle, { color: colors.text }]}>Comentários</Text>
          {content.comments?.map((c: any) => (
            <CommentItem
              key={c.id}
              item={c}
              onSave={async (commentId, body) => { await updateComment(commentId, body); load(); }}
              onDelete={async (commentId) => { await deleteComment(commentId); load(); }}
            />
          ))}
          {(!content.comments || content.comments.length === 0) && (
            <Text style={{ color: colors.textSecondary }}>Sê o primeiro a comentar.</Text>
          )}

          {user ? (
            <View style={{ marginTop: 16 }}>
              <TextInput
                style={[styles.input, { borderColor: colors.border, color: colors.text }]}
                placeholder="Escreve um comentário..."
                placeholderTextColor={colors.textSecondary}
                value={commentBody}
                onChangeText={setCommentBody}
                multiline
              />
              <View style={{ height: 10 }} />
              <BumbarButton title="Publicar Comentário" onPress={handleComment} loading={submitting} variant="primary" fullWidth />
            </View>
          ) : (
            <Text style={{ color: colors.textSecondary, marginTop: 16 }}>Entra para comentar.</Text>
          )}
        </>
      )}
    </ScrollView>
    </KeyboardDismissView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, paddingBottom: 48 },
  badge: { alignSelf: 'flex-start', fontSize: 12, fontWeight: '600', paddingHorizontal: 10, paddingVertical: 3, borderRadius: 999, marginBottom: 10 },
  title: { ...Typography.presets.h1, marginBottom: 6 },
  body: { ...Typography.presets.body, lineHeight: 24, marginBottom: 24 },
  sectionTitle: { ...Typography.presets.h3, marginBottom: 10 },
  input: { borderWidth: 1, borderRadius: 10, padding: 12, minHeight: 80, textAlignVertical: 'top' },
  media: { width: '100%', height: 200, borderRadius: 12, marginBottom: 16 },
  mediaLink: { borderWidth: 1, borderRadius: 10, padding: 14, alignItems: 'center', marginBottom: 16 },
  audioCard: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderRadius: 14, padding: 14, marginBottom: 16 },
  audioTrack: { height: 6, borderRadius: 3, overflow: 'hidden' },
  audioTrackFill: { height: 6, borderRadius: 3 },
  lockCard: { borderWidth: 1, borderRadius: 16, padding: 28, alignItems: 'center' },
  lockTitle: { ...Typography.presets.h3, marginTop: 8 },
});
