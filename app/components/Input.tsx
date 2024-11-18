import { MutableRefObject, useEffect, useRef } from "react";

type Props = {
    noSelectOnFocus?: boolean
} & React.InputHTMLAttributes<HTMLInputElement>;

export default function Input({noSelectOnFocus, ...inputProps}: Props) {
    const inputRef: MutableRefObject<HTMLInputElement | null> = useRef(null);

    useEffect(() => {
        if (!inputRef.current) return;
        const el = inputRef.current;

        function onFocus() {
            if (!noSelectOnFocus) {
                el.select();
            }
        }

        el.addEventListener('focus', onFocus);

        return () => el.removeEventListener('focus', onFocus);
    }, [noSelectOnFocus]);

    return <input ref={inputRef} {...inputProps} />;
}