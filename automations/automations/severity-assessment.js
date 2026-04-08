/**
 * Severity Assessment Automation
 *
 * This automation uses HAI to assess the severity of incoming security reports
 * based on the program's severity definitions.
 */

/**
 * Extracts the "Severity Definitions and Examples" section from a program policy.
 * @param {string} policy - The full program policy text
 * @returns {string|null} - The extracted section or null if not found
 */
function extractSeverityDefinitions(policy) {
  const match = policy.match(/^# Severity Definitions and Examples\n([\s\S]*?)(?=\n# [A-Z])/m);
  return match ? `# Severity Definitions and Examples\n${match[1].trim()}` : null;
}

/**
 * Parses HAI's response to extract severity and reasoning.
 * @param {string} response - The HAI response text
 * @returns {{severity: string|null, reasoning: string|null}}
 */
function parseHaiResponse(response) {
  const severityMatch = response.match(/\**severity\**\s*:?\s*(critical|high|medium|low|none)/i);
  const reasoningMatch = response.match(/\**reasoning\**\s*:?\s*(.*)/i);
  const severity = severityMatch ? severityMatch[1].toLowerCase() : null;
  const reasoning = reasoningMatch ? reasoningMatch[1] : null;
  return { severity, reasoning };
}

exports.extractSeverityDefinitions = extractSeverityDefinitions;
exports.parseHaiResponse = parseHaiResponse;

exports.run = async ({data, config, apiGet, apiPost, apiPut, promptHai}) => {
  const dryRun = true; // <-- Change this to false when ready for production
  const debug = false;  // <-- Set to false to disable debug logging

  // Validate required data
  if (!data.reportId) {
    throw new Error("Missing required reportId in data");
  }

  console.log(`Processing report ${data.reportId} in ${dryRun ? "DRY-RUN" : "PRODUCTION"} mode`);
  if (debug) console.log("DEBUG - input data:", JSON.stringify(data, null, 2));

  // https://docs.hackerone.com/en/articles/9653528-creating-and-running-automations#h_c9d4b0d863
  const report = data.report;
  const program = report.relationships.program;

  // 1. Get the program handle from the report relationships
  const programHandle = program.data.attributes.handle;
  const programId = program.data.id;

  // Despite what the documentation says, the program.data.attributes object does not contain the full policy
  // https://api.hackerone.com/customer-reference/#program
  // Because it's a "program_small" object which only has the handle
  // As a result we need to fetch the full program
  const programResponse = await apiGet(`/programs/${programId}`);
  if (debug) console.log("DEBUG - programResponse:", JSON.stringify(programResponse, null, 2));
  const programPolicy = programResponse.data.attributes.policy;

  // Extract the "Severity Definitions and Examples" section from the policy
  const severityDefinitions = extractSeverityDefinitions(programPolicy);
  if (debug) console.log("DEBUG - severityDefinitions:", JSON.stringify({"severityDefinitions": severityDefinitions}, null, 2));

  if (!severityDefinitions) {
    console.log(`Report ${data.reportId}: Could not find "Severity Definitions and Examples" section in program policy`);
    return;
  }

  // 2. Prepare context and ask HAI for assessment
  const promptMessage = `
The following "Severity Definitions and Examples" section lists out 4 severity definitions and examples.
The 4 severities are Critical, High, Medium and Low.

${severityDefinitions}

# Request

Based on the security vulnerability report above
and the "Severity Definitions and Examples" section which lists the 4 severities,
determine which severity this security vulnerability report should have.

Disregard what severity the security vulnerability report asserts and instead use the examples from the Program Policy
"Severity Definitions and Examples" to determine the correct severity.

Please provide your assessment in this exact format for parsing:

SEVERITY: [Critical/High/Medium/Low/None]
REASONING: [Your explanation]
`;

  // Ask HAI for assessment
  const haiResponse = await promptHai(
    promptMessage,
    {
      reportIds: [data.reportId],
      programHandles: [programHandle]
    }
  );

  if (debug) console.log("DEBUG - haiResponse:", JSON.stringify({"haiResponse": haiResponse}));

  // 6. Parse HAI's response with more flexible regex
  // HAI doesn't always return in exact format, so we need flexible parsing
  const { severity, reasoning } = parseHaiResponse(haiResponse);

  console.log("parsed severity:", severity);
  console.log("parsed reasoning:", reasoning);

  // 7. Take action based on HAI's assessment
  if (severity) {
    const severityMessage = `Automated severity assessment: This report was automatically classified as ${severity} severity.\n\n${haiResponse}`;
    if (dryRun) {
      console.log(`[DRY-RUN] Report ${data.reportId} would have severity set to ${severity}`);
      console.log(`[DRY-RUN] Internal comment that would be added about automated severity assessment : ${JSON.stringify({"severityMessage": severityMessage})}`);
    } else {
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
