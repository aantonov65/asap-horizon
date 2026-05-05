/*!
 * Common functions
 */function get_query_variable(parameter){let vars=window.location.search.substring(1).split("&");for(let i=0;i<vars.length;i++){let pair=vars[i].split("=");if(pair[0]==parameter)return pair[1]}return!1}function format_as_currency(num,currency){return new Intl.NumberFormat("en-US",{style:"currency",currency,minimumFractionDigits:2}).format(num)}function load_script(script_url){let script=document.createElement("script");return script.src=script_url,document.head.appendChild(script),new Promise((resolve,reject)=>{script.onload=function(){resolve()},script.onerror=function(){reject()}})}function refresh_page(){window.location.reload()}
//# sourceMappingURL=/cdn/shop/t/54/assets/global.js.map?v=26131930807380250131772127242
