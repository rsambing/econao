import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useBumbarTheme } from '../../hooks/useBumbarTheme';
import { useAuth } from '../../contexts/AuthContext';
import { getQuiz, submitAttempt, getRanking } from '../../services/quiz';
import { BumbarButton } from '../../components';
import { Typography } from '../../constants/Typography';

export default function QuizPlayScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { colors } = useBumbarTheme();
  const { user } = useAuth();
  const [quiz, setQuiz] = useState<any>(null);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [result, setResult] = useState<any>(null);
  const [ranking, setRanking] = useState<any[]>([]);

  useEffect(() => {
    getQuiz(Number(id)).then(setQuiz);
  }, [id]);

  const selectOption = (questionId: number, optionId: number) => {
    if (result) return;
    setAnswers((prev) => ({ ...prev, [questionId]: optionId }));
  };

  const handleSubmit = async () => {
    const payload = Object.entries(answers).map(([questionId, optionId]) => ({
      questionId: Number(questionId),
      optionId: Number(optionId),
    }));
    const res = await submitAttempt(Number(id), payload);
    setResult(res);
    const rank = await getRanking(Number(id));
    setRanking(rank);
  };

  if (!quiz) return null;

  const feedbackFor = (questionId: number) => result?.feedback?.find((f: any) => f.questionId === questionId);

  return (
    <ScrollView style={{ backgroundColor: colors.background }} contentContainerStyle={styles.container}>
      <Text style={[styles.title, { color: colors.text }]}>{quiz.title}</Text>

      {!user && <Text style={{ color: colors.error, marginBottom: 12 }}>Precisas de entrar para responder.</Text>}

      {quiz.questions.map((q: any) => {
        const fb = feedbackFor(q.id);
        return (
          <View key={q.id} style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Text style={[styles.question, { color: colors.text }]}>{q.text}</Text>
            {q.options.map((opt: any) => {
              let borderColor = colors.border;
              let backgroundColor = 'transparent';
              if (answers[q.id] === opt.id) {
                borderColor = colors.primary;
                backgroundColor = colors.primary + '15';
              }
              if (result) {
                if (fb?.correctOptionId === opt.id) {
                  borderColor = colors.success;
                  backgroundColor = colors.success + '15';
                } else if (fb?.chosenOptionId === opt.id && !fb?.isCorrect) {
                  borderColor = colors.error;
                  backgroundColor = colors.error + '15';
                }
              }
              return (
                <TouchableOpacity
                  key={opt.id}
                  style={[styles.option, { borderColor, backgroundColor }]}
                  onPress={() => selectOption(q.id, opt.id)}
                >
                  <Text style={{ color: colors.text }}>{opt.text}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        );
      })}

      {!result ? (
        <BumbarButton title="Confirmar respostas" onPress={handleSubmit} disabled={!user} variant="primary" fullWidth />
      ) : (
        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.question, { color: colors.text }]}>Resultado: {result.score} de {result.total}</Text>
          <Text style={{ fontWeight: '700', marginTop: 10, marginBottom: 6, color: colors.text }}>Ranking</Text>
          {ranking.map((r, i) => (
            <Text key={i} style={{ color: colors.textSecondary, marginBottom: 2 }}>
              {i + 1}. {r.name} — {r.score} pts
            </Text>
          ))}
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, paddingBottom: 48 },
  title: { ...Typography.presets.h1, marginBottom: 16 },
  card: { borderWidth: 1, borderRadius: 14, padding: 16, marginBottom: 14 },
  question: { ...Typography.presets.h3, marginBottom: 10 },
  option: { borderWidth: 1, borderRadius: 10, padding: 12, marginBottom: 8 },
});
