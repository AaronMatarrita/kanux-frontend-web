

const DEVICE_ID_KEY = 'kanux_device_id';

export const generateDeviceId = (): string => {
  const timestamp = Date.now();
  const randomString = Math.random().toString(36).substring(2, 15);
  const userAgent = typeof navigator !== 'undefined' ? navigator.userAgent : '';
  const combined = `${userAgent}-${timestamp}-${randomString}`;
  
  let hash = 0;
  for (let i = 0; i < combined.length; i++) {
    const char = combined.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash;
  }
  
  return `${Math.abs(hash).toString(16)}-${timestamp}`;
};


export const getDeviceId = (): string => {
  if (typeof window === 'undefined') {
    return generateDeviceId();
  }

  let deviceId = localStorage.getItem(DEVICE_ID_KEY);
  
  if (!deviceId) {
    deviceId = generateDeviceId();
    try {
      localStorage.setItem(DEVICE_ID_KEY, deviceId);
    } catch (error) {
      console.warn('Failed to store device ID in localStorage:', error);
    }
  }

  return deviceId;
};


export const clearDeviceId = (): void => {
  try {
    localStorage.removeItem(DEVICE_ID_KEY);
  } catch (error) {
    console.warn('Failed to clear device ID from localStorage:', error);
  }
};


export const resetDeviceId = (): string => {
  clearDeviceId();
  return getDeviceId();
};
