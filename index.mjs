const e={d:"°",c:"⌀",p:"±"}
export const parseDxfMTextContent=s=>{s=s.replace(/%%(.)/g,((s,a)=>e[a]||a))
let a,c=""
const t=[],r=e=>{c&&(t.push(c),c=""),t.push(e)}
for(let e=0;e<s.length;e++)switch(a=s[e]){default:c+=a
break
case"\\":switch(a=s[++e]){default:c+=a
break
case"P":c+="\n"
break
case"f":case"F":{let c=""
for(;a=s[++e];){if(";"===a){r({f:c})
break}if("|"===a){const a={f:c},t=s.indexOf(";",++e)
for(const c of s.slice(e,t).split("|"))a[c[0]]=+c.slice(1)
e=t,r(a)
break}c+="\\"===a?s[++e]:a}break}case"S":{let c,t="",f=""
for(;a=s[++e];){if(";"===a){c&&r({S:[t,c,f]})
break}"\\"===a?c?f+=s[++e]:t+=s[++e]:c?f+=a:"^"===a||"/"===a||"#"===a?c=a:t+=a}break}case"H":case"W":const t=++e,[,f,o]=s.slice(t,e=s.indexOf(";",e)).match(/^(\d*(?:\.\d+)?)(\D*)$/)
r({[a]:[+f,o]})
break
case"Q":case"A":case"C":case"T":{const c=++e
r({[a]:+s.slice(c,e=s.indexOf(";",e))})
break}case"L":case"O":case"K":r({[a]:1})
break
case"l":case"o":case"k":r({[a.toUpperCase()]:0})
break
case"U":"+"===s[e+1]?(c+=String.fromCodePoint(parseInt(s.substr(e+2,4),16)),e+=5):c+="U"}break
case"{":{let c=1
const t=e
for(;a=s[++e];)if("{"===a)c++
else if("}"===a){if(0==--c){r(parseDxfMTextContent(s.slice(t+1,e)))
break}}else"\\"===a&&e++
break}}return c&&t.push(c),t}
