// automation script for exporting hackerone reports to bugzilla
// the automation will run when the custom field 'export to bugzilla' is checked
// the script relies on adding  bugzilla_url and bugzilla_api_key as secrets in the automation

exports.run = async ({data, config, apiGet, apiPost, getSecret, promptHai}) => { 
  // Validate that this is a custom field update activity
  if (data.activity?.type !== 'activity-report-custom-field-value-updated') {
    return { 
      status: 'noop', 
      comment: 'Not a custom field update activity' 
    };
  }
  
  // Check if the updated custom field is "export to bugzilla"
  const customFieldLabel = data.activity?.relationships?.custom_field_attribute?.data?.attributes?.label;
  
  if (!customFieldLabel || customFieldLabel.toLowerCase() !== 'export to bugzilla') {
    return { 
      status: 'noop', 
      comment: 'export to bugzilla field was not updated' 
    };
  }
  
  // Check if the checkbox is now checked (new_value should be truthy for a checked checkbox)
  const newValue = data.activity?.attributes?.new_value;
  
  // For checkbox fields, the value is typically "true" or "1" when checked
  if (!newValue || (newValue !== 'true' && newValue !== '1' && newValue !== 'checked')) {
    return { 
      status: 'noop', 
      comment: 'export to bugzilla field is not checked' 
    };
  }

  // Validate required data
  if (!data.reportId) {
    throw new Error("Missing required reportId in data");
  }

  // Fetch the full report details
  const report = await apiGet(`/reports/${data.reportId}`);
  const reportData = report.data;
  
  // Get Bugzilla credentials from secrets
  const bugzillaUrl = await getSecret('bugzilla_url');
  const bugzillaApiKey = await getSecret('bugzilla_api_key');

  // Extract report information
  const title = reportData.attributes.title;
  const vulnerabilityInfo = reportData.attributes.vulnerability_information;
  const severity = reportData.relationships?.severity?.data?.attributes;
  const weakness = reportData.relationships?.weakness?.data?.attributes;
  const submissionDate = reportData.attributes.created_at;
  const reporter = reportData.relationships?.reporter?.data?.attributes.username

  // Prepare Bugzilla bug data
  const bugzillaData = {
    product: 'Websites',
    component: 'Other',
    summary: `[HackerOne] ${title}`,
    groups: 'websites-security',
    type: 'defect',
    description: `
Link: https://hackerone.com/reports/${data.reportId}
Date: ${submissionDate}
By: ${reporter}
Severity: ${severity?.rating || 'N/A'}
Weakness: ${weakness?.name || 'N/A'}

${vulnerabilityInfo}
    `.trim()
  };

  // Create the bug in Bugzilla
  const bugzillaResponse = await fetch(`${bugzillaUrl}/rest/bug`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-BUGZILLA-API-KEY': bugzillaApiKey
    },
    body: JSON.stringify(bugzillaData)
  });

  if (!bugzillaResponse.ok) {
    const errorText = await bugzillaResponse.text();
    throw new Error(`Failed to create Bugzilla bug: ${bugzillaResponse.statusText} - ${errorText}`);
  }

  const bugzillaResult = await bugzillaResponse.json();
  const bugId = bugzillaResult.id; 

  console.log(`Successfully exported report ${data.reportId} to Bugzilla bug ${bugId}, URL: ${bugzillaUrl}/show_bug.cgi?id=${bugId}`);
   
  // Access attachments from the report data
  const attachments = reportData.relationships?.attachments?.data || [];

  if (attachments.length !== 0) {
    // Upload attachments to Bugzilla
    console.log(`Uploading ${attachments.length} attachments to bugzilla bug ${bugId}`);
    
    for (const attachment of attachments) {
      try {
        const attachmentUrl = attachment.attributes?.expiring_url;
        const fileName = attachment.attributes?.file_name;
        const contentType = attachment.attributes?.content_type;
        
        if (!attachmentUrl) continue;

        // Download the attachment from HackerOne
        const fileResponse = await fetch(attachmentUrl);
        if (!fileResponse.ok) continue;

        const fileBuffer = await fileResponse.arrayBuffer();
        const base64Data = Buffer.from(fileBuffer).toString('base64');

        // Upload to Bugzilla
        await fetch(`${bugzillaUrl}/rest/bug/${bugId}/attachment`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-BUGZILLA-API-KEY': bugzillaApiKey
          },
          body: JSON.stringify({
            ids: [bugId],
            data: base64Data,
            file_name: fileName,
            content_type: contentType,
            summary: `F${attachment.id}`
          })
        });
      } catch (error) {
        console.log(`Failed to upload attachment ${attachment.attributes?.file_name}: ${error.message}`);
        // Continue with other attachments
      }
    }
  }
  
  // Set manual reference on the report
  await apiPost(`/reports/${data.reportId}/issue_tracker_reference_id`,
      JSON.stringify({
          "data": {
              "type": "issue-tracker-reference-id",
              "attributes": {
                  "reference": `${bugId}`
                
              }
          }
      })
  );

  // add internal link with the bug link  
  await apiPost(
    `/reports/${data.reportId}/activities`,
    JSON.stringify({
      data: {
        type: 'activity-comment',
        attributes: {
          message: `Report successfully exported to Bugzilla: ${bugzillaUrl}/show_bug.cgi?id=${bugId}`,
          internal: true
        }
      }
    })
  );
};
