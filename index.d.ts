// https://adndevblog.typepad.com/autocad/2017/09/dissecting-mtext-format-codes.html
// https://www.cadforum.cz/cadforum_en/text-formatting-codes-in-mtext-objects-tip8640

export const parseDxfMTextContent: (s: string) => DxfMTextContentElement[]

export type DxfMTextContentElement =
  | DxfMTextContentElement[]
  | string
  | {
      /** font family */
      f: string
      /** bold */
      b?: 0 | 1
      /** italic */
      i?: 0 | 1
      /** code page */
      c?: number
      /** pitch */
      p?: number
    }
  | {
      /** angle in degrees */
      Q: number
    }
  | {
      /** character height */
      H: number
    }
  | {
      /** character width */
      W: number
    }
  | {
      /** stacking */
      S: [string, '^' | '/' | '#', string]
    }
  | {
      /** alignment (0: bottom, 1: center, 2: top) */
      A: 0 | 1 | 2
    }
  | {
      /** color index */
      C: number
    }
  | {
      /** character spacing */
      T: number
    }
  | {
      /** underscore */
      L: 0 | 1
    }
  | {
      /** overscore */
      O: 0 | 1
    }
  | {
      /** strike through */
      K: 0 | 1
    }
