# Table of Contents

1. Program Scope  
2. Bounty Table  
3. Severity Definitions and Examples  
4. Test Plan  
5. Submission Guidelines  
6. Program Rules  
7. Appeal Process  
8. Response Targets  
9. Disclosure Policy  
10. Safe Harbor  
11. Miscellaneous Notes

# Program Scope

Testing should focus on sites listed in the Scope section. Other sites and services are out of scope unless the bug is critical (see Severity Definitions and Examples).

For out of scope vulnerabilities, we follow HackerOne's standard for [Core Ineligible Findings](https://docs.hackerone.com/en/articles/8494488-core-ineligible-findings), in addition to the [custom scope exclusions](https://hackerone.com/mozilla?type=team#scope_exclusions) listed on our policy page.

# Bounty Table

Our rewards are based on the severity of the issue and the criticality of the service or application. The below bounty table lists the range of bounties we pay for vulnerabilities in our applications and does not apply to out of scope reports.

| Asset Category | High | Critical |
| :---- | :---- | :---- |
| Critical Sites | $3,000 – $6,000 | $6,000 – $15,000 |
| Core Sites | $1,000 – $3,000 | $3,000 – $5,000 |

**Note that Critical vulnerabilities found in out of scope assets are awarded in the range of $500-$1000.**

# Severity Definitions and Examples

We do not rely on the CVSS scoring method to calculate severity. Instead, we rely on analyzing the impact and likelihood of the issue.

**Impact** measures the potential damage if the vulnerability is successfully exploited.

**Likelihood** considers how feasible it is for a researcher or attacker to discover and successfully exploit the vulnerability, taking into account factors such as required privileges, complexity, exploitability, and environmental constraints.

The intersection of **Impact** and **Likelihood** determines the final **Severity**, which is used for bug bounty prioritization and reward decisions. Below is the matrix which shows the calculated severity based on impact and likelihood.

| Impact ↓ / Likelihood → | High | Medium | Low |
| :---- | :---- | :---- | :---- |
| Critical | Critical | High | Medium |
| High | Critical | High | Medium |
| Medium | High | Medium | Low |
| Low | Medium | Low | Informative |

Low and medium severity reports are not eligible for bounty. Mozilla might choose to fix the issues but the reports would still not be eligible for bounty.

Below are the definitions of each impact and likelihood level and some examples. Note that these lists are not extensive and the final severity decision is up to the discretion of Mozilla.

## Impact

### Critical

Critical vulnerabilities are urgent security issues that present an ongoing or immediate danger to a large number of users of our services and our infrastructure. Examples include:

* Remote Code Execution from an unauthenticated public internet position  
* Authentication and Session Management Flaws (which lead to account compromise and takeover)  
* Disclosure of secrets in publicly accessible assets  
* Hardcoded credentials for a privileged user

### High

Typically, high severity issues are exploitable web vulnerabilities that can lead to the targeted compromise of a small number of users. Examples include:

* Account takeover through Oauth misconfiguration  
* IDORs that bypass authentication or authorization for significant actions  
* CSRF on significant actions, such as changing email/passwords, deleting accounts, etc.  
* XSS resulting in conducting significant action (i.e., not defacement, phishing, cookie injection, etc.)  
* XML External Entity (XXE) attack  
* Hardcoded credentials for a non-privileged user

### Medium

Vulnerabilities which can provide an attacker additional information or positioning that could be used in combination with other vulnerabilities. In addition to issues resulting from the lack of standard defense in depth techniques and security controls.

* XSS (minor)  
* Domain takeovers supported by a proof of concept for `*.mozilla.org`, `*.mozilla.com`, `*.mozilla.net`, `*.firefox.com`, `*.mozgcp.net` and `*.mozaws.net` in addition to the list of sites in scope (excluding staging instances). If the domain is pointing to a claimed instance by another company, then the report will not be eligible for bounty.  
* SSRF which leads to reaching **internal** network hosts  
* Disclosure of sensitive information which does not expose the user or organization to immediate risk  
* CSRF for minor actions.

### Low

Minor security vulnerabilities which could lead to leaks or spoofs of non-sensitive information. Missing best practice security controls

* XSS (blocked by CSP)  
* Clickjacking with demonstrated impact (Lack of clickjacking protection (XFO, CSP) is insufficient to claim a bounty)  
* External SSRF  
* Injection attacks which require privileged access to modify content

## Likelihood

Below are **some** of the factors we take into consideration when determining the likelihood:

* Public internet access vs access from the internal network  
* Authenticated vs unauthenticated access  
* Required permissions and access level  
* Required user interactions  
* Attack complexity  
* Mitigating security controls

### High

* The vulnerability can be exploited using unauthenticated public internet access  
* The vulnerability can be exploited using an authenticated regular user without any special privileges  
* The vulnerability can be exploited without any user interaction  
* Hardcoded credentials in a publicly accessible resource

### Medium

* The vulnerability requires one user interaction to be exploited  
* The vulnerability requires low level permissions which are provided to regular users to be exploited

### Low

* The vulnerability requires admin access or high level permissions which are only given to specific users in order to be exploited  
* The vulnerability requires local device access to be exploited  
* The vulnerability requires multiple user interactions to be exploited  
* The vulnerability is mitigated by WAF, CSP or other security controls

# Test Plan

* We ask that hackers test the application on the staging environment instead of the production environment. This will help ensure that any potential vulnerabilities are identified and addressed before they can be exploited in the production environment. Additionally, testing on the staging environment will help minimize any potential disruption to the production environment.  
* When reporting reflected XSS vulnerabilities, the affected URL along with a working payload is usually sufficient. For stored XSS attacks, please describe the step-by-step exploit process. Please use `alert(document.domain)` and not `alert(1)` in your proof-of-concept, and do not use malicious payloads.  
* Make sure that you are not using harmful and malicious payloads in your proof-of-concept, which could impact other users, especially when reporting npm or pip packages takeover.

# Submission Guidelines

* Review our program policy and scope before submitting to our program.  
* Submissions must be in the required template to be accepted. The template includes: summary of the issue, clear steps to reproduce, supporting proof of concept and the impact statement.  
* Supporting evidence for the bug is required, including screenshots and video PoC to clearly show the steps to reproduce it.  
* Excessively verbose and long reports will not be accepted.  
* Follow up comments and answers to our questions should also be to the point and not include extraneous information.  
* AI-assisted submissions must follow the above guidelines and Hackerone's [code of conduct](https://www.hackerone.com/policies/code-of-conduct), otherwise the report will be closed as Not Applicable.  
* Our program policy lists an extensive list of out of scope vulnerabilities, including [invalid reports which are frequently reported](https://bugzilla.mozilla.org/show_bug.cgi?id=1830029). Verify the issue is not already listed in our out of scope vulnerabilities before submitting.  
* When reporting information disclosure vulnerabilities, note that most Mozilla projects and code are open source and content on most sites is intentionally public.  
* Reports on Firefox and Mozilla VPN clients are out of scope of our web bug bounty program and they should be submitted using the form: https://bugzilla.mozilla.org/form.client.bounty

# Program Rules

Please provide detailed reports with reproducible steps. If the report is not detailed enough to reproduce the issue, the issue will not be eligible for a reward.

To be eligible for a reward under this program:

* The security bug must be original and previously unreported.  
* The security bug must be a part of Mozilla's code, not the code of a third party. We will pay bounties for vulnerabilities in third-party libraries incorporated into shipped client code or third-party websites utilized by Mozilla.  
* You must not have written the buggy code or otherwise been involved in contributing the buggy code to the Mozilla project.  
* You must be old enough to be eligible to participate in and receive payment from this program in your jurisdiction, or otherwise qualify to receive payment, whether through consent from your parent or guardian or some other way.  
* You must not be an employee, contractor, or otherwise have a business relationship with the Mozilla Foundation or any of its subsidiaries.  
* You should use your best effort not to access, modify, delete, or store user data or Mozilla's data. Instead, use your own accounts or test accounts for security research purposes.  
* If you inadvertently access, modify, delete, or store user data, we ask that you notify Mozilla immediately at [security@mozilla.org](mailto:security@mozilla.org) and delete any stored data after notifying us.  
* You should also use your best effort not to harm the availability or stability of our services, for example, by running aggressive scanning of those services. Instead, use a local development instance of the service that you want to test.  
* Whenever it is explicitly stated in our program scope, you are expected to test on the provided instances (e.g. staging) instead of production.  
* You must not be on a US sanctions list or in a country (e.g. Cuba, Iran, North Korea, Crimea region of Ukraine, Sudan, and Syria) on the US sanctions list.  
* You must not exploit the security vulnerability for your own gain.  
* Before sharing any part of the security issue with a third party, you must give us a reasonable amount of time to address the security issue.  
* All submissions will be covered under [Mozilla's Website & Communications Terms of Use](https://www.mozilla.org/en-US/about/legal/terms/mozilla/), granting us permission to make use of all submissions.  
* All submissions must also abide by [HackerOne Code of Conduct](https://www.hackerone.com/policies/code-of-conduct) and [Mozilla Community Participation Guidelines](https://www.mozilla.org/en-US/about/governance/policies/participation/).  
* Bounties can be donated to charity. Please follow the [HackerOne process](https://docs.hackerone.com/hackers/payments.html#donating-bounties-to-charity) if you would like to donate your bounty money.  
* Do not threaten or attempt to extort Mozilla. We will not award a bounty if you threaten to withhold the security issue from us or if you threaten to release the vulnerability or any exposed data to the public.  
* In certain situations such as increased report volume, we might resort to [pausing our Hackerone program](https://docs.hackerone.com/en/articles/8499776-pausing-report-submissions). In this case, the program will no longer accept new submissions. We will make sure to send out communication when we pause and re-enable report submissions.

# Appeal Process

Hackers may appeal the decision made regarding the status of reports only once by commenting on the report and providing additional information to the report which demonstrates the impact of the reported issue on the asset. If no additional information is provided then the report status will be final.

Valid reasons for appeal:

* The report is closed as informative or duplicate and the hacker provides additional information which proves otherwise.  
* The hacker was able to prove higher impact for the issue or a different method of exploiting it.

Reporters can also use mediation requests on Hackerone for appealing decisions if they do not get a response from us within a week.

Note: while report status decisions can be appealed once with new evidence, bounty amount decisions are final.

# Response Targets

Mozilla will make a best effort to meet the following SLAs for hackers participating in our program:

| Type of Response | SLA in business days |
| :---- | :---- |
| First Response | 5 days |
| Time to Triage | 10 days |
| Time to Bounty | 30 days |
| Time to Resolution | depends on severity and complexity |

We'll try to keep you informed about our progress throughout the process.

# Disclosure Policy

* Our program discloses security reports when they are fixed and rewarded. We make exceptions in case reporters have a valid reason for not using full disclosure or when they need more time in the research before the report is disclosed. We can consider partial disclosure in those cases, we can discuss and agree on the type of disclosure.  
* Disclosure will be limited to impactful reports that provide meaningful value to the security community.  
* Follow HackerOne's [disclosure guidelines](https://www.hackerone.com/disclosure-guidelines).

# Safe Harbor

Mozilla strongly supports security research into our products and wants to encourage that research. Therefore, we have enabled the [Gold Standard Safe Harbor policy](https://hackerone.com/mozilla_core_services/safe_harbor) in our program.

If you're not sure whether your conduct complies with this policy, please contact us first at [security@mozilla.org](mailto:security@mozilla.org) and we will do our best to clarify.

# Miscellaneous Notes

We have a bug bounty panel whose members decide whether a report is eligible for bounty and the bounty amount for eligible reports. The panel meets on a weekly basis, except for holidays and vacations, to discuss bounty decisions. 
