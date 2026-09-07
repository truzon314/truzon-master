import { useEffect, useState } from 'react';
import { useAppStore } from '@/store/appStore';
import NetInfo from '@react-native-community/netinfo';

export function useNetwork() {
  const { isOnline, setOnline } = useAppStore();

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      setOnline(state.isConnected ?? false);
    });

    return () => unsubscribe();
  }, [setOnline]);

  return isOnline;
}