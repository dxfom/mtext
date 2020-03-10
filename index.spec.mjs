import { parseDxfMTextContent } from './index.mjs'
import { deepStrictEqual } from 'assert'
import baretest from 'baretest'

const test = baretest('parseDxfMTextContent')
const r = String.raw
const t = (s, expect) => test(s, () => deepStrictEqual(parseDxfMTextContent(s), expect))

t(
    r`{}{\A0;{\H1.0x;}{\A2;\H0.71x;\C41;0.005}}`,
    [[], [{ A: 0 }, [{ H: [1, 'x'] }], [{ A: 2 }, { H: [0.71, 'x'] }, { C: 41 }, '0.005']]]
)

test.run()
