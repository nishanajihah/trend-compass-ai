(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const o of document.querySelectorAll('link[rel="modulepreload"]'))i(o);new MutationObserver(o=>{for(const a of o)if(a.type==="childList")for(const r of a.addedNodes)r.tagName==="LINK"&&r.rel==="modulepreload"&&i(r)}).observe(document,{childList:!0,subtree:!0});function n(o){const a={};return o.integrity&&(a.integrity=o.integrity),o.referrerPolicy&&(a.referrerPolicy=o.referrerPolicy),o.crossOrigin==="use-credentials"?a.credentials="include":o.crossOrigin==="anonymous"?a.credentials="omit":a.credentials="same-origin",a}function i(o){if(o.ep)return;o.ep=!0;const a=n(o);fetch(o.href,a)}})();const v=(window.location.hostname==="localhost"||window.location.hostname==="127.0.0.1"||window.location.port==="5173"||window.location.port==="5174","https://trend-compass-ai.onrender.com");let s={};function T(){if(console.log("🚀 Initializing Trend Compass App..."),s={trendForm:document.getElementById("trendForm"),trendQuery:document.getElementById("trendQuery"),trendIndustry:document.getElementById("trendIndustry"),trendTimeframe:document.getElementById("trendTimeframe"),trendCharCount:document.getElementById("trendCharCount"),trendValidation:document.getElementById("trendValidation"),trendLoading:document.getElementById("trendLoading"),trendResults:document.getElementById("trendResults"),trendResultsContent:document.getElementById("trendResultsContent"),audienceForm:document.getElementById("audienceForm"),audienceDescription:document.getElementById("audienceDescription"),audienceCategory:document.getElementById("audienceCategory"),audienceRegion:document.getElementById("audienceRegion"),audienceCharCount:document.getElementById("audienceCharCount"),audienceValidation:document.getElementById("audienceValidation"),audienceLoading:document.getElementById("audienceLoading"),audienceResults:document.getElementById("audienceResults"),audienceResultsContent:document.getElementById("audienceResultsContent"),errorDisplay:document.getElementById("errorDisplay"),errorMessage:document.getElementById("errorMessage"),apiStatus:document.getElementById("apiStatus"),serverStatusBanner:document.getElementById("serverStatusBanner"),rateLimitDisplay:document.getElementById("rateLimitDisplay"),rateLimitText:document.getElementById("rateLimitText")},H(),O(),j(),_(),!sessionStorage.getItem("apiChecked"))setTimeout(()=>{w(),sessionStorage.setItem("apiChecked","true")},500);else{const n=s.apiStatus;if(n){const i=n.querySelector(".status-indicator"),o=n.querySelector("span:last-child");i&&(i.className="status-indicator status-warning"),o&&(o.textContent="⚠️ Status check skipped - conserving API requests")}}if(setTimeout(()=>{Y()},1e3),new URLSearchParams(window.location.search).has("dev")||new URLSearchParams(window.location.search).get("dev")==="true"||window.location.hostname==="localhost"||window.location.hostname==="127.0.0.1"||window.location.port==="8080"||window.location.href.includes("localhost")||window.location.href.includes("127.0.0.1")){const n=document.getElementById("testControls");n&&(n.style.display="block")}console.log("✅ App initialized successfully!")}function H(){var e,t,n;(e=s.trendForm)==null||e.addEventListener("submit",R),(t=s.audienceForm)==null||t.addEventListener("submit",F),(n=s.trendQuery)==null||n.addEventListener("keypress",i=>{i.key==="Enter"&&(i.preventDefault(),R(i))})}async function R(e){var i,o,a,r,u,h;e.preventDefault();const t=e.target.querySelector('button[type="submit"]');if(t!=null&&t.disabled||!D())return;const n={query:((o=(i=s.trendQuery)==null?void 0:i.value)==null?void 0:o.trim())||"",industry:((r=(a=s.trendIndustry)==null?void 0:a.value)==null?void 0:r.trim())||null,timeframe:((h=(u=s.trendTimeframe)==null?void 0:u.value)==null?void 0:h.trim())||null};t&&(t.disabled=!0,t.textContent="Analyzing..."),U(),M(),console.log("🌐 API URL:",`${v}/api/trends/analyze`),console.log("📦 Form Data:",n);try{const l=new AbortController,d=setTimeout(()=>{l.abort()},3e4),c=await fetch(`${v}/api/trends/analyze`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(n),signal:l.signal});if(clearTimeout(d),!c.ok){const f=await c.json().catch(()=>null);if(c.status===429){const L=(f==null?void 0:f.reset_time)||"several hours";throw new Error(`⚠️ DAILY LIMIT REACHED (15 requests per day)

You have used all your daily requests. Please wait ${L} hours until tomorrow to try again.

This limit helps us control AI API costs during the hackathon.`)}throw new Error(`Server error: ${c.status} ${c.statusText}`)}const b=await c.json();console.log("🎯 API Response:",b);const g=c.headers.get("X-RateLimit-Limit"),y=c.headers.get("X-RateLimit-Remaining");g&&y&&$(y,g),E(),N(b)}catch(l){console.error("Trend analysis failed:",l),E();let d="Failed to analyze trend. ";l instanceof Error&&(l.name==="AbortError"?d="Request timed out. AI analysis takes time - please try again.":l.message.includes("Failed to fetch")||l.message.includes("NetworkError")||l.message.includes("fetch")?d=`🔌 Cannot connect to server. This could be due to:

• Rate limit exceeded (15 requests per day)
• Server is temporarily down
• Network connectivity issues

Please try again later or reset your daily quota.`:l.message.includes("500")?d="⚠️ Server error occurred. Our team has been notified. Please try again in a few minutes.":l.message.includes("429")?d=`⚠️ DAILY LIMIT REACHED (15 requests per day)

You have used all your daily requests. Please wait until tomorrow to try again, or contact support to reset your quota.`:d+=l.message),m("trendValidation",d,"error")}finally{t&&(t.disabled=!1,t.innerHTML='<i class="fas fa-search"></i> Analyze Trend')}}async function F(e){var i,o,a,r,u,h;e.preventDefault();const t=e.target.querySelector('button[type="submit"]');if(t!=null&&t.disabled||!P())return;const n={target_audience:((o=(i=s.audienceDescription)==null?void 0:i.value)==null?void 0:o.trim())||"",product_category:((r=(a=s.audienceCategory)==null?void 0:a.value)==null?void 0:r.trim())||null,region:((h=(u=s.audienceRegion)==null?void 0:u.value)==null?void 0:h.trim())||null};t&&(t.disabled=!0,t.textContent="Analyzing..."),X(),k(),console.log("🌐 API URL:",`${v}/api/audience/analyze`),console.log("📦 Form Data:",n);try{const l=new AbortController,d=setTimeout(()=>{l.abort()},3e4),c=await fetch(`${v}/api/audience/analyze`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(n),signal:l.signal});if(clearTimeout(d),!c.ok){const f=await c.json().catch(()=>null);if(c.status===429){const L=(f==null?void 0:f.reset_time)||"several hours";throw new Error(`⚠️ DAILY LIMIT REACHED (15 requests per day)

You have used all your daily requests. Please wait ${L} hours until tomorrow to try again.

This limit helps us control AI API costs during the hackathon.`)}throw new Error(`Server error: ${c.status} ${c.statusText}`)}const b=await c.json(),g=c.headers.get("X-RateLimit-Limit"),y=c.headers.get("X-RateLimit-Remaining");g&&y&&$(y,g),C(),Q(b)}catch(l){console.error("Audience analysis failed:",l),C();let d="Failed to analyze audience. ";l instanceof Error&&(l.name==="AbortError"?d="Request timed out. AI analysis takes time - please try again.":l.message.includes("Failed to fetch")||l.message.includes("NetworkError")||l.message.includes("fetch")?d="🔌 Server is currently down or unreachable. Please try again later or contact support.":l.message.includes("500")?d="⚠️ Server error occurred. Our team has been notified. Please try again in a few minutes.":d+=l.message),m("audienceValidation",d,"error")}finally{t&&(t.disabled=!1,t.innerHTML='<i class="fas fa-users"></i> Analyze Audience')}}function N(e){var t;if(console.log("📊 Displaying trend results:",e),s.trendResultsContent)if(e)if(typeof e=="string")s.trendResultsContent.innerHTML=I(e);else{const n=`
                <div class="insight-section">
                    <h4><i class="fas fa-chart-line"></i> Trend Analysis Results</h4>
                    <p><strong>Query:</strong> ${e.query||"N/A"}</p>
                    <p><strong>Analysis Date:</strong> ${e.timestamp?new Date(e.timestamp).toLocaleString():"N/A"}</p>
                </div>
                
                ${e.summary?`
                    <div class="insight-section">
                        <h4><i class="fas fa-lightbulb"></i> Summary</h4>
                        <div class="insight-content">${I(e.summary)}</div>
                    </div>
                `:""}
                
                ${e.insights&&e.insights.length>0?`
                    <div class="insight-section">
                        <h4><i class="fas fa-trending-up"></i> Key Insights</h4>
                        <div class="insight-content">
                            ${e.insights.map(i=>`
                                <div class="insight-item">
                                    <strong>${i.title||i.category||"Insight"}</strong>
                                    <p>${i.description||i.content||i}</p>
                                    ${i.confidence?`<small>Confidence: ${Math.round(i.confidence*100)}%</small>`:""}
                                </div>
                            `).join("")}
                        </div>
                    </div>
                `:""}
                
                ${e.recommendations&&e.recommendations.length>0?`
                    <div class="insight-section">
                        <h4><i class="fas fa-star"></i> Recommendations</h4>
                        <div class="insight-content">
                            <ul>
                                ${e.recommendations.map(i=>`<li>${i}</li>`).join("")}
                            </ul>
                        </div>
                    </div>
                `:""}
            `;s.trendResultsContent.innerHTML=n}else{const n=`
            <h4>🚀 Trend Analysis Results</h4>
            <p><strong>Analysis Status:</strong> ✅ Completed Successfully</p>
            <p><strong>Test Mode:</strong> This is mock data to verify the display is working.</p>
            
            <h5>Key Insights:</h5>
            <ul>
                <li>Trend growth potential: High</li>
                <li>Market adoption: Rising</li>
                <li>Cultural impact: Significant</li>
            </ul>
            
            <h5>Forecast:</h5>
            <p>This trend is expected to gain momentum over the next 12 months.</p>
            `;s.trendResultsContent.innerHTML=n}K(),(t=s.trendResults)==null||t.scrollIntoView({behavior:"smooth",block:"start"})}function Q(e){var t;if(console.log("👥 Displaying audience results:",e),!!s.audienceResultsContent){if(typeof e=="string")if(!e||e.trim()===""){const n=`
            <h4>👥 Audience Analysis Results</h4>
            <p><strong>Analysis Status:</strong> ✅ Completed Successfully</p>
            <p><strong>Test Mode:</strong> This is mock data to verify the display is working.</p>
            
            <h5>Audience Profile:</h5>
            <ul>
                <li>Primary Demographics: Young professionals (25-35)</li>
                <li>Interests: Technology, sustainability, wellness</li>
                <li>Behavior: Early adopters, social media active</li>
            </ul>
            
            <h5>Recommendations:</h5>
            <p>Target this audience through digital channels with authenticity-focused messaging.</p>
            `;s.audienceResultsContent.innerHTML=n}else s.audienceResultsContent.innerHTML=I(e);else{const n=`
            <div class="insight-section">
                <h4><i class="fas fa-users"></i> Summary</h4>
                <div class="insight-content">${e.summary||e.audience_insights||e.analysis||"Analysis data not available"}</div>
            </div>
            
            ${e.cultural_affinities&&e.cultural_affinities.length>0?`
                <div class="insight-section">
                    <h4><i class="fas fa-heart"></i> Cultural Affinities</h4>
                    <div class="insight-content">
                        ${e.cultural_affinities.map(i=>`
                            <div class="insight-item">
                                <strong>${i.title}</strong>
                                <p>${i.description}</p>
                                <small>Confidence: ${Math.round(i.confidence*100)}%</small>
                            </div>
                        `).join("")}
                    </div>
                </div>
            `:""}
            
            ${e.insights&&e.insights.length>0?`
                <div class="insight-section">
                    <h4><i class="fas fa-lightbulb"></i> Key Insights</h4>
                    <div class="insight-content">
                        ${e.insights.map(i=>`
                            <div class="insight-item">
                                <strong>${i.title}</strong>
                                <p>${i.description}</p>
                                <small>Confidence: ${Math.round(i.confidence*100)}%</small>
                            </div>
                        `).join("")}
                    </div>
                </div>
            `:""}
            
            ${e.recommendations&&e.recommendations.length>0?`
                <div class="insight-section">
                    <h4><i class="fas fa-star"></i> Recommendations</h4>
                    <div class="insight-content">
                        <ul>
                            ${e.recommendations.map(i=>`<li>${i}</li>`).join("")}
                        </ul>
                    </div>
                </div>
            `:""}
        `;s.audienceResultsContent.innerHTML=n}G(),(t=s.audienceResults)==null||t.scrollIntoView({behavior:"smooth",block:"start"})}}function $(e,t){var i;if(s.rateLimitText){const o=parseInt(t)-parseInt(e);s.rateLimitText.textContent=`API Usage: ${o}/${t} requests used today`}if((i=s.rateLimitDisplay)==null||i.classList.remove("d-none"),parseInt(e)<=0){const o=document.getElementById("trendAnalyzeBtn"),a=document.getElementById("audienceAnalyzeBtn");o&&(o.disabled=!0,o.innerHTML='<i class="fas fa-ban"></i> Daily Limit Reached'),a&&(a.disabled=!0,a.innerHTML='<i class="fas fa-ban"></i> Daily Limit Reached')}}function I(e){return e.replace(/\*\*(.*?)\*\*/g,"<strong>$1</strong>").replace(/\*(.*?)\*/g,"<em>$1</em>").replace(/\n\n/g,"</p><p>").replace(/\n/g,"<br>").replace(/^/,"<p>").replace(/$/,"</p>")}function O(){const e=document.querySelectorAll(".tab-button"),t=document.querySelectorAll(".tab-content");if(e.length===0||t.length===0){console.error("Tab elements not found");return}e.forEach(o=>{o.addEventListener("click",function(a){a.preventDefault();const r=this.getAttribute("data-tab");r&&S(r)})});const n=e[0],i=n==null?void 0:n.getAttribute("data-tab");i&&S(i)}function S(e){const t=document.querySelectorAll(".tab-button"),n=document.querySelectorAll(".tab-content");t.forEach(a=>a.classList.remove("active")),n.forEach(a=>{a.classList.remove("active"),a.style.display="none"});const i=document.querySelector(`[data-tab="${e}"]`);i==null||i.classList.add("active");const o=document.getElementById(e);o&&(o.style.display="block",setTimeout(()=>{o.classList.add("active")},50))}function j(){s.trendQuery&&s.trendCharCount&&s.trendQuery.addEventListener("input",function(){A("trendQuery","trendCharCount",200)}),s.audienceDescription&&s.audienceCharCount&&s.audienceDescription.addEventListener("input",function(){A("audienceDescription","audienceCharCount",300)})}function A(e,t,n){const i=document.getElementById(e),o=document.getElementById(t);if(i&&o){const a=i.value.length;o.textContent=a.toString();const r=n*.8,u=n*.9;a>u?o.style.color="#ef4444":a>r?o.style.color="#f59e0b":o.style.color="#6b7280"}}function _(){s.trendQuery&&s.trendValidation&&(s.trendQuery.addEventListener("blur",function(){D()}),s.trendQuery.addEventListener("input",function(){s.trendValidation&&(s.trendValidation.textContent="",s.trendValidation.className="validation-message")})),s.audienceDescription&&s.audienceValidation&&(s.audienceDescription.addEventListener("blur",function(){P()}),s.audienceDescription.addEventListener("input",function(){s.audienceValidation&&(s.audienceValidation.textContent="",s.audienceValidation.className="validation-message")}))}function D(){var t,n;const e=((n=(t=s.trendQuery)==null?void 0:t.value)==null?void 0:n.trim())||"";return e.length<3?(m("trendValidation","Please enter at least 3 characters","error"),!1):e.length>200?(m("trendValidation","Please keep your query under 200 characters","error"),!1):(m("trendValidation","Looking good! 👍","success"),!0)}function P(){var t,n;const e=((n=(t=s.audienceDescription)==null?void 0:t.value)==null?void 0:n.trim())||"";return e.length<10?(m("audienceValidation","Please enter at least 10 characters","error"),!1):e.length>500?(m("audienceValidation","Please keep your description under 500 characters","error"),!1):(m("audienceValidation","Looking good! 👍","success"),!0)}function m(e,t,n){const i=document.getElementById(e);i&&(i.textContent=t,i.className=`validation-message ${n}`)}function B(e){const t=document.getElementById(e);t&&(t.style.display="none",t.classList.remove("show"))}function Y(){var e;s.rateLimitText&&(s.rateLimitText.textContent="API Usage: 15/15 requests available today"),(e=s.rateLimitDisplay)==null||e.classList.remove("d-none")}async function w(e=!1){const t=s.apiStatus,n=document.querySelector(".btn-retry");if(e&&t&&(p("warning","🔄 Checking connection..."),n)){n.classList.add("loading");const i=n.querySelector("i");i&&(i.className="fas fa-spinner fa-spin")}try{const i=new AbortController,o=setTimeout(()=>i.abort(),8e3),a=await fetch(`${v}/health`,{method:"GET",headers:{Accept:"application/json"},signal:i.signal});if(clearTimeout(o),a.ok)p("healthy","🟢 API Connected & Ready"),Z(),sessionStorage.removeItem("connectionIssue"),e&&setTimeout(()=>{p("healthy","🟢 Connection Restored")},500);else throw new Error(`API health check failed with status ${a.status}`)}catch(i){console.warn("⚠️ API connection issue:",i);let o="🔴 API Disconnected";i instanceof Error&&(i.name==="AbortError"?o="🔴 Connection Timeout":i.message.includes("Failed to fetch")&&(o="🔴 Network Error")),p("error",o),J(),sessionStorage.setItem("connectionIssue","true")}finally{if(n){n.classList.remove("loading");const i=n.querySelector("i");i&&(i.className="fas fa-sync-alt")}}}function p(e,t){const n=s.apiStatus;if(!n)return;const i=n.querySelector(".status-indicator"),o=n.querySelector("span:last-child");i&&(i.className=`status-indicator status-${e}`),o&&(o.textContent=t)}function U(){var t;(t=s.trendLoading)==null||t.classList.remove("d-none");const e=document.getElementById("analyzeBtn");e&&(e.disabled=!0,e.innerHTML='<i class="fas fa-spinner fa-spin"></i> Analyzing...')}function E(){var t;(t=s.trendLoading)==null||t.classList.add("d-none");const e=document.getElementById("analyzeBtn");e&&(e.disabled=!1,e.innerHTML='<i class="fas fa-search"></i> Analyze Trend')}function K(){var e,t;(e=s.trendResults)==null||e.classList.remove("d-none"),(t=s.trendResults)==null||t.classList.add("fade-in")}function M(){var e;(e=s.trendResults)==null||e.classList.add("d-none")}function X(){var t;(t=s.audienceLoading)==null||t.classList.remove("d-none");const e=document.getElementById("audienceAnalyzeBtn");e&&(e.disabled=!0,e.innerHTML='<i class="fas fa-spinner fa-spin"></i> Analyzing...')}function C(){var t;(t=s.audienceLoading)==null||t.classList.add("d-none");const e=document.getElementById("audienceAnalyzeBtn");e&&(e.disabled=!1,e.innerHTML='<i class="fas fa-users"></i> Analyze Audience')}function G(){var e,t;(e=s.audienceResults)==null||e.classList.remove("d-none"),(t=s.audienceResults)==null||t.classList.add("fade-in")}function k(){var e;(e=s.audienceResults)==null||e.classList.add("d-none")}function J(){var e;(e=s.serverStatusBanner)==null||e.classList.remove("d-none")}function Z(){var e;(e=s.serverStatusBanner)==null||e.classList.add("d-none")}function W(){console.log("🔄 Retrying analysis..."),w(!0).then(()=>{var t,n;q();const e=document.querySelector(".tab-content.active");if((e==null?void 0:e.id)==="trendAnalysisTab"){const i=s.trendForm,o=s.trendQuery;if(((t=o==null?void 0:o.value)==null?void 0:t.trim())&&i){const r=i.querySelector('button[type="submit"]');r&&(r.disabled=!1,r.innerHTML='<i class="fas fa-chart-line"></i> Analyze Trends'),i.dispatchEvent(new Event("submit"))}else m("trendValidation","Please enter a trend to analyze.","warning")}else if((e==null?void 0:e.id)==="audienceAnalysisTab"){const i=s.audienceForm,o=s.audienceDescription;if(((n=o==null?void 0:o.value)==null?void 0:n.trim())&&i){const r=i.querySelector('button[type="submit"]');r&&(r.disabled=!1,r.innerHTML='<i class="fas fa-users"></i> Analyze Audience'),i.dispatchEvent(new Event("submit"))}else m("audienceValidation","Please describe your target audience.","warning")}}).catch(()=>{m("trendValidation","Connection issue detected. Retrying anyway...","warning"),setTimeout(()=>{const e=document.querySelector(".tab-content.active");if((e==null?void 0:e.id)==="trendAnalysisTab"){const t=s.trendForm;t&&t.dispatchEvent(new Event("submit"))}else if((e==null?void 0:e.id)==="audienceAnalysisTab"){const t=s.audienceForm;t&&t.dispatchEvent(new Event("submit"))}},1e3)})}function q(){var e;B("trendValidation"),B("audienceValidation"),(e=s.errorDisplay)==null||e.classList.add("d-none")}function x(){console.log("🔄 Refreshing application..."),sessionStorage.clear(),localStorage.removeItem("apiStatusCache"),ee(),te(),q(),p("warning","🔄 Refreshing..."),setTimeout(()=>{w(!0)},500);const e=s.serverStatusBanner;if(e){const t=e.querySelector(".banner-content span");if(t){const n=t.textContent;t.textContent="✅ Application refreshed successfully!",setTimeout(()=>{t&&n&&(t.textContent=n)},3e3)}}}function ee(){const e=s.trendForm;if(e){e.reset(),A("trendQuery","trendCharCount",200);const n=e.querySelector('button[type="submit"]');n&&(n.disabled=!1,n.innerHTML='<i class="fas fa-chart-line"></i> Analyze Trends')}const t=s.audienceForm;if(t){t.reset(),A("audienceDescription","audienceCharCount",300);const n=t.querySelector('button[type="submit"]');n&&(n.disabled=!1,n.innerHTML='<i class="fas fa-users"></i> Analyze Audience')}}function te(){M(),k(),E(),C()}function ne(e){const t=e==="trend"?"trendAdvanced":"audienceAdvanced",n=document.getElementById(t);n&&(n.style.display==="none"||!n.style.display?(n.style.display="block",n.classList.add("show")):(n.style.display="none",n.classList.remove("show")))}function ie(){const e=document.querySelector(".tab-content.active");(e==null?void 0:e.id)==="trendAnalysisTab"?V():(e==null?void 0:e.id)==="audienceAnalysisTab"&&z()}function V(){const e=["sustainable fashion trends","AI-generated art movement","plant-based meat alternatives","remote work culture shift","digital minimalism lifestyle","wellness technology adoption","circular economy practices","virtual reality fitness","social commerce growth","micro-mobility transport"],t=e[Math.floor(Math.random()*e.length)],n=s.trendQuery;if(n){n.value=t;const i=new Event("input");n.dispatchEvent(i),n.focus()}}function z(){const e=["Gen Z eco-conscious consumers aged 18-25 who prioritize sustainability and ethical brands in their purchasing decisions","Tech-savvy millennials working remotely with high disposable income, interested in productivity tools and work-life balance","Luxury fashion enthusiasts aged 25-40 in urban areas who value craftsmanship and exclusive designer pieces","Health-conscious baby boomers interested in wellness technology, fitness tracking, and preventive healthcare solutions","Creative professionals and artists who embrace digital tools, value authenticity, and seek platforms for self-expression","Young parents seeking convenient, family-friendly products and services that save time while ensuring safety","College students passionate about social justice, environmental causes, and affordable lifestyle brands","High-income professionals in finance who value premium, time-saving solutions and status symbol products"],t=e[Math.floor(Math.random()*e.length)],n=s.audienceDescription;if(n){n.value=t;const i=new Event("input");n.dispatchEvent(i),n.focus()}}function se(){const e=s.trendQuery,t=s.trendIndustry,n=s.trendTimeframe;e&&(e.value="",e.dispatchEvent(new Event("input"))),t&&(t.selectedIndex=0),n&&(n.selectedIndex=1);const i=s.audienceDescription,o=s.audienceCategory,a=s.audienceRegion;i&&(i.value="",i.dispatchEvent(new Event("input"))),o&&(o.selectedIndex=0),a&&(a.selectedIndex=0);const r=s.trendValidation,u=s.audienceValidation;r&&(r.textContent="",r.className="validation-message"),u&&(u.textContent="",u.className="validation-message")}function oe(){w(!0)}function ae(){sessionStorage.clear(),localStorage.clear(),x()}function re(e){console.log(`📄 Exporting ${e} results...`),alert(`Export feature coming soon! (${e} analysis)`)}function le(e){console.log(`💾 Saving ${e} results...`),alert(`Save feature coming soon! (${e} analysis)`)}function ce(){alert(`Trend Compass - AI-Powered Trend Forecasting

Combining Qloo's cultural affinity data with Gemini LLM for rich, strategic insights.`)}function de(){alert(`Privacy Policy

Your data is processed securely and not stored permanently. Analysis requests are sent to our API for processing only.`)}window.retryAnalysis=W;window.refreshApplication=x;window.exportResults=re;window.saveResults=le;window.checkAPIStatus=w;window.showAbout=ce;window.showPrivacy=de;window.toggleAdvancedOptions=ne;window.showSampleInputs=ie;window.fillRandomTrend=V;window.fillRandomAudience=z;window.clearAllInputs=se;window.testConnection=oe;window.clearCache=ae;document.readyState==="loading"?document.addEventListener("DOMContentLoaded",T):T();
//# sourceMappingURL=index-D4kPWHjw.js.map
