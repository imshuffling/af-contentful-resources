# TinyMCE

See forked repo of original: https://github.com/AgoraFinancial/tinymce-contentful

TinyMCE documentation: https://github.com/tinymce/tinymce-contentful

## Version
### 1.0.0 - Release: 3/25/2020
Intial release. Customize to utilize Contentful upload, browse file SDK to tie into editor.

## How It Works
The custom version uses a modified javascript file, currently hosted in S3: https://af-contentful.s3.amazonaws.com/tinymce/

This location can be modified within Contentful for dev purposes, but the src file must be uploaded to a publiclly accessible domain.