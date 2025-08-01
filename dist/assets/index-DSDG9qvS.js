(function(){const n=document.createElement("link").relList;if(n&&n.supports&&n.supports("modulepreload"))return;for(const a of document.querySelectorAll('link[rel="modulepreload"]'))t(a);new MutationObserver(a=>{for(const o of a)if(o.type==="childList")for(const l of o.addedNodes)l.tagName==="LINK"&&l.rel==="modulepreload"&&t(l)}).observe(document,{childList:!0,subtree:!0});function s(a){const o={};return a.integrity&&(o.integrity=a.integrity),a.referrerPolicy&&(o.referrerPolicy=a.referrerPolicy),a.crossOrigin==="use-credentials"?o.credentials="include":a.crossOrigin==="anonymous"?o.credentials="omit":o.credentials="same-origin",o}function t(a){if(a.ep)return;a.ep=!0;const o=s(a);fetch(a.href,o)}})();const y=(window.location.hostname==="localhost"||window.location.hostname==="127.0.0.1"||window.location.port==="5173"||window.location.port==="5174","https://trend-compass-ai.onrender.com");let i={};function T(){if(console.log("🚀 Initializing Trend Compass App..."),i={trendForm:document.getElementById("trendForm"),trendQuery:document.getElementById("trendQuery"),trendIndustry:document.getElementById("trendIndustry"),trendTimeframe:document.getElementById("trendTimeframe"),trendCharCount:document.getElementById("trendCharCount"),trendValidation:document.getElementById("trendValidation"),trendLoading:document.getElementById("trendLoading"),trendResults:document.getElementById("trendResults"),trendResultsContent:document.getElementById("trendResultsContent"),audienceForm:document.getElementById("audienceForm"),audienceDescription:document.getElementById("audienceDescription"),audienceCategory:document.getElementById("audienceCategory"),audienceRegion:document.getElementById("audienceRegion"),audienceCharCount:document.getElementById("audienceCharCount"),audienceValidation:document.getElementById("audienceValidation"),audienceLoading:document.getElementById("audienceLoading"),audienceResults:document.getElementById("audienceResults"),audienceResultsContent:document.getElementById("audienceResultsContent"),errorDisplay:document.getElementById("errorDisplay"),errorMessage:document.getElementById("errorMessage"),apiStatus:document.getElementById("apiStatus"),serverStatusBanner:document.getElementById("serverStatusBanner"),rateLimitDisplay:document.getElementById("rateLimitDisplay"),rateLimitText:document.getElementById("rateLimitText")},N(),Q(),Y(),_(),!sessionStorage.getItem("apiChecked"))setTimeout(()=>{E(),sessionStorage.setItem("apiChecked","true")},500);else{const s=i.apiStatus;if(s){const t=s.querySelector(".status-indicator"),a=s.querySelector("span:last-child");t&&(t.className="status-indicator status-warning"),a&&(a.textContent="⚠️ Status check skipped - conserving API requests")}}if(setTimeout(()=>{U()},1e3),new URLSearchParams(window.location.search).has("dev")||new URLSearchParams(window.location.search).get("dev")==="true"||window.location.hostname==="localhost"||window.location.hostname==="127.0.0.1"||window.location.port==="8080"||window.location.href.includes("localhost")||window.location.href.includes("127.0.0.1")){const s=document.getElementById("testControls");s&&(s.style.display="block")}console.log("✅ App initialized successfully!")}function N(){var e,n,s;(e=i.trendForm)==null||e.addEventListener("submit",R),(n=i.audienceForm)==null||n.addEventListener("submit",O),(s=i.trendQuery)==null||s.addEventListener("keypress",t=>{t.key==="Enter"&&(t.preventDefault(),R(t))})}async function R(e){var t,a,o,l,u,f;e.preventDefault();const n=e.target.querySelector('button[type="submit"]');if(n!=null&&n.disabled||!k())return;const s={query:((a=(t=i.trendQuery)==null?void 0:t.value)==null?void 0:a.trim())||"",industry:((l=(o=i.trendIndustry)==null?void 0:o.value)==null?void 0:l.trim())||null,timeframe:((f=(u=i.trendTimeframe)==null?void 0:u.value)==null?void 0:f.trim())||null};n&&(n.disabled=!0,n.textContent="Analyzing..."),x(),M(),console.log("🌐 API URL:",`${y}/api/trends/analyze`),console.log("📦 Form Data:",s);try{const r=new AbortController,d=setTimeout(()=>{r.abort()},3e4),c=await fetch(`${y}/api/trends/analyze`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(s),signal:r.signal});if(clearTimeout(d),!c.ok){const h=await c.json().catch(()=>null);if(c.status===429){const L=(h==null?void 0:h.reset_time)||"several hours";throw new Error(`⚠️ DAILY LIMIT REACHED (15 requests per day)

You have used all your daily requests. Please wait ${L} hours until tomorrow to try again.

This limit helps us control AI API costs during the hackathon.`)}throw new Error(`Server error: ${c.status} ${c.statusText}`)}const v=await c.json();console.log("🎯 API Response:",v);const g=c.headers.get("X-RateLimit-Limit"),p=c.headers.get("X-RateLimit-Remaining");g&&p&&C(p,g),A(),P(v)}catch(r){console.error("Trend analysis failed:",r),A();let d="Failed to analyze trend. ";r instanceof Error&&(r.name==="AbortError"?d="Request timed out. AI analysis takes time - please try again.":r.message.includes("Failed to fetch")||r.message.includes("NetworkError")||r.message.includes("fetch")?d=`🔌 Cannot connect to server. This could be due to:

• Rate limit exceeded (15 requests per day)
• Server is temporarily down
• Network connectivity issues

Please try again later or reset your daily quota.`:r.message.includes("500")?d="⚠️ Server error occurred. Our team has been notified. Please try again in a few minutes.":r.message.includes("429")?d=`⚠️ DAILY LIMIT REACHED (15 requests per day)

You have used all your daily requests. Please wait until tomorrow to try again, or contact support to reset your quota.`:d+=r.message),m("trendValidation",d,"error")}finally{n&&(n.disabled=!1,n.innerHTML='<i class="fas fa-search"></i> Analyze Trend')}}async function O(e){var t,a,o,l,u,f;e.preventDefault();const n=e.target.querySelector('button[type="submit"]');if(n!=null&&n.disabled||!D())return;const s={target_audience:((a=(t=i.audienceDescription)==null?void 0:t.value)==null?void 0:a.trim())||"",product_category:((l=(o=i.audienceCategory)==null?void 0:o.value)==null?void 0:l.trim())||null,region:((f=(u=i.audienceRegion)==null?void 0:u.value)==null?void 0:f.trim())||null};n&&(n.disabled=!0,n.textContent="Analyzing..."),q(),z(),console.log("🌐 API URL:",`${y}/api/audience/analyze`),console.log("📦 Form Data:",s);try{const r=new AbortController,d=setTimeout(()=>{r.abort()},3e4),c=await fetch(`${y}/api/audience/analyze`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(s),signal:r.signal});if(clearTimeout(d),!c.ok){const h=await c.json().catch(()=>null);if(c.status===429){const L=(h==null?void 0:h.reset_time)||"several hours";throw new Error(`⚠️ DAILY LIMIT REACHED (15 requests per day)

You have used all your daily requests. Please wait ${L} hours until tomorrow to try again.

This limit helps us control AI API costs during the hackathon.`)}throw new Error(`Server error: ${c.status} ${c.statusText}`)}const v=await c.json(),g=c.headers.get("X-RateLimit-Limit"),p=c.headers.get("X-RateLimit-Remaining");g&&p&&C(p,g),I(),B(v)}catch(r){console.error("Audience analysis failed:",r),I();let d="Failed to analyze audience. ";r instanceof Error&&(r.name==="AbortError"?d="Request timed out. AI analysis takes time - please try again.":r.message.includes("Failed to fetch")||r.message.includes("NetworkError")||r.message.includes("fetch")?d="🔌 Server is currently down or unreachable. Please try again later or contact support.":r.message.includes("500")?d="⚠️ Server error occurred. Our team has been notified. Please try again in a few minutes.":d+=r.message),m("audienceValidation",d,"error")}finally{n&&(n.disabled=!1,n.innerHTML='<i class="fas fa-users"></i> Analyze Audience')}}async function F(e){var n,s;console.log(`🔍 Analyzing trend: ${e}`),x(),J(),M();try{const t=((n=i.trendIndustry)==null?void 0:n.value)||"",a=((s=i.trendTimeframe)==null?void 0:s.value)||"1year",o=await fetch(`${y}/api/trends/analyze`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({topic:e,industry:t||void 0,timeframe:a})});if(!o.ok)throw o.status===429?new Error("Rate limit exceeded. You have reached the daily limit of 15 requests. Please try again tomorrow."):o.status===500?new Error("Server error. Please try again later."):new Error(`Analysis failed: ${o.statusText}`);const l=await o.json(),u=o.headers.get("X-RateLimit-Limit"),f=o.headers.get("X-RateLimit-Remaining");u&&f&&C(f,u),A(),P(l.trend_analysis||l.analysis)}catch(t){console.error("Trend analysis failed:",t),A();let a="Failed to analyze trend. ";t instanceof Error&&(t.name==="AbortError"?a="Request timed out. AI analysis takes time - please try again.":t.message.includes("Failed to fetch")||t.message.includes("NetworkError")||t.message.includes("fetch")?a=`🔌 Cannot connect to server. This could be due to:

• Rate limit exceeded (15 requests per day)
• Server is temporarily down
• Network connectivity issues

Please try again later or reset your daily quota.`:t.message.includes("500")?a="⚠️ Server error occurred. Our team has been notified. Please try again in a few minutes.":t.message.includes("429")?a=`⚠️ DAILY LIMIT REACHED (15 requests per day)

You have used all your daily requests. Please wait until tomorrow to try again, or contact support to reset your quota.`:a+=t.message),m("trendValidation",a,"error")}finally{const t=document.getElementById("trendAnalyzeBtn");t&&(t.disabled=!1,t.innerHTML='<i class="fas fa-search"></i> Analyze Trend')}}async function j(e){var n,s;console.log(`👥 Analyzing audience: ${e}`),q(),G(),z();try{const t=((n=i.audienceCategory)==null?void 0:n.value)||"",a=((s=i.audienceRegion)==null?void 0:s.value)||"",o=await fetch(`${y}/api/trends/audience`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({description:e,category:t||void 0,region:a||void 0})});if(!o.ok)throw o.status===429?new Error("Rate limit exceeded. You have reached the daily limit of 15 requests. Please try again tomorrow."):o.status===500?new Error("Server error. Please try again later."):new Error(`Analysis failed: ${o.statusText}`);const l=await o.json();B(l.audience_insights||l.analysis)}catch(t){console.error("Audience analysis error:",t),I();let a="Failed to analyze audience. ";t instanceof Error&&(t.name==="AbortError"?a="Request timed out. AI analysis takes time - please try again.":t.message.includes("Failed to fetch")||t.message.includes("NetworkError")||t.message.includes("fetch")?a="🔌 Server is currently down or unreachable. Please try again later or contact support.":t.message.includes("500")?a="⚠️ Server error occurred. Our team has been notified. Please try again in a few minutes.":a+=t.message),m("audienceValidation",a,"error")}finally{const t=document.getElementById("audienceAnalyzeBtn");t&&(t.disabled=!1,t.innerHTML='<i class="fas fa-users"></i> Analyze Audience')}}function P(e){var n;if(console.log("📊 Displaying trend results:",e),i.trendResultsContent)if(e)if(typeof e=="string")i.trendResultsContent.innerHTML=b(e);else{const s=`
                <div class="insight-section">
                    <h4><i class="fas fa-chart-line"></i> Trend Analysis Results</h4>
                    <p><strong>Query:</strong> ${e.query||"N/A"}</p>
                    <p><strong>Analysis Date:</strong> ${e.timestamp?new Date(e.timestamp).toLocaleString():"N/A"}</p>
                </div>
                
                ${e.summary?`
                    <div class="insight-section">
                        <h4><i class="fas fa-lightbulb"></i> Summary</h4>
                        <div class="insight-content">${b(e.summary)}</div>
                    </div>
                `:""}
                
                ${e.insights&&e.insights.length>0?`
                    <div class="insight-section">
                        <h4><i class="fas fa-trending-up"></i> Key Insights</h4>
                        <div class="insight-content">
                            ${e.insights.map(t=>`
                                <div class="insight-item">
                                    <strong>${t.title||t.category||"Insight"}</strong>
                                    <p>${t.description||t.content||t}</p>
                                    ${t.confidence?`<small>Confidence: ${Math.round(t.confidence*100)}%</small>`:""}
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
                                ${e.recommendations.map(t=>`<li>${t}</li>`).join("")}
                            </ul>
                        </div>
                    </div>
                `:""}
            `;i.trendResultsContent.innerHTML=s}else{const s=`
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
            `;i.trendResultsContent.innerHTML=s}X(),(n=i.trendResults)==null||n.scrollIntoView({behavior:"smooth",block:"start"})}function B(e){var n;if(console.log("👥 Displaying audience results:",e),!!i.audienceResultsContent){if(typeof e=="string")if(!e||e.trim()===""){const s=`
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
            `;i.audienceResultsContent.innerHTML=s}else i.audienceResultsContent.innerHTML=b(e);else{const s=`
            <div class="insight-section">
                <h4><i class="fas fa-users"></i> Summary</h4>
                <div class="insight-content">${e.summary||e.audience_insights||e.analysis||"Analysis data not available"}</div>
            </div>
            
            ${e.cultural_affinities&&e.cultural_affinities.length>0?`
                <div class="insight-section">
                    <h4><i class="fas fa-heart"></i> Cultural Affinities</h4>
                    <div class="insight-content">
                        ${e.cultural_affinities.map(t=>`
                            <div class="insight-item">
                                <strong>${t.title}</strong>
                                <p>${t.description}</p>
                                <small>Confidence: ${Math.round(t.confidence*100)}%</small>
                            </div>
                        `).join("")}
                    </div>
                </div>
            `:""}
            
            ${e.insights&&e.insights.length>0?`
                <div class="insight-section">
                    <h4><i class="fas fa-lightbulb"></i> Key Insights</h4>
                    <div class="insight-content">
                        ${e.insights.map(t=>`
                            <div class="insight-item">
                                <strong>${t.title}</strong>
                                <p>${t.description}</p>
                                <small>Confidence: ${Math.round(t.confidence*100)}%</small>
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
                            ${e.recommendations.map(t=>`<li>${t}</li>`).join("")}
                        </ul>
                    </div>
                </div>
            `:""}
        `;i.audienceResultsContent.innerHTML=s}K(),(n=i.audienceResults)==null||n.scrollIntoView({behavior:"smooth",block:"start"})}}function C(e,n){var t;if(i.rateLimitText){const a=parseInt(n)-parseInt(e);i.rateLimitText.textContent=`API Usage: ${a}/${n} requests used today`}if((t=i.rateLimitDisplay)==null||t.classList.remove("d-none"),parseInt(e)<=0){const a=document.getElementById("trendAnalyzeBtn"),o=document.getElementById("audienceAnalyzeBtn");a&&(a.disabled=!0,a.innerHTML='<i class="fas fa-ban"></i> Daily Limit Reached'),o&&(o.disabled=!0,o.innerHTML='<i class="fas fa-ban"></i> Daily Limit Reached')}}function b(e){return e.replace(/\*\*(.*?)\*\*/g,"<strong>$1</strong>").replace(/\*(.*?)\*/g,"<em>$1</em>").replace(/\n\n/g,"</p><p>").replace(/\n/g,"<br>").replace(/^/,"<p>").replace(/$/,"</p>")}function Q(){const e=document.querySelectorAll(".tab-button"),n=document.querySelectorAll(".tab-content");if(e.length===0||n.length===0){console.error("Tab elements not found");return}e.forEach(a=>{a.addEventListener("click",function(o){o.preventDefault();const l=this.getAttribute("data-tab");l&&S(l)})});const s=e[0],t=s==null?void 0:s.getAttribute("data-tab");t&&S(t)}function S(e){const n=document.querySelectorAll(".tab-button"),s=document.querySelectorAll(".tab-content");n.forEach(o=>o.classList.remove("active")),s.forEach(o=>{o.classList.remove("active"),o.style.display="none"});const t=document.querySelector(`[data-tab="${e}"]`);t==null||t.classList.add("active");const a=document.getElementById(e);a&&(a.style.display="block",setTimeout(()=>{a.classList.add("active")},50))}function Y(){i.trendQuery&&i.trendCharCount&&i.trendQuery.addEventListener("input",function(){const e=this.value.length;i.trendCharCount&&(i.trendCharCount.textContent=e.toString(),e>180?i.trendCharCount.style.color="#ef4444":e>160?i.trendCharCount.style.color="#f59e0b":i.trendCharCount.style.color="#6b7280")}),i.audienceDescription&&i.audienceCharCount&&i.audienceDescription.addEventListener("input",function(){const e=this.value.length;i.audienceCharCount&&(i.audienceCharCount.textContent=e.toString(),e>450?i.audienceCharCount.style.color="#ef4444":e>400?i.audienceCharCount.style.color="#f59e0b":i.audienceCharCount.style.color="#6b7280")})}function _(){i.trendQuery&&i.trendValidation&&(i.trendQuery.addEventListener("blur",function(){k()}),i.trendQuery.addEventListener("input",function(){i.trendValidation&&(i.trendValidation.textContent="",i.trendValidation.className="validation-message")})),i.audienceDescription&&i.audienceValidation&&(i.audienceDescription.addEventListener("blur",function(){D()}),i.audienceDescription.addEventListener("input",function(){i.audienceValidation&&(i.audienceValidation.textContent="",i.audienceValidation.className="validation-message")}))}function k(){var n,s;const e=((s=(n=i.trendQuery)==null?void 0:n.value)==null?void 0:s.trim())||"";return e.length<3?(m("trendValidation","Please enter at least 3 characters","error"),!1):e.length>200?(m("trendValidation","Please keep your query under 200 characters","error"),!1):(m("trendValidation","Looking good! 👍","success"),!0)}function D(){var n,s;const e=((s=(n=i.audienceDescription)==null?void 0:n.value)==null?void 0:s.trim())||"";return e.length<10?(m("audienceValidation","Please enter at least 10 characters","error"),!1):e.length>500?(m("audienceValidation","Please keep your description under 500 characters","error"),!1):(m("audienceValidation","Looking good! 👍","success"),!0)}function m(e,n,s){const t=document.getElementById(e);t&&(t.textContent=n,t.className=`validation-message ${s}`)}function w(e){const n=document.getElementById(e);n&&(n.style.display="none",n.classList.remove("show"))}function U(){var e;i.rateLimitText&&(i.rateLimitText.textContent="API Usage: 15/15 requests available today"),(e=i.rateLimitDisplay)==null||e.classList.remove("d-none")}async function E(){try{if((await fetch(`${y}/health`,{method:"GET",headers:{Accept:"application/json"}})).ok)$("healthy","🟢 API Connected"),W();else throw new Error("API health check failed")}catch(e){console.warn("⚠️ API connection issue:",e),$("error","🔴 API Disconnected"),Z()}}function $(e,n){const s=i.apiStatus;if(!s)return;const t=s.querySelector(".status-indicator"),a=s.querySelector("span:last-child");t&&(t.className=`status-indicator status-${e}`),a&&(a.textContent=n)}function x(){var n;(n=i.trendLoading)==null||n.classList.remove("d-none");const e=document.getElementById("analyzeBtn");e&&(e.disabled=!0,e.innerHTML='<i class="fas fa-spinner fa-spin"></i> Analyzing...')}function A(){var n;(n=i.trendLoading)==null||n.classList.add("d-none");const e=document.getElementById("analyzeBtn");e&&(e.disabled=!1,e.innerHTML='<i class="fas fa-search"></i> Analyze Trend')}function X(){var e,n;(e=i.trendResults)==null||e.classList.remove("d-none"),(n=i.trendResults)==null||n.classList.add("fade-in")}function M(){var e;(e=i.trendResults)==null||e.classList.add("d-none")}function J(){w("trendValidation")}function q(){var n;(n=i.audienceLoading)==null||n.classList.remove("d-none");const e=document.getElementById("audienceAnalyzeBtn");e&&(e.disabled=!0,e.innerHTML='<i class="fas fa-spinner fa-spin"></i> Analyzing...')}function I(){var n;(n=i.audienceLoading)==null||n.classList.add("d-none");const e=document.getElementById("audienceAnalyzeBtn");e&&(e.disabled=!1,e.innerHTML='<i class="fas fa-users"></i> Analyze Audience')}function K(){var e,n;(e=i.audienceResults)==null||e.classList.remove("d-none"),(n=i.audienceResults)==null||n.classList.add("fade-in")}function z(){var e;(e=i.audienceResults)==null||e.classList.add("d-none")}function G(){w("audienceValidation")}function Z(){var e;(e=i.serverStatusBanner)==null||e.classList.remove("d-none")}function W(){var e;(e=i.serverStatusBanner)==null||e.classList.add("d-none")}function ee(){var n,s;const e=document.querySelector(".tab-content.active");if((e==null?void 0:e.id)==="trendAnalysisTab"){const t=i.trendQuery,a=(n=t==null?void 0:t.value)==null?void 0:n.trim();a?F(a):w("trendValidation")}else if((e==null?void 0:e.id)==="audienceAnalysisTab"){const t=i.audienceDescription,a=(s=t==null?void 0:t.value)==null?void 0:s.trim();a?j(a):w("audienceValidation")}}function te(e){const n=e==="trend"?"trendAdvanced":"audienceAdvanced",s=document.getElementById(n);s&&(s.style.display==="none"||!s.style.display?(s.style.display="block",s.classList.add("show")):(s.style.display="none",s.classList.remove("show")))}function ne(){const e=document.querySelector(".tab-content.active");(e==null?void 0:e.id)==="trendAnalysisTab"?V():(e==null?void 0:e.id)==="audienceAnalysisTab"&&H()}function V(){const e=["sustainable fashion trends","AI-generated art movement","plant-based meat alternatives","remote work culture shift","digital minimalism lifestyle","wellness technology adoption","circular economy practices","virtual reality fitness","social commerce growth","micro-mobility transport"],n=e[Math.floor(Math.random()*e.length)],s=i.trendQuery;if(s){s.value=n;const t=new Event("input");s.dispatchEvent(t),s.focus()}}function H(){const e=["Gen Z eco-conscious consumers aged 18-25 who prioritize sustainability and ethical brands in their purchasing decisions","Tech-savvy millennials working remotely with high disposable income, interested in productivity tools and work-life balance","Luxury fashion enthusiasts aged 25-40 in urban areas who value craftsmanship and exclusive designer pieces","Health-conscious baby boomers interested in wellness technology, fitness tracking, and preventive healthcare solutions","Creative professionals and artists who embrace digital tools, value authenticity, and seek platforms for self-expression","Young parents seeking convenient, family-friendly products and services that save time while ensuring safety","College students passionate about social justice, environmental causes, and affordable lifestyle brands","High-income professionals in finance who value premium, time-saving solutions and status symbol products"],n=e[Math.floor(Math.random()*e.length)],s=i.audienceDescription;if(s){s.value=n;const t=new Event("input");s.dispatchEvent(t),s.focus()}}function ie(){const e=i.trendQuery,n=i.trendIndustry,s=i.trendTimeframe;e&&(e.value="",e.dispatchEvent(new Event("input"))),n&&(n.selectedIndex=0),s&&(s.selectedIndex=1);const t=i.audienceDescription,a=i.audienceCategory,o=i.audienceRegion;t&&(t.value="",t.dispatchEvent(new Event("input"))),a&&(a.selectedIndex=0),o&&(o.selectedIndex=0);const l=i.trendValidation,u=i.audienceValidation;l&&(l.textContent="",l.className="validation-message"),u&&(u.textContent="",u.className="validation-message")}function se(){E()}function ae(){sessionStorage.clear(),localStorage.clear(),location.reload()}function oe(e){console.log(`📄 Exporting ${e} results...`),alert(`Export feature coming soon! (${e} analysis)`)}function re(e){console.log(`💾 Saving ${e} results...`),alert(`Save feature coming soon! (${e} analysis)`)}function le(){alert(`Trend Compass - AI-Powered Trend Forecasting

Combining Qloo's cultural affinity data with Gemini LLM for rich, strategic insights.`)}function ce(){alert(`Privacy Policy

Your data is processed securely and not stored permanently. Analysis requests are sent to our API for processing only.`)}window.retryAnalysis=ee;window.exportResults=oe;window.saveResults=re;window.checkAPIStatus=E;window.showAbout=le;window.showPrivacy=ce;window.toggleAdvancedOptions=te;window.showSampleInputs=ne;window.fillRandomTrend=V;window.fillRandomAudience=H;window.clearAllInputs=ie;window.testConnection=se;window.clearCache=ae;document.readyState==="loading"?document.addEventListener("DOMContentLoaded",T):T();
//# sourceMappingURL=index-DSDG9qvS.js.map
