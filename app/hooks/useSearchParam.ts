import { useSearchParams, useRouter } from "next/navigation";
import { useCallback } from "react";

export default function useSearchParam<T>(param: string, defaultValue: T): [T, (value: T | undefined, replace?: boolean) => void] {
    const searchParams = useSearchParams();
    const router = useRouter();

    const setQueryParam = useCallback((value: T | undefined, replace?: boolean) => {
        const params = new URLSearchParams(searchParams);

        function navigate() {
            const url = `${location.pathname}?${params}`;
            if (replace) {
                router.replace(url)
            } else {
                router.push(url);
            }
        };

        if (value === undefined) {
            if (params.has(param)) {
                params.delete(param);
                navigate();
            }
        } else {
            const stringValue = JSON.stringify(value);
            if (stringValue !== params.get(param)) {
                params.set(param, stringValue);
                navigate();
            }
        }
    }, [searchParams, param, router]);

    const stringValue: string | null = searchParams.get(param);
    if (stringValue !== null) {
        return [JSON.parse(stringValue), setQueryParam];
    }

    return [defaultValue, setQueryParam];
}