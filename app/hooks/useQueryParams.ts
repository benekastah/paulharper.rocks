import { useCallback, useEffect, useState } from "react";

type QueryParamsInput = string | string[][] | Record<string, string> | URLSearchParams | undefined;

export default function useQueryParams(): [URLSearchParams, (search: QueryParamsInput, replace?: boolean) => void] {
    const [queryParams, setQueryParams] = useState<string>(
        typeof location !== 'undefined' ? location.search : ''
    );

    useEffect(() => {
        function onPopState() {
            if (queryParams !== location.search) {
                setQueryParams(location.search);
            }
        }

        addEventListener('popstate', onPopState);
        
        return () => removeEventListener('popstate', onPopState);
    }, [queryParams]);

    const _setQueryParams = useCallback((search: QueryParamsInput, replace?: boolean) => {
        const searchString = '?' + new URLSearchParams(search).toString();
        if (replace) {
            history.replaceState(null, '', searchString);
        } else {
            history.pushState(null, '', searchString);
        }
        setQueryParams(searchString);
    }, [setQueryParams]);

    return [new URLSearchParams(queryParams), _setQueryParams];
};