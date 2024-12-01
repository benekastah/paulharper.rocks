import { useEffect, useRef } from "react";

export default function useWakeLock(requestLock: boolean) {
    const wakeLockSentinel = useRef<WakeLockSentinel | null>(null);

    useEffect(() => {
        if (requestLock) {
            if (!wakeLockSentinel.current) {
                if (!navigator.wakeLock) return;
                navigator.wakeLock.request('screen').then((wls) => {
                    wakeLockSentinel.current = wls;
                }).catch((err) => {
                    console.error(`Unable to suspend wake lock: ${err.name}, ${err.message}`);
                });
            }
        } else {
            wakeLockSentinel.current?.release();
            wakeLockSentinel.current = null;
        }
    }, [requestLock]);
}