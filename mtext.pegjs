MTEXT
  = (BLOCK / FORMAT / STRING)*

BLOCK
  = '{' block:MTEXT '}' { return block }

STRING
  = s:CHARACTER+ { return s.join('') }

CHARACTER
  = ![\\|;^/#{}] c:. { return c }
  / '\\~' { return ' ' }
  / '\\P' { return '\n' }
  / '\\' ![a-zA-Z~] c:. { return c }

FORMAT
  // font
  = '\\f' f:STRING styles:FONT_STYLE* ';' { return Object.assign({ f }, ...styles) }
  // angle
  / '\\Q' Q:NUMBER ';' { return { Q } }
  // height
  / '\\H' H:NUMBER ';' { return { H } }
  // character width
  / '\\W' W:NUMBER ';' { return { W } }
  // stacking
  / '\\S' upper:STRING op:('^' / '/' / '#') lower:STRING ';' { return { S: [upper, op, lower] } }
  // alignment
  / '\\A' A:INTEGER ';' { return { A } }
  // color index
  / '\\C' C:INTEGER ';' { return { C } }
  // character spacing
  / '\\T' T:NUMBER ';' { return { T } }
  // underscore
  / '\\L' { return { L: 1 } }
  / '\\l' { return { L: 0 } }
  // overscore
  / '\\O' { return { O: 1 } }
  / '\\o' { return { O: 0 } }
  // strike through
  / '\\K' { return { K: 1 } }
  / '\\k' { return { K: 0 } }

FONT_STYLE
  // bold
  = '|b' b:INTEGER { return { b } }
  // italic
  / '|i' i:INTEGER { return { i } }
  // code page
  / '|c' c:INTEGER { return { c } }
  // pitch
  / '|p' p:INTEGER { return { p } }

INTEGER
  = n:$([0-9]+) { return +n }

NUMBER
  = n:$([0-9]+ ('.' [0-9]+)?) { return +n }

// todo:
// \pi \pxi \pxt    Control codes for bullets, numbered paragraphs, tab stops and columns - e.g. bullets: \pxi-3,l3,t3;, tab stops: \pxt10,t12;
// \X    Paragraph wrap on the dimension line (only in dimensions)
// \N    New column
