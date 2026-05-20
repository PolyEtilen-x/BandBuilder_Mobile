import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  TouchableWithoutFeedback,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import {
  Check,
  Lock,
  Star,
  Sparkles,
  Clock,
  ChevronRight,
  X,
  BookOpen,
  BrainCircuit,
  Trophy,
  Play
} from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import { getStyles } from './style';
import { useThemeColor } from '@/hooks/useThemeColor';
import roadmapData from '@/data/roadmap/ielts_5_to_6.json';

export default function RoadmapPage() {
  const { t } = useTranslation();
  const theme = useThemeColor();
  const styles = useMemo(() => getStyles(theme), [theme]);
  const navigation = useNavigation<any>();

  const [selectedNode, setSelectedNode] = useState<any>(null);

  // Index of the first uncompleted node
  const firstUncompletedIndex = useMemo(() => {
    return roadmapData.nodes.findIndex(node => !node.isCompleted);
  }, []);

  // Calculate progress
  const completedCount = useMemo(() => {
    return roadmapData.nodes.filter(node => node.isCompleted).length;
  }, []);

  const totalCount = roadmapData.nodes.length;
  const percent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  const handleNodePress = (node: any, isLocked: boolean) => {
    setSelectedNode({
      ...node,
      isLocked
    });
  };

  const handleLaunchPractice = (node: any) => {
    setSelectedNode(null);
    if (node.isLocked) return;
    
    // Custom routing based on focus skills or node type
    if (node.id === 'node_1') {
      navigation.navigate('Practice', { activeTopTab: 'material', activeMaterialTab: 'grammar' });
    } else {
      navigation.navigate('Practice', { activeTopTab: 'practice' });
    }
  };

  const handleResourcePress = (resource: any, isLocked: boolean) => {
    if (isLocked) return;
    setSelectedNode(null);

    // Route to correct supplementary section
    if (resource.type === 'video' || resource.type === 'grammar') {
      navigation.navigate('Practice', { activeTopTab: 'material', activeMaterialTab: 'grammar' });
    } else if (resource.type === 'reading' || resource.type === 'vocabulary') {
      navigation.navigate('Practice', { activeTopTab: 'material', activeMaterialTab: 'vocab' });
    } else {
      navigation.navigate('Practice', { activeTopTab: 'practice' });
    }
  };

  const renderTimelineNode = (node: any, index: number) => {
    const isCompleted = node.isCompleted;
    const isActive = index === firstUncompletedIndex;
    const isLocked = !isCompleted && !isActive;

    return (
      <View key={node.id} style={styles.nodeRow}>
        {/* Left Column: Vertical line and dot indicator */}
        <View style={styles.leftColumn}>
          {index < totalCount - 1 && <View style={styles.verticalLine} />}
          <View style={[
            styles.dotWrapper,
            isCompleted && { backgroundColor: '#10b981', borderColor: '#10b981' },
            isActive && { backgroundColor: theme.primary, borderColor: theme.primary },
            isLocked && { backgroundColor: theme.backgroundAlt, borderColor: theme.border }
          ]}>
            {isCompleted ? (
              <Check size={14} color="#ffffff" strokeWidth={3} />
            ) : isLocked ? (
              <Lock size={12} color={theme.textSecondary} />
            ) : (
              <Star size={12} color="#ffffff" fill="#ffffff" />
            )}
          </View>
        </View>

        {/* Right Column: Node Details Card */}
        <View style={styles.rightColumn}>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => handleNodePress(node, isLocked)}
            style={[
              styles.journeyCard,
              isActive && styles.journeyCardActive,
              isLocked && styles.journeyCardLocked
            ]}
          >
            <View style={styles.cardHeader}>
              <View style={styles.nodeBadge}>
                <Text style={[styles.nodeBadgeText, { color: isCompleted ? '#10b981' : isActive ? theme.primary : theme.textSecondary }]}>
                  STAGE {index + 1}
                </Text>
              </View>
              {isCompleted ? (
                <Text style={{ fontSize: 11, fontWeight: '700', color: '#10b981' }}>COMPLETED</Text>
              ) : isActive ? (
                <Text style={{ fontSize: 11, fontWeight: '700', color: theme.primary }}>IN PROGRESS</Text>
              ) : (
                <Text style={{ fontSize: 11, fontWeight: '700', color: theme.textSecondary }}>LOCKED</Text>
              )}
            </View>

            <Text style={styles.cardTitle}>{node.title}</Text>
            <Text style={styles.cardSub} numberOfLines={2}>{node.description}</Text>
            
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 4 }}>
              <Text style={styles.cardDuration}>Focus: {node.focusSkills.join(', ')}</Text>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                <Clock size={12} color={theme.textSecondary} />
                <Text style={{ fontSize: 11, color: theme.textSecondary, fontWeight: '500' }}>{node.estimatedTime}</Text>
              </View>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <StatusBar barStyle={theme.text === '#ffffff' ? 'light-content' : 'dark-content'} />
      
      <ScrollView 
        showsVerticalScrollIndicator={false} 
        contentContainerStyle={styles.scrollContent}
      >
        {/* Title Header */}
        <View style={styles.header}>
          <View style={styles.headerTitleRow}>
            <Text style={styles.headerTitle}>{roadmapData.title}</Text>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => navigation.navigate('RoadmapSetup')}
              style={{
                backgroundColor: theme.primary + '15',
                borderWidth: 1,
                borderColor: theme.primary + '40',
                borderRadius: 12,
                padding: 10,
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Sparkles size={20} color={theme.primary} />
            </TouchableOpacity>
          </View>
          <Text style={styles.headerSub}>{roadmapData.description}</Text>
        </View>

        {/* Metrics Grid dashboard */}
        <View style={styles.metricsGrid}>
          <View style={styles.metricCard}>
            <Text style={styles.metricTitle}>Duration</Text>
            <Text style={styles.metricValue}>{roadmapData.estimatedDuration}</Text>
          </View>
          <View style={styles.metricCard}>
            <Text style={styles.metricTitle}>Stages</Text>
            <Text style={styles.metricValue}>{totalCount} Stages</Text>
          </View>
          <View style={styles.metricCard}>
            <Text style={styles.metricTitle}>Current</Text>
            <Text style={styles.metricValue}>Band {roadmapData.currentLevel}</Text>
          </View>
          <View style={styles.metricCard}>
            <Text style={styles.metricTitle}>Target</Text>
            <Text style={styles.metricValue}>Band {roadmapData.targetLevel}</Text>
          </View>
        </View>

        {/* Progress Gauge percentage bar */}
        <View style={styles.progressContainer}>
          <View style={styles.progressTextRow}>
            <Text style={styles.progressLabel}>Roadmap Progress</Text>
            <Text style={styles.progressPercent}>{percent}% ({completedCount}/{totalCount} completed)</Text>
          </View>
          <View style={styles.progressBarBg}>
            <View style={[styles.progressBarFill, { width: `${percent}%` }]} />
          </View>
        </View>

        {/* AI Architect Action Banner */}
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={() => navigation.navigate('RoadmapSetup')}
          style={{
            backgroundColor: theme.primary,
            borderRadius: 16,
            paddingVertical: 14,
            paddingHorizontal: 16,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 28,
            gap: 8,
            shadowColor: theme.primary,
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.15,
            shadowRadius: 8,
            elevation: 4
          }}
        >
          <Sparkles size={16} color="#ffffff" />
          <Text style={{ fontSize: 13, fontWeight: '800', color: '#ffffff' }}>
            Tái thiết kế Lộ trình cá nhân (AI Architect)
          </Text>
        </TouchableOpacity>

        {/* Journey Vertical Timeline Section */}
        <View style={styles.timelineSection}>
          <Text style={styles.timelineTitle}>Learning Journey</Text>
          {roadmapData.nodes.map((node, index) => renderTimelineNode(node, index))}
        </View>
      </ScrollView>

      {/* Slide-up Detail Overlay sheet */}
      {selectedNode && (
        <View style={styles.modalOverlay}>
          <TouchableWithoutFeedback onPress={() => setSelectedNode(null)}>
            <View style={styles.modalBackdrop} />
          </TouchableWithoutFeedback>

          <View style={styles.modalContent}>
            <View style={styles.modalDragIndicator} />

            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{selectedNode.title}</Text>
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => setSelectedNode(null)}
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 16,
                  backgroundColor: theme.backgroundAlt,
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <X size={18} color={theme.text} />
              </TouchableOpacity>
            </View>

            <View style={styles.modalDurationRow}>
              <Clock size={16} color={theme.primary} />
              <Text style={styles.modalDurationText}>Estimated: {selectedNode.estimatedTime}</Text>
              <View style={[
                styles.nodeBadge,
                selectedNode.isCompleted && { backgroundColor: '#10b98115' },
                !selectedNode.isCompleted && !selectedNode.isLocked && { backgroundColor: `${theme.primary}15` }
              ]}>
                <Text style={[styles.nodeBadgeText, { color: selectedNode.isCompleted ? '#10b981' : selectedNode.isLocked ? theme.textSecondary : theme.primary }]}>
                  {selectedNode.isCompleted ? 'Completed' : selectedNode.isLocked ? 'Locked' : 'In Progress'}
                </Text>
              </View>
            </View>

            <Text style={styles.modalDesc}>{selectedNode.description}</Text>

            <View style={styles.sectionDivider} />

            <Text style={styles.sectionTitle}>Focus Skills</Text>
            <View style={styles.skillTagRow}>
              {selectedNode.focusSkills.map((skill: string) => (
                <View key={skill} style={styles.skillTag}>
                  <Text style={styles.skillTagText}>{skill}</Text>
                </View>
              ))}
            </View>

            <Text style={styles.sectionTitle}>Curated Resources</Text>
            {selectedNode.resources.map((resource: any) => (
              <TouchableOpacity
                key={resource.id}
                activeOpacity={0.8}
                onPress={() => handleResourcePress(resource, selectedNode.isLocked)}
                style={[
                  styles.resourceCard,
                  selectedNode.isLocked && { opacity: 0.6 }
                ]}
              >
                <View style={[
                  styles.resourceIconBox,
                  { 
                    backgroundColor: resource.type === 'video' ? '#3b82f615' 
                      : resource.type === 'reading' ? '#10b98115' 
                      : '#8b5cf615' 
                  }
                ]}>
                  {resource.type === 'video' ? (
                    <Play size={18} color="#3b82f6" />
                  ) : resource.type === 'reading' ? (
                    <BookOpen size={18} color="#10b981" />
                  ) : (
                    <Trophy size={18} color="#8b5cf6" />
                  )}
                </View>

                <View style={styles.resourceInfo}>
                  <Text style={styles.resourceTitle}>{resource.title}</Text>
                  <Text style={styles.resourceDesc}>
                    {resource.type.toUpperCase()} • {selectedNode.isLocked ? 'Locked' : 'Tap to start practice'}
                  </Text>
                </View>

                {selectedNode.isLocked ? (
                  <Lock size={16} color={theme.textSecondary} />
                ) : (
                  <ChevronRight size={16} color={theme.textSecondary} />
                )}
              </TouchableOpacity>
            ))}

            <TouchableOpacity
              activeOpacity={0.9}
              disabled={selectedNode.isLocked}
              onPress={() => handleLaunchPractice(selectedNode)}
              style={[
                styles.ctaButton,
                selectedNode.isLocked && { backgroundColor: theme.border, shadowColor: 'transparent', elevation: 0 }
              ]}
            >
              <Text style={styles.ctaButtonText}>
                {selectedNode.isCompleted ? 'REVIEW STAGE' : selectedNode.isLocked ? 'STAGE LOCKED' : 'LAUNCH PRACTICE'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
}
