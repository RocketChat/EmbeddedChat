"use strict";(self.webpackChunk_embeddedchat_ui_elements=self.webpackChunk_embeddedchat_ui_elements||[]).push([[473],{"./src/components/Heading/Heading.stories.js":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.r(__webpack_exports__),__webpack_require__.d(__webpack_exports__,{Level1:()=>Level1,Level2:()=>Level2,Level3:()=>Level3,Level4:()=>Level4,Level5:()=>Level5,Level6:()=>Level6,__namedExportsOrder:()=>__namedExportsOrder,default:()=>__WEBPACK_DEFAULT_EXPORT__});__webpack_require__("../../node_modules/react/index.js");var _context_ThemeContextProvider__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__("./src/context/ThemeContextProvider.js"),_theme_DefaultTheme__WEBPACK_IMPORTED_MODULE_2__=__webpack_require__("./src/theme/DefaultTheme.js"),_Heading__WEBPACK_IMPORTED_MODULE_3__=__webpack_require__("./src/components/Heading/Heading.js"),_emotion_react__WEBPACK_IMPORTED_MODULE_4__=__webpack_require__("../../node_modules/@emotion/react/dist/emotion-react.browser.esm.js");const __WEBPACK_DEFAULT_EXPORT__={title:"Components/Heading",component:_Heading__WEBPACK_IMPORTED_MODULE_3__.Z},Template=args=>(0,_emotion_react__WEBPACK_IMPORTED_MODULE_4__.tZ)(_context_ThemeContextProvider__WEBPACK_IMPORTED_MODULE_1__.f,{theme:_theme_DefaultTheme__WEBPACK_IMPORTED_MODULE_2__.Z},(0,_emotion_react__WEBPACK_IMPORTED_MODULE_4__.tZ)(_Heading__WEBPACK_IMPORTED_MODULE_3__.Z,args));Template.displayName="Template";const Level1=Template.bind({});Level1.args={level:1,children:"Heading Level 1"};const Level2=Template.bind({});Level2.args={level:2,children:"Heading Level 2"};const Level3=Template.bind({});Level3.args={level:3,children:"Heading Level 3"};const Level4=Template.bind({});Level4.args={level:4,children:"Heading Level 4"};const Level5=Template.bind({});Level5.args={level:5,children:"Heading Level 5"};const Level6=Template.bind({});Level6.args={level:6,children:"Heading Level 6"},Level1.parameters={...Level1.parameters,docs:{...Level1.parameters?.docs,source:{originalSource:"args => <ThemeProvider theme={DefaultTheme}>\n    <Heading {...args} />\n  </ThemeProvider>",...Level1.parameters?.docs?.source}}},Level2.parameters={...Level2.parameters,docs:{...Level2.parameters?.docs,source:{originalSource:"args => <ThemeProvider theme={DefaultTheme}>\n    <Heading {...args} />\n  </ThemeProvider>",...Level2.parameters?.docs?.source}}},Level3.parameters={...Level3.parameters,docs:{...Level3.parameters?.docs,source:{originalSource:"args => <ThemeProvider theme={DefaultTheme}>\n    <Heading {...args} />\n  </ThemeProvider>",...Level3.parameters?.docs?.source}}},Level4.parameters={...Level4.parameters,docs:{...Level4.parameters?.docs,source:{originalSource:"args => <ThemeProvider theme={DefaultTheme}>\n    <Heading {...args} />\n  </ThemeProvider>",...Level4.parameters?.docs?.source}}},Level5.parameters={...Level5.parameters,docs:{...Level5.parameters?.docs,source:{originalSource:"args => <ThemeProvider theme={DefaultTheme}>\n    <Heading {...args} />\n  </ThemeProvider>",...Level5.parameters?.docs?.source}}},Level6.parameters={...Level6.parameters,docs:{...Level6.parameters?.docs,source:{originalSource:"args => <ThemeProvider theme={DefaultTheme}>\n    <Heading {...args} />\n  </ThemeProvider>",...Level6.parameters?.docs?.source}}};const __namedExportsOrder=["Level1","Level2","Level3","Level4","Level5","Level6"]},"./src/components/Heading/Heading.js":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{Z:()=>__WEBPACK_DEFAULT_EXPORT__});__webpack_require__("../../node_modules/react/index.js");var _emotion_react__WEBPACK_IMPORTED_MODULE_2__=__webpack_require__("../../node_modules/@emotion/react/dist/emotion-react.browser.esm.js"),_hooks__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__("./src/hooks/index.js");function _extends(){return _extends=Object.assign?Object.assign.bind():function(target){for(var i=1;i<arguments.length;i++){var source=arguments[i];for(var key in source)Object.prototype.hasOwnProperty.call(source,key)&&(target[key]=source[key])}return target},_extends.apply(this,arguments)}const Heading=({level=1,children,...props})=>{const Tag=`h${level}`,{theme}=(0,_hooks__WEBPACK_IMPORTED_MODULE_1__.Fg)(),style={...{h1:{fontSize:"2rem",fontWeight:800,lineHeight:1.5},h2:{fontSize:"1.5rem",fontWeight:800,lineHeight:1.4},h3:{fontSize:"1.3rem",fontWeight:400,lineHeight:1.3},h4:{fontSize:"1rem",fontWeight:400,lineHeight:1.2},h5:{fontSize:"0.83rem",fontWeight:400,lineHeight:1.1},h6:{fontSize:"0.67rem",fontWeight:500,lineHeight:1}}[Tag],...theme.typography?.[Tag]||{}};return(0,_emotion_react__WEBPACK_IMPORTED_MODULE_2__.tZ)(Tag,_extends({css:(0,_emotion_react__WEBPACK_IMPORTED_MODULE_2__.iv)("font-size:",style.fontSize,";font-weight:",style.fontWeight,";line-height:",style.lineHeight,";","")},props),children)};Heading.displayName="Heading",Heading.__docgenInfo={description:"",methods:[],displayName:"Heading",props:{level:{defaultValue:{value:"1",computed:!1},required:!1}}};const __WEBPACK_DEFAULT_EXPORT__=Heading},"./src/context/ThemeContextProvider.js":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{N:()=>ThemeContext,f:()=>ThemeProvider});var react__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("../../node_modules/react/index.js"),_theme_DefaultTheme__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__("./src/theme/DefaultTheme.js"),_emotion_react__WEBPACK_IMPORTED_MODULE_2__=__webpack_require__("../../node_modules/@emotion/react/dist/emotion-react.browser.esm.js");const ThemeContext=(0,react__WEBPACK_IMPORTED_MODULE_0__.createContext)(),ThemeProvider=({children,theme:initialTheme,mode:initialMode})=>{const defaultTheme=initialTheme||_theme_DefaultTheme__WEBPACK_IMPORTED_MODULE_1__.Z,[mode,setMode]=(0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(initialMode||"light"),[theme,setTheme]=(0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(defaultTheme),colors=theme.schemes?.[mode],invertedColors=theme.schemes?.[(mode=>"light"===mode?"dark":"light")(mode)];(0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)((()=>{initialTheme&&setTheme(initialTheme)}),[initialTheme]),(0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)((()=>{initialMode&&setMode(initialMode)}),[initialMode]);const value=(0,react__WEBPACK_IMPORTED_MODULE_0__.useMemo)((()=>({theme,mode,colors,invertedColors,setMode,setTheme})),[theme,mode,colors,invertedColors]);return(0,_emotion_react__WEBPACK_IMPORTED_MODULE_2__.tZ)(ThemeContext.Provider,{value},children)};ThemeProvider.displayName="ThemeProvider",ThemeProvider.__docgenInfo={description:"",methods:[],displayName:"ThemeProvider"}},"./src/context/ToastContext.js":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{Z:()=>__WEBPACK_DEFAULT_EXPORT__});const __WEBPACK_DEFAULT_EXPORT__=(0,__webpack_require__("../../node_modules/react/index.js").createContext)()},"./src/hooks/index.js":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{Fg:()=>_useTheme__WEBPACK_IMPORTED_MODULE_1__.Z,uY:()=>_useComponentOverrides__WEBPACK_IMPORTED_MODULE_0__.Z});var _useComponentOverrides__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./src/hooks/useComponentOverrides.js"),_useTheme__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__("./src/hooks/useTheme.js");__webpack_require__("./src/hooks/useToastBarDispatch.js")},"./src/hooks/useComponentOverrides.js":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{Z:()=>__WEBPACK_DEFAULT_EXPORT__});var react__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("../../node_modules/react/index.js"),_useTheme__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__("./src/hooks/useTheme.js");const __WEBPACK_DEFAULT_EXPORT__=(component,className="",style={})=>{const{theme}=(0,_useTheme__WEBPACK_IMPORTED_MODULE_1__.Z)(),classNames=(0,react__WEBPACK_IMPORTED_MODULE_0__.useMemo)((()=>`${Array.isArray(className)?className.join(" "):className} ${theme?.components?.[component]?.classNames||""}`),[className,component,theme?.components]);return{styleOverrides:(0,react__WEBPACK_IMPORTED_MODULE_0__.useMemo)((()=>({...style,...theme?.components&&theme?.components[component]?.styleOverrides||{}})),[component,style,theme?.components]),classNames,configOverrides:(0,react__WEBPACK_IMPORTED_MODULE_0__.useMemo)((()=>({...theme?.components&&theme?.components[component]?.configOverrides||{}})),[component,theme?.components]),variantOverrides:(0,react__WEBPACK_IMPORTED_MODULE_0__.useMemo)((()=>theme?.variants&&theme?.variants[component]||""),[component,theme?.variants])}}},"./src/hooks/useTheme.js":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{Z:()=>__WEBPACK_DEFAULT_EXPORT__});var react__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("../../node_modules/react/index.js"),_context_ThemeContextProvider__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__("./src/context/ThemeContextProvider.js"),_theme_DefaultTheme__WEBPACK_IMPORTED_MODULE_2__=__webpack_require__("./src/theme/DefaultTheme.js");const __WEBPACK_DEFAULT_EXPORT__=()=>{const context=(0,react__WEBPACK_IMPORTED_MODULE_0__.useContext)(_context_ThemeContextProvider__WEBPACK_IMPORTED_MODULE_1__.N);if(!context){const defaultMode="light",defaultTheme=_theme_DefaultTheme__WEBPACK_IMPORTED_MODULE_2__.Z,colors=defaultTheme.schemes?.[defaultMode],invertedColors=defaultTheme.schemes?.[(mode=defaultMode,"light"===mode?"dark":"light")];return{theme:defaultTheme,mode:defaultMode,colors,invertedColors,setMode:()=>{},setTheme:()=>{}}}var mode;return context}},"./src/hooks/useToastBarDispatch.js":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{Z:()=>__WEBPACK_DEFAULT_EXPORT__});var react__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("../../node_modules/react/index.js"),_context_ToastContext__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__("./src/context/ToastContext.js");const __WEBPACK_DEFAULT_EXPORT__=()=>{const{dispatchToast}=(0,react__WEBPACK_IMPORTED_MODULE_0__.useContext)(_context_ToastContext__WEBPACK_IMPORTED_MODULE_1__.Z);return dispatchToast}},"./src/theme/DefaultTheme.js":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{Z:()=>__WEBPACK_DEFAULT_EXPORT__});const __WEBPACK_DEFAULT_EXPORT__={schemes:{radius:"0.2rem",common:{black:"hsl(0, 100%, 0%)",white:"hsl(0, 100%, 100%)"},light:{background:"hsl(0, 0%, 100%)",foreground:"hsl(240, 10%, 3.9%)",card:"hsl(0, 0%, 100%)",cardForeground:"hsl(240, 10%, 3.9%)",popover:"hsl(0, 0%, 100%)",popoverForeground:"hsl(240, 10%, 3.9%)",primary:"hsl(240, 5.9%, 10%)",primaryForeground:"hsl(0, 0%, 98%)",secondary:"hsl(240, 4.8%, 95.9%)",secondaryForeground:"hsl(240, 5.9%, 10%)",muted:"hsl(240, 4.8%, 95.9%)",mutedForeground:"hsl(240, 3.8%, 46.1%)",accent:"hsl(240, 4.8%, 95.9%)",accentForeground:"hsl(240, 5.9%, 10%)",destructive:"hsl(0, 84.2%, 60.2%)",destructiveForeground:"hsl(0, 0%, 98%)",border:"hsl(240, 5.9%, 90%)",input:"hsl(240, 5.9%, 90%)",ring:"hsl(240, 5.9%, 10%)",warning:"hsl(38, 92%, 50%)",warningForeground:"hsl(48, 96%, 89%)",success:"hsl(91, 60.4%, 81.2%)",successForeground:"hsl(90, 61.1%, 14.1%)",info:"hsl(214, 76.4%, 50.2%)",infoForeground:"hsl(214.3, 77.8%, 92.9%)"},dark:{background:"hsl(240, 10%, 3.9%)",foreground:"hsl(0, 0%, 98%)",card:"hsl(240, 10%, 3.9%)",cardForeground:"hsl(0, 0%, 98%)",popover:"hsl(240, 10%, 3.9%)",popoverForeground:"hsl(0, 0%, 98%)",primary:"hsl(0, 0%, 98%)",primaryForeground:"hsl(240, 5.9%, 10%)",secondary:"hsl(240, 3.7%, 15.9%)",secondaryForeground:"hsl(0, 0%, 98%)",muted:"hsl(240, 3.7%, 15.9%)",mutedForeground:"hsl(240, 5%, 64.9%)",accent:"hsl(240, 3.7%, 15.9%)",accentForeground:"hsl(0, 0%, 98%)",destructive:"hsl(0, 62.8%, 30.6%)",destructiveForeground:"hsl(0, 0%, 98%)",border:"hsl(240, 3.7%, 15.9%)",input:"hsl(240, 3.7%, 15.9%)",ring:"hsl(240, 4.9%, 83.9%)",warning:"hsl(48, 96%, 89%)",warningForeground:"hsl(38, 92%, 50%)",success:"hsl(90, 61.1%, 14.1%)",successForeground:"hsl(90, 60%, 90.2%)",info:"hsl(214.3, 77.8%, 92.9%)",infoForeground:"hsl(214.4, 75.8%, 19.4%)"}},shadows:["none","rgba(17, 17, 26, 0.05) 0px 1px 0px, rgba(17, 17, 26, 0.1) 0px 0px 8px","rgba(100, 100, 111, 0.2) 0px 7px 29px 0px"],zIndex:{divider:1e3,body:1100,general:1200,menu:1300,tooltip:1400,modal:1500,toastbar:1600}}}}]);