const C=(...a)=>(msg)=>(...c)=>a.map(m=>`\x1b[${m}m`).join('')+msg+(c.length>0&&c||[0]).map(m=>`\x1b[${m}m`).join('')
C.log=(...a)=>(msg)=>(...c)=>console.log(C(...a)(msg)(...c))
C.error=(...a)=>(msg)=>(...c)=>console.error(C(...a)(msg)(...c))
C.warn = (...a) => (msg) => (...c) => console.warn(C(...a)(msg)(...c))
export default C