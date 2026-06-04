import React from "react"
import { View, Text, TouchableOpacity } from "react-native"
import { LinearGradient } from "expo-linear-gradient"
import { BookOpen, Bookmark, ChevronRight } from "lucide-react-native"

interface Props {
  currentFlashcard: any
  isFlipped: boolean
  handleFlipCard: () => void
  handleNextFlashcard: () => void
  t: any
  theme: any
  styles: any
}

export function VocabFlashcards({
  currentFlashcard,
  isFlipped,
  handleFlipCard,
  handleNextFlashcard,
  t,
  theme,
  styles,
}: Props) {
  return (
    <View style={styles.flashcardsContainer}>
      {currentFlashcard ? (
        <View style={styles.flashcardView}>
          <TouchableOpacity
            activeOpacity={0.95}
            onPress={handleFlipCard}
            style={[styles.flashcard, isFlipped && styles.flashcardFlipped]}
          >
            <LinearGradient
              colors={
                isFlipped
                  ? (theme.text === '#ffffff' ? ["#1e293b", "#0f172a"] : ["#ffffff", "#f1f5f9"])
                  : ["#1e40af", "#1e3a8a"]
              }
              style={styles.flashcardGradient}
            >
              {!isFlipped ? (
                <View style={styles.cardSide}>
                  <BookOpen size={48} color="#93c5fd" style={styles.cardIcon} />
                  <Text style={styles.cardSpelling}>{currentFlashcard.word}</Text>
                  <Text style={styles.cardPhonetics}>{currentFlashcard.pronunciation}</Text>
                  <Text style={styles.tapToFlipText}>{t('vocab.tapToFlip')}</Text>
                </View>
              ) : (
                <View style={styles.cardSide}>
                  <Bookmark size={40} color="#f87171" style={styles.cardIcon} />
                  <Text style={[styles.cardMeaning, { color: theme.text }]}>{currentFlashcard.meaning}</Text>
                  {currentFlashcard.example && (
                    <Text style={[styles.cardExample, { color: theme.textSecondary }]}>
                      "{currentFlashcard.example}"
                    </Text>
                  )}
                  <Text style={styles.tapToFlipText}>{t('vocab.tapToFlipBack')}</Text>
                </View>
              )}
            </LinearGradient>
          </TouchableOpacity>

          <View style={styles.flashcardControls}>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={handleNextFlashcard}
              style={styles.nextCardButton}
            >
              <Text style={styles.nextCardButtonText}>{t('vocab.nextCard')}</Text>
              <ChevronRight size={18} color="#ffffff" />
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <View style={styles.emptyContainer}>
          <BookOpen size={48} color={theme.textSecondary} />
          <Text style={styles.emptyText}>{t('vocab.emptyWords')}</Text>
        </View>
      )}
    </View>
  )
}
