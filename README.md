# DXF Object Model / MTEXT

A low level DXF MTEXT content parser.

## Installation

```bash
$ npm i @dxfom/mtext
```

## Usage

```javascript
import { parseDxfMTextContent } from '@dxfom/mtext'

const content = parseDxfMTextContent(
  String.raw`\A1;\fAIGDT|b0|i0;\H2.5000;\ln\fArial|b0|i0;\H2.5000;68{\H1.3;\S+0,8^+0,1;}`
)
console.log(JSON.stringify(content, undefined, 4))
```

outputs:

```json
[
   {
      "A": 1
   },
   {
      "f": "AIGDT",
      "b": 0,
      "i": 0
   },
   {
      "H": 2.5
   },
   {
      "L": 0
   },
   "n",
   {
      "f": "Arial",
      "b": 0,
      "i": 0
   },
   {
      "H": 2.5
   },
   "68",
   [
      {
         "H": 1.3
      },
      {
         "S": [
            "+0,8",
            "^",
            "+0,1"
         ]
      }
   ]
]
```

## License

GPL 3.0
