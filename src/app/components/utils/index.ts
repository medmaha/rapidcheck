//

export function generateID(length: number = 12): string {
    let result = '';

    let CHAR_A = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let CHAR_B = CHAR_A.toLowerCase();
    let CHAR_C = '0123456789';

    const characters = CHAR_A + CHAR_C + CHAR_B;

    function shuffleArray(array: string[]) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    let data = shuffleArray(characters.split(' ')).join('');
    for (let i = 0; i < length; i++) {
        result += data.charAt(Math.floor(Math.random() * data.length));
    }
    return result;
}
