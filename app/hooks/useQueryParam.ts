import { useCallback } from "react";
import useQueryParams from "./useQueryParams";

export default function useQueryParam<T>(param: string, defaultValue: T): [T, (value: T | undefined, replace?: boolean) => void] {
    const [queryParams, setQueryParams] = useQueryParams();

    const setQueryParam = useCallback((value: T | undefined, replace?: boolean) => {
        if (value === undefined) {
            queryParams.delete(param);
            if (queryParams.has(param)) {
                setQueryParams(queryParams, replace);
            }
        } else {
            const stringValue = JSON.stringify(value);
            if (stringValue !== queryParams.get(param)) {
                queryParams.set(param, stringValue);
                setQueryParams(queryParams, replace);
            }
        }
    }, [queryParams, param, setQueryParams]);

    const stringValue: string | null = queryParams.get(param);
    if (stringValue !== null) {
        return [JSON.parse(stringValue), setQueryParam];
    }

    return [defaultValue, setQueryParam];
}