"use strict";(self.webpackChunkdocs=self.webpackChunkdocs||[]).push([[396],{2103:(e,t,n)=>{n.r(t),n.d(t,{assets:()=>a,contentTitle:()=>o,default:()=>h,frontMatter:()=>r,metadata:()=>d,toc:()=>l});var s=n(4848),i=n(8453);const r={title:"Layout Editor"},o="Layout Editor",d={id:"Usage/layout_editor",title:"Layout Editor",description:"ec-demo-image",source:"@site/docs/Usage/layout_editor.md",sourceDirName:"Usage",slug:"/Usage/layout_editor",permalink:"/EmbeddedChat/pulls/pr-810/docs/docs/Usage/layout_editor",draft:!1,unlisted:!1,tags:[],version:"current",frontMatter:{title:"Layout Editor"},sidebar:"tutorialSidebar",previous:{title:"Installation",permalink:"/EmbeddedChat/pulls/pr-810/docs/docs/Usage/embeddedchat_setup"},next:{title:"Theming Guide",permalink:"/EmbeddedChat/pulls/pr-810/docs/docs/Usage/theming"}},a={},l=[{value:"Try It Out \ud83d\ude80",id:"try-it-out-",level:3},{value:"Theme Lab",id:"theme-lab",level:3},{value:"Integration",id:"integration",level:3},{value:"Development",id:"development",level:3},{value:"Additional Resources",id:"additional-resources",level:3}];function c(e){const t={a:"a",code:"code",h1:"h1",h3:"h3",header:"header",img:"img",li:"li",p:"p",pre:"pre",strong:"strong",ul:"ul",...(0,i.R)(),...e.components};return(0,s.jsxs)(s.Fragment,{children:[(0,s.jsx)(t.header,{children:(0,s.jsx)(t.h1,{id:"layout-editor",children:"Layout Editor"})}),"\n",(0,s.jsx)(t.p,{children:(0,s.jsx)(t.img,{src:"https://github.com/RocketChat/EmbeddedChat/assets/78961432/b85c7b8a-65e2-4a90-a843-f4072c942ac0",alt:"ec-demo-image"})}),"\n",(0,s.jsx)(t.p,{children:(0,s.jsx)(t.img,{src:"https://github.com/user-attachments/assets/a42a66af-d8c0-4d3a-aa1a-71f91b07310e",alt:"image"})}),"\n",(0,s.jsx)(t.p,{children:"We offer a layout editor that lets you customize the design and appearance of the EmbeddedChat component in real time. Features include:"}),"\n",(0,s.jsxs)(t.ul,{children:["\n",(0,s.jsxs)(t.li,{children:[(0,s.jsx)(t.strong,{children:"ChatHeader Options"}),": Add, remove, or reorder various options."]}),"\n",(0,s.jsxs)(t.li,{children:[(0,s.jsx)(t.strong,{children:"MessageToolbox Options"}),": Tailor toolbox settings."]}),"\n",(0,s.jsxs)(t.li,{children:[(0,s.jsx)(t.strong,{children:"ChatInputFormatting Toolbar Options"}),": Adjust input toolbar settings."]}),"\n",(0,s.jsxs)(t.li,{children:[(0,s.jsx)(t.strong,{children:"Drag-and-Drop"}),": Easily switch and reorder menu and surface items."]}),"\n",(0,s.jsxs)(t.li,{children:[(0,s.jsx)(t.strong,{children:"Resizable Sidebar"}),": Adjust the sidebar by dragging."]}),"\n",(0,s.jsxs)(t.li,{children:[(0,s.jsx)(t.strong,{children:"Theme Lab"}),": Customize layout and theme settings, including palette colors and typography."]}),"\n"]}),"\n",(0,s.jsx)(t.h3,{id:"try-it-out-",children:"Try It Out \ud83d\ude80"}),"\n",(0,s.jsxs)(t.p,{children:["Explore the Layout Editor to style and customize EmbeddedChat to your needs. Generate a theme object and pass it to EmbeddedChat via props. Start customizing here: ",(0,s.jsx)(t.a,{href:"https://rocketchat.github.io/EmbeddedChat/layout_editor/",children:"Layout Editor"})]}),"\n",(0,s.jsx)(t.h3,{id:"theme-lab",children:"Theme Lab"}),"\n",(0,s.jsx)(t.p,{children:"In the Theme Lab, you can:"}),"\n",(0,s.jsxs)(t.ul,{children:["\n",(0,s.jsxs)(t.li,{children:[(0,s.jsx)(t.strong,{children:"Customize Palette Colors"}),": Adjust colors for both light and dark modes."]}),"\n",(0,s.jsxs)(t.li,{children:[(0,s.jsx)(t.strong,{children:"Font Settings"}),": Modify font-related settings."]}),"\n",(0,s.jsxs)(t.li,{children:[(0,s.jsx)(t.strong,{children:"Layout Customization"}),": Change layout variants and display names, and restore deleted options."]}),"\n"]}),"\n",(0,s.jsx)(t.p,{children:'Once satisfied with your changes, click the "Generate Theme" button to create a theme object.'}),"\n",(0,s.jsx)(t.p,{children:(0,s.jsx)(t.img,{src:"https://github.com/user-attachments/assets/88ab51b6-aac6-41cc-b911-38378ed61e12",alt:"image"})}),"\n",(0,s.jsx)(t.h3,{id:"integration",children:"Integration"}),"\n",(0,s.jsx)(t.p,{children:"To apply your custom theme:"}),"\n",(0,s.jsx)(t.pre,{children:(0,s.jsx)(t.code,{className:"language-jsx",children:"<EmbeddedChat\n  // ...other props\n  theme={myCustomTheme}\n/>\n"})}),"\n",(0,s.jsxs)(t.p,{children:["Alternatively, you can paste the theme object into the Theme settings of the EmbeddedChat RC App. Note: These settings will only take effect if the ",(0,s.jsx)(t.code,{children:"remoteOpt"})," prop is set to ",(0,s.jsx)(t.code,{children:"true"})," when configuring EmbeddedChat."]}),"\n",(0,s.jsx)(t.h3,{id:"development",children:"Development"}),"\n",(0,s.jsxs)(t.p,{children:["Clone the repo, navigate to ",(0,s.jsx)(t.code,{children:"packages/layout_editor"}),", then run:"]}),"\n",(0,s.jsx)(t.pre,{children:(0,s.jsx)(t.code,{className:"language-bash",children:"yarn dev   # Start server\nyarn build # Build for production\nyarn preview # Preview build\n"})}),"\n",(0,s.jsx)(t.h3,{id:"additional-resources",children:"Additional Resources"}),"\n",(0,s.jsxs)(t.ul,{children:["\n",(0,s.jsxs)(t.li,{children:["For installation instructions of the EmbeddedChat RC App, visit ",(0,s.jsx)(t.a,{href:"/EmbeddedChat/pulls/pr-810/docs/docs/Usage/ec_rc_setup",children:"this guide"}),"."]}),"\n",(0,s.jsxs)(t.li,{children:["For detailed prop usage, refer to ",(0,s.jsx)(t.a,{href:"/EmbeddedChat/pulls/pr-810/docs/docs/Usage/embeddedchat_setup",children:"this guide"}),"."]}),"\n"]})]})}function h(e={}){const{wrapper:t}={...(0,i.R)(),...e.components};return t?(0,s.jsx)(t,{...e,children:(0,s.jsx)(c,{...e})}):c(e)}},8453:(e,t,n)=>{n.d(t,{R:()=>o,x:()=>d});var s=n(6540);const i={},r=s.createContext(i);function o(e){const t=s.useContext(r);return s.useMemo((function(){return"function"==typeof e?e(t):{...t,...e}}),[t,e])}function d(e){let t;return t=e.disableParentContext?"function"==typeof e.components?e.components(i):e.components||i:o(e.components),s.createElement(r.Provider,{value:t},e.children)}}}]);