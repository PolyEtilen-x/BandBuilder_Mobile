import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  TextInput,
} from 'react-native';
import { X, Save, StickyNote } from 'lucide-react-native';

export function NotesModal({
  isOpen,
  onClose,
  note,
  setNote,
  theme,
  styles,
}: any) {
  return (
    <Modal visible={isOpen} animationType="slide" transparent={true} onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <View style={styles.notesContent}>
          <View style={styles.modalHeaderRow}>
            <View style={styles.notesHeaderTitleGroup}>
              <StickyNote size={20} color={theme.primary} />
              <Text style={styles.modalTitle}>Your Notes</Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.modalCloseButton}>
              <X size={24} color={theme.text} />
            </TouchableOpacity>
          </View>

          <TextInput
            style={styles.notesInput}
            multiline
            placeholder="Write your notes here..."
            placeholderTextColor={theme.textSecondary}
            value={note}
            onChangeText={setNote}
          />

          <TouchableOpacity
            style={styles.notesSaveButton}
            onPress={onClose}
          >
            <Save size={18} color="#fff" />
            <Text style={styles.notesSaveButtonText}>Save Note</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}
