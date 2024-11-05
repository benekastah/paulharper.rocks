export type DoublyLinkedList<T> = {id: number, item: T, head?: DoublyLinkedList<T>, tail?: DoublyLinkedList<T>};


let id = 0;
export function getId(): number {
    id += 1;
    return id;
}


export function create<T>(item: T): DoublyLinkedList<T> {
    return {item: item, id: getId()};
}


export function append<T>(list: DoublyLinkedList<T>, item: T): DoublyLinkedList<T> {
    let current = list;
    while (current.tail !== undefined) {
        current = current.tail;
    }
    current.tail = create(item);
    current.tail.head = current;
    return list;
};


export function prepend<T>(list: DoublyLinkedList<T>, item: T): DoublyLinkedList<T> {
    let current = list;
    while (current.head !== undefined) {
        current = current.head;
    }
    current.head = create(item);
    current.head.tail = current;
    return list;
}


export function breakTail<T>(list: DoublyLinkedList<T>): DoublyLinkedList<T> | undefined {
    const result = list.tail;
    list.tail = undefined;
    if (result) {
        result.head = undefined;
    }
    return result;
}


export function pop<T>(list: DoublyLinkedList<T>): T {
    let current = list;
    let prev = null;
    while (current.tail) {
        prev = current;
        current = current.tail;
    }
    if (prev !== null) {
        prev.tail = undefined;
        current.head = undefined;
    }
    return current.item;
}


export function concat<T>(list1: DoublyLinkedList<T>, list2: DoublyLinkedList<T>): DoublyLinkedList<T> {
    let current1 = list1;
    while (current1.tail !== undefined) {
        current1 = current1.tail;
    }
    let current2 = list2;
    while (current2.head !== undefined) {
        current2 = current2.head;
    }
    current1.tail = current2;
    current2.head = current1;
    return list1;
}


export function size<T>(list: DoublyLinkedList<T>) {
    let current: DoublyLinkedList<T> | undefined = list;
    let count = 0;
    while (current) {
        count += 1;
        current = current.tail;
    }
    return count;
}


export function getNth<T>(list: DoublyLinkedList<T>, index: number): DoublyLinkedList<T> | undefined {
    let current: DoublyLinkedList<T> | undefined = list;
    if (index > 0) {
        for (let i = 0; i < index; i++) {
            current = current?.tail;
        }
    } else {
        for (let i = 0; i > index; i--) {
            current = current?.head;
        }
    }
    return current;
}


export function getOrGenerateNth<T>(list: DoublyLinkedList<T>, index: number, itemGenerator: () => T): DoublyLinkedList<T> {
    let current: DoublyLinkedList<T> = list;
    if (index > 0) {
        for (let i = 0; i < index; i++) {
            if (current && !current.tail && itemGenerator) {
                append(current, itemGenerator());
            }
            if (!current.tail) throw new Error('unreacahble');
            current = current.tail;
        }
    } else {
        for (let i = 0; i > index; i--) {
            if (current && !current.head && itemGenerator) {
                prepend(current, itemGenerator());
            }
            if (!current.head) throw new Error('unreacahble');
            current = current.head;
        }
    }
    return current;
}