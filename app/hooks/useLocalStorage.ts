import { useCallback, useEffect, useState } from "react";

const localStorage = typeof window === 'undefined' ? {
    getItem: (name: string) => null,
    setItem: (name: string, value: string) => undefined,
} : window.localStorage;

function getItem<T>(name: string, defaultValue: T) {
    const encodedValue = localStorage.getItem(name);
    if (encodedValue === null) {
        return defaultValue;
    } else {
        return JSON.parse(encodedValue);
    }
}

function setItem<T>(name: string, value: T) {
    localStorage.setItem(name, JSON.stringify(value));
}

export default function useLocalStorage<T>(name: string, defaultValue: T): [T, (value: T) => void] {
    const [value, setValue] = useState<T>(defaultValue);

    const _setValue = useCallback((newValue: T) => {
        setItem(name, newValue);
        setValue(newValue);
    }, [setValue]);

    useEffect(() => {
        addEventListener('onload', () => _setValue(getItem(name, defaultValue)));
    }, [value]);

    return [value, _setValue];
}