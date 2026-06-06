import React, { useMemo } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Sparkles, Mic, Volume2, FileText, ChevronRight } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import { useThemeColor } from '@/hooks/useThemeColor';
import { getStyles } from './PracticeGeneralPage.styles';

export default function PracticeGeneralPage() {
  const { t, i18n } = useTranslation();
  const theme = useThemeColor();
  const styles = useMemo(() => getStyles(theme), [theme]);
  const navigation = useNavigation<any>();
  const isVi = i18n.language === 'vi';

  const features = [
    {
      id: 'call_ai',
      tag: isVi ? 'Giáo Viên AI' : 'AI COACH',
      tagColor: '#8b5cf6',
      tagBg: 'rgba(139, 92, 246, 0.12)',
      title: isVi ? 'Giám Khảo Luyện Nói AI' : 'AI Speaking Coach',
      desc: isVi 
        ? 'Luyện phản xạ nói 1-1 với AI và nhận ngay thẻ điểm đánh giá chi tiết theo tiêu chí IELTS.'
        : 'Practice speaking 1-1 with our AI and get instant detailed IELTS criteria feedback.',
      icon: <Mic size={18} color="#8b5cf6" />,
      action: () => navigation.navigate('CallWithAi'),
    },
    {
      id: 'youtube_shadowing',
      tag: isVi ? 'YouTube Shadowing' : 'SHADOWING',
      tagColor: '#10b981',
      tagBg: 'rgba(16, 185, 129, 0.12)',
      title: isVi ? 'Luyện Phát Âm YouTube' : 'YouTube Shadowing',
      desc: isVi
        ? 'Luyện nói đuổi (shadowing) theo video thực tế, dịch nghĩa câu và tra cứu từ điển trực tiếp.'
        : 'Improve pronunciation with real shadowing videos, interactive translations & dictionary lookup.',
      icon: <Volume2 size={18} color="#10b981" />,
      action: () => navigation.navigate('PronunciationPractice'),
    },
    {
      id: 'writing_samples',
      tag: isVi ? 'Bài Mẫu IELTS' : 'WRITING SAMPLES',
      tagColor: '#f97316',
      tagBg: 'rgba(249, 115, 22, 0.12)',
      title: isVi ? 'Bài Mẫu IELTS Writing' : 'IELTS Writing Samples',
      desc: isVi
        ? 'Nghiên cứu dàn ý bài viết mẫu Task 1 & Task 2 từ Band 6.0+ đến 8.5+ chất lượng cao.'
        : 'Analyze sample essays for Task 1 & Task 2 from Band 6.0+ up to 8.5+ with outlines.',
      icon: <FileText size={18} color="#f97316" />,
      action: () => navigation.navigate('WritingSamples'),
    }
  ];

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <StatusBar barStyle={theme.text === '#ffffff' ? 'light-content' : 'dark-content'} />

      <View style={styles.header}>
        <Text style={styles.title}>
          {isVi ? 'Luyện Tập Chung' : 'General Practice'}
        </Text>
        <Text style={styles.subtitle}>
          {isVi ? 'Nâng cao kỹ năng phát âm, nói và viết toàn diện' : 'Upgrade your speaking, writing & pronunciation skills'}
        </Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {features.map((item) => (
          <TouchableOpacity
            key={item.id}
            activeOpacity={0.8}
            onPress={item.action}
            style={styles.card}
          >
            <View style={styles.cardContent}>
              <View style={styles.cardHeader}>
                <View style={[styles.iconContainer, { backgroundColor: item.tagBg }]}>
                  {item.icon}
                </View>
                <Text style={[styles.cardTag, { color: item.tagColor }]}>
                  {item.tag}
                </Text>
              </View>

              <Text style={styles.cardTitle}>{item.title}</Text>
              <Text style={styles.cardDesc}>{item.desc}</Text>
            </View>

            <View style={styles.chevronContainer}>
              <ChevronRight size={20} color={theme.textSecondary} />
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}
