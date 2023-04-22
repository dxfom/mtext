import { deepStrictEqual } from 'node:assert'
import { it } from 'node:test'
import { parseDxfMTextContent } from './index.js'

const r = String.raw
const t = (s, expect, options) => it(s, () => deepStrictEqual(parseDxfMTextContent(s, options), expect))

t(
    r`{}{\A0;{\H1.0x;}{\A2;\H0.71x;\C41;0.005}}`,
    [[], [{ A: 0 }, [{ H: [1, 'x'] }], [{ A: 2 }, { H: [0.71, 'x'] }, { C: 41 }, '0.005']]]
)

t(
    r`\U+5E451\u+3001\U+6DF12\M+1815C\m+18F5C`,
    [r`幅1、深2\M+1815C\m+18F5C`]
)
t(
    r`\U+5E451\u+3001\U+6DF12\M+1815C\m+18F5C`,
    ['幅1、深2―十'],
    { encoding: 'ms932' }
)
t(
    r`\U+5E451\u+3001\U+6DF12\M+1815C\m+18F5C`,
    ['幅1、深2―十'],
    { encoding: new TextDecoder('ms932') }
)
