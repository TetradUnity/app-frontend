export function countWordsInHtmlString(html: string): number {
    let words = html.replace(/<[^>]*>/g," ").replace(/\s+/g, ' ').trim().split(" ");
    if (words[0] == '') {
        return 0;
    }
    return words.length;
};

export function countCharactersInHTML(html: string): number {
    const textContent = html.replace(/<\/?[^>]+(>|$)/g, "");
    return textContent.length;
}