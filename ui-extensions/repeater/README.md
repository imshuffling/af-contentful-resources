# Repeater

Like Advanced Custom Fields with WordPress, but y'know, for Contentful. This UI extensions is intended to be configurable so that it doesn't rely on a single set of fields. A single Contentful space can have one instance of the Repeater UI extension and uses externally hosted config files to determine the fields that are generated.

## Version
### 1.0.0 - Release: 3/10/2020
Intial release. Basic configuration options, simple UI and design.

## How It Works
This extension relies on a externally hosted JSON config file that must be created in order to set-up your fields. **Currently, the config supports the following form types:**
* Basic Input (text, email, number)
* Textarea
* Select / Multiselect
* Radio / Checkboxes

Example JSON config: https://af-contentful.s3.amazonaws.com/config/master-template.json

## Settings
Each instance of the extension in a content model has three (3) setting options:
1. **Config URL:** Externally hosted config.
2. **Layout:** Display as multi-column rows (table) of fields, or as single column rows with a single field per row.
3. **Description:** Simple explanation for a given field set.

## Future Updates
* Validation per field, set via config (TBD: Regex, jQuery Validation, etc.)
* Additional fields (TBD: Reference)

## Configs
* Stock Recommendations: https://af-contentful.s3.amazonaws.com/config/stock-recommendations.json
