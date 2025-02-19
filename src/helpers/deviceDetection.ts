import Constants from 'expo-constants';
import { Platform } from 'react-native';
import axios from 'axios';


// const PHONE_IPS = [
//   'http://10.100.10.242:3000', // Primary laptop IP
//   'http://192.168.0.102:3000', // eisha local network IP
//   'http://192.168.1.10:3000',  // eisha Additional allowed IP
// ];
// export function isEmulator(): boolean {
//   if (Platform.OS !== 'android') return false;


//   const deviceName = Constants.deviceName ?? '';
//   const isEmulator = (
//     deviceName.toLowerCase().includes('google') ||
//     deviceName.toLowerCase().includes('sdk') ||
//     deviceName.toLowerCase().includes('emulator') ||
//     Constants.isDevice === false
//   );
//   return isEmulator;
// }

// export function getBaseUrl(): string {
//   const EMULATOR_IP = 'http://10.0.2.2:3000';
//   const PHYSICAL_DEVICE_IP = 'http://10.100.10.242:3000'; // Replace with your actual IP
//   return isEmulator() ? EMULATOR_IP : PHYSICAL_DEVICE_IP;
// }




const PHONE_IPS = [
  'http://10.100.10.242:3000', // Primary laptop IP
  'http://10.100.30.143:3000', // eisha local network IP
  'http://10.100.25.213:3000',  // eisha Additional allowed IP
];

export function isEmulator(): boolean {
  if (Platform.OS !== 'android') return false;

  const deviceName = Constants.deviceName ?? '';
  const isEmulator = (
    deviceName.toLowerCase().includes('google') ||
    deviceName.toLowerCase().includes('sdk') ||
    deviceName.toLowerCase().includes('emulator') ||
    Constants.isDevice === false
  );
  return isEmulator;
}

export function checkIpAvailability(ip: string): Promise<boolean> {
  console.log("in the check fucntion");
  return new Promise((resolve) => {
    fetch(ip, { method: 'HEAD' })
      .then(() => resolve(true))  // If IP responds, resolve true
      .catch(() => resolve(false));  // If IP does not respond, resolve false
  });
}

export async function getBaseUrl(): Promise<string> {
  const EMULATOR_IP = 'http://10.0.2.2:3000';
  let PHYSICAL_DEVICE_IP = PHONE_IPS[0];  // Default to the first IP

  if (!isEmulator()) {
    for (let ip of PHONE_IPS) {
      const isAvailable = await checkIpAvailability(ip);
      console.log("is available",isAvailable);
      console.log(ip);
      if (isAvailable) {
        console.log("in the is available check",ip)
        PHYSICAL_DEVICE_IP = ip;
        break;
      }
    }
  }
  console.log("before returning",PHYSICAL_DEVICE_IP);
  return isEmulator() ? EMULATOR_IP : PHYSICAL_DEVICE_IP;
}



