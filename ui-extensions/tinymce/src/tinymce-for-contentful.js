/**
 * Custom TinyMCE UI Extentsion for Contentful
 * Author: Agora Financial, LLC
 * Repo: https://github.com/tinymce/tinymce-contentful
 * TinyMCE Documentation: https://www.tiny.cloud/docs
 * @version 1.0.0
 */

// Set default for CF SDK
const locale = "en-US";

// Run CF SDK
window.contentfulExtension.init(function(api) {
  
  /**
   * Init for TinyMCE
   * @param  {object} api
   * @return {null}
   */
  function tinymceForContentful(api) {
    api.window.startAutoResizer();

    // Clean up TinyMCE default vars from CF
    function tweak(param) {
      var t = param.trim();
      if (t === "false") {
        return false;
      } else if (t === "") {
        return undefined;
      } else {
        return t;
      }
    }

    // Params from CF
    var tb = tweak(api.parameters.instance.toolbar);
    var mb = tweak(api.parameters.instance.menubar);

    // TinyMCE Init
    tinymce.init({
      selector: "#editor",
      plugins: api.parameters.instance.plugins,
      toolbar: tb,
      menubar: mb,
      max_height: 640,
      min_height: 400,
      autoresize_bottom_margin: 15,
      resize: false,
      image_title: true,
      image_caption: true,
      image_description: true,
      branding: false,
      
      // Enable file browser
      file_picker_types: 'file image media',
      file_picker_callback: browseAssets,

      // Add upload button
      setup: (editor) => {
        editor.ui.registry.addButton('assetUpload', {
          icon: 'upload',
          tooltip: 'Upload new asset',
          onAction: () => {
            uploadAsset( editor );
          }
        });
      },

      // TinyMCE calback on init
      init_instance_callback : function(editor) {
        var listening = true;

        function getEditorContent() {
          return editor.getContent() || '';
        }

        function getApiContent() {
          return api.field.getValue() || '';
        }

        function setContent(x) {
          var apiContent = x || '';
          var editorContent = getEditorContent();
          if (apiContent !== editorContent) {
            editor.setContent(apiContent);
          }
        }

        // Set old content
        setContent(api.field.getValue());

        // Listener
        api.field.onValueChanged(function(x) {
          if (listening) {
            setContent(x);
          }
        });

        // Change listener
        function onEditorChange() {
          var editorContent = getEditorContent(),
              apiContent = getApiContent();

          if (editorContent !== apiContent) {
            listening = false;
            api.field.setValue(editorContent).then(function() {
              listening = true;
            }).catch(function(err) {
              console.log("Error setting content", err);
              listening = true;
            });
          }
        }

        var throttled = _.throttle(onEditorChange, 500, {leading: true});
        editor.on('change keyup setcontent blur', throttled);
      }
    });
  }

  /**
   * Triggers Contentful SDK asset navigator/uploader
   * @param  {object} editor
   * @return {null}
   */
  function uploadAsset( editor ) {
     api.navigator.openNewAsset( { slideIn: { waitForClose: true } }).then(({ entity }) => {

      if ( isEmpty( entity.fields ) ) {

        // Delete empty asset if created but not uploaded
        api.space.deleteAsset(entity);

      } else {

        // Auto publish
        api.space.publishAsset(entity);

        // Get file details
        var file = entity.fields.file,
            contentType = file[locale].contentType,
            type = contentType.split('/')[0],
            title = entity.fields.title[locale],
            url = 'https:' + file[locale].url
            content = '';

        // Return html based on file type
        switch (type) {
          case 'image':
            var width = file[locale].details.image.width,
                height = file[locale].details.image.height,
                content = '<img src="' + url + '" title="' + title + '" alt="' + title + '" width="' + width + '" height="' + height + '" />';
            break;
          case 'video':
            content += '<div style="max-width: 650px;" data-ephox-embed-iri="' + url + '">';
            content += '<video style="width: 100%;" controls="controls">';
            content += '<source src="' + url + '" type="' + contentType + '">';
            content += 'Your browser does not support the video element.';
            content += '</video></div>';
            break;
          case 'audio':
            content += '<div style="max-width: 650px;" data-ephox-embed-iri="' + url + '">';
            content += '<audio style="width: 100%;" controls="controls">';
            content += '<source src="' + url + '" type="' + contentType + '">';
            content += 'Your browser does not support the audio element.';
            content += '</audio></div>';
            break;
          default:
            content = '<a href="' + url + '" title="' + title + '">' + title + '</a>';
            break;
        }

        // Insert into TinyMCE
        editor.insertContent(content);

      }

    })
  }

  /**
   * Using TinyMCE insert browser hook to call Contenful asset navigator
   * @param  {function} callback
   * @param  {string|null}   value
   * @param  {object}   meta
   * @return {object}
   */
  function browseAssets( callback, value, meta ) {

      // Provide file and text for the link dialog
      if ( meta.filetype == 'file' ) {
        api.dialogs
          .selectSingleAsset()
          .then( selectedEntry => {
            var file = selectedEntry.fields.file,
                title = selectedEntry.fields.title[locale],
                url = 'https:' + file[locale].url;
            callback( url, { text: title, title: title } );
          })
      }

      // Provide image, title and alt text for the image dialog
      if ( meta.filetype == 'image' ) {
        api.dialogs
          .selectSingleAsset()
          .then( selectedEntry => {
            var file = selectedEntry.fields.file,
                title = selectedEntry.fields.title[locale],
                url = 'https:' + file[locale].url;
            callback( url, { alt: title, title: title } ); // Optional: class attribute
          })
      }

      // Provide alternative source and posted for the media dialog
      if ( meta.filetype == 'media' ) {
        api.dialogs
          .selectSingleAsset()
          .then(selectedEntry => {
            var file = selectedEntry.fields.file,
                title = selectedEntry.fields.title[locale],
                url = 'https:' + file[locale].url;
            callback( url, { title: title, width: 200 });
          })
      }
  }  

  /**
   * Loader script for TinyMCE
   * @param  {string} src
   * @param  {event} onload
   * @return {null}
   */
  function loadScript(src, onload) {
    var script = document.createElement('script');
    script.setAttribute('src', src);
    script.onload = onload;
    document.body.appendChild(script);
  }

  // Set init vars
  var sub = location.host == "contentful.staging.tiny.cloud" ? "cloud-staging" : "cloud",
      apiKey = api.parameters.installation.apiKey,
      channel = api.parameters.installation.channel,
      tinymceUrl = "https://" + sub + ".tinymce.com/" + channel + "/tinymce.min.js?apiKey=" + apiKey;

  // Init
  loadScript(tinymceUrl, function() {
    tinymceForContentful(api);
  });

});

/**
 * Evaluate if object is empty
 * @param  {object}  obj
 * @return {boolean}
 */
function isEmpty(obj) {
    for(var key in obj) {
        if(obj.hasOwnProperty(key))
            return false;
    }
    return true;
}
