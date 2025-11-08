import React, { createContext, useContext, useMemo, useRef, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';

type ToastContextValue = {
  show: (message: string, durationMs?: number) => void;
};

const ToastContext = createContext<ToastContextValue | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [message, setMessage] = useState<string | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const show = (msg: string, durationMs = 3000) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setMessage(msg);
    timeoutRef.current = setTimeout(() => {
      setMessage(null);
      timeoutRef.current = null;
    }, durationMs);
  };

  const value = useMemo(() => ({ show }), []);

  return (
    <ToastContext.Provider value={value}>
      {children}
      {message ? (
        <View pointerEvents="none" style={styles.container}>
          <View style={styles.toast}>
            <Text style={styles.text}>{message}</Text>
          </View>
        </View>
      ) : null}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  toast: {
    backgroundColor: 'rgba(0,0,0,0.85)',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 8,
    maxWidth: '90%',
  },
  text: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
});
