const e={d:"°",c:"⌀",p:"±"}
export const parseDxfMTextContent=(s,a)=>{s=s.replace(/%%(.)/g,((s,a)=>e[a]||a))
const c=a?.encoding
let t,r=c instanceof TextDecoder?c:void 0,n=""
const o=[],f=e=>{n&&(o.push(n),n=""),o.push(e)}
for(let e=0;e<s.length;e++)switch(t=s[e]){default:n+=t
break
case"\\":switch(t=s[++e]){default:n+=t
break
case"P":n+="\n"
break
case"f":case"F":{let a=""
for(;t=s[++e];){if(";"===t){f({f:a})
break}if("|"===t){const c={f:a},t=s.indexOf(";",++e)
for(const a of s.slice(e,t).split("|"))c[a[0]]=+a.slice(1)
e=t,f(c)
break}a+="\\"===t?s[++e]:t}break}case"S":{let a,c="",r=""
for(;t=s[++e];){if(";"===t){a&&f({S:[c,a,r]})
break}"\\"===t?a?r+=s[++e]:c+=s[++e]:a?r+=t:"^"===t||"/"===t||"#"===t?a=t:c+=t}break}case"H":case"W":const a=++e,[,o,i]=s.slice(a,e=s.indexOf(";",e)).match(/^(\d*(?:\.\d+)?)(\D*)$/)
f({[t]:[+o,i]})
break
case"Q":case"A":case"C":case"T":{const a=++e
f({[t]:+s.slice(a,e=s.indexOf(";",e))})
break}case"L":case"O":case"K":f({[t]:1})
break
case"l":case"o":case"k":f({[t.toUpperCase()]:0})
break
case"U":case"u":"+"===s[e+1]?(n+=String.fromCodePoint(parseInt(s.substr(e+2,4),16)),e+=5):n+=t
break
case"M":case"m":c?"+"===s[e+1]&&"1"===s[e+2]?(n+=(r=r||new TextDecoder(c)).decode(new Uint8Array([parseInt(s.substr(e+3,2),16),parseInt(s.substr(e+5,2),16)])),e+=6):n+=t:n+="\\"+t}break
case"{":{let a=1
const c=e
for(;t=s[++e];)if("{"===t)a++
else if("}"===t){if(0==--a){f(parseDxfMTextContent(s.slice(c+1,e)))
break}}else"\\"===t&&e++
break}}return n&&o.push(n),o}
