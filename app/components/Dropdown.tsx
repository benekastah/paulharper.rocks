"use client";

import React, { CSSProperties, PropsWithChildren, ReactElement, useCallback, useEffect, useRef, useState } from "react";

import styles from './dropdown.module.css';
import { isEqual, once } from "lodash";

type Props = {
    target: ReactElement,
    open?: boolean,
    onToggle?: () => void,
} & PropsWithChildren;

export default function Dropdown({target, children, open, onToggle}: Props) {
    const [openState, setOpenState] = useState(open);
    const menuRef = useRef<HTMLDivElement | null>(null);

    const [menuStyle, setMenuStyle] = useState<CSSProperties>({});

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

    const isComputed = useRef(false)
    useEffect(function generateMenuStyles() {
        function setMenuStyleIfNeeded(nextMenuStyle: CSSProperties) {
            if (!isEqual(nextMenuStyle, menuStyle)) {
                setMenuStyle(nextMenuStyle);
            }
        }

        if (openState) {
            if (menuRef.current && !isComputed.current) {
                if (menuRef.current.getBoundingClientRect().right > screen.width) {
                    setMenuStyleIfNeeded({right: 0});
                } else {
                    setMenuStyleIfNeeded({left: 0});
                }
                isComputed.current = true;
            }
        } else {
            isComputed.current = false;
            setMenuStyleIfNeeded({opacity: 0});
        }
    });

    return <div className={styles.dropdown}>
        <button className={styles.target} onClick={_onToggle}>{target}</button>
        {openState ?
            <div ref={menuRef} className={styles.menu} style={menuStyle}>
                {children}
            </div> :
            null}
    </div>;
}