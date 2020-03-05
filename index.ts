// https://adndevblog.typepad.com/autocad/2017/09/dissecting-mtext-format-codes.html
// https://www.cadforum.cz/cadforum_en/text-formatting-codes-in-mtext-objects-tip8640

export type DxfMTextContentElement =
  | DxfMTextContentElement[]
  | string
  | {
      /** font family */
      f?: string
      /** bold */
      b?: 0 | 1
      /** italic */
      i?: 0 | 1
      /** code page */
      c?: number
      /** pitch */
      p?: number

      /** angle in degrees */
      Q?: number

      /** character height */
      H?: number

      /** character width */
      W?: number

      /** stacking */
      S?: [string, '^' | '/' | '#', string]

      /** alignment (0: bottom, 1: center, 2: top) */
      A?: 0 | 1 | 2

      /** color index */
      C?: number

      /** character spacing */
      T?: number

      /** underscore */
      L?: 0 | 1
      /** overscore */
      O?: 0 | 1
      /** strike through */
      K?: 0 | 1
    }

export const parseDxfMTextContent = (s: string): DxfMTextContentElement[] => {
  const contents: DxfMTextContentElement[] = []
  let currentText = ''
  const pushContent = (content: DxfMTextContentElement) => {
    if (currentText) {
      contents.push(currentText)
      currentText = ''
    }
    contents.push(content)
  }
  let c
  for (let i = 0; i < s.length; i++) {
    switch (c = s[i]) {
      default:
        currentText += c
        break
      case '\\': {
        switch (c = s[++i]) {
          default:
            currentText += c
            break
          case 'f':
          case 'F': {
            let f = ''
            while (c = s[++i]) {
              if (c === ';') {
                pushContent({ f })
                break
              }
              if (c === '|') {
                const content: DxfMTextContentElement = { f }
                const end = s.indexOf(';', ++i)
                for (const element of s.slice(i, end).split('|')) {
                  content[element[0] as 'b' | 'i' | 'c' | 'p'] = +element.slice(1) as 0
                }
                i = end
                pushContent(content)
                break
              }
              f += c === '\\' ? s[++i] : c
            }
            break
          }
          case 'S': {
            let upper = ''
            let op: '^' | '/' | '#' | undefined
            let lower = ''
            while (c = s[++i]) {
              if (c === ';') {
                op && pushContent({ S: [upper, op, lower] })
                break
              }
              if (c === '\\') {
                op ? lower += s[++i] : upper += s[++i]
              } else if (op) {
                lower += c
              } else if (c === '^' || c === '/' || c === '#') {
                op = c
              } else {
                upper += c
              }
            }
            break
          }
          case 'Q':
          case 'H':
          case 'W':
          case 'A':
          case 'C':
          case 'T': {
            const start = ++i
            pushContent({ [c]: +s.slice(start, i = s.indexOf(';', i)) })
            break
          }
          case 'L':
          case 'O':
          case 'K':
            pushContent({ [c]: 1 })
            break
          case 'l':
          case 'o':
          case 'k':
            pushContent({ [c.toUpperCase()]: 0 })
            break
        }
        break
      }
      case '{': {
        const start = ++i
        while (c = s[i]) {
          if (c === '}') {
            pushContent(parseDxfMTextContent(s.slice(start, i)))
            break
          }
          c === '\\' && i++
          i++
        }
        break
      }
    }
  }
  currentText && contents.push(currentText)
  return contents
}
