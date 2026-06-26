Below is the list of scope exclusions we added to our policy, they can be modified on the page https://hackerone.com/mozilla/policy.

| Category | Exclusion details | 
| ------ | ---------- | 
| List of frequently reported invalid reports | Frequently reported issues which do not pose a security risk to users and aren't eligible for a bounty such as the ones tracked in this tracker bug: https://bugzilla.mozilla.org/show_bug.cgi?id=1830029
|User credentials caches |Data dumps that include user email and password combinations could be obtained in many ways (indexing services, OSINT tools and web forums) and they do not help us identify any flaw in our software and are therefore out of scope for this bug bounty program.|
|Information Disclosure in open source projects|Information disclosure vulnerabilities are out of scope of our program. Most Mozilla projects and code are open source and content on most sites is intentionally public including employees and contributors names and email addresses which are used to attribute their contributions|
|Blind SSRF|Blind SSRF reports on services that are designed to load resources from the internet.|
|Source Code Disclosure|Most of our code is open source and intentionally public|
|Executing scripts on sandboxed domains|Executing scripts on sandboxed domains (such as bmoattachments or mozillademos) are out of scope since we specifically created those domains to safely execute scripts.|
|Denial-of-service attacks or issues related to rate limiting|Denial-of-services bugs are generally less serious than other web application security bugs and in many cases don't require a technical vulnerability within the web application.|
|Missing HTTP headers|Reports of missing HTTP headers are out of scope except as where their absence fails to mitigate an existing attack|
|Firefox Clients|Reports in Firefox clients are out of scope of our program and they should be submitted using the form: bugzilla.mozilla.org/form.client.bounty|
|Cross Window Forgery|Reports of Cross Window Forgery are out of scope. CWF issues are known issues and we are working on a Mozilla wide solution for them.|
|Issues in Mozilla VPN Inspector|Issues discovered in Mozilla VPN in the web inspector while VPN is in development mode are out of scope, since the inspector exposes endpoints and methods to interact with the VPN for testing purposes.|
|Injection attacks which require admin access|Injection attacks such stored XSS and HTML injection which require admin access to the application are out of scope since the likelihood of exploiting them is considered low|
