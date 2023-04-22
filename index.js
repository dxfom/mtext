// https://adndevblog.typepad.com/autocad/2017/09/dissecting-mtext-format-codes.html
// https://www.cadforum.cz/cadforum_en/text-formatting-codes-in-mtext-objects-tip8640
const dxfTextControlCodeSymbolMap = {
    d: '°',
    c: '⌀',
    p: '±',
};
export const parseDxfMTextContent = (s, options) => {
    s = s.replace(/%%(.)/g, (_, c) => dxfTextControlCodeSymbolMap[c] || c);
    const encoding = options?.encoding;
    let decoder = encoding instanceof TextDecoder ? encoding : undefined;
    let currentText = '';
    let c;
    const contents = [];
    const pushContent = (content) => {
        if (currentText) {
            contents.push(currentText);
            currentText = '';
        }
        contents.push(content);
    };
    for (let i = 0; i < s.length; i++) {
        switch (c = s[i]) {
            default:
                currentText += c;
                break;
            case '\\': {
                switch (c = s[++i]) {
                    default:
                        currentText += c;
                        break;
                    case 'P':
                        currentText += '\n';
                        break;
                    case 'f':
                    case 'F': {
                        let f = '';
                        while (c = s[++i]) {
                            if (c === ';') {
                                pushContent({ f });
                                break;
                            }
                            if (c === '|') {
                                const content = { f };
                                const end = s.indexOf(';', ++i);
                                for (const element of s.slice(i, end).split('|')) {
                                    content[element[0]] = +element.slice(1);
                                }
                                i = end;
                                pushContent(content);
                                break;
                            }
                            f += c === '\\' ? s[++i] : c;
                        }
                        break;
                    }
                    case 'S': {
                        let upper = '';
                        let op;
                        let lower = '';
                        while (c = s[++i]) {
                            if (c === ';') {
                                op && pushContent({ S: [upper, op, lower] });
                                break;
                            }
                            if (c === '\\') {
                                op ? lower += s[++i] : upper += s[++i];
                            }
                            else if (op) {
                                lower += c;
                            }
                            else if (c === '^' || c === '/' || c === '#') {
                                op = c;
                            }
                            else {
                                upper += c;
                            }
                        }
                        break;
                    }
                    case 'H':
                    case 'W':
                        const start = ++i;
                        const [, value, unit] = s.slice(start, i = s.indexOf(';', i)).match(/^(\d*(?:\.\d+)?)(\D*)$/);
                        pushContent({ [c]: [+value, unit] });
                        break;
                    case 'Q':
                    case 'A':
                    case 'C':
                    case 'T': {
                        const start = ++i;
                        pushContent({ [c]: +s.slice(start, i = s.indexOf(';', i)) });
                        break;
                    }
                    case 'L':
                    case 'O':
                    case 'K':
                        pushContent({ [c]: 1 });
                        break;
                    case 'l':
                    case 'o':
                    case 'k':
                        pushContent({ [c.toUpperCase()]: 0 });
                        break;
                    case 'U':
                    case 'u':
                        if (s[i + 1] === '+') {
                            currentText += String.fromCodePoint(parseInt(s.substr(i + 2, 4), 16));
                            i += 5;
                        }
                        else {
                            currentText += c;
                        }
                        break;
                    case 'M':
                    case 'm':
                        if (encoding) {
                            if (s[i + 1] === '+' && s[i + 2] === '1') {
                                currentText += (decoder = decoder || new TextDecoder(encoding)).decode(new Uint8Array([
                                    parseInt(s.substr(i + 3, 2), 16),
                                    parseInt(s.substr(i + 5, 2), 16),
                                ]));
                                i += 6;
                            }
                            else {
                                currentText += c;
                            }
                        }
                        else {
                            currentText += '\\' + c;
                        }
                        break;
                }
                break;
            }
            case '{': {
                let depth = 1;
                const start = i;
                while (c = s[++i]) {
                    if (c === '{') {
                        depth++;
                    }
                    else if (c === '}') {
                        if (--depth === 0) {
                            pushContent(parseDxfMTextContent(s.slice(start + 1, i)));
                            break;
                        }
                    }
                    else if (c === '\\') {
                        i++;
                    }
                }
                break;
            }
        }
    }
    currentText && contents.push(currentText);
    return contents;
};
