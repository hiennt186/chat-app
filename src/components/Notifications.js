import { useEffect } from 'react';
import { getToken } from 'firebase/messaging';
import { messaging } from '../firebase';

function Notifications() {
  useEffect(() => {
    const requestPermission = async () => {
      try {
        const permission = await Notification.requestPermission();
        if (permission === 'granted') {
          const token = await getToken(messaging, { vapidKey: 'BG-5ecr-0ijlBPXMotyutuDQ91HWB21fcOyVoOvzjIP5txCCVNBiysJdW9jINcSKloCuAifZCRX4zjOifmXIMZA' });
          console.log('Notification permission granted. Token:', token);
          // Send this token to your server to associate it with the user
        } else {
          console.log('Notification permission denied');
        }
      } catch (error) {
        console.error('An error occurred while requesting permission ', error);
      }
    };

    requestPermission();
  }, []);

  return null;
}

export default Notifications;

