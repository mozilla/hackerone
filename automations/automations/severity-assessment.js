/**
 * Severity Assessment Automation
 *
 * This automation uses HAI to assess the severity of incoming security reports
 * based on the program's severity definitions.
 */


/**
 * Parses HAI's response to extract severity and reasoning.
 * @param {string} response - The HAI response text
 * @returns {{severity: string|null, reasoning: string|null}}
 */
function parseHaiResponse(response) {
  const severityMatch = response.match(/\**severity\**\s*:?\s*(critical|high|medium|moderate|low|none)/i);
  const reasoningMatch = response.match(/\**reasoning\**\s*:?\s*(.*)/i);
  // Normalize "moderate" to "medium" for the API
  const severity = severityMatch ? severityMatch[1].toLowerCase().replace('moderate', 'medium') : null;

  const reasoning = reasoningMatch ? reasoningMatch[1] : null;
  return { severity, reasoning };
}

exports.parseHaiResponse = parseHaiResponse;

exports.run = async ({data, config, apiGet, apiPost, apiPut, promptHai}) => {
  // Configuration - Set to true for testing (logs only), false for production (makes actual changes)
  const dryRun = true; // <-- Change this to false when ready for production
  const debug = false;  // <-- Set to false to disable debug logging

  // Validate required data
  if (!data.reportId) {
    throw new Error("Missing required reportId in data");
  }

  console.log(`Processing report ${data.reportId} in ${dryRun ? "DRY-RUN" : "PRODUCTION"} mode`);

  const report = data.report;
  const program = report.relationships.program;
  const programId = program.data.id;

  if (debug) console.log("DEBUG - input data:", JSON.stringify(data, null, 2));

  // Fetch scope exclusions
  const scopeExclusionsRes = await apiGet(`/programs/${programId}/scope_exclusions`);

  // Format the exclusions for your prompt
  let exclusionsText = "";
  if (scopeExclusionsRes.data && scopeExclusionsRes.data.length > 0) {
    exclusionsText = scopeExclusionsRes.data.map(exclusion => {
      const category = exclusion.attributes.category;
      const details = exclusion.attributes.details;
      return `- ${category}: ${details}`;
    }).join("\n");
  }

  // 2. Prepare context and ask HAI for assessment
  const promptMessage = `
Using the "Severity Definitions and Examples" section in the Mozilla program policy, assess the severity of security vulnerability report #${data.reportId}. The 4 severities are Critical, High, Medium and Low.

**Scope Exclusions from Mozilla's program page:**

${exclusionsText}

Consider:
- Prerequisites for exploitation (authentication, permissions, user interaction)
- Demonstrated vs theoretical impact (code analysis vs working PoC)
- Whether the vulnerability bypasses actual security enforcement or affects advisory/informational elements
- Mozilla's impact and likelihood definitions and matrix
- Scope exclusions listed above
- Hackerone's Core ineligible findings https://docs.hackerone.com/en/articles/8494488-core-ineligible-findings

Critical Rules:
- First check if the vulnerability falls under scope exclusions or core ineligible findings - if yes, severity should be "None"
- Disregard the severity the reporter asserts - use only Mozilla's definitions and examples
- Prioritize practical demonstrated impact over theoretical code analysis
- Consider the full exploitation context and real-world feasibility
- Keep the response concise and limited to the output format described below


Output Format:
Provide your assessment in this exact format for parsing:

SEVERITY: [Critical/High/Medium/Low/None]

REASONING: [Provide a brief explanation in 3-4 concise sentences covering:
1. Whether the issue falls under scope exclusions or core ineligible findings (if applicable)
2. What the vulnerability technically allows and prerequisites
3. Whether impact is demonstrated or theoretical, and if it bypasses actual security controls
4. How this maps to Mozilla's impact and likelihood levels
5. Final severity per Mozilla's matrix]
`;

  // Ask HAI for assessment
  // more info about promptHai https://docs.hackerone.com/en/articles/9653528-creating-and-running-automations
  // it doesn't look like there is a way to disable logging when polling for the response, the helper method does the logging
  const haiResponse = await promptHai(
    promptMessage,
    {
      reportIds: [data.reportId],
      programHandles: ["mozilla"]
    }
  );

  // 6. Parse HAI's response with more flexible regex
  // HAI doesn't always return in exact format, so we need flexible parsing
  const { severity, reasoning } = parseHaiResponse(haiResponse);

  if (debug) {
    console.log("DEBUG - parsed severity:", severity);
    console.log("DEBUG - parsed reasoning:", reasoning);
  }

  // 7. Take action based on HAI's assessment
  if (severity) {
    const severityMessage = `Automated severity assessment: This report was automatically classified as ${severity} severity.\n\n ${haiResponse} `;
    
    console.log(`[DRY-RUN] Report ${data.reportId} would have severity set to ${severity}`);
    
    // Add an internal comment about the automated assessment
    // https://api.hackerone.com/customer-resources/#reports-create-comment
    
    const commentResponse = await apiPost(`/reports/${data.reportId}/activities`,
      JSON.stringify({
        data: {
          type: "activity-comment",
          attributes: {
            message: severityMessage,
            internal: true
          }
        }
      })
    );

    if (debug) console.log("DEBUG - commentResponse:", JSON.stringify(commentResponse, null, 2));
    
    if (!dryRun) {
      // Set the severity field on the report
      // https://api.hackerone.com/customer-resources/#reports-update-severity
      const severityResponse = await apiPut(`/reports/${data.reportId}/severities`,
        JSON.stringify({
          data: {
            type: "severity",
            attributes: {
              rating: severity,  // https://api.hackerone.com/customer-reference/#severity-ratings
              message: haiResponse
            }
          }
        })
      );
      
      if (debug) console.log("DEBUG - severityResponse:", JSON.stringify(severityResponse, null, 2));

      console.log(`Report ${data.reportId} severity set to ${severity}`);
    }
  } else {
    // If we can't determine severity
    console.log(`Report ${data.reportId} severity could not be determined`);

    if (!dryRun) {
      const manualReviewResponse = await apiPost(`/reports/${data.reportId}/activities`,
        JSON.stringify({
          data: {
            type: "activity-comment",
            attributes: {
              message: `Automated assessment: This report requires manual severity determination.\n\n${haiResponse}`,
              internal: true
            }
          }
        })
      );
      if (debug) console.log("DEBUG - manualReviewResponse:", JSON.stringify(manualReviewResponse, null, 2));
    }
  }
};
