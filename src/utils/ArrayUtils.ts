export function moveElementInArray<T>(arr: T[], old_index: number, new_index: number) {
    let nArr = [...arr];

    new_index = ((new_index % nArr.length) + nArr.length) % nArr.length;
    nArr.splice(new_index, 0, nArr.splice(old_index, 1)[0]);

    return nArr;
}

export function moveElementLeftInArray<T>(arr: T[], old_index: number) {
    return moveElementInArray(arr, old_index, old_index - 1)
}

export function moveElementRightInArray<T>(arr: T[], old_index: number) {
    return moveElementInArray(arr, old_index, old_index + 1)
}