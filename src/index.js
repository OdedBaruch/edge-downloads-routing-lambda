const path = require('path');
const IT_DOWNLOADS_PATH_PREFIX = '/downloads';
const IT_DOWNLOADS_PATH_INDEX = IT_DOWNLOADS_PATH_PREFIX.split("/").length;

exports.handler = async(event, context) => {

    const request = event.Records[0].cf.request;
    const environment = request.origin.s3.customHeaders["x-environment"][0].value;
    const index_env = 'index-' + environment + '.json';

    try {

        if (request.uri.startsWith(IT_DOWNLOADS_PATH_PREFIX)) {
            const parsedPath = path.parse(request.uri);
            let replacementUri;
            let splitPaths = request.uri.split("/");
            let basePath = path.join(IT_DOWNLOADS_PATH_PREFIX, '/', splitPaths[IT_DOWNLOADS_PATH_INDEX]);
            if (parsedPath.ext === '') {
                replacementUri = path.join(basePath, '/', index_env);
            } else {
                replacementUri = request.uri;
            }
            // Replace the received URI with the URI that includes the index page
            request.uri = replacementUri;
            return request;
        } else {
            request.uri = IT_DOWNLOADS_PATH_PREFIX + '/default/' + index_env;
            return request;
        }
    } catch (error) {
        /*
          if something is terribly wrong above, still let the request flow through.
        */
        console.log(error);
        return request;
    }
};