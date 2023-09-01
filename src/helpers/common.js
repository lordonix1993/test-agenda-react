export const getCurrentWord = (range, fullText) => {
    let currentIndex = range.index;
    let startIndex = 0;
    let lengthWord = 0;
    let endIndex = fullText.length - 1;
    const regWord = /\w|[é]/;

    let i = currentIndex
    while(i >= 0) {
        if(fullText[i].match(regWord)) {
            startIndex = i
        } else {
            break
        }
        i--
    }

    let j = startIndex
    while(j <= endIndex) {
        if(fullText[j].match(regWord)) {
            lengthWord++
        } else {
            break
        }
        j++
    }

    if(lengthWord > 0) {
        return {index: startIndex, length: lengthWord}
    }

    return null
}

export const getListIdx = (substr, str) => {
    let listIdx = []
    let lastIndex = -1
    while ((lastIndex = str.indexOf(substr, lastIndex + 1)) !== -1) {
        if((!/^\d+$/i.test(str[lastIndex + substr.length]) && !/[a-zA-Z]/i.test(str[lastIndex + substr.length])) &&
            (!/^\d+$/i.test(str[lastIndex - 1]) && !/[a-zA-Z]/i.test(str[lastIndex -1]))) {
            listIdx.push({"index": lastIndex, "length": substr.length});
        }
    }
    return listIdx
}