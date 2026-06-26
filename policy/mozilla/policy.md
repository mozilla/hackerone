# Table of Contents

1. Program Scope
2. Impact Definitions and Examples
3. Test Plan
4. Submission Guidelines
5. Program Rules
6. Appeal Process
7. Response Targets
8. Disclosure Policy
9. Safe Harbor

# Program Scope

Please check the list of sites under the Scope section, we would like testing to focus on those sites. Other sites and services are considered out of scope of the program unless the bug is critical (see Severity Definitions and Examples above for examples of critical issues)

Our rewards are based on the severity of the issue and the criticality of the service or application. The bounty table lists the range of bounties we pay for vulnerabilities in our applications and **does not apply to out of scope reports**.

The severity is calculated based on the impact of the vulnerability and the likelihood of finding and exploitation the vulnerability, using the below table:

| Impact | Likelihood | Severity
| ------ | ---------- | ------- |
| Critical | High | Critical |
| Critical | Medium | High |
| Critical | Low | Medium |
| High | High | Critical |
| High | Medium | High |
| High | Low | Medium |
| Medium | High | High |
| Medium | Medium | Medium |
| Medium | Low | Low |
| Low | High | Medium |
| Low | Medium | Low |
| Low | Low | Informational |

Below are the definitions of each impact and likelihood level and some examples. Note that these lists are not extensive and the final severity decision is up to the discretion of Mozilla.

# Impact Definitions and Examples

## Critical

Critical vulnerabilities are urgent security issues that present an ongoing or immediate danger to the users of our services and our infrastructure

* Remote Code Execution from an unauthenticated public internet position
* Authentication and Session Management Flaws (which lead to account compromise and takeover)
* Disclosure of secrets in publicly accessible assets
* Hardcoded credentials for a privileged user

**Note that Critical vulnerabilities found in out of scope assets are awarded in the range of $500-$1000.**

## High

 Typically, high severity issues are exploitable web vulnerabilities that can lead to the targeted compromise of a small number of users.

* Account takeover through Oauth misconfiguration
* IDORs that bypass authentication or authorization for significant actions
* CSRF on significant actions, such as changing email/passwords, deleting accounts, etc.
* XSS resulting in conducting significant action (i.e., not defacement, phishing, cookie injection, etc.)
* XML External Entity (XXE) attack
* Hardcoded credentials for a non-privileged user

## Medium

 Vulnerabilities which can provide an attacker additional information or positioning that could be used in combination with other vulnerabilities. In addition to issues resulting from the lack of standard defense in depth techniques and security controls.

* XSS (minor)
* Domain takeovers supported by a proof of concept for `*.mozilla.org`, `*.mozilla.com`, `*.mozilla.net`, `*.firefox.com`, `*.mozgcp.net` and `*.mozaws.net` in addition to the list of sites in scope (excluding staging instances). If the domain is pointing to a claimed instance by another company, then the report will not be eligible for bounty.
* SSRF which leads to reaching **internal** network hosts
* Disclosure of sensitive information which does not expose the user or organization to immediate risk
* CSRF for minor actions.

## Low

 Minor security vulnerabilities which could lead to leaks or spoofs of non-sensitive information. Missing best practice security controls

* XSS (blocked by CSP)
* Clickjacking with demonstrated impact (Lack of clickjacking protection (XFO, CSP) is insufficient to claim a bounty)
* External SSRF

**Note that some low severity issues are not eligible for monetary awards based on their impact.**

# Likelihood Definitions and Examples

Below are some of the factors we take into consideration when determining the likelihood:

* Public internet access vs access from the internal network
* Authenticated vs unauthenticated access
* Required permissions and access level
* Required user interactions
* Attack complexity
* Mitigating security controls

## High

* The vulnerability can be exploited using unauthenticated public internet access
* The vulnerability can be exploited using an authenticated regular user without any special privileges
* The vulnerability can be exploited without any user interaction
* Hard corded credentials in a publicly accessible resource

## Medium

* The vulnerability requires one user interaction to be exploited
* The vulnerability requires low level permissions which are provided to regular users to be exploited

## Low

* The vulnerability requires admin access or high level permissions which are only given to specific users in order to be exploited
* The vulnerability requires local device access to be exploited
* The vulnerability requires multiple user interactions to be exploited
* The vulnerability is mitigated by WAF, CSP or other security controls
 
# Out of Scope

* We follow HackerOne's standard for [Core Ineligible Findings](https://docs.hackerone.com/en/articles/8494488-core-ineligible-findings).
* In addition to the [custom scope exclusions](https://hackerone.com/mozilla?type=team#scope_exclusions) listed on our policy page

# Misc Notes

We have a bug bounty panel whose members decide whether a report is eligible for bounty and the bounty amount for eligible reports. The panel meets on a weekly basis, except for holidays and vacations, to discuss bounty decisions.

Please note these are general guidelines, and reward decisions are up to the discretion of Mozilla.

# Test Plan

* Whenever it is explicitly stated in our program scope, you are expected to test only on the provided instances (e.g. staging) instead of production.
* We ask that hackers test the application on the staging environment instead of the production environment. This will help ensure that any potential vulnerabilities are identified and addressed before they can be exploited in the production environment. Additionally, testing on the staging environment will help minimize any potential disruption to the production environment.

# Submission Guidelines

* Make sure to review our program policy and scope before submitting to our program.
* Make sure to use the provided submission template in the report. The report should only include the summary of the issue, clear steps to reproduce, supporting proof of concept and the impact statement.
* Make sure to add supporting evidence for the bug by including screenshots and video PoC to clearly show the steps to reproduce
* We would like to have enough information to validate the report, but excessively verbose and long reports which include extraneous information create additional burden on the triage team and should be avoided. Follow up comments and answers to our questions should also be to the point and not include extraneous information.
* Our program policy lists an extensive list of out of scope vulnerabilities, including [invalid reports which are frequently reported](https://bugzilla.mozilla.org/show_bug.cgi?id=1830029). Make sure the issue you are reporting is not one of them.
* When reporting information disclosure vulnerabilities, note that most Mozilla projects and code are open source and content on most sites is intentionally public.
* Reports on Firefox clients are out of scope of our web bug bounty program and they should be submitted using the form: https://bugzilla.mozilla.org/form.client.bounty

# Program Rules

Please provide detailed reports with reproducible steps. If the report is not detailed enough to reproduce the issue, the issue will not be eligible for a reward.

To be eligible for a reward under this program:

* The security bug must be original and previously unreported.
* The security bug must be a part of Mozilla's code, not the code of a third party. We will pay bounties for vulnerabilities in third-party libraries incorporated into shipped client code or third-party websites utilized by Mozilla.
* You must not have written the buggy code or otherwise been involved in contributing the buggy code to the Mozilla project.
* You must be old enough to be eligible to participate in and receive payment from this program in your jurisdiction, or otherwise qualify to receive payment, whether through consent from your parent or guardian or some other way.
* You must not be an employee, contractor, or otherwise have a business relationship with the Mozilla Foundation or any of its subsidiaries.
* You should use your best effort not to access, modify, delete, or store user data or Mozilla's data. Instead, use your own accounts or test accounts for security research purposes.
* If you inadvertently access, modify, delete, or store user data, we ask that you notify Mozilla immediately at security@mozilla.org and delete any stored data after notifying us.
* You should also use your best effort not to harm the availability or stability of our services, for example, by running aggressive scanning of those services. Instead, use a local development instance of the service that you want to test.
* Whenever it is explicitly stated in our program scope, you are expected to test on the provided instances (e.g. staging) instead of production.
* You must not be on a US sanctions list or in a country (e.g. Cuba, Iran, North Korea, Crimea region of Ukraine, Sudan, and Syria) on the US sanctions list.
* You must not exploit the security vulnerability for your own gain.
* Before sharing any part of the security issue with a third party, you must give us a reasonable amount of time to address the security issue.
* All submissions will be covered under [Mozilla's Website & Communications Terms of Use](https://www.mozilla.org/en-US/about/legal/terms/mozilla/), granting us permission to make use of all submissions.
* All submissions must also abide by [HackerOne Code of Conduct](https://www.hackerone.com/policies/code-of-conduct) and [Mozilla Community Participation Guidelines](https://www.mozilla.org/en-US/about/governance/policies/participation/).
* Bounties can be donated to charity. Please follow the [HackerOne process](https://docs.hackerone.com/hackers/payments.html#donating-bounties-to-charity) if you would like to donate your bounty money.
* Do not threaten or attempt to extort Mozilla. We will not award a bounty if you threaten to withhold the security issue from us or if you threaten to release the vulnerability or any exposed data to the public.

# Appeal Process
Hackers may appeal the decision made regarding the status of reports only once by commenting on the report and providing additional information to the report which demonstrates the impact of the reported issue on the asset. If no additional information is provided then the report status will be final.

Valid reasons for appeal:
* The H1 triager closes the report as informative or duplicate and no longer responds to the hacker.
* The report is closed as informative or duplicate and the hacker provides additional information which proves otherwise.

# Response Targets

Mozilla will make a best effort to meet the following SLAs for hackers participating in our program:

| Type of Response | SLA in business days |
| ------------- | ------------- |
| First Response | 5 days |
| Time to Triage | 10 days |
| Time to Bounty | 30 days |
| Time to Resolution | depends on severity and complexity |

We'll try to keep you informed about our progress throughout the process.

# Disclosure Policy

* Our program discloses security reports when they are fixed and rewarded. We make exceptions in case reporters have a valid reason for not using full disclosure or when they need more time in the research before the report is disclosed. We can consider partial disclosure in those cases, we can discuss and agree on the type of disclosure.
* Disclosure will be done every two weeks, on the first and third Tuesday of the month. This cadence is required to prepare our H1 triage pod for an increase in report volume after disclosing reports.
* Follow HackerOne's [disclosure guidelines](https://www.hackerone.com/disclosure-guidelines).

# Safe Harbor

Mozilla strongly supports security research into our products and wants to encourage that research. Therefore, we have enabled the [Gold Standard Safe Harbor policy](https://hackerone.com/mozilla_core_services/safe_harbor) in our program.

If you're not sure whether your conduct complies with this policy, please contact us first at security@mozilla.org and we will do our best to clarify.
