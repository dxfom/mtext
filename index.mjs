// https://adndevblog.typepad.com/autocad/2017/09/dissecting-mtext-format-codes.html
// https://www.cadforum.cz/cadforum_en/text-formatting-codes-in-mtext-objects-tip8640
export const parseDxfMTextContent = (s) => {
    const contents = [];
    let currentText = '';
    const pushContent = (content) => {
        if (currentText) {
            contents.push(currentText);
            currentText = '';
        }
        contents.push(content);
    };
    let c;
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
                    case 'f': {
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
                    case 'Q':
                    case 'H':
                    case 'W':
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
                }
                break;
            }
            case '{': {
                const start = ++i;
                while (c = s[i]) {
                    if (c === '}') {
                        pushContent(parseDxfMTextContent(s.slice(start, i)));
                        break;
                    }
                    c === '\\' && i++;
                    i++;
                }
                break;
            }
        }
    }
    currentText && contents.push(currentText);
    return contents;
};
