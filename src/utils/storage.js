import AsyncStorage from '@react-native-async-storage/async-storage';

const SETTINGS_KEY = '@speakwise_user_settings';
const ONBOARDING_KEY = '@speakwise_onboarding_done';

/**
 * Default settings for new users
 */
export const DEFAULT_SETTINGS = {
  level: 'Intermediate',
  goal: 'Daily conversation',
  topics: ['Travel', 'Food'],
};

/**
 * Save user settings to local storage
 */
export async function saveSettings(settings) {
  try {
    await AsyncStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  } catch (error) {
    console.error('Failed to save settings:', error);
    throw error;
  }
}

/**
 * Load user settings from local storage
 * Returns null if no settings saved yet
 */
export async function loadSettings() {
  try {
    const value = await AsyncStorage.getItem(SETTINGS_KEY);
    return value ? JSON.parse(value) : null;
  } catch (error) {
    console.error('Failed to load settings:', error);
    return null;
  }
}

/**
 * Mark onboarding as complete
 */
export async function markOnboardingDone() {
  try {
    await AsyncStorage.setItem(ONBOARDING_KEY, 'true');
  } catch (error) {
    console.error('Failed to mark onboarding done:', error);
  }
}

/**
 * Check if user has completed onboarding
 */
export async function isOnboardingDone() {
  try {
    const value = await AsyncStorage.getItem(ONBOARDING_KEY);
    return value === 'true';
  } catch {
    return false;
  }
}

/**
 * Reset all app data (for testing or settings reset)
 */
export async function clearAllData() {
  try {
    await AsyncStorage.multiRemove([SETTINGS_KEY, ONBOARDING_KEY]);
  } catch (error) {
    console.error('Failed to clear data:', error);
  }
}
