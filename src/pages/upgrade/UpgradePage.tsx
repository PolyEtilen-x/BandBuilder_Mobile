import React, { useState, useEffect } from "react"
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  ActivityIndicator,
  Modal,
  Image,
  Clipboard,
  Alert,
  StyleSheet
} from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { useQuery } from "@tanstack/react-query"
import { LinearGradient } from "expo-linear-gradient"
import {
  Check,
  Copy,
  X,
  CheckCircle,
  Sparkles,
  ChevronLeft
} from "lucide-react-native"
import { useTranslation } from "react-i18next"
import { paymentApi, CreditPackage, PaymentInitiateResponse } from "@/api/payment.api"
import { styles } from "./UpgradePage.styles"

interface Props {
  navigation: any
}

export default function UpgradePage({ navigation }: Props) {
  const { t } = useTranslation()

  const [selectedPackage, setSelectedPackage] = useState<CreditPackage | null>(null)
  const [paymentData, setPaymentData] = useState<PaymentInitiateResponse | null>(null)
  const [isPaid, setIsPaid] = useState(false)
  const [modalVisible, setModalVisible] = useState(false)

  // 1. Fetch available packages from backend
  const { data: packages = [], isLoading } = useQuery<CreditPackage[]>({
    queryKey: ["payment-packages"],
    queryFn: async () => {
      const res = await paymentApi.getPackages()
      return res.data
    }
  })

  // 2. Initiate payment link
  const handleChoosePackage = async (pkg: CreditPackage) => {
    try {
      setSelectedPackage(pkg)
      const res = await paymentApi.initiatePayment(pkg.id)
      setPaymentData(res.data)
      setIsPaid(false)
      setModalVisible(true)
    } catch (error) {
      Alert.alert(t('upgrade.paymentErrorTitle'), t('upgrade.paymentErrorDesc'))
    }
  }

  // 3. Polling checks for transfer completion status
  useEffect(() => {
    let interval: NodeJS.Timeout

    if (paymentData && modalVisible && !isPaid) {
      interval = setInterval(async () => {
        try {
          const res = await paymentApi.checkStatus(paymentData.transactionId)
          if (res.data.status === "COMPLETED") {
            setIsPaid(true)
            clearInterval(interval)
          }
        } catch (error) {
          console.error("Polling error status:", error)
        }
      }, 3000)
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [paymentData, modalVisible, isPaid])

  const copyToClipboard = (text: string) => {
    Clipboard.setString(text)
    Alert.alert(t('upgrade.copiedTitle'), t('upgrade.copiedDesc'))
  }

  return (
    <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
      <StatusBar barStyle="light-content" />
      <LinearGradient colors={["#0f172a", "#1e293b"]} style={StyleSheet.absoluteFillObject} />

      {/* HEADER BAR */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <ChevronLeft size={24} color="#f8fafc" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t('upgrade.title')}</Text>
        <View style={styles.headerRight}>
          <Sparkles size={18} color="#fbbf24" />
        </View>
      </View>

      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#3b82f6" />
          <Text style={styles.loadingText}>{t('upgrade.loadingText')}</Text>
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          
          <View style={styles.introCard}>
            <View style={styles.introHeader}>
              <Text style={styles.introLabel}>{t('upgrade.introLabel')}</Text>
              <Sparkles size={16} color="#fbbf24" />
            </View>
            <Text style={styles.introTitle}>{t('upgrade.introTitle')}</Text>
            <Text style={styles.introDesc}>{t('upgrade.introDesc')}</Text>
          </View>

          {/* Pricing Package Cards */}
          {packages.map((pkg) => {
            const isPopular = pkg.name.toLowerCase().includes("pro") || pkg.name.toLowerCase().includes("premium")
            return (
              <View key={pkg.id} style={[styles.packageCard, isPopular && styles.packageCardPopular]}>
                {isPopular && (
                  <View style={styles.popularBadge}>
                    <Text style={styles.popularBadgeText}>{t('upgrade.bestValue')}</Text>
                  </View>
                )}

                <Text style={styles.packageName}>{pkg.name}</Text>
                
                <View style={styles.priceRow}>
                  <Text style={styles.priceAmount}>{pkg.priceVnd?.toLocaleString() ?? "0"}</Text>
                  <Text style={styles.priceUnit}>VND</Text>
                </View>

                <View style={styles.divider} />

                <View style={styles.featuresList}>
                  <View style={styles.featureRow}>
                    <Check size={16} color="#10b981" />
                    <Text style={styles.featureText}>
                      <Text style={styles.featureHighlight}>{pkg.credits} </Text>
                      {t('upgrade.speakingCredits')}
                    </Text>
                  </View>

                  <View style={styles.featureRow}>
                    <Check size={16} color="#10b981" />
                    <Text style={styles.featureText}>{t('upgrade.pronunciationMetrics')}</Text>
                  </View>

                  <View style={styles.featureRow}>
                    <Check size={16} color="#10b981" />
                    <Text style={styles.featureText}>{t('upgrade.grammarCorrections')}</Text>
                  </View>

                  {pkg.bonusCredit > 0 && (
                    <View style={styles.featureRow}>
                      <Check size={16} color="#fbbf24" />
                      <Text style={[styles.featureText, { color: "#fbbf24" }]}>
                        {t('upgrade.bonusPractice', { bonus: pkg.bonusCredit })}
                      </Text>
                    </View>
                  )}
                </View>

                <TouchableOpacity
                  activeOpacity={0.9}
                  style={styles.chooseBtnWrap}
                  onPress={() => handleChoosePackage(pkg)}
                >
                  <LinearGradient
                    colors={isPopular ? ["#fbbf24", "#d97706"] : ["#3b82f6", "#2563eb"]}
                    style={styles.chooseBtn}
                  >
                    <Text style={styles.chooseBtnText}>{t('upgrade.unlockNow')}</Text>
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            )
          })}
        </ScrollView>
      )}

      {/* Payment Modal */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            
            {/* Modal Header */}
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {isPaid ? t('upgrade.paymentComplete') : t('upgrade.scanQrToPay')}
              </Text>
              {!isPaid && (
                <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.closeModalBtn}>
                  <X size={20} color="#cbd5e1" />
                </TouchableOpacity>
              )}
            </View>

            {paymentData && (
              <ScrollView contentContainerStyle={styles.modalBody} showsVerticalScrollIndicator={false}>
                {!isPaid ? (
                  <>
                    <Text style={styles.modalDesc}>{t('upgrade.autoTopUpInfo')}</Text>

                    {/* QR code displaying */}
                    <View style={styles.qrCard}>
                      <Image
                        source={{ uri: paymentData.qrImageUrl }}
                        style={styles.qrImage}
                        resizeMode="contain"
                      />
                    </View>

                    {/* Instructions parameters details */}
                    <View style={styles.transferDetails}>
                      
                      <View style={styles.detailItem}>
                        <Text style={styles.detailLabel}>{t('upgrade.amount')}</Text>
                        <View style={styles.detailValueRow}>
                          <Text style={[styles.detailValue, { color: "#fbbf24" }]}>
                            {paymentData.amountVnd?.toLocaleString() ?? "0"} VND
                          </Text>
                          <TouchableOpacity onPress={() => copyToClipboard(paymentData.amountVnd.toString())}>
                            <Copy size={14} color="#60a5fa" />
                          </TouchableOpacity>
                        </View>
                      </View>

                      <View style={styles.detailItem}>
                        <Text style={styles.detailLabel}>{t('upgrade.memo')}</Text>
                        <View style={styles.detailValueRow}>
                          <Text style={styles.detailValue} numberOfLines={2}>
                            {paymentData.transferMemo}
                          </Text>
                          <TouchableOpacity onPress={() => copyToClipboard(paymentData.transferMemo)}>
                            <Copy size={14} color="#60a5fa" />
                          </TouchableOpacity>
                        </View>
                      </View>

                      <View style={styles.detailItem}>
                        <Text style={styles.detailLabel}>{t('upgrade.beneficiaryBank')}</Text>
                        <Text style={styles.detailValueText}>{paymentData.bankName || "See QR Info"}</Text>
                      </View>

                      <View style={styles.detailItem}>
                        <Text style={styles.detailLabel}>{t('upgrade.accountNumber')}</Text>
                        <View style={styles.detailValueRow}>
                          <Text style={styles.detailValue}>{paymentData.accountNumber}</Text>
                          <TouchableOpacity onPress={() => copyToClipboard(paymentData.accountNumber)}>
                            <Copy size={14} color="#60a5fa" />
                          </TouchableOpacity>
                        </View>
                      </View>
                    </View>

                    {/* Spinner waiting status bar */}
                    <View style={styles.waitingContainer}>
                      <ActivityIndicator size="small" color="#3b82f6" />
                      <Text style={styles.waitingText}>{t('upgrade.waitingVerification')}</Text>
                    </View>
                  </>
                ) : (
                  <View style={styles.successContainer}>
                    <View style={styles.successIconBox}>
                      <CheckCircle size={64} color="#10b981" />
                    </View>
                    <Text style={styles.successTitle}>{t('upgrade.paymentSuccess')}</Text>
                    <Text style={styles.successDesc}>
                      {t('upgrade.successTopUpDesc', { credits: selectedPackage?.credits })}
                    </Text>

                    <TouchableOpacity
                      activeOpacity={0.8}
                      style={styles.profileBtn}
                      onPress={() => {
                        setModalVisible(false)
                        navigation.navigate("Main", { screen: "Profile" })
                      }}
                    >
                      <Text style={styles.profileBtnText}>{t('upgrade.viewProfile')}</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </ScrollView>
            )}
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  )
}
