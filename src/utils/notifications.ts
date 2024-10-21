import { messaging } from '../firebase';
import { getToken } from 'firebase/messaging';

export const requestNotificationPermission = async () => {
  try {
    if (messaging) {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        const token = await getToken(messaging, { vapidKey: 'BG-5ecr-0ijlBPXMotyutuDQ91HWB21fcOyVoOvzjIP5txCCVNBiysJdW9jINcSKloCuAifZCRX4zjOifmXIMZA' });
        console.log('FCM Token:', token);
        // Here you would typically send this token to your server
        return token;
      }
    }
  } catch (error) {
    console.error('An error occurred while requesting permission ', error);
  }
};

