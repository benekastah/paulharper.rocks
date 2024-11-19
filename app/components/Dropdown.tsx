"use client";

import { PropsWithChildren, ReactElement, ReactEventHandler, useCallback, useEffect, useRef, useState } from "react";

import styles from './dropdown.module.css';
import { once } from "lodash";

type Props = {
    target: ReactElement,
    open?: boolean,
    onToggle?: () => void,
} & PropsWithChildren;

export default function Dropdown({target, children, open, onToggle}: Props) {
    const [openState, setOpenState] = useState(open);
    const dropdownRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        if (open !== undefined && openState !== open) {
            setOpenState(open);
        }
    }, [open, openState, setOpenState]);

    const _onToggle = useCallback(() => {
        if (open === undefined) {
            setOpenState(!openState);
        } else {
            if (onToggle) onToggle();
        }
    }, [open, openState, setOpenState, onToggle]);

    useEffect(() => {
        const onClick = once(_onToggle);
        if (openState) {
            document.addEventListener('click', onClick);
        }
        () => document.removeEventListener('click', onClick);
    }, [openState, _onToggle]);

    return <div ref={dropdownRef} className={styles.dropdown}>
        <button className={styles.target} onClick={_onToggle}>{target}</button>
        {openState ?
            <div className={styles.menu}>
                {children}
            </div> :
            null}
    </div>;
}