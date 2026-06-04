import React, { useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { X, Search, Book } from 'lucide-react-native';
import { useDictionary } from '@/services/dictionary/useDictionary';

export function DictionaryModal({
  isOpen,
  onClose,
  searchQuery,
  setSearchQuery,
  theme,
  styles,
}: any) {
  const { dict, loading, lookup, close } = useDictionary();

  const handleSearch = () => {
    if (searchQuery.trim()) {
      lookup(searchQuery.trim());
    }
  };

  useEffect(() => {
    if (!isOpen) {
      close();
    } else if (searchQuery.trim()) {
      lookup(searchQuery.trim());
    }
  }, [isOpen]);

  return (
    <Modal visible={isOpen} animationType="slide" transparent={true} onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.dictionaryContent}>
          <View style={styles.modalHeaderRow}>
            <Text style={styles.modalTitle}>Dictionary</Text>
            <TouchableOpacity onPress={onClose} style={styles.modalCloseButton}>
              <X size={24} color={theme.text} />
            </TouchableOpacity>
          </View>

          <View style={styles.searchBar}>
            <Search size={18} color={theme.textSecondary} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search word..."
              placeholderTextColor={theme.textSecondary}
              value={searchQuery}
              onChangeText={setSearchQuery}
              onSubmitEditing={handleSearch}
              autoFocus={true}
            />
          </View>

          <ScrollView style={styles.dictScrollView} showsVerticalScrollIndicator={false}>
            {loading ? (
              <View style={{ paddingVertical: 40, alignItems: 'center', justifyContent: 'center' }}>
                <ActivityIndicator size="small" color={theme.primary} />
                <Text style={{ marginTop: 8, fontSize: 12, color: theme.textSecondary }}>Looking up definition...</Text>
              </View>
            ) : dict ? (
              <View>
                <Text style={styles.dictResultWord}>{dict.word}</Text>
                {dict.phonetic ? <Text style={styles.dictResultPhonetic}>{dict.phonetic}</Text> : null}
                
                <View style={styles.dictResultBox}>
                  <Text style={[styles.dictResultBoldText, { fontSize: 13, marginBottom: 4 }]}>English Definition:</Text>
                  <Text style={styles.dictResultText}>
                    {dict.meaning || 'No english definition found.'}
                  </Text>
                </View>

                {dict.explainVN && dict.explainVN !== 'Definition not found' && dict.explainVN !== 'Không tìm thấy nghĩa' && (
                  <View style={[styles.dictResultBox, { borderLeftColor: '#10b981' }]}>
                    <Text style={[styles.dictResultBoldText, { fontSize: 13, color: '#10b981', marginBottom: 4 }]}>Nghĩa Tiếng Việt:</Text>
                    <Text style={styles.dictResultText}>
                      {dict.explainVN}
                    </Text>
                  </View>
                )}

                {dict.example && dict.example !== 'N/A' && dict.example !== 'No example found in database' && (
                  <View style={[styles.dictResultBox, { borderLeftColor: '#8b5cf6' }]}>
                    <Text style={[styles.dictResultBoldText, { fontSize: 13, color: '#8b5cf6', marginBottom: 4 }]}>Example:</Text>
                    <Text style={[styles.dictResultText, { fontStyle: 'italic' }]}>
                      "{dict.example}"
                    </Text>
                  </View>
                )}
              </View>
            ) : (
              <View style={styles.dictEmptyState}>
                <Book size={64} color={theme.border} strokeWidth={1} />
                <Text style={styles.dictEmptyText}>Type a word and press Enter to look up</Text>
              </View>
            )}
          </ScrollView>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
}
