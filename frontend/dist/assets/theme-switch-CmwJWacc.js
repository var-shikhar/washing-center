import{c as r,a as m,r as i,j as e,B as h,e as t}from"./index-DkidKY7D.js";import{D as d,a as u,b as k,e as n}from"./dropdown-menu-CKjr6Fii.js";/**
 * @license @tabler/icons-react v3.19.0 - MIT
 *
 * This source code is licensed under the MIT license.
 * See the LICENSE file in the root directory of this source tree.
 */var o=r("outline","check","IconCheck",[["path",{d:"M5 12l5 5l10 -10",key:"svg-0"}]]);/**
 * @license @tabler/icons-react v3.19.0 - MIT
 *
 * This source code is licensed under the MIT license.
 * See the LICENSE file in the root directory of this source tree.
 */var x=r("outline","moon","IconMoon",[["path",{d:"M12 3c.132 0 .263 0 .393 0a7.5 7.5 0 0 0 7.92 12.446a9 9 0 1 1 -8.313 -12.454z",key:"svg-0"}]]);/**
 * @license @tabler/icons-react v3.19.0 - MIT
 *
 * This source code is licensed under the MIT license.
 * See the LICENSE file in the root directory of this source tree.
 */var j=r("outline","sun","IconSun",[["path",{d:"M12 12m-4 0a4 4 0 1 0 8 0a4 4 0 1 0 -8 0",key:"svg-0"}],["path",{d:"M3 12h1m8 -9v1m8 8h1m-9 8v1m-6.4 -15.4l.7 .7m12.1 -.7l-.7 .7m0 11.4l.7 .7m-12.1 -.7l-.7 .7",key:"svg-1"}]]);function f(){const{theme:s,setTheme:a}=m();return i.useEffect(()=>{const c=s==="dark"?"#00959f":"#fff",l=document.querySelector("meta[name='theme-color']");l&&l.setAttribute("content",c)},[s]),e.jsxs(d,{children:[e.jsx(u,{asChild:!0,children:e.jsxs(h,{variant:"ghost",size:"icon",className:"scale-95 rounded-full",children:[e.jsx(j,{className:"size-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0"}),e.jsx(x,{className:"absolute size-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100"}),e.jsx("span",{className:"sr-only",children:"Toggle theme"})]})}),e.jsxs(k,{align:"end",className:"bg-white",children:[e.jsxs(n,{onClick:()=>a("light"),children:["Light"," ",e.jsx(o,{size:14,className:t("ml-auto",s!=="light"&&"hidden")})]}),e.jsxs(n,{onClick:()=>a("dark"),children:["Dark",e.jsx(o,{size:14,className:t("ml-auto",s!=="dark"&&"hidden")})]}),e.jsxs(n,{onClick:()=>a("system"),children:["System",e.jsx(o,{size:14,className:t("ml-auto",s!=="system"&&"hidden")})]})]})]})}export{f as T};
