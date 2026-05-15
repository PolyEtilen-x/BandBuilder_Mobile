import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Play, SkipForward, SkipBack } from 'lucide-react-native';

interface Props {
  section: any;
}

export default function ListeningPanel({ section }: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{section.title || 'Listening Section'}</Text>
      
      <View style={styles.audioPlayer}>
        <View style={styles.progressContainer}>
           <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: '40%' }]} />
           </View>
           <View style={styles.timeRow}>
              <Text style={styles.timeText}>02:15</Text>
              <Text style={styles.timeText}>05:00</Text>
           </View>
        </View>

        <View style={styles.controls}>
          <TouchableOpacity><SkipBack size={24} color="#334155" /></TouchableOpacity>
          <TouchableOpacity style={styles.playButton}>
             <Play size={24} color="#fff" fill="#fff" />
          </TouchableOpacity>
          <TouchableOpacity><SkipForward size={24} color="#334155" /></TouchableOpacity>
        </View>
      </View>

      <Text style={styles.hint}>Listen carefully and answer the questions in the next tab.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
    color: '#0f172a',
    marginBottom: 40,
    textAlign: 'center',
  },
  audioPlayer: {
    width: '100%',
    backgroundColor: '#f8fafc',
    padding: 24,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  progressContainer: {
    marginBottom: 24,
  },
  progressBar: {
    height: 6,
    backgroundColor: '#e2e8f0',
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#3b82f6',
  },
  timeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  timeText: {
    fontSize: 12,
    color: '#64748b',
    fontWeight: '600',
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 32,
  },
  playButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#3b82f6',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#3b82f6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  hint: {
    marginTop: 40,
    fontSize: 14,
    color: '#64748b',
    textAlign: 'center',
    lineHeight: 20,
  },
});
