export function moveElementInArray<T>(arr: T[], from: number, to: number): T[] {
    let nArr = [...arr];

    let temp = nArr[from];

    let i;
    for(i = from; i >= to; i--) {
        nArr[i] = arr[i - 1];
    }

    nArr[to] = temp;

    return nArr;
}